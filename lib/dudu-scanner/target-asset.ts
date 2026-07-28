import {
  getTargetRecord,
  type DuduScannerTargetId,
} from "@/lib/dudu-scanner/catalog";

/** @deprecated Use per-target `placeholderSrc` via `resolveTargetDisplaySrc`. */
export const DUDU_SCANNER_SHARED_CHARACTER_FALLBACK_SRC =
  "/dudu-scanner/placeholders/fry-sprite.svg";

const loadedTargetImages = new Map<string, HTMLImageElement>();

export function getCachedTargetImage(src: string): HTMLImageElement | undefined {
  return loadedTargetImages.get(src);
}

/** Clears in-memory preload cache (tests only). */
export function resetTargetImageCacheForTests() {
  loadedTargetImages.clear();
}

export function resolveTargetDisplaySrc(
  targetId: DuduScannerTargetId,
  useFallback: boolean,
): string {
  const record = getTargetRecord(targetId);
  if (useFallback) {
    return record.placeholderSrc;
  }
  return record.imageSrc;
}

export async function prepareTargetRoundAsset(targetId: DuduScannerTargetId): Promise<{
  targetId: DuduScannerTargetId;
  displaySrc: string;
  productionLoaded: boolean;
}> {
  const { imageSrc, placeholderSrc } = getTargetRecord(targetId);
  const productionLoaded = await preloadTargetImage(imageSrc);
  const displaySrc = productionLoaded ? imageSrc : placeholderSrc;
  if (!productionLoaded) {
    await preloadTargetImage(displaySrc);
  }
  return { targetId, displaySrc, productionLoaded };
}

export function preloadTargetImage(src: string): Promise<boolean> {
  if (typeof Image === "undefined") {
    return Promise.resolve(true);
  }

  if (loadedTargetImages.has(src)) {
    return Promise.resolve(true);
  }

  return new Promise((resolve) => {
    const image = new Image();
    image.onload = () => {
      loadedTargetImages.set(src, image);
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
