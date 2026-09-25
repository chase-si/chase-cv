import {
  computeOpeningGeometry,
  computeRoomPolygon,
  computeWallGeometry,
  getVertexMap,
  getWallMap,
  type Point,
} from "../geometry";
import type { FloorPlan, FurnitureInstance, Opening, SpaceRuleConfig, Wall, Vertex } from "../types";
import { STANDARD_FURNITURE_DEFINITIONS } from "../furniture-catalog";
import {
  computeFurniturePolygon,
  computeOverlapArea,
  isPointInPolygon,
  polygonToPolygonDistance,
  polygonToSegmentDistance,
} from "./geometry";
import type { RuleResult } from "./types";

/**
 * Geometric keep-clear rectangular zone for a door opening.
 */
export interface OpeningKeepClearZone {
  openingId: string;
  wallId: string;
  depth: number;
  sideAPoints: Point[]; // +normal
  sideBPoints: Point[]; // -normal
  sideASurface: [Point, Point];
  sideBSurface: [Point, Point];
}

/**
 * Compute symmetric keep-clear rectangular zone on both sides of the wall for a door opening (AC-13).
 */
export function computeOpeningKeepClearZone(
  opening: Opening,
  wall: Wall,
  vertexMap: Map<string, Vertex>,
  depthMm = 900,
): OpeningKeepClearZone | null {
  if (opening.type !== "door") {
    return null;
  }

  const geom = computeOpeningGeometry(opening, wall, vertexMap);
  if (!geom) return null;

  const { start, end, normal, wallThickness } = geom;
  const halfT = wallThickness / 2;

  // Side A (+normal)
  const a1: Point = { x: start.x + normal.x * halfT, y: start.y + normal.y * halfT };
  const a2: Point = { x: end.x + normal.x * halfT, y: end.y + normal.y * halfT };
  const a3: Point = { x: end.x + normal.x * (halfT + depthMm), y: end.y + normal.y * (halfT + depthMm) };
  const a4: Point = { x: start.x + normal.x * (halfT + depthMm), y: start.y + normal.y * (halfT + depthMm) };

  // Side B (-normal)
  const b1: Point = { x: start.x - normal.x * halfT, y: start.y - normal.y * halfT };
  const b2: Point = { x: end.x - normal.x * halfT, y: end.y - normal.y * halfT };
  const b3: Point = { x: end.x - normal.x * (halfT + depthMm), y: end.y - normal.y * (halfT + depthMm) };
  const b4: Point = { x: start.x - normal.x * (halfT + depthMm), y: start.y - normal.y * (halfT + depthMm) };

  return {
    openingId: opening.id,
    wallId: wall.id,
    depth: depthMm,
    sideAPoints: [a1, a2, a3, a4],
    sideBPoints: [b1, b2, b3, b4],
    sideASurface: [a1, a2],
    sideBSurface: [b1, b2],
  };
}

/**
 * Geometric clearance zone on one side of a furniture instance.
 */
export interface FurnitureClearanceZone {
  furnitureId: string;
  side: "front" | "back" | "left" | "right";
  clearanceMm: number;
  zonePolygon: Point[];
  edgeSegment: [Point, Point];
}

/**
 * Compute configured clearance zones for a furniture instance (AC-13).
 */
