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
  computePolygonIntersection,
  computeMinDistanceToPolygon,
  isPointInPolygon,
} from "./rules/geometry";
import type {
  AssessmentFinding,
  AssessmentFindingKind,
  AssessmentStatus,
  ClearanceThreshold,
  FloorPlan,
  FurnitureCatalog,
  FurniturePlacement,
  FurnitureSide,
  FurnitureSpecification,
  PlacementScenario,
  SpaceAssessment,
  StandardFloorPlan,
} from "./types";

/**
 * Area threshold in mm² to distinguish real physical overlap from touching edges.
 * 10 mm² is 0.00001 m², well below meaningful furniture placement tolerances.
 */
const OVERLAP_AREA_THRESHOLD_MM2 = 10;

const ALL_SIDES: readonly FurnitureSide[] = ["front", "back", "left", "right"];

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

function normalizeThreshold(threshold?: ClearanceThreshold): ClearanceThreshold {
  const min = Math.max(0, Math.round(threshold?.minimum ?? 0));
  const rec = Math.max(min, Math.round(threshold?.recommended ?? min));
  return { minimum: min, recommended: rec };
}

/**
 * Resolves the FurnitureSpecification (dimensions + directional clearance profile) for a placement.
 */
export function resolvePlacementSpecification(
  placement: FurniturePlacement,
  catalog: FurnitureCatalog = STANDARD_FURNITURE_CATALOG,
): FurnitureSpecification {
  const def =
    catalog.definitions.find((d) => d.id === placement.definitionId) ??
    STANDARD_FURNITURE_CATALOG.definitions.find((d) => d.id === placement.definitionId);

  if (def) {
    const dimMatch = placement.specificationId?.match(/(\d+)x(\d+)/i);
    const matchedByDims = dimMatch
      ? def.specifications.find(
          (s) => s.width === parseInt(dimMatch[1], 10) && s.depth === parseInt(dimMatch[2], 10),
        )
      : undefined;

    const matchedSpec =
      def.specifications.find((s) => s.id === placement.specificationId) ??
      matchedByDims ??
      def.specifications[0];

    if (matchedSpec) {
      const overrideW =
        !def.specifications.some((s) => s.id === placement.specificationId) &&
        !matchedByDims &&
        dimMatch
          ? parseInt(dimMatch[1], 10)
          : matchedSpec.width;
      const overrideD =
        !def.specifications.some((s) => s.id === placement.specificationId) &&
        !matchedByDims &&
        dimMatch
          ? parseInt(dimMatch[2], 10)
          : matchedSpec.depth;
      return {
        ...matchedSpec,
        width: overrideW,
        depth: overrideD,
        clearance: {
          front: normalizeThreshold(matchedSpec.clearance.front),
          back: normalizeThreshold(matchedSpec.clearance.back),
          left: normalizeThreshold(matchedSpec.clearance.left),
          right: normalizeThreshold(matchedSpec.clearance.right),
        },
      };
    }

    const dims = resolveSpecificationDimensions(def, placement.specificationId);
    const frontMin = def.clearanceRules?.front ?? def.clearanceRules?.all ?? 0;
    const backMin = def.clearanceRules?.back ?? def.clearanceRules?.all ?? 0;
    const leftMin = def.clearanceRules?.left ?? def.clearanceRules?.all ?? 0;
    const rightMin = def.clearanceRules?.right ?? def.clearanceRules?.all ?? 0;

    return {
      id: placement.specificationId || `${def.id}-default`,
      name: `${dims.width} × ${dims.depth} mm`,
      width: dims.width,
      depth: dims.depth,
      height: dims.height,
      clearance: {
        front: normalizeThreshold({ minimum: frontMin, recommended: frontMin }),
        back: normalizeThreshold({ minimum: backMin, recommended: backMin }),
        left: normalizeThreshold({ minimum: leftMin, recommended: leftMin }),
        right: normalizeThreshold({ minimum: rightMin, recommended: rightMin }),
      },
    };
  }

  return {
    id: placement.specificationId || `${placement.definitionId}-default`,
    name: "1000 × 1000 mm",
    width: 1000,
    depth: 1000,
    clearance: {
      front: { minimum: 0, recommended: 0 },
      back: { minimum: 0, recommended: 0 },
      left: { minimum: 0, recommended: 0 },
      right: { minimum: 0, recommended: 0 },
    },
  };
}

export interface DirectionalClearanceZone {
  placementId: string;
  side: FurnitureSide;
  minimumMm: number;
  recommendedMm: number;
  edgeSegment: [Point, Point];
  normal: Point;
  minimumZonePolygon: Point[];
  recommendedZonePolygon: Point[];
}

