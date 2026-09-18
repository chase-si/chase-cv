import type { FloorPlan, Opening, Room, Vertex, Wall } from "./types";
import {
  computePolygonArea,
  computeRoomPolygon,
  getVertexMap,
  getWallMap,
  type Point,
} from "./geometry";

export const MIN_ROOM_SPAN_MM = 600;
export const MAX_ROOM_SPAN_MM = 50000;
export const MIN_WALL_LENGTH_MM = 200;

export interface RoomBoundaryInfo {
  wallIds: string[];
  coordinate: number; // x for vertical wall, y for horizontal wall
  fixedOppositeCoordinate: number;
}

export interface RoomSpanDetails {
  axis: "horizontal" | "vertical";
  spanMm: number;
  minBoundary: RoomBoundaryInfo; // left for horizontal, top for vertical
  maxBoundary: RoomBoundaryInfo; // right for horizontal, bottom for vertical
}

export interface RoomSpans {
  roomId: string;
  roomName: string;
  areaMm2: number;
  horizontal?: RoomSpanDetails;
  vertical?: RoomSpanDetails;
}

export interface RoomSpanAdjustmentRequest {
  plan: FloorPlan;
  roomId: string;
  axis?: "horizontal" | "vertical";
  boundarySide?: "min" | "max";
  wallId?: string;
  targetSpanMm: number;
}

export type RoomSpanAdjustmentResult =
  | {
      success: true;
      plan: FloorPlan;
      newAreaMm2: number;
      newSpanMm: number;
      deltaMm: number;
    }
  | {
      success: false;
      error: string;
    };

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
 * Check if two line segments (p1-p2 and p3-p4) strictly intersect (excluding endpoints).
 */
function segmentsIntersectStrict(
  p1: Point,
  p2: Point,
  p3: Point,
  p4: Point,
): boolean {
  function ccw(a: Point, b: Point, c: Point): number {
    return (c.y - a.y) * (b.x - a.x) - (b.y - a.y) * (c.x - a.x);
  }

  const cp1 = ccw(p1, p2, p3);
  const cp2 = ccw(p1, p2, p4);
  const cp3 = ccw(p3, p4, p1);
  const cp4 = ccw(p3, p4, p2);

  return (
    ((cp1 > 1e-4 && cp2 < -1e-4) || (cp1 < -1e-4 && cp2 > 1e-4)) &&
    ((cp3 > 1e-4 && cp4 < -1e-4) || (cp3 < -1e-4 && cp4 > 1e-4))
  );
}

/**
 * Check if a polygon self-intersects.
 */
