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
});
