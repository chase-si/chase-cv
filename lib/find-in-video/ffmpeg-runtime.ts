import type { FFmpeg } from "@ffmpeg/ffmpeg";
import { ffmpegCoreBaseURL } from "./runtime-assets";

// Native module imports keep the upstream worker outside the Next.js bundle.
// The wrapper and its Worker stay same-origin; the core JS/WASM can use a CDN.
export async function createClipRuntime(): Promise<FFmpeg> {
  const url = new URL("/ffmpeg/index.js", window.location.origin).href;
  const { FFmpeg } = await import(/* webpackIgnore: true */ url) as typeof import("@ffmpeg/ffmpeg");
  return new FFmpeg();
}

export const clipRuntimeURLs = () => {
  const coreBase = ffmpegCoreBaseURL(window.location.origin);
  return {
    classWorkerURL: new URL("/ffmpeg/worker.js", window.location.origin).href,
    coreURL: `${coreBase}/ffmpeg-core.js`,
    wasmURL: `${coreBase}/ffmpeg-core.wasm`,
  };
};
