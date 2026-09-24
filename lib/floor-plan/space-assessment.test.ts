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

    it("evaluates to 'suitable' with empty findings when target furniture fits cleanly without collision", () => {
      const plan = getPlan();

      // r1 bounds are (0,0) to (3000,5000), walls are thickness 200 (inner boundary ~100 to 2900, 100 to 4900)
      // bed at (1500, 2500) with width 1800 (x: 600..2400) and depth 2000 (y: 1500..3500) fits well inside
      const bed: FurniturePlacement = {
        id: "bed-clean",
        definitionId: "bed-double",
        specificationId: "bed-double-1800x2000",
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
        definitionId: "bed-double",
        specificationId: "bed-double-1800x2000",
        x: 1500,
        y: 2500,
        rotation: 0,
      };

      // Two colliding items in Room 2 (x: 4500, y: 2500)
      const sofaCollision: FurniturePlacement = {
        id: "sofa-collide-1",
        definitionId: "sofa-3seat",
        specificationId: "sofa-3seat-2100x900",
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

      let scenario = createPlacementScenario(
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
          name: "well-placed table inside room 1",
          placement: {
            id: "t1",
            definitionId: "dining-table-4",
            specificationId: "dining-table-4-1400",
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
          name: "rotated 90 table avoiding wall when depth is along x",
          placement: {
            id: "t4",
            definitionId: "dining-table-4",
            specificationId: "dining-table-4-1400",
            x: 700, // depth 800 along x -> x: 300..1100, does not overlap w6 (x: -100..100)
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
              definitionId: "chair-dining",
              specificationId: "chair-dining-default",
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

  describe("AC-22: Deterministic Ordering & Reproducibility", () => {
    it("produces identical findings and order across repeated evaluations with scrambled inputs", () => {
      const plan = getPlan();

      const p1: FurniturePlacement = {
        id: "p1",
        definitionId: "bed-double",
        specificationId: "bed-double-1800x2000",
        x: 1500,
        y: 50, // Wall overlap
        rotation: 0,
      };

      const p2: FurniturePlacement = {
        id: "p2",
        definitionId: "sofa-3seat",
        specificationId: "sofa-3seat-2100x900",
        x: 1500,
        y: 100, // Overlaps p1 AND wall
        rotation: 0,
      };

      const p3: FurniturePlacement = {
        id: "p3",
        definitionId: "chair-dining",
        specificationId: "chair-dining-default",
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
