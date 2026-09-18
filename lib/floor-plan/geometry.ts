import type { FloorPlan, Opening, Room, Vertex, Wall } from "./types";

export interface Point {
  x: number;
  y: number;
}

export interface PlanBounds {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  width: number;
  height: number;
  centerX: number;
  centerY: number;
}

export interface WallGeometry {
  wall: Wall;
  from: Vertex;
  to: Vertex;
  length: number;
  angleRad: number;
  angleDeg: number;
  unit: Point;
  normal: Point;
  polygonPoints: Point[];
}

export interface OpeningGeometry {
  opening: Opening;
  center: Point;
  start: Point;
  end: Point;
  width: number;
  wallThickness: number;
  unit: Point;
  normal: Point;
  angleDeg: number;
}

export interface AreaResult {
  areaMm2: number;
  areaM2: number;
  formattedAreaM2: string;
}

export interface DimensionAnnotation {
  id: string;
  label: string;
  valueMm: number;
  start: Point;
  end: Point;
  offset: Point;
  textPoint: Point;
  orientation: "horizontal" | "vertical";
}

export function getVertexMap(plan: FloorPlan): Map<string, Vertex> {
  const map = new Map<string, Vertex>();
  for (const v of plan.vertices) {
    map.set(v.id, v);
  }
  return map;
}

export function getWallMap(plan: FloorPlan): Map<string, Wall> {
  const map = new Map<string, Wall>();
  for (const w of plan.walls) {
    map.set(w.id, w);
  }
  return map;
}

/**
 * Compute bounding box strictly across structural vertices (outer wall envelope).
 */
export function computeVertexBounds(plan: FloorPlan): PlanBounds {
  if (plan.vertices.length === 0) {
    return {
      minX: 0,
      minY: 0,
      maxX: 6000,
      maxY: 5000,
      width: 6000,
      height: 5000,
      centerX: 3000,
      centerY: 2500,
    };
  }

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const v of plan.vertices) {
    if (v.x < minX) minX = v.x;
    if (v.x > maxX) maxX = v.x;
    if (v.y < minY) minY = v.y;
    if (v.y > maxY) maxY = v.y;
  }

  const width = Math.max(1, maxX - minX);
  const height = Math.max(1, maxY - minY);

  return {
    minX,
    minY,
    maxX,
    maxY,
    width,
    height,
    centerX: minX + width / 2,
    centerY: minY + height / 2,
  };
}

/**
 * Compute the outer bounding box of the floor plan.
 * Accounts for vertices, walls, and furniture.
 */
export function computeFloorPlanBounds(plan: FloorPlan, paddingMm = 0): PlanBounds {
  if (plan.vertices.length === 0) {
    return {
      minX: 0,
      minY: 0,
      maxX: 6000,
      maxY: 5000,
      width: 6000,
      height: 5000,
      centerX: 3000,
      centerY: 2500,
    };
  }

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const v of plan.vertices) {
    if (v.x < minX) minX = v.x;
    if (v.x > maxX) maxX = v.x;
    if (v.y < minY) minY = v.y;
    if (v.y > maxY) maxY = v.y;
  }

  for (const f of plan.furniture) {
    const halfW = (f.width ?? 1000) / 2;
    const halfD = (f.depth ?? 1000) / 2;
    const extent = Math.max(halfW, halfD);
    if (f.x - extent < minX) minX = f.x - extent;
    if (f.x + extent > maxX) maxX = f.x + extent;
    if (f.y - extent < minY) minY = f.y - extent;
    if (f.y + extent > maxY) maxY = f.y + extent;
  }

  minX -= paddingMm;
  minY -= paddingMm;
  maxX += paddingMm;
  maxY += paddingMm;

  const width = Math.max(1, maxX - minX);
  const height = Math.max(1, maxY - minY);

  return {
    minX,
    minY,
    maxX,
    maxY,
    width,
    height,
    centerX: minX + width / 2,
    centerY: minY + height / 2,
  };
}

/**
 * Compute vector geometry for a wall.
 */
