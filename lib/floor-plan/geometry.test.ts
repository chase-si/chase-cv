import { describe, expect, it } from "vitest";
import {
  computeFloorPlanBounds,
  computeOpeningGeometry,
  computePlanFitBounds,
  computePlanTotalArea,
  computePolygonArea,
  computePolygonCentroid,
  computePrincipalDimensions,
  computeRoomPolygon,
  computeRoomSpanDimensions,
  computeWallGeometry,
  getVertexMap,
  getWallMap,
} from "./geometry";
import { VALID_STANDARD_FLOOR_PLAN } from "./fixtures/valid-standard-plan";
import { STUDIO_STANDARD_FLOOR_PLAN, THREE_BED_STANDARD_FLOOR_PLAN } from "./fixtures/standard-plans";
import { FLOOR_PLAN_CATALOG_DATA } from "./catalog-data";

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

  it("annotates the width and depth of a rectangular room", () => {
    const wallMap = getWallMap(VALID_STANDARD_FLOOR_PLAN);
    const vertexMap = getVertexMap(VALID_STANDARD_FLOOR_PLAN);
    const room = VALID_STANDARD_FLOOR_PLAN.rooms.find((item) => item.id === "r1")!;
    const dimensions = computeRoomSpanDimensions(
      computeRoomPolygon(room, wallMap, vertexMap),
      "room-r1",
    );

    expect(dimensions.map((dimension) => [dimension.orientation, dimension.valueMm, dimension.id])).toEqual([
      ["horizontal", 3000, "room-r1-h-0"],
      ["vertical", 5000, "room-r1-v-0"],
    ]);
    expect(dimensions[0].start.y).toBeGreaterThan(0);
    expect(dimensions[0].start.y).toBeLessThan(5000);
    expect(dimensions[0].start.y).toBe(dimensions[0].end.y);
    expect(dimensions[1].start.x).toBeGreaterThan(0);
    expect(dimensions[1].start.x).toBeLessThan(3000);
  });

  it("annotates each bay of an L-shaped room instead of one bounding box", () => {
    const dimensions = computeRoomSpanDimensions(
      [
        { x: 0, y: 0 },
        { x: 6000, y: 0 },
        { x: 6000, y: 3000 },
        { x: 4000, y: 3000 },
        { x: 4000, y: 5000 },
        { x: 0, y: 5000 },
      ],
      "room-l",
    );

    expect(dimensions.filter((dimension) => dimension.orientation === "horizontal").map((dimension) => dimension.valueMm).sort((a, b) => a - b)).toEqual([4000, 6000]);
    expect(dimensions.filter((dimension) => dimension.orientation === "vertical").map((dimension) => dimension.valueMm).sort((a, b) => a - b)).toEqual([3000, 5000]);

    const upperWidth = dimensions.find((dimension) => dimension.valueMm === 4000 && dimension.orientation === "horizontal")!;
    expect(upperWidth.start.x).toBe(0);
    expect(upperWidth.end.x).toBe(4000);
    expect(upperWidth.start.y).toBeGreaterThan(3000);
    expect(upperWidth.start.y).toBeLessThan(5000);
  });

  it("keeps one span when a straight wall is split by an extra vertex", () => {
    const dimensions = computeRoomSpanDimensions(
      [
        { x: 0, y: 0 },
        { x: 1500, y: 0 },
        { x: 3000, y: 0 },
        { x: 3000, y: 2000 },
        { x: 0, y: 2000 },
      ],
      "room-split",
    );

    expect(dimensions.map((dimension) => [dimension.orientation, dimension.valueMm])).toEqual([
      ["horizontal", 3000],
      ["vertical", 2000],
    ]);
  });

  it("annotates both arms of a U-shaped room", () => {
    const dimensions = computeRoomSpanDimensions(
      [
        { x: 0, y: 0 },
        { x: 2000, y: 0 },
        { x: 2000, y: 3000 },
        { x: 4000, y: 3000 },
        { x: 4000, y: 0 },
        { x: 6000, y: 0 },
        { x: 6000, y: 4000 },
        { x: 0, y: 4000 },
      ],
      "room-u",
    );

    expect(
      dimensions
        .filter((dimension) => dimension.orientation === "horizontal")
        .map((dimension) => dimension.valueMm)
        .sort((a, b) => a - b),
    ).toEqual([2000, 2000, 6000]);
    expect(
      dimensions
        .filter((dimension) => dimension.orientation === "vertical")
        .map((dimension) => dimension.valueMm)
        .sort((a, b) => a - b),
    ).toEqual([1000, 4000, 4000]);
  });

  it("returns no spans for a diagonal room", () => {
    expect(
      computeRoomSpanDimensions(
        [
          { x: 0, y: 0 },
          { x: 3000, y: 0 },
          { x: 1500, y: 2000 },
        ],
        "room-diagonal",
      ),
    ).toEqual([]);
  });

  it("annotates every orthogonal catalog room", () => {
    for (const plan of FLOOR_PLAN_CATALOG_DATA) {
      const wallMap = getWallMap(plan);
      const vertexMap = getVertexMap(plan);
      for (const room of plan.rooms) {
        const points = computeRoomPolygon(room, wallMap, vertexMap);
        const dimensions = computeRoomSpanDimensions(points, room.id);
        if (points.length < 3) {
          expect(dimensions).toEqual([]);
          continue;
        }
        expect(dimensions.some((dimension) => dimension.orientation === "horizontal")).toBe(true);
        expect(dimensions.some((dimension) => dimension.orientation === "vertical")).toBe(true);
        for (const dimension of dimensions) {
          expect(dimension.valueMm).toBeGreaterThanOrEqual(150);
          expect(dimension.label).toBe(String(dimension.valueMm));
        }
      }
    }
  });

  it("computes stable plan fit bounds with padding for dimensions", () => {
    const fitBounds = computePlanFitBounds(VALID_STANDARD_FLOOR_PLAN, 800);
    expect(fitBounds.minX).toBe(-800);
    expect(fitBounds.minY).toBe(-800);
    expect(fitBounds.maxX).toBe(6400);
    expect(fitBounds.maxY).toBe(5400);
    expect(fitBounds.width).toBe(7200);
    expect(fitBounds.height).toBe(6200);
  });
});
