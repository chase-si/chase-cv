import type { PlanSourcePackageMetadata } from "../types";

export const VALID_PLAN_SOURCE_PACKAGE: PlanSourcePackageMetadata = {
  version: 1,
  unit: "mm",
  imageId: "pkg-img-001",
  imageUri: "https://assets.example.com/floorplans/sample-2br.png",
  imageHash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
  imageWidthPx: 2000,
  imageHeightPx: 1500,
  sourceType: "cubicasa",
  calibration: {
    realLengthMm: 6000,
    selectedPixelLength: 1200,
    mmPerPixel: 5.0,
    scaled: true,
  },
  inference: {
    engine: "cubicasa-v2",
    modelVersion: "2026.09.1",
    inferenceMs: 1420,
  },
  meta: {
    name: "2BR-Modern-Source-Package",
    source: "cubicasa",
    createdAt: "2026-09-17T09:00:00.000Z",
    updatedAt: "2026-09-17T09:05:00.000Z",
  },
};
