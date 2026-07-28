import {
  getTargetRecord,
  type DuduScannerTargetId,
} from "@/lib/dudu-scanner/catalog";

/** Generic cartoon silhouette used when production raster art fails to load. */
export const DUDU_SCANNER_SHARED_CHARACTER_FALLBACK_SRC =
  "/dudu-scanner/placeholders/fry-sprite.svg";

export function resolveTargetDisplaySrc(
  targetId: DuduScannerTargetId,
  useFallback: boolean,
): string {
  if (useFallback) {
    return DUDU_SCANNER_SHARED_CHARACTER_FALLBACK_SRC;
  }
  return getTargetRecord(targetId).imageSrc;
}

export function preloadTargetImage(src: string): Promise<boolean> {
  if (typeof Image === "undefined") {
    return Promise.resolve(true);
  }

  return new Promise((resolve) => {
    const image = new Image();
    image.onload = () => {
      if ("decode" in image) {
        void image
          .decode()
          .then(() => resolve(true))
          .catch(() => resolve(true));
        return;
      }
      resolve(true);
    };
    image.onerror = () => resolve(false);
    image.src = src;
  });
}
