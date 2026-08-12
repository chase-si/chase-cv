import { describe, expect, it } from "vitest";

import {
  applyScanModeChange,
  applyTargetChange,
  applyThemeChange,
  type DuduScannerConfig,
} from "@/lib/dudu-scanner/config-state";

describe("dudu scanner config state", () => {
  const base: DuduScannerConfig = {
    scanMode: "mystery",
    themeId: "snack-scan",
    targetId: "fry-sprite",
    soundEnabled: true,
  };

  it("keeps the selected target when switching to a theme that still contains it", () => {
    const candyConfig = { ...base, targetId: "candy-critter" as const };
    expect(applyThemeChange(candyConfig, "snack-scan")).toEqual(candyConfig);
  });

  it("replaces the target with the first theme option when the previous target is invalid", () => {
    expect(applyThemeChange(base, "tummy-creatures")).toEqual({
      scanMode: "mystery",
      themeId: "tummy-creatures",
      targetId: "sleepy-bug",
      soundEnabled: true,
    });
  });

  it("switches between mystery and operator modes without losing the target", () => {
    expect(applyScanModeChange(base, "operator")).toEqual({
      ...base,
      scanMode: "operator",
    });
  });

  it("selects a target from either legacy theme", () => {
    expect(applyTargetChange(base, "sleepy-bug")).toEqual({
      ...base,
      themeId: "tummy-creatures",
      targetId: "sleepy-bug",
    });
  });

  it("selects a target from the healthy buddies collection", () => {
    expect(applyTargetChange(base, "eye-guard")).toEqual({
      ...base,
      themeId: "healthy-buddies",
      targetId: "eye-guard",
    });
  });
});
