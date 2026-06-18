import type { Color } from "colorthief";

/** Number of palette colors requested from colorthief. */
export const EXTRACTED_PALETTE_COLOR_COUNT = 8;

export type DominantPaletteRole =
  | "Dominant1"
  | "Dominant2"
  | "Dominant3"
  | "Dominant4"
  | "Dominant5"
  | "Dominant6"
  | "Dominant7"
  | "Dominant8";

export type PaletteSwatch = {
  role: DominantPaletteRole;
  hex: string;
};

function normalizeHex(hex: string): string | null {
  const trimmed = hex.trim();
  if (!/^#[0-9A-Fa-f]{6}$/.test(trimmed)) {
    return null;
  }
  return trimmed.toUpperCase();
}

export function dominantPaletteRoleForIndex(index: number): DominantPaletteRole {
  const rank = index + 1;
  if (rank < 1 || rank > EXTRACTED_PALETTE_COLOR_COUNT) {
    throw new Error(`Dominant palette rank out of range: ${rank}`);
  }
  return `Dominant${rank}` as DominantPaletteRole;
}

type NormalizeColorthiefPaletteOptions = {
  maxSwatches?: number;
};

/** Maps colorthief palette output to ordered swatches (dominance order preserved). */
export function normalizeColorthiefPalette(
  colors: Color[] | null,
  options: NormalizeColorthiefPaletteOptions = {},
): PaletteSwatch[] {
  const maxSwatches = options.maxSwatches ?? EXTRACTED_PALETTE_COLOR_COUNT;
  if (!colors?.length) {
    return [];
  }

  const swatches: PaletteSwatch[] = [];
  const seenHex = new Set<string>();

  for (const color of colors) {
    const hex = normalizeHex(color.hex());
    if (!hex || seenHex.has(hex)) {
      continue;
    }
    seenHex.add(hex);
    swatches.push({
      role: dominantPaletteRoleForIndex(swatches.length),
      hex,
    });
    if (swatches.length >= maxSwatches) {
      break;
    }
  }

  return swatches;
}
