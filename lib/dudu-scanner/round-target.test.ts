import { describe, expect, it } from "vitest";

import { pickMysteryTarget, resolveCustomRoundAssetId, resolveRoundTarget } from "@/lib/dudu-scanner/round-target";

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

  it("does not draw from the catalog in custom mode", () => {
    expect(
      resolveRoundTarget(
        {
          scanMode: "custom",
          themeId: "snack-scan",
          targetId: "fry-sprite",
          soundEnabled: true,
        },
        () => 0.999,
      ),
    ).toBe("fry-sprite");
  });

  it("uses a selected custom asset and otherwise avoids repeating the last one", () => {
    expect(resolveCustomRoundAssetId("b", ["a", "b", "c"])).toBe("b");
    expect(resolveCustomRoundAssetId(null, ["a", "b", "c"], () => 0, "a")).toBe("b");
    expect(resolveCustomRoundAssetId("missing", ["a"], () => 0, "a")).toBe("a");
  });
});
