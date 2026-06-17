import type { Palette } from "@vibrant/color";

export const STANDARD_PALETTE_ROLES = [
  "Vibrant",
  "Muted",
  "DarkVibrant",
  "DarkMuted",
  "LightVibrant",
  "LightMuted",
] as const;

export type StandardPaletteRole = (typeof STANDARD_PALETTE_ROLES)[number];

export type PaletteSwatch = {
  role: StandardPaletteRole;
  hex: string;
};

function normalizeHex(hex: string): string | null {
  const trimmed = hex.trim();
  if (!/^#[0-9A-Fa-f]{6}$/.test(trimmed)) {
    return null;
  }
  return trimmed.toUpperCase();
}

export function normalizeVibrantPalette(palette: Palette): PaletteSwatch[] {
  const swatches: PaletteSwatch[] = [];

  for (const role of STANDARD_PALETTE_ROLES) {
    const swatch = palette[role];
    if (!swatch) {
      continue;
    }
    const hex = normalizeHex(swatch.hex);
    if (!hex) {
      continue;
    }
    swatches.push({ role, hex });
  }

  return swatches;
}
