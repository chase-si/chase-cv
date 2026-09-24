import {
  computeRoomPolygon,
  computeWallGeometry,
  getVertexMap,
  getWallMap,
  type Point,
} from "./geometry";
import {
  STANDARD_FURNITURE_CATALOG,
  resolveSpecificationDimensions,
} from "./furniture-catalog";
import { normalizeRotation } from "./placement-scenario";
import {
  computeFurniturePolygon,
  computeOverlapArea,
  computeMinDistanceToPolygon,
  isPointInPolygon,
} from "./rules/geometry";
import type {
  AssessmentFinding,
  AssessmentFindingKind,
  AssessmentStatus,
  FloorPlan,
  FurnitureCatalog,
  FurniturePlacement,
  FurnitureSide,
  PlacementScenario,
  SpaceAssessment,
  StandardFloorPlan,
} from "./types";

/**
 * Area threshold in mm² to distinguish real physical overlap from touching edges.
 * 10 mm² is 0.00001 m², well below meaningful furniture placement tolerances.
 */
const OVERLAP_AREA_THRESHOLD_MM2 = 10;

const KIND_ORDER: Record<AssessmentFindingKind, number> = {
  "furniture-overlap": 0,
  "wall-overlap": 1,
  "outside-room": 2,
  "below-minimum-clearance": 3,
  "below-recommended-clearance": 4,
};

const SIDE_ORDER: Record<FurnitureSide, number> = {
  front: 0,
  back: 1,
  left: 2,
  right: 3,
};

/**
 * Deterministic finding sort comparator (AC-22).
 * Ensures findings are returned in a strictly reproducible order across runs.
 */
export function compareAssessmentFindings(
  a: AssessmentFinding,
  b: AssessmentFinding,
): number {
  // 1. placementId (alphabetical)
  const pDiff = a.placementId.localeCompare(b.placementId);
  if (pDiff !== 0) return pDiff;

  // 2. kind (priority order)
  const kDiff = (KIND_ORDER[a.kind] ?? 99) - (KIND_ORDER[b.kind] ?? 99);
  if (kDiff !== 0) return kDiff;

  // 3. relatedPlacementId (alphabetical)
  const rDiff = (a.relatedPlacementId ?? "").localeCompare(b.relatedPlacementId ?? "");
  if (rDiff !== 0) return rDiff;

  // 4. wallId (alphabetical)
  const wDiff = (a.wallId ?? "").localeCompare(b.wallId ?? "");
  if (wDiff !== 0) return wDiff;

  // 5. side (cardinal order)
  const sA = a.side ? SIDE_ORDER[a.side] ?? 99 : 99;
  const sB = b.side ? SIDE_ORDER[b.side] ?? 99 : 99;
  if (sA !== sB) return sA - sB;

  // 6. measuredMm (numerical ascending)
  const mA = a.measuredMm ?? 0;
  const mB = b.measuredMm ?? 0;
  if (mA !== mB) return mA - mB;

  // 7. minimumMm (numerical ascending)
  const minA = a.minimumMm ?? 0;
  const minB = b.minimumMm ?? 0;
  if (minA !== minB) return minA - minB;

  // 8. recommendedMm (numerical ascending)
  const recA = a.recommendedMm ?? 0;
  const recB = b.recommendedMm ?? 0;
  return recA - recB;
}

/**
 * Checks whether a floor plan is uncalibrated/unscaled (AC-14).
 */
function isPlanUnscaled(plan: FloorPlan | StandardFloorPlan): boolean {
  return plan.meta?.unscaled === true || (plan.meta as { scaled?: boolean })?.scaled === false;
}

/**
 * Computes the 4-corner polygon footprint of a placement in plan coordinates (mm).
 */
export function computePlacementFootprint(
  placement: FurniturePlacement,
  catalog: FurnitureCatalog = STANDARD_FURNITURE_CATALOG,
): Point[] {
  const def = catalog.definitions.find((d) => d.id === placement.definitionId);
  const dims = def
    ? resolveSpecificationDimensions(def, placement.specificationId)
    : { width: 1000, depth: 1000 };

  const corners = computeFurniturePolygon({
    id: placement.id,
    definitionId: placement.definitionId,
    specificationId: placement.specificationId,
    x: placement.x,
    y: placement.y,
    width: dims.width || 1000,
    depth: dims.depth || 1000,
    rotation: normalizeRotation(placement.rotation),
  });

  return corners.map((pt) => ({
    x: Math.round(pt.x),
    y: Math.round(pt.y),
  }));
}

