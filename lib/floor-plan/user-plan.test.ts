import { describe, expect, it } from "vitest";
import { VALID_STANDARD_FLOOR_PLAN } from "./fixtures";
import type { FloorPlan, StandardFloorPlan } from "./types";
import {
  createOrResumeUserPlan,
  exportFloorPlanAsJson,
  isUserPlan,
} from "./user-plan";
import { validateFloorPlan } from "./validators";

describe("User Plan Lifecycle & Immutability (AC-2, AC-16)", () => {
  const standardTemplate: StandardFloorPlan = VALID_STANDARD_FLOOR_PLAN;

  describe("createOrResumeUserPlan (AC-2)", () => {
    it("creates a User plan from a standard plan with user source and template reference", () => {
      const userPlan = createOrResumeUserPlan(standardTemplate);

      expect(isUserPlan(userPlan)).toBe(true);
      expect(userPlan.meta.source).toBe("user");
      expect(userPlan.meta.isStandard).toBe(false);
      expect(userPlan.meta.templateId).toBe(standardTemplate.meta.id);
      expect(userPlan.meta.id).toBe(`user-plan-${standardTemplate.meta.id}`);
      expect(userPlan.version).toBe(2);
      expect(userPlan.unit).toBe("mm");
      expect(userPlan.walls.length).toBe(standardTemplate.walls.length);
      expect(userPlan.furniture.length).toBe(standardTemplate.furniture.length);
    });

    it("leaves the source standard plan byte-for-byte unchanged after mutations (AC-2)", () => {
      const baselineJson = JSON.stringify(standardTemplate);

      const userPlan = createOrResumeUserPlan(standardTemplate);

      // Mutate the user plan deeply
      userPlan.meta.name = "Renamed Custom Floor Plan";
      userPlan.vertices[0].x += 500;
      userPlan.walls[0].thickness = 240;
      userPlan.furniture.push({
        id: "f-new-1",
        definitionId: "bed-king",
        x: 1000,
        y: 1000,
        width: 1800,
        depth: 2000,
        rotation: 90,
      });

      // Verify the source standard template remains byte-for-byte identical
      const afterMutationJson = JSON.stringify(standardTemplate);
      expect(afterMutationJson).toBe(baselineJson);
      expect(standardTemplate.furniture.length).not.toBe(userPlan.furniture.length);
      expect(standardTemplate.meta.name).not.toBe(userPlan.meta.name);
    });
  });

  describe("isUserPlan", () => {
    it("distinguishes user plans from standard templates", () => {
      expect(isUserPlan(standardTemplate)).toBe(false);

      const userPlan = createOrResumeUserPlan(standardTemplate);
      expect(isUserPlan(userPlan)).toBe(true);
    });
  });

  describe("exportFloorPlanAsJson (AC-16)", () => {
    it("exports current User plan as formatted JSON that passes validateFloorPlan", () => {
      const userPlan = createOrResumeUserPlan(standardTemplate);
      const exportedJson = exportFloorPlanAsJson(userPlan);

      expect(typeof exportedJson).toBe("string");
      const parsed = JSON.parse(exportedJson);

      const validationResult = validateFloorPlan(parsed);
      expect(validationResult.ok).toBe(true);
      if (validationResult.ok) {
        expect(validationResult.value.meta.source).toBe("user");
        expect(validationResult.value.unit).toBe("mm");
      }
    });

    it("throws a descriptive error when trying to export an invalid plan", () => {
      const invalidPlan = {
        ...standardTemplate,
        version: 999, // invalid version
      } as unknown as FloorPlan;

      expect(() => exportFloorPlanAsJson(invalidPlan)).toThrow(/FloorPlan version must be 2/i);
    });
  });
});
