import {
  getContrastRatio,
  getSaturation,
  normalizeHexColor,
  parseHexToRgb,
  toRelativeLuminance,
  type RgbColor,
} from "@/lib/image-to-ui/palette-color-math";

export const THEME_PALETTE_ASSIGNED_ROLE_LABELS = [
  "表面基底",
  "动作色",
  "辅助色",
] as const;

export type ThemePaletteAssignedRoleLabel =
  (typeof THEME_PALETTE_ASSIGNED_ROLE_LABELS)[number];

export type ClassifiedPaletteThemeRoles = {
  surfaceSeed: string;
  actionSeed: string;
  supportSeed: string;
};

type ScoredColor = {
  hex: string;
  rgb: RgbColor;
  luminance: number;
  saturation: number;
  selectionIndex: number;
};

function surfaceFitness(color: ScoredColor): number {
  const calmNeutral = (1 - color.saturation) * 0.2;
  return color.luminance * 1.15 * (1 - color.saturation * 0.55) + calmNeutral;
}

function actionFitness(color: ScoredColor, surfaceRgb: RgbColor): number {
  const contrast = getContrastRatio(color.rgb, surfaceRgb);
  const vividness = color.saturation * 0.55 + (1 - color.luminance) * 0.25;
  return contrast * (0.72 + vividness);
}

function supportFitness(color: ScoredColor): number {
  const midTone = 1 - Math.abs(color.luminance - 0.42);
  const neutral = 1 - color.saturation * 0.45;
  return midTone * 0.55 + neutral * 0.45;
}

function scoreColors(selectedColors: string[]): ScoredColor[] {
  return selectedColors.map((hex, selectionIndex) => {
    const normalized = normalizeHexColor(hex);
    const rgb = parseHexToRgb(normalized);
    return {
      hex: normalized,
      rgb,
      luminance: toRelativeLuminance(rgb),
      saturation: getSaturation(rgb),
      selectionIndex,
    };
  });
}

function pickIndex(
  colors: ScoredColor[],
  score: (color: ScoredColor) => number,
): number {
  let bestIndex = 0;
  let bestScore = Number.NEGATIVE_INFINITY;
  for (let index = 0; index < colors.length; index += 1) {
    const candidateScore = score(colors[index]);
    if (candidateScore > bestScore) {
      bestScore = candidateScore;
      bestIndex = index;
    }
  }
  return bestIndex;
}

export function classifyPaletteThemeRoles(
  selectedColors: string[],
): ClassifiedPaletteThemeRoles {
  if (selectedColors.length < 3) {
    throw new Error("Three selected colors are required to classify palette theme roles");
  }

  const colors = scoreColors(selectedColors.slice(0, 3));
  const surfaceIndex = pickIndex(colors, surfaceFitness);
  const surfaceRgb = colors[surfaceIndex].rgb;

  const remainingAfterSurface = colors.filter((_, index) => index !== surfaceIndex);
  const actionIndexInRemaining = pickIndex(remainingAfterSurface, (color) =>
    actionFitness(color, surfaceRgb),
  );
  const actionColor = remainingAfterSurface[actionIndexInRemaining];
  const supportColor = remainingAfterSurface.find((entry) => entry.hex !== actionColor.hex);

  if (!supportColor) {
    throw new Error("Unable to classify palette theme roles from the selected colors");
  }

  return {
    surfaceSeed: colors[surfaceIndex].hex,
    actionSeed: actionColor.hex,
    supportSeed: supportColor.hex,
  };
}

export function assignedRoleLabelForHex(
  hex: string,
  classification: ClassifiedPaletteThemeRoles,
): ThemePaletteAssignedRoleLabel {
  const normalized = normalizeHexColor(hex);
  if (normalized === classification.surfaceSeed) {
    return "表面基底";
  }
  if (normalized === classification.actionSeed) {
    return "动作色";
  }
  if (normalized === classification.supportSeed) {
    return "辅助色";
  }
  throw new Error(`Selected color is not part of the classified palette: ${hex}`);
}