/**
 * Computes the minimum penetration depth (in mm) between two intersecting convex polygons using SAT.
 */
export function computePolygonPenetrationDepth(
  polyA: Point[],
  polyB: Point[],
): number {
  if (polyA.length < 3 || polyB.length < 3) return 0;
  const polygons = [polyA, polyB];
  let minOverlap = Infinity;

  for (let pIdx = 0; pIdx < 2; pIdx++) {
    const poly = polygons[pIdx];
    const other = polygons[1 - pIdx];
    const n = poly.length;

    for (let i = 0; i < n; i++) {
      const p1 = poly[i];
      const p2 = poly[(i + 1) % n];

      const nx = -(p2.y - p1.y);
      const ny = p2.x - p1.x;
      const len = Math.hypot(nx, ny);
      if (len === 0) continue;

      const axisX = nx / len;
      const axisY = ny / len;

      let minA = Infinity;
      let maxA = -Infinity;
      for (const pt of poly) {
        const proj = pt.x * axisX + pt.y * axisY;
        if (proj < minA) minA = proj;
        if (proj > maxA) maxA = proj;
      }

      let minB = Infinity;
      let maxB = -Infinity;
      for (const pt of other) {
        const proj = pt.x * axisX + pt.y * axisY;
        if (proj < minB) minB = proj;
        if (proj > maxB) maxB = proj;
      }

      const overlap = Math.min(maxA, maxB) - Math.max(minA, minB);
      if (overlap <= 1e-4) {
        return 0;
      }
      if (overlap < minOverlap) {
        minOverlap = overlap;
      }
    }
  }

  return minOverlap === Infinity ? 0 : minOverlap;
}

export interface SpaceAssessmentOptions {
  focusRoomId?: string;
  targetPlacementId?: string;
  includeAllPlacements?: boolean;
}

/**
 * Evaluates physical space assessment for a placement scenario on a standard plan (AC-7, AC-14, AC-22).
 *
 * Status Precedence:
 * 1. Unscaled plan: "unavailable" (AC-14).
 * 2. Any physical collision ("furniture-overlap", "wall-overlap", "outside-room") or below-min: "must-adjust" (AC-7).
 * 3. Below recommended clearance: "trade-off" (Contract Section 4).
 * 4. No findings: "suitable".
 */
