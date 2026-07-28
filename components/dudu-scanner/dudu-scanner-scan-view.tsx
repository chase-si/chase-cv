"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

import { DuduScannerFanCanvas } from "@/components/dudu-scanner/dudu-scanner-fan-canvas";
import { getTargetRecord, type DuduScannerTargetId } from "@/lib/dudu-scanner/catalog";
import {
  DUDU_SCANNER_SHORTCUT_KEYS,
  DUDU_SCANNER_SHORTCUT_LABEL,
} from "@/lib/dudu-scanner/i18n-keys";
import type { DuduScannerRoundTransient } from "@/lib/dudu-scanner/round-state";
import { cn } from "@/lib/utils";

type DuduScannerScanViewProps = {
  targetId: DuduScannerTargetId;
  targetRevealed: boolean;
  revealProgress: number;
  locking: boolean;
  paused: boolean;
  transient: DuduScannerRoundTransient | null;
  statusKey: "scanning" | "signalDetected" | "locking";
};

export function DuduScannerScanView({
  targetId,
  targetRevealed,
  revealProgress,
  locking,
  paused,
  transient,
  statusKey,
}: DuduScannerScanViewProps) {
  const t = useTranslations("duduScanner");
  const { imageSrc } = getTargetRecord(targetId);
  const showTarget = targetRevealed || revealProgress > 0;

  return (
    <div
      className="flex min-h-0 flex-1 flex-col gap-4 overflow-hidden p-4 sm:p-6"
      data-testid="dudu-scanner-scan-view"
    >
      <header className="flex shrink-0 items-center justify-between gap-4 border-b border-border/70 pb-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {t("scan.hudLabel")}
          </p>
          <p className="text-lg font-semibold text-foreground" data-testid="dudu-scanner-status">
            {t(`scan.status.${statusKey}`)}
          </p>
        </div>
        <p className="max-w-[12rem] text-right text-xs text-muted-foreground">{t("scan.hudHint")}</p>
      </header>

      <div className="relative flex min-h-0 flex-1 flex-col gap-4 lg:flex-row">
        <DuduScannerFanCanvas
          active={!locking && !paused}
          showLockFrame={locking}
          className="min-h-[220px] lg:min-h-0"
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
              <Image src={imageSrc} alt="" width={120} height={120} className="size-24 object-contain sm:size-28" />
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