export function computeWallGeometry(
  wall: Wall,
  vertexMap: Map<string, Vertex>,
): WallGeometry | null {
  const from = vertexMap.get(wall.from);
  const to = vertexMap.get(wall.to);
  if (!from || !to) return null;

  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const length = Math.hypot(dx, dy);
  if (length === 0) return null;

  const angleRad = Math.atan2(dy, dx);
  const angleDeg = (angleRad * 180) / Math.PI;

  const ux = dx / length;
  const uy = dy / length;
  const nx = -uy;
  const ny = ux;

  const halfT = wall.thickness / 2;

  // 4 corners of wall rectangle
  const polygonPoints: Point[] = [
    { x: from.x + nx * halfT, y: from.y + ny * halfT },
    { x: to.x + nx * halfT, y: to.y + ny * halfT },
    { x: to.x - nx * halfT, y: to.y - ny * halfT },
    { x: from.x - nx * halfT, y: from.y - ny * halfT },
  ];

  return {
    wall,
    from,
    to,
    length,
    angleRad,
    angleDeg,
    unit: { x: ux, y: uy },
    normal: { x: nx, y: ny },
    polygonPoints,
  };
}

/**
 * Compute geometry for a wall-bound opening (door/window).
 */
export function computeOpeningGeometry(
  opening: Opening,
  wall: Wall,
  vertexMap: Map<string, Vertex>,
): OpeningGeometry | null {
  const wallGeom = computeWallGeometry(wall, vertexMap);
  if (!wallGeom) return null;

  const { from, to, unit, normal, angleDeg } = wallGeom;
  const cx = from.x + (to.x - from.x) * opening.position;
  const cy = from.y + (to.y - from.y) * opening.position;

  const halfW = opening.width / 2;
  const start: Point = {
    x: cx - unit.x * halfW,
    y: cy - unit.y * halfW,
  };
  const end: Point = {
    x: cx + unit.x * halfW,
    y: cy + unit.y * halfW,
  };

  return {
    opening,
    center: { x: cx, y: cy },
    start,
    end,
    width: opening.width,
    wallThickness: wall.thickness,
    unit,
    normal,
    angleDeg,
  };
}

/**
 * Compute ordered polygon vertex points of a room cycle.
 */
export function computeRoomPolygon(
  room: Room,
  wallMap: Map<string, Wall>,
  vertexMap: Map<string, Vertex>,
): Point[] {
  if (!room.boundaryWallIds || room.boundaryWallIds.length === 0) {
    return [];
  }

  const walls: Wall[] = [];
  const seenWallIds = new Set<string>();
  for (const id of room.boundaryWallIds) {
    if (seenWallIds.has(id)) continue;
    seenWallIds.add(id);
    const w = wallMap.get(id);
    if (w && w.from !== w.to) {
      walls.push(w);
    }
  }

  if (walls.length === 0) return [];

  if (walls.length === 1) {
    const p1 = vertexMap.get(walls[0].from);
    const p2 = vertexMap.get(walls[0].to);
    const pts: Point[] = [];
    if (p1) pts.push({ x: p1.x, y: p1.y });
    if (p2) pts.push({ x: p2.x, y: p2.y });
    return pts;
  }

  // Build adjacency graph: vertexId -> array of connected vertexIds
  const adj = new Map<string, string[]>();
  for (const w of walls) {
    if (!adj.has(w.from)) adj.set(w.from, []);
    if (!adj.has(w.to)) adj.set(w.to, []);
    const fromList = adj.get(w.from)!;
    const toList = adj.get(w.to)!;
    if (!fromList.includes(w.to)) fromList.push(w.to);
    if (!toList.includes(w.from)) toList.push(w.from);
  }

  // If there's an endpoint with degree 1 (open chain), start there; otherwise start at walls[0].from
  let startVertex = walls[0].from;
  for (const [vid, neighbors] of adj.entries()) {
    if (neighbors.length === 1) {
      startVertex = vid;
      break;
    }
  }

  const orderedVertexIds: string[] = [startVertex];
  let curr = startVertex;
  let prev: string | null = null;

  while (orderedVertexIds.length < adj.size) {
    const neighbors = adj.get(curr) || [];
    const next = neighbors.find((n) => n !== prev && !orderedVertexIds.includes(n));
    if (!next) {
      break;
    }
    orderedVertexIds.push(next);
    prev = curr;
    curr = next;
  }

  const points: Point[] = [];
  for (const vid of orderedVertexIds) {
    const v = vertexMap.get(vid);
    if (v) points.push({ x: v.x, y: v.y });
  }

  return points;
}


