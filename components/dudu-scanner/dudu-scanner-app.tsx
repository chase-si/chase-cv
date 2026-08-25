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
import {
  DuduScannerConfigProvider,
  useDuduScannerConfig,
} from "@/lib/dudu-scanner/dudu-scanner-config-provider";
import { type DuduScannerTargetId } from "@/lib/dudu-scanner/catalog";
import { prepareTargetRoundAsset, preloadTargetImage } from "@/lib/dudu-scanner/target-asset";
import { resolveCustomRoundAssetId, resolveRoundTarget } from "@/lib/dudu-scanner/round-target";
import { useDuduScannerCustomLibrary } from "@/lib/dudu-scanner/dudu-scanner-custom-library-provider";
import {
  DUDU_SCANNER_AUTO_SCAN_DURATION_MS,
  DUDU_SCANNER_LOCK_RESULT_DELAY_MS,
} from "@/lib/dudu-scanner/scanner-visual/exploration-model";
import { cn } from "@/lib/utils";

function domainCommandToRoundAction(command: DuduScannerDomainCommand): DuduScannerRoundAction | null {
  switch (command.type) {
    case "TOGGLE_PAUSE":
      return { type: "TOGGLE_PAUSE" };
    case "FORCE_DISCOVERY":
      return { type: "DISCOVER_TARGET" };
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
  return (
    <DuduScannerConfigProvider>
      <DuduScannerAppInner />
    </DuduScannerConfigProvider>
  );
}

function DuduScannerAppInner() {
  const rootRef = useRef<HTMLDivElement>(null);
  const revealEpochRef = useRef(0);
  const { config, setSoundEnabled } = useDuduScannerConfig();
  const customLibrary = useDuduScannerCustomLibrary();
  const [round, dispatch] = useReducer(duduScannerRoundReducer, undefined, createInitialRoundState);
  const [revealProgress, setRevealProgress] = useState(0);
  const [roundAsset, setRoundAsset] = useState<{
    kind: "catalog" | "custom";
    targetId: DuduScannerTargetId;
    customAssetId?: string;
    displaySrc: string;
    concealUntilLock: boolean;
  } | null>(null);
  const [failedPreloadTargetId, setFailedPreloadTargetId] =
    useState<DuduScannerTargetId | null>(null);
  const immersive = round.phase === "scan" || round.phase === "result";
  const assetLoadWarning = failedPreloadTargetId !== null;
  const immersiveTargetId = roundAsset?.kind === "catalog" ? roundAsset.targetId : config.targetId;
  const roundTargetImageSrc = roundAsset?.displaySrc ?? "";
  const mysteryPresentation =
    config.scanMode === "mystery" ||
    (roundAsset?.kind === "custom" && roundAsset.concealUntilLock);

  const { unlockFromUserGesture, handleScanMetrics } = useDuduScannerScanSoundscape({
    soundEnabled: config.soundEnabled,
    phase: round.phase,
    scanPaused: round.scan.paused,
    scanStage: round.scan.stage,
    targetRevealed: round.scan.targetRevealed,
    locking: round.scan.locking,
    targetRevealedKey: `${round.phase}-${round.scan.targetRevealed}`,
    lockingKey: `${round.phase}-${round.scan.locking}`,
    targetId: immersiveTargetId,
    mysteryMode: mysteryPresentation,
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
    if (config.scanMode === "custom") {
      const assetId = resolveCustomRoundAssetId(
        customLibrary.selectedAssetId,
        customLibrary.items.map((item) => item.id),
      );
      const item = customLibrary.items.find((entry) => entry.id === assetId);
      if (!item) {
        return;
      }
      const loaded = await preloadTargetImage(item.objectUrl);
      setRoundAsset({
        kind: "custom",
        targetId: config.targetId,
        customAssetId: item.id,
        displaySrc: item.objectUrl,
        concealUntilLock: customLibrary.selectedAssetId !== item.id,
      });
      setFailedPreloadTargetId(loaded ? null : config.targetId);
      dispatch({ type: "START_SCAN" });
      enterImmersiveHistory();
      const ok = await requestAppFullscreen(rootRef.current);
      if (!ok) {
        dispatch({ type: "FULLSCREEN_UNAVAILABLE" });
      }
      void unlockFromUserGesture();
      return;
    }
    const targetId = resolveRoundTarget(config);
    const prepared = await prepareTargetRoundAsset(targetId);
    setRoundAsset({
      kind: "catalog",
      targetId: prepared.targetId,
      displaySrc: prepared.displaySrc,
      concealUntilLock: config.scanMode === "mystery",
    });
    setFailedPreloadTargetId(prepared.productionLoaded ? null : prepared.targetId);
    dispatch({ type: "START_SCAN" });
    enterImmersiveHistory();
    const ok = await requestAppFullscreen(rootRef.current);
    if (!ok) {
      dispatch({ type: "FULLSCREEN_UNAVAILABLE" });
    }
    void unlockFromUserGesture();
  }, [
    config,
    customLibrary.items,
    customLibrary.selectedAssetId,
    enterImmersiveHistory,
    resetRevealProgress,
    unlockFromUserGesture,
  ]);

  const handleScanAgain = useCallback(async () => {
    if (config.scanMode === "custom") {
      const assetId = resolveCustomRoundAssetId(
        customLibrary.selectedAssetId,
        customLibrary.items.map((item) => item.id),
        Math.random,
        roundAsset?.customAssetId,
      );
      const item = customLibrary.items.find((entry) => entry.id === assetId);
      if (!item) {
        return;
      }
      const loaded = await preloadTargetImage(item.objectUrl);
      setRoundAsset({
        kind: "custom",
        targetId: config.targetId,
        customAssetId: item.id,
        displaySrc: item.objectUrl,
        concealUntilLock: customLibrary.selectedAssetId !== item.id,
      });
      setFailedPreloadTargetId(loaded ? null : config.targetId);
      dispatch({ type: "SCAN_AGAIN" });
      resetRevealProgress();
      await requestAppFullscreen(rootRef.current);
      void unlockFromUserGesture();
      return;
    }
    const targetId = resolveRoundTarget(config, Math.random, roundAsset?.targetId);
    const prepared = await prepareTargetRoundAsset(targetId);
    setRoundAsset({
      kind: "catalog",
      targetId: prepared.targetId,
      displaySrc: prepared.displaySrc,
      concealUntilLock: config.scanMode === "mystery",
    });
    setFailedPreloadTargetId(prepared.productionLoaded ? null : prepared.targetId);
    dispatch({ type: "SCAN_AGAIN" });
    resetRevealProgress();
    await requestAppFullscreen(rootRef.current);
    void unlockFromUserGesture();
  }, [
    config,
    customLibrary.items,
    customLibrary.selectedAssetId,
    resetRevealProgress,
    roundAsset?.customAssetId,
    roundAsset?.targetId,
    unlockFromUserGesture,
  ]);

  const handleChangeTarget = useCallback(async () => {
    dispatch({ type: "CHANGE_TARGET" });
    resetRevealProgress();
    setRoundAsset(null);
    setFailedPreloadTargetId(null);
    leaveImmersiveHistory();
    await exitAppFullscreen();
  }, [leaveImmersiveHistory, resetRevealProgress]);

  const handleBackToConfig = useCallback(async () => {
    dispatch({ type: "RETURN_TO_CONFIG" });
    resetRevealProgress();
    setRoundAsset(null);
    setFailedPreloadTargetId(null);
    leaveImmersiveHistory();
    await exitAppFullscreen();
  }, [leaveImmersiveHistory, resetRevealProgress]);

  const returnToConfigFromSession = useCallback(async () => {
    await handleBackToConfig();
  }, [handleBackToConfig]);

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
    if (round.phase !== "scan" || round.scan.stage !== "auto-scan") {
      return;
    }
    const timer = window.setTimeout(() => {
      dispatch({ type: "AUTO_SCAN_COMPLETE" });
    }, DUDU_SCANNER_AUTO_SCAN_DURATION_MS);
    return () => window.clearTimeout(timer);
  }, [round.phase, round.scan.placementVersion, round.scan.stage]);

  useEffect(() => {
    if (round.phase === "scan" && round.scan.stage === "signal-found") {
      dispatch({ type: "BEGIN_TARGET_REVEAL" });
    }
  }, [round.phase, round.scan.stage]);

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
      } else {
        dispatch({ type: "REVEAL_COMPLETE" });
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
    }, DUDU_SCANNER_LOCK_RESULT_DELAY_MS);
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

  return (
    <div
      ref={rootRef}
      data-testid="dudu-scanner-app-root"
      google-side-rail-overlap={immersive ? "false" : undefined}
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
          targetId={roundAsset?.customAssetId ?? immersiveTargetId}
          catalogTargetId={roundAsset?.kind === "catalog" ? immersiveTargetId : undefined}
          targetImageSrc={roundTargetImageSrc}
          mysteryMode={mysteryPresentation}
          customRound={roundAsset?.kind === "custom"}
          targetRevealed={round.scan.targetRevealed}
          revealComplete={round.scan.revealComplete}
          revealProgress={effectiveRevealProgress}
          locking={round.scan.locking}
          paused={round.scan.paused}
          scanStage={round.scan.stage}
          placementVersion={round.scan.placementVersion}
          transient={round.transient}
          onScanMetrics={handleScanMetrics}
          onDiscovery={() => dispatch({ type: "DISCOVER_TARGET" })}
          onDomainCommand={applyDomainCommand}
          onBack={() => void handleBackToConfig()}
        />
      ) : null}
      {round.phase === "result" ? (
        <DuduScannerResultView
          targetId={roundAsset?.kind === "catalog" ? immersiveTargetId : undefined}
          targetImageSrc={roundTargetImageSrc}
          customRound={roundAsset?.kind === "custom"}
          onScanAgain={() => void handleScanAgain()}
          onChangeTarget={() => void handleChangeTarget()}
          onBack={() => void handleBackToConfig()}
        />
      ) : null}
    </div>
  );
}
