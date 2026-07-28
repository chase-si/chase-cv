import { describe, expect, it } from "vitest";

import { resolveScannerMotionPolicy } from "@/lib/dudu-scanner/scanner-visual/motion-policy";

describe("scanner motion policy", () => {
  it("reduces drift and texture motion when prefers-reduced-motion", () => {
    const policy = resolveScannerMotionPolicy(true);
    expect(policy.driftSpeed).toBeLessThan(1);
    expect(policy.textureMotion).toBeLessThan(1);
    expect(policy.particlesEnabled).toBe(false);
    expect(policy.revealDurationScale).toBeLessThan(1);
  });
});
