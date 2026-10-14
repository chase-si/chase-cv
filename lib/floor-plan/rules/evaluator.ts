import {
  computeRoomPolygon,
  computeWallGeometry,
  getVertexMap,
  getWallMap,
} from "../geometry";
import type { AssessmentFindingKind, FloorPlan, SpaceAssessment, SpaceRuleConfig } from "../types";
import { assessPlacementScenario } from "../space-assessment";
import { floorPlanToPlacementScenario } from "../placement-scenario";
import {
  computeFurniturePolygon,
  computeMinDistanceToPolygon,
  computeOverlapArea,
  isPointInPolygon,
} from "./geometry";
import {
  evaluateFurnitureClearanceRules,
  evaluateLocalPassageRules,
  evaluateOpeningClearanceRules,
} from "./clearance";
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
 * Check if a plan is uncalibrated/unscaled (AC-21).
 */
export function isPlanUnscaled(plan: FloorPlan): boolean {
  return plan.meta?.unscaled === true || (plan.meta as { scaled?: boolean })?.scaled === false;
}

/**
 * Deterministic Spatial Rule Evaluator (AC-12, AC-14, AC-21).
 * Pure function evaluating spatial constraints on a floor plan.
 * Suppresses dimension-dependent clearance conclusions for unscaled plans.
 */
export function evaluatePlanRules(
  plan: FloorPlan,
  config?: SpaceRuleConfig,
): RuleResult[] {
  // The product's default checks use the specification's minimum AND recommended
  // directional clearances. Explicit legacy configuration retains its own thresholds.
  if (!config) return evaluateCatalogPlanRules(plan);

  const boundaryViolations = evaluateFurnitureBoundaryRules(plan, config);
  const wallViolations = evaluateFurnitureWallCollisionRules(plan, config);
  const overlapViolations = evaluateFurnitureOverlapRules(plan, config);

  // For unscaled plans, suppress dimension-dependent clearance conclusions (AC-21)
  const unscaled = isPlanUnscaled(plan);
  const openingViolations = unscaled ? [] : evaluateOpeningClearanceRules(plan, config);
  const furnitureClearanceViolations = unscaled ? [] : evaluateFurnitureClearanceRules(plan, config);
  const passageViolations = unscaled ? [] : evaluateLocalPassageRules(plan, config);

  const all = [
    ...boundaryViolations,
    ...wallViolations,
    ...overlapViolations,
    ...openingViolations,
    ...furnitureClearanceViolations,
    ...passageViolations,
  ];

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

const FINDING_RULE_IDS: Record<AssessmentFindingKind, string> = {
  "furniture-overlap": "furniture-overlap",
  "wall-overlap": "furniture-wall-collision",
  "outside-room": "furniture-boundary",
  "below-minimum-clearance": "furniture-clearance",
  "below-recommended-clearance": "furniture-clearance",
};

const FINDING_TITLES: Record<AssessmentFindingKind, string> = {
  "furniture-overlap": "Furniture Overlap",
  "wall-overlap": "Wall Collision",
  "outside-room": "Outside Room Boundary",
  "below-minimum-clearance": "Below Minimum Clearance",
  "below-recommended-clearance": "Below Recommended Clearance",
};

function evaluateCatalogPlanRules(plan: FloorPlan): RuleResult[] {
  const assessment = assessPlacementScenario(plan, floorPlanToPlacementScenario(plan), undefined, {
    includeAllPlacements: true,
  });
  const issues: RuleResult[] = [];
  const seenOverlaps = new Set<string>();
  for (const finding of assessment.findings) {
    // The domain emits one finding for each participant; the whole-plan list
    // counts a physical overlap once while both pieces keep their alert marker.
    if (finding.kind === "furniture-overlap" && finding.relatedPlacementId) {
      const pairKey = JSON.stringify([finding.placementId, finding.relatedPlacementId].sort());
      if (seenOverlaps.has(pairKey)) continue;
      seenOverlaps.add(pairKey);
    }
    const relatedEntityIds = [finding.placementId,
      ...(finding.relatedPlacementId ? [finding.relatedPlacementId] : []),
      ...(finding.wallId ? [finding.wallId] : [])];
    if (finding.kind === "furniture-overlap") {
      relatedEntityIds.sort((a, b) => plan.furniture.findIndex((f) => f.id === a) - plan.furniture.findIndex((f) => f.id === b));
    }
    const affectedFurnitureIds = finding.kind === "furniture-overlap"
      ? [finding.placementId, finding.relatedPlacementId!]
      : [finding.placementId];
    issues.push({
      ruleId: FINDING_RULE_IDS[finding.kind],
      severity: finding.kind === "below-recommended-clearance" ? "warning" : "error",
      relatedEntityIds,
      relatedObjectIds: relatedEntityIds,
      affectedFurnitureIds,
      assessmentFinding: finding,
      measuredValue: finding.measuredMm,
      recommendedValue: finding.recommendedMm ?? 0,
      title: FINDING_TITLES[finding.kind],
      message: `Layout guidance: Furniture "${finding.placementId}" ${finding.kind === "outside-room"
        ? "is outside room boundaries" : finding.kind === "wall-overlap"
          ? `intersects wall "${finding.wallId}"` : finding.kind === "furniture-overlap"
            ? `overlaps furniture "${finding.relatedPlacementId}"` : `${finding.side} clearance is below ${finding.kind === "below-minimum-clearance" ? "minimum" : "recommended"} threshold`}.`,
    });
  }
  // Only actual door approach/swing zones are passage checks. A small gap
  // beside a wall or another item does not establish that it is a walking route.
  if (!isPlanUnscaled(plan)) issues.push(...evaluateOpeningClearanceRules(plan));
  const severityOrder = { error: 0, warning: 1, info: 2 };
  return issues.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity] ||
    a.ruleId.localeCompare(b.ruleId) || a.relatedEntityIds.join(":").localeCompare(b.relatedEntityIds.join(":")));
}

/** One status policy for the list, layout summary and each furniture marker. */
export function assessmentFromRuleResults(
  plan: FloorPlan,
  results: RuleResult[],
  furnitureId?: string,
): SpaceAssessment {
  const relevant = furnitureId
    ? results.filter((r) => (r.affectedFurnitureIds ?? r.relatedEntityIds).includes(furnitureId))
    : results;
  const findings = relevant.flatMap((r) => {
    if (!r.assessmentFinding) return [];
    const f = r.assessmentFinding;
    // Restore the target's side of a deduplicated symmetric overlap.
    return [furnitureId && f.kind === "furniture-overlap" && f.placementId !== furnitureId
      ? { ...f, placementId: furnitureId, relatedPlacementId: f.placementId }
      : f];
  });
  return {
    status: isPlanUnscaled(plan) ? "unavailable"
      : relevant.some((r) => r.severity === "error") ? "must-adjust"
      : relevant.some((r) => r.severity === "warning") ? "trade-off" : "suitable",
    findings,
  };
}
