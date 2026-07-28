export const DUDU_SCANNER_THEME_IDS = ["snack-scan", "tummy-creatures"] as const;

export type DuduScannerThemeId = (typeof DUDU_SCANNER_THEME_IDS)[number];

export const DUDU_SCANNER_TARGET_IDS = [
  "fry-sprite",
  "candy-critter",
  "boba-bubbles",
  "sleepy-bug",
  "rumble-monster",
  "rice-ball-sprite",
] as const;

export type DuduScannerTargetId = (typeof DUDU_SCANNER_TARGET_IDS)[number];

export type DuduScannerTargetRecord = {
  id: DuduScannerTargetId;
  themeId: DuduScannerThemeId;
  imageSrc: string;
};

const TARGETS: Record<DuduScannerTargetId, DuduScannerTargetRecord> = {
  "fry-sprite": {
    id: "fry-sprite",
    themeId: "snack-scan",
    imageSrc: "/dudu-scanner/placeholders/fry-sprite.svg",
  },
  "candy-critter": {
    id: "candy-critter",
    themeId: "snack-scan",
    imageSrc: "/dudu-scanner/placeholders/candy-critter.svg",
  },
  "boba-bubbles": {
    id: "boba-bubbles",
    themeId: "snack-scan",
    imageSrc: "/dudu-scanner/placeholders/boba-bubbles.svg",
  },
  "sleepy-bug": {
    id: "sleepy-bug",
    themeId: "tummy-creatures",
    imageSrc: "/dudu-scanner/placeholders/sleepy-bug.svg",
  },
  "rumble-monster": {
    id: "rumble-monster",
    themeId: "tummy-creatures",
    imageSrc: "/dudu-scanner/placeholders/rumble-monster.svg",
  },
  "rice-ball-sprite": {
    id: "rice-ball-sprite",
    themeId: "tummy-creatures",
    imageSrc: "/dudu-scanner/placeholders/rice-ball-sprite.svg",
  },
};

const TARGETS_BY_THEME: Record<DuduScannerThemeId, readonly DuduScannerTargetId[]> = {
  "snack-scan": ["fry-sprite", "candy-critter", "boba-bubbles"],
  "tummy-creatures": ["sleepy-bug", "rumble-monster", "rice-ball-sprite"],
};

export const DUDU_SCANNER_DEFAULT_CONFIG = {
  themeId: "snack-scan",
  targetId: "fry-sprite",
  soundEnabled: true,
} as const satisfies DuduScannerConfigShape;

export type DuduScannerConfigShape = {
  themeId: DuduScannerThemeId;
  targetId: DuduScannerTargetId;
  soundEnabled: boolean;
};

export function getTargetIdsForTheme(themeId: DuduScannerThemeId) {
  return TARGETS_BY_THEME[themeId];
}

export function getTargetRecord(targetId: DuduScannerTargetId) {
  return TARGETS[targetId];
}

export function getThemeIdForTarget(targetId: DuduScannerTargetId) {
  return TARGETS[targetId].themeId;
}

export function isTargetInTheme(targetId: DuduScannerTargetId, themeId: DuduScannerThemeId) {
  return TARGETS[targetId].themeId === themeId;
}

export function isDuduScannerThemeId(value: unknown): value is DuduScannerThemeId {
  return typeof value === "string" && (DUDU_SCANNER_THEME_IDS as readonly string[]).includes(value);
}

export function isDuduScannerTargetId(value: unknown): value is DuduScannerTargetId {
  return typeof value === "string" && (DUDU_SCANNER_TARGET_IDS as readonly string[]).includes(value);
}

export function coerceDuduScannerConfig(
  partial: Partial<DuduScannerConfigShape> | null | undefined,
): DuduScannerConfigShape {
  const themeId = isDuduScannerThemeId(partial?.themeId)
    ? partial.themeId
    : DUDU_SCANNER_DEFAULT_CONFIG.themeId;
  const candidateTarget = isDuduScannerTargetId(partial?.targetId)
    ? partial.targetId
    : DUDU_SCANNER_DEFAULT_CONFIG.targetId;
  const targetId = isTargetInTheme(candidateTarget, themeId)
    ? candidateTarget
    : getTargetIdsForTheme(themeId)[0];
  const soundEnabled =
    typeof partial?.soundEnabled === "boolean"
      ? partial.soundEnabled
      : DUDU_SCANNER_DEFAULT_CONFIG.soundEnabled;

  return { themeId, targetId, soundEnabled };
}
