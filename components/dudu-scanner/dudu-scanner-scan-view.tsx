"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";

import { DuduScannerFanCanvas } from "@/components/dudu-scanner/dudu-scanner-fan-canvas";
import { type DuduScannerTargetId } from "@/lib/dudu-scanner/catalog";
import {
  DUDU_SCANNER_SHORTCUT_KEYS,
  DUDU_SCANNER_SHORTCUT_LABEL,
} from "@/lib/dudu-scanner/i18n-keys";
import type { DuduScannerRoundTransient } from "@/lib/dudu-scanner/round-state";
import type { ScannerVisualMetrics } from "@/lib/dudu-scanner/scanner-visual/renderer";
import { cn } from "@/lib/utils";

type DuduScannerScanViewProps = {
  targetId: DuduScannerTargetId;
  targetImageSrc: string;
  targetRevealed: boolean;
  revealProgress: number;
  locking: boolean;
  paused: boolean;
  transient: DuduScannerRoundTransient | null;
  statusKey: "scanning" | "signalDetected" | "locking";
  onScanMetrics?: (metrics: ScannerVisualMetrics) => void;
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
  revealProgress,
  locking,
  paused,
  transient,
  statusKey,
  onScanMetrics,
}: DuduScannerScanViewProps) {
  const t = useTranslations("duduScanner");
  const showTarget = targetRevealed || revealProgress > 0;
  const placementSeed = useMemo(() => hashTargetSeed(targetId), [targetId]);
  const [metrics, setMetrics] = useState<ScannerVisualMetrics>(initialMetrics);
  const [timestamp, setTimestamp] = useState(() => formatHudTimestamp(new Date()));

  return (
    <div
      className="flex min-h-0 flex-1 flex-col gap-4 overflow-hidden p-4 sm:p-6"
      data-testid="dudu-scanner-scan-view"
    >
      <header className="flex shrink-0 flex-col gap-3 border-b border-border/70 pb-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {t("scan.hudLabel")}
          </p>
          <p className="text-lg font-semibold text-foreground" data-testid="dudu-scanner-status">
            {t(`scan.status.${statusKey}`)}
          </p>
        </div>
        <dl
          className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-muted-foreground sm:grid-cols-4"
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

      <div className="relative flex min-h-0 flex-1 flex-col gap-4 lg:flex-row">
        <DuduScannerFanCanvas
          active={!locking && !paused}
          showLockFrame={locking}
          targetRevealed={targetRevealed}
          revealProgress={revealProgress}
          locking={locking}
          placementSeed={placementSeed}
          targetImageSrc={targetImageSrc}
          hideCursor
          className="min-h-[220px] lg:min-h-0"
          onMetricsChange={(next) => {
            setMetrics(next);
            setTimestamp(formatHudTimestamp(new Date()));
            onScanMetrics?.(next);
          }}
        />

        <div className="relative flex w-full shrink-0 items-center justify-center lg:w-48">
          {showTarget ? (
            <div
              className={cn(
                "relative flex size-36 items-center justify-center rounded-2xl border border-primary/40 bg-card shadow-sm transition-opacity duration-300 sm:size-44",
                targetRevealed ? "opacity-100" : "opacity-70",
              )}
              data-testid="dudu-scanner-target-preview"
              style={{ opacity: Math.max(0.15, revealProgress) }}
            >
              <Image
                src={targetImageSrc}
                alt=""
                width={120}
                height={120}
                className="size-24 object-contain grayscale contrast-75 sm:size-28"
              />
            </div>
          ) : (
            <p className="text-center text-sm text-muted-foreground">{t("scan.targetHidden")}</p>
          )}
        </div>
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

      <aside
        className="shrink-0 rounded-2xl border border-border bg-card/90 p-4"
        aria-label={t("shortcutsHeading")}
      >
        <p className="mb-2 text-sm font-medium text-foreground">{t("shortcutsHeading")}</p>
        <dl className="grid gap-2 sm:grid-cols-2">
          {DUDU_SCANNER_SHORTCUT_KEYS.map((shortcutKey) => (
            <div key={shortcutKey} className="flex items-start justify-between gap-3 text-sm">
              <dt className="font-mono font-medium text-foreground">
                {DUDU_SCANNER_SHORTCUT_LABEL[shortcutKey]}
              </dt>
              <dd className="text-right text-muted-foreground">{t(`shortcuts.${shortcutKey}`)}</dd>
            </div>
          ))}
        </dl>
      </aside>
    </div>
  );
}
