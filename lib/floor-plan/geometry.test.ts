import { describe, expect, it } from "vitest";
import {
  computeFloorPlanBounds,
  computeOpeningGeometry,
  computePlanTotalArea,
  computePolygonArea,
  computePolygonCentroid,
  computePrincipalDimensions,
  computeRoomPolygon,
  computeWallGeometry,
  getVertexMap,
  getWallMap,
} from "./geometry";
import { VALID_STANDARD_FLOOR_PLAN } from "./fixtures/valid-standard-plan";
import { STUDIO_STANDARD_FLOOR_PLAN, THREE_BED_STANDARD_FLOOR_PLAN } from "./fixtures/standard-plans";

describe("FloorPlan geometry calculations", () => {
  it("computes accurate plan bounds including walls and furniture", () => {
    const bounds = computeFloorPlanBounds(VALID_STANDARD_FLOOR_PLAN);
    expect(bounds.minX).toBeLessThanOrEqual(0);
    expect(bounds.maxX).toBeGreaterThanOrEqual(6000);
    expect(bounds.minY).toBeLessThanOrEqual(0);
    expect(bounds.maxY).toBeGreaterThanOrEqual(5000);
    expect(bounds.width).toBeGreaterThanOrEqual(6000);
    expect(bounds.height).toBeGreaterThanOrEqual(5000);
  });

  it("resolves wall geometry: length, angle, normal vector, and polygon points", () => {
    const vertexMap = getVertexMap(VALID_STANDARD_FLOOR_PLAN);
    const wall1 = VALID_STANDARD_FLOOR_PLAN.walls[0]; // (0,0) to (3000, 0)
    const geom = computeWallGeometry(wall1, vertexMap);

    expect(geom).not.toBeNull();
    expect(geom!.length).toBe(3000);
    expect(geom!.angleDeg).toBe(0);
    expect(geom!.normal.x).toBeCloseTo(0);
    expect(geom!.normal.y).toBeCloseTo(1);
    expect(geom!.polygonPoints).toHaveLength(4);
  });

  it("resolves opening geometry along wall according to ratio position and width", () => {
    const vertexMap = getVertexMap(VALID_STANDARD_FLOOR_PLAN);
    const wallMap = getWallMap(VALID_STANDARD_FLOOR_PLAN);
    const opening = VALID_STANDARD_FLOOR_PLAN.openings[0]; // window on w1 at 0.5, width 1500
    const wall = wallMap.get(opening.wallId)!;

    const opGeom = computeOpeningGeometry(opening, wall, vertexMap);
    expect(opGeom).not.toBeNull();
    expect(opGeom!.center.x).toBe(1500);
    expect(opGeom!.center.y).toBe(0);
    expect(opGeom!.start.x).toBe(750);
    expect(opGeom!.end.x).toBe(2250);
    expect(opGeom!.width).toBe(1500);
  });

  it("computes ordered room polygon points and shoelace area", () => {
    const vertexMap = getVertexMap(VALID_STANDARD_FLOOR_PLAN);
    const wallMap = getWallMap(VALID_STANDARD_FLOOR_PLAN);
    const room1 = VALID_STANDARD_FLOOR_PLAN.rooms[0]; // 3000 x 5000 = 15 m²

    const polygon = computeRoomPolygon(room1, wallMap, vertexMap);
    expect(polygon.length).toBeGreaterThanOrEqual(4);

    const area = computePolygonArea(polygon);
    expect(area.areaM2).toBeCloseTo(15.0, 1);
    expect(area.formattedAreaM2).toBe("15.0 m²");

    const centroid = computePolygonCentroid(polygon);
    expect(centroid.x).toBeCloseTo(1500, -1);
    expect(centroid.y).toBeCloseTo(2500, -1);
  });

  it("refuses to reorder shuffled boundary wall IDs or fabricate polygons for unclosed wall sets (AC-16)", () => {
    const vertexMap = getVertexMap(VALID_STANDARD_FLOOR_PLAN);
    const wallMap = getWallMap(VALID_STANDARD_FLOOR_PLAN);
    const room1 = VALID_STANDARD_FLOOR_PLAN.rooms[0];

    // Shuffled boundary walls: [w1, w5, w7, w6] (non-consecutive opposite walls)
    const shuffledRoom = {
      ...room1,
      boundaryWallIds: [
        room1.boundaryWallIds[0],
        room1.boundaryWallIds[2],
        room1.boundaryWallIds[1],
        room1.boundaryWallIds[3],
      ],
    };

    expect(computeRoomPolygon(shuffledRoom, wallMap, vertexMap)).toEqual([]);

    // Open chain of 3 walls (missing closing wall w6)
    const unclosedRoom = {
      ...room1,
      boundaryWallIds: room1.boundaryWallIds.slice(0, 3),
    };

    expect(computeRoomPolygon(unclosedRoom, wallMap, vertexMap)).toEqual([]);
  });

  it("resolves all room polygons accurately in studio standard floor plan", () => {
    const vMap = getVertexMap(STUDIO_STANDARD_FLOOR_PLAN);
    const wMap = getWallMap(STUDIO_STANDARD_FLOOR_PLAN);

    const studio = STUDIO_STANDARD_FLOOR_PLAN.rooms.find((r) => r.id === "sr1")!;
    const bath = STUDIO_STANDARD_FLOOR_PLAN.rooms.find((r) => r.id === "sr2")!;

    const polyStudio = computeRoomPolygon(studio, wMap, vMap);
    expect(polyStudio.length).toBe(4);
    expect(computePolygonArea(polyStudio).areaM2).toBeCloseTo(16.0, 1);

    const polyBath = computeRoomPolygon(bath, wMap, vMap);
    expect(polyBath.length).toBe(4);
    expect(computePolygonArea(polyBath).areaM2).toBeCloseTo(8.0, 1);
  });


  it("computes total plan area across rooms", () => {
    const totalArea2Br = computePlanTotalArea(VALID_STANDARD_FLOOR_PLAN);
    expect(totalArea2Br.areaM2).toBeCloseTo(30.0, 1);

    const totalAreaStudio = computePlanTotalArea(STUDIO_STANDARD_FLOOR_PLAN);
    expect(totalAreaStudio.areaM2).toBeCloseTo(24.0, 1);

    const totalArea3Br = computePlanTotalArea(THREE_BED_STANDARD_FLOOR_PLAN);
    expect(totalArea3Br.areaM2).toBeCloseTo(63.0, 1);
  });

  it("computes principal dimension annotations for outer walls", () => {
    const dimensions = computePrincipalDimensions(VALID_STANDARD_FLOOR_PLAN);
    expect(dimensions.length).toBeGreaterThanOrEqual(2);

    const widthDim = dimensions.find((d) => d.orientation === "horizontal");
    const heightDim = dimensions.find((d) => d.orientation === "vertical");

    expect(widthDim).toBeDefined();
    expect(widthDim!.valueMm).toBe(6000);
    expect(heightDim).toBeDefined();
    expect(heightDim!.valueMm).toBe(5000);
  });
});
