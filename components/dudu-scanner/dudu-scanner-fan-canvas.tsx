"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { getCachedTargetImage } from "@/lib/dudu-scanner/target-asset";
import {
  createScannerVisualRenderer,
  type ScannerVisualMetrics,
} from "@/lib/dudu-scanner/scanner-visual/renderer";
import {
  DUDU_SCANNER_DESKTOP_SPOTLIGHT_RADIUS,
  DUDU_SCANNER_MOBILE_SPOTLIGHT_RADIUS,
  isDoubleClickLockEligible,
  type ScannerPoint,
} from "@/lib/dudu-scanner/scanner-visual/exploration-model";
import { cn } from "@/lib/utils";

function getStageContentRect(stage: HTMLElement): DOMRect {
  const borderBox = stage.getBoundingClientRect();
  const width = stage.clientWidth || borderBox.width;
  const height = stage.clientHeight || borderBox.height;
  return new DOMRect(
    borderBox.left + stage.clientLeft,
    borderBox.top + stage.clientTop,
    width,
    height,
  );
}

function toStageLockFramePosition(
  stage: HTMLElement,
  canvas: HTMLCanvasElement,
  target: ScannerPoint,
): ScannerPoint {
  const stageRect = stage.getBoundingClientRect();
  const canvasRect = canvas.getBoundingClientRect();
  const originX = canvasRect.left - stageRect.left - stage.clientLeft;
  const originY = canvasRect.top - stageRect.top - stage.clientTop;
  return {
    x: originX + target.x,
    y: originY + target.y,
  };
}

type DuduScannerFanCanvasProps = {
  className?: string;
  active?: boolean;
  showLockFrame?: boolean;
  targetRevealed?: boolean;
  revealProgress?: number;
  locking?: boolean;
  placementSeed?: number;
  targetImageSrc?: string | null;
  mysteryMode?: boolean;
  finaleEyebrow?: string;
  finaleName?: string;
  finaleLine?: string;
  onMetricsChange?: (metrics: ScannerVisualMetrics) => void;
  onDiscovery?: () => void;
  onLockRequest?: () => void;
  explorationEnabled?: boolean;
  hideCursor?: boolean;
};

