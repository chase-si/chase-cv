import {
  computeRoomPolygon,
  computeWallGeometry,
  getVertexMap,
  getWallMap,
} from "../geometry";
import type { FloorPlan, SpaceRuleConfig } from "../types";
import {
  computeFurniturePolygon,
  computeMinDistanceToPolygon,
  computeOverlapArea,
  isPointInPolygon,
} from "./geometry";
import type { RuleResult } from "./types";

/**
 * Area threshold in mm² to distinguish real physical overlap from touching edges.
 * 10 mm² is 0.00001 m², well below meaningful furniture placement tolerances.
 */
const OVERLAP_AREA_THRESHOLD_MM2 = 10;

/**
 * Evaluate boundary violations (AC-12, AC-14).
 * Detects furniture items placed outside room boundaries.
 */
export function evaluateFurnitureBoundaryRules(
  plan: FloorPlan,
  _config?: SpaceRuleConfig,
): RuleResult[] {
  const violations: RuleResult[] = [];

  if (plan.furniture.length === 0) {
    return violations;
  }

  // If plan has no rooms defined, all furniture is outside room boundaries
  if (plan.rooms.length === 0) {
    for (const f of plan.furniture) {
      violations.push({
        ruleId: "furniture-boundary",
        severity: "error",
        relatedEntityIds: [f.id],
        relatedObjectIds: [f.id],
        measuredValue: 0,
        recommendedValue: "Inside room",
        title: "Boundary Violation",
        message: `Furniture "${f.id}" (${f.definitionId}) is placed outside room boundaries (no rooms defined in plan).`,
      });
    }
    return violations;
  }

  const wallMap = getWallMap(plan);
  const vertexMap = getVertexMap(plan);

  const roomPolygons = plan.rooms
    .map((r) => ({
      room: r,
      points: computeRoomPolygon(r, wallMap, vertexMap),
    }))
    .filter((rp) => rp.points.length >= 3);

  if (roomPolygons.length === 0) {
    for (const f of plan.furniture) {
      violations.push({
        ruleId: "furniture-boundary",
        severity: "error",
        relatedEntityIds: [f.id],
        relatedObjectIds: [f.id],
        measuredValue: 0,
        recommendedValue: "Inside room",
        title: "Boundary Violation",
        message: `Furniture "${f.id}" (${f.definitionId}) is placed outside room boundaries.`,
      });
    }
    return violations;
  }

  for (const f of plan.furniture) {
    const fCenter = { x: f.x, y: f.y };
    const fPoly = computeFurniturePolygon(f);

    const isCenterInside = roomPolygons.some((rp) =>
      isPointInPolygon(fCenter, rp.points),
    );

    const anyCornerInside = roomPolygons.some((rp) =>
      fPoly.some((pt) => isPointInPolygon(pt, rp.points)),
    );

    // If neither center nor corners are in any room polygon, furniture is outside room boundaries
    if (!isCenterInside && !anyCornerInside) {
      let minDist = Infinity;
      for (const rp of roomPolygons) {
        const d = computeMinDistanceToPolygon(fCenter, rp.points);
        if (d < minDist) {
          minDist = d;
        }
      }

      const measuredDist = Math.round(minDist);

      violations.push({
        ruleId: "furniture-boundary",
        severity: "error",
        relatedEntityIds: [f.id],
        relatedObjectIds: [f.id],
        measuredValue: measuredDist,
        recommendedValue: "Inside room",
        title: "Boundary Violation",
        message: `Furniture "${f.id}" (${f.definitionId}) is placed outside room boundaries by ${measuredDist} mm. Move it inside an enclosed room.`,
      });
    }
  }

  return violations;
}

/**
 * Evaluate furniture-wall collision violations (AC-12, AC-14).
 * Detects furniture items intersecting structural walls.
 */
