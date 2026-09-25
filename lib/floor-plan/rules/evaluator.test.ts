import { describe, expect, it } from "vitest";
import type { FloorPlan } from "../types";
import { STUDIO_STANDARD_FLOOR_PLAN } from "../fixtures/standard-plans";
import { VALID_SPACE_RULE_CONFIG } from "../fixtures/valid-space-rules";
import {
  evaluatePlanRules,
  evaluateFurnitureBoundaryRules,
  evaluateFurnitureWallCollisionRules,
  evaluateFurnitureOverlapRules,
} from "./evaluator";
import type { RuleResult } from "./types";

describe("Spatial Rule Evaluator (US-12, US-14, AC-12, AC-14)", () => {
  // A known valid room: 4000x4000 (x: 0..4000, y: 0..4000)
  // Walls on 4 sides with thickness 200:
  // - Top: y=0 (y: -100..100)
  // - Right: x=4000 (x: 3900..4100)
  // - Bottom: y=4000 (y: 3900..4100)
  // - Left: x=0 (x: -100..100)
  const createBasePlan = (): FloorPlan => ({
    version: 2,
    unit: "mm",
    meta: {
      name: "Test Enclosed Plan",
      source: "user",
      createdAt: "2026-09-18T00:00:00.000Z",
      updatedAt: "2026-09-18T00:00:00.000Z",
    },
    vertices: [
      { id: "v1", x: 0, y: 0 },
      { id: "v2", x: 4000, y: 0 },
      { id: "v3", x: 4000, y: 4000 },
      { id: "v4", x: 0, y: 4000 },
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

  describe("Clean Valid Plan (AC-12, AC-14)", () => {
    it("returns 0 boundary and collision violations for clean compliant studio standard plan", () => {
      const boundaryViolations = evaluateFurnitureBoundaryRules(STUDIO_STANDARD_FLOOR_PLAN);
      const wallViolations = evaluateFurnitureWallCollisionRules(STUDIO_STANDARD_FLOOR_PLAN, VALID_SPACE_RULE_CONFIG);
      const overlapViolations = evaluateFurnitureOverlapRules(STUDIO_STANDARD_FLOOR_PLAN, VALID_SPACE_RULE_CONFIG);
      expect([...boundaryViolations, ...wallViolations, ...overlapViolations]).toEqual([]);
    });

    it("returns 0 violations for valid well-placed furniture inside room with compliant clearances", () => {
      const plan = createBasePlan();
      plan.furniture = [
        {
          id: "f_bed",
          definitionId: "bed-single",
          x: 2000,
          y: 1800,
          width: 1200,
          depth: 2000,
          rotation: 0,
        },
      ];

      const violations = evaluatePlanRules(plan);
      expect(violations).toEqual([]);
    });
  });

  describe("Furniture Boundary Violations (furniture-boundary, AC-12, AC-14)", () => {
    it("reports deterministic error when furniture is placed completely outside room boundaries", () => {
      const plan = createBasePlan();
      plan.furniture = [
        {
          id: "f_outside",
          definitionId: "bed-single",
          x: 7000,
          y: 7000,
          width: 1200,
          depth: 2000,
          rotation: 0,
        },
      ];

      const violations = evaluatePlanRules(plan);
      const boundaryViolations = violations.filter((v) => v.ruleId === "furniture-boundary");

      expect(boundaryViolations).toHaveLength(1);
      const violation = boundaryViolations[0];
      expect(violation.ruleId).toBe("furniture-boundary");
      expect(violation.severity).toBe("error");
      expect(violation.relatedEntityIds).toEqual(["f_outside"]);
      expect(violation.relatedObjectIds).toEqual(["f_outside"]);
      expect(violation.title).toMatch(/boundary/i);
      expect(violation.message).toMatch(/outside room boundaries/i);
      expect(violation.recommendedValue).toBeDefined();
      expect(typeof violation.measuredValue).toBe("number");
      expect(violation.measuredValue).toBeGreaterThan(0);
    });

    it("reports error if plan has no rooms defined at all", () => {
      const plan = createBasePlan();
      plan.rooms = [];
      plan.furniture = [
        {
          id: "f1",
          definitionId: "chair",
          x: 1000,
          y: 1000,
          width: 600,
          depth: 600,
          rotation: 0,
        },
      ];

      const violations = evaluateFurnitureBoundaryRules(plan);
      expect(violations).toHaveLength(1);
      expect(violations[0].ruleId).toBe("furniture-boundary");
      expect(violations[0].relatedEntityIds).toEqual(["f1"]);
    });
  });

  describe("Furniture Wall Collision Violations (furniture-wall-collision, AC-12, AC-14)", () => {
    it("reports deterministic error when furniture crosses a wall", () => {
      const plan = createBasePlan();
      // Wall w_left is from (0, 4000) to (0, 0), thickness 200 (x in [-100, 100])
      // Place furniture intersecting w_left at x=50, width=800 -> x in [-350, 450]
      plan.furniture = [
        {
          id: "f_colliding_wall",
          definitionId: "desk",
          x: 50,
          y: 1500,
          width: 800,
          depth: 600,
          rotation: 0,
        },
      ];

      const violations = evaluatePlanRules(plan);
      const wallViolations = violations.filter((v) => v.ruleId === "furniture-wall-collision");

      expect(wallViolations).toHaveLength(1);
      const v = wallViolations[0];
      expect(v.ruleId).toBe("furniture-wall-collision");
      expect(v.severity).toBe("error");
      expect(v.relatedEntityIds).toContain("f_colliding_wall");
      expect(v.relatedEntityIds).toContain("w_left");
      expect(v.title).toMatch(/wall/i);
      expect(v.message).toMatch(/intersect/i);
      expect(typeof v.measuredValue).toBe("number");
      expect(v.measuredValue).toBeGreaterThan(0);
      expect(v.recommendedValue).toBe("0 mm²");
    });

    it("does not report collision when furniture touches wall edge without overlapping interior", () => {
      const plan = createBasePlan();
      // Wall w_top bottom is y = 100
      // Place furniture exactly with top at y = 100 (center y = 100 + 300 = 400, depth = 600)
      plan.furniture = [
        {
          id: "f_touching_wall",
          definitionId: "desk",
          x: 1000,
          y: 400,
          width: 800,
          depth: 600,
          rotation: 0,
        },
      ];

      const violations = evaluateFurnitureWallCollisionRules(plan);
      expect(violations).toHaveLength(0);
    });
  });

  describe("Furniture Overlap Violations (furniture-overlap, AC-12, AC-14)", () => {
    it("reports error when two furniture items overlap with 0° rotation", () => {
      const plan = createBasePlan();
      plan.furniture = [
        {
          id: "f_table",
          definitionId: "table-dining",
          x: 2000,
          y: 2000,
          width: 1400,
          depth: 800,
          rotation: 0,
        },
        {
          id: "f_chair",
          definitionId: "chair",
          x: 2200,
          y: 2000,
          width: 600,
          depth: 600,
          rotation: 0,
        },
      ];

      const violations = evaluatePlanRules(plan);
      const overlapViolations = violations.filter((v) => v.ruleId === "furniture-overlap");

      expect(overlapViolations).toHaveLength(1);
      const v = overlapViolations[0];
      expect(v.ruleId).toBe("furniture-overlap");
      expect(v.severity).toBe("error");
      expect(v.relatedEntityIds).toEqual(["f_table", "f_chair"]);
      expect(v.relatedObjectIds).toEqual(["f_table", "f_chair"]);
      expect(v.title).toMatch(/overlap/i);
      expect(v.message).toMatch(/overlap/i);
      expect(typeof v.measuredValue).toBe("number");
      expect(v.measuredValue).toBeGreaterThan(0);
      expect(v.recommendedValue).toBe("0 mm²");
    });

    it("reports error when two furniture items overlap with 90° rotation (SAT check)", () => {
      const plan = createBasePlan();
      // f1 at (1500, 1500), 1000x400 unrotated (x: 1000..2000, y: 1300..1700)
      // f2 at (1500, 1500), 1000x400 rotated 90° (x: 1300..1700, y: 1000..2000)
      plan.furniture = [
        {
          id: "f_cross_1",
          definitionId: "bench",
          x: 1500,
          y: 1500,
          width: 1000,
          depth: 400,
          rotation: 0,
        },
        {
          id: "f_cross_2",
          definitionId: "bench",
          x: 1500,
          y: 1500,
          width: 1000,
          depth: 400,
          rotation: 90,
        },
      ];

      const violations = evaluateFurnitureOverlapRules(plan);
      expect(violations).toHaveLength(1);
      expect(violations[0].ruleId).toBe("furniture-overlap");
      expect(violations[0].relatedEntityIds).toEqual(["f_cross_1", "f_cross_2"]);
      expect(violations[0].measuredValue).toBeGreaterThan(0);
    });

    it("does not report overlap for adjacent items sharing an edge but not overlapping area", () => {
      const plan = createBasePlan();
      // f1 right edge is at x = 1500 + 500 = 2000
      // f2 left edge is at x = 2500 - 500 = 2000
      plan.furniture = [
        {
          id: "f1",
          definitionId: "storage",
          x: 1500,
          y: 1500,
          width: 1000,
          depth: 600,
          rotation: 0,
        },
        {
          id: "f2",
          definitionId: "storage",
          x: 2500,
          y: 1500,
          width: 1000,
          depth: 600,
          rotation: 0,
        },
      ];

      const violations = evaluateFurnitureOverlapRules(plan);
      expect(violations).toHaveLength(0);
    });
  });

  describe("Rule Result Contract Completeness (AC-14)", () => {
    it("satisfies AC-14 schema requirements on every result returned", () => {
      const plan = createBasePlan();
      // Add one of each violation:
      // 1. Boundary: x=9000, y=9000
      // 2. Wall collision: at x=0, y=2000
      // 3. Furniture overlap: f_ov1 and f_ov2
      plan.furniture = [
        {
          id: "f_out",
          definitionId: "bed-single",
          x: 9000,
          y: 9000,
          width: 1200,
          depth: 2000,
          rotation: 0,
        },
        {
          id: "f_wall",
          definitionId: "desk",
          x: 50,
          y: 2000,
          width: 800,
          depth: 600,
          rotation: 0,
        },
        {
          id: "f_ov1",
          definitionId: "chair",
          x: 2000,
          y: 2000,
          width: 600,
          depth: 600,
          rotation: 0,
        },
        {
          id: "f_ov2",
          definitionId: "chair",
          x: 2100,
          y: 2000,
          width: 600,
          depth: 600,
          rotation: 0,
        },
      ];

      const results = evaluatePlanRules(plan);
      expect(results.length).toBeGreaterThanOrEqual(3);

      for (const res of results) {
        expect(typeof res.ruleId).toBe("string");
        expect(["error", "warning", "info"]).toContain(res.severity);
        expect(Array.isArray(res.relatedEntityIds)).toBe(true);
        expect(res.relatedEntityIds.length).toBeGreaterThan(0);
        expect(Array.isArray(res.relatedObjectIds)).toBe(true);
        expect(res.relatedObjectIds).toEqual(res.relatedEntityIds);
        expect(typeof res.title).toBe("string");
        expect(res.title.trim().length).toBeGreaterThan(0);
        expect(typeof res.message).toBe("string");
        expect(res.message.trim().length).toBeGreaterThan(0);
        expect(res.recommendedValue).toBeDefined();
      }
    });

    it("respects SpaceRuleConfig collision disabled flag", () => {
      const plan = createBasePlan();
      plan.furniture = [
        {
          id: "f1",
          definitionId: "chair",
          x: 2000,
          y: 2000,
          width: 600,
          depth: 600,
          rotation: 0,
        },
        {
          id: "f2",
          definitionId: "chair",
          x: 2100,
          y: 2000,
          width: 600,
          depth: 600,
          rotation: 0,
        },
      ];

      const disabledConfig = {
        ...VALID_SPACE_RULE_CONFIG,
        rules: {
          ...VALID_SPACE_RULE_CONFIG.rules,
          collision: {
            enabled: false,
            severity: "error" as const,
          },
        },
      };

      const results = evaluatePlanRules(plan, disabledConfig);
      const overlapResults = results.filter((r) => r.ruleId === "furniture-overlap");
      expect(overlapResults).toHaveLength(0);
    });
  });

  describe("Unscaled Plan Clearance Suppression (AC-21)", () => {
    it("suppresses dimension-dependent clearance rules when plan is marked unscaled", () => {
      const plan = createBasePlan();
      plan.meta.unscaled = true;

      // Add a door opening with furniture in keep-clear zone
      plan.openings = [
        { id: "door-1", type: "door", wallId: "w_top", position: 0.5, width: 900 },
      ];
      plan.furniture = [
        {
          id: "bed-1",
          definitionId: "bed_double_1800",
          x: 2000,
          y: 400, // Encroaching into 900mm door zone and near walls
          width: 1800,
          depth: 2000,
          rotation: 0,
        },
      ];

      // When unscaled, clearance conclusions must be suppressed
      const resultsUnscaled = evaluatePlanRules(plan, VALID_SPACE_RULE_CONFIG);
      const clearanceRuleIds = ["opening-keep-clear", "furniture-clearance", "local-passage"];
      const suppressedResults = resultsUnscaled.filter((r) => clearanceRuleIds.includes(r.ruleId));
      expect(suppressedResults).toHaveLength(0);

      // When scaled, clearance conclusions ARE emitted
      plan.meta.unscaled = false;
      plan.meta.scaled = true;
      const resultsScaled = evaluatePlanRules(plan, VALID_SPACE_RULE_CONFIG);
      const activeClearanceResults = resultsScaled.filter((r) => clearanceRuleIds.includes(r.ruleId));
      expect(activeClearanceResults.length).toBeGreaterThan(0);
    });
  });
});
