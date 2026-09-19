import { describe, expect, it } from "vitest";
import { VALID_STANDARD_FLOOR_PLAN } from "./fixtures/valid-standard-plan";
import {
  getDefaultFurnitureCatalog,
  STANDARD_FURNITURE_CATALOG,
} from "./furniture-catalog";
import {
  addFurnitureInstance,
  computeRoomInitialDropPosition,
  deleteFurnitureInstance,
  moveFurnitureInstance,
  resizeFurnitureInstance,
  rotateFurnitureInstance,
} from "./furniture-operations";
import type { FloorPlan } from "./types";

function createTestPlan(): FloorPlan {
  return JSON.parse(JSON.stringify(VALID_STANDARD_FLOOR_PLAN));
}

describe("Furniture Operations (US-10, US-11, AC-10, AC-11)", () => {
  const catalog = getDefaultFurnitureCatalog();

  describe("addFurnitureInstance (AC-10)", () => {
    it("adds an item using its default dimensions from definition", () => {
      const plan = createTestPlan();
      const initialCount = plan.furniture.length;

      const result = addFurnitureInstance(plan, catalog, "bed-double");
      expect(result.success).toBe(true);

      if (result.success) {
        expect(result.plan.furniture.length).toBe(initialCount + 1);
        expect(result.instance.definitionId).toBe("bed-double");
        expect(result.instance.width).toBe(1800);
        expect(result.instance.depth).toBe(2000);
        expect(result.instance.rotation).toBe(0);
        expect(typeof result.instance.id).toBe("string");
        expect(result.instance.id.length).toBeGreaterThan(0);
      }
    });

    it("respects custom placement coordinates and rotation", () => {
      const plan = createTestPlan();
      const result = addFurnitureInstance(plan, catalog, "sofa-3seat", {
        x: 3500,
        y: 4200,
        rotation: 180,
        id: "custom-sofa-1",
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.instance.id).toBe("custom-sofa-1");
        expect(result.instance.x).toBe(3500);
        expect(result.instance.y).toBe(4200);
        expect(result.instance.rotation).toBe(180);
        expect(result.instance.width).toBe(2100);
        expect(result.instance.depth).toBe(900);
      }
    });

    it("AC-13: computes deterministic initial drop position in selected room", () => {
      const plan = createTestPlan();
      // Room r1 (Living Room): vertices v1(0,0), v2(3000,0), v3(3000,5000), v4(0,5000) -> centroid (1500, 2500)
      const dropPosR1 = computeRoomInitialDropPosition(plan, "r1");
      expect(dropPosR1).not.toBeNull();
      expect(dropPosR1?.x).toBe(1500);
      expect(dropPosR1?.y).toBe(2500);

      // Room r2 (Master Bedroom): vertices v2(3000,0), v5(6000,0), v6(6000,5000), v3(3000,5000) -> centroid (4500, 2500)
      const dropPosR2 = computeRoomInitialDropPosition(plan, "r2");
      expect(dropPosR2).not.toBeNull();
      expect(dropPosR2?.x).toBe(4500);
      expect(dropPosR2?.y).toBe(2500);

      // Placing with roomId places item at deterministic room drop position
      const result = addFurnitureInstance(plan, catalog, "bed-double", {
        roomId: "r2",
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.instance.x).toBe(4500);
        expect(result.instance.y).toBe(2500);
      }
    });

    it("guarantees FurnitureDefinition remains immutable", () => {
      const plan = createTestPlan();
      const defBefore = catalog.definitions.find((d) => d.id === "desk")!;
      const beforeSnapshot = JSON.stringify(defBefore);

      const result = addFurnitureInstance(plan, catalog, "desk");
      expect(result.success).toBe(true);

      const defAfter = catalog.definitions.find((d) => d.id === "desk")!;
      expect(JSON.stringify(defAfter)).toBe(beforeSnapshot);

      // Verify that modifying the instance does not affect the catalog definition
      if (result.success) {
        result.instance.width = 9999;
        expect(defAfter.defaultSize.width).toBe(1200);
      }
    });

    it("fails when definitionId is not found in catalog", () => {
      const plan = createTestPlan();
      const result = addFurnitureInstance(plan, catalog, "non-existent-furniture");
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain("non-existent-furniture");
      }
    });

    it("does not mutate original plan when addition fails", () => {
      const plan = createTestPlan();
      const originalCount = plan.furniture.length;
      addFurnitureInstance(plan, catalog, "invalid-id");
      expect(plan.furniture.length).toBe(originalCount);
    });
  });

  describe("moveFurnitureInstance (AC-11)", () => {
    it("updates position coordinates of existing furniture", () => {
      const plan = createTestPlan();
      const targetId = plan.furniture[0].id;

      const result = moveFurnitureInstance(plan, targetId, 2500, 3100);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.instance.x).toBe(2500);
        expect(result.instance.y).toBe(3100);
        const inPlan = result.plan.furniture.find((f) => f.id === targetId);
        expect(inPlan?.x).toBe(2500);
        expect(inPlan?.y).toBe(3100);
      }
    });

    it("fails when moving non-existent furniture instance", () => {
      const plan = createTestPlan();
      const result = moveFurnitureInstance(plan, "unknown-id", 1000, 1000);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain("unknown-id");
      }
    });

    it("rejects non-finite coordinates with clear reason and non-mutation", () => {
      const plan = createTestPlan();
      const targetId = plan.furniture[0].id;
      const initialX = plan.furniture[0].x;

      const result = moveFurnitureInstance(plan, targetId, NaN, 1000);
      expect(result.success).toBe(false);
      expect(plan.furniture[0].x).toBe(initialX);
    });
  });

  describe("rotateFurnitureInstance (AC-11)", () => {
    it("rotates furniture in 90-degree steps and cycles back to 0", () => {
      const plan = createTestPlan();
      const targetId = plan.furniture[0].id;
      // Force initial rotation to 0
      plan.furniture[0].rotation = 0;

      let currentPlan = plan;

      // 0 -> 90
      let res = rotateFurnitureInstance(currentPlan, targetId, 90);
      expect(res.success).toBe(true);
      if (res.success) {
        expect(res.instance.rotation).toBe(90);
        currentPlan = res.plan;
      }

      // 90 -> 180
      res = rotateFurnitureInstance(currentPlan, targetId, 90);
      expect(res.success).toBe(true);
      if (res.success) {
        expect(res.instance.rotation).toBe(180);
        currentPlan = res.plan;
      }

      // 180 -> 270
      res = rotateFurnitureInstance(currentPlan, targetId, 90);
      expect(res.success).toBe(true);
      if (res.success) {
        expect(res.instance.rotation).toBe(270);
        currentPlan = res.plan;
      }

      // 270 -> 0
      res = rotateFurnitureInstance(currentPlan, targetId, 90);
      expect(res.success).toBe(true);
      if (res.success) {
        expect(res.instance.rotation).toBe(0);
      }
    });

    it("supports negative 90-degree rotation step", () => {
      const plan = createTestPlan();
      const targetId = plan.furniture[0].id;
      plan.furniture[0].rotation = 0;

      const res = rotateFurnitureInstance(plan, targetId, -90);
      expect(res.success).toBe(true);
      if (res.success) {
        expect(res.instance.rotation).toBe(270);
      }
    });

    it("fails when rotating non-existent furniture", () => {
      const plan = createTestPlan();
      const res = rotateFurnitureInstance(plan, "ghost-furniture");
      expect(res.success).toBe(false);
    });
  });

  describe("resizeFurnitureInstance (AC-11)", () => {
    it("resizes furniture within configured min/max limits", () => {
      const plan = createTestPlan();
      const addRes = addFurnitureInstance(plan, catalog, "bed-double");
      expect(addRes.success).toBe(true);
      if (!addRes.success) return;

      const furnitureId = addRes.instance.id;
      // bed-double: width [1500, 2000], depth [1900, 2200]
      const resizeRes = resizeFurnitureInstance(
        addRes.plan,
        catalog,
        furnitureId,
        1600,
        2100,
      );

      expect(resizeRes.success).toBe(true);
      if (resizeRes.success) {
        expect(resizeRes.instance.width).toBe(1600);
        expect(resizeRes.instance.depth).toBe(2100);
      }
    });

    it("rejects width below minimum with clear reason and does not mutate plan", () => {
      const plan = createTestPlan();
      const addRes = addFurnitureInstance(plan, catalog, "bed-double");
      expect(addRes.success).toBe(true);
      if (!addRes.success) return;

      const furnitureId = addRes.instance.id;
      const resizeRes = resizeFurnitureInstance(
        addRes.plan,
        catalog,
        furnitureId,
        1400, // min is 1500
        2000,
      );

      expect(resizeRes.success).toBe(false);
      if (!resizeRes.success) {
        expect(resizeRes.error).toMatch(/1400.*below.*1500|outside.*range/i);
      }

      // Non-mutation check
      const unchanged = addRes.plan.furniture.find((f) => f.id === furnitureId);
      expect(unchanged?.width).toBe(1800);
    });

    it("rejects depth above maximum with clear reason and does not mutate plan", () => {
      const plan = createTestPlan();
      const addRes = addFurnitureInstance(plan, catalog, "bed-double");
      expect(addRes.success).toBe(true);
      if (!addRes.success) return;

      const furnitureId = addRes.instance.id;
      const resizeRes = resizeFurnitureInstance(
        addRes.plan,
        catalog,
        furnitureId,
        1800,
        2400, // max is 2200
      );

      expect(resizeRes.success).toBe(false);
      if (!resizeRes.success) {
        expect(resizeRes.error).toMatch(/2400.*exceeds.*2200|outside.*range/i);
      }

      const unchanged = addRes.plan.furniture.find((f) => f.id === furnitureId);
      expect(unchanged?.depth).toBe(2000);
    });

    it("supports clamp option to bound dimensions to min and max", () => {
      const plan = createTestPlan();
      const addRes = addFurnitureInstance(plan, catalog, "bed-double");
      expect(addRes.success).toBe(true);
      if (!addRes.success) return;

      const furnitureId = addRes.instance.id;
      const clampRes = resizeFurnitureInstance(
        addRes.plan,
        catalog,
        furnitureId,
        3000, // exceeds max 2000
        1000, // below min 1900
        { clamp: true },
      );

      expect(clampRes.success).toBe(true);
      if (clampRes.success) {
        expect(clampRes.instance.width).toBe(2000);
        expect(clampRes.instance.depth).toBe(1900);
      }
    });

    it("rejects non-positive numbers", () => {
      const plan = createTestPlan();
      const targetId = plan.furniture[0].id;
      const res = resizeFurnitureInstance(plan, catalog, targetId, -500, 800);
      expect(res.success).toBe(false);
    });
  });

  describe("deleteFurnitureInstance (AC-11)", () => {
    it("deletes specified furniture instance from plan", () => {
      const plan = createTestPlan();
      const targetId = plan.furniture[0].id;
      const originalCount = plan.furniture.length;

      const result = deleteFurnitureInstance(plan, targetId);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.plan.furniture.length).toBe(originalCount - 1);
        expect(result.plan.furniture.some((f) => f.id === targetId)).toBe(false);
      }
    });

    it("fails when deleting non-existent furniture instance", () => {
      const plan = createTestPlan();
      const result = deleteFurnitureInstance(plan, "unknown-id-xyz");
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain("unknown-id-xyz");
      }
    });
  });
});