export function evaluateFurnitureWallCollisionRules(
  plan: FloorPlan,
  config?: SpaceRuleConfig,
): RuleResult[] {
  if (config?.rules?.collision?.enabled === false) {
    return [];
  }

  const severity = config?.rules?.collision?.severity ?? "error";
  const violations: RuleResult[] = [];
  const vertexMap = getVertexMap(plan);

  const wallGeometries = plan.walls
    .map((w) => computeWallGeometry(w, vertexMap))
    .filter((g): g is NonNullable<typeof g> => g !== null);

  for (const f of plan.furniture) {
    const fPoly = computeFurniturePolygon(f);

    for (const wg of wallGeometries) {
      const overlapArea = computeOverlapArea(fPoly, wg.polygonPoints);
      if (overlapArea > OVERLAP_AREA_THRESHOLD_MM2) {
        const measuredVal = Math.round(overlapArea);
        violations.push({
          ruleId: "furniture-wall-collision",
          severity,
          relatedEntityIds: [f.id, wg.wall.id],
          relatedObjectIds: [f.id, wg.wall.id],
          measuredValue: measuredVal,
          recommendedValue: "0 mm²",
          title: "Wall Collision",
          message: `Furniture "${f.id}" (${f.definitionId}) intersects wall "${wg.wall.id}" by ${measuredVal} mm². Reposition furniture away from wall.`,
        });
      }
    }
  }

  return violations;
}

/**
 * Evaluate furniture-furniture overlap violations (AC-12, AC-14).
 * Detects any two furniture items whose bounding areas collide.
 */
export function evaluateFurnitureOverlapRules(
  plan: FloorPlan,
  config?: SpaceRuleConfig,
): RuleResult[] {
  if (config?.rules?.collision?.enabled === false) {
    return [];
  }

  const severity = config?.rules?.collision?.severity ?? "error";
  const violations: RuleResult[] = [];
  const count = plan.furniture.length;

  for (let i = 0; i < count; i++) {
    const f1 = plan.furniture[i];
    const poly1 = computeFurniturePolygon(f1);

    for (let j = i + 1; j < count; j++) {
      const f2 = plan.furniture[j];
      const poly2 = computeFurniturePolygon(f2);

      const overlapArea = computeOverlapArea(poly1, poly2);
      if (overlapArea > OVERLAP_AREA_THRESHOLD_MM2) {
        const measuredVal = Math.round(overlapArea);
        violations.push({
          ruleId: "furniture-overlap",
          severity,
          relatedEntityIds: [f1.id, f2.id],
          relatedObjectIds: [f1.id, f2.id],
          measuredValue: measuredVal,
          recommendedValue: "0 mm²",
          title: "Furniture Overlap",
          message: `Furniture "${f1.id}" (${f1.definitionId}) overlaps with "${f2.id}" (${f2.definitionId}) by ${measuredVal} mm². Reposition furniture to avoid overlapping.`,
        });
      }
    }
  }

  return violations;
}

/**
 * Deterministic Spatial Rule Evaluator (AC-12, AC-14).
 * Pure function evaluating all spatial constraints on a floor plan.
 */
export function evaluatePlanRules(
  plan: FloorPlan,
  config?: SpaceRuleConfig,
): RuleResult[] {
  const boundaryViolations = evaluateFurnitureBoundaryRules(plan, config);
  const wallViolations = evaluateFurnitureWallCollisionRules(plan, config);
  const overlapViolations = evaluateFurnitureOverlapRules(plan, config);

  const all = [...boundaryViolations, ...wallViolations, ...overlapViolations];

  // Deterministic sorting by severity ("error" -> "warning" -> "info"), then ruleId, then first entity id
  const severityOrder: Record<string, number> = { error: 0, warning: 1, info: 2 };

  return all.sort((a, b) => {
    const sDiff = (severityOrder[a.severity] ?? 9) - (severityOrder[b.severity] ?? 9);
    if (sDiff !== 0) return sDiff;
    const rDiff = a.ruleId.localeCompare(b.ruleId);
    if (rDiff !== 0) return rDiff;
    const idA = a.relatedEntityIds[0] ?? "";
    const idB = b.relatedEntityIds[0] ?? "";
    return idA.localeCompare(idB);
  });
}
