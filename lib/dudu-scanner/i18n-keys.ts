import type { DuduScannerTargetId, DuduScannerThemeId } from "@/lib/dudu-scanner/catalog";

export const DUDU_SCANNER_THEME_MESSAGE_KEY: Record<
  DuduScannerThemeId,
  "snackScan" | "tummyCreatures"
> = {
  "snack-scan": "snackScan",
  "tummy-creatures": "tummyCreatures",
};

export const DUDU_SCANNER_TARGET_MESSAGE_KEY: Record<
  DuduScannerTargetId,
  | "frySprite"
  | "candyCritter"
  | "bobaBubbles"
  | "sleepyBug"
  | "rumbleMonster"
  | "riceBallSprite"
> = {
  "fry-sprite": "frySprite",
  "candy-critter": "candyCritter",
  "boba-bubbles": "bobaBubbles",
  "sleepy-bug": "sleepyBug",
  "rumble-monster": "rumbleMonster",
  "rice-ball-sprite": "riceBallSprite",
};

export const DUDU_SCANNER_SHORTCUT_KEYS = [
  "space",
  "one",
  "enter",
  "r",
  "m",
  "x",
  "esc",
  "f",
] as const;

export type DuduScannerShortcutKey = (typeof DUDU_SCANNER_SHORTCUT_KEYS)[number];

export const DUDU_SCANNER_SHORTCUT_LABEL: Record<DuduScannerShortcutKey, string> = {
  space: "Space",
  one: "1",
  enter: "Enter",
  r: "R",
  m: "M",
  x: "X",
  esc: "Esc",
  f: "F",
};
