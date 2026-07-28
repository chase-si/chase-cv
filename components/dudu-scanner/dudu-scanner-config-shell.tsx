"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  DUDU_SCANNER_THEME_IDS,
  getTargetIdsForTheme,
  getTargetRecord,
  type DuduScannerThemeId,
} from "@/lib/dudu-scanner/catalog";
import {
  DUDU_SCANNER_SHORTCUT_KEYS,
  DUDU_SCANNER_SHORTCUT_LABEL,
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
  const { config, setThemeId, setTargetId, setSoundEnabled } = useDuduScannerConfig();
  const visibleTargets = getTargetIdsForTheme(config.themeId);

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-4 py-8 sm:px-6 sm:py-10">
      <div className="space-y-2 text-center sm:text-left">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">{t("title")}</h1>
        <p className="max-w-2xl text-muted-foreground">{t("subtitle")}</p>
        {assetLoadWarning ? (
          <p
            className="max-w-2xl rounded-xl border border-border bg-muted/50 px-4 py-3 text-sm text-foreground"
            role="status"
            data-testid="dudu-scanner-asset-warning"
          >
            {t("assetLoadWarning")}
          </p>
        ) : null}
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>{t("themesHeading")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-wrap gap-2">
              {DUDU_SCANNER_THEME_IDS.map((themeId) => {
                const messageKey = DUDU_SCANNER_THEME_MESSAGE_KEY[themeId];
                const selected = config.themeId === themeId;
                return (
                  <Button
                    key={themeId}
                    type="button"
                    variant={selected ? "default" : "outline"}
                    aria-pressed={selected}
                    onClick={() => setThemeId(themeId as DuduScannerThemeId)}
                  >
                    {t(`themes.${messageKey}`)}
                  </Button>
                );
              })}
            </div>

            <div className="space-y-3">
              <h2 className="text-sm font-medium text-foreground">{t("targetsHeading")}</h2>
              <div className="grid gap-3 sm:grid-cols-3">
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
                      "flex flex-col items-center gap-3 rounded-2xl border bg-card p-4 text-left shadow-xs transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30",
                      selected ? "border-primary ring-2 ring-primary/20" : "border-border hover:bg-muted/40",
                    )}
                  >
                    <div className="relative flex size-24 items-center justify-center rounded-2xl border border-border bg-muted/30">
                      <Image
                        src={imageSrc}
                        alt=""
                        width={72}
                        height={72}
                        className="size-16 object-contain"
                      />
                    </div>
                    <span className="w-full text-center text-sm font-medium text-foreground">
                      {t(`targets.${messageKey}.name`)}
                    </span>
                  </button>
                );
              })}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-6">
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle>{t("soundLabel")}</CardTitle>
              <CardDescription>{t("soundDescription")}</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-between gap-4">
              <span className="text-sm text-foreground">{t("soundLabel")}</span>
              <Switch
                checked={config.soundEnabled}
                onCheckedChange={setSoundEnabled}
                aria-label={t("soundLabel")}
              />
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle>{t("shortcutsHeading")}</CardTitle>
              <CardDescription>{t("shortcutsHint")}</CardDescription>
            </CardHeader>
            <CardContent>
              <dl className="space-y-3">
                {DUDU_SCANNER_SHORTCUT_KEYS.map((shortcutKey) => (
                  <div
                    key={shortcutKey}
                    className="flex items-start justify-between gap-4 border-b border-border/70 pb-3 last:border-b-0 last:pb-0"
                  >
                    <dt className="font-mono text-sm font-medium text-foreground">
                      {DUDU_SCANNER_SHORTCUT_LABEL[shortcutKey]}
                    </dt>
                    <dd className="max-w-[14rem] text-right text-sm text-muted-foreground">
                      {t(`shortcuts.${shortcutKey}`)}
                    </dd>
                  </div>
                ))}
              </dl>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="overflow-hidden">
        <CardContent className="flex flex-col items-center gap-4 py-8 text-center sm:flex-row sm:justify-between sm:text-left">
          <p className="text-sm text-muted-foreground">{t("disclaimer")}</p>
          <Button type="button" size="lg" onClick={onStartScan}>
            {t("startScan")}
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
