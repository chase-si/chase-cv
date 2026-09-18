import type { FloorPlan, Opening, Wall } from "./types";
import { getVertexMap } from "./geometry";

export const DEFAULT_OPENING_END_MARGIN_MM = 100;
export const MIN_OPENING_WIDTH_MM = 300;

export interface OpeningPositionBounds {
  valid: boolean;
  minPositionRatio: number;
  maxPositionRatio: number;
  maxAllowedWidthMm: number;
  wallLengthMm: number;
}

export interface UpdateOpeningParams {
  openingId: string;
  positionRatio?: number;
  widthMm?: number;
  endMarginMm?: number;
}

export type UpdateOpeningResult =
  | {
      success: true;
      plan: FloorPlan;
      opening: Opening;
      wallLengthMm: number;
      minPositionRatio: number;
      maxPositionRatio: number;
      distanceFromStartMm: number;
    }
  | {
      success: false;
      error: string;
    };

export interface OpeningEditDetails {
  opening: Opening;
  wall: Wall;
  wallLengthMm: number;
  minPositionRatio: number;
  maxPositionRatio: number;
  minDistanceMm: number;
  maxDistanceMm: number;
  currentDistanceMm: number;
  maxAllowedWidthMm: number;
  endMarginMm: number;
}

/**
 * Deep clone FloorPlan to strictly prevent mutation on failure or preview.
 */
function cloneFloorPlan(plan: FloorPlan): FloorPlan {
  return {
    ...plan,
    meta: { ...plan.meta },
    vertices: plan.vertices.map((v) => ({ ...v })),
    walls: plan.walls.map((w) => ({ ...w })),
    openings: plan.openings.map((o) => ({ ...o })),
    rooms: plan.rooms.map((r) => ({ ...r, boundaryWallIds: [...r.boundaryWallIds] })),
    furniture: plan.furniture.map((f) => ({ ...f })),
  };
}

/**
 * Calculate valid position ratio bounds along a wall given opening width, wall length,
 * and configurable end margin (US-9, AC-9).
 *
 * minPositionRatio = (endMarginMm + widthMm / 2) / wallLengthMm
 * maxPositionRatio = (wallLengthMm - endMarginMm - widthMm / 2) / wallLengthMm
 */
export function calculateOpeningPositionBounds(
  wallLengthMm: number,
  widthMm: number,
  minMarginMm: number = DEFAULT_OPENING_END_MARGIN_MM,
): OpeningPositionBounds {
  const maxAllowedWidthMm = Math.max(0, wallLengthMm - 2 * minMarginMm);
  if (wallLengthMm <= 0 || minMarginMm < 0 || widthMm <= 0 || widthMm > maxAllowedWidthMm) {
    return {
      valid: false,
      minPositionRatio: 0,
      maxPositionRatio: 0,
      maxAllowedWidthMm,
      wallLengthMm,
    };
  }

  const minPositionRatio = (minMarginMm + widthMm / 2) / wallLengthMm;
  const maxPositionRatio = (wallLengthMm - minMarginMm - widthMm / 2) / wallLengthMm;

  return {
    valid: true,
    minPositionRatio,
    maxPositionRatio,
    maxAllowedWidthMm,
    wallLengthMm,
  };
}

/**
 * Get comprehensive inspection and editing metadata for a wall-bound opening.
 */
export function getOpeningEditDetails(
  plan: FloorPlan,
  openingId: string,
  endMarginMm: number = DEFAULT_OPENING_END_MARGIN_MM,
): OpeningEditDetails | null {
  const opening = plan.openings.find((o) => o.id === openingId);
  if (!opening) return null;

  const wall = plan.walls.find((w) => w.id === opening.wallId);
  if (!wall) return null;

  const vertexMap = getVertexMap(plan);
  const fromV = vertexMap.get(wall.from);
  const toV = vertexMap.get(wall.to);
  if (!fromV || !toV) return null;

  const wallLengthMm = Math.hypot(toV.x - fromV.x, toV.y - fromV.y);
  if (wallLengthMm <= 0) return null;

  const bounds = calculateOpeningPositionBounds(wallLengthMm, opening.width, endMarginMm);

  const minDistanceMm = bounds.valid ? bounds.minPositionRatio * wallLengthMm : 0;
  const maxDistanceMm = bounds.valid ? bounds.maxPositionRatio * wallLengthMm : wallLengthMm;
  const currentDistanceMm = opening.position * wallLengthMm;

  return {
    opening,
    wall,
    wallLengthMm,
    minPositionRatio: bounds.minPositionRatio,
    maxPositionRatio: bounds.maxPositionRatio,
    minDistanceMm,
    maxDistanceMm,
    currentDistanceMm,
    maxAllowedWidthMm: bounds.maxAllowedWidthMm,
    endMarginMm,
  };
}

