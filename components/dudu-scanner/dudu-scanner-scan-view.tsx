"use client";

import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";

import { DuduScannerFanCanvas } from "@/components/dudu-scanner/dudu-scanner-fan-canvas";
import { DuduScannerOperatorControlBar } from "@/components/dudu-scanner/dudu-scanner-operator-control-bar";
import { type DuduScannerTargetId } from "@/lib/dudu-scanner/catalog";
import {
  DUDU_SCANNER_SHORTCUT_KEYS,
  DUDU_SCANNER_SHORTCUT_LABEL,
} from "@/lib/dudu-scanner/i18n-keys";
import type { DuduScannerRoundTransient } from "@/lib/dudu-scanner/round-state";
import type { DuduScannerScanStage } from "@/lib/dudu-scanner/round-state";
import type { DuduScannerDomainCommand } from "@/lib/dudu-scanner/scanner-commands";
import type { ScannerVisualMetrics } from "@/lib/dudu-scanner/scanner-visual/renderer";
import { usePrefersTouchOperatorControls } from "@/lib/dudu-scanner/use-prefers-touch-operator-controls";
import { Card, CardScrollArea } from "@/components/ui/card";

type DuduScannerScanViewProps = {
  targetId: DuduScannerTargetId;
  targetImageSrc: string;
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
  signalStrength: 0.22,
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
}: DuduScannerScanViewProps) {
  const t = useTranslations("duduScanner");
  const prefersTouchControls = usePrefersTouchOperatorControls();
  const placementSeed = useMemo(
    () => hashTargetSeed(targetId) + placementVersion * 97,
    [placementVersion, targetId],
  );
  const [metrics, setMetrics] = useState<ScannerVisualMetrics>(initialMetrics);
  const [timestamp, setTimestamp] = useState(() => formatHudTimestamp(new Date()));
  const statusKey =
    scanStage === "auto-scan"
      ? "initializing"
      : locking
        ? "locking"
        : targetRevealed
          ? revealComplete
            ? "targetReady"
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

  return (
    <div
      className="flex min-h-0 min-w-0 flex-1 flex-col gap-3 overflow-hidden p-3 sm:gap-4 sm:p-6"
      data-testid="dudu-scanner-scan-view"
    >
      <header className="flex shrink-0 flex-col gap-2 border-b border-border/70 pb-2 sm:gap-3 sm:pb-3 md:flex-row md:items-end md:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {t("scan.hudLabel")}
          </p>
          <p
            className="text-base font-semibold text-foreground sm:text-lg"
            data-testid="dudu-scanner-status"
          >
            {t(`scan.status.${statusKey}`)}
          </p>
        </div>
        <dl
          className="grid min-w-0 grid-cols-2 gap-x-3 gap-y-1 text-[11px] text-muted-foreground sm:grid-cols-4 sm:gap-x-4 sm:text-xs"
          data-testid="dudu-scanner-instrument-hud"
        >
          <div>
            <dt>{t("scan.hud.signal")}</dt>
            <dd className="font-mono text-foreground" data-testid="dudu-scanner-hud-signal">
              {Math.round(metrics.signalStrength * 100)}%
            </dd>
          </div>
          <div>
            <dt>{t("scan.hud.gain")}</dt>
            <dd className="font-mono text-foreground">{metrics.gain.toFixed(2)}</dd>
          </div>
          <div>
            <dt>{t("scan.hud.frequency")}</dt>
            <dd className="font-mono text-foreground">{metrics.scanFrequencyHz.toFixed(2)} Hz</dd>
          </div>
          <div>
            <dt>{t("scan.hud.timestamp")}</dt>
            <dd className="font-mono text-foreground" data-testid="dudu-scanner-hud-timestamp">
              {timestamp}
            </dd>
          </div>
        </dl>
      </header>

      <div className="relative flex min-h-0 min-w-0 flex-1 flex-col gap-3 lg:flex-row lg:gap-4">
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
          hideCursor
          className="min-h-[220px] lg:min-h-0"
          onDiscovery={onDiscovery}
          onMetricsChange={(next) => {
            setMetrics(next);
            setTimestamp(formatHudTimestamp(new Date()));
            onScanMetrics?.(next);
          }}
        />

      </div>

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

      <Card size="sm" className="min-h-0 shrink-0 gap-3 py-4" aria-label={t("shortcutsHeading")}>
        <p className="px-4 text-sm font-medium text-foreground sm:px-6">{t("shortcutsHeading")}</p>
        <CardScrollArea className="max-h-36 px-4 sm:max-h-none sm:px-6">
          <dl className="grid gap-2 pb-1 sm:grid-cols-2">
            {DUDU_SCANNER_SHORTCUT_KEYS.map((shortcutKey) => (
              <div
                key={shortcutKey}
                className="flex min-w-0 items-start justify-between gap-2 text-sm"
              >
                <dt className="shrink-0 font-mono font-medium text-foreground">
                  {DUDU_SCANNER_SHORTCUT_LABEL[shortcutKey]}
                </dt>
                <dd className="text-right text-muted-foreground">{t(`shortcuts.${shortcutKey}`)}</dd>
              </div>
            ))}
          </dl>
        </CardScrollArea>
      </Card>
    </div>
  );
}
