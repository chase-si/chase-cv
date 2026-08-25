export const DUDU_SCANNER_CUSTOM_LIBRARY_MAX = 6;
export const DUDU_SCANNER_CUSTOM_ASSET_MAX_BYTES = 2 * 1024 * 1024;

export type DuduScannerCustomIngestSkipReason = "type" | "size" | "capacity" | "heic-failed";

export type DuduScannerCustomIngestedAsset = {
  id: string;
  blob: Blob;
  mimeType: string;
};

export type DuduScannerCustomIngestResult = {
  accepted: DuduScannerCustomIngestedAsset[];
  skipped: { name: string; reason: DuduScannerCustomIngestSkipReason }[];
};

export type HeicToJpegConverter = (file: File) => Promise<Blob>;

export function isHeicLikeFile(file: File): boolean {
  const type = file.type.toLowerCase();
  const name = file.name.toLowerCase();
  return (
    type === "image/heic" ||
    type === "image/heif" ||
    name.endsWith(".heic") ||
    name.endsWith(".heif")
  );
}

export function isDirectlyAcceptedImageType(file: File): boolean {
  const type = file.type.toLowerCase();
  return type === "image/png" || type === "image/jpeg" || type === "image/webp";
}

function createAssetId(createId: () => string): string {
  return createId();
}

export async function ingestCustomImageFiles(
  files: readonly File[],
  currentCount: number,
  convertHeic: HeicToJpegConverter,
  createId: () => string = () => crypto.randomUUID(),
): Promise<DuduScannerCustomIngestResult> {
  const accepted: DuduScannerCustomIngestedAsset[] = [];
  const skipped: DuduScannerCustomIngestResult["skipped"] = [];
  let remainingSlots = Math.max(0, DUDU_SCANNER_CUSTOM_LIBRARY_MAX - currentCount);

  for (const file of files) {
    if (remainingSlots <= 0) {
      skipped.push({ name: file.name, reason: "capacity" });
      continue;
    }

    let blob: Blob = file;
    let mimeType = file.type || "application/octet-stream";

    if (isHeicLikeFile(file)) {
      try {
        blob = await convertHeic(file);
        mimeType = blob.type || "image/jpeg";
      } catch {
        skipped.push({ name: file.name, reason: "heic-failed" });
        continue;
      }
    } else if (!isDirectlyAcceptedImageType(file)) {
      skipped.push({ name: file.name, reason: "type" });
      continue;
    }

    if (blob.size > DUDU_SCANNER_CUSTOM_ASSET_MAX_BYTES) {
      skipped.push({ name: file.name, reason: "size" });
      continue;
    }

    accepted.push({
      id: createAssetId(createId),
      blob,
      mimeType,
    });
    remainingSlots -= 1;
  }

  return { accepted, skipped };
}
