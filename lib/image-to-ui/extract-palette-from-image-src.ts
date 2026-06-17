import { getColorSync, getPaletteSync } from "colorthief";

import {
  EXTRACTED_PALETTE_COLOR_COUNT,
  mergeColorthiefDominantAndPalette,
} from "@/lib/image-to-ui/normalize-dominant-palette";

function loadImageElement(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.decoding = "async";
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    image.src = src;
  });
}

export async function extractPaletteFromImageSrc(src: string) {
  const image = await loadImageElement(src);
  const dominant = getColorSync(image, { ignoreWhite: false });
  const palette = getPaletteSync(image, {
    colorCount: EXTRACTED_PALETTE_COLOR_COUNT,
    ignoreWhite: false,
  });
  return mergeColorthiefDominantAndPalette(dominant, palette);
}
