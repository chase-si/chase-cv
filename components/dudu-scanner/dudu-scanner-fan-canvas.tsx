"use client";

import { useEffect, useRef, useState } from "react";

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

type DuduScannerFanCanvasProps = {
  className?: string;
  active?: boolean;
  showLockFrame?: boolean;
  targetRevealed?: boolean;
  revealProgress?: number;
  locking?: boolean;
  placementSeed?: number;
  targetImageSrc?: string | null;
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
  const targetImageRef = useRef<HTMLImageElement | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [lockTargetPosition, setLockTargetPosition] =
    useState<ScannerPoint | null>(null);

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
    const image = new Image();
    image.src = targetImageSrc;
    image.onload = () => {
      targetImageRef.current = image;
    };
    return () => {
      targetImageRef.current = null;
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
      getStageRect: () => stage.getBoundingClientRect(),
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
      onMetrics: (metrics) => onMetricsRef.current?.(metrics),
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
      showLockFrame,
      targetRevealed,
      revealProgress,
      locking,
      reducedMotion,
      placementSeed,
    });
    setLockTargetPosition(locking ? renderer?.getTargetPosition() ?? null : null);
  }, [
    active,
    explorationEnabled,
    showLockFrame,
    targetRevealed,
    revealProgress,
    locking,
    reducedMotion,
    placementSeed,
  ]);

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
      {showLockFrame && lockTargetPosition ? (
        <div
          className="pointer-events-none absolute size-17 -translate-x-1/2 -translate-y-1/2 rounded-xl border-3 border-primary shadow-[0_0_24px] shadow-primary/45"
          style={{
            left: lockTargetPosition.x,
            top: lockTargetPosition.y,
          }}
          data-testid="dudu-scanner-lock-frame"
        />
      ) : null}
    </div>
  );
}