/**
 * Update opening position and/or width along its wall (US-9, AC-9).
 * Guarantees attachment by center-position ratio and non-mutation on failure.
 */
export function updateOpening(
  plan: FloorPlan,
  params: UpdateOpeningParams,
): UpdateOpeningResult {
  const opening = plan.openings.find((o) => o.id === params.openingId);
  if (!opening) {
    return {
      success: false,
      error: `Opening "${params.openingId}" not found in floor plan`,
    };
  }

  const wall = plan.walls.find((w) => w.id === opening.wallId);
  if (!wall) {
    return {
      success: false,
      error: `Attached wall "${opening.wallId}" not found for opening "${opening.id}"`,
    };
  }

  const vertexMap = getVertexMap(plan);
  const fromV = vertexMap.get(wall.from);
  const toV = vertexMap.get(wall.to);
  if (!fromV || !toV) {
    return {
      success: false,
      error: `Vertices for wall "${wall.id}" not found`,
    };
  }

  const wallLengthMm = Math.hypot(toV.x - fromV.x, toV.y - fromV.y);
  if (wallLengthMm <= 0) {
    return {
      success: false,
      error: `Wall "${wall.id}" has zero length`,
    };
  }

  const endMarginMm =
    params.endMarginMm !== undefined ? params.endMarginMm : DEFAULT_OPENING_END_MARGIN_MM;
  if (endMarginMm < 0) {
    return {
      success: false,
      error: `End margin (${endMarginMm} mm) cannot be negative`,
    };
  }

  const targetWidthMm = params.widthMm !== undefined ? params.widthMm : opening.width;
  if (targetWidthMm < MIN_OPENING_WIDTH_MM) {
    return {
      success: false,
      error: `Opening width (${targetWidthMm} mm) must be at least ${MIN_OPENING_WIDTH_MM} mm`,
    };
  }

  const bounds = calculateOpeningPositionBounds(wallLengthMm, targetWidthMm, endMarginMm);
  if (!bounds.valid || targetWidthMm > bounds.maxAllowedWidthMm) {
    return {
      success: false,
      error: `Opening width (${targetWidthMm} mm) exceeds maximum allowable width (${Math.round(bounds.maxAllowedWidthMm)} mm) for wall "${wall.id}" with ${endMarginMm} mm margins`,
    };
  }

  const targetRatio =
    params.positionRatio !== undefined ? params.positionRatio : opening.position;

  // Floating-point precision epsilon
  const EPSILON = 1e-5;
  if (
    targetRatio < bounds.minPositionRatio - EPSILON ||
    targetRatio > bounds.maxPositionRatio + EPSILON
  ) {
    return {
      success: false,
      error: `Opening position (${(targetRatio * 100).toFixed(1)}%) violates the ${endMarginMm} mm end margin requirement (allowed range: ${(bounds.minPositionRatio * 100).toFixed(1)}% - ${(bounds.maxPositionRatio * 100).toFixed(1)}%)`,
    };
  }

  const clampedRatio = Math.max(
    bounds.minPositionRatio,
    Math.min(bounds.maxPositionRatio, targetRatio),
  );

  const clonedPlan = cloneFloorPlan(plan);
  const targetOpeningIndex = clonedPlan.openings.findIndex((o) => o.id === opening.id);
  const updatedOpening: Opening = {
    ...clonedPlan.openings[targetOpeningIndex],
    position: clampedRatio,
    width: targetWidthMm,
  };
  clonedPlan.openings[targetOpeningIndex] = updatedOpening;

  return {
    success: true,
    plan: clonedPlan,
    opening: updatedOpening,
    wallLengthMm,
    minPositionRatio: bounds.minPositionRatio,
    maxPositionRatio: bounds.maxPositionRatio,
    distanceFromStartMm: clampedRatio * wallLengthMm,
  };
}

/**
 * Preview opening update simulation without side effects (AC-9).
 */
export function previewOpeningUpdate(
  plan: FloorPlan,
  params: UpdateOpeningParams,
): UpdateOpeningResult {
  return updateOpening(plan, params);
}
