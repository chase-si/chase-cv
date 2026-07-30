import { describe, expect, it } from "vitest";

import {
  advanceDiscoveryDwell,
  computeProximitySignal,
  DUDU_SCANNER_DISCOVERY_DWELL_MS,
  DUDU_SCANNER_LOCK_RESULT_DELAY_MS,
  DUDU_SCANNER_MIN_DISCOVERY_ELAPSED_MS,
  isDoubleClickLockEligible,
} from "@/lib/dudu-scanner/scanner-visual/exploration-model";

describe("computeProximitySignal", () => {
  it("maps probe distance to a continuous signal without exposing direction", () => {
    const target = { x: 0, y: 0 };
    const options = { revealRadius: 120, signalRadius: 420 };

    expect(computeProximitySignal({ x: 420, y: 0 }, target, options)).toEqual({
      distance: 420,
      strength: 0,
      band: "weak",
      insideRevealRadius: false,
    });
    expect(computeProximitySignal({ x: 210, y: 0 }, target, options)).toEqual({
      distance: 210,
      strength: 0.5,
      band: "medium",
      insideRevealRadius: false,
    });
    expect(computeProximitySignal({ x: 0, y: 0 }, target, options)).toEqual({
      distance: 0,
      strength: 1,
      band: "strong",
      insideRevealRadius: true,
    });
  });
});

describe("scanner lock timing", () => {
  it("keeps the target-focused lock state visible before showing the result", () => {
    expect(DUDU_SCANNER_LOCK_RESULT_DELAY_MS).toBe(2600);
  });

  it("allows a revealed target to lock by double-click only above 90% signal", () => {
    expect(isDoubleClickLockEligible(false, 1)).toBe(false);
    expect(isDoubleClickLockEligible(true, 0.9)).toBe(false);
    expect(isDoubleClickLockEligible(true, 0.901)).toBe(true);
  });
});

describe("advanceDiscoveryDwell", () => {
  it("requires ten elapsed seconds and 800ms of continuous close scanning", () => {
    const beforeGate = advanceDiscoveryDwell(0, {
      deltaMs: 400,
      roundElapsedMs: DUDU_SCANNER_MIN_DISCOVERY_ELAPSED_MS - 1,
      probeInside: true,
      insideRevealRadius: true,
    });
    expect(beforeGate).toEqual({ dwellMs: 0, progress: 0, discovered: false });

    const halfway = advanceDiscoveryDwell(beforeGate.dwellMs, {
      deltaMs: DUDU_SCANNER_DISCOVERY_DWELL_MS / 2,
      roundElapsedMs: DUDU_SCANNER_MIN_DISCOVERY_ELAPSED_MS,
      probeInside: true,
      insideRevealRadius: true,
    });
    expect(halfway).toEqual({ dwellMs: 400, progress: 0.5, discovered: false });

    expect(
      advanceDiscoveryDwell(halfway.dwellMs, {
        deltaMs: DUDU_SCANNER_DISCOVERY_DWELL_MS / 2,
        roundElapsedMs: DUDU_SCANNER_MIN_DISCOVERY_ELAPSED_MS + 400,
        probeInside: true,
        insideRevealRadius: true,
      }),
    ).toEqual({ dwellMs: 800, progress: 1, discovered: true });
  });

  it("pauses outside the scan region and decays smoothly away from the target", () => {
    const paused = advanceDiscoveryDwell(600, {
      deltaMs: 100,
      roundElapsedMs: DUDU_SCANNER_MIN_DISCOVERY_ELAPSED_MS,
      probeInside: false,
      insideRevealRadius: false,
    });
    expect(paused).toEqual({ dwellMs: 600, progress: 0.75, discovered: false });

    const decayed = advanceDiscoveryDwell(paused.dwellMs, {
      deltaMs: 100,
      roundElapsedMs: DUDU_SCANNER_MIN_DISCOVERY_ELAPSED_MS + 100,
      probeInside: true,
      insideRevealRadius: false,
    });
    expect(decayed).toEqual({ dwellMs: 450, progress: 0.5625, discovered: false });
  });
});
