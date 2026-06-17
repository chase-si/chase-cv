import { getPalette } from "colorthief";

import {
  EXTRACTED_PALETTE_COLOR_COUNT,
  normalizeColorthiefPalette,
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
  const palette = await getPalette(image, {
    colorCount: EXTRACTED_PALETTE_COLOR_COUNT,
    ignoreWhite: false,
  });
  return normalizeColorthiefPalette(palette);
}
