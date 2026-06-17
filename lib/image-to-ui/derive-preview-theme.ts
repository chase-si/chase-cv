type ThemeMode = "light" | "dark";

import { classifyPaletteThemeRoles } from "@/lib/image-to-ui/classify-palette-theme-roles";
import {
  getContrastRatio,
  parseHexToRgb,
  toRelativeLuminance,
  type RgbColor,
} from "@/lib/image-to-ui/palette-color-math";

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

const BLACK: RgbColor = { r: 0, g: 0, b: 0 };
const WHITE: RgbColor = { r: 255, g: 255, b: 255 };

export type PreviewThemeTokenKey = (typeof PREVIEW_THEME_TOKEN_KEYS)[number];

export type PreviewThemeTokens = Record<PreviewThemeTokenKey, string>;

export type DerivePreviewThemeTokensInput = {
  selectedColors: [string, string, string] | string[];
  mode: ThemeMode;
};

function clampColorChannel(value: number): number {
  return Math.max(0, Math.min(255, Math.round(value)));
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

function lightenColor(color: RgbColor, amount: number): RgbColor {
  return mixColor(color, WHITE, amount);
}

function darkenColor(color: RgbColor, amount: number): RgbColor {
  return mixColor(color, BLACK, amount);
}

function pickPaletteForegroundSeed(
  action: RgbColor,
  support: RgbColor,
  surface: RgbColor,
): RgbColor {
  const candidates = [darkenColor(action, 0.72), darkenColor(support, 0.78), darkenColor(surface, 0.9)];
  return candidates.reduce((darkest, candidate) =>
    toRelativeLuminance(candidate) < toRelativeLuminance(darkest) ? candidate : darkest,
  );
}

function pickReadableForeground(background: RgbColor): RgbColor {
  const blackContrast = getContrastRatio(background, BLACK);
  const whiteContrast = getContrastRatio(background, WHITE);
  return whiteContrast >= blackContrast ? WHITE : BLACK;
}

function ensureReadableAgainstBackground(candidate: RgbColor, background: RgbColor): RgbColor {
  if (getContrastRatio(background, candidate) >= 4.5) {
    return candidate;
  }
  return pickReadableForeground(background);
}

export function derivePreviewThemeTokens({
  selectedColors,
  mode,
}: DerivePreviewThemeTokensInput): PreviewThemeTokens {
  if (selectedColors.length < 3) {
    throw new Error("Three selected colors are required to derive preview theme tokens");
  }

  const { surfaceSeed, actionSeed, supportSeed } = classifyPaletteThemeRoles(selectedColors);

  const surface = parseHexToRgb(surfaceSeed);
  const action = parseHexToRgb(actionSeed);
  const support = parseHexToRgb(supportSeed);
  const neutralSeed = mixColor(surface, support, 0.5);
  const background =
    mode === "dark" ? darkenColor(surface, 0.82) : lightenColor(surface, 0.12);
  const foregroundSeed = pickPaletteForegroundSeed(action, support, surface);
  const foreground = ensureReadableAgainstBackground(foregroundSeed, background);
  const primaryRole = mode === "dark" ? lightenColor(action, 0.4) : action;
  const card = mode === "dark" ? darkenColor(surface, 0.62) : lightenColor(surface, 0.06);
  const muted = mode === "dark" ? darkenColor(neutralSeed, 0.72) : lightenColor(neutralSeed, 0.84);
  const border = mode === "dark" ? darkenColor(support, 0.5) : lightenColor(support, 0.58);
  const accentRole =
    mode === "dark" ? darkenColor(support, 0.28) : mixColor(support, background, 0.58);
  const ring = primaryRole;

  return {
    background: toRgbCss(background),
    foreground: toRgbCss(foreground),
    card: toRgbCss(card),
    "card-foreground": toRgbCss(ensureReadableAgainstBackground(foreground, card)),
    muted: toRgbCss(muted),
    "muted-foreground": toRgbCss(ensureReadableAgainstBackground(foreground, muted)),
    border: toRgbCss(border),
    input: toRgbCss(card),
    ring: toRgbCss(ring),
    primary: toRgbCss(primaryRole),
    "primary-foreground": toRgbCss(pickReadableForeground(primaryRole)),
    secondary: toRgbCss(support),
    "secondary-foreground": toRgbCss(pickReadableForeground(support)),
    accent: toRgbCss(accentRole),
    "accent-foreground": toRgbCss(pickReadableForeground(accentRole)),
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
