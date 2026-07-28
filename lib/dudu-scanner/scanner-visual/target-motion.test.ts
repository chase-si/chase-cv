import { describe, expect, it } from "vitest";

import { computeFanGeometry, placeTargetInSafeRegion } from "@/lib/dudu-scanner/scanner-visual/geometry";
import {
  advanceTargetMotion,
  applyScanLineClarity,
  scanLineCrossBoost,
} from "@/lib/dudu-scanner/scanner-visual/target-motion";

describe("scanner target motion", () => {
  const fan = computeFanGeometry(500, 400);
  const start = placeTargetInSafeRegion(3, fan, 22);

  it("drifts slowly without using pointer input", () => {
    const first = advanceTargetMotion(
      { position: start, clarityBoost: 0 },
      fan,
      22,
      0,
      3,
      1,
    );
    const second = advanceTargetMotion(first, fan, 22, 1.2, 3, 1);
    expect(second.position).not.toEqual(start);
    const dist = Math.hypot(second.position.x - start.x, second.position.y - start.y);
    expect(dist).toBeLessThan(30);
  });

  it("briefly boosts clarity when the scan line crosses", () => {
    const angle = Math.atan2(start.y - fan.cy, start.x - fan.cx);
    const boost = scanLineCrossBoost(angle, start, fan);
    const next = applyScanLineClarity({ position: start, clarityBoost: 0 }, boost);
    expect(next.clarityBoost).toBeGreaterThan(0.5);
  });
});
