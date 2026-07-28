export type RawPointerSample = {
  x: number;
  y: number;
  timestamp: number;
};

export type NormalizedPointer = {
  x: number;
  y: number;
  vx: number;
  vy: number;
};

export type SmoothedProbeInput = NormalizedPointer & {
  signalStrength: number;
  textureOffsetX: number;
  textureOffsetY: number;
  scanLineBias: number;
};

const DEFAULT_SMOOTHING = 0.14;

export function normalizePointerSample(
  sample: RawPointerSample,
  width: number,
  height: number,
): NormalizedPointer {
  if (width <= 0 || height <= 0) {
    return { x: 0.5, y: 0.5, vx: 0, vy: 0 };
  }
  return {
    x: clamp01(sample.x / width),
    y: clamp01(sample.y / height),
    vx: 0,
    vy: 0,
  };
}

export function createPointerSmoother(smoothing = DEFAULT_SMOOTHING) {
  let previous: NormalizedPointer | null = null;
  let lastTimestamp = 0;

  return {
    reset() {
      previous = null;
      lastTimestamp = 0;
    },
    push(sample: RawPointerSample, width: number, height: number): SmoothedProbeInput {
      const normalized = normalizePointerSample(sample, width, height);
      const dt = lastTimestamp > 0 ? Math.max(1, sample.timestamp - lastTimestamp) : 16;
      lastTimestamp = sample.timestamp;

      const rawVx = previous ? (normalized.x - previous.x) / dt : 0;
      const rawVy = previous ? (normalized.y - previous.y) / dt : 0;

      const smoothed: NormalizedPointer = previous
        ? {
            x: lerp(previous.x, normalized.x, smoothing),
            y: lerp(previous.y, normalized.y, smoothing),
            vx: lerp(previous.vx, rawVx, smoothing),
            vy: lerp(previous.vy, rawVy, smoothing),
          }
        : { ...normalized, vx: 0, vy: 0 };

      previous = smoothed;

      const speed = Math.hypot(smoothed.vx, smoothed.vy);
      const signalStrength = clamp01(0.22 + speed * 4200);
      const textureOffsetX = (smoothed.x - 0.5) * 0.08;
      const textureOffsetY = (smoothed.y - 0.5) * 0.08;
      const scanLineBias = clamp(smoothed.x - 0.5, -0.35, 0.35);

      return {
        ...smoothed,
        signalStrength,
        textureOffsetX,
        textureOffsetY,
        scanLineBias,
      };
    },
    getSnapshot(): SmoothedProbeInput | null {
      if (!previous) {
        return null;
      }
      const speed = Math.hypot(previous.vx, previous.vy);
      return {
        ...previous,
        signalStrength: clamp01(0.22 + speed * 4200),
        textureOffsetX: (previous.x - 0.5) * 0.08,
        textureOffsetY: (previous.y - 0.5) * 0.08,
        scanLineBias: clamp(previous.x - 0.5, -0.35, 0.35),
      };
    },
  };
}

export function neutralProbeInput(): SmoothedProbeInput {
  return {
    x: 0.5,
    y: 0.5,
    vx: 0,
    vy: 0,
    signalStrength: 0.22,
    textureOffsetX: 0,
    textureOffsetY: 0,
    scanLineBias: 0,
  };
}

function clamp01(value: number): number {
  return clamp(value, 0, 1);
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function lerp(from: number, to: number, alpha: number): number {
  return from + (to - from) * alpha;
}
