"use client";

import { useCallback, useEffect, useRef } from "react";

import {
  createBrowserAudioContextPort,
  createScanSoundscape,
  signalStrengthToProbeVelocity,
  type ScanSoundscape,
} from "@/lib/dudu-scanner/scan-soundscape";
import type { DuduScannerRoundPhase } from "@/lib/dudu-scanner/round-state";
import type { ScannerVisualMetrics } from "@/lib/dudu-scanner/scanner-visual/renderer";

type UseDuduScannerScanSoundscapeArgs = {
  soundEnabled: boolean;
  phase: DuduScannerRoundPhase;
  scanPaused: boolean;
  targetRevealed: boolean;
  locking: boolean;
  targetRevealedKey: string;
  lockingKey: string;
};

export function useDuduScannerScanSoundscape({
  soundEnabled,
  phase,
  scanPaused,
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
    const scanActive = phase === "scan";
    engine.setScanActive(scanActive);
    if (!scanActive) {
      engine.setProbeVelocity(0);
      if (phase !== "result") {
        prevRevealedRef.current = false;
        prevLockingRef.current = false;
      }
    }
  }, [getEngine, phase]);

  useEffect(() => {
    getEngine().setScanPaused(scanPaused);
  }, [getEngine, scanPaused]);

  useEffect(() => {
    const engine = getEngine();
    if (targetRevealed && !prevRevealedRef.current) {
      engine.notifyReveal();
    }
    prevRevealedRef.current = targetRevealed;
  }, [getEngine, targetRevealed, targetRevealedKey]);

  useEffect(() => {
    const engine = getEngine();
    if (locking && !prevLockingRef.current) {
      engine.notifyLock();
    }
    prevLockingRef.current = locking;
  }, [getEngine, locking, lockingKey]);

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }
    const onVisibility = () => {
      if (document.visibilityState === "hidden") {
        getEngine().handleWindowBlur();
      } else {
        getEngine().handleWindowFocus();
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    onVisibility();
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [getEngine]);

  const unlockFromUserGesture = useCallback(() => {
    return getEngine().unlockFromUserGesture();
  }, [getEngine]);

  const handleScanMetrics = useCallback(
    (metrics: ScannerVisualMetrics) => {
      if (phase !== "scan" || scanPaused || locking) {
        return;
      }
      getEngine().setProbeVelocity(signalStrengthToProbeVelocity(metrics.signalStrength));
    },
    [getEngine, locking, phase, scanPaused],
  );

  return { unlockFromUserGesture, handleScanMetrics };
}
