"use client";

import { useCallback, useEffect, useRef } from "react";

import {
  createBrowserAudioContextPort,
  createScanSoundscape,
  type ScanSoundscape,
} from "@/lib/dudu-scanner/scan-soundscape";
import type { DuduScannerRoundPhase } from "@/lib/dudu-scanner/round-state";
import type { DuduScannerScanStage } from "@/lib/dudu-scanner/round-state";
import type { ScannerVisualMetrics } from "@/lib/dudu-scanner/scanner-visual/renderer";

type UseDuduScannerScanSoundscapeArgs = {
  soundEnabled: boolean;
  phase: DuduScannerRoundPhase;
  scanPaused: boolean;
  scanStage: DuduScannerScanStage;
  targetRevealed: boolean;
  locking: boolean;
  targetRevealedKey: string;
  lockingKey: string;
};

export function useDuduScannerScanSoundscape({
  soundEnabled,
  phase,
  scanPaused,
  scanStage,
  targetRevealed,
  locking,
  targetRevealedKey,
  lockingKey,
}: UseDuduScannerScanSoundscapeArgs) {
  const engineRef = useRef<ScanSoundscape | null>(null);
  const prevRevealedRef = useRef(false);
  const prevLockingRef = useRef(false);

  const getEngine = useCallback(() => {
    if (engineRef.current == null) {
      engineRef.current = createScanSoundscape({
        port: createBrowserAudioContextPort(),
      });
    }
    return engineRef.current;
  }, []);

  useEffect(() => {
    return () => {
      engineRef.current?.dispose();
      engineRef.current = null;
    };
  }, []);

  useEffect(() => {
    getEngine().setSoundEnabled(soundEnabled);
  }, [getEngine, soundEnabled]);

  useEffect(() => {
    const engine = getEngine();
    if (locking && !prevLockingRef.current) {
      engine.notifyLock();
    }
    prevLockingRef.current = locking;

    const scanSoundActive = phase === "scan" && !locking;
    engine.setScanActive(scanSoundActive);
    if (phase !== "scan") {
      engine.setProbeVelocity(0);
      prevRevealedRef.current = false;
      prevLockingRef.current = false;
    }
  }, [getEngine, locking, lockingKey, phase]);

  useEffect(() => {
    getEngine().setScanPaused(scanPaused);
  }, [getEngine, scanPaused]);

  useEffect(() => {
    const engine = getEngine();
    if (targetRevealed && !prevRevealedRef.current) {
      engine.notifyReveal();
    }
    if (!targetRevealed && prevRevealedRef.current) {
      engine.cancelTargetCues();
    }
    prevRevealedRef.current = targetRevealed;
  }, [getEngine, targetRevealed, targetRevealedKey]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const onBlur = () => getEngine().handleWindowBlur();
    const onFocus = () => getEngine().handleWindowFocus();
    const onVisibilityChange = () => {
      if (document.hidden) {
        onBlur();
      } else {
        onFocus();
      }
    };
    window.addEventListener("blur", onBlur);
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      window.removeEventListener("blur", onBlur);
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [getEngine]);

  const unlockFromUserGesture = useCallback(() => {
    return getEngine().unlockFromUserGesture();
  }, [getEngine]);

  const handleScanMetrics = useCallback(
    (metrics: ScannerVisualMetrics) => {
      if (phase !== "scan" || scanPaused || locking) {
        return;
      }
      getEngine().setProbeVelocity(metrics.probeVelocity);
      if (scanStage === "search" && metrics.probeInside) {
        getEngine().setProximitySignal(metrics.signalStrength);
      }
    },
    [getEngine, locking, phase, scanPaused, scanStage],
  );

  return { unlockFromUserGesture, handleScanMetrics };
}
