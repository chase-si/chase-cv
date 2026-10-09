import type { FFmpeg } from "@ffmpeg/ffmpeg";

// Native module imports keep the upstream worker outside the Next.js bundle.
// All modules and WASM are copied to public/ffmpeg by the dev/build script.
export async function createClipRuntime(): Promise<FFmpeg> {
  const url = new URL("/ffmpeg/index.js", window.location.origin).href;
  const { FFmpeg } = await import(/* webpackIgnore: true */ url) as typeof import("@ffmpeg/ffmpeg");
  return new FFmpeg();
}

export const clipRuntimeURLs = () => ({
  classWorkerURL: new URL("/ffmpeg/worker.js", window.location.origin).href,
  coreURL: new URL("/ffmpeg/ffmpeg-core.js", window.location.origin).href,
  wasmURL: new URL("/ffmpeg/ffmpeg-core.wasm", window.location.origin).href,
});
