import "@testing-library/jest-dom/vitest";

const canvasContextStub = {
  setTransform: () => {},
  clearRect: () => {},
  save: () => {},
  restore: () => {},
  beginPath: () => {},
  moveTo: () => {},
  lineTo: () => {},
  arc: () => {},
  closePath: () => {},
  clip: () => {},
  fill: () => {},
  stroke: () => {},
  fillRect: () => {},
  strokeRect: () => {},
  translate: () => {},
  rotate: () => {},
  drawImage: () => {},
  createRadialGradient: () => ({
    addColorStop: () => {},
  }),
  filter: "",
  globalAlpha: 1,
  fillStyle: "",
  strokeStyle: "",
  lineWidth: 1,
} as unknown as CanvasRenderingContext2D;

if (typeof HTMLCanvasElement !== "undefined") {
  const getContextStub = (type: string) => {
    if (type === "2d") {
      return canvasContextStub;
    }
    return null;
  };
  HTMLCanvasElement.prototype.getContext =
    getContextStub as typeof HTMLCanvasElement.prototype.getContext;
}

if (typeof globalThis.ResizeObserver === "undefined") {
  globalThis.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as typeof ResizeObserver;
}
