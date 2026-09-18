import { describe, expect, it } from "vitest";
import { VALID_STANDARD_FLOOR_PLAN } from "./fixtures/valid-standard-plan";
import { STUDIO_STANDARD_FLOOR_PLAN, THREE_BED_STANDARD_FLOOR_PLAN } from "./fixtures/standard-plans";
import {
  adjustRoomSpan,
  getRoomSpans,
  previewRoomSpanAdjustment,
  MIN_ROOM_SPAN_MM,
  MAX_ROOM_SPAN_MM,
} from "./room-adjustment";
import { computePolygonArea, computeRoomPolygon, getVertexMap, getWallMap } from "./geometry";
import type { FloorPlan } from "./types";

describe("Room Span Adjustment - Geometry Operations (AC-6, AC-7)", () => {
  describe("getRoomSpans", () => {
    it("calculates accurate horizontal and vertical spans for rectangular rooms", () => {
      const spans = getRoomSpans(VALID_STANDARD_FLOOR_PLAN, "r1");
      expect(spans).not.toBeNull();
      expect(spans?.roomId).toBe("r1");
      expect(spans?.roomName).toBe("Living Room");

      // r1: (0,0) to (3000, 5000)
      expect(spans?.horizontal).toBeDefined();
      expect(spans?.horizontal?.spanMm).toBe(3000);
      expect(spans?.horizontal?.minBoundary.coordinate).toBe(0);
      expect(spans?.horizontal?.maxBoundary.coordinate).toBe(3000);
      expect(spans?.horizontal?.minBoundary.wallIds).toContain("w6");
      expect(spans?.horizontal?.maxBoundary.wallIds).toContain("w7");

      expect(spans?.vertical).toBeDefined();
      expect(spans?.vertical?.spanMm).toBe(5000);
      expect(spans?.vertical?.minBoundary.coordinate).toBe(0);
      expect(spans?.vertical?.maxBoundary.coordinate).toBe(5000);
      expect(spans?.vertical?.minBoundary.wallIds).toContain("w1");
      expect(spans?.vertical?.maxBoundary.wallIds).toContain("w5");
    });

    it("calculates spans for master bedroom in valid standard plan", () => {
      const spans = getRoomSpans(VALID_STANDARD_FLOOR_PLAN, "r2");
      expect(spans).not.toBeNull();
      // r2: (3000, 0) to (6000, 5000)
      expect(spans?.horizontal?.spanMm).toBe(3000);
      expect(spans?.horizontal?.minBoundary.coordinate).toBe(3000);
      expect(spans?.horizontal?.maxBoundary.coordinate).toBe(6000);
      expect(spans?.vertical?.spanMm).toBe(5000);
    });

    it("calculates spans for rooms with collinear boundary walls (3BR)", () => {
      const spans = getRoomSpans(THREE_BED_STANDARD_FLOOR_PLAN, "tr1");
      expect(spans).not.toBeNull();
      // tr1: (0,0) to (4500, 7000)
      expect(spans?.horizontal?.spanMm).toBe(4500);
      expect(spans?.vertical?.spanMm).toBe(7000);
      expect(spans?.horizontal?.maxBoundary.wallIds).toContain("tw8");
      expect(spans?.horizontal?.maxBoundary.wallIds).toContain("tw9");
    });

    it("returns null for non-existent room", () => {
      const spans = getRoomSpans(VALID_STANDARD_FLOOR_PLAN, "non-existent-room");
      expect(spans).toBeNull();
    });
  });

  describe("adjustRoomSpan - AC-6: Valid numeric adjustments", () => {
    it("expands horizontal span keeping opposite min-boundary fixed, translating max-boundary along normal", () => {
      // r1 original: x from 0 to 3000, width = 3000 mm. Area = 3000 * 5000 = 15 m²
      const result = adjustRoomSpan({
        plan: VALID_STANDARD_FLOOR_PLAN,
        roomId: "r1",
        axis: "horizontal",
        boundarySide: "max", // moving w7 (x=3000) to target span 3800 mm
        targetSpanMm: 3800,
      });

      expect(result.success).toBe(true);
      if (!result.success) return;

      const newPlan = result.plan;
      const vMap = getVertexMap(newPlan);
      const wMap = getWallMap(newPlan);

      // Opposite boundary (w6 at x=0) MUST remain fixed!
      const v1 = vMap.get("v1")!;
      const v6 = vMap.get("v6")!;
      expect(v1.x).toBe(0);
      expect(v1.y).toBe(0);
      expect(v6.x).toBe(0);
      expect(v6.y).toBe(5000);

      // Selected boundary (w7 at x=3000) translated along normal (+X) by +800mm to x=3800
      const v2 = vMap.get("v2")!;
      const v5 = vMap.get("v5")!;
      expect(v2.x).toBe(3800);
      expect(v2.y).toBe(0);
      expect(v5.x).toBe(3800);
      expect(v5.y).toBe(5000);

      // Connected orthogonal walls in r1 (w1 and w5) stretched horizontally from 3000 to 3800 mm
      const w1 = wMap.get("w1")!;
      const w5 = wMap.get("w5")!;
      expect(w1.lockAxis).toBe("horizontal");
      expect(vMap.get(w1.to)!.x - vMap.get(w1.from)!.x).toBe(3800);
      expect(vMap.get(w5.from)!.x - vMap.get(w5.to)!.x).toBe(3800);

      // Connected orthogonal walls in adjacent r2 (w2 and w4) shrank horizontally from 3000 to 2200 mm
      const v3 = vMap.get("v3")!;
      const v4 = vMap.get("v4")!;
      expect(v3.x).toBe(6000);
      expect(v4.x).toBe(6000);
      expect(v3.x - v2.x).toBe(2200);
      expect(v4.x - v5.x).toBe(2200);

      // Verify room area is updated after confirmation
      const room1 = newPlan.rooms.find((r) => r.id === "r1")!;
      const poly1 = computeRoomPolygon(room1, wMap, vMap);
      const area1 = computePolygonArea(poly1);
      expect(area1.areaMm2).toBe(3800 * 5000); // 19,000,000 mm² = 19.0 m²
      expect(result.newAreaMm2).toBe(3800 * 5000);
      expect(result.newSpanMm).toBe(3800);
      expect(result.deltaMm).toBe(800);

      // Adjacent room r2 area also reflects change
      const room2 = newPlan.rooms.find((r) => r.id === "r2")!;
      const poly2 = computeRoomPolygon(room2, wMap, vMap);
      const area2 = computePolygonArea(poly2);
      expect(area2.areaMm2).toBe(2200 * 5000); // 11,000,000 mm² = 11.0 m²
    });

    it("contracts vertical span keeping opposite max-boundary fixed, translating min-boundary along normal", () => {
      // In STUDIO_STANDARD_FLOOR_PLAN, sr1 has top wall sw1 (y=0) and bottom wall sw7 (y=4000).
      // sw1's vertices sv1(0,0) and sv2(4000,0) connect orthogonally to vertical walls sw6 and sw2.
      // Move min boundary (sw1 at y=0) so height becomes 3200 mm, keeping sw7 at y=4000 fixed.
      const result = adjustRoomSpan({
        plan: STUDIO_STANDARD_FLOOR_PLAN,
        roomId: "sr1",
        axis: "vertical",
        boundarySide: "min",
        targetSpanMm: 3200,
      });

      expect(result.success).toBe(true);
      if (!result.success) return;

      const newPlan = result.plan;
      const vMap = getVertexMap(newPlan);
      const wMap = getWallMap(newPlan);

      // Opposite boundary (sw7 at y=4000) MUST remain fixed!
      expect(vMap.get("sv6")!.y).toBe(4000);
      expect(vMap.get("sv3")!.y).toBe(4000);

      // Selected boundary (sw1, originally y=0) translated along normal (+Y) by +800 to y=800
      expect(vMap.get("sv1")!.y).toBe(800);
      expect(vMap.get("sv2")!.y).toBe(800);

      // Connected orthogonal vertical walls (sw6 and sw2) shrank to 3200 mm
      expect(vMap.get("sv6")!.y - vMap.get("sv1")!.y).toBe(3200);
      expect(vMap.get("sv3")!.y - vMap.get("sv2")!.y).toBe(3200);

      // Preserves wall orthogonality (dx=0 for vertical walls, dy=0 for horizontal walls)
      expect(vMap.get("sv1")!.x).toBe(vMap.get("sv6")!.x);
      expect(vMap.get("sv2")!.x).toBe(vMap.get("sv3")!.x);
      expect(vMap.get("sv1")!.y).toBe(vMap.get("sv2")!.y);

      // Room area updated: 4000 * 3200 = 12,800,000 mm²
      expect(result.newAreaMm2).toBe(4000 * 3200);
      expect(result.newSpanMm).toBe(3200);
      expect(result.deltaMm).toBe(-800);
    });

    it("rejects vertical boundary adjustment when connected wall would become non-orthogonal (AC-7)", () => {
      // In VALID_STANDARD_FLOOR_PLAN, w1 at y=0 shares v2 with horizontal wall w2.
      // Moving only w1 vertically would tilt w2 into a diagonal wall, which must be safely rejected.
      const originalClone = JSON.parse(JSON.stringify(VALID_STANDARD_FLOOR_PLAN));
      const result = adjustRoomSpan({
        plan: VALID_STANDARD_FLOOR_PLAN,
        roomId: "r1",
        axis: "vertical",
        boundarySide: "min",
        targetSpanMm: 4200,
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toMatch(/non-orthogonal/i);
      }

      expect(VALID_STANDARD_FLOOR_PLAN).toEqual(originalClone);
    });

    it("allows adjusting by specifying wallId directly", () => {
      const result = adjustRoomSpan({
        plan: VALID_STANDARD_FLOOR_PLAN,
        roomId: "r1",
        wallId: "w7", // w7 is the max-boundary on horizontal axis
        targetSpanMm: 3400,
      });

      expect(result.success).toBe(true);
      if (!result.success) return;

      expect(result.newSpanMm).toBe(3400);
      const vMap = getVertexMap(result.plan);
      expect(vMap.get("v2")!.x).toBe(3400);
      expect(vMap.get("v5")!.x).toBe(3400);
    });

    it("maintains attached openings along translated and resized walls", () => {
      const result = adjustRoomSpan({
        plan: VALID_STANDARD_FLOOR_PLAN,
        roomId: "r1",
        axis: "horizontal",
        boundarySide: "max",
        targetSpanMm: 3600,
      });

      expect(result.success).toBe(true);
      if (!result.success) return;

      // win1 is attached to w1 (stretched orthogonal wall)
      const win1 = result.plan.openings.find((o) => o.id === "win1")!;
      expect(win1).toBeDefined();
      expect(win1.wallId).toBe("w1");
      expect(win1.position).toBe(0.5);

      // door2 is attached to w7 (translated boundary wall)
      const door2 = result.plan.openings.find((o) => o.id === "door2")!;
      expect(door2).toBeDefined();
      expect(door2.wallId).toBe("w7");
      expect(door2.position).toBe(0.5);
    });
  });

  describe("previewRoomSpanAdjustment", () => {
    it("previews a valid change without mutating original plan", () => {
      const originalClone = JSON.parse(JSON.stringify(VALID_STANDARD_FLOOR_PLAN));
      const preview = previewRoomSpanAdjustment({
        plan: VALID_STANDARD_FLOOR_PLAN,
        roomId: "r1",
        axis: "horizontal",
        boundarySide: "max",
        targetSpanMm: 3500,
      });

      expect(preview.success).toBe(true);
      if (preview.success) {
        expect(preview.newSpanMm).toBe(3500);
        expect(preview.newAreaMm2).toBe(3500 * 5000);
        expect(preview.deltaMm).toBe(500);
      }

      // Guarantee non-mutation of input plan
      expect(VALID_STANDARD_FLOOR_PLAN).toEqual(originalClone);
    });
  });

  describe("adjustRoomSpan - AC-7: Safety & Validation (Rejection & Non-mutation)", () => {
    it("rejects non-positive span (<= 0) with clear reason and does not mutate plan", () => {
      const originalClone = JSON.parse(JSON.stringify(VALID_STANDARD_FLOOR_PLAN));

      const resZero = adjustRoomSpan({
        plan: VALID_STANDARD_FLOOR_PLAN,
        roomId: "r1",
        axis: "horizontal",
        boundarySide: "max",
        targetSpanMm: 0,
      });

      expect(resZero.success).toBe(false);
      if (!resZero.success) {
        expect(resZero.error).toMatch(/must be greater than 0/i);
      }

      const resNeg = adjustRoomSpan({
        plan: VALID_STANDARD_FLOOR_PLAN,
        roomId: "r1",
        axis: "horizontal",
        boundarySide: "max",
        targetSpanMm: -500,
      });

      expect(resNeg.success).toBe(false);
      if (!resNeg.success) {
        expect(resNeg.error).toMatch(/must be greater than 0/i);
      }

      // Non-mutation guarantee
      expect(VALID_STANDARD_FLOOR_PLAN).toEqual(originalClone);
    });

    it("rejects spans below MIN_ROOM_SPAN_MM with clear reason", () => {
      const originalClone = JSON.parse(JSON.stringify(VALID_STANDARD_FLOOR_PLAN));

      const result = adjustRoomSpan({
        plan: VALID_STANDARD_FLOOR_PLAN,
        roomId: "r1",
        axis: "horizontal",
        boundarySide: "max",
        targetSpanMm: 400, // < 600 mm
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain(`at least ${MIN_ROOM_SPAN_MM} mm`);
      }

      expect(VALID_STANDARD_FLOOR_PLAN).toEqual(originalClone);
    });

    it("rejects spans exceeding MAX_ROOM_SPAN_MM with clear reason", () => {
      const originalClone = JSON.parse(JSON.stringify(VALID_STANDARD_FLOOR_PLAN));

      const result = adjustRoomSpan({
        plan: VALID_STANDARD_FLOOR_PLAN,
        roomId: "r1",
        axis: "horizontal",
        boundarySide: "max",
        targetSpanMm: 60000,
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain(`cannot exceed ${MAX_ROOM_SPAN_MM} mm`);
      }

      expect(VALID_STANDARD_FLOOR_PLAN).toEqual(originalClone);
    });

    it("rejects dimension change that would invert connected wall or adjacent room", () => {
      const originalClone = JSON.parse(JSON.stringify(VALID_STANDARD_FLOOR_PLAN));

      // r1 width is 3000, adjacent r2 ends at x=6000.
      // Trying to expand r1 to 6500 would push w7 past v3/v4 at 6000, inverting w2 and r2!
      const result = adjustRoomSpan({
        plan: VALID_STANDARD_FLOOR_PLAN,
        roomId: "r1",
        axis: "horizontal",
        boundarySide: "max",
        targetSpanMm: 6500,
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toMatch(/invert|minimum length/i);
      }

      // Non-mutation guarantee
      expect(VALID_STANDARD_FLOOR_PLAN).toEqual(originalClone);
    });

    it("rejects dimension change when connected wall would become too short for its opening", () => {
      const originalClone = JSON.parse(JSON.stringify(VALID_STANDARD_FLOOR_PLAN));

      // win2 on w2 has width 1500 mm.
      // If we expand r1 to 5200 mm, w2 shrinks to 6000 - 5200 = 800 mm < 1500 mm opening width!
      const result = adjustRoomSpan({
        plan: VALID_STANDARD_FLOOR_PLAN,
        roomId: "r1",
        axis: "horizontal",
        boundarySide: "max",
        targetSpanMm: 5200,
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toMatch(/too short for opening|opening/i);
      }

      expect(VALID_STANDARD_FLOOR_PLAN).toEqual(originalClone);
    });

    it("rejects adjustment for ambiguous or non-existent room", () => {
      const result = adjustRoomSpan({
        plan: VALID_STANDARD_FLOOR_PLAN,
        roomId: "room-unknown",
        axis: "horizontal",
        boundarySide: "max",
        targetSpanMm: 3500,
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toMatch(/not found/i);
      }
    });
  });
});