export function computeFurnitureClearanceZones(
  furniture: FurnitureInstance,
  config?: SpaceRuleConfig,
): FurnitureClearanceZone[] {
  const def = STANDARD_FURNITURE_DEFINITIONS.find((d) => d.id === furniture.definitionId);
  const category = def?.category ?? "";

  const bedSide = config?.rules?.furnitureClearance?.bedSideClearanceMm ?? 600;
  const bedFoot = config?.rules?.furnitureClearance?.bedFootClearanceMm ?? 600;
  const wardrobeFront = config?.rules?.furnitureClearance?.wardrobeFrontClearanceMm ?? 800;
  const diningChairPullout = config?.rules?.furnitureClearance?.diningChairPulloutMm ?? 750;

  let frontClearance = 0;
  let backClearance = 0;
  let leftClearance = 0;
  let rightClearance = 0;

  const matchedSpec =
    (furniture.specificationId
      ? def?.specifications?.find((s) => s.id === furniture.specificationId)
      : undefined) ?? def?.specifications?.[0];

  if (matchedSpec && !config?.rules?.furnitureClearance) {
    frontClearance = matchedSpec.clearance.front.minimum;
    backClearance = matchedSpec.clearance.back.minimum;
    leftClearance = matchedSpec.clearance.left.minimum;
    rightClearance = matchedSpec.clearance.right.minimum;
  } else if (category === "bed" || furniture.definitionId.includes("bed")) {
    frontClearance = bedFoot;
    leftClearance = matchedSpec ? (matchedSpec.clearance.left.minimum > 0 ? bedSide : 0) : bedSide;
    rightClearance = matchedSpec ? (matchedSpec.clearance.right.minimum > 0 ? bedSide : 0) : bedSide;
  } else if (category === "storage" || furniture.definitionId.includes("wardrobe")) {
    frontClearance = wardrobeFront;
  } else if (category === "table" || furniture.definitionId.includes("dining")) {
    frontClearance = diningChairPullout;
    backClearance = diningChairPullout;
    leftClearance = diningChairPullout;
    rightClearance = diningChairPullout;
  } else if (matchedSpec) {
    frontClearance = matchedSpec.clearance.front.minimum;
    backClearance = matchedSpec.clearance.back.minimum;
    leftClearance = matchedSpec.clearance.left.minimum;
    rightClearance = matchedSpec.clearance.right.minimum;
  }

  const { x, y, width, depth, rotation } = furniture;
  const hw = width / 2;
  const hd = depth / 2;
  const rad = (rotation * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);

  const toWorld = (p: Point): Point => ({
    x: x + (p.x * cos - p.y * sin),
    y: y + (p.x * sin + p.y * cos),
  });

  const zones: FurnitureClearanceZone[] = [];

  if (frontClearance > 0) {
    const localPoly: Point[] = [
      { x: -hw, y: hd },
      { x: hw, y: hd },
      { x: hw, y: hd + frontClearance },
      { x: -hw, y: hd + frontClearance },
    ];
    zones.push({
      furnitureId: furniture.id,
      side: "front",
      clearanceMm: frontClearance,
      zonePolygon: localPoly.map(toWorld),
      edgeSegment: [toWorld({ x: -hw, y: hd }), toWorld({ x: hw, y: hd })],
    });
  }

  if (backClearance > 0) {
    const localPoly: Point[] = [
      { x: -hw, y: -hd - backClearance },
      { x: hw, y: -hd - backClearance },
      { x: hw, y: -hd },
      { x: -hw, y: -hd },
    ];
    zones.push({
      furnitureId: furniture.id,
      side: "back",
      clearanceMm: backClearance,
      zonePolygon: localPoly.map(toWorld),
      edgeSegment: [toWorld({ x: -hw, y: -hd }), toWorld({ x: hw, y: -hd })],
    });
  }

  if (leftClearance > 0) {
    const localPoly: Point[] = [
      { x: -hw - leftClearance, y: -hd },
      { x: -hw, y: -hd },
      { x: -hw, y: hd },
      { x: -hw - leftClearance, y: hd },
    ];
    zones.push({
      furnitureId: furniture.id,
      side: "left",
      clearanceMm: leftClearance,
      zonePolygon: localPoly.map(toWorld),
      edgeSegment: [toWorld({ x: -hw, y: -hd }), toWorld({ x: -hw, y: hd })],
    });
  }

  if (rightClearance > 0) {
    const localPoly: Point[] = [
      { x: hw, y: -hd },
      { x: hw + rightClearance, y: -hd },
      { x: hw + rightClearance, y: hd },
      { x: hw, y: hd },
    ];
    zones.push({
      furnitureId: furniture.id,
      side: "right",
      clearanceMm: rightClearance,
      zonePolygon: localPoly.map(toWorld),
      edgeSegment: [toWorld({ x: hw, y: -hd }), toWorld({ x: hw, y: hd })],
    });
  }

  return zones;
}

/**
 * Area threshold in mm² to distinguish real physical encroachment from touching edges.
 */
const ENCROACHMENT_AREA_THRESHOLD_MM2 = 10;

/**
 * Evaluate symmetric opening keep-clear zone violations (AC-13).
 */
