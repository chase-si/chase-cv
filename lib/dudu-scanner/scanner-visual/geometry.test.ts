import { describe, expect, it } from "vitest";

import {
  clampTargetInFan,
  computeFanAxisAlignedBounds,
  computeFanGeometry,
  placeTargetInSafeRegion,
} from "@/lib/dudu-scanner/scanner-visual/geometry";

describe("scanner visual geometry", () => {
  const fan = computeFanGeometry(640, 480);

  it("keeps fan anchor fixed regardless of pointer", () => {
    const other = computeFanGeometry(640, 480);
    expect(other.cx).toBe(fan.cx);
    expect(other.cy).toBe(fan.cy);
    expect(other.radius).toBe(fan.radius);
  });

  it("places targets inside the safe central band", () => {
    const point = placeTargetInSafeRegion(42, fan, 28);
    const dx = point.x - fan.cx;
    const dy = point.y - fan.cy;
    const dist = Math.hypot(dx, dy);
    expect(dist).toBeLessThan(fan.radius * 0.75);
  });

  it("is deterministic for the same seed", () => {
    const a = placeTargetInSafeRegion(7, fan, 24);
    const b = placeTargetInSafeRegion(7, fan, 24);
    expect(a).toEqual(b);
  });

  it("clamps drifting targets back into fan bounds", () => {
    const clamped = clampTargetInFan({ x: fan.cx + fan.radius * 2, y: fan.cy }, fan, 20);
    const dist = Math.hypot(clamped.x - fan.cx, clamped.y - fan.cy);
    expect(dist).toBeLessThanOrEqual(fan.radius - 20 + 0.01);
  });

  it("keeps a narrow portrait fan inside the canvas", () => {
    const width = 390;
    const height = 280;
    const bounds = computeFanAxisAlignedBounds(computeFanGeometry(width, height));
    expect(bounds.minX).toBeGreaterThanOrEqual(0);
    expect(bounds.maxX).toBeLessThanOrEqual(width);
    expect(bounds.minY).toBeGreaterThanOrEqual(0);
    expect(bounds.maxY).toBeLessThanOrEqual(height);
  });

  it("spans nearly the full canvas width on a tall phone stage", () => {
    const width = 390;
    const height = 510;
    const bounds = computeFanAxisAlignedBounds(computeFanGeometry(width, height));
    expect(bounds.maxX - bounds.minX).toBeGreaterThan(width * 0.97);
    expect(bounds.minX).toBeGreaterThanOrEqual(0);
    expect(bounds.maxX).toBeLessThanOrEqual(width);
  });
});
