import { describe, expect, it } from "vitest";
import { VALID_STANDARD_FLOOR_PLAN } from "./fixtures/valid-standard-plan";
import {
  calculateOpeningPositionBounds,
  DEFAULT_OPENING_END_MARGIN_MM,
  MIN_OPENING_WIDTH_MM,
  previewOpeningUpdate,
  updateOpening,
} from "./opening-adjustment";
import { adjustRoomSpan } from "./room-adjustment";
import type { FloorPlan } from "./types";

describe("Opening Adjustment Domain Operations (US-9, AC-9)", () => {
  describe("calculateOpeningPositionBounds", () => {
    it("computes accurate min and max ratio bounds for default end margin", () => {
      // Wall: 3000 mm, Opening width: 900 mm, default margin: 100 mm
      // min = (100 + 450) / 3000 = 550 / 3000 = 0.18333...
      // max = (3000 - 100 - 450) / 3000 = 2450 / 3000 = 0.81666...
      const bounds = calculateOpeningPositionBounds(3000, 900);
      expect(bounds.valid).toBe(true);
      expect(bounds.minPositionRatio).toBeCloseTo(550 / 3000, 4);
      expect(bounds.maxPositionRatio).toBeCloseTo(2450 / 3000, 4);
      expect(bounds.maxAllowedWidthMm).toBe(2800);
      expect(bounds.wallLengthMm).toBe(3000);
    });

    it("respects custom configurable end margins", () => {
      // Wall: 4000 mm, width: 1200 mm, margin: 250 mm
      // min = (250 + 600) / 4000 = 850 / 4000 = 0.2125
      // max = (4000 - 250 - 600) / 4000 = 3150 / 4000 = 0.7875
      const bounds = calculateOpeningPositionBounds(4000, 1200, 250);
      expect(bounds.valid).toBe(true);
      expect(bounds.minPositionRatio).toBeCloseTo(0.2125, 4);
      expect(bounds.maxPositionRatio).toBeCloseTo(0.7875, 4);
      expect(bounds.maxAllowedWidthMm).toBe(3500);
    });

    it("flags invalid if opening width exceeds wall length minus margins", () => {
      // Wall: 1000 mm, width: 900 mm, margin: 100 mm => max allowed is 800 mm
      const bounds = calculateOpeningPositionBounds(1000, 900, 100);
      expect(bounds.valid).toBe(false);
      expect(bounds.maxAllowedWidthMm).toBe(800);
    });
  });

  describe("updateOpening", () => {
    it("updates opening position ratio within allowed range (AC-9)", () => {
      // door1 is on w5 (length 3000 mm, width 900 mm, initial position 0.5)
      const result = updateOpening(VALID_STANDARD_FLOOR_PLAN, {
        openingId: "door1",
        positionRatio: 0.35,
      });

      expect(result.success).toBe(true);
      if (!result.success) return;

      const updated = result.plan.openings.find((o) => o.id === "door1")!;
      expect(updated.position).toBeCloseTo(0.35, 4);
      expect(updated.width).toBe(900);
      expect(updated.wallId).toBe("w6");
      expect(result.distanceFromStartMm).toBeCloseTo(0.35 * 5000, 2);
    });

    it("updates opening width within wall length minus end margins (AC-9)", () => {
      // door1 on w6 (length 5000 mm, initial width 900 mm, initial position 0.3)
      const result = updateOpening(VALID_STANDARD_FLOOR_PLAN, {
        openingId: "door1",
        widthMm: 1200,
      });

      expect(result.success).toBe(true);
      if (!result.success) return;

      const updated = result.plan.openings.find((o) => o.id === "door1")!;
      expect(updated.width).toBe(1200);
      expect(updated.position).toBe(0.3);
    });

    it("updates both position and width simultaneously", () => {
      const result = updateOpening(VALID_STANDARD_FLOOR_PLAN, {
        openingId: "door1",
        positionRatio: 0.4,
        widthMm: 1000,
        endMarginMm: 150,
      });

      expect(result.success).toBe(true);
      if (!result.success) return;

      const updated = result.plan.openings.find((o) => o.id === "door1")!;
      expect(updated.width).toBe(1000);
      expect(updated.position).toBeCloseTo(0.4, 4);
    });

    it("rejects position violating start end margin (AC-9)", () => {
      // door1: width 900, wall w5: 3000. min ratio = (100 + 450)/3000 = 0.1833
      // Trying position 0.10 should be rejected!
      const originalClone = JSON.parse(JSON.stringify(VALID_STANDARD_FLOOR_PLAN));
      const result = updateOpening(VALID_STANDARD_FLOOR_PLAN, {
        openingId: "door1",
        positionRatio: 0.1,
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toMatch(/end margin/i);
      }

      // Non-mutation guarantee
      expect(VALID_STANDARD_FLOOR_PLAN).toEqual(originalClone);
    });

    it("rejects position violating far end margin (AC-9)", () => {
      // door1: width 900, wall w5: 3000. max ratio = (3000 - 550)/3000 = 0.8167
      // Trying position 0.90 should be rejected!
      const result = updateOpening(VALID_STANDARD_FLOOR_PLAN, {
        openingId: "door1",
        positionRatio: 0.9,
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toMatch(/end margin/i);
      }
    });

    it("rejects opening width smaller than MIN_OPENING_WIDTH_MM", () => {
      const result = updateOpening(VALID_STANDARD_FLOOR_PLAN, {
        openingId: "door1",
        widthMm: 200, // < 300 mm
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toMatch(/at least 300 mm/i);
      }
    });

    it("rejects opening width exceeding wall length minus margins (AC-9)", () => {
      // wall w6 is 5000 mm. Max allowed with 100 mm margins is 4800 mm.
      const result = updateOpening(VALID_STANDARD_FLOOR_PLAN, {
        openingId: "door1",
        widthMm: 4900,
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toMatch(/exceeds maximum allowable width/i);
      }
    });

    it("returns error if opening does not exist", () => {
      const result = updateOpening(VALID_STANDARD_FLOOR_PLAN, {
        openingId: "nonexistent-opening",
        positionRatio: 0.5,
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toMatch(/not found/i);
      }
    });

    it("guarantees non-mutation of input plan when operation succeeds", () => {
      const originalClone = JSON.parse(JSON.stringify(VALID_STANDARD_FLOOR_PLAN));
      const result = updateOpening(VALID_STANDARD_FLOOR_PLAN, {
        openingId: "door1",
        widthMm: 1100,
      });

      expect(result.success).toBe(true);
      expect(VALID_STANDARD_FLOOR_PLAN).toEqual(originalClone);
    });
  });

  describe("previewOpeningUpdate", () => {
    it("previews opening update without side effects", () => {
      const preview = previewOpeningUpdate(VALID_STANDARD_FLOOR_PLAN, {
        openingId: "door1",
        positionRatio: 0.45,
        widthMm: 1000,
      });

      expect(preview.success).toBe(true);
      if (preview.success) {
        expect(preview.opening.position).toBe(0.45);
        expect(preview.opening.width).toBe(1000);
      }
    });
  });

  describe("Wall Change Compatibility (#177 & AC-9)", () => {
    it("maintains opening attachment by ratio after supported room span changes", () => {
      // 1. Move opening door1 to 0.4 on w6
      const movedResult = updateOpening(VALID_STANDARD_FLOOR_PLAN, {
        openingId: "door1",
        positionRatio: 0.4,
      });
      expect(movedResult.success).toBe(true);
      if (!movedResult.success) return;

      // 2. Adjust room span of r1 along horizontal axis
      const adjustedSpanResult = adjustRoomSpan({
        plan: movedResult.plan,
        roomId: "r1",
        axis: "horizontal",
        boundarySide: "max",
        targetSpanMm: 3600,
      });
      expect(adjustedSpanResult.success).toBe(true);
      if (!adjustedSpanResult.success) return;

      // 3. Opening door1 should remain attached to w6 with ratio 0.4
      const door1 = adjustedSpanResult.plan.openings.find((o) => o.id === "door1")!;
      expect(door1).toBeDefined();
      expect(door1.wallId).toBe("w6");
      expect(door1.position).toBeCloseTo(0.4, 4);

      // win1 on w1 should still be attached
      const win1 = adjustedSpanResult.plan.openings.find((o) => o.id === "win1")!;
      expect(win1).toBeDefined();
      expect(win1.wallId).toBe("w1");
    });
  });
});
