"use client";

import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";

import { DuduScannerBackButton } from "@/components/dudu-scanner/dudu-scanner-back-button";
import { DuduScannerFanCanvas } from "@/components/dudu-scanner/dudu-scanner-fan-canvas";
import { DuduScannerInstrumentPanel } from "@/components/dudu-scanner/dudu-scanner-instrument-panel";
import { DuduScannerOperatorControlBar } from "@/components/dudu-scanner/dudu-scanner-operator-control-bar";
import { type DuduScannerTargetId } from "@/lib/dudu-scanner/catalog";
import { DUDU_SCANNER_TARGET_MESSAGE_KEY } from "@/lib/dudu-scanner/i18n-keys";
import type { DuduScannerRoundTransient } from "@/lib/dudu-scanner/round-state";
import type { DuduScannerScanStage } from "@/lib/dudu-scanner/round-state";
import type { DuduScannerDomainCommand } from "@/lib/dudu-scanner/scanner-commands";
import type { ScannerVisualMetrics } from "@/lib/dudu-scanner/scanner-visual/renderer";
import { usePrefersTouchOperatorControls } from "@/lib/dudu-scanner/use-prefers-touch-operator-controls";

type DuduScannerScanViewProps = {
  targetId: string;
  catalogTargetId?: DuduScannerTargetId;
  targetImageSrc: string;
  mysteryMode: boolean;
  customRound?: boolean;
  targetRevealed: boolean;
  revealComplete: boolean;
  revealProgress: number;
  locking: boolean;
  paused: boolean;
  scanStage: DuduScannerScanStage;
  placementVersion: number;
  transient: DuduScannerRoundTransient | null;
  onScanMetrics?: (metrics: ScannerVisualMetrics) => void;
  onDiscovery?: () => void;
  onDomainCommand?: (command: DuduScannerDomainCommand) => void;
  onBack?: () => void;
};

function hashTargetSeed(targetId: string): number {
  let hash = 0;
  for (let index = 0; index < targetId.length; index += 1) {
    hash = (hash << 5) - hash + targetId.charCodeAt(index);
    hash |= 0;
  }
  return Math.abs(hash) + 1;
}

function formatHudTimestamp(now: Date): string {
  return now.toISOString().slice(11, 19);
}

const initialMetrics: ScannerVisualMetrics = {
  signalStrength: 0,
  signalBand: "weak",
  probeInside: false,
  probeHasEntered: false,
  dwellProgress: 0,
  roundElapsedMs: 0,
  spotlightVisible: false,
  spotlightRadius: 100,
  probeVelocity: 0,
  textureOffsetX: 0,
  textureOffsetY: 0,
  scanLineBias: 0,
  gain: 0.5,
  scanFrequencyHz: 0.9,
};

function scannerMetricsAffectHud(
  previous: ScannerVisualMetrics,
  next: ScannerVisualMetrics,
): boolean {
  return (
    Math.round(previous.signalStrength * 100) !== Math.round(next.signalStrength * 100) ||
    previous.signalBand !== next.signalBand ||
    previous.probeInside !== next.probeInside ||
    previous.probeHasEntered !== next.probeHasEntered
  );
}

