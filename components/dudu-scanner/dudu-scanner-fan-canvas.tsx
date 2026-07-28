"use client";

import { useEffect, useRef, useState } from "react";

import {
  createScannerVisualRenderer,
  type ScannerVisualMetrics,
} from "@/lib/dudu-scanner/scanner-visual/renderer";
import {
  DUDU_SCANNER_DESKTOP_SPOTLIGHT_RADIUS,
  DUDU_SCANNER_MOBILE_SPOTLIGHT_RADIUS,
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
  explorationEnabled = false,
  hideCursor = false,
}: DuduScannerFanCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<ReturnType<typeof createScannerVisualRenderer> | null>(null);
  const onMetricsRef = useRef(onMetricsChange);
  const onDiscoveryRef = useRef(onDiscovery);
  const targetImageRef = useRef<HTMLImageElement | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    onMetricsRef.current = onMetricsChange;
  }, [onMetricsChange]);

  useEffect(() => {
    onDiscoveryRef.current = onDiscovery;
  }, [onDiscovery]);

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
    stage.addEventListener("pointermove", handlePointerMove);
    stage.addEventListener("pointerdown", handlePointerDown);
    stage.addEventListener("pointerup", handlePointerUp);
    stage.addEventListener("pointercancel", handlePointerUp);
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
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      observer.disconnect();
      renderer.destroy();
      rendererRef.current = null;
    };
  }, []);

  useEffect(() => {
    rendererRef.current?.setState({
      active,
      explorationEnabled,
      showLockFrame,
      targetRevealed,
      revealProgress,
      locking,
      reducedMotion,
      placementSeed,
    });
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
      {showLockFrame ? (
        <div
          className="pointer-events-none absolute inset-[12%] rounded-2xl border-4 border-primary shadow-[0_0_24px_rgba(34,197,94,0.45)]"
          data-testid="dudu-scanner-lock-frame"
        />
      ) : null}
    </div>
  );
}
