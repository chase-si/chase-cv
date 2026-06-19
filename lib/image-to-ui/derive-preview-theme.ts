type ThemeMode = "light" | "dark";

import { classifyPaletteThemeRoles } from "@/lib/image-to-ui/classify-palette-theme-roles";
import { assertSelectedColorsEligibleForRender } from "@/lib/image-to-ui/palette-render-gate";
import {
  getContrastRatio,
  getSaturation,
  parseHexToRgb,
  toRelativeLuminance,
  type RgbColor,
} from "@/lib/image-to-ui/palette-color-math";

const PREVIEW_THEME_TOKEN_KEYS = [
  "background",
  "foreground",
  "card",
  "card-foreground",
  "popover",
  "popover-foreground",
  "primary",
  "primary-foreground",
  "secondary",
  "secondary-foreground",
  "muted",
  "muted-foreground",
  "accent",
  "accent-foreground",
  "destructive",
  "destructive-foreground",
  "border",
  "input",
  "ring",
  "chart-1",
  "chart-2",
  "chart-3",
  "chart-4",
  "chart-5",
  "sidebar",
  "sidebar-foreground",
  "sidebar-primary",
  "sidebar-primary-foreground",
  "sidebar-accent",
  "sidebar-accent-foreground",
  "sidebar-border",
  "sidebar-ring",
  "radius",
  "shadow-x",
  "shadow-y",
  "shadow-blur",
  "shadow-spread",
  "shadow-opacity",
  "shadow-color",
  "shadow-2xs",
  "shadow-xs",
  "shadow-sm",
  "shadow",
  "shadow-md",
  "shadow-lg",
  "shadow-xl",
  "shadow-2xl",
] as const;

const BLACK: RgbColor = { r: 0, g: 0, b: 0 };
const WHITE: RgbColor = { r: 255, g: 255, b: 255 };
const DESTRUCTIVE_SEED: RgbColor = { r: 255, g: 77, b: 77 };

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

