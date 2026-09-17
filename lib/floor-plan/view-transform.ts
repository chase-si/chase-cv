import type { PlanBounds, Point } from "./geometry";

export interface ViewTransform {
  scale: number;
  panX: number;
  panY: number;
}

export const DEFAULT_VIEW_TRANSFORM: ViewTransform = {
  scale: 0.1,
  panX: 0,
  panY: 0,
};

export function clampZoom(scale: number, minScale = 0.02, maxScale = 10): number {
  return Math.max(minScale, Math.min(maxScale, scale));
}

/**
 * Calculate the view transform that fits the plan bounds neatly into viewport.
 */
export function calculateFitToView(
  bounds: PlanBounds,
  viewportWidth: number,
  viewportHeight: number,
  paddingRatio = 0.15,
): ViewTransform {
  if (viewportWidth <= 0 || viewportHeight <= 0 || bounds.width <= 0 || bounds.height <= 0) {
    return DEFAULT_VIEW_TRANSFORM;
  }

  const usableWidth = viewportWidth * (1 - paddingRatio * 2);
  const usableHeight = viewportHeight * (1 - paddingRatio * 2);

  const scaleX = usableWidth / bounds.width;
  const scaleY = usableHeight / bounds.height;
  const scale = clampZoom(Math.min(scaleX, scaleY));

  // Center the plan bounds in the viewport
  const panX = viewportWidth / 2 - bounds.centerX * scale;
  const panY = viewportHeight / 2 - bounds.centerY * scale;

  return {
    scale,
    panX,
    panY,
  };
}

/**
 * Zoom by a multiplier around an anchor screen coordinate.
 */
export function zoomByFactor(
  current: ViewTransform,
  factor: number,
  anchorScreen: Point,
  minScale = 0.02,
  maxScale = 10,
): ViewTransform {
  const newScale = clampZoom(current.scale * factor, minScale, maxScale);
  if (newScale === current.scale) {
    return current;
  }

  // Anchor in world space before zoom:
  // worldX = (anchorScreen.x - current.panX) / current.scale
  // After zoom, anchorScreen.x must satisfy:
  // anchorScreen.x = worldX * newScale + newPanX
  // Therefore:
  // newPanX = anchorScreen.x - worldX * newScale
  const worldX = (anchorScreen.x - current.panX) / current.scale;
  const worldY = (anchorScreen.y - current.panY) / current.scale;

  const newPanX = anchorScreen.x - worldX * newScale;
  const newPanY = anchorScreen.y - worldY * newScale;

  return {
    scale: newScale,
    panX: newPanX,
    panY: newPanY,
  };
}

export function screenToPlan(screenPoint: Point, transform: ViewTransform): Point {
  return {
    x: (screenPoint.x - transform.panX) / transform.scale,
    y: (screenPoint.y - transform.panY) / transform.scale,
  };
}

export function planToScreen(planPoint: Point, transform: ViewTransform): Point {
  return {
    x: planPoint.x * transform.scale + transform.panX,
    y: planPoint.y * transform.scale + transform.panY,
  };
}
