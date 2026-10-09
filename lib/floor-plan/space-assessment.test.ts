import { describe, expect, it } from "vitest";
import { VALID_STANDARD_FLOOR_PLAN } from "./fixtures/valid-standard-plan";
import { STUDIO_STANDARD_FLOOR_PLAN } from "./fixtures/standard-plans";
import { createPlacementScenario } from "./placement-scenario";
import {
  assessPlacementScenario,
  compareAssessmentFindings,
} from "./space-assessment";
import type {
  AssessmentFinding,
  FloorPlan,
  FurniturePlacement,
  StandardFloorPlan,
} from "./types";

describe("Space Assessment (US-7, US-12, US-20, AC-7, AC-14, AC-22)", () => {
  const getPlan = (): StandardFloorPlan =>
    JSON.parse(JSON.stringify(VALID_STANDARD_FLOOR_PLAN));

  describe("AC-14: Unscaled Plan Evaluation", () => {
    it("returns 'unavailable' status when plan has unscaled flag set to true", () => {
      const plan = getPlan();
      plan.meta.unscaled = true;

      const placement: FurniturePlacement = {
        id: "bed-1",
        definitionId: "bed-double",
        specificationId: "bed-double-1800x2000",
        x: 1500,
        y: 2000,
        rotation: 0,
      };

      const scenario = createPlacementScenario(plan.meta.id!, [placement], "bed-1");
      const assessment = assessPlacementScenario(plan, scenario);

      expect(assessment.status).toBe("unavailable");
    });

    it("returns 'unavailable' status when plan has scaled flag set to false", () => {
      const plan = getPlan();
      (plan.meta as any).scaled = false;

      const placement: FurniturePlacement = {
        id: "bed-1",
        definitionId: "bed-double",
        specificationId: "bed-double-1800x2000",
        x: 1500,
        y: 2000,
        rotation: 0,
      };

      const scenario = createPlacementScenario(plan.meta.id!, [placement], "bed-1");
      const assessment = assessPlacementScenario(plan, scenario);

      expect(assessment.status).toBe("unavailable");
    });
  });

  describe("AC-7: Physical Collision Checks and Target Evaluation", () => {
    it("reports 'furniture-overlap' and 'must-adjust' when target furniture overlaps another furniture", () => {
      const plan = getPlan();

      const bed: FurniturePlacement = {
        id: "bed-1",
        definitionId: "bed-double",
        specificationId: "bed-double-1800x2000",
        x: 1500,
        y: 2000,
        rotation: 0,
      };

      const sofa: FurniturePlacement = {
        id: "sofa-1",
        definitionId: "sofa-3seat",
        specificationId: "sofa-3seat-2100x900",
        x: 1600,
        y: 2100,
        rotation: 0,
      };

      const scenario = createPlacementScenario(plan.meta.id!, [bed, sofa], "bed-1");
      const assessment = assessPlacementScenario(plan, scenario);

      expect(assessment.status).toBe("must-adjust");
      expect(assessment.findings.length).toBeGreaterThan(0);

      const overlapFinding = assessment.findings.find(
        (f) => f.kind === "furniture-overlap" && f.placementId === "bed-1",
      );
      expect(overlapFinding).toBeDefined();
      expect(overlapFinding?.relatedPlacementId).toBe("sofa-1");
      expect(overlapFinding?.measuredMm).toBeGreaterThan(0);
    });

    it("reports 'wall-overlap' and 'must-adjust' when target furniture intersects a wall", () => {
      const plan = getPlan();

      // Wall w1 runs from (0,0) to (3000,0) with thickness 200 (y bounds: -100 to 100)
      // Placing furniture centered at y: 50, depth: 1000 causes intersection with w1
      const bed: FurniturePlacement = {
        id: "bed-wall-overlap",
        definitionId: "bed-double",
        specificationId: "bed-double-1800x2000",
        x: 1500,
        y: 50,
        rotation: 0,
      };

      const scenario = createPlacementScenario(plan.meta.id!, [bed], "bed-wall-overlap");
      const assessment = assessPlacementScenario(plan, scenario);

      expect(assessment.status).toBe("must-adjust");
      const wallFinding = assessment.findings.find((f) => f.kind === "wall-overlap");
      expect(wallFinding).toBeDefined();
      expect(wallFinding?.placementId).toBe("bed-wall-overlap");
      expect(wallFinding?.wallId).toBe("w1");
      expect(wallFinding?.measuredMm).toBeGreaterThan(0);
    });

    it("reports 'outside-room' and 'must-adjust' when furniture is placed outside room boundaries", () => {
      const plan = getPlan();

      // Placing furniture at (-2000, -2000) which is completely outside any room
      const bed: FurniturePlacement = {
        id: "bed-outside",
        definitionId: "bed-double",
        specificationId: "bed-double-1800x2000",
        x: -2000,
        y: -2000,
        rotation: 0,
      };

      const scenario = createPlacementScenario(plan.meta.id!, [bed], "bed-outside");
      const assessment = assessPlacementScenario(plan, scenario);

      expect(assessment.status).toBe("must-adjust");
      const outsideFinding = assessment.findings.find((f) => f.kind === "outside-room");
      expect(outsideFinding).toBeDefined();
      expect(outsideFinding?.placementId).toBe("bed-outside");
      expect(outsideFinding?.measuredMm).toBeGreaterThan(0);
    });

    it("reports 'outside-room' when furniture center is in Room 1 and corners protrude into adjacent Room 2", () => {
      const plan = getPlan();

      // Room 1 is x: 0..3000, Room 2 is x: 3000..6000.
      // Bed centered at x: 2500 with width: 1800 spans x: 1600..3400, protruding 400mm past Room 1 into Room 2.
      const straddlingBed: FurniturePlacement = {
        id: "bed-straddle",
        definitionId: "bed-double",
        specificationId: "bed-double-1800x2000",
        x: 2500,
        y: 2500,
        rotation: 0,
      };

      const scenario = createPlacementScenario(plan.meta.id!, [straddlingBed], "bed-straddle");
      const assessment = assessPlacementScenario(plan, scenario);

      expect(assessment.status).toBe("must-adjust");
      const outsideFinding = assessment.findings.find((f) => f.kind === "outside-room");
      expect(outsideFinding).toBeDefined();
      expect(outsideFinding?.placementId).toBe("bed-straddle");
      expect(outsideFinding?.measuredMm).toBe(400);
    });

    it("does not falsely report 'outside-room' when furniture fits cleanly in Room 2 even if focusRoomId is Room 1", () => {
      const plan = getPlan();

      // Single bed (1200x2000) centered at x: 4500, y: 2500 in Room 2 (inner x: 3060..5900, y: 100..4900)
      // spans x: 3900..5100 (left clearance 840 >= 650, right clearance 800 >= 500) and y: 1500..3500.
      const bedInR2: FurniturePlacement = {
        id: "bed-r2",
        definitionId: "bed-single",
        specificationId: "bed-single-1200",
        x: 4500,
        y: 2500,
        rotation: 0,
      };

      const scenario = createPlacementScenario(plan.meta.id!, [bedInR2], "bed-r2");
      const assessment = assessPlacementScenario(plan, scenario, undefined, {
        focusRoomId: "r1",
      });

      expect(assessment.status).toBe("suitable");
      expect(assessment.findings).toEqual([]);
    });

    it("evaluates to 'suitable' with empty findings when target furniture fits cleanly without collision", () => {
      const plan = getPlan();

      // r1 inner bounds are x: 100..2940, y: 100..4900
      // bed-single (1200x2000) at (1500, 2500) spans x: 900..2100 (left 800 >= 650, right 840 >= 500)
      const bed: FurniturePlacement = {
        id: "bed-clean",
        definitionId: "bed-single",
        specificationId: "bed-single-1200",
        x: 1500,
        y: 2500,
        rotation: 0,
      };

      const scenario = createPlacementScenario(plan.meta.id!, [bed], "bed-clean");
      const assessment = assessPlacementScenario(plan, scenario);

      expect(assessment.status).toBe("suitable");
      expect(assessment.findings).toEqual([]);
    });

    it("evaluates target placement independently while other placements participate in scenario", () => {
      const plan = getPlan();

      // Clean bed in Room 1
      const bedClean: FurniturePlacement = {
        id: "bed-clean",
        definitionId: "bed-single",
        specificationId: "bed-single-1200",
        x: 1500,
        y: 2500,
        rotation: 0,
      };

      // Two colliding items in Room 2 (x: 4500, y: 2500)
      const sofaCollision: FurniturePlacement = {
        id: "sofa-collide-1",
        definitionId: "sofa-3seat",
        specificationId: "sofa-3seat-2100",
        x: 4500,
        y: 2500,
        rotation: 0,
      };

      const tableCollision: FurniturePlacement = {
        id: "table-collide-2",
        definitionId: "dining-table-4",
        specificationId: "dining-table-4-1400",
        x: 4500,
        y: 2500,
        rotation: 0,
      };

      const scenario = createPlacementScenario(
        plan.meta.id!,
        [bedClean, sofaCollision, tableCollision],
        "bed-clean",
      );

      // When target is bedClean: bedClean has no conflicts -> suitable
      const bedAssessment = assessPlacementScenario(plan, scenario);
      expect(bedAssessment.status).toBe("suitable");
      expect(bedAssessment.findings).toHaveLength(0);

      // When target is sofaCollision: sofa has conflict with table -> must-adjust
      const sofaAssessment = assessPlacementScenario(plan, scenario, undefined, {
        targetPlacementId: "sofa-collide-1",
      });
      expect(sofaAssessment.status).toBe("must-adjust");
      expect(sofaAssessment.findings.some((f) => f.relatedPlacementId === "table-collide-2")).toBe(
        true,
      );

      // When includeAllPlacements: returns scenario-wide conflicts
      const allAssessment = assessPlacementScenario(plan, scenario, undefined, {
        includeAllPlacements: true,
      });
      expect(allAssessment.status).toBe("must-adjust");
      expect(allAssessment.findings.length).toBeGreaterThanOrEqual(2);
    });

    it("verifies AC-7 table-driven geometric collision scenarios", () => {
      const plan = getPlan();

      // Scenarios table: [description, placement, expectedStatus, expectedFindingKind]
      const scenarios: Array<{
        name: string;
        placement: FurniturePlacement;
        otherPlacements?: FurniturePlacement[];
        expectedStatus: "suitable" | "must-adjust";
        expectedFindingKind?: "furniture-overlap" | "wall-overlap" | "outside-room";
      }> = [
        {
          name: "well-placed coffee table inside room 1",
          placement: {
            id: "t1",
            definitionId: "coffee-table",
            specificationId: "coffee-table-1100",
            x: 1500,
            y: 2000,
            rotation: 0,
          },
          expectedStatus: "suitable",
        },
        {
          name: "table overlapping top wall w1 (y=0)",
          placement: {
            id: "t2",
            definitionId: "dining-table-4",
            specificationId: "dining-table-4-1400",
            x: 1500,
            y: 50, // depth 800 -> y: -350..450, overlaps wall thickness 200 (-100..100)
            rotation: 0,
          },
          expectedStatus: "must-adjust",
          expectedFindingKind: "wall-overlap",
        },
        {
          name: "table overlapping left wall w6 (x=0)",
          placement: {
            id: "t3",
            definitionId: "dining-table-4",
            specificationId: "dining-table-4-1400",
            x: 100, // width 1400 -> x: -600..800, overlaps wall w6 (-100..100)
            y: 2000,
            rotation: 0,
          },
          expectedStatus: "must-adjust",
          expectedFindingKind: "wall-overlap",
        },
        {
          name: "rotated 90 dining table fitting cleanly when depth (800) is along x",
          placement: {
            id: "t4",
            definitionId: "dining-table-4",
            specificationId: "dining-table-4-1400",
            x: 1500, // depth 800 along x -> x: 1100..1900 (1000mm to w6, 1040mm to w7 >= 900mm recommended)
            y: 2000,
            rotation: 90,
          },
          expectedStatus: "suitable",
        },
        {
          name: "furniture completely outside plan bounds",
          placement: {
            id: "t5",
            definitionId: "dining-table-4",
            specificationId: "dining-table-4-1400",
            x: -500,
            y: -500,
            rotation: 0,
          },
          expectedStatus: "must-adjust",
          expectedFindingKind: "outside-room",
        },
        {
          name: "furniture overlapping another placement",
          placement: {
            id: "t6",
            definitionId: "dining-table-4",
            specificationId: "dining-table-4-1400",
            x: 1500,
            y: 2000,
            rotation: 0,
          },
          otherPlacements: [
            {
              id: "t6-other",
              definitionId: "dining-chair",
              specificationId: "dining-chair-500",
              x: 1500,
              y: 2000,
              rotation: 0,
            },
          ],
          expectedStatus: "must-adjust",
          expectedFindingKind: "furniture-overlap",
        },
      ];

      for (const sc of scenarios) {
        const placements = [sc.placement, ...(sc.otherPlacements ?? [])];
        const scenario = createPlacementScenario(plan.meta.id!, placements, sc.placement.id);
        const assessment = assessPlacementScenario(plan, scenario);

        expect(
          assessment.status,
          `Failed scenario: ${sc.name}, expected ${sc.expectedStatus} but got ${assessment.status}`,
        ).toBe(sc.expectedStatus);

        if (sc.expectedFindingKind) {
          expect(
            assessment.findings.some((f) => f.kind === sc.expectedFindingKind),
            `Failed scenario: ${sc.name}, missing finding kind ${sc.expectedFindingKind}`,
          ).toBe(true);
        }
      }
    });
  });

  describe("AC-8: Directional Clearance Profiles & 0°/90°/180°/270° Rotation", () => {
    it("verifies every specification in STANDARD_FURNITURE_CATALOG defines front, back, left, right clearance with 0 <= minimum <= recommended", async () => {
      const { STANDARD_FURNITURE_CATALOG } = await import("./furniture-catalog");

      for (const def of STANDARD_FURNITURE_CATALOG.definitions) {
        expect(def.specifications.length).toBeGreaterThan(0);
        for (const spec of def.specifications) {
          for (const side of ["front", "back", "left", "right"] as const) {
            const threshold = spec.clearance[side];
            expect(threshold).toBeDefined();
            expect(threshold.minimum).toBeGreaterThanOrEqual(0);
            expect(threshold.recommended).toBeGreaterThanOrEqual(threshold.minimum);
          }
        }
      }
    });

    it("rotates front, back, left, right clearance zones across 0°, 90°, 180°, and 270° and reports the semantic furniture side", () => {
      // Studio room sr1 has inner faces:
      // Top wall sw1 (y = 100), Right wall sw2 (x = 3900), Bottom wall sw7 (y = 3940), Left wall sw6 (x = 100)
      // Use wardrobe-large-1800 (width: 1800, depth: 600):
      // front: { minimum: 800, recommended: 1000 }, back: { 0, 0 }, left: { 0, 100 }, right: { 0, 100 }
      const plan = JSON.parse(JSON.stringify(STUDIO_STANDARD_FLOOR_PLAN)) as StandardFloorPlan;

      // 1. Rotation 0°: front faces +Y (toward bottom wall sw7 at y=3940).
      // Place center at (2000, 3140): depth 600 -> y spans 2840..3440.
      // Distance from front edge (y=3440) to sw7 (y=3940) is 500 mm (< 800 minimum).
      const p0: FurniturePlacement = {
        id: "wardrobe-0",
        definitionId: "wardrobe-large",
        specificationId: "wardrobe-large-1800",
        x: 2000,
        y: 3140,
        rotation: 0,
      };
      const res0 = assessPlacementScenario(
        plan,
        createPlacementScenario(plan.meta.id!, [p0], "wardrobe-0"),
      );
      expect(res0.status).toBe("must-adjust");
      expect(res0.findings).toContainEqual({
        kind: "below-minimum-clearance",
        placementId: "wardrobe-0",
        wallId: "sw7",
        side: "front",
        measuredMm: 500,
        minimumMm: 800,
        recommendedMm: 1000,
      });

      // 2. Rotation 90°: front faces -X (toward left wall sw6 at x=100).
      // At 90°, depth (600) is along X, width (1800) is along Y.
      // Place center at (900, 2000): x spans 600..1200.
      // Distance from front edge (x=600) to sw6 (x=100) is 500 mm (< 800 minimum).
      const p90: FurniturePlacement = {
        id: "wardrobe-90",
        definitionId: "wardrobe-large",
        specificationId: "wardrobe-large-1800",
        x: 900,
        y: 2000,
        rotation: 90,
      };
      const res90 = assessPlacementScenario(
        plan,
        createPlacementScenario(plan.meta.id!, [p90], "wardrobe-90"),
      );
      expect(res90.status).toBe("must-adjust");
      expect(res90.findings).toContainEqual({
        kind: "below-minimum-clearance",
        placementId: "wardrobe-90",
        wallId: "sw6",
        side: "front",
        measuredMm: 500,
        minimumMm: 800,
        recommendedMm: 1000,
      });

      // 3. Rotation 180°: front faces -Y (toward top wall sw1 at y=100).
      // Place center at (2000, 900): depth 600 -> y spans 600..1200.
      // Distance from front edge (y=600) to sw1 (y=100) is 500 mm (< 800 minimum).
      const p180: FurniturePlacement = {
        id: "wardrobe-180",
        definitionId: "wardrobe-large",
        specificationId: "wardrobe-large-1800",
        x: 2000,
        y: 900,
        rotation: 180,
      };
      const res180 = assessPlacementScenario(
        plan,
        createPlacementScenario(plan.meta.id!, [p180], "wardrobe-180"),
      );
      expect(res180.status).toBe("must-adjust");
      expect(res180.findings).toContainEqual({
        kind: "below-minimum-clearance",
        placementId: "wardrobe-180",
        wallId: "sw1",
        side: "front",
        measuredMm: 500,
        minimumMm: 800,
        recommendedMm: 1000,
      });

      // 4. Rotation 270°: front faces +X (toward right wall sw2 at x=3900).
      // Place center at (3100, 2000): depth 600 along X -> x spans 2800..3400.
      // Distance from front edge (x=3400) to sw2 (x=3900) is 500 mm (< 800 minimum).
      const p270: FurniturePlacement = {
        id: "wardrobe-270",
        definitionId: "wardrobe-large",
        specificationId: "wardrobe-large-1800",
        x: 3100,
        y: 2000,
        rotation: 270,
      };
      const res270 = assessPlacementScenario(
        plan,
        createPlacementScenario(plan.meta.id!, [p270], "wardrobe-270"),
      );
      expect(res270.status).toBe("must-adjust");
      expect(res270.findings).toContainEqual({
        kind: "below-minimum-clearance",
        placementId: "wardrobe-270",
        wallId: "sw2",
        side: "front",
        measuredMm: 500,
        minimumMm: 800,
        recommendedMm: 1000,
      });
    });
  });

  describe("AC-9: Threshold Boundary Value Evaluation", () => {
    it("allows 0mm touching contact when minimum === 0 and recommended === 0 without triggering any finding", () => {
      const plan = JSON.parse(JSON.stringify(STUDIO_STANDARD_FLOOR_PLAN)) as StandardFloorPlan;

      // wardrobe-large-1800 (width 1800, depth 600) has back: { minimum: 0, recommended: 0 }
      // Top wall sw1 inner face is at y = 100.
      // Placing wardrobe at y = 400 puts back edge at y = 400 - 300 = 100 (measuredMm === 0 against sw1).
      const wardrobeAgainstWall: FurniturePlacement = {
        id: "wardrobe-flush",
        definitionId: "wardrobe-large",
        specificationId: "wardrobe-large-1800",
        x: 2000,
        y: 400,
        rotation: 0,
      };

      const assessment = assessPlacementScenario(
        plan,
        createPlacementScenario(plan.meta.id!, [wardrobeAgainstWall], "wardrobe-flush"),
      );

      expect(assessment.status).toBe("suitable");
      expect(assessment.findings).toEqual([]);
    });

    it("evaluates boundary values accurately: 0mm contact (min=0, rec>0), < minimum, === minimum, < recommended, and === recommended", () => {
      const plan = JSON.parse(JSON.stringify(STUDIO_STANDARD_FLOOR_PLAN)) as StandardFloorPlan;
      // wardrobe-large-1800 (width 1800, depth 600):
      // front: { minimum: 800, recommended: 1000 }, left: { minimum: 0, recommended: 100 }
      // Bottom wall sw7 inner face is at y = 3940.
      // Wardrobe front edge is at y = center.y + 300 -> distance to sw7 is 3940 - (center.y + 300) = 3640 - center.y.

      // Case 1: 0mm contact when minimum = 0, recommended = 100 (left edge touching sw6 at x=100 -> center.x = 100 + 900 = 1000)
      const pZeroContactTradeOff: FurniturePlacement = {
        id: "w-zero-tradeoff",
        definitionId: "wardrobe-large",
        specificationId: "wardrobe-large-1800",
        x: 1000, // left edge at x = 100 -> measuredMm = 0 against sw6
        y: 2000,
        rotation: 0,
      };
      const resZero = assessPlacementScenario(
        plan,
        createPlacementScenario(plan.meta.id!, [pZeroContactTradeOff], "w-zero-tradeoff"),
      );
      expect(resZero.status).toBe("trade-off");
      expect(resZero.findings).toContainEqual({
        kind: "below-recommended-clearance",
        placementId: "w-zero-tradeoff",
        wallId: "sw6",
        side: "left",
        measuredMm: 0,
        minimumMm: 0,
        recommendedMm: 100,
      });

      // Case 2: Below minimum (measuredMm = 799 < 800) -> center.y = 3640 - 799 = 2841
      const pBelowMin: FurniturePlacement = {
        id: "w-below-min",
        definitionId: "wardrobe-large",
        specificationId: "wardrobe-large-1800",
        x: 2000,
        y: 2841,
        rotation: 0,
      };
      const resBelowMin = assessPlacementScenario(
        plan,
        createPlacementScenario(plan.meta.id!, [pBelowMin], "w-below-min"),
      );
      expect(resBelowMin.status).toBe("must-adjust");
      expect(resBelowMin.findings).toContainEqual({
        kind: "below-minimum-clearance",
        placementId: "w-below-min",
        wallId: "sw7",
        side: "front",
        measuredMm: 799,
        minimumMm: 800,
        recommendedMm: 1000,
      });

      // Case 3: Exactly equal to minimum (measuredMm = 800 === minimum 800 < recommended 1000) -> center.y = 3640 - 800 = 2840
      const pEqualMin: FurniturePlacement = {
        id: "w-equal-min",
        definitionId: "wardrobe-large",
        specificationId: "wardrobe-large-1800",
        x: 2000,
        y: 2840,
        rotation: 0,
      };
      const resEqualMin = assessPlacementScenario(
        plan,
        createPlacementScenario(plan.meta.id!, [pEqualMin], "w-equal-min"),
      );
      expect(resEqualMin.status).toBe("trade-off");
      expect(resEqualMin.findings).toContainEqual({
        kind: "below-recommended-clearance",
        placementId: "w-equal-min",
        wallId: "sw7",
        side: "front",
        measuredMm: 800,
        minimumMm: 800,
        recommendedMm: 1000,
      });

      // Case 4: Just below recommended (measuredMm = 999 < recommended 1000) -> center.y = 3640 - 999 = 2641
      const pBelowRec: FurniturePlacement = {
        id: "w-below-rec",
        definitionId: "wardrobe-large",
        specificationId: "wardrobe-large-1800",
        x: 2000,
        y: 2641,
        rotation: 0,
      };
      const resBelowRec = assessPlacementScenario(
        plan,
        createPlacementScenario(plan.meta.id!, [pBelowRec], "w-below-rec"),
      );
      expect(resBelowRec.status).toBe("trade-off");
      expect(resBelowRec.findings).toContainEqual({
        kind: "below-recommended-clearance",
        placementId: "w-below-rec",
        wallId: "sw7",
        side: "front",
        measuredMm: 999,
        minimumMm: 800,
        recommendedMm: 1000,
      });

      // Case 5: Exactly equal to recommended (measuredMm = 1000 === recommended 1000) -> center.y = 3640 - 1000 = 2640
      const pEqualRec: FurniturePlacement = {
        id: "w-equal-rec",
        definitionId: "wardrobe-large",
        specificationId: "wardrobe-large-1800",
        x: 2000,
        y: 2640,
        rotation: 0,
      };
      const resEqualRec = assessPlacementScenario(
        plan,
        createPlacementScenario(plan.meta.id!, [pEqualRec], "w-equal-rec"),
      );
      expect(resEqualRec.status).toBe("suitable");
      expect(resEqualRec.findings).toEqual([]);
    });
  });

  describe("AC-10: Solid Obstacle Comparison Only (No Clearance-vs-Clearance False Positives)", () => {
    it("does not trigger findings when two furniture items' clearance zones intersect but their solid footprints are outside each other's clearance zones", () => {
      const plan = JSON.parse(JSON.stringify(STUDIO_STANDARD_FLOOR_PLAN)) as StandardFloorPlan;

      // Two sofas facing each other:
      // sofa-2seat-1500 (width: 1500, depth: 850): front clearance is { minimum: 450, recommended: 600 }.
      // Sofa A at (2000, 1000) with rotation 0 -> front edge at y = 1000 + 425 = 1425, front clearance zone extends to y = 2025.
      // Sofa B at (2000, 2500) with rotation 180 -> front edge at y = 2500 - 425 = 2075, front clearance zone extends to y = 1475.
      // Notice:
      // - Sofa A's front clearance zone (1425..2025) and Sofa B's front clearance zone (1475..2075) overlap by 550 mm (1475..2025)!
      // - However, the distance between Sofa A's front edge (1425) and Sofa B's solid footprint (2075) is 650 mm (>= 600 mm recommended).
      const sofaA: FurniturePlacement = {
        id: "sofa-a",
        definitionId: "sofa-2seat",
        specificationId: "sofa-2seat-1500",
        x: 2000,
        y: 1000,
        rotation: 0,
      };
      const sofaB: FurniturePlacement = {
        id: "sofa-b",
        definitionId: "sofa-2seat",
        specificationId: "sofa-2seat-1500",
        x: 2000,
        y: 2500,
        rotation: 180,
      };

      const assessmentClearanceOverlapOnly = assessPlacementScenario(
        plan,
        createPlacementScenario(plan.meta.id!, [sofaA, sofaB], "sofa-a"),
      );
      expect(assessmentClearanceOverlapOnly.status).toBe("suitable");
      expect(assessmentClearanceOverlapOnly.findings).toEqual([]);

      // Contrast: move Sofa B closer to y = 2250 so its solid footprint starts at y = 2250 - 425 = 1825.
      // Now Sofa B's solid footprint is 1825 - 1425 = 400 mm from Sofa A's front edge (< 450 mm minimum).
      const sofaBCloser: FurniturePlacement = {
        ...sofaB,
        y: 2250,
      };
      const assessmentSolidIntrusion = assessPlacementScenario(
        plan,
        createPlacementScenario(plan.meta.id!, [sofaA, sofaBCloser], "sofa-a"),
      );
      expect(assessmentSolidIntrusion.status).toBe("must-adjust");
      expect(assessmentSolidIntrusion.findings).toContainEqual({
        kind: "below-minimum-clearance",
        placementId: "sofa-a",
        relatedPlacementId: "sofa-b",
        side: "front",
        measuredMm: 400,
        minimumMm: 450,
        recommendedMm: 600,
      });
    });
  });

  describe("AC-11 & AC-12: Status Precedence Matrix & Target Furniture Focus", () => {
    it("enforces deterministic status precedence: unavailable > must-adjust > trade-off > suitable", () => {
      const basePlan = JSON.parse(JSON.stringify(STUDIO_STANDARD_FLOOR_PLAN)) as StandardFloorPlan;

      // Placement with both below-recommended (left=0 < 100) and below-minimum (front=500 < 800)
      const placementBoth: FurniturePlacement = {
        id: "w-both",
        definitionId: "wardrobe-large",
        specificationId: "wardrobe-large-1800",
        x: 1000, // left=0 (below-recommended)
        y: 3140, // front=500 (below-minimum)
        rotation: 0,
      };

      // 1. When plan is unscaled -> "unavailable" even though below-minimum and below-recommended exist
      const unscaledPlan = JSON.parse(JSON.stringify(basePlan)) as StandardFloorPlan;
      unscaledPlan.meta.unscaled = true;
      const unscaledRes = assessPlacementScenario(
        unscaledPlan,
        createPlacementScenario(unscaledPlan.meta.id!, [placementBoth], "w-both"),
      );
      expect(unscaledRes.status).toBe("unavailable");

      // 2. On scaled plan, below-minimum + below-recommended -> "must-adjust"
      const mustAdjustRes = assessPlacementScenario(
        basePlan,
        createPlacementScenario(basePlan.meta.id!, [placementBoth], "w-both"),
      );
      expect(mustAdjustRes.status).toBe("must-adjust");
      expect(mustAdjustRes.findings.map((f) => f.kind)).toEqual([
        "below-minimum-clearance",
        "below-recommended-clearance",
      ]);

      // 3. Only below-recommended -> "trade-off"
      const tradeOffPlacement: FurniturePlacement = {
        ...placementBoth,
        y: 2000, // front is now 1640 >= 1000, only left=0 (< 100 rec) remains
      };
      const tradeOffRes = assessPlacementScenario(
        basePlan,
        createPlacementScenario(basePlan.meta.id!, [tradeOffPlacement], "w-both"),
      );
      expect(tradeOffRes.status).toBe("trade-off");
      expect(tradeOffRes.findings.map((f) => f.kind)).toEqual([
        "below-recommended-clearance",
      ]);

      // 4. All clearances >= recommended -> "suitable"
      const suitablePlacement: FurniturePlacement = {
        ...tradeOffPlacement,
        x: 2000, // left=1000 >= 100, right=1000 >= 100
      };
      const suitableRes = assessPlacementScenario(
        basePlan,
        createPlacementScenario(basePlan.meta.id!, [suitablePlacement], "w-both"),
      );
      expect(suitableRes.status).toBe("suitable");
      expect(suitableRes.findings).toEqual([]);
    });

    it("focuses findings and status on targetPlacementId while keeping other placements as solid obstacles (AC-12)", () => {
      const plan = JSON.parse(JSON.stringify(STUDIO_STANDARD_FLOOR_PLAN)) as StandardFloorPlan;

      // Target sofa at (2000, 1500): front edge at y = 1925 (min: 450, rec: 600)
      const targetSofa: FurniturePlacement = {
        id: "target-sofa",
        definitionId: "sofa-2seat",
        specificationId: "sofa-2seat-1500",
        x: 2000,
        y: 1500,
        rotation: 0,
      };

      // Obstacle coffee table at (2000, 2725): depth 600 -> top edge at y = 2425.
      // Distance from targetSofa front edge (1925) to coffee table solid footprint (2425) is 500 mm (between min 450 and rec 600 -> trade-off for sofa!).
      // Meanwhile, coffee table has front/back min: 400, rec: 500, so distance 500 mm >= 500 mm rec (suitable for coffee table!).
      // Also add an unrelated colliding chair at (-500, -500) outside the room.
      const obstacleTable: FurniturePlacement = {
        id: "obstacle-table",
        definitionId: "coffee-table",
        specificationId: "coffee-table-1100",
        x: 2000,
        y: 2725,
        rotation: 0,
      };
      const unrelatedChairOutside: FurniturePlacement = {
        id: "unrelated-chair",
        definitionId: "dining-chair",
        specificationId: "dining-chair-500",
        x: -500,
        y: -500,
        rotation: 0,
      };

      const scenarioForSofa = createPlacementScenario(
        plan.meta.id!,
        [targetSofa, obstacleTable, unrelatedChairOutside],
        "target-sofa",
      );
      const sofaAssessment = assessPlacementScenario(plan, scenarioForSofa);

      // Must only explain findings for target-sofa, ignoring unrelated-chair's outside-room error
      expect(sofaAssessment.status).toBe("trade-off");
      expect(sofaAssessment.findings).toEqual([
        {
          kind: "below-recommended-clearance",
          placementId: "target-sofa",
          relatedPlacementId: "obstacle-table",
          side: "front",
          measuredMm: 500,
          minimumMm: 450,
          recommendedMm: 600,
        },
      ]);

      // Switching target to obstacle-table: 500mm meets its 500mm recommended back clearance!
      const tableAssessment = assessPlacementScenario(plan, scenarioForSofa, undefined, {
        targetPlacementId: "obstacle-table",
      });
      expect(tableAssessment.status).toBe("suitable");
      expect(tableAssessment.findings).toEqual([]);
    });
  });

  describe("AC-22: Deterministic Ordering & Reproducibility", () => {
    it("produces identical findings and order across repeated evaluations with scrambled inputs", () => {
      const plan = getPlan();

      const p1: FurniturePlacement = {
        id: "p1",
        definitionId: "bed-double",
        specificationId: "bed-double-1800",
        x: 1500,
        y: 50, // Wall overlap + left/right wall clearance findings
        rotation: 0,
      };

      const p2: FurniturePlacement = {
        id: "p2",
        definitionId: "sofa-3seat",
        specificationId: "sofa-3seat-2100",
        x: 1500,
        y: 100, // Overlaps p1 AND wall + clearance findings
        rotation: 0,
      };

      const p3: FurniturePlacement = {
        id: "p3",
        definitionId: "dining-chair",
        specificationId: "dining-chair-500",
        x: -1000,
        y: -1000, // Outside room
        rotation: 0,
      };

      const scenario1 = createPlacementScenario(plan.meta.id!, [p1, p2, p3]);
      const scenario2 = createPlacementScenario(plan.meta.id!, [p3, p1, p2]);
      const scenario3 = createPlacementScenario(plan.meta.id!, [p2, p3, p1]);

      const res1 = assessPlacementScenario(plan, scenario1, undefined, { includeAllPlacements: true });
      const res2 = assessPlacementScenario(plan, scenario2, undefined, { includeAllPlacements: true });
      const res3 = assessPlacementScenario(plan, scenario3, undefined, { includeAllPlacements: true });

      // Status must match
      expect(res1.status).toBe(res2.status);
      expect(res2.status).toBe(res3.status);

      // Findings count must match
      expect(res1.findings.length).toBe(res2.findings.length);
      expect(res2.findings.length).toBe(res3.findings.length);

      // Findings content and order must be 100% strictly equal
      expect(res1.findings).toEqual(res2.findings);
      expect(res2.findings).toEqual(res3.findings);

      // Verify that findings are sorted according to compareAssessmentFindings
      for (let i = 0; i < res1.findings.length - 1; i++) {
        const order = compareAssessmentFindings(res1.findings[i], res1.findings[i + 1]);
        expect(order).toBeLessThanOrEqual(0);
      }
    });
  });
});
