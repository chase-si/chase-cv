import { describe, expect, it } from "vitest";

import {
  createPointerSmoother,
  neutralProbeInput,
  normalizePointerSample,
} from "@/lib/dudu-scanner/scanner-visual/pointer-input";

describe("scanner pointer smoothing", () => {
  it("normalizes coordinates to 0..1", () => {
    const normalized = normalizePointerSample({ x: 320, y: 240, timestamp: 0 }, 640, 480);
    expect(normalized.x).toBeCloseTo(0.5);
    expect(normalized.y).toBeCloseTo(0.5);
  });

  it("smooths jittery movement into stable probe metrics", () => {
    const smoother = createPointerSmoother(0.25);
    const first = smoother.push({ x: 100, y: 100, timestamp: 0 }, 400, 400);
    const second = smoother.push({ x: 300, y: 300, timestamp: 16 }, 400, 400);
    expect(second.x).toBeGreaterThan(first.x);
    expect(second.y).toBeGreaterThan(first.y);
    expect(second.signalStrength).toBeGreaterThan(neutralProbeInput().signalStrength);
  });

  it("does not tie target placement to pointer position", () => {
    const smoother = createPointerSmoother();
    smoother.push({ x: 10, y: 10, timestamp: 0 }, 200, 200);
    const left = smoother.getSnapshot();
    smoother.reset();
    smoother.push({ x: 190, y: 190, timestamp: 0 }, 200, 200);
    const right = smoother.getSnapshot();
    expect(left?.textureOffsetX).not.toBe(right?.textureOffsetX);
  });
});
