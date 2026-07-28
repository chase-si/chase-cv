import {
  computeCanvasLayout,
  DEFAULT_MAX_DEVICE_PIXEL_RATIO,
  DEFAULT_RESIZE_THROTTLE_MS,
  shouldThrottleResize,
} from "@/lib/dudu-scanner/scanner-visual/canvas-size";
import {
  computeFanGeometry,
  isPointInFan,
  placeTargetInSafeRegion,
} from "@/lib/dudu-scanner/scanner-visual/geometry";
import {
  advanceDiscoveryDwell,
  computeProximitySignal,
  DUDU_SCANNER_DESKTOP_SPOTLIGHT_RADIUS,
  DUDU_SCANNER_DISCOVERY_DWELL_MS,
  DUDU_SCANNER_MIN_DISCOVERY_ELAPSED_MS,
  signalBandForStrength,
  type ScannerSignalBand,
} from "@/lib/dudu-scanner/scanner-visual/exploration-model";
import { resolveScannerMotionPolicy } from "@/lib/dudu-scanner/scanner-visual/motion-policy";
import {
  createPointerSmoother,
  neutralProbeInput,
  type SmoothedProbeInput,
} from "@/lib/dudu-scanner/scanner-visual/pointer-input";
import {
  advanceTargetMotion,
  applyScanLineClarity,
  scanLineCrossBoost,
  type TargetMotionState,
} from "@/lib/dudu-scanner/scanner-visual/target-motion";

export type ScannerVisualRenderState = {
  active: boolean;
  explorationEnabled: boolean;
  showLockFrame: boolean;
  targetRevealed: boolean;
  revealProgress: number;
  locking: boolean;
  reducedMotion: boolean;
  placementSeed: number;
};

export type ScannerVisualMetrics = Pick<
  SmoothedProbeInput,
  "signalStrength" | "textureOffsetX" | "textureOffsetY" | "scanLineBias"
> & {
  gain: number;
  scanFrequencyHz: number;
  signalBand: ScannerSignalBand;
  probeInside: boolean;
  probeHasEntered: boolean;
  dwellProgress: number;
  roundElapsedMs: number;
  spotlightVisible: boolean;
  spotlightRadius: number;
  probeVelocity: number;
};

export type ScannerVisualRenderer = {
  start: () => void;
  setPageVisible: (visible: boolean) => void;
  updateInput: (clientX: number, clientY: number, timestamp?: number) => void;
  clearInput: () => void;
  setState: (patch: Partial<ScannerVisualRenderState>) => void;
  resize: (force?: boolean) => void;
  destroy: () => void;
  getMetrics: () => ScannerVisualMetrics;
  getTargetPosition: () => { x: number; y: number } | null;
};

export type ScannerVisualPalette = {
  spotlightOverlay: string;
  spotlightFeather: string;
  spotlightAccent: string;
  spotlightParticle: string;
};

export type CreateScannerVisualRendererOptions = {
  canvas: HTMLCanvasElement;
  getStageRect: () => DOMRectReadOnly;
  getDevicePixelRatio?: () => number;
  getNow?: () => number;
  requestFrame?: (callback: FrameRequestCallback) => number;
  cancelFrame?: (id: number) => void;
  onMetrics?: (metrics: ScannerVisualMetrics) => void;
  maxDevicePixelRatio?: number;
  resizeThrottleMs?: number;
  getTargetImage?: () => CanvasImageSource | null;
  targetDisplayRadius?: number;
  spotlightRadius?: number;
  palette?: ScannerVisualPalette;
  onDiscovery?: () => void;
  metricsIntervalMs?: number;
};

const defaultState: ScannerVisualRenderState = {
  active: true,
  explorationEnabled: false,
  showLockFrame: false,
  targetRevealed: false,
  revealProgress: 0,
  locking: false,
  reducedMotion: false,
  placementSeed: 1,
};

const defaultPalette: ScannerVisualPalette = {
  spotlightOverlay: "Canvas",
  spotlightFeather: "Canvas",
  spotlightAccent: "Highlight",
  spotlightParticle: "Highlight",
};

function hashNoise(x: number, y: number, frame: number): number {
  const value = Math.sin(x * 12.9898 + y * 78.233 + frame * 0.17) * 43758.5453;
  return value - Math.floor(value);
}

