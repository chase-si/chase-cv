import { describe, expect, it } from "vitest";

import {
  isLowPerformanceEnvironment,
  resolveBrandMotionCapabilities,
} from "./brand-motion-policy";

describe("brand motion policy", () => {
  it("disables decorative animation for reduced motion, save-data, or off-screen tiles", () => {
    expect(
      resolveBrandMotionCapabilities({
        reducedMotion: true,
        finePointer: true,
        isVisible: true,
      }).runDecorativeAnimation,
    ).toBe(false);

    expect(
      resolveBrandMotionCapabilities({
        reducedMotion: false,
        finePointer: true,
        saveData: true,
        isVisible: true,
      }).runDecorativeAnimation,
    ).toBe(false);

    expect(
      resolveBrandMotionCapabilities({
        reducedMotion: false,
        finePointer: true,
        isVisible: false,
      }).runDecorativeAnimation,
    ).toBe(false);
  });

  it("keeps smooth scroll on fine pointers only when animation is allowed", () => {
    expect(
      resolveBrandMotionCapabilities({
        reducedMotion: false,
        finePointer: true,
        isVisible: true,
      }),
    ).toEqual({
      runDecorativeAnimation: true,
      runSmoothScroll: true,
    });

    expect(
      resolveBrandMotionCapabilities({
        reducedMotion: false,
        finePointer: false,
        isVisible: true,
      }).runSmoothScroll,
    ).toBe(false);
  });

  it("treats low core counts as low performance", () => {
    expect(isLowPerformanceEnvironment({ hardwareConcurrency: 4 })).toBe(true);
    expect(isLowPerformanceEnvironment({ hardwareConcurrency: 8 })).toBe(false);
    expect(isLowPerformanceEnvironment({ saveData: true })).toBe(true);
  });
});
