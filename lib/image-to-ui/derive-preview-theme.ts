type ThemeMode = "light" | "dark";

type RgbColor = {
  r: number;
  g: number;
  b: number;
};

const BLACK: RgbColor = { r: 0, g: 0, b: 0 };
const WHITE: RgbColor = { r: 255, g: 255, b: 255 };

const PREVIEW_THEME_TOKEN_KEYS = [
  "background",
  "foreground",
  "card",
  "card-foreground",
  "muted",
  "muted-foreground",
  "border",
  "input",
  "ring",
  "primary",
  "primary-foreground",
  "secondary",
  "secondary-foreground",
  "accent",
  "accent-foreground",
] as const;

export type PreviewThemeTokenKey = (typeof PREVIEW_THEME_TOKEN_KEYS)[number];

export type PreviewThemeTokens = Record<PreviewThemeTokenKey, string>;

export type DerivePreviewThemeTokensInput = {
  selectedColors: [string, string, string] | string[];
  mode: ThemeMode;
};

function clampColorChannel(value: number): number {
  return Math.max(0, Math.min(255, Math.round(value)));
}

function parseHexToRgb(hex: string): RgbColor {
  const normalizedHex = hex.trim().replace("#", "");
  if (!/^[\da-fA-F]{6}$/.test(normalizedHex)) {
    throw new Error(`Unsupported color format: ${hex}`);
  }

  return {
    r: parseInt(normalizedHex.slice(0, 2), 16),
    g: parseInt(normalizedHex.slice(2, 4), 16),
    b: parseInt(normalizedHex.slice(4, 6), 16),
  };
}

function toRgbCss(color: RgbColor): string {
  return `rgb(${clampColorChannel(color.r)}, ${clampColorChannel(color.g)}, ${clampColorChannel(color.b)})`;
}

function mixColor(a: RgbColor, b: RgbColor, weightToB: number): RgbColor {
  const weight = Math.max(0, Math.min(1, weightToB));
  return {
    r: a.r + (b.r - a.r) * weight,
    g: a.g + (b.g - a.g) * weight,
    b: a.b + (b.b - a.b) * weight,
  };
}

function toRelativeLuminance(color: RgbColor): number {
  const normalized = [color.r, color.g, color.b].map((channel) => {
    const value = channel / 255;
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });

  return 0.2126 * normalized[0] + 0.7152 * normalized[1] + 0.0722 * normalized[2];
}

function getContrastRatio(a: RgbColor, b: RgbColor): number {
  const lighter = Math.max(toRelativeLuminance(a), toRelativeLuminance(b));
  const darker = Math.min(toRelativeLuminance(a), toRelativeLuminance(b));
  return (lighter + 0.05) / (darker + 0.05);
}

function pickReadableForeground(background: RgbColor): RgbColor {
  const blackContrast = getContrastRatio(background, BLACK);
  const whiteContrast = getContrastRatio(background, WHITE);
  return whiteContrast >= blackContrast ? WHITE : BLACK;
}

function ensureThreeSelectedColors(
  selectedColors: DerivePreviewThemeTokensInput["selectedColors"],
): [string, string, string] {
  if (selectedColors.length < 3) {
    throw new Error("Three selected colors are required to derive preview theme tokens");
  }
  return [selectedColors[0], selectedColors[1], selectedColors[2]];
}

export function derivePreviewThemeTokens({
  selectedColors,
  mode,
}: DerivePreviewThemeTokensInput): PreviewThemeTokens {
  const [primaryHex, secondaryHex, accentHex] = ensureThreeSelectedColors(selectedColors);

  const primary = parseHexToRgb(primaryHex);
  const secondary = parseHexToRgb(secondaryHex);
  const accent = parseHexToRgb(accentHex);
  const neutralSeed = mixColor(primary, secondary, 0.5);

  const background =
    mode === "dark" ? mixColor(neutralSeed, BLACK, 0.86) : mixColor(neutralSeed, WHITE, 0.94);
  const card = mode === "dark" ? mixColor(neutralSeed, BLACK, 0.8) : mixColor(neutralSeed, WHITE, 0.9);
  const muted = mode === "dark" ? mixColor(neutralSeed, BLACK, 0.72) : mixColor(neutralSeed, WHITE, 0.84);
  const border =
    mode === "dark" ? mixColor(accent, BLACK, 0.62) : mixColor(mixColor(primary, secondary, 0.5), WHITE, 0.72);
  const ring = accent;

  return {
    background: toRgbCss(background),
    foreground: toRgbCss(pickReadableForeground(background)),
    card: toRgbCss(card),
    "card-foreground": toRgbCss(pickReadableForeground(card)),
    muted: toRgbCss(muted),
    "muted-foreground": toRgbCss(pickReadableForeground(muted)),
    border: toRgbCss(border),
    input: toRgbCss(card),
    ring: toRgbCss(ring),
    primary: toRgbCss(primary),
    "primary-foreground": toRgbCss(pickReadableForeground(primary)),
    secondary: toRgbCss(secondary),
    "secondary-foreground": toRgbCss(pickReadableForeground(secondary)),
    accent: toRgbCss(accent),
    "accent-foreground": toRgbCss(pickReadableForeground(accent)),
  };
}

export function buildScopedPreviewThemeCssVariables(
  tokens: PreviewThemeTokens,
): Record<`--${PreviewThemeTokenKey}`, string> {
  return PREVIEW_THEME_TOKEN_KEYS.reduce(
    (variables, key) => {
      variables[`--${key}`] = tokens[key];
      return variables;
    },
    {} as Record<`--${PreviewThemeTokenKey}`, string>,
  );
}

function parseRgbCss(color: string): RgbColor {
  const match = color
    .trim()
    .match(/^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/);
  if (!match) {
    throw new Error(`Unsupported rgb color: ${color}`);
  }
  return {
    r: Number(match[1]),
    g: Number(match[2]),
    b: Number(match[3]),
  };
}

export function hasReadableContrast(backgroundColor: string, foregroundColor: string): boolean {
  const ratio = getContrastRatio(parseRgbCss(backgroundColor), parseRgbCss(foregroundColor));
  return ratio >= 4.5;
}