export function assessPlacementScenario(
  plan: StandardFloorPlan | FloorPlan,
  scenario: PlacementScenario,
  catalog: FurnitureCatalog = STANDARD_FURNITURE_CATALOG,
  options: SpaceAssessmentOptions = {},
): SpaceAssessment {
  const unscaled = isPlanUnscaled(plan);

  // Determine target placement filter
  const targetId =
    options.targetPlacementId !== undefined
      ? options.targetPlacementId
      : options.includeAllPlacements
        ? undefined
        : scenario.targetPlacementId;

  if (scenario.placements.length === 0) {
    return {
      status: unscaled ? "unavailable" : "suitable",
      findings: [],
    };
  }

  // Pre-calculate footprints and bounding data for all placements
  const placementData = scenario.placements.map((p) => {
    const footprint = computePlacementFootprint(p, catalog);
    return {
      placement: p,
      footprint,
      center: { x: p.x, y: p.y },
    };
  });

  const vertexMap = getVertexMap(plan);
  const wallMap = getWallMap(plan);

  const wallGeometries = plan.walls
    .map((w) => computeWallGeometry(w, vertexMap))
    .filter((g): g is NonNullable<typeof g> => g !== null);

  const roomPolygons = plan.rooms
    .map((r) => ({
      room: r,
      points: computeRoomPolygon(r, wallMap, vertexMap),
    }))
    .filter((rp) => rp.points.length >= 3);

  const rawFindings: AssessmentFinding[] = [];
  const findingKeys = new Set<string>();

  const addFinding = (finding: AssessmentFinding) => {
    const key = `${finding.placementId}:${finding.kind}:${finding.relatedPlacementId ?? ""}:${finding.wallId ?? ""}:${finding.side ?? ""}`;
    if (!findingKeys.has(key)) {
      findingKeys.add(key);
      rawFindings.push(finding);
    }
  };

  // 1. Furniture Footprint vs Furniture Footprint (furniture-overlap)
  const pCount = placementData.length;
  for (let i = 0; i < pCount; i++) {
    const itemA = placementData[i];
    for (let j = i + 1; j < pCount; j++) {
      const itemB = placementData[j];
      const overlapArea = computeOverlapArea(itemA.footprint, itemB.footprint);
      if (overlapArea > OVERLAP_AREA_THRESHOLD_MM2) {
        const penetration = Math.max(
          1,
          Math.round(computePolygonPenetrationDepth(itemA.footprint, itemB.footprint)),
        );
        addFinding({
          kind: "furniture-overlap",
          placementId: itemA.placement.id,
          relatedPlacementId: itemB.placement.id,
          measuredMm: penetration,
        });
        addFinding({
          kind: "furniture-overlap",
          placementId: itemB.placement.id,
          relatedPlacementId: itemA.placement.id,
          measuredMm: penetration,
        });
      }
    }
  }

  // 2. Furniture Footprint vs Walls (wall-overlap)
  for (const item of placementData) {
    for (const wg of wallGeometries) {
      const overlapArea = computeOverlapArea(item.footprint, wg.polygonPoints);
      if (overlapArea > OVERLAP_AREA_THRESHOLD_MM2) {
        const penetration = Math.max(
          1,
          Math.round(computePolygonPenetrationDepth(item.footprint, wg.polygonPoints)),
        );
        addFinding({
          kind: "wall-overlap",
          placementId: item.placement.id,
          wallId: wg.wall.id,
          measuredMm: penetration,
        });
      }
    }
  }

  // 3. Furniture Footprint vs Room Boundary (outside-room)
  if (roomPolygons.length === 0) {
    for (const item of placementData) {
      addFinding({
        kind: "outside-room",
        placementId: item.placement.id,
        measuredMm: 0,
      });
    }
  } else {
    const focusRp = options.focusRoomId
      ? roomPolygons.find((rp) => rp.room.id === options.focusRoomId)
      : undefined;

    for (const item of placementData) {
      const containingRooms = roomPolygons.filter((rp) =>
        isPointInPolygon(item.center, rp.points),
      );

      if (containingRooms.length === 0) {
        // Center is completely outside all rooms
        const referenceRooms = focusRp ? [focusRp] : roomPolygons;
        const minDist = Math.min(
          ...referenceRooms.map((rp) => computeMinDistanceToPolygon(item.center, rp.points)),
        );
        addFinding({
          kind: "outside-room",
          placementId: item.placement.id,
          measuredMm: Math.max(1, Math.round(minDist)),
        });
      } else {
        // Center is inside at least one room; verify all corners lie inside the same containing room
        const isFullyContainedInSingleRoom = containingRooms.some((rp) =>
          item.footprint.every((c) => isPointInPolygon(c, rp.points)),
        );

        if (!isFullyContainedInSingleRoom) {
          const minProtrusionDist = Math.min(
            ...containingRooms.map((rp) => {
              const cornersOutside = item.footprint.filter(
                (c) => !isPointInPolygon(c, rp.points),
              );
              return Math.max(
                ...cornersOutside.map((c) => computeMinDistanceToPolygon(c, rp.points)),
              );
            }),
          );
          addFinding({
            kind: "outside-room",
            placementId: item.placement.id,
            measuredMm: Math.max(1, Math.round(minProtrusionDist)),
          });
        }
      }
    }
  }

  // Filter findings according to target placement if active
  const filteredFindings = targetId
    ? rawFindings.filter((f) => f.placementId === targetId)
    : rawFindings;

  // Sort findings deterministically (AC-22)
  const sortedFindings = [...filteredFindings].sort(compareAssessmentFindings);

  // Determine status by precedence
  let status: AssessmentStatus = "suitable";
  if (unscaled) {
    status = "unavailable";
  } else {
    const hasPhysicalCollision = sortedFindings.some(
      (f) =>
        f.kind === "furniture-overlap" ||
        f.kind === "wall-overlap" ||
        f.kind === "outside-room",
    );
    const hasBelowMin = sortedFindings.some((f) => f.kind === "below-minimum-clearance");
    const hasBelowRec = sortedFindings.some((f) => f.kind === "below-recommended-clearance");

    if (hasPhysicalCollision || hasBelowMin) {
      status = "must-adjust";
    } else if (hasBelowRec) {
      status = "trade-off";
    } else {
      status = "suitable";
    }
  }

  return {
    status,
    findings: sortedFindings,
  };
}
