/**
 * Two-point Known Length Calibration (AC-21)
 *
 * Translates pixel geometry from CubiCasa semantic segmentation into
 * real-world millimetre coordinates.
 */

import type { CalibrationResult, RawPoint } from "./types";

/**
 * Calculate mmPerPixel scale ratio from two chosen points on the image
 * and the known real-world distance between them in millimetres.
 */
export function calculateScaleFromTwoPoints(
  p1: RawPoint,
  p2: RawPoint,
  realLengthMm: number,
): CalibrationResult {
  if (!Number.isFinite(realLengthMm) || realLengthMm <= 0) {
    throw new Error("Real-world length must be greater than 0 mm");
  }

  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const pixelDistance = Math.hypot(dx, dy);

  if (pixelDistance < 1e-4) {
    throw new Error("Calibration points must not be coincident");
  }

  const mmPerPixel = realLengthMm / pixelDistance;

  return {
    pixelDistance,
    realLengthMm,
    mmPerPixel,
    scaled: true,
  };
}

/**
 * Default calibration for unscaled mode.
 */
export function createUnscaledCalibration(): CalibrationResult {
  return {
    pixelDistance: 0,
    realLengthMm: 0,
    mmPerPixel: 1,
    scaled: false,
  };
}

/**
 * Scale a point from pixel coordinates to real-world mm.
 */
export function scalePoint(point: RawPoint, mmPerPixel: number): { x: number; y: number } {
  return {
    x: Math.round(point.x * mmPerPixel),
    y: Math.round(point.y * mmPerPixel),
  };
}

/**
 * Scale a scalar dimension (thickness, length) to millimetres.
 */
export function scaleDimension(dimensionPx: number, mmPerPixel: number): number {
  return Math.max(1, Math.round(dimensionPx * mmPerPixel));
}