export function DuduScannerScanView({
  targetId,
  catalogTargetId,
  targetImageSrc,
  mysteryMode,
  customRound = false,
  targetRevealed,
  revealComplete,
  revealProgress,
  locking,
  paused,
  scanStage,
  placementVersion,
  transient,
  onScanMetrics,
  onDiscovery,
  onDomainCommand,
  onBack,
}: DuduScannerScanViewProps) {
  const t = useTranslations("duduScanner");
  const prefersTouchControls = usePrefersTouchOperatorControls();
  const targetMessageKey = catalogTargetId
    ? DUDU_SCANNER_TARGET_MESSAGE_KEY[catalogTargetId]
    : null;
  const placementSeed = useMemo(
    () => hashTargetSeed(targetId) + placementVersion * 97,
    [placementVersion, targetId],
  );
  const [metrics, setMetrics] = useState<ScannerVisualMetrics>(initialMetrics);
  const [timestamp, setTimestamp] = useState(() => formatHudTimestamp(new Date()));

  useEffect(() => {
    const timer = window.setInterval(() => {
      setTimestamp(formatHudTimestamp(new Date()));
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);
  const statusKey =
    scanStage === "auto-scan"
      ? "initializing"
      : scanStage === "signal-found"
        ? "signalDetected"
      : locking
        ? "locking"
        : targetRevealed
          ? revealComplete
            ? customRound
              ? "customReady"
              : mysteryMode
                ? "mysteryReady"
                : "targetReady"
            : "signalDetected"
          : !metrics.probeInside
            ? metrics.probeHasEntered
              ? "probeOutside"
              : "moveProbe"
            : metrics.signalBand === "strong"
              ? "signalStrong"
              : metrics.signalBand === "medium"
                ? "signalMedium"
                : "signalWeak";

  const canvas = (
    <DuduScannerFanCanvas
      active={!locking && !paused}
      showLockFrame={locking}
      targetRevealed={targetRevealed}
      revealProgress={revealProgress}
      locking={locking}
      placementSeed={placementSeed}
      explorationEnabled={
        scanStage !== "auto-scan" && scanStage !== "idle" && !paused && !locking
      }
      targetImageSrc={targetImageSrc}
      mysteryMode={mysteryMode}
      finaleEyebrow={customRound ? t("result.eyebrow") : t("scan.finaleEyebrow")}
      finaleName={
        customRound || !targetMessageKey ? t("result.title") : t(`targets.${targetMessageKey}.name`)
      }
      finaleLine={
        customRound || !targetMessageKey ? undefined : t(`targets.${targetMessageKey}.revealLine`)
      }
      hideCursor
      className="min-h-[220px] w-full max-lg:rounded-none max-lg:border-x-0 lg:min-h-0"
      onDiscovery={onDiscovery}
      onLockRequest={() => onDomainCommand?.({ type: "LOCK_SIGNAL" })}
      onMetricsChange={(next) => {
        setMetrics((previous) => (scannerMetricsAffectHud(previous, next) ? next : previous));
        onScanMetrics?.(next);
      }}
    />
  );
  const displayMetrics =
    scanStage === "auto-scan"
      ? { ...metrics, signalStrength: 0, signalBand: "weak" as const }
      : metrics;

  return (
    <div
      className="flex min-h-0 min-w-0 flex-1 flex-col gap-3 overflow-hidden px-0 py-3 sm:gap-4 sm:p-6"
      data-testid="dudu-scanner-scan-view"
    >
      <DuduScannerInstrumentPanel
        backButton={onBack ? <DuduScannerBackButton onClick={onBack} /> : null}
        canvas={canvas}
        metrics={displayMetrics}
        status={t(`scan.status.${statusKey}`)}
        timestamp={timestamp}
        interactionHint={
          targetRevealed && revealComplete && !locking && !prefersTouchControls
            ? t("scan.doubleClickLockHint")
            : null
        }
        showShortcutDeck={!prefersTouchControls}
      />

      {transient ? (
        <p
          className="mx-3 shrink-0 rounded-xl border border-border bg-muted/50 px-4 py-2 text-center text-sm text-foreground sm:mx-0"
          data-testid="dudu-scanner-transient"
          role="status"
        >
          {transient === "no-signal" ? t("scan.noSignal") : t("scan.fullscreenHint")}
        </p>
      ) : null}

      {prefersTouchControls && onDomainCommand ? (
        <DuduScannerOperatorControlBar
          className="px-3 sm:px-0"
          paused={paused}
          targetRevealed={targetRevealed}
          onDomainCommand={onDomainCommand}
        />
      ) : null}

    </div>
  );
}
