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
  hue: number;
  selectionIndex: number;
};

type RoleCandidate = {
  surface: ScoredColor;
  action: ScoredColor;
  support: ScoredColor;
  score: number;
};

function surfaceFitness(color: ScoredColor): number {
  const calmNeutral = (1 - color.saturation) * 0.2;
  return color.luminance * 1.15 * (1 - color.saturation * 0.55) + calmNeutral;
}

function supportFitness(color: ScoredColor): number {
  const midTone = 1 - Math.abs(color.luminance - 0.42);
  const neutral = 1 - color.saturation * 0.45;
  return midTone * 0.55 + neutral * 0.45;
}

function getHue(color: RgbColor): number {
  const r = color.r / 255;
  const g = color.g / 255;
  const b = color.b / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  if (delta === 0) {
    return 0;
  }
  if (max === r) {
    return ((g - b) / delta + (g < b ? 6 : 0)) * 60;
  }
  if (max === g) {
    return ((b - r) / delta + 2) * 60;
  }
  return ((r - g) / delta + 4) * 60;
}

function getHueDistance(a: ScoredColor, b: ScoredColor): number {
  const distance = Math.abs(a.hue - b.hue);
  return Math.min(distance, 360 - distance) / 180;
}

function isWarmHue(color: ScoredColor): boolean {
  return color.hue <= 55 || color.hue >= 345;
}

function isCoolHue(color: ScoredColor): boolean {
  return color.hue >= 155 && color.hue <= 245;
}

function channelChroma(color: RgbColor): number {
  return (Math.max(color.r, color.g, color.b) - Math.min(color.r, color.g, color.b)) / 255;
}

function mixedSurfaceMuddiness(surface: ScoredColor, support: ScoredColor): number {
  const hueDistance = getHueDistance(surface, support);
  const surfaceChroma = channelChroma(surface.rgb);
  const supportChroma = channelChroma(support.rgb);
  const crossTemperature =
    (isWarmHue(surface) && isCoolHue(support)) || (isCoolHue(surface) && isWarmHue(support));

  if (!crossTemperature) {
    return hueDistance * Math.min(surfaceChroma, supportChroma) * 0.2;
  }

  return hueDistance * Math.min(surfaceChroma, supportChroma) * 1.15;
}

function surfaceHierarchyQuality(color: ScoredColor): number {
  const lowLuminancePenalty = Math.max(0, 0.3 - color.luminance) * 1.65;
  const highSaturationPenalty = Math.max(0, color.saturation - 0.48) * 1.05;
  const warmBrightPenalty =
    isWarmHue(color) && color.luminance > 0.55
      ? Math.max(0, color.saturation - 0.36) * 0.85
      : 0;
  return (
    surfaceFitness(color) * 2.25 +
    color.luminance * 0.85 -
    lowLuminancePenalty -
    highSaturationPenalty -
    warmBrightPenalty
  );
}

function surfaceRelativePenalty(
  surface: ScoredColor,
  action: ScoredColor,
  support: ScoredColor,
): number {
  const brightestAvailable = Math.max(surface.luminance, action.luminance, support.luminance);
  return Math.max(0, brightestAvailable - surface.luminance) * 15;
}

function warmActionPenalty(color: ScoredColor): number {
  if (!isWarmHue(color)) {
    return 0;
  }

  const warningHue = color.hue <= 45 || color.hue >= 350;
  const brightWarmPenalty = Math.max(0, color.luminance - 0.34) * 0.95;
  const vividWarmPenalty = Math.max(0, color.saturation - 0.66) * 0.45;
  const warningHuePenalty = warningHue
    ? Math.max(0, color.saturation - 0.48) * 0.8 +
      Math.max(0, channelChroma(color.rgb) - 0.45) * 0.35
    : 0;

  return brightWarmPenalty + vividWarmPenalty + warningHuePenalty;
}

function actionHarshness(color: ScoredColor): number {
  const highChromaPenalty = Math.max(0, color.saturation - 0.58) * 0.9;
  const lowLightnessPenalty = Math.max(0, 0.16 - color.luminance) * 3.5;
  const darkNearNeutralPenalty =
    color.luminance < 0.12 ? Math.max(0, 0.25 - channelChroma(color.rgb)) * 10 : 0;
  const brightLightnessPenalty = Math.max(0, color.luminance - 0.58) * 1.25;
  return (
    warmActionPenalty(color) +
    highChromaPenalty +
    lowLightnessPenalty +
    darkNearNeutralPenalty +
    brightLightnessPenalty
  );
}

function actionQuality(color: ScoredColor, surface: ScoredColor): number {
  const contrast = getContrastRatio(color.rgb, surface.rgb);
  const readableContrast = Math.min(contrast, 7) / 7;
  const distinctive =
    getHueDistance(color, surface) * 0.3 +
    Math.min(color.saturation, 0.72) * 0.45 +
    channelChroma(color.rgb) * 1;
  const middleReadableTone = 1 - Math.abs(color.luminance - 0.22) * 1.8;
  const lowSaturationPenalty = Math.max(0, 0.35 - color.saturation) * 2;
  return (
    readableContrast * 2.1 +
    distinctive * 0.75 +
    middleReadableTone * 0.55 -
    actionHarshness(color) -
    lowSaturationPenalty
  );
}

