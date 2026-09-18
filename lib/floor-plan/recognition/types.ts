/**
 * CubiCasa Image-to-FloorPlan Recognition Types (AC-20..AC-24)
 *
 * Types for raw semantic model output, two-point calibration,
 * topology normalization, and evaluation benchmarking.
 */

import type { OpeningType, RoomType } from "../types";

export interface RawPoint {
  x: number;
  y: number;
}

export interface RawCubiCasaWall {
  id: string;
  start: RawPoint;
  end: RawPoint;
  thickness?: number; // pixel thickness if available
}

export interface RawCubiCasaOpening {
  id: string;
  type: OpeningType;
  start?: RawPoint;
  end?: RawPoint;
  center?: RawPoint;
  width?: number; // pixel width if available
  attachedWallId?: string;
}

export interface RawCubiCasaRoom {
  id: string;
  type: RoomType;
  name?: string;
  polygon: RawPoint[];
}

export interface RawCubiCasaSemanticOutput {
  imageId: string;
  imageHash: string;
  imageWidth: number;
  imageHeight: number;
  engine: string;
  modelVersion: string;
  inferenceMs: number;
  walls: RawCubiCasaWall[];
  openings: RawCubiCasaOpening[];
  rooms: RawCubiCasaRoom[];
}

export interface CalibrationParams {
  p1: RawPoint;
  p2: RawPoint;
  realLengthMm: number;
}

export interface CalibrationResult {
  pixelDistance: number;
  realLengthMm: number;
  mmPerPixel: number;
  scaled: boolean;
}

export type ApprovalStatus = "draft" | "approved" | "rejected";

export interface EvaluationRecord {
  imageId: string;
  imageHash: string;
  engine: string;
  modelVersion: string;
  inferenceMs: number;
  scaled: boolean;
  wallFixCount: number;
  openingFixCount: number;
  roomFixCount: number;
  manualCorrectionSec: number;
  approvalStatus: ApprovalStatus;
  finalPlanId: string;
  createdAt: string;
  notes?: string;
}

export interface CubiCasaAdapterPredictionOptions {
  sampleId?: string;
}

export interface CubiCasaAdapter {
  predict(
    input: Blob | File | string,
    options?: CubiCasaAdapterPredictionOptions,
  ): Promise<RawCubiCasaSemanticOutput>;
  getEngineInfo(): { engine: string; modelVersion: string };
  checkHealth(): Promise<boolean>;
}
