export const FLOW_ZOOM_DEFAULT = 1;
export const FLOW_ZOOM_MIN = 0.5;
export const FLOW_ZOOM_MAX = 2;
export const FLOW_ZOOM_STEP = 0.1;

export type FlowZoomDirection = "in" | "out" | "reset";

export type FlowZoomAdjustment = {
  zoom: number;
  clamped: boolean;
};

function roundZoom(value: number) {
  return Math.round(value * 10) / 10;
}

export function adjustFlowZoom(
  current: number,
  direction: FlowZoomDirection,
): FlowZoomAdjustment {
  if (direction === "reset") {
    return { zoom: FLOW_ZOOM_DEFAULT, clamped: false };
  }

  const delta = direction === "in" ? FLOW_ZOOM_STEP : -FLOW_ZOOM_STEP;
  const raw = roundZoom(current + delta);

  if (direction === "in" && raw > FLOW_ZOOM_MAX) {
    return { zoom: FLOW_ZOOM_MAX, clamped: true };
  }
  if (direction === "out" && raw < FLOW_ZOOM_MIN) {
    return { zoom: FLOW_ZOOM_MIN, clamped: true };
  }

  return { zoom: raw, clamped: false };
}

export function formatFlowZoomPercent(zoom: number) {
  return `${Math.round(zoom * 100)}%`;
}
