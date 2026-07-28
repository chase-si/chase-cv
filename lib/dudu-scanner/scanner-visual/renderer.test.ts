import { afterEach, describe, expect, it, vi } from "vitest";

import { createScannerVisualRenderer } from "@/lib/dudu-scanner/scanner-visual/renderer";

function createTestCanvas() {
  const canvas = document.createElement("canvas");
  const stage = document.createElement("div");
  stage.style.width = "400px";
  stage.style.height = "300px";
  stage.appendChild(canvas);
  document.body.appendChild(stage);
  return { canvas, stage };
}

describe("scanner visual renderer lifecycle", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("starts and cleans up animation frames on destroy", () => {
    const { canvas, stage } = createTestCanvas();
    const requestFrame = vi.fn<(callback: FrameRequestCallback) => number>().mockReturnValue(1);
    const cancelFrame = vi.fn();
    const renderer = createScannerVisualRenderer({
      canvas,
      getStageRect: () => stage.getBoundingClientRect(),
      requestFrame,
      cancelFrame,
      getNow: () => 0,
    });

    renderer.start();
    expect(requestFrame).toHaveBeenCalled();
    renderer.destroy();
    expect(cancelFrame).toHaveBeenCalledWith(1);
  });

  it("pauses and resumes the animation lifecycle with page visibility", () => {
    const { canvas, stage } = createTestCanvas();
    const requestFrame = vi.fn<(callback: FrameRequestCallback) => number>().mockReturnValue(7);
    const cancelFrame = vi.fn();
    const renderer = createScannerVisualRenderer({
      canvas,
      getStageRect: () => stage.getBoundingClientRect(),
      requestFrame,
      cancelFrame,
      getNow: () => 0,
    });
    renderer.start();
    renderer.setPageVisible(false);
    expect(cancelFrame).toHaveBeenCalledWith(7);

    requestFrame.mockClear();
    renderer.setPageVisible(true);
    expect(requestFrame).toHaveBeenCalledTimes(1);
    renderer.destroy();
  });

  it("keeps target motion independent from pointer updates", () => {
    const { canvas, stage } = createTestCanvas();
    const renderer = createScannerVisualRenderer({
      canvas,
      getStageRect: () => stage.getBoundingClientRect(),
      requestFrame: () => 0,
      cancelFrame: () => {},
      getNow: () => 0,
    });
    renderer.setState({ targetRevealed: true, placementSeed: 11 });
    renderer.resize(true);
    const before = renderer.getTargetPosition();
    renderer.updateInput(10, 10, 0);
    renderer.updateInput(390, 290, 16);
    const after = renderer.getTargetPosition();
    expect(before).toEqual(after);
    renderer.destroy();
  });

  it("keeps the hidden target fixed until reveal begins", () => {
    const { canvas } = createTestCanvas();
    const rect = {
      left: 0,
      top: 0,
      right: 400,
      bottom: 300,
      width: 400,
      height: 300,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    };
    let now = 0;
    let nextFrame: FrameRequestCallback | null = null;
    const renderer = createScannerVisualRenderer({
      canvas,
      getStageRect: () => rect,
      requestFrame: (callback) => {
        nextFrame = callback;
        return 1;
      },
      cancelFrame: () => {},
      getNow: () => now,
    });
    renderer.setState({ placementSeed: 23, explorationEnabled: true });
    renderer.start();
    const before = renderer.getTargetPosition();

    now = 5_000;
    nextFrame!(now);

    expect(renderer.getTargetPosition()).toEqual(before);
    renderer.destroy();
  });

  it("exposes probe metrics without moving the fan mask", () => {
    const { canvas, stage } = createTestCanvas();
    const renderer = createScannerVisualRenderer({
      canvas,
      getStageRect: () => stage.getBoundingClientRect(),
      requestFrame: () => 0,
      cancelFrame: () => {},
    });
    renderer.updateInput(360, 40, 0);
    const metrics = renderer.getMetrics();
    expect(metrics.signalStrength).toBeGreaterThan(0);
    expect(metrics.scanFrequencyHz).toBeGreaterThan(0.9);
    renderer.destroy();
  });

  it("reports proximity to the fixed hidden target and freezes when the probe exits", () => {
    const { canvas } = createTestCanvas();
    const rect = {
      left: 0,
      top: 0,
      right: 400,
      bottom: 300,
      width: 400,
      height: 300,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    };
    const renderer = createScannerVisualRenderer({
      canvas,
      getStageRect: () => rect,
      requestFrame: () => 0,
      cancelFrame: () => {},
      getNow: () => 10_000,
    });
    renderer.resize(true);
    renderer.setState({ placementSeed: 11, explorationEnabled: true });
    const target = renderer.getTargetPosition();
    expect(target).not.toBeNull();

    renderer.updateInput(target!.x, target!.y, 10_000);
    expect(renderer.getMetrics()).toMatchObject({
      signalStrength: 1,
      signalBand: "strong",
      probeInside: true,
      spotlightVisible: true,
      spotlightRadius: 100,
    });

    renderer.updateInput(400, 300, 10_016);
    expect(renderer.getMetrics()).toMatchObject({
      signalStrength: 1,
      probeInside: false,
      probeHasEntered: true,
    });
    renderer.destroy();
  });

  it("preserves dwell while outside and resumes it after probe re-entry", () => {
    const { canvas } = createTestCanvas();
    const rect = {
      left: 0,
      top: 0,
      right: 400,
      bottom: 300,
      width: 400,
      height: 300,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    };
    let now = 0;
    let nextFrame: FrameRequestCallback | null = null;
    const renderer = createScannerVisualRenderer({
      canvas,
      getStageRect: () => rect,
      requestFrame: (callback) => {
        nextFrame = callback;
        return 1;
      },
      cancelFrame: () => {},
      getNow: () => now,
    });
    renderer.setState({ placementSeed: 11, explorationEnabled: true });
    renderer.start();
    const target = renderer.getTargetPosition()!;
    renderer.updateInput(target.x, target.y, now);

    now = 9_999;
    expect(renderer.getMetrics().roundElapsedMs).toBe(9_999);
    nextFrame!(now);
    now = 10_400;
    nextFrame!(now);
    const dwellBeforeExit = renderer.getMetrics().dwellProgress;
    expect(dwellBeforeExit).toBeGreaterThan(0);

    renderer.updateInput(rect.right, rect.bottom, now);
    now = 10_600;
    nextFrame!(now);
    expect(renderer.getMetrics().dwellProgress).toBe(dwellBeforeExit);

    renderer.updateInput(target.x, target.y, now);
    now = 11_000;
    nextFrame!(now);
    expect(renderer.getMetrics()).toMatchObject({
      probeInside: true,
      signalStrength: 1,
      dwellProgress: 1,
    });
    renderer.destroy();
  });

  it("supports the smaller mobile spotlight radius", () => {
    const { canvas, stage } = createTestCanvas();
    const renderer = createScannerVisualRenderer({
      canvas,
      getStageRect: () => stage.getBoundingClientRect(),
      requestFrame: () => 0,
      cancelFrame: () => {},
      spotlightRadius: 70,
    });

    expect(renderer.getMetrics().spotlightRadius).toBe(70);
    renderer.destroy();
  });

  it("discovers only after the elapsed-time gate and close-probe dwell", () => {
    const { canvas } = createTestCanvas();
    const rect = {
      left: 0,
      top: 0,
      right: 400,
      bottom: 300,
      width: 400,
      height: 300,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    };
    let now = 0;
    let nextFrame: FrameRequestCallback | null = null;
    const onDiscovery = vi.fn();
    const renderer = createScannerVisualRenderer({
      canvas,
      getStageRect: () => rect,
      requestFrame: (callback) => {
        nextFrame = callback;
        return 1;
      },
      cancelFrame: () => {},
      getNow: () => now,
      onDiscovery,
    });
    renderer.setState({ placementSeed: 11, explorationEnabled: true });
    renderer.start();
    const target = renderer.getTargetPosition()!;
    renderer.updateInput(target.x, target.y, 0);
    expect(onDiscovery).not.toHaveBeenCalled();

    now = 9_999;
    expect(renderer.getMetrics().roundElapsedMs).toBe(9_999);
    nextFrame!(now);
    expect(onDiscovery).not.toHaveBeenCalled();

    now = 10_400;
    nextFrame!(now);
    expect(onDiscovery).not.toHaveBeenCalled();

    now = 10_800;
    nextFrame!(now);
    expect(onDiscovery).toHaveBeenCalledTimes(1);
    expect(renderer.getMetrics().dwellProgress).toBe(1);
    renderer.destroy();
  });
});
