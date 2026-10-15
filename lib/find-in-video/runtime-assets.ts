import { dependencies } from "@/package.json";

function assetCdnBase() {
  return process.env.NEXT_PUBLIC_FIND_IN_VIDEO_ASSET_BASE_URL?.trim().replace(/\/+$/, "");
}

export function modelAssetBaseURL() {
  return assetCdnBase() || "/models";
}

export function onnxRuntimeBaseURL(origin: string) {
  const cdn = assetCdnBase();
  return cdn
    ? `${cdn}/onnx/${dependencies["onnxruntime-web"]}/`
    : `${origin}/onnx/`;
}

export function ffmpegCoreBaseURL(origin: string) {
  const cdn = assetCdnBase();
  return cdn
    ? `${cdn}/ffmpeg/${dependencies["@ffmpeg/core"]}`
    : `${origin}/ffmpeg`;
}
