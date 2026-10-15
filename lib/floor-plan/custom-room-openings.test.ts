import { describe, expect, it } from "vitest";
import { createRectangularRoomPlan } from "./rectangular-room";
import {
  type CustomOpeningDraft,
  convertDraftsToOpenings,
  convertOpeningsToDrafts,
  createDefaultOpeningDraft,
  rebuildRectangularRoomDimensions,
  validateCustomOpenings,
} from "./custom-room-openings";

describe("Custom Room Openings Domain & Geometry (AC-7, AC-8, AC-9)", () => {
  const { plan: basePlan } = createRectangularRoomPlan({
    widthMm: 3000,
    depthMm: 4000,
  });

  describe("AC-7: Door & Window Coordinate Conversion", () => {
    it("converts draft on top wall (horizontal, measured from left inner corner)", () => {
      // Room: width = 3000, depth = 4000
      // Wall w-top: from (-60, -60) to (3060, -60), total wall length = 3120
      // Door: width = 900, offset = 0 (starts at x=0)
      // Center x = 450. Along wall from -60: 450 - (-60) = 510.
      // position = 510 / 3120 = 0.1634615...
      const drafts: CustomOpeningDraft[] = [
        { id: "d1", type: "door", wall: "top", widthMm: 900, offsetMm: 0 },
      ];
      const openings = convertDraftsToOpenings(drafts, 3000, 4000);
      expect(openings).toHaveLength(1);
      expect(openings[0].id).toBe("d1");
      expect(openings[0].type).toBe("door");
      expect(openings[0].wallId).toBe("w-top");
      expect(openings[0].width).toBe(900);
      expect(openings[0].position).toBeCloseTo(510 / 3120, 5);

      // Round-trip
      const restored = convertOpeningsToDrafts(openings, 3000, 4000);
      expect(restored).toHaveLength(1);
      expect(restored[0]).toEqual(drafts[0]);
    });

    it("converts draft on bottom wall (horizontal, measured from left inner corner)", () => {
      // Wall w-bottom: from (3060, 4060) to (-60, 4060), total wall length = 3120
      // Vector points from x=3060 to x=-60.
      // Door: width = 900, offset = 0 (starts at x=0)
      // Center x = 450.
      // Distance from from.x (3060) is 3060 - 450 = 2610.
      // position = 2610 / 3120.
      const drafts: CustomOpeningDraft[] = [
        { id: "d2", type: "door", wall: "bottom", widthMm: 900, offsetMm: 0 },
      ];
      const openings = convertDraftsToOpenings(drafts, 3000, 4000);
      expect(openings).toHaveLength(1);
      expect(openings[0].wallId).toBe("w-bottom");
      expect(openings[0].position).toBeCloseTo(2610 / 3120, 5);

      // Round-trip
      const restored = convertOpeningsToDrafts(openings, 3000, 4000);
      expect(restored[0]).toEqual(drafts[0]);
    });

    it("converts draft on right wall (vertical, measured from top inner corner)", () => {
      // Wall w-right: from (3060, -60) to (3060, 4060), total wall length = 4120
      // Window: width = 1200, offset = 1000
      // Center y = 1000 + 600 = 1600.
      // Distance from -60: 1600 - (-60) = 1660.
      // position = 1660 / 4120.
      const drafts: CustomOpeningDraft[] = [
        { id: "w1", type: "window", wall: "right", widthMm: 1200, offsetMm: 1000 },
      ];
      const openings = convertDraftsToOpenings(drafts, 3000, 4000);
      expect(openings).toHaveLength(1);
      expect(openings[0].wallId).toBe("w-right");
      expect(openings[0].position).toBeCloseTo(1660 / 4120, 5);

      // Round-trip
      const restored = convertOpeningsToDrafts(openings, 3000, 4000);
      expect(restored[0]).toEqual(drafts[0]);
    });

    it("converts draft on left wall (vertical, measured from top inner corner)", () => {
      // Wall w-left: from (-60, 4060) to (-60, -60), total wall length = 4120
      // Window: width = 1200, offset = 0
      // Center y = 600.
      // Distance from from.y (4060): 4060 - 600 = 3460.
      // position = 3460 / 4120.
      const drafts: CustomOpeningDraft[] = [
        { id: "w2", type: "window", wall: "left", widthMm: 1200, offsetMm: 0 },
      ];
      const openings = convertDraftsToOpenings(drafts, 3000, 4000);
      expect(openings).toHaveLength(1);
      expect(openings[0].wallId).toBe("w-left");
      expect(openings[0].position).toBeCloseTo(3460 / 4120, 5);

      // Round-trip
      const restored = convertOpeningsToDrafts(openings, 3000, 4000);
      expect(restored[0]).toEqual(drafts[0]);
    });

    it("handles openings exactly at the far corner edge", () => {
      // Top wall (length 3000): width = 900, offset = 2100 (reaches 3000)
      const drafts: CustomOpeningDraft[] = [
        { id: "d-edge", type: "door", wall: "top", widthMm: 900, offsetMm: 2100 },
      ];
      const openings = convertDraftsToOpenings(drafts, 3000, 4000);
      const restored = convertOpeningsToDrafts(openings, 3000, 4000);
      expect(restored[0].offsetMm).toBe(2100);
      expect(restored[0].widthMm).toBe(900);
    });
  });

  describe("AC-8: Multi-opening Validation", () => {
    it("permits an empty openings list (no openings)", () => {
      const res = validateCustomOpenings([], 3000, 4000);
      expect(res.isValid).toBe(true);
      expect(Object.keys(res.errors)).toHaveLength(0);
    });

    it("creates standard default draft for door (900mm) and window (1200mm)", () => {
      const doorDraft = createDefaultOpeningDraft("door", "top");
      expect(doorDraft.type).toBe("door");
      expect(doorDraft.widthMm).toBe(900);
      expect(doorDraft.offsetMm).toBe(0);

      const winDraft = createDefaultOpeningDraft("window", "bottom");
      expect(winDraft.type).toBe("window");
      expect(winDraft.widthMm).toBe(1200);
      expect(winDraft.offsetMm).toBe(0);
    });

    it("validates valid multi-door and multi-window configurations across walls", () => {
      const drafts: CustomOpeningDraft[] = [
        { id: "d1", type: "door", wall: "top", widthMm: 900, offsetMm: 200 },
        { id: "w1", type: "window", wall: "bottom", widthMm: 1400, offsetMm: 500 },
        { id: "w2", type: "window", wall: "left", widthMm: 1200, offsetMm: 1000 },
      ];
      const res = validateCustomOpenings(drafts, 3000, 4000);
      expect(res.isValid).toBe(true);
      expect(Object.keys(res.errors)).toHaveLength(0);
    });

    it("rejects non-positive and non-integer width", () => {
      const drafts: CustomOpeningDraft[] = [
        { id: "bad-w1", type: "door", wall: "top", widthMm: 0, offsetMm: 0 },
        { id: "bad-w2", type: "door", wall: "top", widthMm: -500, offsetMm: 0 },
        { id: "bad-w3", type: "door", wall: "top", widthMm: 900.5, offsetMm: 0 },
      ];
      const res = validateCustomOpenings(drafts, 3000, 4000);
      expect(res.isValid).toBe(false);
      expect(res.errors["bad-w1"]?.width).toBeDefined();
      expect(res.errors["bad-w2"]?.width).toBeDefined();
      expect(res.errors["bad-w3"]?.width).toBeDefined();
    });

    it("rejects negative and non-integer offset", () => {
      const drafts: CustomOpeningDraft[] = [
        { id: "bad-o1", type: "door", wall: "top", widthMm: 900, offsetMm: -100 },
        { id: "bad-o2", type: "door", wall: "top", widthMm: 900, offsetMm: 100.2 },
      ];
      const res = validateCustomOpenings(drafts, 3000, 4000);
      expect(res.isValid).toBe(false);
      expect(res.errors["bad-o1"]?.offset).toBeDefined();
      expect(res.errors["bad-o2"]?.offset).toBeDefined();
    });

    it("rejects openings that exceed the wall length", () => {
      // Wall length is 3000. offset 2500 + width 900 = 3400 > 3000
      const drafts: CustomOpeningDraft[] = [
        { id: "exceed", type: "door", wall: "top", widthMm: 900, offsetMm: 2500 },
      ];
      const res = validateCustomOpenings(drafts, 3000, 4000);
      expect(res.isValid).toBe(false);
      expect(res.errors["exceed"]?.offset || res.errors["exceed"]?.general).toBeDefined();
    });

    it("rejects when default width exceeds a small wall length", () => {
      // Small room width = 800 mm. Default door = 900 mm > 800 mm.
      const drafts: CustomOpeningDraft[] = [
        { id: "d-small", type: "door", wall: "top", widthMm: 900, offsetMm: 0 },
      ];
      const res = validateCustomOpenings(drafts, 800, 1000);
      expect(res.isValid).toBe(false);
      expect(res.errors["d-small"]).toBeDefined();
    });

    it("rejects overlapping openings on the same wall", () => {
      // d1: [0, 900], d2: [800, 1700] -> overlaps between 800 and 900
      const drafts: CustomOpeningDraft[] = [
        { id: "d1", type: "door", wall: "top", widthMm: 900, offsetMm: 0 },
        { id: "d2", type: "door", wall: "top", widthMm: 900, offsetMm: 800 },
      ];
      const res = validateCustomOpenings(drafts, 3000, 4000);
      expect(res.isValid).toBe(false);
      expect(res.errors["d1"] || res.errors["d2"]).toBeDefined();
    });

    it("permits same-wall openings that touch edge-to-edge", () => {
      // d1: [0, 900], win: [900, 2100] -> touch at 900, does not overlap!
      const drafts: CustomOpeningDraft[] = [
        { id: "d1", type: "door", wall: "top", widthMm: 900, offsetMm: 0 },
        { id: "win", type: "window", wall: "top", widthMm: 1200, offsetMm: 900 },
      ];
      const res = validateCustomOpenings(drafts, 3000, 4000);
      expect(res.isValid).toBe(true);
      expect(Object.keys(res.errors)).toHaveLength(0);
    });

    it("does not treat openings on different walls as overlapping", () => {
      // d1 on top [0, 900], d2 on left [0, 900]
      const drafts: CustomOpeningDraft[] = [
        { id: "d1", type: "door", wall: "top", widthMm: 900, offsetMm: 0 },
        { id: "d2", type: "door", wall: "left", widthMm: 900, offsetMm: 0 },
      ];
      const res = validateCustomOpenings(drafts, 3000, 4000);
      expect(res.isValid).toBe(true);
      expect(Object.keys(res.errors)).toHaveLength(0);
    });
  });

  describe("AC-9: Rebuild Room Dimensions Contract", () => {
    it("does not clear openings or furniture if dimensions are identical (only name changed)", () => {
      const planWithItems = {
        ...basePlan,
        openings: [
          { id: "op1", type: "door" as const, wallId: "w-top", position: 0.5, width: 900 },
        ],
        furniture: [
          { id: "f1", definitionId: "bed-double", x: 1000, y: 1000, width: 1500, depth: 2000, rotation: 0 },
        ],
      };

      const result = rebuildRectangularRoomDimensions(planWithItems, {
        widthMm: 3000,
        depthMm: 4000,
        name: "重命名主卧",
      });

      expect(result.cleared).toBe(false);
      expect(result.plan.meta.name).toBe("重命名主卧");
      expect(result.plan.openings).toHaveLength(1);
      expect(result.plan.furniture).toHaveLength(1);
    });

    it("clears all openings and furniture and rebuilds room when dimensions change", () => {
      const planWithItems = {
        ...basePlan,
        openings: [
          { id: "op1", type: "door" as const, wallId: "w-top", position: 0.5, width: 900 },
        ],
        furniture: [
          { id: "f1", definitionId: "bed-double", x: 1000, y: 1000, width: 1500, depth: 2000, rotation: 0 },
        ],
      };

      const result = rebuildRectangularRoomDimensions(planWithItems, {
        widthMm: 3600,
        depthMm: 4800,
      });

      expect(result.cleared).toBe(true);
      expect(result.plan.meta.customRoom?.widthMm).toBe(3600);
      expect(result.plan.meta.customRoom?.depthMm).toBe(4800);
      expect(result.plan.openings).toHaveLength(0);
      expect(result.plan.furniture).toHaveLength(0);

      // Verify vertices updated outward by 60mm
      const topWall = result.plan.walls.find((w) => w.id === "w-top");
      expect(topWall).toBeDefined();
      const vTr = result.plan.vertices.find((v) => v.id === "v-tr");
      expect(vTr?.x).toBe(3660);
      expect(vTr?.y).toBe(-60);
    });
  });
});
