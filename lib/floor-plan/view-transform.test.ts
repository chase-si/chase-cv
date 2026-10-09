import { describe, expect, it } from "vitest";
import {
  calculateFitToView,
  clampZoom,
  planToScreen,
  screenToPlan,
  zoomByFactor,
} from "./view-transform";

describe("FloorPlan View Transform", () => {
  const bounds = {
    minX: 0,
    minY: 0,
    maxX: 6000,
    maxY: 5000,
    width: 6000,
    height: 5000,
    centerX: 3000,
    centerY: 2500,
  };

  it("calculates fit-to-view transform centered in viewport", () => {
    const viewportWidth = 800;
    const viewportHeight = 600;

    const transform = calculateFitToView(bounds, viewportWidth, viewportHeight, 0.1);
    expect(transform.scale).toBeGreaterThan(0);

    // Center of bounds (3000, 2500) should project to center of viewport (400, 300)
    const centerScreen = planToScreen({ x: 3000, y: 2500 }, transform);
    expect(centerScreen.x).toBeCloseTo(400, 0);
    expect(centerScreen.y).toBeCloseTo(300, 0);
  });

  it("converts bidirectionally between screen and plan coordinates", () => {
    const transform = { scale: 0.1, panX: 100, panY: 50 };
    const planPoint = { x: 2500, y: 1500 };

    const screenPoint = planToScreen(planPoint, transform);
    expect(screenPoint.x).toBe(2500 * 0.1 + 100);
    expect(screenPoint.y).toBe(1500 * 0.1 + 50);

    const reverted = screenToPlan(screenPoint, transform);
    expect(reverted.x).toBeCloseTo(planPoint.x, 2);
    expect(reverted.y).toBeCloseTo(planPoint.y, 2);
  });

  it("zooms toward an anchor point smoothly", () => {
    const initial = { scale: 0.1, panX: 100, panY: 100 };
    const anchor = { x: 400, y: 300 };

    // Point before zoom
    const planBefore = screenToPlan(anchor, initial);

    const zoomed = zoomByFactor(initial, 1.5, anchor);
    expect(zoomed.scale).toBeCloseTo(0.15, 4);

    // After zooming around anchor, the screen anchor should still project to the exact same plan point!
    const planAfter = screenToPlan(anchor, zoomed);
    expect(planAfter.x).toBeCloseTo(planBefore.x, 1);
    expect(planAfter.y).toBeCloseTo(planBefore.y, 1);
  });

  it("clamps zoom scale within limits", () => {
    expect(clampZoom(0.01, 0.05, 5)).toBe(0.05);
    expect(clampZoom(10, 0.05, 5)).toBe(5);
    expect(clampZoom(1.2, 0.05, 5)).toBe(1.2);
  });
});
