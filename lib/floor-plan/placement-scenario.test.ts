import { describe, expect, it } from "vitest";
import { STUDIO_STANDARD_FLOOR_PLAN, THREE_BED_STANDARD_FLOOR_PLAN } from "./fixtures/standard-plans";
import { VALID_STANDARD_FLOOR_PLAN } from "./fixtures/valid-standard-plan";
import type { FurniturePlacement, PlacementScenario, StandardFloorPlan } from "./types";
import { validatePlacementScenario } from "./validators";
import {
  addPlacement,
  applyPlacementScenarioToFloorPlan,
  changePlacementSpecification,
  createPlacementScenario,
  evaluatePlacementScenario,
  floorPlanToPlacementScenario,
  movePlacement,
  placementScenarioFromFloorPlan,
  placementScenarioToFurnitureInstances,
  removePlacement,
  rotatePlacement,
  setTargetPlacement,
  updatePlacement,
} from "./placement-scenario";

/**
 * Helper to recursively deep freeze an object to guarantee immutability.
 */
function deepFreeze<T extends object>(obj: T): Readonly<T> {
  Object.freeze(obj);
  for (const key of Object.keys(obj) as Array<keyof T>) {
    const val = obj[key];
    if (val !== null && (typeof val === "object" || typeof val === "function") && !Object.isFrozen(val)) {
      deepFreeze(val as object);
    }
  }
  return obj;
}

describe("PlacementScenario Core Operations & Contract", () => {
  it("creates a PlacementScenario with default values and validates target placement", () => {
    const scenario = createPlacementScenario("floor-plan-std-studio-01");

    expect(scenario.version).toBe(1);
    expect(scenario.unit).toBe("mm");
    expect(scenario.planId).toBe("floor-plan-std-studio-01");
    expect(scenario.placements).toEqual([]);
    expect(scenario.targetPlacementId).toBeUndefined();

    // With initial placements and valid target
    const p1: FurniturePlacement = {
      id: "p1",
      definitionId: "bed-double",
      specificationId: "bed-double-1800x2000",
      x: 1000,
      y: 1500,
      rotation: 0,
    };
    const scenarioWithTarget = createPlacementScenario("plan-1", [p1], "p1");
    expect(scenarioWithTarget.placements).toHaveLength(1);
    expect(scenarioWithTarget.targetPlacementId).toBe("p1");

    // With non-existent targetPlacementId: should be undefined
    const scenarioInvalidTarget = createPlacementScenario("plan-1", [p1], "non-existent");
    expect(scenarioInvalidTarget.targetPlacementId).toBeUndefined();
  });

  it("validates PlacementScenario schemas via validatePlacementScenario", () => {
    const validScenario: PlacementScenario = {
      version: 1,
      unit: "mm",
      planId: "plan-valid",
      placements: [
        {
          id: "p-bed",
          definitionId: "bed-double",
          specificationId: "bed-double-1800x2000",
          x: 2000,
          y: 3000,
          rotation: 90,
        },
      ],
      targetPlacementId: "p-bed",
    };

    const res = validatePlacementScenario(validScenario);
    expect(res.ok).toBe(true);

    // Invalid version
    expect(validatePlacementScenario({ ...validScenario, version: 2 }).ok).toBe(false);
    // Invalid unit
    expect(validatePlacementScenario({ ...validScenario, unit: "m" }).ok).toBe(false);
    // Missing planId
    expect(validatePlacementScenario({ ...validScenario, planId: "" }).ok).toBe(false);
    // Duplicate placement ID
    expect(
      validatePlacementScenario({
        ...validScenario,
        placements: [validScenario.placements[0], validScenario.placements[0]],
      }).ok,
    ).toBe(false);
    // Invalid rotation
    expect(
      validatePlacementScenario({
        ...validScenario,
        placements: [{ ...validScenario.placements[0], rotation: 45 }],
      }).ok,
    ).toBe(false);
    // targetPlacementId not found in placements
    expect(
      validatePlacementScenario({
        ...validScenario,
        targetPlacementId: "missing-id",
      }).ok,
    ).toBe(false);
  });
});