function doesPolygonSelfIntersect(points: Point[]): boolean {
  const n = points.length;
  if (n < 4) return false;

  for (let i = 0; i < n; i++) {
    const a1 = points[i];
    const a2 = points[(i + 1) % n];

    for (let j = i + 1; j < n; j++) {
      // Adjacent edges share an endpoint, so ignore them
      if (Math.abs(i - j) <= 1 || (i === 0 && j === n - 1)) {
        continue;
      }
      const b1 = points[j];
      const b2 = points[(j + 1) % n];

      if (segmentsIntersectStrict(a1, a2, b1, b2)) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Inspect a room and extract horizontal and vertical span information.
 */
export function getRoomSpans(plan: FloorPlan, roomId: string): RoomSpans | null {
  const room = plan.rooms.find((r) => r.id === roomId);
  if (!room) return null;

  const vertexMap = getVertexMap(plan);
  const wallMap = getWallMap(plan);

  const roomWalls: Wall[] = [];
  for (const wid of room.boundaryWallIds) {
    const w = wallMap.get(wid);
    if (w) roomWalls.push(w);
  }

  if (roomWalls.length === 0) return null;

  const polyPoints = computeRoomPolygon(room, wallMap, vertexMap);
  const { areaMm2 } = computePolygonArea(polyPoints);

  // Group room walls by horizontal / vertical orientation
  const horizWalls: { wall: Wall; y: number }[] = [];
  const vertWalls: { wall: Wall; x: number }[] = [];

  for (const w of roomWalls) {
    const from = vertexMap.get(w.from);
    const to = vertexMap.get(w.to);
    if (!from || !to) continue;

    if (Math.abs(from.y - to.y) < 1e-4 || w.lockAxis === "horizontal") {
      horizWalls.push({ wall: w, y: Math.round((from.y + to.y) / 2) });
    } else if (Math.abs(from.x - to.x) < 1e-4 || w.lockAxis === "vertical") {
      vertWalls.push({ wall: w, x: Math.round((from.x + to.x) / 2) });
    }
  }

  let horizontalSpan: RoomSpanDetails | undefined;
  if (vertWalls.length >= 2) {
    let minX = Infinity;
    let maxX = -Infinity;
    for (const item of vertWalls) {
      if (item.x < minX) minX = item.x;
      if (item.x > maxX) maxX = item.x;
    }

    if (maxX > minX && isFinite(minX) && isFinite(maxX)) {
      const minWallIds = vertWalls
        .filter((item) => Math.abs(item.x - minX) < 2)
        .map((item) => item.wall.id);
      const maxWallIds = vertWalls
        .filter((item) => Math.abs(item.x - maxX) < 2)
        .map((item) => item.wall.id);

      if (minWallIds.length > 0 && maxWallIds.length > 0) {
        horizontalSpan = {
          axis: "horizontal",
          spanMm: Math.round(maxX - minX),
          minBoundary: {
            wallIds: minWallIds,
            coordinate: minX,
            fixedOppositeCoordinate: maxX,
          },
          maxBoundary: {
            wallIds: maxWallIds,
            coordinate: maxX,
            fixedOppositeCoordinate: minX,
          },
        };
      }
    }
  }

  let verticalSpan: RoomSpanDetails | undefined;
  if (horizWalls.length >= 2) {
    let minY = Infinity;
    let maxY = -Infinity;
    for (const item of horizWalls) {
      if (item.y < minY) minY = item.y;
      if (item.y > maxY) maxY = item.y;
    }

    if (maxY > minY && isFinite(minY) && isFinite(maxY)) {
      const minWallIds = horizWalls
        .filter((item) => Math.abs(item.y - minY) < 2)
        .map((item) => item.wall.id);
      const maxWallIds = horizWalls
        .filter((item) => Math.abs(item.y - maxY) < 2)
        .map((item) => item.wall.id);

      if (minWallIds.length > 0 && maxWallIds.length > 0) {
        verticalSpan = {
          axis: "vertical",
          spanMm: Math.round(maxY - minY),
          minBoundary: {
            wallIds: minWallIds,
            coordinate: minY,
            fixedOppositeCoordinate: maxY,
          },
          maxBoundary: {
            wallIds: maxWallIds,
            coordinate: maxY,
            fixedOppositeCoordinate: minY,
          },
        };
      }
    }
  }

  return {
    roomId: room.id,
    roomName: room.name ?? room.type.replace("_", " "),
    areaMm2,
    horizontal: horizontalSpan,
    vertical: verticalSpan,
  };
}

/**
 * Adjust a room span with safe numeric wall translation (AC-6, AC-7).
 *
 * Guarantees:
 * - Keeps opposite parallel boundary wall fixed.
 * - Translates selected boundary along its normal.
 * - Stretches/shrinks connected orthogonal walls to maintain wall connectivity and orthogonality.
 * - Rejects ambiguous, non-positive, intersecting, or inverting dimension changes without mutating plan.
 */
export function adjustRoomSpan(
  request: RoomSpanAdjustmentRequest,
): RoomSpanAdjustmentResult {
  const { plan, roomId, targetSpanMm } = request;

  // 1. Initial input validation (AC-7)
  if (typeof targetSpanMm !== "number" || isNaN(targetSpanMm) || targetSpanMm <= 0) {
    return {
      success: false,
      error: `Target span must be greater than 0 mm (received: ${targetSpanMm} mm)`,
    };
  }

  if (targetSpanMm < MIN_ROOM_SPAN_MM) {
    return {
      success: false,
      error: `Target span must be at least ${MIN_ROOM_SPAN_MM} mm (received: ${targetSpanMm} mm)`,
    };
  }

  if (targetSpanMm > MAX_ROOM_SPAN_MM) {
    return {
      success: false,
      error: `Target span cannot exceed ${MAX_ROOM_SPAN_MM} mm (received: ${targetSpanMm} mm)`,
    };
  }

  // 2. Room existence and span detection
  const spans = getRoomSpans(plan, roomId);
  if (!spans) {
    return {
      success: false,
      error: `Room "${roomId}" not found or has no valid boundaries`,
    };
  }

  // 3. Resolve axis and boundary side
  let axis: "horizontal" | "vertical" = request.axis ?? "horizontal";
  let boundarySide: "min" | "max" = request.boundarySide ?? "max";

  if (request.wallId) {
    const wallId = request.wallId;
    if (spans.horizontal?.minBoundary.wallIds.includes(wallId)) {
      axis = "horizontal";
      boundarySide = "min";
    } else if (spans.horizontal?.maxBoundary.wallIds.includes(wallId)) {
      axis = "horizontal";
      boundarySide = "max";
    } else if (spans.vertical?.minBoundary.wallIds.includes(wallId)) {
      axis = "vertical";
      boundarySide = "min";
    } else if (spans.vertical?.maxBoundary.wallIds.includes(wallId)) {
      axis = "vertical";
      boundarySide = "max";
    } else {
      return {
        success: false,
        error: `Wall "${wallId}" is not a recognized boundary wall for room "${roomId}"`,
      };
    }
  }

  const spanDetail = axis === "horizontal" ? spans.horizontal : spans.vertical;
  if (!spanDetail) {
    return {
      success: false,
      error: `Room "${roomId}" does not have a supported ${axis} span`,
    };
  }

  const { minBoundary, maxBoundary } = spanDetail;
  let fixedOppositeCoord: number;
  let currentCoord: number;
  let boundaryWallIds: string[];
  let delta: number;

  if (boundarySide === "max") {
    fixedOppositeCoord = minBoundary.coordinate;
    currentCoord = maxBoundary.coordinate;
    const newCoord = fixedOppositeCoord + targetSpanMm;
    delta = newCoord - currentCoord;
    boundaryWallIds = maxBoundary.wallIds;
  } else {
    fixedOppositeCoord = maxBoundary.coordinate;
    currentCoord = minBoundary.coordinate;
    const newCoord = fixedOppositeCoord - targetSpanMm;
    delta = newCoord - currentCoord;
    boundaryWallIds = minBoundary.wallIds;
  }

  // 4. Identify boundary vertices that must translate
  const vertexMap = getVertexMap(plan);
  const wallMap = getWallMap(plan);
  const movingVertexIds = new Set<string>();

  for (const wid of boundaryWallIds) {
    const w = wallMap.get(wid);
    if (!w) continue;
    const fromV = vertexMap.get(w.from);
    const toV = vertexMap.get(w.to);
    if (!fromV || !toV) continue;

    if (axis === "horizontal") {
      if (Math.abs(fromV.x - currentCoord) < 2) movingVertexIds.add(fromV.id);
      if (Math.abs(toV.x - currentCoord) < 2) movingVertexIds.add(toV.id);
    } else {
      if (Math.abs(fromV.y - currentCoord) < 2) movingVertexIds.add(fromV.id);
      if (Math.abs(toV.y - currentCoord) < 2) movingVertexIds.add(toV.id);
    }
  }

  if (movingVertexIds.size === 0) {
    return {
      success: false,
      error: `Could not identify boundary vertices to translate for room "${roomId}"`,
    };
  }

  // 5. Work on cloned plan to guarantee non-mutation on failure
  const clonedPlan = cloneFloorPlan(plan);
  const clonedVertexMap = getVertexMap(clonedPlan);

  for (const vid of movingVertexIds) {
    const v = clonedVertexMap.get(vid);
    if (v) {
      if (axis === "horizontal") {
        v.x += delta;
      } else {
        v.y += delta;
      }
    }
  }

  const newVertexMap = getVertexMap(clonedPlan);
  const newWallMap = getWallMap(clonedPlan);

  // 6. Verification: Orthogonality of connected walls (AC-6)
  for (const wall of clonedPlan.walls) {
    const fromV = newVertexMap.get(wall.from);
    const toV = newVertexMap.get(wall.to);
    const origFrom = vertexMap.get(wall.from);
    const origTo = vertexMap.get(wall.to);
    if (!fromV || !toV || !origFrom || !origTo) continue;

    const isConnectedToMovedVertex =
      movingVertexIds.has(wall.from) || movingVertexIds.has(wall.to);

    if (isConnectedToMovedVertex) {
      const isOriginallyHorizontal =
        Math.abs(origFrom.y - origTo.y) < 1e-4 || wall.lockAxis === "horizontal";
      const isOriginallyVertical =
        Math.abs(origFrom.x - origTo.x) < 1e-4 || wall.lockAxis === "vertical";

      if (isOriginallyHorizontal) {
        if (Math.abs(fromV.y - toV.y) > 1e-4) {
          return {
            success: false,
            error: `Wall "${wall.id}" connected to boundary would become non-orthogonal`,
          };
        }
      } else if (isOriginallyVertical) {
        if (Math.abs(fromV.x - toV.x) > 1e-4) {
          return {
            success: false,
            error: `Wall "${wall.id}" connected to boundary would become non-orthogonal`,
          };
        }
      }
    }
  }

  // 7. Verification: Wall lengths and Inversion (AC-7)
  for (const wall of clonedPlan.walls) {
    const fromV = newVertexMap.get(wall.from);
    const toV = newVertexMap.get(wall.to);
    const origFrom = vertexMap.get(wall.from);
    const origTo = vertexMap.get(wall.to);
    if (!fromV || !toV || !origFrom || !origTo) continue;

    const newLength = Math.hypot(toV.x - fromV.x, toV.y - fromV.y);
    if (newLength < MIN_WALL_LENGTH_MM) {
      return {
        success: false,
        error: `Connected wall "${wall.id}" would shrink below minimum length (${Math.round(newLength)} mm < ${MIN_WALL_LENGTH_MM} mm)`,
      };
    }

    // Check inversion along wall axis
    const origDx = origTo.x - origFrom.x;
    const newDx = toV.x - fromV.x;
    if (Math.abs(origDx) > 1 && Math.sign(origDx) !== Math.sign(newDx)) {
      return {
        success: false,
        error: `Wall "${wall.id}" was inverted by the adjustment`,
      };
    }

    const origDy = origTo.y - origFrom.y;
    const newDy = toV.y - fromV.y;
    if (Math.abs(origDy) > 1 && Math.sign(origDy) !== Math.sign(newDy)) {
      return {
        success: false,
        error: `Wall "${wall.id}" was inverted by the adjustment`,
      };
    }
  }

  // 8. Verification: Openings Fit (AC-7)
  for (const op of clonedPlan.openings) {
    const wall = newWallMap.get(op.wallId);
    if (!wall) continue;
    const fromV = newVertexMap.get(wall.from);
    const toV = newVertexMap.get(wall.to);
    if (!fromV || !toV) continue;

    const wallLength = Math.hypot(toV.x - fromV.x, toV.y - fromV.y);
    if (wallLength < op.width) {
      return {
        success: false,
        error: `Wall "${wall.id}" length (${Math.round(wallLength)} mm) is too short for opening "${op.id}" (${op.width} mm)`,
      };
    }
  }

  // 9. Verification: Room Area and Self-Intersection (AC-6, AC-7)
  for (const r of clonedPlan.rooms) {
    const poly = computeRoomPolygon(r, newWallMap, newVertexMap);
    if (poly.length < 3) {
      return {
        success: false,
        error: `Room "${r.name ?? r.id}" boundary collapsed`,
      };
    }

    const { areaMm2, formattedAreaM2 } = computePolygonArea(poly);
    if (areaMm2 <= 0 || areaMm2 < 500_000) {
      // Minimum 0.5 m²
      return {
        success: false,
        error: `Room "${r.name ?? r.id}" area would be non-positive or too small (${formattedAreaM2})`,
      };
    }

    if (doesPolygonSelfIntersect(poly)) {
      return {
        success: false,
        error: `Adjustment causes room "${r.name ?? r.id}" boundary to self-intersect`,
      };
    }
  }

  // 10. Compute updated area for target room
  const targetRoom = clonedPlan.rooms.find((r) => r.id === roomId)!;
  const targetPoly = computeRoomPolygon(targetRoom, newWallMap, newVertexMap);
  const { areaMm2: newAreaMm2 } = computePolygonArea(targetPoly);

  // Update plan meta timestamp
  clonedPlan.meta.updatedAt = new Date().toISOString();

  return {
    success: true,
    plan: clonedPlan,
    newAreaMm2,
    newSpanMm: targetSpanMm,
    deltaMm: targetSpanMm - spanDetail.spanMm,
  };
}

/**
 * Preview room span adjustment without committing (AC-7).
 */
export function previewRoomSpanAdjustment(
  request: RoomSpanAdjustmentRequest,
): RoomSpanAdjustmentResult {
  return adjustRoomSpan(request);
}
