import { describe, expect, it } from "vitest";
import {
  validateFloorPlan,
  validateFurnitureCatalog,
  validatePlacementScenario,
  validateSpaceRuleConfig,
} from "./validators";
import {
  VALID_FURNITURE_CATALOG,
  VALID_SPACE_RULE_CONFIG,
  VALID_STANDARD_FLOOR_PLAN,
} from "./fixtures";

describe("AC-17: FloorPlan v1 Contract Formats & Validators", () => {

  describe("Normalized Standard FloorPlan v1", () => {
    it("validates a valid canonical FloorPlan with real-world dimensions in mm", () => {
      const result = validateFloorPlan(VALID_STANDARD_FLOOR_PLAN);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.version).toBe(1);
        expect(result.value.unit).toBe("mm");
        expect(result.value.vertices.length).toBeGreaterThan(0);
        expect(result.value.walls.length).toBeGreaterThan(0);
        expect(result.value.rooms.length).toBeGreaterThan(0);
      }
    });

    it("rejects plans with missing or non-mm unit", () => {
      const invalid = {
        ...VALID_STANDARD_FLOOR_PLAN,
        unit: "m",
      };
      const result = validateFloorPlan(invalid);
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.errors.some((e) => e.path.includes("unit"))).toBe(true);
      }
    });

    it("rejects walls referencing non-existent vertices", () => {
      const invalid = {
        ...VALID_STANDARD_FLOOR_PLAN,
        walls: [
          {
            id: "w-bad",
            from: "non-existent-v1",
            to: "non-existent-v2",
            thickness: 120,
            lockAxis: "horizontal",
          },
        ],
      };
      const result = validateFloorPlan(invalid);
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.errors.some((e) => e.message.includes("Vertex"))).toBe(true);
      }
    });

    it("rejects openings referencing non-existent walls", () => {
      const invalid = {
        ...VALID_STANDARD_FLOOR_PLAN,
        openings: [
          {
            id: "op-bad",
            type: "door",
            wallId: "wall-that-does-not-exist",
            position: 0.5,
            width: 900,
          },
        ],
      };
      const result = validateFloorPlan(invalid);
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.errors.some((e) => e.message.includes("Wall"))).toBe(true);
      }
    });

    it("rejects openings with out-of-range position (position not in 0..1)", () => {
      const invalid = {
        ...VALID_STANDARD_FLOOR_PLAN,
        openings: [
          {
            ...VALID_STANDARD_FLOOR_PLAN.openings[0],
            position: 1.5,
          },
        ],
      };
      const result = validateFloorPlan(invalid);
      expect(result.ok).toBe(false);
    });

    it("rejects negative or zero wall thickness and opening width", () => {
      const invalidThickness = {
        ...VALID_STANDARD_FLOOR_PLAN,
        walls: [
          {
            ...VALID_STANDARD_FLOOR_PLAN.walls[0],
            thickness: 0,
          },
        ],
      };
      expect(validateFloorPlan(invalidThickness).ok).toBe(false);

      const invalidWidth = {
        ...VALID_STANDARD_FLOOR_PLAN,
        openings: [
          {
            ...VALID_STANDARD_FLOOR_PLAN.openings[0],
            width: -50,
          },
        ],
      };
      expect(validateFloorPlan(invalidWidth).ok).toBe(false);
    });

    it("rejects rooms referencing non-existent boundary walls", () => {
      const invalid = {
        ...VALID_STANDARD_FLOOR_PLAN,
        rooms: [
          {
            id: "r1",
            type: "living_room",
            name: "Living Room",
            boundaryWallIds: ["w-missing-1", "w-missing-2"],
          },
        ],
      };
      const result = validateFloorPlan(invalid);
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.errors.some((e) => e.message.includes("boundary"))).toBe(true);
      }
    });
  });

  describe("Furniture Catalog", () => {
    it("validates a standard furniture catalog using millimetres", () => {
      const result = validateFurnitureCatalog(VALID_FURNITURE_CATALOG);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.unit).toBe("mm");
        expect(result.value.definitions.length).toBeGreaterThan(0);
        for (const def of result.value.definitions) {
          expect(def.defaultSize.width).toBeGreaterThan(0);
          expect(def.defaultSize.depth).toBeGreaterThan(0);
        }
      }
    });

    it("rejects catalog with non-mm unit or negative clearance rules", () => {
      const invalidUnit = {
        ...VALID_FURNITURE_CATALOG,
        unit: "meter",
      };
      expect(validateFurnitureCatalog(invalidUnit).ok).toBe(false);

      const invalidClearance = {
        ...VALID_FURNITURE_CATALOG,
        definitions: [
          {
            ...VALID_FURNITURE_CATALOG.definitions[0],
            clearanceRules: {
              front: -200,
            },
          },
        ],
      };
      expect(validateFurnitureCatalog(invalidClearance).ok).toBe(false);
    });
  });

  describe("Space-Rule Configuration", () => {
    it("validates a space-rule configuration using millimetres", () => {
      const result = validateSpaceRuleConfig(VALID_SPACE_RULE_CONFIG);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.unit).toBe("mm");
        expect(result.value.rules.circulation.minMainPassageWidthMm).toBeGreaterThan(0);
        expect(result.value.rules.doorSwing.minClearanceDepthMm).toBeGreaterThan(0);
      }
    });

    it("rejects non-mm unit and negative threshold values", () => {
      const invalidUnit = {
        ...VALID_SPACE_RULE_CONFIG,
        unit: "cm",
      };
      expect(validateSpaceRuleConfig(invalidUnit).ok).toBe(false);

      const invalidThreshold = {
        ...VALID_SPACE_RULE_CONFIG,
        rules: {
          ...VALID_SPACE_RULE_CONFIG.rules,
          circulation: {
            ...VALID_SPACE_RULE_CONFIG.rules.circulation,
            minMainPassageWidthMm: -100,
          },
        },
      };
      expect(validateSpaceRuleConfig(invalidThreshold).ok).toBe(false);
    });
  });

  describe("PlacementScenario v1", () => {
    it("validates valid PlacementScenario with multiple placements and target placement", () => {
      const scenario = {
        version: 1,
        unit: "mm",
        planId: "floor-plan-std-01",
        placements: [
          {
            id: "p1",
            definitionId: "bed-double",
            specificationId: "bed-double-1800x2000",
            x: 1000,
            y: 1200,
            rotation: 0,
          },
          {
            id: "p2",
            definitionId: "desk",
            specificationId: "desk-1200x600",
            x: 2500,
            y: 1200,
            rotation: 90,
          },
        ],
        targetPlacementId: "p1",
      };

      const res = validatePlacementScenario(scenario);
      expect(res.ok).toBe(true);
    });

    it("rejects invalid PlacementScenario properties", () => {
      // Non-object
      expect(validatePlacementScenario(null).ok).toBe(false);
      // Wrong version
      expect(validatePlacementScenario({ version: 2, unit: "mm", planId: "p", placements: [] }).ok).toBe(false);
      // Missing planId
      expect(validatePlacementScenario({ version: 1, unit: "mm", planId: "", placements: [] }).ok).toBe(false);
      // Non-array placements
      expect(validatePlacementScenario({ version: 1, unit: "mm", planId: "p", placements: "bad" }).ok).toBe(false);
      // Duplicate placement id
      expect(
        validatePlacementScenario({
          version: 1,
          unit: "mm",
          planId: "p",
          placements: [
            { id: "p1", definitionId: "bed", specificationId: "s1", x: 0, y: 0, rotation: 0 },
            { id: "p1", definitionId: "bed", specificationId: "s2", x: 10, y: 10, rotation: 0 },
          ],
        }).ok,
      ).toBe(false);
      // Invalid rotation
      expect(
        validatePlacementScenario({
          version: 1,
          unit: "mm",
          planId: "p",
          placements: [
            { id: "p1", definitionId: "bed", specificationId: "s1", x: 0, y: 0, rotation: 45 },
          ],
        }).ok,
      ).toBe(false);
      // Non-existent targetPlacementId
      expect(
        validatePlacementScenario({
          version: 1,
          unit: "mm",
          planId: "p",
          placements: [
            { id: "p1", definitionId: "bed", specificationId: "s1", x: 0, y: 0, rotation: 0 },
          ],
          targetPlacementId: "non-existent-target",
        }).ok,
      ).toBe(false);
    });
  });
});

