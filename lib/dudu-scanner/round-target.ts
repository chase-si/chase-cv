import {
  getTargetIdsForTheme,
  type DuduScannerConfigShape,
  type DuduScannerTargetId,
  type DuduScannerThemeId,
} from "@/lib/dudu-scanner/catalog";

function clampRandomUnit(value: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }
  return Math.min(0.999_999, Math.max(0, value));
}

export function pickMysteryTarget(
  themeId: DuduScannerThemeId,
  random: () => number = Math.random,
  excludedTargetId?: DuduScannerTargetId | null,
): DuduScannerTargetId {
  const themeTargets = getTargetIdsForTheme(themeId);
  const candidates =
    excludedTargetId && themeTargets.length > 1
      ? themeTargets.filter((targetId) => targetId !== excludedTargetId)
      : themeTargets;
  const index = Math.floor(clampRandomUnit(random()) * candidates.length);
  return candidates[index] ?? themeTargets[0];
}

export function resolveRoundTarget(
  config: DuduScannerConfigShape,
  random: () => number = Math.random,
  excludedTargetId?: DuduScannerTargetId | null,
): DuduScannerTargetId {
  if (config.scanMode === "operator") {
    return config.targetId;
  }
  return pickMysteryTarget(config.themeId, random, excludedTargetId);
}
