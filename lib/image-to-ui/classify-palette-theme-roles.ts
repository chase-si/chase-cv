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

function surfaceRoleRationale(color: ScoredColor): string {
  const calm = color.saturation < 0.35;
  const bright = color.luminance > 0.65;
  if (bright && calm) {
    return "偏亮且低饱和，适合作背景与表面基底";
  }
  if (bright) {
    return "相对更亮，适合作背景与表面层级";
  }
  if (calm) {
    return "饱和度较低、偏平静，适合作表面与弱化区域";
  }
  return "表面适应性最高，适合作背景与卡片基底";
}

function actionRoleRationale(color: ScoredColor, surfaceRgb: RgbColor): string {
  const contrast = getContrastRatio(color.rgb, surfaceRgb);
  const contrastPhrase =
    contrast >= 7 ? "高对比" : contrast >= 4.5 ? "较高对比" : "可用对比";
  const vivid = color.saturation >= 0.45;
  if (vivid) {
    return `与表面基底${contrastPhrase}且色彩鲜明，适合作主操作与焦点色`;
  }
  return `与表面基底${contrastPhrase}，适合作主操作与焦点色`;
}

function supportRoleRationale(color: ScoredColor): string {
  const midTone = Math.abs(color.luminance - 0.42) < 0.22;
  const neutral = color.saturation < 0.5;
  if (midTone && neutral) {
    return "中调中性色，适合作边框、输入框与弱强调";
  }
  if (midTone) {
    return "中调辅助色，适合作次要界面与弱强调";
  }
  if (neutral) {
    return "偏中性，适合作边框与弱化层次";
  }
  return "辅助适应性最高，适合作次要界面元素";
}

export function assignedRoleRationaleForHex(
  hex: string,
  selectedColors: string[],
): string {
  const classification = classifyPaletteThemeRoles(selectedColors);
  const colors = scoreColors(selectedColors.slice(0, 3));
  const normalized = normalizeHexColor(hex);
  const color = colors.find((entry) => entry.hex === normalized);
  if (!color) {
    throw new Error(`Selected color is not part of the classified palette: ${hex}`);
  }

  if (normalized === classification.surfaceSeed) {
    return surfaceRoleRationale(color);
  }
  if (normalized === classification.actionSeed) {
    const surfaceRgb = colors.find((entry) => entry.hex === classification.surfaceSeed)!.rgb;
    return actionRoleRationale(color, surfaceRgb);
  }
  if (normalized === classification.supportSeed) {
    return supportRoleRationale(color);
  }
  throw new Error(`Selected color is not part of the classified palette: ${hex}`);
}