describe("AC-2: Topology Immutability Contract", () => {
  it("guarantees adding, moving, rotating, switching specification, and deleting furniture never mutates StandardFloorPlan topology", () => {
    // Take a clone of standard plan and deep freeze everything
    const originalPlan: StandardFloorPlan = JSON.parse(
      JSON.stringify(STUDIO_STANDARD_FLOOR_PLAN),
    );
    const frozenPlan = deepFreeze(originalPlan);
    const originalSnapshot = JSON.stringify(frozenPlan);

    let scenario = createPlacementScenario(frozenPlan.meta.id!);

    const p1: FurniturePlacement = {
      id: "placement-bed",
      definitionId: "bed-double",
      specificationId: "bed-double-1800x2000",
      x: 1000,
      y: 1000,
      rotation: 0,
    };

    // 1. Add placement
    expect(() => {
      scenario = addPlacement(scenario, frozenPlan, p1);
    }).not.toThrow();
    expect(scenario.placements).toHaveLength(1);
    expect(JSON.stringify(frozenPlan)).toBe(originalSnapshot);

    // 2. Move placement
    expect(() => {
      scenario = movePlacement(scenario, frozenPlan, "placement-bed", 1500, 2200);
    }).not.toThrow();
    expect(scenario.placements[0].x).toBe(1500);
    expect(scenario.placements[0].y).toBe(2200);
    expect(JSON.stringify(frozenPlan)).toBe(originalSnapshot);

    // 3. Rotate placement
    expect(() => {
      scenario = rotatePlacement(scenario, frozenPlan, "placement-bed", 90);
    }).not.toThrow();
    expect(scenario.placements[0].rotation).toBe(90);
    expect(JSON.stringify(frozenPlan)).toBe(originalSnapshot);

    // 4. Switch specification
    expect(() => {
      scenario = changePlacementSpecification(
        scenario,
        frozenPlan,
        "placement-bed",
        "bed-double-1500x2000",
      );
    }).not.toThrow();
    expect(scenario.placements[0].specificationId).toBe("bed-double-1500x2000");
    expect(JSON.stringify(frozenPlan)).toBe(originalSnapshot);

    // 5. General updatePlacement with patch
    expect(() => {
      scenario = updatePlacement(scenario, frozenPlan, "placement-bed", {
        x: 1200,
        rotation: 180,
      });
    }).not.toThrow();
    expect(scenario.placements[0].x).toBe(1200);
    expect(scenario.placements[0].rotation).toBe(180);
    expect(JSON.stringify(frozenPlan)).toBe(originalSnapshot);

    // 6. Delete/remove placement
    expect(() => {
      scenario = removePlacement(scenario, frozenPlan, "placement-bed");
    }).not.toThrow();
    expect(scenario.placements).toHaveLength(0);
    expect(JSON.stringify(frozenPlan)).toBe(originalSnapshot);

    // Deep equality verification of topology
    expect(frozenPlan.vertices).toEqual(STUDIO_STANDARD_FLOOR_PLAN.vertices);
    expect(frozenPlan.walls).toEqual(STUDIO_STANDARD_FLOOR_PLAN.walls);
    expect(frozenPlan.openings).toEqual(STUDIO_STANDARD_FLOOR_PLAN.openings);
    expect(frozenPlan.rooms).toEqual(STUDIO_STANDARD_FLOOR_PLAN.rooms);
    expect(frozenPlan.meta).toEqual(STUDIO_STANDARD_FLOOR_PLAN.meta);
  });
});

