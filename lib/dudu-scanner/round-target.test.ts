import { describe, expect, it } from "vitest";

import { pickMysteryTarget, resolveRoundTarget } from "@/lib/dudu-scanner/round-target";

describe("dudu scanner round target", () => {
  it("picks a target from the complete catalog", () => {
    expect(pickMysteryTarget(() => 0)).toBe("fry-sprite");
    expect(pickMysteryTarget(() => 0.999)).toBe("breakfast-wake-up-bird");
  });

  it("avoids immediately repeating the previous mystery target", () => {
    expect(pickMysteryTarget(() => 0, "fry-sprite")).toBe(
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
