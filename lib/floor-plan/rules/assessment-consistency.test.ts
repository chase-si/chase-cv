import { describe, expect, it } from "vitest";
import type { FloorPlan, FurnitureInstance } from "../types";
import { assessPlacementScenario, computePolygonPenetrationDepth } from "../space-assessment";
import { floorPlanToPlacementScenario } from "../placement-scenario";
import { assessmentFromRuleResults, evaluatePlanRules } from "./evaluator";

const sofa = (id: string, x = 3000, y = 3000): FurnitureInstance => ({
  id, definitionId: "sofa-1seat", specificationId: "sofa-1seat-800x800",
  width: 800, depth: 800, x, y, rotation: 0,
});

function room(furniture: FurnitureInstance[]): FloorPlan {
  return {
    version: 2, unit: "mm",
    meta: { id: "consistency", name: "Room", source: "template", createdAt: "2026-10-14", updatedAt: "2026-10-14" },
    vertices: [{ id: "a", x: 0, y: 0 }, { id: "b", x: 6000, y: 0 }, { id: "c", x: 6000, y: 6000 }, { id: "d", x: 0, y: 6000 }],
    walls: [
      { id: "top", from: "a", to: "b", thickness: 200, lockAxis: "horizontal" },
      { id: "right", from: "b", to: "c", thickness: 200, lockAxis: "vertical" },
      { id: "bottom", from: "c", to: "d", thickness: 200, lockAxis: "horizontal" },
      { id: "left", from: "d", to: "a", thickness: 200, lockAxis: "vertical" },
    ],
    rooms: [{ id: "r", type: "living_room", boundaryWallIds: ["top", "right", "bottom", "left"] }],
    openings: [], furniture,
  };
}

describe("One source for furniture alerts, verdicts and the check list", () => {
  it.each([
    [400, "must-adjust", "error"],
    [450, "trade-off", "warning"],
    [500, "trade-off", "warning"],
    [600, "suitable", undefined],
  ] as const)("classifies %i mm front clearance against minimum 450 / recommended 600", (gap, status, severity) => {
    const plan = room([sofa("s", 3000, 5500 - gap)]);
    const issues = evaluatePlanRules(plan);
    expect(issues).toHaveLength(severity ? 1 : 0);
    expect(issues[0]?.severity).toBe(severity);
    expect(issues[0]?.assessmentFinding?.measuredMm).toBe(severity ? gap : undefined);
    expect(assessmentFromRuleResults(plan, issues).status).toBe(status);
    expect(assessmentFromRuleResults(plan, issues, "s").status).toBe(status);
  });

  it("does not invent a passage requirement behind a bed that permits zero back clearance", () => {
    const plan = room([{ id: "bed", definitionId: "bed-double", specificationId: "bed-double-1800", width: 1800, depth: 2000, x: 3000, y: 1200, rotation: 0 }]);
    expect(evaluatePlanRules(plan)).toEqual([]);
  });

  it("counts an overlapping pair once, and marks both participants", () => {
    const plan = room([sofa("z"), sofa("a", 3100)]);
    const issues = evaluatePlanRules(plan);
    expect(issues).toHaveLength(1);
    expect(issues[0].affectedFurnitureIds?.sort()).toEqual(["a", "z"]);
    for (const id of ["a", "z"]) {
      const assessment = assessmentFromRuleResults(plan, issues, id);
      expect(assessment.status).toBe("must-adjust");
      expect(assessment.findings[0].placementId).toBe(id);
    }
  });

  it("does not blame an obstacle whose own directional clearance passes", () => {
    const plan = room([sofa("user"), sofa("obstacle", 3000, 4300)]);
    const issues = evaluatePlanRules(plan);
    expect(issues).toHaveLength(1);
    expect(issues[0].relatedEntityIds).toEqual(["user", "obstacle"]);
    expect(issues[0].affectedFurnitureIds).toEqual(["user"]);
    expect(assessmentFromRuleResults(plan, issues, "user").status).toBe("trade-off");
    expect(assessmentFromRuleResults(plan, issues, "obstacle").status).toBe("suitable");
  });

  it("includes door guidance in the same target and whole-layout verdict", () => {
    const plan = room([sofa("s", 3000, 1100)]);
    plan.openings = [{ id: "door", type: "door", wallId: "top", position: 0.5, width: 900 }];
    const issues = evaluatePlanRules(plan);
    expect(issues).toHaveLength(1);
    expect(issues[0].ruleId).toBe("opening-keep-clear");
    expect(assessmentFromRuleResults(plan, issues).status).toBe("trade-off");
    expect(assessmentFromRuleResults(plan, issues, "s").status).toBe("trade-off");
  });

  it("suppresses millimetre clearance findings in both engines when scale is unknown", () => {
    const plan = room([sofa("s", 3000, 5100)]);
    plan.meta.scaled = false;
    const issues = evaluatePlanRules(plan);
    expect(issues).toEqual([]);
    expect(assessmentFromRuleResults(plan, issues).status).toBe("unavailable");
    expect(assessPlacementScenario(plan, floorPlanToPlacementScenario(plan)).findings).toEqual([]);
  });

  it("reports partial boundary protrusion even when the center is inside", () => {
    const plan = room([sofa("s", 200, 3000)]);
    expect(evaluatePlanRules(plan).some((r) => r.assessmentFinding?.kind === "outside-room")).toBe(true);
  });

  it("measures separation depth when a thin wall is fully inside the furniture footprint", () => {
    const rectangle = (x: number, y: number, w: number, h: number) => [{ x, y }, { x: x + w, y }, { x: x + w, y: y + h }, { x, y: y + h }];
    expect(computePolygonPenetrationDepth(rectangle(0, 0, 800, 800), rectangle(350, -1000, 100, 3000))).toBe(450);
  });
});
