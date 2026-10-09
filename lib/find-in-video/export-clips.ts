import type { FFmpeg, FFFSType } from "@ffmpeg/ffmpeg";

import type { Segment } from "./analysis-run";
import { clipDownloadName, expandClipRanges, mergeClipRanges, type Keyframe } from "./clip-ranges";
import { CodedError } from "./coded-error";
import { clipRuntimeURLs, createClipRuntime } from "./ffmpeg-runtime";
import { readVideoTrack, type VideoSample } from "./mp4-track";

export type ExportProgress =
  | { stage: "loading" | "preparing" | "joining" | "download" }
  | { stage: "cutting"; completed: number; total: number };

export type ExportClipsOptions = {
  file: File;
  duration: number;
  ranges: Segment[];
  signal: AbortSignal;
  onProgress: (progress: ExportProgress) => void;
};

export type ExportClipsResult = { blob: Blob; ranges: Segment[] };

type ProbeStream = {
  index: number;
  codec_type: string;
  codec_name: string;
  time_base: string;
  disposition?: { attached_pic?: number };
};
type ProbeInfo = { streams: ProbeStream[]; format: { start_time?: string; duration?: string }; error?: unknown };
const operationTimeout = 180_000;

function cancelled() {
  return new DOMException("exportCancelled", "AbortError");
}

function parseProbe(text: string): ProbeInfo {
  try {
    const probe = JSON.parse(text) as ProbeInfo;
    if (!Array.isArray(probe.streams) || !probe.format || probe.error) throw new Error();
    return probe;
  } catch {
    throw new CodedError("exportInvalidTimeline");
  }
}

export function parseKeyframes(text: string, origin: number): Keyframe[] {
  const keys: Keyframe[] = [];
  let lastDts = -Infinity;
  let lastKeyPts = -Infinity;
  for (const line of text.split("\n")) {
    const values = Object.fromEntries(line.split("|").map((field) => field.split("=")));
    if (!values.flags) continue;
    const pts = Number(values.pts_time);
    const packetDts = Number(values.dts_time);
    if (!Number.isFinite(pts) || pts < lastKeyPts - 0.000001 ||
      (Number.isFinite(packetDts) && packetDts < lastDts - 0.000001)) {
      // Leading frames after a keyframe indicate an open GOP. Copying only
      // the preceding GOP could then lose frames at the selected boundary.
      throw new CodedError("exportInvalidTimeline");
    }
    if (Number.isFinite(packetDts)) lastDts = packetDts;
    if (!values.flags?.includes("K")) continue;
    // Some containers omit the first DTS; only that first packet can use PTS.
    const dts = values.dts_time === "N/A" && !keys.length ? pts : Number(values.dts_time);
    if (!Number.isFinite(pts) || !Number.isFinite(dts)) throw new CodedError("exportInvalidTimeline");
    keys.push({ pts_seconds: Math.max(0, pts - origin), dts_seconds: dts - origin });
    lastKeyPts = pts;
  }
  if (!keys.length) throw new CodedError("exportInvalidTimeline");
  return keys;
}

export function indexedKeyframes(samples: VideoSample[], origin: number): Keyframe[] {
  const keys: Keyframe[] = [];
  let lastDts = -Infinity;
  let lastKeyPts = -Infinity;
  for (const sample of samples) {
    if (!Number.isFinite(sample.pts) || !Number.isFinite(sample.dts) ||
      sample.dts < lastDts || sample.pts < lastKeyPts - 0.000001) throw new CodedError("exportInvalidTimeline");
    lastDts = sample.dts;
    if (sample.sync && sample.size > 0) {
      keys.push({ pts_seconds: Math.max(0, sample.pts - origin), dts_seconds: sample.dts - origin });
      lastKeyPts = sample.pts;
    }
  }
  if (!keys.length) throw new CodedError("exportInvalidTimeline");
  return keys;
}

