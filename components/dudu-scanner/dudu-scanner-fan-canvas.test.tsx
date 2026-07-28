import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { DuduScannerFanCanvas } from "@/components/dudu-scanner/dudu-scanner-fan-canvas";
import {
  computeFanGeometry,
  placeTargetInSafeRegion,
} from "@/lib/dudu-scanner/scanner-visual/geometry";

const stageRect = {
  left: 0,
  top: 0,
  right: 400,
  bottom: 300,
  width: 400,
  height: 300,
  x: 0,
  y: 0,
  toJSON: () => ({}),
} as DOMRect;

describe("DuduScannerFanCanvas", () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("requests the Enter-equivalent lock when a revealed strong signal is double-clicked", () => {
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue(stageRect);
    const onLockRequest = vi.fn();
    const placementSeed = 11;
    const target = placeTargetInSafeRegion(
      placementSeed,
      computeFanGeometry(stageRect.width, stageRect.height),
      28,
    );

    render(
      <DuduScannerFanCanvas
        targetRevealed
        revealProgress={1}
        explorationEnabled
        placementSeed={placementSeed}
        onLockRequest={onLockRequest}
      />,
    );

    fireEvent.doubleClick(screen.getByTestId("dudu-scanner-fan-stage"), {
      clientX: target.x,
      clientY: target.y,
    });

    expect(onLockRequest).toHaveBeenCalledTimes(1);
  });

  it("aligns the lock frame with the renderer target position while locking", async () => {
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue(stageRect);
    const placementSeed = 11;
    const target = placeTargetInSafeRegion(
      placementSeed,
      computeFanGeometry(stageRect.width, stageRect.height),
      28,
    );

    render(
      <DuduScannerFanCanvas
        showLockFrame
        locking
        targetRevealed
        revealProgress={1}
        placementSeed={placementSeed}
      />,
    );

    await waitFor(() => {
      const frame = screen.getByTestId("dudu-scanner-lock-frame");
      expect(frame).toHaveStyle({
        left: `${target.x}px`,
        top: `${target.y}px`,
      });
    });
  });
});