function getExactTrig(rotationDeg: number): { cos: number; sin: number } {
  const rot = normalizeRotation(rotationDeg);
  if (rot === 0) return { cos: 1, sin: 0 };
  if (rot === 90) return { cos: 0, sin: 1 };
  if (rot === 180) return { cos: -1, sin: 0 };
  if (rot === 270) return { cos: 0, sin: -1 };
  const rad = (rot * Math.PI) / 180;
  return { cos: Math.cos(rad), sin: Math.sin(rad) };
}

/**
 * Computes the 4 directional clearance zones (front, back, left, right) in world coordinates,
 * rotating with the placement across 0°, 90°, 180°, and 270° (AC-8).
 */
export function computePlacementClearanceZones(
  placement: FurniturePlacement,
  catalog: FurnitureCatalog = STANDARD_FURNITURE_CATALOG,
): Record<FurnitureSide, DirectionalClearanceZone> {
  const spec = resolvePlacementSpecification(placement, catalog);
  const width = spec.width || 1000;
  const depth = spec.depth || 1000;
  const hw = width / 2;
  const hd = depth / 2;

  const { cos, sin } = getExactTrig(placement.rotation);

  const toWorld = (pt: Point): Point => ({
    x: Math.round(placement.x + (pt.x * cos - pt.y * sin)),
    y: Math.round(placement.y + (pt.x * sin + pt.y * cos)),
  });

  const rotateVec = (vec: Point): Point => ({
    x: Math.round((vec.x * cos - vec.y * sin) * 1e6) / 1e6,
    y: Math.round((vec.x * sin + vec.y * cos) * 1e6) / 1e6,
  });

  const buildSideZone = (side: FurnitureSide): DirectionalClearanceZone => {
    const threshold = normalizeThreshold(spec.clearance[side]);
    const minD = threshold.minimum;
    const recD = threshold.recommended;

    let localEdge: [Point, Point];
    let localNormal: Point;
    let buildLocalRect: (d: number) => Point[];

    switch (side) {
      case "front":
        localEdge = [
          { x: -hw, y: hd },
          { x: hw, y: hd },
        ];
        localNormal = { x: 0, y: 1 };
        buildLocalRect = (d: number) => [
          { x: -hw, y: hd },
          { x: hw, y: hd },
          { x: hw, y: hd + d },
          { x: -hw, y: hd + d },
        ];
        break;
      case "back":
        localEdge = [
          { x: -hw, y: -hd },
          { x: hw, y: -hd },
        ];
        localNormal = { x: 0, y: -1 };
        buildLocalRect = (d: number) => [
          { x: -hw, y: -hd - d },
          { x: hw, y: -hd - d },
          { x: hw, y: -hd },
          { x: -hw, y: -hd },
        ];
        break;
      case "left":
        localEdge = [
          { x: -hw, y: -hd },
          { x: -hw, y: hd },
        ];
        localNormal = { x: -1, y: 0 };
        buildLocalRect = (d: number) => [
          { x: -hw - d, y: -hd },
          { x: -hw, y: -hd },
          { x: -hw, y: hd },
          { x: -hw - d, y: hd },
        ];
        break;
      case "right":
        localEdge = [
          { x: hw, y: -hd },
          { x: hw, y: hd },
        ];
        localNormal = { x: 1, y: 0 };
        buildLocalRect = (d: number) => [
          { x: hw, y: -hd },
          { x: hw + d, y: -hd },
          { x: hw + d, y: hd },
          { x: hw, y: hd },
        ];
        break;
    }

    return {
      placementId: placement.id,
      side,
      minimumMm: minD,
      recommendedMm: recD,
      edgeSegment: [toWorld(localEdge[0]), toWorld(localEdge[1])],
      normal: rotateVec(localNormal),
      minimumZonePolygon: minD > 0 ? buildLocalRect(minD).map(toWorld) : [],
      recommendedZonePolygon: recD > 0 ? buildLocalRect(recD).map(toWorld) : [],
    };
  };

  return {
    front: buildSideZone("front"),
    back: buildSideZone("back"),
    left: buildSideZone("left"),
    right: buildSideZone("right"),
  };
}

/**
 * Computes the 4-corner polygon footprint of a placement in plan coordinates (mm).
 */
