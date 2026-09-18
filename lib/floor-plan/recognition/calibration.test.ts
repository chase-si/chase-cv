import { describe, expect, it } from "vitest";
import {
  calculateScaleFromTwoPoints,
  scalePoint,
  scaleDimension,
  createUnscaledCalibration,
} from "./calibration";

describe("CubiCasa Two-Point Calibration (AC-21)", () => {
  it("calculates mmPerPixel accurately for horizontal points", () => {
    const p1 = { x: 100, y: 200 };
    const p2 = { x: 500, y: 200 }; // 400 px
    const realLengthMm = 4000;

    const result = calculateScaleFromTwoPoints(p1, p2, realLengthMm);

    expect(result.pixelDistance).toBe(400);
    expect(result.realLengthMm).toBe(4000);
    expect(result.mmPerPixel).toBe(10);
    expect(result.scaled).toBe(true);
  });

  it("calculates mmPerPixel accurately for diagonal points", () => {
    const p1 = { x: 0, y: 0 };
    const p2 = { x: 300, y: 400 }; // 500 px
    const realLengthMm = 3500; // 7 mm per px

    const result = calculateScaleFromTwoPoints(p1, p2, realLengthMm);

    expect(result.pixelDistance).toBe(500);
    expect(result.realLengthMm).toBe(3500);
    expect(result.mmPerPixel).toBe(7);
    expect(result.scaled).toBe(true);
  });

  it("rejects zero or negative real-world length", () => {
    const p1 = { x: 100, y: 100 };
    const p2 = { x: 200, y: 100 };

    expect(() => calculateScaleFromTwoPoints(p1, p2, 0)).toThrow(
      "Real-world length must be greater than 0 mm",
    );
    expect(() => calculateScaleFromTwoPoints(p1, p2, -500)).toThrow(
      "Real-world length must be greater than 0 mm",
    );
  });

  it("rejects coincident points (distance = 0)", () => {
    const p1 = { x: 150, y: 150 };
    const p2 = { x: 150, y: 150 };

    expect(() => calculateScaleFromTwoPoints(p1, p2, 3000)).toThrow(
      "Calibration points must not be coincident",
    );
  });

  it("scales coordinates and dimensions correctly", () => {
    const pt = { x: 50, y: 80 };
    const scaledPt = scalePoint(pt, 12.5);
    expect(scaledPt).toEqual({ x: 625, y: 1000 });

    const scaledDim = scaleDimension(40, 15);
    expect(scaledDim).toBe(600);
  });

  it("provides an unscaled calibration default with scaled = false", () => {
    const unscaled = createUnscaledCalibration();
    expect(unscaled.scaled).toBe(false);
    expect(unscaled.mmPerPixel).toBe(1);
    expect(unscaled.realLengthMm).toBe(0);
    expect(unscaled.pixelDistance).toBe(0);
  });
});
