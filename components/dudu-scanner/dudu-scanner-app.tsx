"use client";

import { useCallback, useEffect, useReducer, useRef, useState } from "react";

import { DuduScannerConfigShell } from "@/components/dudu-scanner/dudu-scanner-config-shell";
import { DuduScannerResultView } from "@/components/dudu-scanner/dudu-scanner-result-view";
import { DuduScannerScanView } from "@/components/dudu-scanner/dudu-scanner-scan-view";
import { exitAppFullscreen, requestAppFullscreen } from "@/lib/dudu-scanner/fullscreen";
import {
  clearImmersiveHistoryEntry,
  clearImmersiveSessionMarker,
  pushImmersiveHistoryEntry,
  shouldHandleScannerPopState,
  syncImmersiveSessionMarker,
} from "@/lib/dudu-scanner/round-session";
import {
  createInitialRoundState,
  DUDU_SCANNER_LOCK_DURATION_MS,
  DUDU_SCANNER_REVEAL_DURATION_MS,
  DUDU_SCANNER_TRANSIENT_DURATION_MS,
  duduScannerRoundReducer,
  type DuduScannerRoundAction,
} from "@/lib/dudu-scanner/round-state";
import {
  isDomainCommandAllowedInPhase,
  keyboardEventToDomainCommand,
  shouldPreventDefaultForScannerKey,
  type DuduScannerDomainCommand,
} from "@/lib/dudu-scanner/scanner-commands";
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

function domainCommandToRoundAction(command: DuduScannerDomainCommand): DuduScannerRoundAction | null {
  switch (command.type) {
    case "TOGGLE_PAUSE":
      return { type: "TOGGLE_PAUSE" };
    case "REVEAL_TARGET":
      return { type: "REVEAL_TARGET" };
    case "LOCK_SIGNAL":
      return { type: "LOCK_SIGNAL" };
    case "CANCEL_TARGET":
      return { type: "CANCEL_TARGET" };
    case "RESTART_SCAN":
      return { type: "RESTART_SCAN" };
    case "TOGGLE_SOUND":
    case "RETRY_FULLSCREEN":
      return null;
    default: {
      const _exhaustive: never = command;
      return _exhaustive;
    }
  }
}

export function DuduScannerApp() {
  const rootRef = useRef<HTMLDivElement>(null);
  const revealEpochRef = useRef(0);
  const { config, setSoundEnabled } = useDuduScannerConfig();
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

  const resetRevealProgress = useCallback(() => {
    revealEpochRef.current += 1;
    setRevealProgress(0);
  }, []);

  const enterImmersiveHistory = useCallback(() => {
    if (typeof window === "undefined") {
      return;
    }
    pushImmersiveHistoryEntry(window.history, window.location.href);
  }, []);

  const leaveImmersiveHistory = useCallback(() => {
    if (typeof window === "undefined") {
      return;
    }
    clearImmersiveHistoryEntry(window.history, window.location.href);
  }, []);

  const handleStartScan = useCallback(async () => {
    resetRevealProgress();
    dispatch({ type: "START_SCAN" });
    enterImmersiveHistory();
    const ok = await requestAppFullscreen(rootRef.current);
    if (!ok) {
      dispatch({ type: "FULLSCREEN_UNAVAILABLE" });
    }
    playScannerChime(config.soundEnabled);
  }, [config.soundEnabled, enterImmersiveHistory, resetRevealProgress]);

  const handleScanAgain = useCallback(async () => {
    dispatch({ type: "SCAN_AGAIN" });
    resetRevealProgress();
    await requestAppFullscreen(rootRef.current);
    playScannerChime(config.soundEnabled);
  }, [config.soundEnabled, resetRevealProgress]);

  const handleChangeTarget = useCallback(async () => {
    dispatch({ type: "CHANGE_TARGET" });
    resetRevealProgress();
    leaveImmersiveHistory();
    await exitAppFullscreen();
  }, [leaveImmersiveHistory, resetRevealProgress]);

  const returnToConfigFromSession = useCallback(async () => {
    dispatch({ type: "RETURN_TO_CONFIG" });
    resetRevealProgress();
    await exitAppFullscreen();
  }, [resetRevealProgress]);

  const applyDomainCommand = useCallback(
    (command: DuduScannerDomainCommand) => {
      if (!isDomainCommandAllowedInPhase(command, round.phase)) {
        return;
      }

      if (command.type === "TOGGLE_SOUND") {
        setSoundEnabled(!config.soundEnabled);
        return;
      }

      if (command.type === "RETRY_FULLSCREEN") {
        void attemptFullscreen();
        return;
      }

      const action = domainCommandToRoundAction(command);
      if (!action) {
        return;
      }

      if (command.type === "RESTART_SCAN") {
        resetRevealProgress();
        playScannerChime(config.soundEnabled);
      }

      if (command.type === "CANCEL_TARGET") {
        resetRevealProgress();
      }

      dispatch(action);
    },
    [attemptFullscreen, config.soundEnabled, resetRevealProgress, round.phase, setSoundEnabled],
  );

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    clearImmersiveSessionMarker(window.sessionStorage);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    syncImmersiveSessionMarker(window.sessionStorage, round.phase);
  }, [round.phase]);

  useEffect(() => {
    if (!round.scan.targetRevealed || round.scan.locking || round.scan.paused) {
      return;
    }
    const epoch = revealEpochRef.current;
    const started = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      if (epoch !== revealEpochRef.current) {
        return;
      }
      const progress = Math.min(1, (now - started) / DUDU_SCANNER_REVEAL_DURATION_MS);
      setRevealProgress(progress);
      if (progress < 1) {
        raf = window.requestAnimationFrame(tick);
      }
    };
    raf = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(raf);
  }, [round.scan.targetRevealed, round.scan.locking, round.scan.paused, round.phase]);

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
    if (typeof document === "undefined") {
      return;
    }
    const onFullscreenChange = () => {
      if (!document.fullscreenElement && round.phase === "scan") {
        dispatch({ type: "FULLSCREEN_UNAVAILABLE" });
      }
    };
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, [round.phase]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const onPopState = () => {
      if (shouldHandleScannerPopState(round.phase)) {
        void returnToConfigFromSession();
      }
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [returnToConfigFromSession, round.phase]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }

      const command = keyboardEventToDomainCommand(event.key);
      if (!command) {
        return;
      }

      if (!isDomainCommandAllowedInPhase(command, round.phase)) {
        return;
      }

      if (shouldPreventDefaultForScannerKey(event.key)) {
        event.preventDefault();
      }

      applyDomainCommand(command);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [applyDomainCommand, round.phase]);

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
          paused={round.scan.paused}
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
