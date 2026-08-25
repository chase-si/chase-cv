"use client";

import Image from "next/image";
import { ScanSearch, SlidersHorizontal, ImagePlus } from "lucide-react";
import { useTranslations } from "next-intl";

import { DuduScannerHowToPlay } from "@/components/dudu-scanner/dudu-scanner-how-to-play";
import { DuduScannerCustomLibraryPanel } from "@/components/dudu-scanner/dudu-scanner-custom-library-panel";
import { DuduScannerShortcutDeck } from "@/components/dudu-scanner/dudu-scanner-shortcut-deck";
import { ToolPageChrome } from "@/components/tool-page-chrome";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardScrollArea, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  DUDU_SCANNER_SCAN_MODE_IDS,
  DUDU_SCANNER_TARGET_IDS,
  getTargetRecord,
} from "@/lib/dudu-scanner/catalog";
import { DUDU_SCANNER_TARGET_MESSAGE_KEY } from "@/lib/dudu-scanner/i18n-keys";
import { useDuduScannerConfig } from "@/lib/dudu-scanner/use-dudu-scanner-config";
import { useDuduScannerCustomLibrary } from "@/lib/dudu-scanner/dudu-scanner-custom-library-provider";
import { cn } from "@/lib/utils";

export function DuduScannerConfigShell({
  onStartScan,
  assetLoadWarning = false,
}: {
  onStartScan?: () => void;
  assetLoadWarning?: boolean;
}) {
  const t = useTranslations("duduScanner");
  const { config, setScanMode, setTargetId, setSoundEnabled } = useDuduScannerConfig();
  const { items: customItems } = useDuduScannerCustomLibrary();
  const startDisabled = config.scanMode === "custom" && customItems.length === 0;

  return (
    <ToolPageChrome
      title={t("title")}
      description={t("subtitle")}
      actions={
        <Button
          type="button"
          size="lg"
          className="w-full shrink-0 sm:w-auto"
          onClick={onStartScan}
          disabled={startDisabled}
          aria-describedby={startDisabled ? "dudu-scanner-start-blocked" : undefined}
        >
          {t("startScan")}
        </Button>
      }
    >
      {assetLoadWarning ? (
        <p
          className="shrink-0 rounded-xl border border-border bg-muted/50 px-3 py-2 text-xs text-foreground sm:text-sm"
          role="status"
          data-testid="dudu-scanner-asset-warning"
        >
          {t("assetLoadWarning")}
        </p>
      ) : null}

      <div className="grid min-h-0 flex-1 gap-3 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:items-stretch">
        <Card className="flex min-h-0 flex-col overflow-hidden lg:gap-0 lg:py-0">
          <CardScrollArea className="min-h-0 flex-1">
          <CardContent className="flex flex-col gap-4 px-4 py-3 lg:min-h-0 lg:gap-3">
            <div className="space-y-2">
              <h2 className="text-sm font-medium text-foreground">{t("scanModeHeading")}</h2>
              <div className="grid gap-2 sm:grid-cols-3">
                {DUDU_SCANNER_SCAN_MODE_IDS.map((scanMode) => {
                  const selected = config.scanMode === scanMode;
                  const Icon =
                    scanMode === "mystery"
                      ? ScanSearch
                      : scanMode === "custom"
                        ? ImagePlus
                        : SlidersHorizontal;
                  return (
                    <Button
                      key={scanMode}
                      type="button"
                      variant={selected ? "default" : "outline"}
                      aria-pressed={selected}
                      aria-label={t(`scanModes.${scanMode}.name`)}
                      className="h-auto min-h-16 items-start justify-start whitespace-normal px-3 py-2.5 text-left"
                      onClick={() => setScanMode(scanMode)}
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

            {config.scanMode === "operator" ? (
              <div className="min-h-0 space-y-2">
                <h2 className="text-sm font-medium text-foreground">{t("targetsHeading")}</h2>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
                  {DUDU_SCANNER_TARGET_IDS.map((targetId) => {
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
            ) : null}
            {config.scanMode === "mystery" ? (
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
            ) : null}
            {config.scanMode === "custom" ? <DuduScannerCustomLibraryPanel /> : null}
          </CardContent>
          </CardScrollArea>
        </Card>

        <div className="grid min-h-0 gap-3 sm:grid-cols-[minmax(0,1.2fr)_minmax(11rem,0.8fr)] lg:min-h-0 lg:grid-cols-1 lg:grid-rows-[auto_auto] lg:content-start">
          <DuduScannerHowToPlay />

          <Card className="min-h-0 overflow-hidden lg:gap-0 lg:py-0">
            <CardHeader className="items-center gap-1 border-b border-border px-4 py-3 [.border-b]:pb-3 lg:py-2 lg:[.border-b]:pb-2">
              <CardTitle className="text-base">{t("shortcutsHeading")}</CardTitle>
              <p className="text-xs text-muted-foreground lg:hidden">{t("shortcutsHint")}</p>
            </CardHeader>
            <CardContent className="flex min-w-0 flex-col gap-3 px-4 py-3 lg:gap-2 lg:py-2">
              <div className="flex items-center justify-between gap-4 border-b border-border pb-3 lg:pb-2">
                <div className="min-w-0 space-y-0.5">
                  <p className="text-sm font-medium text-foreground">{t("soundLabel")}</p>
                  <p className="text-xs text-muted-foreground">{t("soundDescription")}</p>
                </div>
                <Switch
                  checked={config.soundEnabled}
                  onCheckedChange={setSoundEnabled}
                  aria-label={t("soundLabel")}
                />
              </div>
              <DuduScannerShortcutDeck
                layout="vertical"
                className="lg:grid lg:grid-cols-2 lg:gap-x-4"
              />
            </CardContent>
          </Card>
        </div>
      </div>

      <p className="shrink-0 text-center text-xs text-muted-foreground sm:text-left">
        {t("disclaimer")}
      </p>
    </ToolPageChrome>
  );
}
