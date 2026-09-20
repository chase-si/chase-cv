import { describe, expect, it } from "vitest";
import { getStandardPlanById, getStandardPlans } from "./catalog";
import { validateFloorPlan } from "./validators";

describe("Standard Floor Plan Catalog (AC-25)", () => {
  it("contains 20–50 approved, scaled Standard plans covering common layouts", () => {
    const plans = getStandardPlans();

    // 50 source-derived Chinese residential floor plans
    expect(plans).toHaveLength(50);

    const ids = new Set<string>();
    const coveredCategories = new Set<string>();

    for (const item of plans) {
      // 1. Unique ID
      expect(item.id).toBeTruthy();
      expect(item.id).toMatch(/^plan-cn-[a-z0-9-]+$/);
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
      coveredCategories.add(item.categoryKey);

      // 7. Canonical FloorPlan v1 contract validation
      const validation = validateFloorPlan(item.plan);
      expect(validation.ok).toBe(true);
      expect((validation as any).errors).toBeUndefined();
    }

    // AC-25: Covers common 1/2/3-bedroom (and studio/4br+) layouts
    expect(coveredCategories.has("studio")).toBe(true);
    expect(coveredCategories.has("1b1l")).toBe(true);
    expect(coveredCategories.has("2b1l")).toBe(true);
    expect(coveredCategories.has("3b1l")).toBe(true);
    expect(coveredCategories.has("4b_plus")).toBe(true);
  });

  it("retrieves standard plan by ID", () => {
    const plan = getStandardPlanById("plan-cn-sh-ruidong-2br-67");
    expect(plan).toBeDefined();
    expect(plan!.name).toBe("上海瑞冬小区两居室 67m²");
    expect(plan!.tags).toContain("2B1L");
    expect(plan!.categoryKey).toBe("2b1l");

    const threeBr = getStandardPlanById("plan-cn-nj-lanyuan-3br-70");
    expect(threeBr).toBeDefined();
    expect(threeBr!.name).toContain("兰园");
    expect(threeBr!.tags.some((t) => t.includes("3B") || t.includes("三室"))).toBe(true);
    expect(["3b1l", "3b2l"]).toContain(threeBr!.categoryKey);
  });

  it("returns undefined for unknown plan ID", () => {
    const plan = getStandardPlanById("non-existent-plan");
    expect(plan).toBeUndefined();
  });
});
