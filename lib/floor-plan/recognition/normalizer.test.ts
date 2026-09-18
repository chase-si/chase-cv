import { describe, expect, it } from "vitest";
import { validateFloorPlan } from "../validators";
import { calculateScaleFromTwoPoints, createUnscaledCalibration } from "./calibration";
import { normalizeCubiCasaToFloorPlan } from "./normalizer";
import type { RawCubiCasaSemanticOutput } from "./types";

const MOCK_RAW_OUTPUT: RawCubiCasaSemanticOutput = {
  imageId: "img-001",
  imageHash: "hash-abc-123",
  imageWidth: 800,
  imageHeight: 600,
  engine: "cubicasa5k-mps",
  modelVersion: "v1.2.0",
  inferenceMs: 142,
  walls: [
    // Outer boundary (0,0) -> (400,0) -> (400,300) -> (0,300) -> (0,0)
    { id: "rw-1", start: { x: 0, y: 0 }, end: { x: 400, y: 0 }, thickness: 20 },
    { id: "rw-2", start: { x: 400, y: 0 }, end: { x: 400, y: 300 }, thickness: 20 },
    { id: "rw-3", start: { x: 400, y: 300 }, end: { x: 0, y: 300 }, thickness: 20 },
    { id: "rw-4", start: { x: 0, y: 300 }, end: { x: 0, y: 0 }, thickness: 20 },
    // Interior dividing wall (200, 0) -> (200, 300)
    { id: "rw-5", start: { x: 200, y: 0 }, end: { x: 200, y: 300 }, thickness: 15 },
  ],
  openings: [
    {
      id: "ro-1",
      type: "door",
      center: { x: 200, y: 150 },
      width: 90,
      attachedWallId: "rw-5",
    },
    {
      id: "ro-2",
      type: "window",
      center: { x: 200, y: 0 },
      width: 120,
      attachedWallId: "rw-1",
    },
  ],
  rooms: [
    {
      id: "rr-1",
      type: "living_room",
      name: "Living Room",
      polygon: [
        { x: 0, y: 0 },
        { x: 200, y: 0 },
        { x: 200, y: 300 },
        { x: 0, y: 300 },
      ],
    },
    {
      id: "rr-2",
      type: "bedroom",
      name: "Bedroom",
      polygon: [
        { x: 200, y: 0 },
        { x: 400, y: 0 },
        { x: 400, y: 300 },
        { x: 200, y: 300 },
      ],
    },
  ],
};

describe("CubiCasa Topology Normalizer (AC-21, AC-22)", () => {
  it("normalizes calibrated CubiCasa output to canonical FloorPlan v1 passing validation", () => {
    const calibration = calculateScaleFromTwoPoints(
      { x: 0, y: 0 },
      { x: 400, y: 0 },
      4000, // 4000 mm = 10 mm/px
    );

    const plan = normalizeCubiCasaToFloorPlan(MOCK_RAW_OUTPUT, calibration, {
      name: "Test Normalized Plan",
      planId: "plan-test-01",
    });

    expect(plan.version).toBe(1);
    expect(plan.unit).toBe("mm");
    expect(plan.meta.name).toBe("Test Normalized Plan");
    expect(plan.meta.source).toBe("cubicasa");
    expect(plan.meta.scaled).toBe(true);
    expect(plan.meta.unscaled).toBe(false);
    expect(plan.meta.scaleMmPerPixel).toBe(10);

    // Vertices should be scaled: (400, 300) -> (4000, 3000)
    const maxX = Math.max(...plan.vertices.map((v) => v.x));
    const maxY = Math.max(...plan.vertices.map((v) => v.y));
    expect(maxX).toBe(4000);
    expect(maxY).toBe(3000);

    // Wall thickness should be scaled: 20px -> 200mm
    const w1 = plan.walls.find((w) => w.id === "rw-1");
    expect(w1?.thickness).toBe(200);
    expect(w1?.lockAxis).toBe("horizontal");

    // Openings
    expect(plan.openings).toHaveLength(2);
    const door = plan.openings.find((o) => o.type === "door");
    expect(door).toBeDefined();
    expect(door?.wallId).toBe("rw-5");
    expect(door?.position).toBeCloseTo(0.5, 1);
    expect(door?.width).toBe(900); // 90px * 10 = 900mm

    // Rooms
    expect(plan.rooms).toHaveLength(2);
    expect(plan.rooms[0].boundaryWallIds.length).toBeGreaterThanOrEqual(3);

    // Must pass canonical FloorPlan validator (AC-22)
    const validation = validateFloorPlan(plan);
    expect(validation.ok).toBe(true);
  });

  it("normalizes unscaled output with unscaled: true passing validation (AC-21)", () => {
    const uncalibrated = createUnscaledCalibration();

    const plan = normalizeCubiCasaToFloorPlan(MOCK_RAW_OUTPUT, uncalibrated);

    expect(plan.meta.scaled).toBe(false);
    expect(plan.meta.unscaled).toBe(true);
    expect(plan.meta.source).toBe("cubicasa");

    const validation = validateFloorPlan(plan);
    expect(validation.ok).toBe(true);
  });

  it("snaps close endpoints to unified shared vertices", () => {
    const rawWithSlightJitter: RawCubiCasaSemanticOutput = {
      ...MOCK_RAW_OUTPUT,
      walls: [
        { id: "w-a", start: { x: 0, y: 0 }, end: { x: 100, y: 0.8 }, thickness: 20 },
        { id: "w-b", start: { x: 100.5, y: 0 }, end: { x: 100, y: 100 }, thickness: 20 },
        { id: "w-c", start: { x: 100, y: 100 }, end: { x: 0, y: 100 }, thickness: 20 },
        { id: "w-d", start: { x: 0, y: 100 }, end: { x: 0, y: 0 }, thickness: 20 },
      ],
      openings: [],
      rooms: [
        {
          id: "r-single",
          type: "living_room",
          polygon: [
            { x: 0, y: 0 },
            { x: 100, y: 0 },
            { x: 100, y: 100 },
            { x: 0, y: 100 },
          ],
        },
      ],
    };

    const plan = normalizeCubiCasaToFloorPlan(rawWithSlightJitter, null);
    // Should have 4 distinct vertices after snapping (not 5 or 6)
    expect(plan.vertices.length).toBe(4);
    const validation = validateFloorPlan(plan);
    expect(validation.ok).toBe(true);
  });

  it("attaches unattached opening to nearest wall segment and projects position 0..1", () => {
    const rawWithFloatingOpening: RawCubiCasaSemanticOutput = {
      ...MOCK_RAW_OUTPUT,
      openings: [
        {
          id: "float-door",
          type: "door",
          center: { x: 401, y: 150 }, // close to rw-2 (x=400, y: 0..300)
          width: 90,
          // attachedWallId omitted intentionally
        },
      ],
    };

    const plan = normalizeCubiCasaToFloorPlan(rawWithFloatingOpening, null);
    expect(plan.openings).toHaveLength(1);
    expect(plan.openings[0].wallId).toBe("rw-2");
    expect(plan.openings[0].position).toBeCloseTo(0.5, 1);
  });
});