/** Copy selected clips locally. The source is mounted, never read into an ArrayBuffer. */
export async function exportClips(options: ExportClipsOptions): Promise<ExportClipsResult> {
  const { file, duration, signal, onProgress } = options;
  const selected = mergeClipRanges(options.ranges, duration);
  if (!selected.length) throw new CodedError("exportEmptySelection");
  const extension = clipDownloadName(file.name, "person").split(".").at(-1)!;
  if (signal.aborted) throw cancelled();

  let runtime: FFmpeg | null = null;
  let timer: ReturnType<typeof setTimeout> | undefined;
  let timedOut = false;
  let stage: ExportProgress["stage"] = "loading";
  const logs: string[] = [];
  const abort = () => runtime?.terminate();
  signal.addEventListener("abort", abort, { once: true });

  // Terminating also rejects pending calls if a worker crashes without replying.
  const call = async <T>(operation: () => Promise<T>): Promise<T> => {
    if (signal.aborted) throw cancelled();
    let abortCall: () => void = () => {};
    const interruption = new Promise<never>((_, reject) => {
      abortCall = () => reject(cancelled());
      signal.addEventListener("abort", abortCall, { once: true });
      timer = setTimeout(() => {
        timedOut = true;
        runtime?.terminate();
        reject(new CodedError("exportTimeout"));
      }, operationTimeout);
    });
    try {
      return await Promise.race([operation(), interruption]);
    } finally {
      clearTimeout(timer);
      signal.removeEventListener("abort", abortCall);
    }
  };
  const report = (progress: ExportProgress) => {
    if (signal.aborted) throw cancelled();
    stage = progress.stage;
    onProgress(progress);
  };

  try {
    report({ stage: "loading" });
    runtime = await call(createClipRuntime);
    if (signal.aborted) throw cancelled();
    const ffmpeg = runtime;
    ffmpeg.on("log", ({ message }) => {
      logs.push(message);
      if (logs.length > 40) logs.shift();
    });
    await call(() => ffmpeg.load(clipRuntimeURLs()));
    report({ stage: "preparing" });
    await call(() => ffmpeg.createDir("/source"));
    const sourcePath = `/source/input.${extension}`;
    const mounted = await call(() => ffmpeg.mount("WORKERFS" as FFFSType, {
      blobs: [{ name: `input.${extension}`, data: file }],
    }, "/source"));
    if (!mounted) throw new CodedError("exportLoadFailed");

    const probe = async (input: string, output: string) => {
      const code = await call(() => ffmpeg.ffprobe([
        "-v", "error", "-show_error", "-show_streams", "-show_format", "-of", "json", input, "-o", output,
      ], operationTimeout));
      // core 0.12.10 can leave its return register at -1 on successful ffprobe
      // calls. Validate the output and its explicit error field as well.
      if (code !== 0 && code !== -1) throw new CodedError("exportUnsupported");
      const data = await call(() => ffmpeg.readFile(output, "utf8"));
      await call(() => ffmpeg.deleteFile(output));
      return parseProbe(String(data));
    };
    const info = await probe(sourcePath, "source.json");
    const video = info.streams.find((stream) => stream.codec_type === "video" && !stream.disposition?.attached_pic);
    const audio = info.streams.filter((stream) => stream.codec_type === "audio");
    const origin = Number(info.format.start_time ?? 0);
    if (!video?.codec_name || !video.time_base || !Number.isFinite(origin)) {
      throw new CodedError("exportInvalidTimeline");
    }
    let keys: Keyframe[] | null = null;
    const videos = info.streams.filter((stream) => stream.codec_type === "video" && !stream.disposition?.attached_pic);
    if (extension !== "mkv" && videos.length === 1 && ["h264", "hevc"].includes(video.codec_name)) {
      try {
        // Read just the movie sample tables, not every compressed packet.
        // This matters for large sources: WORKERFS avoids a full-file buffer,
        // but scanning every packet still allocates many FileReader buffers.
        const track = await call(() => readVideoTrack(file));
        if ((video.codec_name === "h264" && /^avc[13]\./.test(track.codec)) ||
          (video.codec_name === "hevc" && /^(hvc1|hev1)\./.test(track.codec))) {
          keys = indexedKeyframes(track.samples, origin);
        }
      } catch (failure) {
        if (signal.aborted || failure instanceof CodedError) throw failure;
        // Fragmented or unsupported movie tables can use the FFprobe path.
      }
    }
    if (!keys) {
      const keyCode = await call(() => ffmpeg.ffprobe([
        "-v", "error", "-select_streams", String(video.index), "-show_packets",
        "-show_entries", "packet=pts_time,dts_time,flags", "-of", "compact=p=0:nk=0",
        sourcePath, "-o", "packets.txt",
      ], operationTimeout));
      if (keyCode !== 0 && keyCode !== -1) throw new CodedError("exportInvalidTimeline");
      keys = parseKeyframes(String(await call(() => ffmpeg.readFile("packets.txt", "utf8"))), origin);
      await call(() => ffmpeg.deleteFile("packets.txt"));
    }
    const ranges = expandClipRanges(selected, keys, duration);
    const number = (value: number) => value.toFixed(6);
    const concat: string[] = ["ffconcat version 1.0"];

    for (const [index, range] of ranges.entries()) {
      report({ stage: "cutting", completed: index, total: ranges.length });
      const length = range.end_seconds - range.start_seconds;
      const endKey = keys.find((key) => Math.abs(key.pts_seconds - range.end_seconds) < 0.000001);
      // Cut video at the next keyframe's DTS, not PTS: otherwise B-frame
      // reordering can copy the next GOP into this clip and repeat its pictures.
      const videoLength = endKey ? endKey.dts_seconds - range.start_seconds : length;
      if (videoLength <= 0) throw new CodedError("exportInvalidTimeline");
      const clip = `clip-${index}.${extension}`;
      const args = ["-v", "warning", "-ss", number(range.start_seconds), "-t", number(videoLength), "-i", sourcePath];
      if (audio.length) {
        // Audio needs the full presentation interval, independently of video DTS.
        args.push("-ss", number(range.start_seconds), "-t", number(length), "-i", sourcePath);
      }
      args.push("-map", `0:${video.index}`);
      for (const stream of audio) args.push("-map", `1:${stream.index}`);
      args.push("-c", "copy", "-map_metadata", "0");
      if (audio.length) {
        // Discard audio seek preroll packets without decoding/re-encoding them.
        args.push("-bsf:a", "noise=drop=lt(pts\\,0)");
      }
      args.push("-avoid_negative_ts", "disabled", clip);
      if (await call(() => ffmpeg.exec(args, operationTimeout)) !== 0) {
        throw new CodedError("exportUnsupported");
      }
      concat.push(`file '${clip}'`, "inpoint 0", `duration ${number(length)}`);
      report({ stage: "cutting", completed: index + 1, total: ranges.length });
    }

    report({ stage: "joining" });
    await call(() => ffmpeg.writeFile("clips.ffconcat", concat.join("\n")));
    const output = `output.${extension}`;
    if (await call(() => ffmpeg.exec([
      "-v", "warning", "-f", "concat", "-safe", "0", "-i", "clips.ffconcat",
      "-map", "0:v:0", "-map", "0:a?", "-c", "copy", "-map_metadata", "0",
      "-avoid_negative_ts", "make_zero", output,
    ], operationTimeout)) !== 0) throw new CodedError("exportUnsupported");

    // Free intermediates before copying the final output back to the main thread.
    for (const index of ranges.keys()) await call(() => ffmpeg.deleteFile(`clip-${index}.${extension}`));
    await call(() => ffmpeg.deleteFile("clips.ffconcat"));
    await call(() => ffmpeg.unmount("/source"));
    const result = await probe(output, "output.json");
    if (result.streams.find((stream) => stream.codec_type === "video")?.codec_name !== video.codec_name ||
      result.streams.filter((stream) => stream.codec_type === "audio").length !== audio.length ||
      !Number.isFinite(Number(result.format.duration)) || Number(result.format.duration) <= 0) {
      throw new CodedError("exportInvalidTimeline");
    }
    report({ stage: "download" });
    const data = await call(() => ffmpeg.readFile(output));
    if (!(data instanceof Uint8Array) || !data.byteLength) throw new CodedError("exportFailed");
    const mime = extension === "mp4" ? "video/mp4" : extension === "mov" ? "video/quicktime" : "video/x-matroska";
    return { blob: new Blob([data as Uint8Array<ArrayBuffer>], { type: mime }), ranges };
  } catch (failure) {
    if (signal.aborted) throw cancelled();
    const message = `${String(failure)} ${logs.join(" ")}`;
    if (/out of memory|memory access out of bounds|allocation failed|cannot enlarge memory|bad_alloc/i.test(message)) {
      throw new CodedError("exportMemory");
    }
    if (timedOut) throw new CodedError("exportTimeout");
    if (failure instanceof CodedError) throw failure;
    throw new CodedError(stage === "loading" ? "exportLoadFailed" : "exportFailed");
  } finally {
    clearTimeout(timer);
    signal.removeEventListener("abort", abort);
    // This releases WASM memory, mounts and every temporary file on all exits.
    runtime?.terminate();
  }
}