/**
 * Compute polygon area using the Shoelace formula.
 */
export function computePolygonArea(points: Point[]): AreaResult {
  if (points.length < 3) {
    return { areaMm2: 0, areaM2: 0, formattedAreaM2: "0.0 m²" };
  }

  let sum = 0;
  const n = points.length;
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    sum += points[i].x * points[j].y - points[j].x * points[i].y;
  }

  const areaMm2 = 0.5 * Math.abs(sum);
  const areaM2 = areaMm2 / 1_000_000;

  return {
    areaMm2,
    areaM2,
    formattedAreaM2: `${areaM2.toFixed(1)} m²`,
  };
}

/**
 * Compute centroid coordinates of a polygon.
 */
export function computePolygonCentroid(points: Point[]): Point {
  const n = points.length;
  if (n === 0) return { x: 0, y: 0 };
  if (n === 1) return { ...points[0] };
  if (n === 2) return { x: (points[0].x + points[1].x) / 2, y: (points[0].y + points[1].y) / 2 };

  let sumX = 0;
  let sumY = 0;
  let signedArea = 0;

  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    const factor = points[i].x * points[j].y - points[j].x * points[i].y;
    signedArea += factor;
    sumX += (points[i].x + points[j].x) * factor;
    sumY += (points[i].y + points[j].y) * factor;
  }

  signedArea *= 0.5;

  if (Math.abs(signedArea) < 1e-4) {
    const avgX = points.reduce((acc, p) => acc + p.x, 0) / n;
    const avgY = points.reduce((acc, p) => acc + p.y, 0) / n;
    return { x: avgX, y: avgY };
  }

  return {
    x: sumX / (6 * signedArea),
    y: sumY / (6 * signedArea),
  };
}

/**
 * Compute total area of all rooms in the floor plan.
 */
export function computePlanTotalArea(plan: FloorPlan): AreaResult {
  const wallMap = getWallMap(plan);
  const vertexMap = getVertexMap(plan);

  let totalMm2 = 0;
  for (const room of plan.rooms) {
    const poly = computeRoomPolygon(room, wallMap, vertexMap);
    const { areaMm2 } = computePolygonArea(poly);
    totalMm2 += areaMm2;
  }

  const areaM2 = totalMm2 / 1_000_000;
  return {
    areaMm2: totalMm2,
    areaM2,
    formattedAreaM2: `${areaM2.toFixed(1)} m²`,
  };
}

/**
 * Compute principal dimension annotations for the plan's overall dimensions.
 */
export function computePrincipalDimensions(plan: FloorPlan): DimensionAnnotation[] {
  const bounds = computeVertexBounds(plan);
  const annotations: DimensionAnnotation[] = [];
  const offsetMm = 600;

  // Horizontal dimension along top
  const widthMm = Math.round(bounds.width);
  annotations.push({
    id: "dim-total-width",
    label: `${widthMm}`,
    valueMm: widthMm,
    start: { x: bounds.minX, y: bounds.minY },
    end: { x: bounds.maxX, y: bounds.minY },
    offset: { x: 0, y: -offsetMm },
    textPoint: { x: bounds.centerX, y: bounds.minY - offsetMm - 80 },
    orientation: "horizontal",
  });

  // Vertical dimension along left
  const heightMm = Math.round(bounds.height);
  annotations.push({
    id: "dim-total-height",
    label: `${heightMm}`,
    valueMm: heightMm,
    start: { x: bounds.minX, y: bounds.minY },
    end: { x: bounds.minX, y: bounds.maxY },
    offset: { x: -offsetMm, y: 0 },
    textPoint: { x: bounds.minX - offsetMm - 120, y: bounds.centerY },
    orientation: "vertical",
  });

  return annotations;
}