describe("AC-3: Multi-furniture Coexistence & Target Placement Evaluation Contract", () => {
  it("retains multiple furniture placements while a single target placement drives the primary decision, with unselected placements participating in full calculation", () => {
    const plan = THREE_BED_STANDARD_FLOOR_PLAN;

    // 3 pieces of furniture: Bed, Sofa, Desk in room r1 (Living room / master bedroom)
    const bed: FurniturePlacement = {
      id: "placement-bed",
      definitionId: "bed-double",
      specificationId: "bed-double-1800x2000",
      x: 1200,
      y: 1200,
      rotation: 0,
    };
    const sofa: FurniturePlacement = {
      id: "placement-sofa",
      definitionId: "sofa-3seat",
      specificationId: "sofa-3seat-2100x900",
      x: 3500,
      y: 2000,
      rotation: 0,
    };
    const desk: FurniturePlacement = {
      id: "placement-desk",
      definitionId: "desk",
      specificationId: "desk-1200x600",
      x: 2000,
      y: 4500,
      rotation: 90,
    };

    let scenario = createPlacementScenario(plan.meta.id!, [bed, sofa, desk]);
    expect(scenario.placements).toHaveLength(3);

    // --- Case 1: Target is Bed ---
    scenario = setTargetPlacement(scenario, "placement-bed");
    expect(scenario.targetPlacementId).toBe("placement-bed");

    const evalBed = evaluatePlacementScenario(plan, scenario);
    expect(evalBed.targetPlacement?.id).toBe("placement-bed");
    expect(evalBed.summary.hasTargetFurniture).toBe(true);
    expect(evalBed.summary.furnitureName).toBe("bed-double");
    expect(evalBed.summary.dimensions?.formatted).toBe("1800 × 2000 mm");

    // Bilingual test: zh locale translates furnitureName
    const evalBedZh = evaluatePlacementScenario(plan, scenario, { locale: "zh" });
    expect(evalBedZh.summary.furnitureName).toBe("双人床 (1.8m)");

    // All relevant issues for evalBed must involve placement-bed
    for (const issue of evalBed.summary.relevantIssues) {
      const involvesBed =
        issue.relatedEntityIds.includes("placement-bed") ||
        issue.relatedObjectIds.includes("placement-bed");
      expect(involvesBed).toBe(true);
    }

    // --- Case 2: Target is Sofa ---
    scenario = setTargetPlacement(scenario, "placement-sofa");
    expect(scenario.targetPlacementId).toBe("placement-sofa");

    const evalSofa = evaluatePlacementScenario(plan, scenario);
    expect(evalSofa.targetPlacement?.id).toBe("placement-sofa");
    expect(evalSofa.summary.hasTargetFurniture).toBe(true);
    expect(evalSofa.summary.furnitureName).toBe("sofa-3seat");
    expect(evalSofa.summary.dimensions?.formatted).toBe("2100 × 900 mm");

    for (const issue of evalSofa.summary.relevantIssues) {
      const involvesSofa =
        issue.relatedEntityIds.includes("placement-sofa") ||
        issue.relatedObjectIds.includes("placement-sofa");
      expect(involvesSofa).toBe(true);
    }

    // --- Case 3: Target is Undefined (no target selected) ---
    scenario = setTargetPlacement(scenario, undefined);
    expect(scenario.targetPlacementId).toBeUndefined();

    const evalNone = evaluatePlacementScenario(plan, scenario);
    expect(evalNone.targetPlacement).toBeNull();
    expect(evalNone.summary.hasTargetFurniture).toBe(false);
    expect(evalNone.summary.relevantIssues).toHaveLength(0);
    // All 3 furniture placements still participated in total calculations
    expect(evalNone.ruleResults.length).toBe(evalBed.ruleResults.length);
    expect(evalNone.summary.totalViolationsCount).toBe(evalBed.summary.totalViolationsCount);
  });

  it("evaluates mutual furniture collision where both placements participate in calculation", () => {
    const plan = STUDIO_STANDARD_FLOOR_PLAN;

    // Two furniture overlapping at the same location (x: 2000, y: 2000)
    const itemA: FurniturePlacement = {
      id: "item-a",
      definitionId: "bed-double",
      specificationId: "bed-double-1800x2000",
      x: 2000,
      y: 2000,
      rotation: 0,
    };
    const itemB: FurniturePlacement = {
      id: "item-b",
      definitionId: "sofa-3seat",
      specificationId: "sofa-3seat-2100x900",
      x: 2000,
      y: 2000,
      rotation: 0,
    };

    let scenario = createPlacementScenario(plan.meta.id!, [itemA, itemB]);

    // Target = itemA
    scenario = setTargetPlacement(scenario, "item-a");
    const evalA = evaluatePlacementScenario(plan, scenario);

    // Overlap with itemB must be detected
    const overlapIssueA = evalA.summary.relevantIssues.find(
      (i) => i.ruleId === "furniture-overlap",
    );
    expect(overlapIssueA).toBeDefined();
    expect(overlapIssueA?.relatedEntityIds).toContain("item-a");
    expect(overlapIssueA?.relatedObjectIds).toContain("item-b");
    expect(evalA.summary.status).toBe("not-recommended");
    expect(evalA.assessment).toBeDefined();
    expect(evalA.assessment.status).toBe("must-adjust");
    expect(evalA.assessment.findings.some((f) => f.kind === "furniture-overlap")).toBe(true);

    // Target = undefined
    scenario = setTargetPlacement(scenario, undefined);
    const evalNone = evaluatePlacementScenario(plan, scenario);
    expect(evalNone.summary.hasTargetFurniture).toBe(false);
    expect(evalNone.assessment).toBeDefined();
    expect(evalNone.assessment.status).toBe("must-adjust");
    // Overlap is still detected and counted in total violations
    expect(
      evalNone.ruleResults.some((r) => r.ruleId === "furniture-overlap"),
    ).toBe(true);
    expect(evalNone.summary.totalViolationsCount).toBeGreaterThan(0);
  });
});

