import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { CodedError } from "./coded-error";
import { exportClips, indexedKeyframes, parseKeyframes } from "./export-clips";

const mocks = vi.hoisted(() => ({
  runtime: {
    load: vi.fn(async () => true), on: vi.fn(), terminate: vi.fn(),
    createDir: vi.fn(async () => true), mount: vi.fn(async () => true),
    unmount: vi.fn(async () => true), deleteFile: vi.fn(async () => true),
    writeFile: vi.fn(async () => true), ffprobe: vi.fn(async () => 0),
    exec: vi.fn(async () => 0), readFile: vi.fn<(path: string) => Promise<string | Uint8Array>>(),
  },
}));

vi.mock("./ffmpeg-runtime", () => ({
  createClipRuntime: async () => mocks.runtime,
  clipRuntimeURLs: () => ({ coreURL: "/ffmpeg/ffmpeg-core.js" }),
}));

beforeEach(() => {
  vi.clearAllMocks();
  mocks.runtime.load.mockImplementation(async () => true);
  mocks.runtime.exec.mockImplementation(async () => 0);
  mocks.runtime.readFile.mockImplementation(async (path) => {
    if (path === "packets.txt") return "pts_time=0.000000|dts_time=-0.083333|flags=K_\npts_time=2.000000|dts_time=1.916667|flags=K_";
    if (path.endsWith(".json")) return JSON.stringify({
      streams: [{ index: 0, codec_type: "video", codec_name: "h264", time_base: "1/12288" }],
      format: { start_time: "0", duration: "2" },
    });
    return new Uint8Array([1, 2, 3]);
  });
});
afterEach(() => vi.useRealTimers());

function options(signal = new AbortController().signal) {
  const file = new File(["source"], "source.mp4", { type: "video/mp4" });
  Object.defineProperty(file, "arrayBuffer", { value: vi.fn(() => { throw new Error("Must mount the source instead of buffering it"); }) });
  return { file, duration: 4, ranges: [{ start_seconds: 0.5, end_seconds: 1 }], signal, onProgress: vi.fn() };
}

describe("local clip export resource lifecycle", () => {
  it("mounts a File, returns the download, and frees the worker on success", async () => {
    const input = options();
    const result = await exportClips(input);
    expect(result.blob.size).toBe(3);
    expect(result.ranges).toEqual([{ start_seconds: 0, end_seconds: 2 }]);
    expect(input.file.arrayBuffer).not.toHaveBeenCalled();
    expect(mocks.runtime.mount).toHaveBeenCalledWith("WORKERFS", { blobs: [{ name: "input.mp4", data: input.file }] }, "/source");
    expect(mocks.runtime.unmount).toHaveBeenCalledWith("/source");
    expect(mocks.runtime.terminate).toHaveBeenCalled();
  });

  it("does not load a worker for empty selection or an already cancelled export", async () => {
    await expect(exportClips({ ...options(), ranges: [] })).rejects.toThrow("exportEmptySelection");
    const controller = new AbortController();
    controller.abort();
    await expect(exportClips(options(controller.signal))).rejects.toMatchObject({ name: "AbortError" });
    expect(mocks.runtime.load).not.toHaveBeenCalled();
  });

  it("accepts the pinned core's -1 ffprobe status only with validated output", async () => {
    mocks.runtime.ffprobe.mockResolvedValueOnce(-1);
    await expect(exportClips(options())).resolves.toMatchObject({ ranges: [{ start_seconds: 0, end_seconds: 2 }] });
    mocks.runtime.readFile.mockResolvedValueOnce('{"streams":[],"format":{},"error":{"code":-1}}');
    await expect(exportClips(options())).rejects.toThrow("exportInvalidTimeline");
  });

  it("cancels a pending worker load immediately and frees resources", async () => {
    mocks.runtime.load.mockImplementation(() => new Promise(() => {}));
    const controller = new AbortController();
    const pending = exportClips(options(controller.signal));
    const cancelled = expect(pending).rejects.toMatchObject({ name: "AbortError" });
    await vi.waitFor(() => expect(mocks.runtime.load).toHaveBeenCalled());
    controller.abort();
    await cancelled;
    expect(mocks.runtime.terminate).toHaveBeenCalled();
    expect(mocks.runtime.mount).not.toHaveBeenCalled();
  });

  it("reports copy failures and memory exhaustion without falling back to encoding", async () => {
    mocks.runtime.exec.mockResolvedValueOnce(1);
    await expect(exportClips(options())).rejects.toThrow("exportUnsupported");
    expect(mocks.runtime.terminate).toHaveBeenCalled();
    mocks.runtime.exec.mockRejectedValueOnce(new Error("memory access out of bounds"));
    await expect(exportClips(options())).rejects.toThrow("exportMemory");
  });

  it("bounds worker hangs and always terminates the session", async () => {
    vi.useFakeTimers();
    mocks.runtime.load.mockImplementation(() => new Promise(() => {}));
    const pending = exportClips(options());
    const timeout = expect(pending).rejects.toThrow("exportTimeout");
    await vi.advanceTimersByTimeAsync(180_000);
    await timeout;
    expect(mocks.runtime.terminate).toHaveBeenCalled();
  });

  it("reads keyframe PTS and DTS relative to the source origin, and rejects missing timestamps", () => {
    expect(parseKeyframes("pts_time=10|dts_time=9.9|flags=K_\npts_time=11|dts_time=10.9|flags=__", 10))
      .toEqual([{ pts_seconds: 0, dts_seconds: -0.09999999999999964 }]);
    expect(() => parseKeyframes("pts_time=N/A|dts_time=N/A|flags=K_", 0)).toThrow(CodedError);
    expect(() => parseKeyframes("", 0)).toThrow("exportInvalidTimeline");
  });

  it("uses indexed decode timestamps and rejects open GOPs or backward decode times", () => {
    const samples = [
      { pts: 0, dts: -0.08, sync: true, size: 10, offset: 0 },
      { pts: 0.12, dts: -0.04, sync: false, size: 10, offset: 10 },
      { pts: 0.04, dts: 0, sync: false, size: 10, offset: 20 },
      { pts: 2, dts: 1.92, sync: true, size: 10, offset: 30 },
    ];
    expect(indexedKeyframes(samples, 0)).toEqual([{ pts_seconds: 0, dts_seconds: -0.08 }, { pts_seconds: 2, dts_seconds: 1.92 }]);
    expect(() => indexedKeyframes([...samples, { ...samples[1], pts: 1.96, dts: 1.96 }], 0)).toThrow("exportInvalidTimeline");
    expect(() => indexedKeyframes([...samples, { ...samples[1], pts: 2.1, dts: 1 }], 0)).toThrow("exportInvalidTimeline");
  });
});