export function DuduScannerFanCanvas({
  className,
  active = true,
  showLockFrame = false,
  targetRevealed = false,
  revealProgress = 0,
  locking = false,
  placementSeed = 1,
  targetImageSrc = null,
  mysteryMode = false,
  finaleEyebrow,
  finaleName,
  finaleLine,
  onMetricsChange,
  onDiscovery,
  onLockRequest,
  explorationEnabled = false,
  hideCursor = false,
}: DuduScannerFanCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<ReturnType<typeof createScannerVisualRenderer> | null>(null);
  const onMetricsRef = useRef(onMetricsChange);
  const onDiscoveryRef = useRef(onDiscovery);
  const onLockRequestRef = useRef(onLockRequest);
  const targetRevealedRef = useRef(targetRevealed);
  const showLockFrameRef = useRef(showLockFrame);
  const targetImageRef = useRef<HTMLImageElement | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [showFinaleCopy, setShowFinaleCopy] = useState(false);
  const [lockFrameVisible, setLockFrameVisible] = useState(showLockFrame);
  const [lockTargetPosition, setLockTargetPosition] =
    useState<ScannerPoint | null>(null);
  const effectiveLockFrameVisible = showLockFrame && lockFrameVisible;

  useEffect(() => {
    onMetricsRef.current = onMetricsChange;
  }, [onMetricsChange]);

  useEffect(() => {
    onDiscoveryRef.current = onDiscovery;
  }, [onDiscovery]);

  useEffect(() => {
    onLockRequestRef.current = onLockRequest;
  }, [onLockRequest]);

  useEffect(() => {
    targetRevealedRef.current = targetRevealed;
  }, [targetRevealed]);

  useEffect(() => {
    showLockFrameRef.current = effectiveLockFrameVisible;
  }, [effectiveLockFrameVisible]);

  const syncLockTargetPosition = useCallback(() => {
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    const renderer = rendererRef.current;
    const target = renderer?.getTargetPosition() ?? null;

    if (!showLockFrameRef.current || !stage || !canvas || !target) {
      return;
    }

    const next = toStageLockFramePosition(stage, canvas, target);
    setLockTargetPosition((previous) => {
      if (previous && Math.hypot(previous.x - next.x, previous.y - next.y) < 0.25) {
        return previous;
      }
      return next;
    });
  }, []);

  useEffect(() => {
    if (!locking) {
      const resetTimer = window.setTimeout(() => setShowFinaleCopy(false), 0);
      return () => window.clearTimeout(resetTimer);
    }
    if (reducedMotion) {
      const revealTimer = window.setTimeout(() => setShowFinaleCopy(true), 0);
      return () => window.clearTimeout(revealTimer);
    }
    const timer = window.setTimeout(() => setShowFinaleCopy(true), 1100);
    return () => window.clearTimeout(timer);
  }, [locking, reducedMotion]);

  useEffect(() => {
    if (!showLockFrame) {
      const hideTimer = window.setTimeout(() => setLockFrameVisible(false), 0);
      return () => window.clearTimeout(hideTimer);
    }
    const showTimer = window.setTimeout(() => setLockFrameVisible(true), 0);
    const hideTimer = locking
      ? window.setTimeout(() => setLockFrameVisible(false), 650)
      : null;
    return () => {
      window.clearTimeout(showTimer);
      if (hideTimer !== null) {
        window.clearTimeout(hideTimer);
      }
    };
  }, [locking, showLockFrame]);

  const syncLockTargetPositionRef = useRef(syncLockTargetPosition);
  useEffect(() => {
    syncLockTargetPositionRef.current = syncLockTargetPosition;
  }, [syncLockTargetPosition]);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) {
      return;
    }
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!targetImageSrc) {
      targetImageRef.current = null;
      return;
    }

    const cached = getCachedTargetImage(targetImageSrc);
    if (cached) {
      targetImageRef.current = cached;
      return () => {
        if (targetImageRef.current === cached) {
          targetImageRef.current = null;
        }
      };
    }

    let cancelled = false;
    const image = new Image();
    image.onload = () => {
      if (!cancelled) {
        targetImageRef.current = image;
      }
    };
    image.onerror = () => {
      if (!cancelled) {
        targetImageRef.current = null;
      }
    };
    image.src = targetImageSrc;

    return () => {
      cancelled = true;
      if (targetImageRef.current === image) {
        targetImageRef.current = null;
      }
    };
  }, [targetImageSrc]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const stage = stageRef.current;
    if (!canvas || !stage) {
      return;
    }

    const styles = window.getComputedStyle(stage);
    const background = styles.getPropertyValue("--background").trim() || "Canvas";
    const primary = styles.getPropertyValue("--primary").trim() || "Highlight";
    const renderer = createScannerVisualRenderer({
      canvas,
      getStageRect: () => getStageContentRect(stage),
      getTargetImage: () => targetImageRef.current,
      spotlightRadius: window.matchMedia?.("(pointer: coarse)").matches
        ? DUDU_SCANNER_MOBILE_SPOTLIGHT_RADIUS
        : DUDU_SCANNER_DESKTOP_SPOTLIGHT_RADIUS,
      palette: {
        spotlightOverlay: `color-mix(in oklab, ${background} 70%, transparent)`,
        spotlightFeather: `color-mix(in oklab, ${background} 75%, transparent)`,
        spotlightAccent: `color-mix(in oklab, ${primary} 72%, transparent)`,
        spotlightParticle: `color-mix(in oklab, ${primary} 50%, transparent)`,
      },
      onMetrics: (metrics) => {
        onMetricsRef.current?.(metrics);
        syncLockTargetPositionRef.current();
      },
      onDiscovery: () => onDiscoveryRef.current?.(),
    });
    rendererRef.current = renderer;

    const observer = new ResizeObserver(() => renderer.resize());
    observer.observe(stage);

    const handlePointerMove = (event: PointerEvent) => {
      renderer.updateInput(event.clientX, event.clientY, event.timeStamp);
    };
    const handlePointerDown = (event: PointerEvent) => {
      if (stage.setPointerCapture) {
        stage.setPointerCapture(event.pointerId);
      }
      renderer.updateInput(event.clientX, event.clientY, event.timeStamp);
    };
    const handlePointerUp = (event: PointerEvent) => {
      if (stage.hasPointerCapture(event.pointerId)) {
        stage.releasePointerCapture(event.pointerId);
      }
    };
    const handleDoubleClick = (event: MouseEvent) => {
      renderer.updateInput(event.clientX, event.clientY, event.timeStamp);
      if (
        isDoubleClickLockEligible(
          targetRevealedRef.current,
          renderer.getMetrics().signalStrength,
        )
      ) {
        onLockRequestRef.current?.();
      }
    };
    stage.addEventListener("pointermove", handlePointerMove);
    stage.addEventListener("pointerdown", handlePointerDown);
    stage.addEventListener("pointerup", handlePointerUp);
    stage.addEventListener("pointercancel", handlePointerUp);
    stage.addEventListener("dblclick", handleDoubleClick);
    const handleVisibilityChange = () => {
      renderer.setPageVisible(!document.hidden);
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    renderer.start();
    handleVisibilityChange();

    return () => {
      stage.removeEventListener("pointermove", handlePointerMove);
      stage.removeEventListener("pointerdown", handlePointerDown);
      stage.removeEventListener("pointerup", handlePointerUp);
      stage.removeEventListener("pointercancel", handlePointerUp);
      stage.removeEventListener("dblclick", handleDoubleClick);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      observer.disconnect();
      renderer.destroy();
      rendererRef.current = null;
    };
  }, []);

  useEffect(() => {
    const renderer = rendererRef.current;
    renderer?.setState({
      active,
      explorationEnabled,
      showLockFrame: effectiveLockFrameVisible,
      targetRevealed,
      revealProgress,
      locking,
      mysteryMode,
      reducedMotion,
      placementSeed,
    });
  }, [
    active,
    explorationEnabled,
    effectiveLockFrameVisible,
    targetRevealed,
    revealProgress,
    locking,
    mysteryMode,
    reducedMotion,
    placementSeed,
  ]);

  useEffect(() => {
    if (!effectiveLockFrameVisible) {
      return;
    }

    const raf = requestAnimationFrame(() => {
      syncLockTargetPositionRef.current();
    });
    return () => cancelAnimationFrame(raf);
  }, [effectiveLockFrameVisible, placementSeed]);

  return (
    <div
      ref={stageRef}
      className={cn(
        "relative flex min-h-0 flex-1 items-stretch justify-center overflow-hidden rounded-2xl border border-border bg-card/80",
        hideCursor && "cursor-none",
        className,
      )}
      data-testid="dudu-scanner-fan-stage"
    >
      <canvas ref={canvasRef} className="size-full touch-none" aria-hidden />
      {effectiveLockFrameVisible && lockTargetPosition ? (
        <div
          className="pointer-events-none absolute size-17 -translate-x-1/2 -translate-y-1/2 rounded-xl border-3 border-primary shadow-[0_0_24px] shadow-primary/45"
          style={{
            left: lockTargetPosition.x,
            top: lockTargetPosition.y,
          }}
          data-testid="dudu-scanner-lock-frame"
        />
      ) : null}
      {locking && showFinaleCopy && finaleName ? (
        <div
          className="pointer-events-none absolute inset-x-4 bottom-5 z-10 mx-auto max-w-lg rounded-2xl border border-primary/50 bg-background/85 px-4 py-3 text-center shadow-lg backdrop-blur-md motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-500"
          data-testid="dudu-scanner-reveal-finale"
          role="status"
          aria-live="polite"
        >
          {finaleEyebrow ? (
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-primary">
              {finaleEyebrow}
            </p>
          ) : null}
          <p className="mt-1 text-xl font-black text-foreground sm:text-2xl">{finaleName}</p>
          {finaleLine ? (
            <p className="mt-1 text-sm font-medium text-muted-foreground sm:text-base">
              “{finaleLine}”
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