export function createScannerVisualRenderer(
  options: CreateScannerVisualRendererOptions,
): ScannerVisualRenderer {
  const {
    canvas,
    getStageRect,
    getDevicePixelRatio = () => (typeof window !== "undefined" ? window.devicePixelRatio : 1),
    getNow = () => performance.now(),
    requestFrame = (callback) =>
      typeof window !== "undefined" ? window.requestAnimationFrame(callback) : 0,
    cancelFrame = (id) => {
      if (typeof window !== "undefined") {
        window.cancelAnimationFrame(id);
      }
    },
    onMetrics,
    maxDevicePixelRatio = DEFAULT_MAX_DEVICE_PIXEL_RATIO,
    resizeThrottleMs = DEFAULT_RESIZE_THROTTLE_MS,
    getTargetImage = () => null,
    targetDisplayRadius = 28,
    spotlightRadius = DUDU_SCANNER_DESKTOP_SPOTLIGHT_RADIUS,
    palette = defaultPalette,
    onDiscovery,
    metricsIntervalMs = 80,
  } = options;

  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("2d context unavailable");
  }

  let state: ScannerVisualRenderState = { ...defaultState };
  let rafId = 0;
  let started = false;
  let pageVisible = true;
  let hiddenAt: number | null = null;
  let frame = 0;
  let startedAt = getNow();
  let lastFrameAt = startedAt;
  let dwellMs = 0;
  let discoveryNotified = false;
  let lastMetricsAt = Number.NEGATIVE_INFINITY;
  let lastResizeAt = 0;
  let destroyed = false;
  const smoother = createPointerSmoother();
  let probe: SmoothedProbeInput = neutralProbeInput();
  let probeInside = false;
  let probeHasEntered = false;
  let targetMotion: TargetMotionState | null = null;
  let cssWidth = 1;
  let cssHeight = 1;

  const resetTargetMotion = () => {
    const fan = computeFanGeometry(cssWidth, cssHeight);
    const position = placeTargetInSafeRegion(state.placementSeed, fan, targetDisplayRadius);
    targetMotion = { position, clarityBoost: 0 };
  };

  const applyCanvasSize = (layout: ReturnType<typeof computeCanvasLayout>) => {
    cssWidth = layout.cssWidth;
    cssHeight = layout.cssHeight;
    canvas.width = layout.pixelWidth;
    canvas.height = layout.pixelHeight;
    canvas.style.width = `${layout.cssWidth}px`;
    canvas.style.height = `${layout.cssHeight}px`;
    context.setTransform(layout.devicePixelRatio, 0, 0, layout.devicePixelRatio, 0, 0);
    resetTargetMotion();
  };

  const resize = (force = false) => {
    const rect = getStageRect();
    const now = getNow();
    if (!force && shouldThrottleResize(lastResizeAt, now, resizeThrottleMs)) {
      return;
    }
    lastResizeAt = now;
    const layout = computeCanvasLayout(
      rect.width,
      rect.height,
      getDevicePixelRatio(),
      maxDevicePixelRatio,
    );
    applyCanvasSize(layout);
  };

  const getProximity = () => {
    if (!state.explorationEnabled || !targetMotion) {
      return null;
    }
    return computeProximitySignal(
      { x: probe.x * cssWidth, y: probe.y * cssHeight },
      targetMotion.position,
      {
        revealRadius: 120,
        signalRadius: Math.max(spotlightRadius * 4.2, 1),
      },
    );
  };

  const getMetrics = (): ScannerVisualMetrics => {
    const proximity = getProximity();
    const signalStrength = proximity?.strength ?? probe.signalStrength;
    return {
      signalStrength,
      signalBand: proximity?.band ?? signalBandForStrength(signalStrength),
      probeInside,
      probeHasEntered,
      dwellProgress: dwellMs / DUDU_SCANNER_DISCOVERY_DWELL_MS,
      roundElapsedMs: Math.max(0, getNow() - startedAt),
      spotlightVisible: state.explorationEnabled && probeInside,
      spotlightRadius,
      probeVelocity: Math.min(1, Math.hypot(probe.vx, probe.vy) * 4200),
      textureOffsetX: probe.textureOffsetX,
      textureOffsetY: probe.textureOffsetY,
      scanLineBias: probe.scanLineBias,
      gain: 0.42 + signalStrength * 0.35,
      scanFrequencyHz: 0.9 + signalStrength * 0.25,
    };
  };

  const drawFanMask = (fan: ReturnType<typeof computeFanGeometry>) => {
    const { cx, cy, radius, sweep, startAngle } = fan;
    context.save();
    context.beginPath();
    context.moveTo(cx, cy);
    context.arc(cx, cy, radius, startAngle, startAngle + sweep);
    context.closePath();
    context.clip();
  };

  const drawNoiseLayer = (
    fan: ReturnType<typeof computeFanGeometry>,
    motionScale: number,
    offsetX: number,
    offsetY: number,
  ) => {
    const step = 6;
    for (let y = fan.cy - fan.radius; y < fan.cy; y += step) {
      for (let x = fan.cx - fan.radius; x < fan.cx + fan.radius; x += step) {
        const n = hashNoise(x * 0.04 + offsetX, y * 0.04 + offsetY, frame * motionScale);
        const gray = Math.floor(18 + n * 42);
        context.fillStyle = `rgba(${gray}, ${gray + 4}, ${gray + 8}, 0.55)`;
        context.fillRect(x, y, step, step);
      }
    }
  };

  const drawTextureLayer = (
    fan: ReturnType<typeof computeFanGeometry>,
    motionScale: number,
    offsetX: number,
    offsetY: number,
  ) => {
    const blobCount = 5;
    for (let index = 0; index < blobCount; index += 1) {
      const phase = frame * 0.008 * motionScale + index * 1.7;
      const bx = fan.cx + Math.cos(phase) * fan.radius * 0.35 + offsetX * fan.radius;
      const by = fan.cy - fan.radius * (0.35 + index * 0.08) + offsetY * fan.radius;
      const gradient = context.createRadialGradient(bx, by, 4, bx, by, fan.radius * 0.22);
      gradient.addColorStop(0, "rgba(120, 140, 120, 0.12)");
      gradient.addColorStop(1, "rgba(40, 50, 40, 0)");
      context.fillStyle = gradient;
      context.fillRect(fan.cx - fan.radius, fan.cy - fan.radius, fan.radius * 2, fan.radius);
    }
  };

  const drawSpotlight = (
    fan: ReturnType<typeof computeFanGeometry>,
    motionScale: number,
  ) => {
    context.fillStyle = palette.spotlightOverlay;
    context.fillRect(
      fan.cx - fan.radius,
      fan.cy - fan.radius,
      fan.radius * 2,
      fan.radius * 2,
    );

    if (!probeInside) {
      return;
    }

    const probeX = probe.x * cssWidth;
    const probeY = probe.y * cssHeight;
    const signalStrength = getProximity()?.strength ?? probe.signalStrength;
    context.save();
    context.beginPath();
    context.arc(probeX, probeY, spotlightRadius, 0, Math.PI * 2);
    context.clip();
    context.globalAlpha = 0.65 + signalStrength * 0.35;
    drawNoiseLayer(
      fan,
      motionScale,
      probe.textureOffsetX * fan.radius,
      probe.textureOffsetY * fan.radius,
    );
    drawTextureLayer(
      fan,
      motionScale,
      probe.textureOffsetX,
      probe.textureOffsetY,
    );
    const feather = context.createRadialGradient(
      probeX,
      probeY,
      spotlightRadius * 0.55,
      probeX,
      probeY,
      spotlightRadius,
    );
    feather.addColorStop(0, "transparent");
    feather.addColorStop(1, palette.spotlightFeather);
    context.fillStyle = feather;
    context.fillRect(
      probeX - spotlightRadius,
      probeY - spotlightRadius,
      spotlightRadius * 2,
      spotlightRadius * 2,
    );
    context.restore();

    context.save();
    const pulse = state.reducedMotion
      ? 0
      : Math.sin(frame * (0.06 + signalStrength * 0.08)) * (2 + signalStrength * 5);
    context.strokeStyle = palette.spotlightAccent;
    context.lineWidth = 1.5 + signalStrength * 1.5;
    context.beginPath();
    context.arc(probeX, probeY, spotlightRadius + 8 + pulse, 0, Math.PI * 2);
    context.stroke();
    context.beginPath();
    context.moveTo(probeX - 12, probeY);
    context.lineTo(probeX + 12, probeY);
    context.moveTo(probeX, probeY - 12);
    context.lineTo(probeX, probeY + 12);
    context.stroke();

    if (!state.reducedMotion) {
      context.fillStyle = palette.spotlightParticle;
      for (let index = 0; index < 6; index += 1) {
        const angle = frame * 0.018 + (index / 6) * Math.PI * 2;
        const radius = spotlightRadius + 15 + (index % 2) * 7;
        context.beginPath();
        context.arc(
          probeX + Math.cos(angle) * radius,
          probeY + Math.sin(angle) * radius,
          1.5,
          0,
          Math.PI * 2,
        );
        context.fill();
      }
    }
    context.restore();
  };

  const drawTarget = (
    fan: ReturnType<typeof computeFanGeometry>,
    motion: TargetMotionState,
    reveal: number,
  ) => {
    if (!state.targetRevealed || reveal <= 0) {
      return;
    }
    const clarity = Math.min(1, reveal * 0.55 + motion.clarityBoost * 0.45);
    const size = targetDisplayRadius * 2 * (0.8 + clarity * 0.2);
    context.save();
    context.translate(motion.position.x, motion.position.y);
    context.globalAlpha = 0.12 + clarity * 0.78;
    const targetImage = getTargetImage();
    if (targetImage) {
      context.filter = `grayscale(1) contrast(${0.65 + clarity * 0.25}) blur(${(1 - clarity) * 4}px)`;
      context.drawImage(targetImage, -size / 2, -size / 2, size, size);
    } else {
      context.fillStyle = "rgba(180, 190, 180, 0.35)";
      context.beginPath();
      context.arc(0, 0, size / 2, 0, Math.PI * 2);
      context.fill();
    }
    context.restore();
  };

  const draw = () => {
    if (destroyed || !pageVisible) {
      rafId = 0;
      return;
    }
    const now = getNow();
    const deltaMs = Math.max(0, now - lastFrameAt);
    lastFrameAt = now;
    const fan = computeFanGeometry(cssWidth, cssHeight);
    const motionPolicy = resolveScannerMotionPolicy(state.reducedMotion);
    const elapsedSeconds = (now - startedAt) / 1000;

    if (state.explorationEnabled && !state.targetRevealed && targetMotion) {
      const proximity = getProximity();
      const dwell = advanceDiscoveryDwell(dwellMs, {
        deltaMs,
        roundElapsedMs: now - startedAt,
        probeInside,
        insideRevealRadius: proximity?.insideRevealRadius ?? false,
      });
      dwellMs = dwell.dwellMs;
      if (
        now - startedAt >= DUDU_SCANNER_MIN_DISCOVERY_ELAPSED_MS &&
        dwell.discovered &&
        !discoveryNotified
      ) {
        discoveryNotified = true;
        onDiscovery?.();
      }
    }

    if (targetMotion && state.targetRevealed) {
      targetMotion = advanceTargetMotion(
        targetMotion,
        fan,
        targetDisplayRadius,
        elapsedSeconds,
        state.placementSeed,
        motionPolicy.driftSpeed,
      );
    }

    context.clearRect(0, 0, cssWidth, cssHeight);
    context.save();
    drawFanMask(fan);

    drawNoiseLayer(
      fan,
      motionPolicy.textureMotion,
      probe.textureOffsetX * fan.radius,
      probe.textureOffsetY * fan.radius,
    );
    drawTextureLayer(
      fan,
      motionPolicy.textureMotion,
      probe.textureOffsetX,
      probe.textureOffsetY,
    );

    if (state.explorationEnabled) {
      drawSpotlight(fan, motionPolicy.textureMotion);
    }

    const beamBase = fan.startAngle + fan.sweep * 0.5;
    const beamWobble = Math.sin(frame * 0.04 * motionPolicy.textureMotion) * (fan.sweep * 0.35);
    const beamAngle = beamBase + beamWobble + probe.scanLineBias * fan.sweep * 0.25;

    if (state.active) {
      context.save();
      context.translate(fan.cx, fan.cy);
      context.rotate(beamAngle);
      context.beginPath();
      context.moveTo(0, 0);
      context.lineTo(0, -fan.radius);
      context.strokeStyle = "rgba(74, 222, 128, 0.85)";
      context.lineWidth = 3;
      context.stroke();
      context.restore();
    }

    if (targetMotion && state.targetRevealed) {
      const boost = scanLineCrossBoost(beamAngle, targetMotion.position, fan);
      targetMotion = applyScanLineClarity(targetMotion, boost);
      const reveal =
        state.revealProgress / motionPolicy.revealDurationScale +
        (state.locking ? 0.25 : 0);
      drawTarget(fan, targetMotion, Math.min(1, reveal));
    }

    context.restore();

    context.save();
    context.beginPath();
    context.moveTo(fan.cx, fan.cy);
    context.arc(fan.cx, fan.cy, fan.radius, fan.startAngle, fan.startAngle + fan.sweep);
    context.closePath();
    const gradient = context.createRadialGradient(
      fan.cx,
      fan.cy,
      fan.radius * 0.1,
      fan.cx,
      fan.cy,
      fan.radius,
    );
    gradient.addColorStop(0, "rgba(34, 197, 94, 0.35)");
    gradient.addColorStop(0.55, "rgba(34, 197, 94, 0.12)");
    gradient.addColorStop(1, "rgba(34, 197, 94, 0.02)");
    context.fillStyle = gradient;
    context.fill();
    context.strokeStyle = "rgba(34, 197, 94, 0.55)";
    context.lineWidth = 2;
    context.stroke();
    context.restore();

    if (state.showLockFrame) {
      context.save();
      drawFanMask(fan);
      context.strokeStyle = "rgba(74, 222, 128, 0.9)";
      context.lineWidth = 4;
      context.strokeRect(
        fan.cx - fan.radius * 0.35,
        fan.cy - fan.radius * 0.55,
        fan.radius * 0.7,
        fan.radius * 0.45,
      );
      context.restore();
    }

    if (now - lastMetricsAt >= metricsIntervalMs) {
      lastMetricsAt = now;
      onMetrics?.(getMetrics());
    }
    frame += 1;
    rafId = requestFrame(draw);
  };

  return {
    start() {
      if (destroyed || started) {
        return;
      }
      started = true;
      startedAt = getNow();
      lastFrameAt = startedAt;
      resize(true);
      if (pageVisible) {
        rafId = requestFrame(draw);
      }
    },
    setPageVisible(visible) {
      if (destroyed || pageVisible === visible) {
        return;
      }
      pageVisible = visible;
      if (!visible) {
        hiddenAt = getNow();
        if (rafId) {
          cancelFrame(rafId);
          rafId = 0;
        }
        return;
      }
      const resumedAt = getNow();
      if (hiddenAt != null) {
        startedAt += Math.max(0, resumedAt - hiddenAt);
        hiddenAt = null;
      }
      lastFrameAt = resumedAt;
      if (started && !rafId) {
        rafId = requestFrame(draw);
      }
    },
    updateInput(clientX, clientY, timestamp = getNow()) {
      const rect = getStageRect();
      const localPoint = {
        x: clientX - rect.left,
        y: clientY - rect.top,
      };
      if (!isPointInFan(localPoint, computeFanGeometry(cssWidth, cssHeight))) {
        probeInside = false;
        return;
      }
      probeInside = true;
      probeHasEntered = true;
      probe = smoother.push(
        {
          ...localPoint,
          timestamp,
        },
        rect.width,
        rect.height,
      );
    },
    clearInput() {
      smoother.reset();
      probe = neutralProbeInput();
      probeInside = false;
      probeHasEntered = false;
    },
    setState(patch) {
      const seedChanged =
        patch.placementSeed !== undefined && patch.placementSeed !== state.placementSeed;
      const targetWasCancelled =
        state.targetRevealed && patch.targetRevealed === false;
      state = { ...state, ...patch };
      if (seedChanged || targetWasCancelled) {
        resetTargetMotion();
      }
      if (seedChanged) {
        startedAt = getNow();
        lastFrameAt = startedAt;
      }
      if (seedChanged || targetWasCancelled) {
        dwellMs = 0;
        discoveryNotified = false;
      }
      if (seedChanged) {
        smoother.reset();
        probe = neutralProbeInput();
        probeHasEntered = false;
        probeInside = false;
      }
    },
    resize,
    destroy() {
      destroyed = true;
      started = false;
      if (rafId) {
        cancelFrame(rafId);
        rafId = 0;
      }
      smoother.reset();
    },
    getMetrics,
    getTargetPosition() {
      return targetMotion ? { ...targetMotion.position } : null;
    },
  };
}
