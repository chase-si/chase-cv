export const DEFAULT_MAX_DEVICE_PIXEL_RATIO = 2;
export const DEFAULT_RESIZE_THROTTLE_MS = 120;

export type CanvasLayout = {
  cssWidth: number;
  cssHeight: number;
  pixelWidth: number;
  pixelHeight: number;
  devicePixelRatio: number;
};

export function computeCanvasLayout(
  cssWidth: number,
  cssHeight: number,
  devicePixelRatio: number,
  maxDevicePixelRatio = DEFAULT_MAX_DEVICE_PIXEL_RATIO,
): CanvasLayout {
  const dpr = Math.min(Math.max(devicePixelRatio, 1), maxDevicePixelRatio);
  return {
    cssWidth,
    cssHeight,
    pixelWidth: Math.max(1, Math.floor(cssWidth * dpr)),
    pixelHeight: Math.max(1, Math.floor(cssHeight * dpr)),
    devicePixelRatio: dpr,
  };
}

export function shouldThrottleResize(
  lastResizeAt: number,
  now: number,
  throttleMs = DEFAULT_RESIZE_THROTTLE_MS,
): boolean {
  return now - lastResizeAt < throttleMs;
}
