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
    const immersive = phase === "scan" || phase === "result";
    engine.setScanActive(immersive);
    if (!immersive) {
      engine.setProbeVelocity(0);
      prevRevealedRef.current = false;
      prevLockingRef.current = false;
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
    if (typeof window === "undefined") {
      return;
    }
    const onBlur = () => getEngine().handleWindowBlur();
    const onFocus = () => getEngine().handleWindowFocus();
    window.addEventListener("blur", onBlur);
    window.addEventListener("focus", onFocus);
    return () => {
      window.removeEventListener("blur", onBlur);
      window.removeEventListener("focus", onFocus);
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
      getEngine().setProbeVelocity(signalStrengthToProbeVelocity(metrics.signalStrength));
    },
    [getEngine, locking, phase, scanPaused],
  );

  return { unlockFromUserGesture, handleScanMetrics };
}