function toHexColor(color: RgbColor): string {
  const channel = (value: number) => clampColorChannel(value).toString(16).padStart(2, "0");
  return `#${channel(color.r)}${channel(color.g)}${channel(color.b)}`;
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

function pickMutedForeground(foregroundSeed: RgbColor, support: RgbColor, muted: RgbColor): RgbColor {
  const softened = mixColor(darkenColor(support, 0.35), foregroundSeed, 0.45);
  return ensureReadableAgainstBackground(softened, muted);
}

function deriveDestructive(action: RgbColor): RgbColor {
  return mixColor(action, DESTRUCTIVE_SEED, 0.42);
}

function deriveRadiusRem(surface: RgbColor): string {
  const calmness = 1 - getSaturation(surface);
  const radiusRem = 0.72 + calmness * 0.5;
  return `${radiusRem.toFixed(2)}rem`;
}

function deriveShadowLayers(
  shadowColorHex: string,
  {
    opacity,
    y,
    blur,
  }: {
    opacity: number;
    y: number;
    blur: number;
  },
): {
  "shadow-x": string;
  "shadow-y": string;
  "shadow-blur": string;
  "shadow-spread": string;
  "shadow-opacity": string;
  "shadow-color": string;
  "shadow-2xs": string;
  "shadow-xs": string;
  "shadow-sm": string;
  shadow: string;
  "shadow-md": string;
  "shadow-lg": string;
  "shadow-xl": string;
  "shadow-2xl": string;
} {
  const shadowX = "0px";
  const shadowY = `${y}px`;
  const shadowBlur = `${blur}px`;
  const shadowSpread = "0px";
  const shadowOpacity = opacity.toFixed(2);
  const hslShadow = `hsl(0 0% 0% / ${shadowOpacity})`;
  const baseLayer = `${shadowX} ${shadowY} ${shadowBlur} ${shadowSpread} ${hslShadow}`;
  const layer = (layerY: number, layerBlur: number, layerSpread: number, layerOpacity: number) =>
    `${shadowX} ${layerY}px ${layerBlur}px ${layerSpread}px hsl(0 0% 0% / ${layerOpacity.toFixed(2)})`;
  const layered = (scale: number) =>
    `${layer(Math.max(1, Math.round(y * 0.2)), Math.max(2, Math.round(blur * 0.22)), -1, opacity * 0.45)}, ${layer(
      Math.round(y * scale),
      Math.round(blur * scale),
      Math.round(-blur * 0.25),
      opacity,
    )}`;

  return {
    "shadow-x": shadowX,
    "shadow-y": shadowY,
    "shadow-blur": shadowBlur,
    "shadow-spread": shadowSpread,
    "shadow-opacity": shadowOpacity,
    "shadow-color": shadowColorHex,
    "shadow-2xs": layer(1, 2, 0, opacity * 0.35),
    "shadow-xs": layer(1, 3, 0, opacity * 0.4),
    "shadow-sm": layered(0.55),
    shadow: layered(0.7),
    "shadow-md": layered(0.9),
    "shadow-lg": layered(1.1),
    "shadow-xl": layered(1.35),
    "shadow-2xl": layer(Math.round(y * 1.6), Math.round(blur * 1.7), Math.round(-blur * 0.2), opacity * 1.15),
  };
}

export function derivePreviewThemeTokens({
  selectedColors,
  mode,
}: DerivePreviewThemeTokensInput): PreviewThemeTokens {
  assertSelectedColorsEligibleForRender(selectedColors, "derive preview theme tokens");

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
  const popover =
    mode === "dark" ? lightenColor(card, 0.08) : lightenColor(card, 0.42);
  const muted =
    mode === "dark"
      ? darkenColor(neutralSeed, 0.72)
      : mixColor(mixColor(background, card, 0.5), darkenColor(neutralSeed, 0.28), 0.48);
  const border = mode === "dark" ? darkenColor(support, 0.5) : lightenColor(support, 0.58);
  const input =
    mode === "dark"
      ? mixColor(card, border, 0.35)
      : mixColor(lightenColor(card, 0.35), lightenColor(support, 0.75), 0.55);
  const accentRole =
    mode === "dark" ? darkenColor(support, 0.28) : mixColor(support, background, 0.58);
  const secondaryRole =
    mode === "dark" ? mixColor(darkenColor(support, 0.55), background, 0.35) : support;
  const ring = primaryRole;
  const destructive = deriveDestructive(action);
  const shadowColor = toHexColor(darkenColor(foregroundSeed, 0.15));
  const shadows = deriveShadowLayers(
    shadowColor,
    mode === "dark" ? { opacity: 0.3, y: 8, blur: 16 } : { opacity: 0.18, y: 10, blur: 24 },
  );
  const sidebarSurface =
    mode === "dark" ? darkenColor(surface, 0.92) : darkenColor(surface, 0.88);
  const sidebarAccent = mode === "dark" ? darkenColor(surface, 0.72) : darkenColor(surface, 0.78);
  const sidebarBorder = mode === "dark" ? mixColor(border, BLACK, 0.25) : darkenColor(support, 0.62);
  const chartForeground = mode === "dark" ? WHITE : darkenColor(foregroundSeed, 0.2);
  const chartMuted = mixColor(support, foregroundSeed, 0.5);

  return {
    background: toRgbCss(background),
    foreground: toRgbCss(foreground),
    card: toRgbCss(card),
    "card-foreground": toRgbCss(ensureReadableAgainstBackground(foreground, card)),
    popover: toRgbCss(popover),
    "popover-foreground": toRgbCss(ensureReadableAgainstBackground(foreground, popover)),
    muted: toRgbCss(muted),
    "muted-foreground": toRgbCss(pickMutedForeground(foregroundSeed, support, muted)),
    border: toRgbCss(border),
    input: toRgbCss(input),
    ring: toRgbCss(ring),
    primary: toRgbCss(primaryRole),
    "primary-foreground": toRgbCss(pickReadableForeground(primaryRole)),
    secondary: toRgbCss(secondaryRole),
    "secondary-foreground": toRgbCss(pickReadableForeground(secondaryRole)),
    accent: toRgbCss(accentRole),
    "accent-foreground": toRgbCss(pickReadableForeground(accentRole)),
    destructive: toRgbCss(destructive),
    "destructive-foreground": toRgbCss(pickReadableForeground(destructive)),
    "chart-1": toRgbCss(primaryRole),
    "chart-2": toRgbCss(accentRole),
    "chart-3": toRgbCss(chartForeground),
    "chart-4": toRgbCss(chartMuted),
    "chart-5": toRgbCss(mode === "dark" ? background : darkenColor(surface, 0.25)),
    sidebar: toRgbCss(sidebarSurface),
    "sidebar-foreground": toRgbCss(pickReadableForeground(sidebarSurface)),
    "sidebar-primary": toRgbCss(primaryRole),
    "sidebar-primary-foreground": toRgbCss(pickReadableForeground(primaryRole)),
    "sidebar-accent": toRgbCss(sidebarAccent),
    "sidebar-accent-foreground": toRgbCss(pickReadableForeground(sidebarAccent)),
    "sidebar-border": toRgbCss(sidebarBorder),
    "sidebar-ring": toRgbCss(ring),
    radius: deriveRadiusRem(surface),
    ...shadows,
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
