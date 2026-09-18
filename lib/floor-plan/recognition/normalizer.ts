/**
 * CubiCasa Topology Normalizer (AC-21, AC-22)
 *
 * Converts raw CubiCasa semantic segmentation output (walls, openings, rooms)
 * into canonical FloorPlan v1 topology passing validateFloorPlan.
 */

import type { FloorPlan, Opening, Room, Vertex, Wall } from "../types";
import { validateFloorPlan } from "../validators";
import { scaleDimension, scalePoint } from "./calibration";
import type { CalibrationResult, RawCubiCasaSemanticOutput, RawPoint } from "./types";

interface NormalizeOptions {
  name?: string;
  planId?: string;
}

function pointDistance(p1: { x: number; y: number }, p2: { x: number; y: number }): number {
  return Math.hypot(p2.x - p1.x, p2.y - p1.y);
}

function projectPointOnSegment(
  p: { x: number; y: number },
  v1: { x: number; y: number },
  v2: { x: number; y: number },
): { t: number; distance: number } {
  const dx = v2.x - v1.x;
  const dy = v2.y - v1.y;
  const lenSq = dx * dx + dy * dy;

  if (lenSq < 1e-4) {
    return { t: 0, distance: pointDistance(p, v1) };
  }

  const rawT = ((p.x - v1.x) * dx + (p.y - v1.y) * dy) / lenSq;
  const clampedT = Math.max(0, Math.min(1, rawT));
  const projX = v1.x + clampedT * dx;
  const projY = v1.y + clampedT * dy;

  return {
    t: clampedT,
    distance: pointDistance(p, { x: projX, y: projY }),
  };
}

/**
 * Normalizes raw CubiCasa prediction to canonical FloorPlan v1.
 */
