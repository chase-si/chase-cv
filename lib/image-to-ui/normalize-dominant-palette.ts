import type { Color } from "colorthief";

/** Number of palette colors requested from colorthief. */
export const EXTRACTED_PALETTE_COLOR_COUNT = 10;

export type DominantPaletteRole =
  | "Dominant1"
  | "Dominant2"
  | "Dominant3"
  | "Dominant4"
  | "Dominant5"
  | "Dominant6"
  | "Dominant7"
  | "Dominant8"
  | "Dominant9"
  | "Dominant10";

export type PaletteSwatch = {
  role: DominantPaletteRole;
  hex: string;
  /** Share of sampled pixels (0–1) from colorthief. */
  proportion: number;
};

/** Formats a swatch proportion for display (e.g. `12.5%`). */
export function formatPaletteProportionPercent(proportion: number): string {
  const percent = proportion * 100;
  if (percent >= 10) {
    return `${Math.round(percent)}%`;
  }
  return `${percent.toFixed(1)}%`;
}

function addPaletteProportions(current: number, delta: number): number {
  return Math.round((current + delta) * 10_000) / 10_000;
}

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
  const proportionByHex = new Map<string, number>();

  for (const color of colors) {
    const hex = normalizeHex(color.hex());
    if (!hex) {
      continue;
    }
    const nextProportion = addPaletteProportions(
      proportionByHex.get(hex) ?? 0,
      color.proportion ?? 0,
    );
    proportionByHex.set(hex, nextProportion);

    const existingIndex = swatches.findIndex((swatch) => swatch.hex === hex);
    if (existingIndex >= 0) {
      swatches[existingIndex] = {
        ...swatches[existingIndex],
        proportion: nextProportion,
      };
      continue;
    }

    swatches.push({
      role: dominantPaletteRoleForIndex(swatches.length),
      hex,
      proportion: nextProportion,
    });
    if (swatches.length >= maxSwatches) {
      break;
    }
  }

  return swatches;
}
