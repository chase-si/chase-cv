"use client";

import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";

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
  targetId: DuduScannerTargetId;
  targetImageSrc: string;
  mysteryMode: boolean;
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

export function DuduScannerScanView({
  targetId,
  targetImageSrc,
  mysteryMode,
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
  const targetMessageKey = DUDU_SCANNER_TARGET_MESSAGE_KEY[targetId];
  const placementSeed = useMemo(
    () => hashTargetSeed(targetId) + placementVersion * 97,
    [placementVersion, targetId],
  );
  const [metrics, setMetrics] = useState<ScannerVisualMetrics>(initialMetrics);
  const [timestamp, setTimestamp] = useState(() => formatHudTimestamp(new Date()));
  const statusKey =
    scanStage === "auto-scan"
      ? "initializing"
      : scanStage === "signal-found"
        ? "signalDetected"
      : locking
        ? "locking"
        : targetRevealed
          ? revealComplete
            ? mysteryMode
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
      finaleEyebrow={t("scan.finaleEyebrow")}
      finaleName={t(`targets.${targetMessageKey}.name`)}
      finaleLine={t(`targets.${targetMessageKey}.revealLine`)}
      hideCursor
      className="min-h-[220px] w-full lg:min-h-0"
      onDiscovery={onDiscovery}
      onLockRequest={() => onDomainCommand?.({ type: "LOCK_SIGNAL" })}
      onMetricsChange={(next) => {
        setMetrics(next);
        setTimestamp(formatHudTimestamp(new Date()));
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
      className="flex min-h-0 min-w-0 flex-1 flex-col gap-3 overflow-hidden p-3 sm:gap-4 sm:p-6"
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
      />

      {transient ? (
        <p
          className="shrink-0 rounded-xl border border-border bg-muted/50 px-4 py-2 text-center text-sm text-foreground"
          data-testid="dudu-scanner-transient"
          role="status"
        >
          {transient === "no-signal" ? t("scan.noSignal") : t("scan.fullscreenHint")}
        </p>
      ) : null}

      {prefersTouchControls && onDomainCommand ? (
        <DuduScannerOperatorControlBar paused={paused} onDomainCommand={onDomainCommand} />
      ) : null}

    </div>
  );
}