export function evaluateOpeningClearanceRules(
  plan: FloorPlan,
  config?: SpaceRuleConfig,
): RuleResult[] {
  if (config?.rules?.doorSwing?.enabled === false) {
    return [];
  }

  const minDepth = config?.rules?.doorSwing?.minClearanceDepthMm ?? 900;
  const severity = config?.rules?.doorSwing?.severity ?? "warning";
  const violations: RuleResult[] = [];

  const vertexMap = getVertexMap(plan);
  const wallMap = new Map(plan.walls.map((w) => [w.id, w]));

  for (const opening of plan.openings) {
    if (opening.type !== "door") continue;

    const wall = wallMap.get(opening.wallId);
    if (!wall) continue;

    const zone = computeOpeningKeepClearZone(opening, wall, vertexMap, minDepth);
    if (!zone) continue;

    for (const furniture of plan.furniture) {
      const fPoly = computeFurniturePolygon(furniture);

      const areaA = computeOverlapArea(fPoly, zone.sideAPoints);
      const areaB = computeOverlapArea(fPoly, zone.sideBPoints);

      if (areaA > ENCROACHMENT_AREA_THRESHOLD_MM2 || areaB > ENCROACHMENT_AREA_THRESHOLD_MM2) {
        let minDist = Infinity;

        if (areaA > ENCROACHMENT_AREA_THRESHOLD_MM2) {
          const dA = polygonToSegmentDistance(fPoly, zone.sideASurface[0], zone.sideASurface[1]);
          if (dA < minDist) minDist = dA;
        }

        if (areaB > ENCROACHMENT_AREA_THRESHOLD_MM2) {
          const dB = polygonToSegmentDistance(fPoly, zone.sideBSurface[0], zone.sideBSurface[1]);
          if (dB < minDist) minDist = dB;
        }

        const measuredVal = Math.round(minDist === Infinity ? 0 : minDist);

        violations.push({
          ruleId: "opening-keep-clear",
          severity,
          relatedEntityIds: [opening.id, furniture.id],
          relatedObjectIds: [opening.id, furniture.id],
          measuredValue: measuredVal,
          recommendedValue: `${minDepth} mm`,
          title: "Opening Keep-Clear Zone",
          message: `Layout guidance: Door "${opening.id}" keep-clear zone is encroached by furniture "${furniture.id}" (${furniture.definitionId}). Clear distance is ${measuredVal} mm (recommended at least ${minDepth} mm).`,
        });
      }
    }
  }

  return violations;
}

/**
 * Evaluate configured furniture clearances (AC-13).
 */
export function evaluateFurnitureClearanceRules(
  plan: FloorPlan,
  config?: SpaceRuleConfig,
): RuleResult[] {
  if (config?.rules?.furnitureClearance?.enabled === false) {
    return [];
  }

  const severity = config?.rules?.furnitureClearance?.severity ?? "warning";
  const violations: RuleResult[] = [];
  const vertexMap = getVertexMap(plan);
  const wallMap = getWallMap(plan);

  const roomPolygons = plan.rooms
    .map((r) => ({
      room: r,
      points: computeRoomPolygon(r, wallMap, vertexMap),
    }))
    .filter((rp) => rp.points.length >= 3);

  const wallGeometries = plan.walls
    .map((w) => computeWallGeometry(w, vertexMap))
    .filter((g): g is NonNullable<typeof g> => g !== null);

  for (const furniture of plan.furniture) {
    const zones = computeFurnitureClearanceZones(furniture, config);
    const fPoly = computeFurniturePolygon(furniture);

    const containingRooms = roomPolygons
      .filter(
        (rp) =>
          isPointInPolygon({ x: furniture.x, y: furniture.y }, rp.points) ||
          fPoly.some((pt) => isPointInPolygon(pt, rp.points)),
      )
      .map((rp) => rp.room);

    const candidateWallIds =
      containingRooms.length > 0
        ? new Set(containingRooms.flatMap((r) => r.boundaryWallIds))
        : null;

    for (const zone of zones) {
      const sideName =
        zone.side === "left" || zone.side === "right" ? `${zone.side} side` : zone.side;

      // 1. Check encroachment with other furniture items
      for (const other of plan.furniture) {
        if (other.id === furniture.id) continue;

        const otherPoly = computeFurniturePolygon(other);

        // If items overlap directly, collision rule handles it
        if (computeOverlapArea(fPoly, otherPoly) > ENCROACHMENT_AREA_THRESHOLD_MM2) {
          continue;
        }

        const encroachmentArea = computeOverlapArea(zone.zonePolygon, otherPoly);
        if (encroachmentArea > ENCROACHMENT_AREA_THRESHOLD_MM2) {
          const measuredDist = Math.round(
            polygonToSegmentDistance(otherPoly, zone.edgeSegment[0], zone.edgeSegment[1]),
          );

          violations.push({
            ruleId: "furniture-clearance",
            severity,
            relatedEntityIds: [furniture.id, other.id],
            relatedObjectIds: [furniture.id, other.id],
            measuredValue: measuredDist,
            recommendedValue: `${zone.clearanceMm} mm`,
            title: "Furniture Clearance Guidance",
            message: `Layout guidance: Furniture "${furniture.id}" (${furniture.definitionId}) ${sideName} clearance is encroached by "${other.id}" (${other.definitionId}). Clear distance is ${measuredDist} mm (recommended at least ${zone.clearanceMm} mm).`,
          });
        }
      }

      // 2. Check encroachment with walls
      for (const wg of wallGeometries) {
        if (candidateWallIds && !candidateWallIds.has(wg.wall.id)) {
          continue;
        }

        // If furniture already intersects wall directly, collision rule handles it
        if (computeOverlapArea(fPoly, wg.polygonPoints) > ENCROACHMENT_AREA_THRESHOLD_MM2) {
          continue;
        }

        const encroachmentArea = computeOverlapArea(zone.zonePolygon, wg.polygonPoints);
        if (encroachmentArea > ENCROACHMENT_AREA_THRESHOLD_MM2) {
          const measuredDist = Math.round(
            polygonToSegmentDistance(wg.polygonPoints, zone.edgeSegment[0], zone.edgeSegment[1]),
          );

          violations.push({
            ruleId: "furniture-clearance",
            severity,
            relatedEntityIds: [furniture.id, wg.wall.id],
            relatedObjectIds: [furniture.id, wg.wall.id],
            measuredValue: measuredDist,
            recommendedValue: `${zone.clearanceMm} mm`,
            title: "Furniture Clearance Guidance",
            message: `Layout guidance: Furniture "${furniture.id}" (${furniture.definitionId}) ${sideName} clearance is encroached by wall "${wg.wall.id}". Clear distance is ${measuredDist} mm (recommended at least ${zone.clearanceMm} mm).`,
          });
        }
      }
    }
  }

  return violations;
}

