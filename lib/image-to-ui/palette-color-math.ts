export type RgbColor = {
  r: number;
  g: number;
  b: number;
};

export function normalizeHexColor(hex: string): string {
  const trimmed = hex.trim();
  const withHash = trimmed.startsWith("#") ? trimmed : `#${trimmed}`;
  if (!/^#[\da-fA-F]{6}$/.test(withHash)) {
    throw new Error(`Unsupported color format: ${hex}`);
  }
  return withHash.toUpperCase();
}

export function parseHexToRgb(hex: string): RgbColor {
  const normalizedHex = normalizeHexColor(hex).slice(1);
  return {
    r: parseInt(normalizedHex.slice(0, 2), 16),
    g: parseInt(normalizedHex.slice(2, 4), 16),
    b: parseInt(normalizedHex.slice(4, 6), 16),
  };
}

export function toRelativeLuminance(color: RgbColor): number {
  const normalized = [color.r, color.g, color.b].map((channel) => {
    const value = channel / 255;
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });

  return 0.2126 * normalized[0] + 0.7152 * normalized[1] + 0.0722 * normalized[2];
}

export function getContrastRatio(a: RgbColor, b: RgbColor): number {
  const lighter = Math.max(toRelativeLuminance(a), toRelativeLuminance(b));
  const darker = Math.min(toRelativeLuminance(a), toRelativeLuminance(b));
  return (lighter + 0.05) / (darker + 0.05);
}

/** HSL saturation in 0–1. */
export function getSaturation(color: RgbColor): number {
  const r = color.r / 255;
  const g = color.g / 255;
  const b = color.b / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  if (delta === 0) {
    return 0;
  }
  const lightness = (max + min) / 2;
  return delta / (1 - Math.abs(2 * lightness - 1));
}
