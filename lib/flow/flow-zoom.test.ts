import { describe, expect, it } from "vitest";

import {
  FLOW_ZOOM_DEFAULT,
  FLOW_ZOOM_MAX,
  FLOW_ZOOM_MIN,
  FLOW_ZOOM_STEP,
  adjustFlowZoom,
  formatFlowZoomPercent,
} from "@/lib/flow/flow-zoom";

describe("flow zoom", () => {
  it("clamps zoom between 0.5 and 2.0 in 0.1 steps", () => {
    expect(adjustFlowZoom(1, "in")).toEqual({ zoom: 1.1, clamped: false });
    expect(adjustFlowZoom(1, "out")).toEqual({ zoom: 0.9, clamped: false });
    expect(adjustFlowZoom(1, "reset")).toEqual({
      zoom: FLOW_ZOOM_DEFAULT,
      clamped: false,
    });
  });

  it("reports clamped when zoom in at max", () => {
    expect(adjustFlowZoom(FLOW_ZOOM_MAX, "in")).toEqual({
      zoom: FLOW_ZOOM_MAX,
      clamped: true,
    });
  });

  it("reports clamped when zoom out at min", () => {
    expect(adjustFlowZoom(FLOW_ZOOM_MIN, "out")).toEqual({
      zoom: FLOW_ZOOM_MIN,
      clamped: true,
    });
  });

  it("formats zoom as a whole-number percentage", () => {
    expect(formatFlowZoomPercent(1)).toBe("100%");
    expect(formatFlowZoomPercent(0.5)).toBe("50%");
    expect(formatFlowZoomPercent(1.1)).toBe("110%");
  });

  it("exports canonical zoom constants", () => {
    expect(FLOW_ZOOM_STEP).toBe(0.1);
    expect(FLOW_ZOOM_MIN).toBe(0.5);
    expect(FLOW_ZOOM_MAX).toBe(2);
  });
});
