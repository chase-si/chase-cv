import { describe, expect, it } from "vitest";
import type { FloorPlan } from "../types";
import {
  computeFixCounts,
  createEvaluationRecord,
  exportEvaluationRecordJson,
} from "./evaluation-metrics";

const BASE_PLAN: FloorPlan = {
  version: 1,
  unit: "mm",
  meta: {
    name: "Base Plan",
    source: "cubicasa",
    createdAt: "2026-09-18T00:00:00.000Z",
    updatedAt: "2026-09-18T00:00:00.000Z",
  },
  vertices: [
    { id: "v-1", x: 0, y: 0 },
    { id: "v-2", x: 1000, y: 0 },
    { id: "v-3", x: 1000, y: 1000 },
    { id: "v-4", x: 0, y: 1000 },
  ],
  walls: [
    { id: "w-1", from: "v-1", to: "v-2", thickness: 200, lockAxis: "horizontal" },
    { id: "w-2", from: "v-2", to: "v-3", thickness: 200, lockAxis: "vertical" },
    { id: "w-3", from: "v-3", to: "v-4", thickness: 200, lockAxis: "horizontal" },
    { id: "w-4", from: "v-4", to: "v-1", thickness: 200, lockAxis: "vertical" },
  ],
  openings: [
    { id: "op-1", type: "door", wallId: "w-1", position: 0.5, width: 900 },
  ],
  rooms: [
    { id: "r-1", type: "living_room", boundaryWallIds: ["w-1", "w-2", "w-3", "w-4"] },
  ],
  furniture: [],
};

describe("Evaluation Metrics & Benchmarking (AC-23)", () => {
  it("creates an evaluation record conforming to AC-23 contract", () => {
    const record = createEvaluationRecord({
      imageId: "img-001",
      imageHash: "hash-999",
      engine: "cubicasa5k-mps",
      modelVersion: "v1.2.0",
      inferenceMs: 120,
      scaled: true,
      wallFixCount: 2,
      openingFixCount: 1,
      roomFixCount: 0,
      manualCorrectionSec: 45,
      approvalStatus: "approved",
      finalPlanId: "plan-final-001",
      notes: "Clean segmentation, minor door adjustment",
    });

    expect(record.imageId).toBe("img-001");
    expect(record.imageHash).toBe("hash-999");
    expect(record.engine).toBe("cubicasa5k-mps");
    expect(record.modelVersion).toBe("v1.2.0");
    expect(record.inferenceMs).toBe(120);
    expect(record.scaled).toBe(true);
    expect(record.wallFixCount).toBe(2);
    expect(record.openingFixCount).toBe(1);
    expect(record.roomFixCount).toBe(0);
    expect(record.manualCorrectionSec).toBe(45);
    expect(record.approvalStatus).toBe("approved");
    expect(record.finalPlanId).toBe("plan-final-001");
    expect(record.createdAt).toBeDefined();
  });

  it("computes fix counts between initial recognized plan and corrected plan", () => {
    const correctedPlan: FloorPlan = {
      ...BASE_PLAN,
      walls: [
        // w-1 modified thickness
        { id: "w-1", from: "v-1", to: "v-2", thickness: 240, lockAxis: "horizontal" },
        { id: "w-2", from: "v-2", to: "v-3", thickness: 200, lockAxis: "vertical" },
        { id: "w-3", from: "v-3", to: "v-4", thickness: 200, lockAxis: "horizontal" },
        // w-4 deleted, w-5 added
        { id: "w-5", from: "v-4", to: "v-1", thickness: 150, lockAxis: "vertical" },
      ],
      openings: [
        // op-1 modified position
        { id: "op-1", type: "door", wallId: "w-1", position: 0.8, width: 900 },
        // op-2 added
        { id: "op-2", type: "window", wallId: "w-3", position: 0.5, width: 1200 },
      ],
      rooms: [
        // r-1 modified room type to bedroom
        { id: "r-1", type: "bedroom", boundaryWallIds: ["w-1", "w-2", "w-3", "w-5"] },
      ],
    };

    const counts = computeFixCounts(BASE_PLAN, correctedPlan);
    // Walls: w-1 modified (+1), w-4 deleted (+1), w-5 added (+1) = 3
    expect(counts.wallFixCount).toBe(3);
    // Openings: op-1 modified (+1), op-2 added (+1) = 2
    expect(counts.openingFixCount).toBe(2);
    // Rooms: r-1 modified (+1) = 1
    expect(counts.roomFixCount).toBe(1);
  });

  it("exports evaluation record to formatted JSON string", () => {
    const record = createEvaluationRecord({
      imageId: "img-test",
      imageHash: "hash-test",
      engine: "mock",
      modelVersion: "v1.0",
      inferenceMs: 100,
      scaled: false,
      wallFixCount: 0,
      openingFixCount: 0,
      roomFixCount: 0,
      manualCorrectionSec: 10,
      approvalStatus: "draft",
      finalPlanId: "plan-test",
    });

    const json = exportEvaluationRecordJson(record);
    const parsed = JSON.parse(json);
    expect(parsed.imageId).toBe("img-test");
    expect(parsed.imageHash).toBe("hash-test");
    expect(parsed.scaled).toBe(false);
  });
});
