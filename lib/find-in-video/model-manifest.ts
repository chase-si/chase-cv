import { buffaloModel } from "@/lib/find-in-video/model-options";

import { CodedError } from "./coded-error";

export type ModelEntry = { bytes: number; sha256: string; parts: string[] };
export type ModelManifest = {
  variants: {
    buffalo_l: { models: Record<string, ModelEntry> };
  };
};

export async function readModelManifest(): Promise<ModelManifest> {
  const response = await fetch("/models/manifest.json", { cache: "no-cache" });
  if (!response.ok) throw new CodedError("missingManifest");
  const body = await response.text();
  let manifest: ModelManifest;
  try {
    manifest = JSON.parse(body) as ModelManifest;
  } catch {
    throw new CodedError("manifestNotJson");
  }

  for (const name of buffaloModel.files) {
    const entry = manifest?.variants?.buffalo_l?.models?.[name];
    if (
      !entry ||
      !Number.isSafeInteger(entry.bytes) ||
      entry.bytes <= 0 ||
      !/^[a-f0-9]{64}$/.test(entry.sha256) ||
      !Array.isArray(entry.parts) ||
      !entry.parts.length ||
      !entry.parts.every(
        (part) =>
          typeof part === "string" &&
          part.startsWith("buffalo_l/") &&
          !part.includes(".."),
      )
    ) {
      throw new CodedError("manifestIncomplete", { name });
    }
  }

  return manifest;
}
