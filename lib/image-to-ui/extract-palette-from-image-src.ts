import { Vibrant } from "node-vibrant/browser";

import { normalizeVibrantPalette } from "@/lib/image-to-ui/normalize-vibrant-palette";

export async function extractPaletteFromImageSrc(src: string) {
  const palette = await Vibrant.from(src).getPalette();
  return normalizeVibrantPalette(palette);
}
