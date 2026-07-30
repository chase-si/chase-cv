import { describe, expect, it } from "vitest";

import { pickMysteryTarget, resolveRoundTarget } from "@/lib/dudu-scanner/round-target";

describe("dudu scanner round target", () => {
  it("picks a target from the active mystery theme", () => {
    expect(pickMysteryTarget("snack-scan", () => 0)).toBe("fry-sprite");
    expect(pickMysteryTarget("snack-scan", () => 0.999)).toBe("boba-bubbles");
  });

  it("avoids immediately repeating the previous mystery target", () => {
    expect(pickMysteryTarget("snack-scan", () => 0, "fry-sprite")).toBe(
      "candy-critter",
    );
  });

  it("keeps the explicit target in operator mode", () => {
    expect(
      resolveRoundTarget(
        {
          scanMode: "operator",
          themeId: "tummy-creatures",
          targetId: "rumble-monster",
          soundEnabled: true,
        },
        () => 0,
      ),
    ).toBe("rumble-monster");
  });
});
