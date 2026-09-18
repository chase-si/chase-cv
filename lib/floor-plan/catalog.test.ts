import { describe, expect, it } from "vitest";
import { getStandardPlanById, getStandardPlans } from "./catalog";
import { validateFloorPlan } from "./validators";

describe("Standard Floor Plan Catalog (AC-25)", () => {
  it("contains 20–50 approved, scaled Standard plans covering common layouts", () => {
    const plans = getStandardPlans();

    // AC-25: Catalog contains 20–50 approved, scaled Standard plans
    expect(plans.length).toBeGreaterThanOrEqual(20);
    expect(plans.length).toBeLessThanOrEqual(50);

    const ids = new Set<string>();
    const coveredCategories = new Set<string>();

    for (const item of plans) {
      // 1. Unique ID
      expect(item.id).toBeTruthy();
      expect(ids.has(item.id)).toBe(false);
      ids.add(item.id);

      // 2. Name & Description
      expect(item.name).toBeTruthy();
      expect(typeof item.description).toBe("string");

      // 3. Scaled real-world dimensions and area
      expect(item.areaM2).toBeGreaterThan(0);
      expect(item.formattedArea).toMatch(/\d+(\.\d+)?\s*m²/);

      // 4. Room count & breakdown
      expect(item.roomCount).toBeGreaterThanOrEqual(1);
      expect(item.roomBreakdown).toBeTruthy();

      // 5. Meaningful tags
      expect(item.tags.length).toBeGreaterThanOrEqual(1);

      // 6. Source and rights metadata
      expect(item.plan.meta.isStandard).toBe(true);
      expect(["template", "public_domain", "licensed"]).toContain(item.plan.meta.source);

      // Track layout variety
      const idLower = item.id.toLowerCase();
      if (idLower.includes("studio")) coveredCategories.add("studio");
      if (idLower.includes("1b")) coveredCategories.add("1-bedroom");
      if (idLower.includes("2b")) coveredCategories.add("2-bedroom");
      if (idLower.includes("3b")) coveredCategories.add("3-bedroom");
      if (idLower.includes("4b")) coveredCategories.add("4-bedroom");
      if (idLower.includes("5b")) coveredCategories.add("5-bedroom");

      // 7. Canonical FloorPlan v1 contract validation
      const validation = validateFloorPlan(item.plan);
      expect(validation.ok).toBe(true);
      expect(validation.errors).toBeUndefined();
    }

    // AC-25: Covers common 1/2/3-bedroom (and studio/4br/5br) layouts
    expect(coveredCategories.has("studio")).toBe(true);
    expect(coveredCategories.has("1-bedroom")).toBe(true);
    expect(coveredCategories.has("2-bedroom")).toBe(true);
    expect(coveredCategories.has("3-bedroom")).toBe(true);
    expect(coveredCategories.has("4-bedroom")).toBe(true);
  });

  it("retrieves standard plan by ID", () => {
    const plan = getStandardPlanById("plan-std-2br-01");
    expect(plan).toBeDefined();
    expect(plan!.name).toBe("2BR-Nordic-Standard");
    expect(plan!.areaM2).toBeCloseTo(30.0, 1);

    const cnPlan = getStandardPlanById("plan-cn-3b2l-01");
    expect(cnPlan).toBeDefined();
    expect(cnPlan!.name).toBe("紧凑三室两厅双卫 102m²");
    expect(cnPlan!.tags).toContain("3-Bedroom");
  });

  it("returns undefined for unknown plan ID", () => {
    const plan = getStandardPlanById("non-existent-plan");
    expect(plan).toBeUndefined();
  });
});
