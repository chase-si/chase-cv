import { describe, expect, it } from "vitest";
import { VALID_STANDARD_FLOOR_PLAN } from "./fixtures/valid-standard-plan";
import { getDefaultFurnitureCatalog } from "./furniture-catalog";
import * as furnitureOperationsModule from "./furniture-operations";
import {
  addFurnitureInstance,
  changeFurnitureSpecification,
  computeRoomInitialDropPosition,
  deleteFurnitureInstance,
  getFurnitureInstanceDetails,
  moveFurnitureInstance,
  rotateFurnitureInstance,
} from "./furniture-operations";
import * as floorPlanIndex from "./index";
import type { FloorPlan } from "./types";

function createTestPlan(): FloorPlan {
  return JSON.parse(JSON.stringify(VALID_STANDARD_FLOOR_PLAN));
}

describe("Furniture Operations (AC-4, AC-5, AC-10, AC-11)", () => {
  const catalog = getDefaultFurnitureCatalog();

  describe("addFurnitureInstance (AC-10)", () => {
    it("adds an item strictly using its default specification dimensions from definition", () => {
      const plan = createTestPlan();
      const initialCount = plan.furniture.length;

      const result = addFurnitureInstance(plan, catalog, "bed-double");
      expect(result.success).toBe(true);

      if (result.success) {
        expect(result.plan.furniture.length).toBe(initialCount + 1);
        expect(result.instance.definitionId).toBe("bed-double");
        expect(result.instance.specificationId).toBe("bed-double-1800");
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
      const dropPosR1 = computeRoomInitialDropPosition(plan, "r1");
      expect(dropPosR1).not.toBeNull();
      expect(dropPosR1?.x).toBe(1500);
      expect(dropPosR1?.y).toBe(2500);

      const dropPosR2 = computeRoomInitialDropPosition(plan, "r2");
      expect(dropPosR2).not.toBeNull();
      expect(dropPosR2?.x).toBe(4500);
      expect(dropPosR2?.y).toBe(2500);

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

      if (result.success) {
        result.instance.width = 9999;
        expect(defAfter.specifications[0].width).toBe(1200);
      }
    });

    it("fails when definitionId or specificationId is not found in catalog", () => {
      const plan = createTestPlan();
      const result = addFurnitureInstance(plan, catalog, "non-existent-furniture");
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain("non-existent-furniture");
      }

      const badSpecResult = addFurnitureInstance(plan, catalog, "bed-double", {
        specificationId: "bed-double-unknown-spec",
      });
      expect(badSpecResult.success).toBe(false);
      if (!badSpecResult.success) {
        expect(badSpecResult.error).toContain("bed-double-unknown-spec");
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
      plan.furniture[0].rotation = 0;

      let currentPlan = plan;

      let res = rotateFurnitureInstance(currentPlan, targetId, 90);
      expect(res.success).toBe(true);
      if (res.success) {
        expect(res.instance.rotation).toBe(90);
        currentPlan = res.plan;
      }

      res = rotateFurnitureInstance(currentPlan, targetId, 90);
      expect(res.success).toBe(true);
      if (res.success) {
        expect(res.instance.rotation).toBe(180);
        currentPlan = res.plan;
      }

      res = rotateFurnitureInstance(currentPlan, targetId, 90);
      expect(res.success).toBe(true);
      if (res.success) {
        expect(res.instance.rotation).toBe(270);
        currentPlan = res.plan;
      }

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

  describe("Arbitrary Resize Removal & Predefined Specifications Only (AC-4, Issue #225)", () => {
    it("removes resizeFurnitureInstance from furniture-operations and floor-plan barrel exports", () => {
      expect("resizeFurnitureInstance" in furnitureOperationsModule).toBe(false);
      expect("resizeFurnitureInstance" in floorPlanIndex).toBe(false);
    });

    it("getFurnitureInstanceDetails resolves active specification without legacy widthRange/depthRange", () => {
      const plan = createTestPlan();
      const addRes = addFurnitureInstance(plan, catalog, "bed-double", {
        specificationId: "bed-double-1500",
      });
      expect(addRes.success).toBe(true);
      if (!addRes.success) return;

      const details = getFurnitureInstanceDetails(
        addRes.plan,
        catalog,
        addRes.instance.id,
      );
      expect(details).toBeDefined();
      expect(details?.specification?.id).toBe("bed-double-1500");
      expect(details?.specification?.width).toBe(1500);
      expect("widthRange" in (details ?? {})).toBe(false);
      expect("depthRange" in (details ?? {})).toBe(false);
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

  describe("Predefined specification addition and switching (AC-4, AC-5)", () => {
    it("adds furniture with an explicit predefined specificationId", () => {
      const plan = createTestPlan();
      const res = addFurnitureInstance(plan, catalog, "bed-double", {
        specificationId: "bed-double-1500",
        x: 1600,
        y: 1900,
        rotation: 90,
      });

      expect(res.success).toBe(true);
      if (res.success) {
        expect(res.instance.definitionId).toBe("bed-double");
        expect(res.instance.specificationId).toBe("bed-double-1500");
        expect(res.instance.width).toBe(1500);
        expect(res.instance.depth).toBe(2000);
        expect(res.instance.x).toBe(1600);
        expect(res.instance.y).toBe(1900);
        expect(res.instance.rotation).toBe(90);
      }
    });

    it("AC-5: switches specificationId via changeFurnitureSpecification while preserving center (x, y) and rotation", () => {
      const plan = createTestPlan();
      const addRes = addFurnitureInstance(plan, catalog, "bed-double", {
        specificationId: "bed-double-1800",
        x: 2450,
        y: 1820,
        rotation: 270,
      });
      expect(addRes.success).toBe(true);
      if (!addRes.success) return;

      const switchRes = changeFurnitureSpecification(
        addRes.plan,
        catalog,
        addRes.instance.id,
        "bed-double-1500",
      );
      expect(switchRes.success).toBe(true);
      if (switchRes.success) {
        expect(switchRes.instance.specificationId).toBe("bed-double-1500");
        expect(switchRes.instance.width).toBe(1500);
        expect(switchRes.instance.depth).toBe(2000);
        expect(switchRes.instance.x).toBe(2450);
        expect(switchRes.instance.y).toBe(1820);
        expect(switchRes.instance.rotation).toBe(270);
      }
    });
  });
});
