import {
  DUDU_SCANNER_TARGET_IDS,
  type DuduScannerConfigShape,
  type DuduScannerTargetId,
} from "@/lib/dudu-scanner/catalog";

function clampRandomUnit(value: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }
  return Math.min(0.999_999, Math.max(0, value));
}

export function pickMysteryTarget(
  random: () => number = Math.random,
  excludedTargetId?: DuduScannerTargetId | null,
): DuduScannerTargetId {
  const candidates =
    excludedTargetId && DUDU_SCANNER_TARGET_IDS.length > 1
      ? DUDU_SCANNER_TARGET_IDS.filter((targetId) => targetId !== excludedTargetId)
      : DUDU_SCANNER_TARGET_IDS;
  const index = Math.floor(clampRandomUnit(random()) * candidates.length);
  return candidates[index] ?? DUDU_SCANNER_TARGET_IDS[0];
}

export function resolveRoundTarget(
  config: DuduScannerConfigShape,
  random: () => number = Math.random,
  excludedTargetId?: DuduScannerTargetId | null,
): DuduScannerTargetId {
  if (config.scanMode === "mystery") {
    return pickMysteryTarget(random, excludedTargetId);
  }
  return config.targetId;
}

export function pickCustomAssetId(
  assetIds: readonly string[],
  random: () => number = Math.random,
  excludedAssetId?: string | null,
): string | null {
  if (assetIds.length === 0) {
    return null;
  }
  const candidates =
    excludedAssetId && assetIds.length > 1
      ? assetIds.filter((assetId) => assetId !== excludedAssetId)
      : [...assetIds];
  const index = Math.floor(clampRandomUnit(random()) * candidates.length);
  return candidates[index] ?? null;
}

export function resolveCustomRoundAssetId(
  selectedAssetId: string | null,
  assetIds: readonly string[],
  random: () => number = Math.random,
  excludedAssetId?: string | null,
): string | null {
  if (selectedAssetId && assetIds.includes(selectedAssetId)) {
    return selectedAssetId;
  }
  return pickCustomAssetId(assetIds, random, excludedAssetId);
}
