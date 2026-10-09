import {
  AnalysisRun,
  throttleProgress,
  type AnalysisProgress,
  type AnalysisResult,
  type ReferenceEmbedding,
} from "./analysis-run";
import { CodedError } from "./coded-error";
import { FaceSession } from "./face-client";
import { fitAnalysisSize } from "./frame-size";
import type { ExecutionProviderName } from "./model-options";

export type { AnalysisProgress, AnalysisResult, ReferenceEmbedding, Segment } from "./analysis-run";

export function logAnalysis(
  provider: ExecutionProviderName,
  sampled: number,
  wallMs: number,
  decodeMs: number,
  inferMs: number,
  decoder: "sequential" | "seek",
) {
  const name = provider === "webgpu" ? "WebGPU" : "WASM";
  console.info(
    `[find-in-video] ${name} ${decoder}, sampled ${sampled} frames, ${(wallMs / 1000).toFixed(2)}s total (decode wait ${(decodeMs / 1000).toFixed(2)}s, infer ${(inferMs / 1000).toFixed(2)}s, overlapping)`,
  );
}

function waitFor(video: HTMLVideoElement, event: "loadeddata" | "seeked", signal: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    const timer = window.setTimeout(() => done(new CodedError("decodeTimeout")), 30000);
    const done = (error?: Error) => {
      window.clearTimeout(timer);
      video.removeEventListener(event, onReady);
      video.removeEventListener("error", onError);
      signal.removeEventListener("abort", onAbort);
      if (error) reject(error);
      else resolve();
    };
    const onReady = () => done();
    const onError = () => done(new CodedError("videoUndecodable"));
    const onAbort = () => done(new DOMException("analysisCancelled", "AbortError"));
    video.addEventListener(event, onReady, { once: true });
    video.addEventListener("error", onError, { once: true });
    signal.addEventListener("abort", onAbort, { once: true });
    if (signal.aborted) onAbort();
  });
}

async function analyzeWithSeek(
  file: File,
  url: string,
  id: string,
  duration: number,
  references: ReferenceEmbedding[],
  session: FaceSession,
  signal: AbortSignal,
  onProgress: (progress: AnalysisProgress) => void,
) {
  const video = document.createElement("video");
  video.muted = true;
  video.preload = "auto";
  video.playsInline = true;
  video.style.cssText =
    "position:fixed;width:1px;height:1px;left:-100px;top:-100px;pointer-events:none";
  document.body.append(video);
  const run = new AnalysisRun(references, session.matchThreshold, true);
  const report = throttleProgress(onProgress);
  let decodeMs = 0;
  let inferMs = 0;
  const started = performance.now();
  try {
    const loaded = waitFor(video, "loadeddata", signal);
    video.src = url;
    await loaded;
    const fitted = fitAnalysisSize(video.videoWidth, video.videoHeight);
    const canvas = document.createElement("canvas");
    canvas.width = fitted.width;
    canvas.height = fitted.height;
    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (!context) throw new CodedError("noCanvas");
    const lastSecond = Math.floor(Math.min(duration, video.duration) - 0.001);
    if (lastSecond < 0) throw new CodedError("noFramesNamed", { name: file.name });
    let pending: {
      second: number;
      done: Promise<{ faces: { embedding: Float32Array; noseRatio: number | null }[]; inferMs: number }>;
    } | null = null;
    for (let second = 0; second <= lastSecond; second++) {
      if (signal.aborted) throw new DOMException("analysisCancelled", "AbortError");
      const decodeStarted = performance.now();
      const seeked = waitFor(video, "seeked", signal);
      video.currentTime = Math.min(second + 0.5, video.duration - 0.01);
      await seeked;
      context.drawImage(video, 0, 0, fitted.width, fitted.height);
      const bitmap = await createImageBitmap(canvas);
      decodeMs += performance.now() - decodeStarted;
      if (pending) {
        const done = await pending.done;
        inferMs += done.inferMs;
        run.add(pending.second, done.faces);
        report(run.progress(duration, pending.second + 1));
      }
      pending = { second, done: session.observe(bitmap, fitted.width, fitted.height) };
    }
    if (pending) {
      const done = await pending.done;
      inferMs += done.inferMs;
      run.add(pending.second, done.faces);
      report(run.progress(duration, duration), true);
    }
    const wallMs = performance.now() - started;
    logAnalysis(session.provider, run.sampledFrames, wallMs, decodeMs, inferMs, "seek");
    return run.finish(id);
  } finally {
    video.pause();
    video.removeAttribute("src");
    video.load();
    video.remove();
  }
}

export async function analyzeVideo(
  file: File,
  url: string,
  id: string,
  duration: number,
  references: ReferenceEmbedding[],
  session: FaceSession,
  signal: AbortSignal,
  onProgress: (progress: AnalysisProgress) => void,
): Promise<AnalysisResult> {
  const onAbort = () => session.cancel();
  signal.addEventListener("abort", onAbort, { once: true });
  try {
    const sequential = await session.analyzeSequential(file, id, duration, references, onProgress);
    if (sequential) {
      logAnalysis(
        session.provider,
        sequential.result.sampled_frames,
        sequential.wallMs,
        sequential.decodeMs,
        sequential.inferMs,
        "sequential",
      );
      return sequential.result;
    }
    return await analyzeWithSeek(file, url, id, duration, references, session, signal, onProgress);
  } finally {
    signal.removeEventListener("abort", onAbort);
  }
}