describe("PlacementScenario Compatibility Converters", () => {
  it("converts FloorPlan with furniture to PlacementScenario and back to FloorPlan", () => {
    const originalPlan = VALID_STANDARD_FLOOR_PLAN;
    expect(originalPlan.furniture.length).toBeGreaterThan(0);

    // Convert FloorPlan -> PlacementScenario
    const scenario = floorPlanToPlacementScenario(originalPlan);
    expect(scenario.planId).toBe(originalPlan.meta.id);
    expect(scenario.placements.length).toBe(originalPlan.furniture.length);
    expect(scenario.targetPlacementId).toBe(originalPlan.furniture[0].id);

    // Alias test
    const scenarioFromAlias = placementScenarioFromFloorPlan(originalPlan);
    expect(scenarioFromAlias).toEqual(scenario);

    // Convert PlacementScenario -> FurnitureInstance[]
    const instances = placementScenarioToFurnitureInstances(scenario);
    expect(instances.length).toBe(scenario.placements.length);
    expect(instances[0].id).toBe(scenario.placements[0].id);
    expect(instances[0].width).toBeGreaterThan(0);
    expect(instances[0].depth).toBeGreaterThan(0);

    // Apply PlacementScenario -> FloorPlan
    const combinedPlan = applyPlacementScenarioToFloorPlan(originalPlan, scenario);
    expect(combinedPlan.furniture.length).toBe(scenario.placements.length);
    // Verify source plan remains unmutated
    expect(originalPlan.vertices).toEqual(combinedPlan.vertices);
    expect(originalPlan.walls).toEqual(combinedPlan.walls);
  });

  it("AC-5: switching specificationId immediately updates resolved entity dimensions and directional clearances while keeping center (x, y) and rotation unchanged", () => {
    const plan = STUDIO_STANDARD_FLOOR_PLAN;
    // Custom catalog with two specs having different dimensions AND different directional clearances
    const customCatalog = {
      version: 2 as const,
      unit: "mm" as const,
      definitions: [
        {
          id: "bed-double",
          name: "Double Bed",
          category: "bed" as const,
          specifications: [
            {
              id: "bed-double-1800",
              name: "1800 × 2000 mm",
              width: 1800,
              depth: 2000,
              clearance: {
                front: { minimum: 800, recommended: 1200 },
                back: { minimum: 0, recommended: 0 },
                left: { minimum: 700, recommended: 900 },
                right: { minimum: 700, recommended: 900 },
              },
            },
            {
              id: "bed-double-1500",
              name: "1500 × 2000 mm",
              width: 1500,
              depth: 2000,
              clearance: {
                front: { minimum: 500, recommended: 650 },
                back: { minimum: 0, recommended: 0 },
                left: { minimum: 450, recommended: 550 },
                right: { minimum: 450, recommended: 550 },
              },
            },
          ],
        },
      ],
    };

    let scenario = createPlacementScenario(
      plan.meta.id!,
      [
        {
          id: "target-bed",
          definitionId: "bed-double",
          specificationId: "bed-double-1800",
          x: 1500,
          y: 1600,
          rotation: 90,
        },
      ],
      "target-bed",
    );

    const evalBefore = evaluatePlacementScenario(plan, scenario, { catalog: customCatalog });
    expect(evalBefore.targetPlacement?.x).toBe(1500);
    expect(evalBefore.targetPlacement?.y).toBe(1600);
    expect(evalBefore.targetPlacement?.rotation).toBe(90);
    expect(evalBefore.summary.dimensions?.widthMm).toBe(1800);
    expect(evalBefore.summary.dimensions?.depthMm).toBe(2000);

    // Switch specificationId to bed-double-1500
    scenario = changePlacementSpecification(scenario, plan, "target-bed", "bed-double-1500");
    const evalAfter = evaluatePlacementScenario(plan, scenario, { catalog: customCatalog });

    // Center (x, y) and rotation are strictly unchanged
    expect(evalAfter.targetPlacement?.x).toBe(1500);
    expect(evalAfter.targetPlacement?.y).toBe(1600);
    expect(evalAfter.targetPlacement?.rotation).toBe(90);

    // Dimensions immediately reflect new specification
    expect(evalAfter.summary.dimensions?.widthMm).toBe(1500);
    expect(evalAfter.summary.dimensions?.depthMm).toBe(2000);

    // Directional clearances in SpaceAssessment immediately reflect new specification thresholds
    for (const f of evalAfter.assessment.findings) {
      if (f.side === "left" || f.side === "right") {
        expect(f.minimumMm).toBe(450);
        expect(f.recommendedMm).toBe(550);
      }
      if (f.side === "front") {
        expect(f.minimumMm).toBe(500);
        expect(f.recommendedMm).toBe(650);
      }
    }
  });
});
