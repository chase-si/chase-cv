import { describe, expect, it } from "vitest";

import {
  DUDU_SCANNER_TARGET_IDS,
  DUDU_SCANNER_THEME_IDS,
  getTargetIdsForTheme,
  getTargetRecord,
  isTargetInTheme,
} from "@/lib/dudu-scanner/catalog";
import { DUDU_SCANNER_TARGET_MESSAGE_KEY } from "@/lib/dudu-scanner/i18n-keys";
import enMessages from "@/messages/en.json";
import zhMessages from "@/messages/zh.json";

const TARGET_COPY_FIELDS = ["name", "revealLine", "description", "suggestion"] as const;

describe("dudu scanner catalog", () => {
  it("maps each target to stable production character assets", () => {
    const geminiProductionTargets = new Set([
      "fry-sprite",
      "boba-bubbles",
      "sleepy-bug",
    ]);
    const sharedFallbackTargets = new Map([
      ["eye-guard", "rumble-monster"],
      ["motion-energy-ball", "candy-critter"],
      ["toothbrush-knight", "rice-ball-sprite"],
      ["breakfast-wake-up-bird", "rice-ball-sprite"],
    ]);

    for (const targetId of DUDU_SCANNER_TARGET_IDS) {
      const record = getTargetRecord(targetId);
      const stem = geminiProductionTargets.has(targetId)
        ? `${targetId}-gemini`
        : targetId;

      expect(record.id).toBe(targetId);
      expect(record.imageSrc).toBe(`/dudu-scanner/characters/${stem}.png`);
      const fallbackStem = sharedFallbackTargets.get(targetId) ?? stem;
      expect(record.placeholderSrc).toBe(`/dudu-scanner/placeholders/${fallbackStem}.svg`);
    }
  });

  it("groups every target into a catalog collection", () => {
    const expectedThemeSizes = {
      "snack-scan": 3,
      "tummy-creatures": 3,
      "healthy-buddies": 4,
    } as const;

    for (const themeId of DUDU_SCANNER_THEME_IDS) {
      const ids = getTargetIdsForTheme(themeId);
      expect(ids).toHaveLength(expectedThemeSizes[themeId]);
      for (const targetId of ids) {
        expect(isTargetInTheme(targetId, themeId)).toBe(true);
      }
    }
  });

  it("has complete playful en/zh copy for every target", () => {
    for (const targetId of DUDU_SCANNER_TARGET_IDS) {
      const messageKey = DUDU_SCANNER_TARGET_MESSAGE_KEY[targetId];
      const enTarget = enMessages.duduScanner.targets[messageKey];
      const zhTarget = zhMessages.duduScanner.targets[messageKey];

      for (const field of TARGET_COPY_FIELDS) {
        expect(enTarget[field]?.trim().length).toBeGreaterThan(0);
        expect(zhTarget[field]?.trim().length).toBeGreaterThan(0);
      }
    }
  });
});
