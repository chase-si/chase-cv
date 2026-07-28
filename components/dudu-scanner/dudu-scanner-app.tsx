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
import { useDuduScannerScanSoundscape } from "@/lib/dudu-scanner/scan-soundscape/use-dudu-scanner-scan-soundscape";
import { useDuduScannerConfig } from "@/lib/dudu-scanner/use-dudu-scanner-config";
import { getTargetRecord, type DuduScannerTargetId } from "@/lib/dudu-scanner/catalog";
import {
  preloadTargetImage,
  resolveTargetDisplaySrc,
} from "@/lib/dudu-scanner/target-asset";
import { cn } from "@/lib/utils";

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
  const [roundUseFallback, setRoundUseFallback] = useState(false);
  const [failedPreloadTargetId, setFailedPreloadTargetId] =
    useState<DuduScannerTargetId | null>(null);
  const immersive = round.phase === "scan" || round.phase === "result";
  const assetLoadWarning = failedPreloadTargetId === config.targetId;
  const roundTargetImageSrc = resolveTargetDisplaySrc(config.targetId, roundUseFallback);

  const { unlockFromUserGesture, handleScanMetrics } = useDuduScannerScanSoundscape({
    soundEnabled: config.soundEnabled,
    phase: round.phase,
    scanPaused: round.scan.paused,
    targetRevealed: round.scan.targetRevealed,
    locking: round.scan.locking,
    targetRevealedKey: `${round.phase}-${round.scan.targetRevealed}`,
    lockingKey: `${round.phase}-${round.scan.locking}`,
  });

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
    const { imageSrc } = getTargetRecord(config.targetId);
    const loaded = await preloadTargetImage(imageSrc);
    setRoundUseFallback(!loaded);
    setFailedPreloadTargetId(loaded ? null : config.targetId);
    dispatch({ type: "START_SCAN" });
    enterImmersiveHistory();
    const ok = await requestAppFullscreen(rootRef.current);
    if (!ok) {
      dispatch({ type: "FULLSCREEN_UNAVAILABLE" });
    }
    void unlockFromUserGesture();
  }, [config.targetId, enterImmersiveHistory, resetRevealProgress, unlockFromUserGesture]);

  const handleScanAgain = useCallback(async () => {
    const { imageSrc } = getTargetRecord(config.targetId);
    const loaded = await preloadTargetImage(imageSrc);
    setRoundUseFallback(!loaded);
    setFailedPreloadTargetId(loaded ? null : config.targetId);
    dispatch({ type: "SCAN_AGAIN" });
    resetRevealProgress();
    await requestAppFullscreen(rootRef.current);
    void unlockFromUserGesture();
  }, [config.targetId, resetRevealProgress, unlockFromUserGesture]);

  const handleChangeTarget = useCallback(async () => {
    dispatch({ type: "CHANGE_TARGET" });
    resetRevealProgress();
    setRoundUseFallback(false);
    setFailedPreloadTargetId(null);
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
        void unlockFromUserGesture();
      }

      if (command.type === "CANCEL_TARGET") {
        resetRevealProgress();
      }

      dispatch(action);
    },
    [attemptFullscreen, config.soundEnabled, resetRevealProgress, round.phase, setSoundEnabled, unlockFromUserGesture],
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
      {round.phase === "config" ? (
        <DuduScannerConfigShell
          onStartScan={handleStartScan}
          assetLoadWarning={assetLoadWarning}
        />
      ) : null}
      {round.phase === "scan" ? (
        <DuduScannerScanView
          targetId={config.targetId}
          targetImageSrc={roundTargetImageSrc}
          targetRevealed={round.scan.targetRevealed}
          revealProgress={effectiveRevealProgress}
          locking={round.scan.locking}
          paused={round.scan.paused}
          transient={round.transient}
          statusKey={statusKey}
          onScanMetrics={handleScanMetrics}
          onDomainCommand={applyDomainCommand}
        />
      ) : null}
      {round.phase === "result" ? (
        <DuduScannerResultView
          targetId={config.targetId}
          targetImageSrc={roundTargetImageSrc}
          onScanAgain={() => void handleScanAgain()}
          onChangeTarget={() => void handleChangeTarget()}
        />
      ) : null}
    </div>
  );
}
