/**
 * Evaluation Metrics & Production Benchmarking (AC-23)
 *
 * Records and exports evaluation benchmarks for CubiCasa recognition runs:
 * image hash, engine/model version, inference time, scale status, fix counts,
 * manual-correction time, and approval status.
 */

import type { FloorPlan, Opening, Room, Wall } from "../types";
import type { EvaluationRecord } from "./types";

export type CreateEvaluationRecordParams = Omit<EvaluationRecord, "createdAt"> & {
  createdAt?: string;
};

export function createEvaluationRecord(params: CreateEvaluationRecordParams): EvaluationRecord {
  return {
    imageId: params.imageId,
    imageHash: params.imageHash,
    engine: params.engine,
    modelVersion: params.modelVersion,
    inferenceMs: params.inferenceMs,
    scaled: params.scaled,
    wallFixCount: params.wallFixCount,
    openingFixCount: params.openingFixCount,
    roomFixCount: params.roomFixCount,
    manualCorrectionSec: params.manualCorrectionSec,
    approvalStatus: params.approvalStatus,
    finalPlanId: params.finalPlanId,
    createdAt: params.createdAt ?? new Date().toISOString(),
    notes: params.notes,
  };
}

function areWallsEqual(w1: Wall, w2: Wall): boolean {
  return (
    w1.from === w2.from &&
    w1.to === w2.to &&
    w1.thickness === w2.thickness &&
    w1.lockAxis === w2.lockAxis
  );
}

function areOpeningsEqual(o1: Opening, o2: Opening): boolean {
  return (
    o1.type === o2.type &&
    o1.wallId === o2.wallId &&
    Math.abs(o1.position - o2.position) < 0.01 &&
    o1.width === o2.width &&
    o1.height === o2.height
  );
}

function areRoomsEqual(r1: Room, r2: Room): boolean {
  if (r1.type !== r2.type || r1.name !== r2.name) return false;
  if (r1.boundaryWallIds.length !== r2.boundaryWallIds.length) return false;
  return r1.boundaryWallIds.every((id, idx) => id === r2.boundaryWallIds[idx]);
}

/**
 * Calculates manual correction fix counts by comparing the initial recognized plan
 * against the final/current plan.
 */
export function computeFixCounts(
  initialPlan: FloorPlan,
  currentPlan: FloorPlan,
): { wallFixCount: number; openingFixCount: number; roomFixCount: number } {
  let wallFixCount = 0;
  let openingFixCount = 0;
  let roomFixCount = 0;

  // 1. Walls
  const initWallMap = new Map(initialPlan.walls.map((w) => [w.id, w]));
  const currWallMap = new Map(currentPlan.walls.map((w) => [w.id, w]));

  for (const [id, initWall] of initWallMap) {
    const currWall = currWallMap.get(id);
    if (!currWall) {
      wallFixCount++; // Wall removed
    } else if (!areWallsEqual(initWall, currWall)) {
      wallFixCount++; // Wall modified
    }
  }
  for (const id of currWallMap.keys()) {
    if (!initWallMap.has(id)) {
      wallFixCount++; // Wall added
    }
  }

  // 2. Openings
  const initOpMap = new Map(initialPlan.openings.map((o) => [o.id, o]));
  const currOpMap = new Map(currentPlan.openings.map((o) => [o.id, o]));

  for (const [id, initOp] of initOpMap) {
    const currOp = currOpMap.get(id);
    if (!currOp) {
      openingFixCount++; // Opening removed
    } else if (!areOpeningsEqual(initOp, currOp)) {
      openingFixCount++; // Opening modified
    }
  }
  for (const id of currOpMap.keys()) {
    if (!initOpMap.has(id)) {
      openingFixCount++; // Opening added
    }
  }

  // 3. Rooms
  const initRoomMap = new Map(initialPlan.rooms.map((r) => [r.id, r]));
  const currRoomMap = new Map(currentPlan.rooms.map((r) => [r.id, r]));

  for (const [id, initRoom] of initRoomMap) {
    const currRoom = currRoomMap.get(id);
    if (!currRoom) {
      roomFixCount++; // Room removed
    } else if (!areRoomsEqual(initRoom, currRoom)) {
      roomFixCount++; // Room modified
    }
  }
  for (const id of currRoomMap.keys()) {
    if (!initRoomMap.has(id)) {
      roomFixCount++; // Room added
    }
  }

  return { wallFixCount, openingFixCount, roomFixCount };
}

/**
 * Format evaluation record as pretty JSON string.
 */
export function exportEvaluationRecordJson(record: EvaluationRecord): string {
  return JSON.stringify(record, null, 2);
}

/**
 * Trigger browser file download of evaluation record JSON.
 */
export function downloadEvaluationRecordJson(
  record: EvaluationRecord,
  filename?: string,
): void {
  if (typeof window === "undefined" || !window.document) return;

  const jsonString = exportEvaluationRecordJson(record);
  const blob = new Blob([jsonString], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download =
    filename ?? `evaluation-record-${record.imageId}-${record.finalPlanId}.json`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}
