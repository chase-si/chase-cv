"use client";

import { useCallback, useEffect, useReducer, useRef, useState } from "react";

import { DuduScannerConfigShell } from "@/components/dudu-scanner/dudu-scanner-config-shell";
import { DuduScannerResultView } from "@/components/dudu-scanner/dudu-scanner-result-view";
import { DuduScannerScanView } from "@/components/dudu-scanner/dudu-scanner-scan-view";
import { exitAppFullscreen, requestAppFullscreen } from "@/lib/dudu-scanner/fullscreen";
import {
  createInitialRoundState,
  DUDU_SCANNER_LOCK_DURATION_MS,
  DUDU_SCANNER_REVEAL_DURATION_MS,
  DUDU_SCANNER_TRANSIENT_DURATION_MS,
  duduScannerRoundReducer,
} from "@/lib/dudu-scanner/round-state";
import { useDuduScannerConfig } from "@/lib/dudu-scanner/use-dudu-scanner-config";
import { cn } from "@/lib/utils";

function playScannerChime(enabled: boolean) {
  if (!enabled || typeof window === "undefined") {
    return;
  }
  try {
    const context = new AudioContext();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = "sine";
    oscillator.frequency.value = 520;
    gain.gain.value = 0.04;
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.12);
    oscillator.onended = () => {
      void context.close();
    };
  } catch {
    // audio optional
  }
}

export function DuduScannerApp() {
  const rootRef = useRef<HTMLDivElement>(null);
  const { config } = useDuduScannerConfig();
  const [round, dispatch] = useReducer(duduScannerRoundReducer, undefined, createInitialRoundState);
  const [revealProgress, setRevealProgress] = useState(0);
  const immersive = round.phase === "scan" || round.phase === "result";

  const attemptFullscreen = useCallback(async () => {
    const ok = await requestAppFullscreen(rootRef.current);
    if (!ok && round.phase === "scan") {
      dispatch({ type: "FULLSCREEN_UNAVAILABLE" });
    }
    return ok;
  }, [round.phase]);

  const handleStartScan = useCallback(async () => {
    setRevealProgress(0);
    dispatch({ type: "START_SCAN" });
    const ok = await requestAppFullscreen(rootRef.current);
    if (!ok) {
      dispatch({ type: "FULLSCREEN_UNAVAILABLE" });
    }
    playScannerChime(config.soundEnabled);
  }, [config.soundEnabled]);

  const handleScanAgain = useCallback(async () => {
    dispatch({ type: "SCAN_AGAIN" });
    setRevealProgress(0);
    await requestAppFullscreen(rootRef.current);
    playScannerChime(config.soundEnabled);
  }, [config.soundEnabled]);

  const handleChangeTarget = useCallback(async () => {
    dispatch({ type: "CHANGE_TARGET" });
    setRevealProgress(0);
    await exitAppFullscreen();
  }, []);

  useEffect(() => {
    if (!round.scan.targetRevealed || round.scan.locking) {
      return;
    }
    const started = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const progress = Math.min(1, (now - started) / DUDU_SCANNER_REVEAL_DURATION_MS);
      setRevealProgress(progress);
      if (progress < 1) {
        raf = window.requestAnimationFrame(tick);
      }
    };
    raf = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(raf);
  }, [round.scan.targetRevealed, round.scan.locking, round.phase]);

  const effectiveRevealProgress = round.scan.targetRevealed
    ? round.scan.locking
      ? 1
      : revealProgress
    : 0;

  useEffect(() => {
    if (!round.scan.locking) {
      return;
    }
    const timer = window.setTimeout(() => {
      dispatch({ type: "LOCK_COMPLETE" });
    }, DUDU_SCANNER_LOCK_DURATION_MS);
    return () => window.clearTimeout(timer);
  }, [round.scan.locking]);

  useEffect(() => {
    if (!round.transient) {
      return;
    }
    const timer = window.setTimeout(() => {
      dispatch({ type: "CLEAR_TRANSIENT" });
    }, DUDU_SCANNER_TRANSIENT_DURATION_MS);
    return () => window.clearTimeout(timer);
  }, [round.transient]);

  useEffect(() => {
    if (round.phase !== "scan" && round.phase !== "result") {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (event.key === "1") {
        event.preventDefault();
        dispatch({ type: "REVEAL_TARGET" });
        return;
      }

      if (event.key === "Enter") {
        event.preventDefault();
        dispatch({ type: "LOCK_SIGNAL" });
        return;
      }

      if (event.key === "f" || event.key === "F") {
        event.preventDefault();
        void attemptFullscreen();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [attemptFullscreen, round.phase]);

  const statusKey = round.scan.locking
    ? "locking"
    : round.scan.targetRevealed
      ? "signalDetected"
      : "scanning";

  return (
    <div
      ref={rootRef}
      data-testid="dudu-scanner-app-root"
      className={cn(
        "flex min-h-0 flex-1 flex-col",
        immersive && "fixed inset-0 z-50 overflow-hidden bg-background",
      )}
    >
      {round.phase === "config" ? <DuduScannerConfigShell onStartScan={handleStartScan} /> : null}
      {round.phase === "scan" ? (
        <DuduScannerScanView
          targetId={config.targetId}
          targetRevealed={round.scan.targetRevealed}
          revealProgress={effectiveRevealProgress}
          locking={round.scan.locking}
          transient={round.transient}
          statusKey={statusKey}
        />
      ) : null}
      {round.phase === "result" ? (
        <DuduScannerResultView
          targetId={config.targetId}
          onScanAgain={() => void handleScanAgain()}
          onChangeTarget={() => void handleChangeTarget()}
        />
      ) : null}
    </div>
  );
}
