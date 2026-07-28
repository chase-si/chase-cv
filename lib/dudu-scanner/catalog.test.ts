import { describe, expect, it } from "vitest";

import {
  DUDU_SCANNER_DEFAULT_CONFIG,
  DUDU_SCANNER_TARGET_IDS,
  DUDU_SCANNER_THEME_IDS,
  getTargetIdsForTheme,
  getTargetRecord,
  getThemeIdForTarget,
  isTargetInTheme,
} from "@/lib/dudu-scanner/catalog";

describe("dudu scanner target catalog", () => {
  it("exposes exactly six stable target ids across two themes", () => {
    expect(DUDU_SCANNER_TARGET_IDS).toHaveLength(6);
    expect(new Set(DUDU_SCANNER_TARGET_IDS).size).toBe(6);
    expect(DUDU_SCANNER_THEME_IDS).toEqual(["snack-scan", "tummy-creatures"]);
    expect(getTargetIdsForTheme("snack-scan")).toEqual([
      "fry-sprite",
      "candy-critter",
      "boba-bubbles",
    ]);
    expect(getTargetIdsForTheme("tummy-creatures")).toEqual([
      "sleepy-bug",
      "rumble-monster",
      "rice-ball-sprite",
    ]);
  });

  it("maps each target to a theme and placeholder asset", () => {
    for (const targetId of DUDU_SCANNER_TARGET_IDS) {
      const record = getTargetRecord(targetId);
      expect(record.imageSrc).toMatch(/^\/dudu-scanner\/placeholders\//);
      expect(getThemeIdForTarget(targetId)).toBe(record.themeId);
    }
  });

  it("defaults to Snack Scan and Fry Sprite with sound enabled", () => {
    expect(DUDU_SCANNER_DEFAULT_CONFIG).toEqual({
      themeId: "snack-scan",
      targetId: "fry-sprite",
      soundEnabled: true,
    });
  });

  it("knows theme membership for targets", () => {
    expect(isTargetInTheme("fry-sprite", "snack-scan")).toBe(true);
    expect(isTargetInTheme("fry-sprite", "tummy-creatures")).toBe(false);
  });
});
