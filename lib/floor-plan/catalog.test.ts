import { describe, expect, it } from "vitest";
import { getStandardPlanById, getStandardPlans } from "./catalog";
import { validateFloorPlan } from "./validators";

describe("Standard Floor Plan Catalog", () => {
  it("returns approved standard plans with complete metadata and valid topologies", () => {
    const plans = getStandardPlans();
    expect(plans.length).toBeGreaterThanOrEqual(3);

    for (const item of plans) {
      expect(item.id).toBeTruthy();
      expect(item.name).toBeTruthy();
      expect(item.areaM2).toBeGreaterThan(0);
      expect(item.formattedArea).toMatch(/\d+(\.\d+)?\s*m²/);
      expect(item.roomCount).toBeGreaterThan(0);
      expect(item.roomBreakdown).toBeTruthy();
      expect(item.tags.length).toBeGreaterThan(0);
      expect(item.plan.meta.isStandard).toBe(true);

      // Verify each plan conforms to the FloorPlan v1 contract
      const validation = validateFloorPlan(item.plan);
      expect(validation.ok).toBe(true);
    }
  });

  it("retrieves standard plan by ID", () => {
    const plan = getStandardPlanById("plan-std-2br-01");
    expect(plan).toBeDefined();
    expect(plan!.name).toBe("2BR-Nordic-Standard");
    expect(plan!.areaM2).toBeCloseTo(30.0, 1);
  });

  it("returns undefined for unknown plan ID", () => {
    const plan = getStandardPlanById("non-existent-plan");
    expect(plan).toBeUndefined();
  });
});
