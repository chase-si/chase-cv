import { afterEach, expect, it, vi } from "vitest";

import { dependencies } from "@/package.json";
import { clipRuntimeURLs } from "./ffmpeg-runtime";
import { modelAssetBaseURL, onnxRuntimeBaseURL } from "./runtime-assets";

afterEach(() => vi.unstubAllEnvs());

it("uses same-origin runtime files when the CDN is not configured", () => {
  vi.stubEnv("NEXT_PUBLIC_FIND_IN_VIDEO_ASSET_BASE_URL", "");
  expect(modelAssetBaseURL()).toBe("/models");
  expect(onnxRuntimeBaseURL(window.location.origin)).toBe(`${window.location.origin}/onnx/`);
  expect(clipRuntimeURLs()).toEqual({
    classWorkerURL: `${window.location.origin}/ffmpeg/worker.js`,
    coreURL: `${window.location.origin}/ffmpeg/ffmpeg-core.js`,
    wasmURL: `${window.location.origin}/ffmpeg/ffmpeg-core.wasm`,
  });
});

it("shares one CDN root for models and runtimes while keeping the FFmpeg Worker same-origin", () => {
  vi.stubEnv("NEXT_PUBLIC_FIND_IN_VIDEO_ASSET_BASE_URL", " https://assets.example.com/// ");
  expect(modelAssetBaseURL()).toBe("https://assets.example.com");
  expect(onnxRuntimeBaseURL(window.location.origin)).toBe(
    `https://assets.example.com/onnx/${dependencies["onnxruntime-web"]}/`,
  );
  expect(clipRuntimeURLs()).toEqual({
    classWorkerURL: `${window.location.origin}/ffmpeg/worker.js`,
    coreURL: `https://assets.example.com/ffmpeg/${dependencies["@ffmpeg/core"]}/ffmpeg-core.js`,
    wasmURL: `https://assets.example.com/ffmpeg/${dependencies["@ffmpeg/core"]}/ffmpeg-core.wasm`,
  });
});