function supportCompetitionPenalty(support: ScoredColor, action: ScoredColor): number {
  const hueDistance = getHueDistance(support, action);
  const vividSupportPenalty =
    hueDistance < 0.32 ? Math.max(0, support.saturation - 0.58) * 0.65 : 0;
  const similarHuePenalty =
    hueDistance < 0.18 ? Math.max(0, support.saturation - 0.42) * 0.45 : 0;
  return vividSupportPenalty + similarHuePenalty;
}

function actionCompetitionPenalty(action: ScoredColor, support: ScoredColor): number {
  if (!isWarmHue(action) || !isCoolHue(support)) {
    return 0;
  }

  const warningHue = action.hue <= 45 || action.hue >= 350;
  if (!warningHue) {
    return 0;
  }

  return (
    Math.max(0, action.saturation - 0.52) * 0.85 +
    Math.max(0, channelChroma(action.rgb) - 0.42) * 0.55
  );
}

function foregroundRelationshipScore(
  surface: ScoredColor,
  action: ScoredColor,
  support: ScoredColor,
): number {
  const actionShadeContrast = getContrastRatio(surface.rgb, {
    r: action.rgb.r * 0.28,
    g: action.rgb.g * 0.28,
    b: action.rgb.b * 0.28,
  });
  const supportShadeContrast = getContrastRatio(surface.rgb, {
    r: support.rgb.r * 0.24,
    g: support.rgb.g * 0.24,
    b: support.rgb.b * 0.24,
  });
  return Math.min(Math.max(actionShadeContrast, supportShadeContrast), 9) / 9;
}

function darkSiblingScore(surface: ScoredColor, action: ScoredColor, support: ScoredColor): number {
  const darkSurfaceLuminance = surface.luminance * 0.18;
  const darkActionLuminance = action.luminance + (1 - action.luminance) * 0.4;
  const supportRelationship = 1 - getHueDistance(action, support) * 0.25;
  const actionLegibility = darkActionLuminance > darkSurfaceLuminance + 0.22 ? 1 : 0.45;
  return actionLegibility * 0.7 + supportRelationship * 0.3;
}

function selectionOrderHint(surface: ScoredColor, action: ScoredColor, support: ScoredColor): number {
  return (
    (2 - surface.selectionIndex) * 0.006 +
    (2 - action.selectionIndex) * 0.004 +
    (2 - support.selectionIndex) * 0.002
  );
}

function scoreRoleCandidate(
  surface: ScoredColor,
  action: ScoredColor,
  support: ScoredColor,
): RoleCandidate {
  const surfaceScore =
    surfaceHierarchyQuality(surface) +
    supportFitness(support) * 0.65 -
    mixedSurfaceMuddiness(surface, support) * 1.1 -
    supportCompetitionPenalty(support, action) -
    surfaceRelativePenalty(surface, action, support);
  const score =
    surfaceScore +
    actionQuality(action, surface) * 1.55 +
    foregroundRelationshipScore(surface, action, support) * 0.55 +
    darkSiblingScore(surface, action, support) * 0.55 +
    selectionOrderHint(surface, action, support) -
    actionCompetitionPenalty(action, support);

  return { surface, action, support, score };
}

function buildRoleCandidates(colors: ScoredColor[]): RoleCandidate[] {
  const candidates: RoleCandidate[] = [];
  for (const surface of colors) {
    for (const action of colors) {
      if (action.hex === surface.hex) {
        continue;
      }
      for (const support of colors) {
        if (support.hex === surface.hex || support.hex === action.hex) {
          continue;
        }
        candidates.push(scoreRoleCandidate(surface, action, support));
      }
    }
  }
  return candidates;
}

function pickBestRoleCandidate(colors: ScoredColor[]): RoleCandidate | undefined {
  return buildRoleCandidates(colors).reduce<RoleCandidate | undefined>((best, candidate) => {
    if (!best || candidate.score > best.score) {
      return candidate;
    }
    return best;
  }, undefined);
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
      hue: getHue(rgb),
      selectionIndex,
    };
  });
}

export function classifyPaletteThemeRoles(
  selectedColors: string[],
): ClassifiedPaletteThemeRoles {
  if (selectedColors.length < 3) {
    throw new Error("Three selected colors are required to classify palette theme roles");
  }

  const colors = scoreColors(selectedColors.slice(0, 3));
  const candidate = pickBestRoleCandidate(colors);

  if (!candidate) {
    throw new Error("Unable to classify palette theme roles from the selected colors");
  }

  return {
    surfaceSeed: candidate.surface.hex,
    actionSeed: candidate.action.hex,
    supportSeed: candidate.support.hex,
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