export function computePlacementFootprint(
  placement: FurniturePlacement,
  catalog: FurnitureCatalog = STANDARD_FURNITURE_CATALOG,
): Point[] {
  const spec = resolvePlacementSpecification(placement, catalog);

  const corners = computeFurniturePolygon({
    id: placement.id,
    definitionId: placement.definitionId,
    specificationId: placement.specificationId,
    x: placement.x,
    y: placement.y,
    width: spec.width || 1000,
    depth: spec.depth || 1000,
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

  const allRoomBoundaryWallIds = new Set(
    plan.rooms.flatMap((r) => r.boundaryWallIds),
  );

  // Pre-calculate footprints, clearance zones, and room containment for all placements
  const placementData = scenario.placements.map((p) => {
    const footprint = computePlacementFootprint(p, catalog);
    const clearanceZones = computePlacementClearanceZones(p, catalog);
    const center = { x: p.x, y: p.y };
    const containingRooms = roomPolygons.filter(
      (rp) =>
        isPointInPolygon(center, rp.points) ||
        footprint.some((pt) => isPointInPolygon(pt, rp.points)),
    );
    const containingRoomIds = new Set(containingRooms.map((rp) => rp.room.id));
    const candidateWallIds =
      containingRooms.length > 0
        ? new Set([
            ...containingRooms.flatMap((rp) => rp.room.boundaryWallIds),
            ...plan.walls
              .filter((w) => !allRoomBoundaryWallIds.has(w.id))
              .map((w) => w.id),
          ])
        : null;

    return {
      placement: p,
      footprint,
      clearanceZones,
      center,
      containingRoomIds,
      candidateWallIds,
    };
  });

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

  // 4. Directional Clearance Zones vs Solid Obstacles ONLY (AC-8, AC-9, AC-10, AC-12)
  // Note: Clearance zones of different furniture items are NEVER compared against each other (AC-10).
  const evaluateObstacleInClearanceZone = (
    item: (typeof placementData)[number],
    zone: DirectionalClearanceZone,
    obstaclePolygon: Point[],
    obstacleRef: { relatedPlacementId?: string; wallId?: string },
  ) => {
    if (zone.recommendedMm <= 0 || zone.recommendedZonePolygon.length < 3) {
      return;
    }

    // If solid footprint already physically collides with obstacle, collision finding takes precedence
    if (computeOverlapArea(item.footprint, obstaclePolygon) > OVERLAP_AREA_THRESHOLD_MM2) {
      return;
    }

    const encroachmentArea = computeOverlapArea(
      zone.recommendedZonePolygon,
      obstaclePolygon,
    );
    if (encroachmentArea <= OVERLAP_AREA_THRESHOLD_MM2) {
      return;
    }

    const intersection = computePolygonIntersection(
      zone.recommendedZonePolygon,
      obstaclePolygon,
    );
    if (intersection.length < 3) {
      return;
    }

    const edgeOrigin = zone.edgeSegment[0];
    const minDist = Math.min(
      ...intersection.map(
        (pt) =>
          (pt.x - edgeOrigin.x) * zone.normal.x +
          (pt.y - edgeOrigin.y) * zone.normal.y,
      ),
    );
    const measuredMm = Math.max(0, Math.round(minDist));

    const kind: AssessmentFindingKind | null =
      measuredMm < zone.minimumMm
        ? "below-minimum-clearance"
        : measuredMm < zone.recommendedMm
          ? "below-recommended-clearance"
          : null;

    if (kind) {
      addFinding({
        kind,
        placementId: item.placement.id,
        ...obstacleRef,
        side: zone.side,
        measuredMm,
        minimumMm: zone.minimumMm,
        recommendedMm: zone.recommendedMm,
      });
    }
  };

  for (const item of placementData) {
    for (const side of ALL_SIDES) {
      const zone = item.clearanceZones[side];
      if (zone.recommendedMm <= 0) continue;

      // 4a. Compare directional clearance zone against solid footprints of other furniture
      for (const other of placementData) {
        if (other.placement.id === item.placement.id) continue;

        if (
          item.containingRoomIds.size > 0 &&
          other.containingRoomIds.size > 0 &&
          ![...item.containingRoomIds].some((rid) => other.containingRoomIds.has(rid))
        ) {
          continue;
        }

        evaluateObstacleInClearanceZone(item, zone, other.footprint, {
          relatedPlacementId: other.placement.id,
        });
      }

      // 4b. Compare directional clearance zone against solid walls / room boundary walls
      for (const wg of wallGeometries) {
        if (item.candidateWallIds && !item.candidateWallIds.has(wg.wall.id)) {
          continue;
        }

        evaluateObstacleInClearanceZone(item, zone, wg.polygonPoints, {
          wallId: wg.wall.id,
        });
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
