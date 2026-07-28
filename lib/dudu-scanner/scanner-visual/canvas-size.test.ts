import { describe, expect, it } from "vitest";

import {
  computeCanvasLayout,
  shouldThrottleResize,
} from "@/lib/dudu-scanner/scanner-visual/canvas-size";

describe("scanner canvas sizing", () => {
  it("caps device pixel ratio", () => {
    const layout = computeCanvasLayout(400, 300, 3, 2);
    expect(layout.devicePixelRatio).toBe(2);
    expect(layout.pixelWidth).toBe(800);
    expect(layout.pixelHeight).toBe(600);
  });

  it("throttles rapid resize callbacks", () => {
    expect(shouldThrottleResize(100, 150, 120)).toBe(true);
    expect(shouldThrottleResize(100, 250, 120)).toBe(false);
  });
});
