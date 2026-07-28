"use client";

import { Activity, Clock3, SlidersHorizontal, Zap } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { DuduScannerShortcutDeck } from "@/components/dudu-scanner/dudu-scanner-shortcut-deck";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { ScannerVisualMetrics } from "@/lib/dudu-scanner/scanner-visual/renderer";
import { cn } from "@/lib/utils";

const STRONG_SIGNAL_THRESHOLD = 0.9;

function InstrumentValue({
  icon,
  label,
  value,
  primary = false,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  primary?: boolean;
}) {
  return (
    <div
      className={cn(
        "min-w-0 rounded-xl border px-3 py-2",
        primary ? "border-primary bg-primary/10" : "border-border bg-muted/40",
      )}
    >
      <dt className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        {icon}
        {label}
      </dt>
      <dd
        className={cn(
          "mt-1 truncate font-mono text-sm font-bold tabular-nums",
          primary ? "text-primary" : "text-foreground",
        )}
      >
        {value}
      </dd>
    </div>
  );
}

export function DuduScannerInstrumentPanel({
  backButton,
  canvas,
  metrics,
  status,
  timestamp,
  interactionHint,
}: {
  backButton: ReactNode;
  canvas: ReactNode;
  metrics: ScannerVisualMetrics;
  status: string;
  timestamp: string;
  interactionHint?: string | null;
}) {
  const t = useTranslations("duduScanner");
  const signalPercent = Math.round(metrics.signalStrength * 100);
  const strongSignal = metrics.signalStrength >= STRONG_SIGNAL_THRESHOLD;

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-3">
      <header className="flex shrink-0 items-center gap-3">
        {backButton}
        <div className="min-w-0 flex-1 border-l-4 border-primary pl-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            {t("scan.hudLabel")}
          </p>
          <p
            className="truncate text-sm font-bold text-foreground sm:text-base"
            data-testid="dudu-scanner-status"
          >
            {status}
          </p>
        </div>
      </header>

      <div className="relative flex min-h-[220px] min-w-0 flex-1">
        {canvas}
        {interactionHint ? (
          <p
            className="pointer-events-none absolute inset-x-3 bottom-3 rounded-xl border border-primary/60 bg-background/90 px-3 py-2 text-center text-xs font-semibold text-foreground shadow-sm backdrop-blur"
            data-testid="dudu-scanner-lock-hint"
            role="status"
          >
            {interactionHint}
          </p>
        ) : null}
      </div>

      <Card
        size="sm"
        className="shrink-0 gap-3 border-primary/60 py-3"
        aria-label={t("shortcutsHeading")}
      >
        <div className="grid items-center gap-3 px-4 md:grid-cols-[minmax(11rem,0.7fr)_minmax(0,1.3fr)]">
          <div className="grid grid-cols-[auto_1fr] items-center gap-x-3">
            <div
              data-testid="dudu-scanner-signal-icon"
              className={cn(
                "row-span-2 flex size-14 items-center justify-center rounded-2xl border shadow-xs transition-colors",
                strongSignal
                  ? "border-chart-2 bg-chart-2 text-foreground"
                  : "border-primary bg-primary text-primary-foreground",
              )}
            >
              <Zap className="size-6" aria-hidden />
            </div>
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                {t("scan.hud.signal")}
              </span>
              <span
                className="font-mono text-2xl font-black text-primary tabular-nums"
                data-testid="dudu-scanner-hud-signal"
              >
                {signalPercent}%
              </span>
            </div>
            <Progress
              value={signalPercent}
              data-testid="dudu-scanner-signal-progress"
              className={cn(
                "[&_[data-slot=progress-track]]:h-2",
                strongSignal && "[&_[data-slot=progress-indicator]]:bg-chart-2",
              )}
            />
          </div>

          <dl
            className="grid grid-cols-3 gap-2"
            data-testid="dudu-scanner-instrument-hud"
          >
            <InstrumentValue
              icon={<SlidersHorizontal className="size-3" aria-hidden />}
              label={t("scan.hud.gain")}
              value={metrics.gain.toFixed(2)}
              primary
            />
            <InstrumentValue
              icon={<Activity className="size-3" aria-hidden />}
              label={t("scan.hud.frequency")}
              value={`${metrics.scanFrequencyHz.toFixed(2)} Hz`}
            />
            <InstrumentValue
              icon={<Clock3 className="size-3" aria-hidden />}
              label={t("scan.hud.timestamp")}
              value={timestamp}
            />
          </dl>
        </div>

        <DuduScannerShortcutDeck className="border-t border-border px-4 pt-3" />
      </Card>
    </div>
  );
}
