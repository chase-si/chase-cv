import { describe, expect, it } from "vitest";
import { CHINA_REPRESENTATIVE_FLOOR_PLANS } from "./china-representative-floor-plans";
import { validateFloorPlan } from "@/lib/floor-plan/validators";
import { computePlanTotalArea } from "@/lib/floor-plan/geometry";

describe("China Representative Floor Plans Catalog Validation", () => {
  it("has at least 20 plans and up to 50 plans", () => {
    expect(CHINA_REPRESENTATIVE_FLOOR_PLANS.length).toBeGreaterThanOrEqual(20);
    expect(CHINA_REPRESENTATIVE_FLOOR_PLANS.length).toBeLessThanOrEqual(50);
  });

  for (const plan of CHINA_REPRESENTATIVE_FLOOR_PLANS) {
    it(`validates plan ${plan.meta.id} (${plan.meta.name})`, () => {
      const result = validateFloorPlan(plan);
      if (!result.ok) {
        console.error(`Validation failure for ${plan.meta.id}:`, result.errors);
      }
      expect(result.ok).toBe(true);
      expect(result.errors).toBeUndefined();

      // Ensure computePlanTotalArea succeeds
      const area = computePlanTotalArea(plan);
      expect(area.areaM2).toBeGreaterThan(0);
    });
  }
});