export function normalizeCubiCasaToFloorPlan(
  raw: RawCubiCasaSemanticOutput,
  calibration?: CalibrationResult | null,
  options?: NormalizeOptions,
): FloorPlan {
  const isScaled = Boolean(calibration?.scaled);
  const mmPerPixel = isScaled ? (calibration?.mmPerPixel ?? 1) : 1;

  // 1. Build vertices with endpoint snapping
  // Snap tolerance: 25 mm if scaled, or 2.5 px if unscaled
  const snapDistance = isScaled ? Math.max(25, 2.5 * mmPerPixel) : 2.5;

  const vertices: Vertex[] = [];
  let vertexSeq = 1;

  function getOrCreateVertex(pt: RawPoint, excludeVertexId?: string): Vertex {
    const scaledPt = isScaled ? scalePoint(pt, mmPerPixel) : { x: Math.round(pt.x), y: Math.round(pt.y) };

    for (const v of vertices) {
      if (excludeVertexId && v.id === excludeVertexId) continue;
      if (pointDistance(v, scaledPt) <= snapDistance) {
        return v;
      }
    }

    const newVertex: Vertex = {
      id: `v-${vertexSeq++}`,
      x: scaledPt.x,
      y: scaledPt.y,
    };
    vertices.push(newVertex);
    return newVertex;
  }

  // 2. Build walls
  const walls: Wall[] = [];
  const defaultThickness = isScaled ? 200 : 20;

  for (let i = 0; i < raw.walls.length; i++) {
    const rawWall = raw.walls[i];
    const fromVertex = getOrCreateVertex(rawWall.start);
    // Don't snap the end vertex to the same from vertex (from !== to required)
    const toVertex = getOrCreateVertex(rawWall.end, fromVertex.id);

    // If still identical due to zero-length wall, nudge toVertex slightly
    let finalTo = toVertex;
    if (finalTo.id === fromVertex.id) {
      const nudgeVertex: Vertex = {
        id: `v-${vertexSeq++}`,
        x: fromVertex.x + (isScaled ? 100 : 10),
        y: fromVertex.y,
      };
      vertices.push(nudgeVertex);
      finalTo = nudgeVertex;
    }

    const thickness = rawWall.thickness
      ? scaleDimension(rawWall.thickness, mmPerPixel)
      : defaultThickness;

    // Determine lockAxis
    const dx = Math.abs(finalTo.x - fromVertex.x);
    const dy = Math.abs(finalTo.y - fromVertex.y);
    let lockAxis: Wall["lockAxis"] = "none";
    if (dy < Math.max(1, dx * 0.05)) {
      lockAxis = "horizontal";
    } else if (dx < Math.max(1, dy * 0.05)) {
      lockAxis = "vertical";
    }

    walls.push({
      id: rawWall.id || `w-${i + 1}`,
      from: fromVertex.id,
      to: finalTo.id,
      thickness: Math.max(1, thickness),
      lockAxis,
    });
  }

  const vertexMap = new Map(vertices.map((v) => [v.id, v]));
  const wallMap = new Map(walls.map((w) => [w.id, w]));

  // 3. Build openings
  const openings: Opening[] = [];

  for (let i = 0; i < raw.openings.length; i++) {
    const rawOp = raw.openings[i];
    let opCenter: { x: number; y: number };

    if (rawOp.center) {
      opCenter = isScaled
        ? scalePoint(rawOp.center, mmPerPixel)
        : { x: Math.round(rawOp.center.x), y: Math.round(rawOp.center.y) };
    } else if (rawOp.start && rawOp.end) {
      const midX = (rawOp.start.x + rawOp.end.x) / 2;
      const midY = (rawOp.start.y + rawOp.end.y) / 2;
      opCenter = isScaled
        ? scalePoint({ x: midX, y: midY }, mmPerPixel)
        : { x: Math.round(midX), y: Math.round(midY) };
    } else {
      opCenter = { x: 0, y: 0 };
    }

    // Determine host wall
    let targetWall = rawOp.attachedWallId ? wallMap.get(rawOp.attachedWallId) : undefined;
    let bestT = 0.5;

    if (!targetWall && walls.length > 0) {
      let minDist = Infinity;
      for (const w of walls) {
        const vFrom = vertexMap.get(w.from);
        const vTo = vertexMap.get(w.to);
        if (!vFrom || !vTo) continue;

        const proj = projectPointOnSegment(opCenter, vFrom, vTo);
        if (proj.distance < minDist) {
          minDist = proj.distance;
          targetWall = w;
          bestT = proj.t;
        }
      }
    } else if (targetWall) {
      const vFrom = vertexMap.get(targetWall.from);
      const vTo = vertexMap.get(targetWall.to);
      if (vFrom && vTo) {
        const proj = projectPointOnSegment(opCenter, vFrom, vTo);
        bestT = proj.t;
      }
    }

    if (!targetWall) continue;

    // Clamp position strictly to [0.05, 0.95] to prevent degenerate wall endpoints
    const clampedPos = Math.max(0.05, Math.min(0.95, Number(bestT.toFixed(3))));

    const defaultWidth = rawOp.type === "door" ? (isScaled ? 900 : 90) : isScaled ? 1200 : 120;
    const width = rawOp.width
      ? scaleDimension(rawOp.width, mmPerPixel)
      : defaultWidth;

    openings.push({
      id: rawOp.id || `op-${i + 1}`,
      type: rawOp.type || "door",
      wallId: targetWall.id,
      position: clampedPos,
      width: Math.max(10, width),
    });
  }

  // 4. Build rooms
  const rooms: Room[] = [];

  for (let i = 0; i < raw.rooms.length; i++) {
    const rawRoom = raw.rooms[i];
    const boundaryWallIds: string[] = [];

    if (rawRoom.polygon && rawRoom.polygon.length >= 3) {
      const polyScaled = rawRoom.polygon.map((p) =>
        isScaled ? scalePoint(p, mmPerPixel) : { x: Math.round(p.x), y: Math.round(p.y) },
      );

      // Match each polygon edge to the nearest wall segment
      for (let j = 0; j < polyScaled.length; j++) {
        const pA = polyScaled[j];
        const pB = polyScaled[(j + 1) % polyScaled.length];
        const edgeMid = { x: (pA.x + pB.x) / 2, y: (pA.y + pB.y) / 2 };

        let closestWall: Wall | undefined;
        let minDist = Infinity;

        for (const w of walls) {
          const vFrom = vertexMap.get(w.from);
          const vTo = vertexMap.get(w.to);
          if (!vFrom || !vTo) continue;

          const proj = projectPointOnSegment(edgeMid, vFrom, vTo);
          if (proj.distance < minDist) {
            minDist = proj.distance;
            closestWall = w;
          }
        }

        if (closestWall && (!boundaryWallIds.length || boundaryWallIds[boundaryWallIds.length - 1] !== closestWall.id)) {
          boundaryWallIds.push(closestWall.id);
        }
      }
    }

    // Ensure boundary has at least 3 walls if possible
    if (boundaryWallIds.length < 3 && walls.length >= 3) {
      // Fallback: take first 3-4 walls
      for (const w of walls) {
        if (!boundaryWallIds.includes(w.id)) {
          boundaryWallIds.push(w.id);
        }
        if (boundaryWallIds.length >= 3) break;
      }
    }

    if (boundaryWallIds.length >= 3) {
      rooms.push({
        id: rawRoom.id || `r-${i + 1}`,
        type: rawRoom.type || "other",
        name: rawRoom.name || rawRoom.type.replace(/_/g, " "),
        boundaryWallIds,
      });
    }
  }

  const nowIso = new Date().toISOString();
  const plan: FloorPlan = {
    version: 1,
    unit: "mm",
    meta: {
      id: options?.planId ?? `plan-cubicasa-${raw.imageId}`,
      name: options?.name ?? `Recognized Plan (${raw.imageId})`,
      source: "cubicasa",
      createdAt: nowIso,
      updatedAt: nowIso,
      scaled: isScaled,
      unscaled: !isScaled,
      scaleMmPerPixel: isScaled ? mmPerPixel : undefined,
    },
    vertices,
    walls,
    openings,
    rooms,
    furniture: [],
  };

  const validation = validateFloorPlan(plan);
  if (!validation.ok) {
    const errorDetails = validation.errors.map((e) => `${e.path}: ${e.message}`).join("; ");
    throw new Error(`Normalized FloorPlan failed validation: ${errorDetails}`);
  }

  return plan;
}
