import { describe, expect, it } from "vitest";
import {
  createRectangularRoomPlan,
  DEFAULT_ROOM_DEPTH_MM,
  DEFAULT_ROOM_WIDTH_MM,
  FIXED_WALL_THICKNESS_MM,
} from "./rectangular-room";
import { validateFloorPlan } from "./validators";
import {
  computePlanTotalArea,
  computePolygonArea,
  computePrincipalDimensions,
  computeRoomPolygon,
  getVertexMap,
  getWallMap,
} from "./geometry";
import { addFurnitureInstance } from "./furniture-operations";
import { getDefaultFurnitureCatalog } from "./furniture-catalog";
import { evaluatePlanRules } from "./rules/evaluator";

describe("Rectangular Room Generation & Geometry (AC-1, AC-2)", () => {
  it("AC-1: creates a valid FloorPlan v2 with default dimensions (3000 × 4000 mm), 120mm walls, and 'other' room", () => {
    const result = createRectangularRoomPlan({ locale: "zh" });
    const { plan, record } = result;

    // 1. Validation check
    const validation = validateFloorPlan(plan);
    expect(validation.ok).toBe(true);

    // 2. Default dimensions and constants
    expect(DEFAULT_ROOM_WIDTH_MM).toBe(3000);
    expect(DEFAULT_ROOM_DEPTH_MM).toBe(4000);
    expect(FIXED_WALL_THICKNESS_MM).toBe(120);

    expect(record.widthMm).toBe(3000);
    expect(record.depthMm).toBe(4000);
    expect(record.name).toBe("矩形房间 1");

    // 3. Topology structure: exactly 4 vertices, 4 walls, 0 openings, 1 room, 0 furniture
    expect(plan.vertices).toHaveLength(4);
    expect(plan.walls).toHaveLength(4);
    expect(plan.openings).toHaveLength(0);
    expect(plan.rooms).toHaveLength(1);
    expect(plan.furniture).toHaveLength(0);

    const room = plan.rooms[0];
    expect(room.type).toBe("other");
    expect(room.boundaryWallIds).toHaveLength(4);

    // 4. Source and meta
    expect(plan.meta.source).toBe("user");
    expect(plan.meta.isStandard).toBe(false);
  });

  it("AC-1: auto-names blank names sequentially and accepts custom names", () => {
    const defaultZh1 = createRectangularRoomPlan({ name: "   ", sequenceNumber: 1, locale: "zh" });
    expect(defaultZh1.record.name).toBe("矩形房间 1");

    const defaultZh2 = createRectangularRoomPlan({ sequenceNumber: 2, locale: "zh" });
    expect(defaultZh2.record.name).toBe("矩形房间 2");

    const defaultEn = createRectangularRoomPlan({ name: "", sequenceNumber: 3, locale: "en" });
    expect(defaultEn.record.name).toBe("Rectangle Room 3");

    const custom = createRectangularRoomPlan({ name: "主卧实测", widthMm: 3600, depthMm: 4200 });
    expect(custom.record.name).toBe("主卧实测");
    expect(custom.record.widthMm).toBe(3600);
    expect(custom.record.depthMm).toBe(4200);
  });

  it("AC-1: generates stable, unique IDs for custom rooms", () => {
    const roomA = createRectangularRoomPlan({});
    const roomB = createRectangularRoomPlan({});
    expect(roomA.record.id).toBeDefined();
    expect(roomB.record.id).toBeDefined();
    expect(roomA.record.id).not.toBe(roomB.record.id);
  });

  it("AC-2: offsets wall centerlines outward by half-thickness so net inner space equals exact input", () => {
    const width = 3000;
    const depth = 4000;
    const halfT = 60; // 120 / 2

    const { plan } = createRectangularRoomPlan({ widthMm: width, depthMm: depth });
    const vertexMap = getVertexMap(plan);

    // Wall centerlines should be shifted outward by half thickness (60mm)
    const vTl = vertexMap.get("v-tl");
    const vTr = vertexMap.get("v-tr");
    const vBr = vertexMap.get("v-br");
    const vBl = vertexMap.get("v-bl");

    expect(vTl).toEqual({ id: "v-tl", x: -halfT, y: -halfT });
    expect(vTr).toEqual({ id: "v-tr", x: width + halfT, y: -halfT });
    expect(vBr).toEqual({ id: "v-br", x: width + halfT, y: depth + halfT });
    expect(vBl).toEqual({ id: "v-bl", x: -halfT, y: depth + halfT });

    for (const wall of plan.walls) {
      expect(wall.thickness).toBe(120);
    }
  });

  it("AC-2: displays net area as exactly 12.0 m² for 3000 × 4000 mm room", () => {
    const { plan } = createRectangularRoomPlan({ widthMm: 3000, depthMm: 4000 });
    const totalArea = computePlanTotalArea(plan);
    expect(totalArea.areaM2).toBe(12);
    expect(totalArea.formattedAreaM2).toBe("12.0 m²");

    const vertexMap = getVertexMap(plan);
    const wallMap = getWallMap(plan);
    const room = plan.rooms[0];
    const roomPoly = computeRoomPolygon(room, wallMap, vertexMap);
    const customDim = (room as { customNetDimensions?: { widthMm: number; depthMm: number } }).customNetDimensions;
    const roomArea = computePolygonArea(roomPoly, customDim);
    expect(roomArea.areaM2).toBe(12);
    expect(roomArea.formattedAreaM2).toBe("12.0 m²");
  });

  it("AC-2: principal dimensions display net dimensions (3000 × 4000 mm) instead of outer wall envelope", () => {
    const { plan } = createRectangularRoomPlan({ widthMm: 3000, depthMm: 4000 });
    const dimensions = computePrincipalDimensions(plan);

    const widthDim = dimensions.find((d) => d.orientation === "horizontal");
    const depthDim = dimensions.find((d) => d.orientation === "vertical");

    expect(widthDim).toBeDefined();
    expect(widthDim?.valueMm).toBe(3000);
    expect(widthDim?.label).toBe("3000");

    expect(depthDim).toBeDefined();
    expect(depthDim?.valueMm).toBe(4000);
    expect(depthDim?.label).toBe("4000");
  });

  it("AC-2 & AC-3: furniture placed against inner wall face does NOT trigger wall collision, but penetrating wall does", () => {
    const { plan } = createRectangularRoomPlan({ widthMm: 3000, depthMm: 4000 });
    const catalog = getDefaultFurnitureCatalog();

    // Bed specification: width = 1800, depth = 2000.
    // Place bed against the top wall:
    // Back edge at y = 0, front edge at y = 2000, x centered at 1500 (from 600 to 2400)
    // Center is (1500, 1000)
    const addResult = addFurnitureInstance(plan, catalog, "bed-double", {
      x: 1500,
      y: 1000,
      rotation: 0,
    });
    expect(addResult.success).toBe(true);
    if (!addResult.success) {
      throw new Error("Failed to add furniture instance in test");
    }

    const planWithBed = addResult.plan;
    const rulesClean = evaluatePlanRules(planWithBed);
    const wallCollisionsClean = rulesClean.filter(
      (r) => r.ruleId === "furniture-wall-collision" || r.assessmentFinding?.kind === "wall-overlap",
    );
    expect(wallCollisionsClean).toHaveLength(0);

    // Now move bed so it penetrates the top wall (e.g. center y = 900, top edge penetrates to y = -100 into wall [-120, 0])
    const penetratedPlan = {
      ...planWithBed,
      furniture: planWithBed.furniture.map((f) => ({ ...f, y: 900 })),
    };
    const rulesPenetrated = evaluatePlanRules(penetratedPlan);
    const wallCollisionsPenetrated = rulesPenetrated.filter(
      (r) => r.ruleId === "furniture-wall-collision" || r.assessmentFinding?.kind === "wall-overlap",
    );
    expect(wallCollisionsPenetrated.length).toBeGreaterThan(0);
  });
});
