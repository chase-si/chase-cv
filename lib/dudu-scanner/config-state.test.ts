import { describe, expect, it } from "vitest";

import {
  applyThemeChange,
  type DuduScannerConfig,
} from "@/lib/dudu-scanner/config-state";

describe("dudu scanner config state", () => {
  const base: DuduScannerConfig = {
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
      themeId: "tummy-creatures",
      targetId: "sleepy-bug",
      soundEnabled: true,
    });
  });
});
