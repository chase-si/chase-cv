import { describe, expect, it } from "vitest";
import type { FloorPlan, SpaceRuleConfig } from "../types";
import { VALID_SPACE_RULE_CONFIG } from "../fixtures/valid-space-rules";
import {
  evaluateOpeningClearanceRules,
  evaluateFurnitureClearanceRules,
  evaluateLocalPassageRules,
} from "./clearance";
import { evaluatePlanRules } from "./evaluator";

describe("Clearance and Guidance Rules (US-13, AC-13)", () => {
  // Base 6000x6000 room with wall at y=3000
  const createTestPlan = (): FloorPlan => ({
    version: 1,
    unit: "mm",
    meta: {
      name: "Clearance Test Plan",
      source: "user",
      createdAt: "2026-09-18T00:00:00.000Z",
      updatedAt: "2026-09-18T00:00:00.000Z",
    },
    vertices: [
      { id: "v1", x: 0, y: 0 },
      { id: "v2", x: 6000, y: 0 },
      { id: "v3", x: 6000, y: 6000 },
      { id: "v4", x: 0, y: 6000 },
    ],
    walls: [
      { id: "w_top", from: "v1", to: "v2", thickness: 200, lockAxis: "horizontal" },
      { id: "w_right", from: "v2", to: "v3", thickness: 200, lockAxis: "vertical" },
      { id: "w_bottom", from: "v3", to: "v4", thickness: 200, lockAxis: "horizontal" },
      { id: "w_left", from: "v4", to: "v1", thickness: 200, lockAxis: "vertical" },
    ],
    openings: [],
    rooms: [
      {
        id: "r1",
        type: "bedroom",
        name: "Main Room",
        boundaryWallIds: ["w_top", "w_right", "w_bottom", "w_left"],
      },
    ],
    furniture: [],
  });

  describe("Symmetric Opening Keep-Clear Zone (opening-keep-clear, AC-13)", () => {
    it("detects encroachment into symmetric door keep-clear zone on side A (+normal)", () => {
      const plan = createTestPlan();
      // Wall w_top: from (0, 0) to (6000, 0), thickness 200 (y in [-100, 100])
      // Door at position 0.5 (x=3000, width=900)
      // Normal is (0, 1) pointing downwards (+y). Inner wall surface is at y = 100.
      // Keep clear zone depth is 900 mm: y from 100 to 1000, x from 2550 to 3450.
      plan.openings = [
        {
          id: "door_main",
          type: "door",
          wallId: "w_top",
          position: 0.5,
          width: 900,
        },
      ];
      // Place furniture in the keep-clear zone: center (3000, 700), width 800, depth 600
      // Top edge is at y = 700 - 300 = 400.
      // Clearance distance to wall surface (y=100) is 400 - 100 = 300 mm.
      plan.furniture = [
        {
          id: "f_bench",
          definitionId: "desk",
          x: 3000,
          y: 700,
          width: 800,
          depth: 600,
          rotation: 0,
        },
      ];

      const violations = evaluateOpeningClearanceRules(plan, VALID_SPACE_RULE_CONFIG);
      expect(violations).toHaveLength(1);

      const v = violations[0];
      expect(v.ruleId).toBe("opening-keep-clear");
      expect(["warning", "error"]).toContain(v.severity);
      expect(v.relatedEntityIds).toEqual(["door_main", "f_bench"]);
      expect(v.relatedObjectIds).toEqual(["door_main", "f_bench"]);
      expect(v.title).toMatch(/keep-clear/i);
      expect(v.measuredValue).toBe(300);
      expect(v.recommendedValue).toBe("900 mm");
      expect(v.message).toMatch(/keep-clear/i);
      expect(v.message).toMatch(/300 mm/);
      expect(v.message).toMatch(/900 mm/);
    });

    it("detects encroachment into symmetric door keep-clear zone on side B (-normal)", () => {
      const plan = createTestPlan();
      // Wall w_bottom: from (6000, 6000) to (0, 6000), thickness 200 (y in [5900, 6100])
      // Door at position 0.5 (x=3000, width=900).
      // Normal points to -y (inside room). Side B points to +y (outside room).
      plan.openings = [
        {
          id: "door_bottom",
          type: "door",
          wallId: "w_bottom",
          position: 0.5,
          width: 900,
        },
      ];
      // Place furniture on inside room: y = 5500, width 800, depth 600
      // Bottom of furniture is at y = 5500 + 300 = 5800.
      // Wall inner face is at y = 5900.
      // Clearance distance to door surface is 5900 - 5800 = 100 mm (< 900 mm).
      plan.furniture = [
        {
          id: "f_shoe_rack",
          definitionId: "storage",
          x: 3000,
          y: 5500,
          width: 800,
          depth: 600,
          rotation: 0,
        },
      ];

      const violations = evaluateOpeningClearanceRules(plan);
      expect(violations).toHaveLength(1);
      expect(violations[0].ruleId).toBe("opening-keep-clear");
      expect(violations[0].relatedEntityIds).toEqual(["door_bottom", "f_shoe_rack"]);
      expect(violations[0].measuredValue).toBe(100);
    });

    it("does not report violation when furniture is completely clear of keep-clear zone", () => {
      const plan = createTestPlan();
      plan.openings = [
        {
          id: "door1",
          type: "door",
          wallId: "w_top",
          position: 0.5,
          width: 900,
        },
      ];
      // Placed far away at x=1000, y=1000
      plan.furniture = [
        {
          id: "f_clear",
          definitionId: "desk",
          x: 1000,
          y: 1000,
          width: 800,
          depth: 600,
          rotation: 0,
        },
      ];

      const violations = evaluateOpeningClearanceRules(plan);
      expect(violations).toHaveLength(0);
    });

    it("ignores non-door openings like windows", () => {
      const plan = createTestPlan();
      plan.openings = [
        {
          id: "win1",
          type: "window",
          wallId: "w_top",
          position: 0.5,
          width: 1200,
        },
      ];
      plan.furniture = [
        {
          id: "f_desk",
          definitionId: "desk",
          x: 3000,
          y: 600,
          width: 1200,
          depth: 600,
          rotation: 0,
        },
      ];

      const violations = evaluateOpeningClearanceRules(plan);
      expect(violations).toHaveLength(0);
    });

    it("respects doorSwing.enabled === false config", () => {
      const plan = createTestPlan();
      plan.openings = [
        {
          id: "door1",
          type: "door",
          wallId: "w_top",
          position: 0.5,
          width: 900,
        },
      ];
      plan.furniture = [
        {
          id: "f_violating",
          definitionId: "desk",
          x: 3000,
          y: 500,
          width: 800,
          depth: 600,
          rotation: 0,
        },
      ];

      const disabledConfig: SpaceRuleConfig = {
        ...VALID_SPACE_RULE_CONFIG,
        rules: {
          ...VALID_SPACE_RULE_CONFIG.rules,
          doorSwing: {
            ...VALID_SPACE_RULE_CONFIG.rules.doorSwing,
            enabled: false,
          },
        },
      };

      const violations = evaluateOpeningClearanceRules(plan, disabledConfig);
      expect(violations).toHaveLength(0);
    });
  });

  describe("Configured Furniture Clearance (furniture-clearance, AC-13)", () => {
    it("detects bed side clearance encroachment with adjacent wall", () => {
      const plan = createTestPlan();
      // Wall w_left inner face is at x = 100.
      // Place bed at x = 1200, y = 2000, width = 1800, depth = 2000, rotation = 0.
      // Bed left edge is at x = 1200 - 900 = 300.
      // Clearance distance to w_left is 300 - 100 = 200 mm.
      // Recommended bedSideClearance is 600 mm.
      plan.furniture = [
        {
          id: "bed1",
          definitionId: "bed-double",
          x: 1200,
          y: 2000,
          width: 1800,
          depth: 2000,
          rotation: 0,
        },
      ];

      const violations = evaluateFurnitureClearanceRules(plan);
      const bedViolations = violations.filter((v) => v.relatedEntityIds.includes("bed1"));
      expect(bedViolations.length).toBeGreaterThanOrEqual(1);

      const v = bedViolations.find((violation) => violation.relatedEntityIds.includes("w_left"));
      expect(v).toBeDefined();
      expect(v!.ruleId).toBe("furniture-clearance");
      expect(v!.severity).toBe("warning");
      expect(v!.measuredValue).toBe(200);
      expect(v!.recommendedValue).toBe("600 mm");
      expect(v!.message).toMatch(/side clearance/i);
    });

    it("detects bed foot clearance encroachment with another furniture item", () => {
      const plan = createTestPlan();
      // Bed at x = 3000, y = 2000, width = 1800, depth = 2000, rotation = 0.
      // Foot of bed is at y = 2000 + 1000 = 3000 (+y front).
      // Place a bench at x = 3000, y = 3400, width = 1200, depth = 400.
      // Top of bench is at y = 3400 - 200 = 3200.
      // Measured clearance between bed foot (3000) and bench (3200) is 200 mm (< 600 mm).
      plan.furniture = [
        {
          id: "bed1",
          definitionId: "bed-double",
          x: 3000,
          y: 2000,
          width: 1800,
          depth: 2000,
          rotation: 0,
        },
        {
          id: "bench1",
          definitionId: "tv-stand",
          x: 3000,
          y: 3400,
          width: 1200,
          depth: 400,
          rotation: 0,
        },
      ];

      const violations = evaluateFurnitureClearanceRules(plan);
      const footViolation = violations.find(
        (v) =>
          v.relatedEntityIds.includes("bed1") &&
          v.relatedEntityIds.includes("bench1") &&
          (v.message.toLowerCase().includes("front") || v.message.toLowerCase().includes("foot")),
      );

      expect(footViolation).toBeDefined();
      expect(footViolation!.ruleId).toBe("furniture-clearance");
      expect(footViolation!.measuredValue).toBe(200);
      expect(footViolation!.recommendedValue).toBe("600 mm");
    });

    it("detects wardrobe front clearance encroachment", () => {
      const plan = createTestPlan();
      // Wardrobe at x = 3000, y = 1000, width = 1800, depth = 600, rotation = 0.
      // Wardrobe front is at y = 1000 + 300 = 1300 (+y).
      // Recommended wardrobe front clearance is 800 mm (reaches up to y = 2100).
      // Place armchair at x = 3000, y = 1800, width = 600, depth = 600.
      // Armchair top edge is at y = 1800 - 300 = 1500.
      // Measured clearance = 1500 - 1300 = 200 mm (< 800 mm).
      plan.furniture = [
        {
          id: "wardrobe1",
          definitionId: "wardrobe-large",
          x: 3000,
          y: 1000,
          width: 1800,
          depth: 600,
          rotation: 0,
        },
        {
          id: "chair1",
          definitionId: "armchair",
          x: 3000,
          y: 1800,
          width: 600,
          depth: 600,
          rotation: 0,
        },
      ];

      const violations = evaluateFurnitureClearanceRules(plan);
      const wViolation = violations.find(
        (v) =>
          v.relatedEntityIds.includes("wardrobe1") &&
          v.relatedEntityIds.includes("chair1"),
      );

      expect(wViolation).toBeDefined();
      expect(wViolation!.ruleId).toBe("furniture-clearance");
      expect(wViolation!.measuredValue).toBe(200);
      expect(wViolation!.recommendedValue).toBe("800 mm");
    });

    it("immediately recomputes when furniture position or rotation changes", () => {
      const plan = createTestPlan();
      // Wardrobe initially with front clearance violation
      plan.furniture = [
        {
          id: "wardrobe1",
          definitionId: "wardrobe-large",
          x: 3000,
          y: 1000,
          width: 1800,
          depth: 600,
          rotation: 0,
        },
        {
          id: "chair1",
          definitionId: "armchair",
          x: 3000,
          y: 1800,
          width: 600,
          depth: 600,
          rotation: 0,
        },
      ];

      // Initial state: has violation
      let violations = evaluateFurnitureClearanceRules(plan);
      expect(violations.some((v) => v.relatedEntityIds.includes("wardrobe1"))).toBe(true);

      // Move chair away: y = 2500 -> distance is 2200 - 1300 = 900 mm (> 800 mm)
      const movedPlan: FloorPlan = {
        ...plan,
        furniture: plan.furniture.map((f) =>
          f.id === "chair1" ? { ...f, y: 2500 } : f,
        ),
      };
      violations = evaluateFurnitureClearanceRules(movedPlan);
      expect(violations.some((v) => v.relatedEntityIds.includes("wardrobe1"))).toBe(false);

      // Rotate wardrobe 180°: front now faces -y (upwards), away from chair
      const rotatedPlan: FloorPlan = {
        ...plan,
        furniture: plan.furniture.map((f) =>
          f.id === "wardrobe1" ? { ...f, rotation: 180 } : f,
        ),
      };
      violations = evaluateFurnitureClearanceRules(rotatedPlan);
      const chairViolation = violations.find(
        (v) =>
          v.relatedEntityIds.includes("wardrobe1") &&
          v.relatedEntityIds.includes("chair1"),
      );
      expect(chairViolation).toBeUndefined();
    });
  });

  describe("Configured Local Passage Width (local-passage, AC-13)", () => {
    it("detects narrow passage gap between two adjacent furniture items", () => {
      const plan = createTestPlan();
      // Two furniture items:
      // f1: desk at x = 2000, y = 2000, width = 1000, depth = 600 (x: 1500..2500)
      // f2: shelf at x = 3200, y = 2000, width = 800, depth = 600 (x: 2800..3600)
      // Gap between them is 2800 - 2500 = 300 mm.
      // Recommended secondary passage is 600 mm.
      plan.furniture = [
        {
          id: "f_desk",
          definitionId: "desk",
          x: 2000,
          y: 2000,
          width: 1000,
          depth: 600,
          rotation: 0,
        },
        {
          id: "f_shelf",
          definitionId: "bookcase",
          x: 3200,
          y: 2000,
          width: 800,
          depth: 600,
          rotation: 0,
        },
      ];

      const violations = evaluateLocalPassageRules(plan);
      expect(violations).toHaveLength(1);

      const v = violations[0];
      expect(v.ruleId).toBe("local-passage");
      expect(v.severity).toBe("warning");
      expect(v.relatedEntityIds).toEqual(["f_desk", "f_shelf"]);
      expect(v.measuredValue).toBe(300);
      expect(v.recommendedValue).toBe("600 mm");
      expect(v.title).toMatch(/passage/i);
      expect(v.message).toMatch(/300 mm/);
    });

    it("detects narrow passage gap between furniture and wall", () => {
      const plan = createTestPlan();
      // Wall w_right inner face is at x = 5900.
      // Place furniture at x = 5200, y = 3000, width = 800, depth = 600.
      // Right edge of furniture is at x = 5200 + 400 = 5600.
      // Gap to wall is 5900 - 5600 = 300 mm (< 600 mm).
      plan.furniture = [
        {
          id: "f_chair",
          definitionId: "dining-chair",
          x: 5200,
          y: 3000,
          width: 800,
          depth: 600,
          rotation: 0,
        },
      ];

      const violations = evaluateLocalPassageRules(plan);
      const wallPassage = violations.find(
        (v) =>
          v.relatedEntityIds.includes("f_chair") &&
          v.relatedEntityIds.includes("w_right"),
      );

      expect(wallPassage).toBeDefined();
      expect(wallPassage!.ruleId).toBe("local-passage");
      expect(wallPassage!.measuredValue).toBe(300);
      expect(wallPassage!.recommendedValue).toBe("600 mm");
    });

    it("does not report passage warning when gap is >= 600 mm", () => {
      const plan = createTestPlan();
      // Two items with 800 mm gap (2500 to 3300)
      plan.furniture = [
        {
          id: "f1",
          definitionId: "desk",
          x: 2000,
          y: 2000,
          width: 1000,
          depth: 600,
          rotation: 0,
        },
        {
          id: "f2",
          definitionId: "bookcase",
          x: 3700,
          y: 2000,
          width: 800,
          depth: 600,
          rotation: 0,
        },
      ];

      const violations = evaluateLocalPassageRules(plan);
      const fPair = violations.filter(
        (v) => v.relatedEntityIds.includes("f1") && v.relatedEntityIds.includes("f2"),
      );
      expect(fPair).toHaveLength(0);
    });
  });

  describe("Copy and Contract Verification (AC-13)", () => {
    it("describes feedback as layout guidance without claiming route finding or code compliance", () => {
      const plan = createTestPlan();
      plan.openings = [
        {
          id: "door1",
          type: "door",
          wallId: "w_top",
          position: 0.5,
          width: 900,
        },
      ];
      plan.furniture = [
        {
          id: "f_door_encroach",
          definitionId: "desk",
          x: 3000,
          y: 600,
          width: 800,
          depth: 600,
          rotation: 0,
        },
        {
          id: "f_bed",
          definitionId: "bed-double",
          x: 1200,
          y: 3000,
          width: 1800,
          depth: 2000,
          rotation: 0,
        },
        {
          id: "f_passage_pair",
          definitionId: "bookcase",
          x: 2500,
          y: 3000,
          width: 600,
          depth: 400,
          rotation: 0,
        },
      ];

      const allResults = evaluatePlanRules(plan);
      expect(allResults.length).toBeGreaterThanOrEqual(3);

      for (const res of allResults) {
        // Must contain layout guidance framing
        expect(res.message.toLowerCase()).toMatch(/guidance|clearance|layout/);

        // MUST NOT claim building code compliance or route finding
        expect(res.message.toLowerCase()).not.toMatch(/building code/);
        expect(res.message.toLowerCase()).not.toMatch(/code compliance/);
        expect(res.message.toLowerCase()).not.toMatch(/route finding/);
        expect(res.message.toLowerCase()).not.toMatch(/accessibility compliance/);
      }
    });

    it("evaluates all rules deterministically in evaluatePlanRules", () => {
      const plan = createTestPlan();
      plan.openings = [
        {
          id: "door1",
          type: "door",
          wallId: "w_top",
          position: 0.5,
          width: 900,
        },
      ];
      plan.furniture = [
        {
          id: "f1",
          definitionId: "desk",
          x: 3000,
          y: 600,
          width: 800,
          depth: 600,
          rotation: 0,
        },
      ];

      const res1 = evaluatePlanRules(plan);
      const res2 = evaluatePlanRules(plan);
      expect(res1).toEqual(res2);
    });
  });
});