/**
 * Evaluate configured local passage widths between adjacent objects (AC-13).
 */
export function evaluateLocalPassageRules(
  plan: FloorPlan,
  config?: SpaceRuleConfig,
): RuleResult[] {
  if (config?.rules?.circulation?.enabled === false) {
    return [];
  }

  const severity = config?.rules?.circulation?.severity ?? "warning";
  const minSecondaryPassage = config?.rules?.circulation?.minSecondaryPassageWidthMm ?? 600;
  const violations: RuleResult[] = [];
  const count = plan.furniture.length;
  const vertexMap = getVertexMap(plan);

  // 1. Passage width between two furniture items
  for (let i = 0; i < count; i++) {
    const f1 = plan.furniture[i];
    const poly1 = computeFurniturePolygon(f1);

    for (let j = i + 1; j < count; j++) {
      const f2 = plan.furniture[j];
      const poly2 = computeFurniturePolygon(f2);

      // If overlapping, collision rule handles it
      if (computeOverlapArea(poly1, poly2) > ENCROACHMENT_AREA_THRESHOLD_MM2) {
        continue;
      }

      const dist = polygonToPolygonDistance(poly1, poly2);

      // Narrow passage: gap between 0 and minSecondaryPassage
      if (dist > 0 && dist < minSecondaryPassage) {
        const measuredGap = Math.round(dist);
        violations.push({
          ruleId: "local-passage",
          severity,
          relatedEntityIds: [f1.id, f2.id],
          relatedObjectIds: [f1.id, f2.id],
          measuredValue: measuredGap,
          recommendedValue: `${minSecondaryPassage} mm`,
          title: "Local Passage Clearance",
          message: `Layout guidance: Local passage width between "${f1.id}" (${f1.definitionId}) and "${f2.id}" (${f2.definitionId}) is ${measuredGap} mm (recommended at least ${minSecondaryPassage} mm for secondary passage).`,
        });
      }
    }
  }

  // 2. Passage width between furniture and walls
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

  for (const f of plan.furniture) {
    const fPoly = computeFurniturePolygon(f);

    const containingRooms = roomPolygons
      .filter(
        (rp) =>
          isPointInPolygon({ x: f.x, y: f.y }, rp.points) ||
          fPoly.some((pt) => isPointInPolygon(pt, rp.points)),
      )
      .map((rp) => rp.room);

    const candidateWallIds =
      containingRooms.length > 0
        ? new Set(containingRooms.flatMap((r) => r.boundaryWallIds))
        : null;

    for (const wg of wallGeometries) {
      if (candidateWallIds && !candidateWallIds.has(wg.wall.id)) {
        continue;
      }

      if (computeOverlapArea(fPoly, wg.polygonPoints) > ENCROACHMENT_AREA_THRESHOLD_MM2) {
        continue;
      }

      const dist = polygonToPolygonDistance(fPoly, wg.polygonPoints);

      // If pushed directly against a wall (<= 20 mm), not considered an open passage
      if (dist > 20 && dist < minSecondaryPassage) {
        const measuredGap = Math.round(dist);
        violations.push({
          ruleId: "local-passage",
          severity,
          relatedEntityIds: [f.id, wg.wall.id],
          relatedObjectIds: [f.id, wg.wall.id],
          measuredValue: measuredGap,
          recommendedValue: `${minSecondaryPassage} mm`,
          title: "Local Passage Clearance",
          message: `Layout guidance: Local passage width between "${f.id}" (${f.definitionId}) and wall "${wg.wall.id}" is ${measuredGap} mm (recommended at least ${minSecondaryPassage} mm for secondary passage).`,
        });
      }
    }
  }

  return violations;
}
