"use client";

import Image from "next/image";
import { ScanSearch, SlidersHorizontal } from "lucide-react";
import { useTranslations } from "next-intl";

import { DuduScannerShortcutDeck } from "@/components/dudu-scanner/dudu-scanner-shortcut-deck";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  DUDU_SCANNER_THEME_IDS,
  getTargetIdsForTheme,
  getTargetRecord,
  type DuduScannerScanMode,
  type DuduScannerThemeId,
} from "@/lib/dudu-scanner/catalog";
import {
  DUDU_SCANNER_TARGET_MESSAGE_KEY,
  DUDU_SCANNER_THEME_MESSAGE_KEY,
} from "@/lib/dudu-scanner/i18n-keys";
import { useDuduScannerConfig } from "@/lib/dudu-scanner/use-dudu-scanner-config";
import { cn } from "@/lib/utils";

export function DuduScannerConfigShell({
  onStartScan,
  assetLoadWarning = false,
}: {
  onStartScan?: () => void;
  assetLoadWarning?: boolean;
}) {
  const t = useTranslations("duduScanner");
  const { config, setScanMode, setThemeId, setTargetId, setSoundEnabled } =
    useDuduScannerConfig();
  const visibleTargets = getTargetIdsForTheme(config.themeId);

  return (
    <main
      className="mx-auto flex w-full max-w-6xl min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-4 py-3 sm:px-6 sm:py-4 lg:overflow-hidden"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-[1.65rem]">
            {t("title")}
          </h1>
          <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
          {assetLoadWarning ? (
            <p
              className="rounded-xl border border-border bg-muted/50 px-3 py-2 text-xs text-foreground sm:text-sm"
              role="status"
              data-testid="dudu-scanner-asset-warning"
            >
              {t("assetLoadWarning")}
            </p>
          ) : null}
        </div>
        <Button type="button" size="lg" className="w-full shrink-0 sm:w-auto" onClick={onStartScan}>
          {t("startScan")}
        </Button>
      </div>

      <div className="grid gap-3 lg:min-h-0 lg:flex-1 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:items-stretch">
        <Card className="flex flex-col overflow-hidden lg:min-h-0">
          <CardHeader className="gap-1 border-b border-border px-4 py-3">
            <CardTitle className="text-base">{t("themesHeading")}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 px-4 py-3 lg:min-h-0">
            <div className="space-y-2">
              <h2 className="text-sm font-medium text-foreground">{t("scanModeHeading")}</h2>
              <div className="grid gap-2 sm:grid-cols-2">
                {(["operator", "mystery"] as const).map((scanMode) => {
                  const selected = config.scanMode === scanMode;
                  const Icon = scanMode === "mystery" ? ScanSearch : SlidersHorizontal;
                  return (
                    <Button
                      key={scanMode}
                      type="button"
                      variant={selected ? "default" : "outline"}
                      aria-pressed={selected}
                      aria-label={t(`scanModes.${scanMode}.name`)}
                      className="h-auto min-h-16 items-start justify-start whitespace-normal px-3 py-2.5 text-left"
                      onClick={() => setScanMode(scanMode as DuduScannerScanMode)}
                    >
                      <Icon className="mt-0.5 size-4 shrink-0" aria-hidden />
                      <span className="min-w-0">
                        <span className="block font-semibold">
                          {t(`scanModes.${scanMode}.name`)}
                        </span>
                        <span
                          className={cn(
                            "mt-0.5 block text-xs font-normal",
                            selected ? "text-primary-foreground/80" : "text-muted-foreground",
                          )}
                        >
                          {t(`scanModes.${scanMode}.description`)}
                        </span>
                      </span>
                    </Button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {DUDU_SCANNER_THEME_IDS.map((themeId) => {
                const messageKey = DUDU_SCANNER_THEME_MESSAGE_KEY[themeId];
                const selected = config.themeId === themeId;
                return (
                  <Button
                    key={themeId}
                    type="button"
                    size="sm"
                    variant={selected ? "default" : "outline"}
                    aria-pressed={selected}
                    onClick={() => setThemeId(themeId as DuduScannerThemeId)}
                  >
                    {t(`themes.${messageKey}`)}
                  </Button>
                );
              })}
            </div>

            {config.scanMode === "operator" ? (
              <div className="min-h-0 space-y-2">
                <h2 className="text-sm font-medium text-foreground">{t("targetsHeading")}</h2>
                <div className="grid gap-2 sm:grid-cols-3">
                  {visibleTargets.map((targetId) => {
                    const messageKey = DUDU_SCANNER_TARGET_MESSAGE_KEY[targetId];
                    const selected = config.targetId === targetId;
                    const { imageSrc } = getTargetRecord(targetId);
                    return (
                      <button
                        key={targetId}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => setTargetId(targetId)}
                        className={cn(
                          "flex flex-col items-center gap-2 rounded-xl border bg-card p-2.5 text-left shadow-xs transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30",
                          selected
                            ? "border-primary ring-2 ring-primary/20"
                            : "border-border hover:bg-muted/40",
                        )}
                      >
                        <div className="relative flex size-16 items-center justify-center rounded-xl border border-border bg-muted/30 sm:size-18">
                          <Image
                            src={imageSrc}
                            alt=""
                            width={56}
                            height={56}
                            className="size-12 object-contain sm:size-14"
                          />
                        </div>
                        <span className="w-full text-center text-xs font-medium text-foreground sm:text-sm">
                          {t(`targets.${messageKey}.name`)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div
                className="flex min-h-32 flex-1 items-center gap-4 rounded-2xl border border-dashed border-primary/50 bg-primary/5 px-4 py-5"
                data-testid="dudu-scanner-mystery-summary"
              >
                <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10 text-primary shadow-xs">
                  <ScanSearch className="size-7" aria-hidden />
                </div>
                <div className="min-w-0">
                  <h2 className="font-semibold text-foreground">{t("mysterySummary.title")}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {t("mysterySummary.description")}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex flex-col gap-3 lg:min-h-0">
          <Card className="overflow-hidden">
            <CardContent className="flex items-center justify-between gap-4 px-4 py-3">
              <div className="min-w-0 space-y-0.5">
                <p className="text-sm font-medium text-foreground">{t("soundLabel")}</p>
                <p className="text-xs text-muted-foreground">{t("soundDescription")}</p>
              </div>
              <Switch
                checked={config.soundEnabled}
                onCheckedChange={setSoundEnabled}
                aria-label={t("soundLabel")}
              />
            </CardContent>
          </Card>

          <Card className="min-h-0 flex-1 overflow-hidden">
            <CardHeader className="gap-1 border-b border-border px-4 py-3">
              <CardTitle className="text-base">{t("shortcutsHeading")}</CardTitle>
              <p className="text-xs text-muted-foreground">{t("shortcutsHint")}</p>
            </CardHeader>
            <CardContent className="min-w-0 px-4 py-3">
              <DuduScannerShortcutDeck layout="vertical" />
            </CardContent>
          </Card>
        </div>
      </div>

      <p className="text-center text-xs text-muted-foreground sm:text-left">{t("disclaimer")}</p>
    </main>
  );
}
