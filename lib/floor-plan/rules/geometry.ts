import type { Point } from "../geometry";
import { computePolygonArea } from "../geometry";
import type { FurnitureInstance } from "../types";

/**
 * Compute the 4-vertex polygon of a furniture instance's Oriented Bounding Box (OBB).
 * Rotates around center (x, y) clockwise by rotation degrees.
 */
export function computeFurniturePolygon(furniture: FurnitureInstance): Point[] {
  const { x, y, width, depth, rotation } = furniture;
  const hw = width / 2;
  const hd = depth / 2;
  const rad = (rotation * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);

  const localCorners: Point[] = [
    { x: -hw, y: -hd },
    { x: hw, y: -hd },
    { x: hw, y: hd },
    { x: -hw, y: hd },
  ];

  return localCorners.map((pt) => ({
    x: x + (pt.x * cos - pt.y * sin),
    y: y + (pt.x * sin + pt.y * cos),
  }));
}

/**
 * Test whether a 2D point is inside a polygon using the standard ray-casting algorithm.
 */
export function isPointInPolygon(point: Point, polygon: Point[]): boolean {
  if (polygon.length < 3) return false;
  let inside = false;
  const n = polygon.length;

  for (let i = 0, j = n - 1; i < n; j = i++) {
    const xi = polygon[i].x;
    const yi = polygon[i].y;
    const xj = polygon[j].x;
    const yj = polygon[j].y;

    const intersect =
      yi > point.y !== yj > point.y &&
      point.x < ((xj - xi) * (point.y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }

  return inside;
}

/**
 * Separating Axis Theorem (SAT) for convex polygons.
 * Returns true if polyA and polyB intersect (have overlap along all projection axes).
 */
export function doConvexPolygonsIntersect(
  polyA: Point[],
  polyB: Point[],
  epsilon = 1e-4,
): boolean {
  if (polyA.length < 3 || polyB.length < 3) return false;

  const polygons = [polyA, polyB];

  for (let pIdx = 0; pIdx < 2; pIdx++) {
    const poly = polygons[pIdx];
    const other = polygons[1 - pIdx];
    const n = poly.length;

    for (let i = 0; i < n; i++) {
      const p1 = poly[i];
      const p2 = poly[(i + 1) % n];

      // Edge normal vector (-dy, dx)
      const nx = -(p2.y - p1.y);
      const ny = p2.x - p1.x;
      const len = Math.hypot(nx, ny);
      if (len === 0) continue;

      const axisX = nx / len;
      const axisY = ny / len;

      // Project polyA
      let minA = Infinity;
      let maxA = -Infinity;
      for (const pt of poly) {
        const proj = pt.x * axisX + pt.y * axisY;
        if (proj < minA) minA = proj;
        if (proj > maxA) maxA = proj;
      }

      // Project polyB
      let minB = Infinity;
      let maxB = -Infinity;
      for (const pt of other) {
        const proj = pt.x * axisX + pt.y * axisY;
        if (proj < minB) minB = proj;
        if (proj > maxB) maxB = proj;
      }

      // If there is a gap along this axis, the polygons do not intersect
      if (maxA <= minB + epsilon || maxB <= minA + epsilon) {
        return false;
      }
    }
  }

  return true;
}

function getSignedArea(points: Point[]): number {
  let sum = 0;
  const n = points.length;
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    sum += points[i].x * points[j].y - points[j].x * points[i].y;
  }
  return sum / 2;
}

function ensureCounterClockwise(points: Point[]): Point[] {
  if (getSignedArea(points) < 0) {
    return [...points].reverse();
  }
  return points;
}

function lineIntersection(p1: Point, p2: Point, p3: Point, p4: Point): Point {
  const d = (p1.x - p2.x) * (p3.y - p4.y) - (p1.y - p2.y) * (p3.x - p4.x);
  if (Math.abs(d) < 1e-9) return p1;
  const t = ((p1.x - p3.x) * (p3.y - p4.y) - (p1.y - p3.y) * (p3.x - p4.x)) / d;
  return {
    x: p1.x + t * (p2.x - p1.x),
    y: p1.y + t * (p2.y - p1.y),
  };
}

/**
 * Sutherland-Hodgman convex polygon clipping.
 * Returns the intersection polygon of subject and clip polygons.
 */
export function computePolygonIntersection(
  subjectPoly: Point[],
  clipPoly: Point[],
): Point[] {
  if (subjectPoly.length < 3 || clipPoly.length < 3) return [];

  const subject = ensureCounterClockwise(subjectPoly);
  const clip = ensureCounterClockwise(clipPoly);

  let outputList = subject;

  for (let i = 0; i < clip.length; i++) {
    const cp1 = clip[i];
    const cp2 = clip[(i + 1) % clip.length];
    const inputList = outputList;
    outputList = [];

    if (inputList.length === 0) break;

    const isInside = (p: Point) =>
      (cp2.x - cp1.x) * (p.y - cp1.y) - (cp2.y - cp1.y) * (p.x - cp1.x) >= -1e-6;

    let s = inputList[inputList.length - 1];

    for (const e of inputList) {
      if (isInside(e)) {
        if (!isInside(s)) {
          outputList.push(lineIntersection(cp1, cp2, s, e));
        }
        outputList.push(e);
      } else if (isInside(s)) {
        outputList.push(lineIntersection(cp1, cp2, s, e));
      }
      s = e;
    }
  }

  return outputList;
}

/**
 * Calculate the exact overlapping area in mm² between two convex polygons.
 * Returns 0 if they do not intersect or overlap area is negligible.
 */
export function computeOverlapArea(polyA: Point[], polyB: Point[]): number {
  if (!doConvexPolygonsIntersect(polyA, polyB)) {
    return 0;
  }

  const intersection = computePolygonIntersection(polyA, polyB);
  if (intersection.length < 3) {
    return 0;
  }

  const { areaMm2 } = computePolygonArea(intersection);
  return areaMm2;
}

/**
 * Calculate minimum Euclidean distance from a point to a line segment.
 */
export function pointToSegmentDistance(p: Point, a: Point, b: Point): number {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const lenSq = dx * dx + dy * dy;

  if (lenSq === 0) {
    return Math.hypot(p.x - a.x, p.y - a.y);
  }

  const t = Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.y - a.y) * dy) / lenSq));
  const projX = a.x + t * dx;
  const projY = a.y + t * dy;

  return Math.hypot(p.x - projX, p.y - projY);
}

/**
 * Calculate minimum distance from a point to the perimeter of a polygon.
 */
export function computeMinDistanceToPolygon(point: Point, polygon: Point[]): number {
  if (polygon.length === 0) return 0;
  if (polygon.length === 1) return Math.hypot(point.x - polygon[0].x, point.y - polygon[0].y);

  let minDist = Infinity;
  const n = polygon.length;
  for (let i = 0; i < n; i++) {
    const a = polygon[i];
    const b = polygon[(i + 1) % n];
    const dist = pointToSegmentDistance(point, a, b);
    if (dist < minDist) {
      minDist = dist;
    }
  }

  return minDist;
}
