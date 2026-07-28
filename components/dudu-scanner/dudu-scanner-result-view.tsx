"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { DuduScannerBackButton } from "@/components/dudu-scanner/dudu-scanner-back-button";
import { type DuduScannerTargetId } from "@/lib/dudu-scanner/catalog";
import { DUDU_SCANNER_TARGET_MESSAGE_KEY } from "@/lib/dudu-scanner/i18n-keys";

type DuduScannerResultViewProps = {
  targetId: DuduScannerTargetId;
  targetImageSrc: string;
  onScanAgain: () => void;
  onChangeTarget: () => void;
  onBack?: () => void;
};

export function DuduScannerResultView({
  targetId,
  targetImageSrc,
  onScanAgain,
  onChangeTarget,
  onBack,
}: DuduScannerResultViewProps) {
  const t = useTranslations("duduScanner");
  const targetMessageKey = DUDU_SCANNER_TARGET_MESSAGE_KEY[targetId];

  return (
    <div
      className="relative flex min-h-0 min-w-0 flex-1 flex-col items-center justify-center gap-4 overflow-hidden p-4 text-center sm:gap-6 sm:p-6"
      data-testid="dudu-scanner-result-view"
    >
      {onBack ? (
        <div className="absolute left-3 top-3 z-10 sm:left-4 sm:top-4">
          <DuduScannerBackButton onClick={onBack} />
        </div>
      ) : null}
      <div className="space-y-2">
        <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
          {t("result.eyebrow")}
        </p>
        <h2 className="text-xl font-semibold text-foreground sm:text-2xl">{t("result.title")}</h2>
        <p className="max-w-md text-muted-foreground">{t("result.body")}</p>
      </div>

      <div className="flex w-full max-w-md flex-col items-center gap-3 rounded-2xl border border-border bg-card px-4 py-5 shadow-xs sm:px-8 sm:py-6">
        <div className="relative flex size-40 items-center justify-center rounded-2xl border border-primary/30 bg-muted/30">
          <Image
            src={targetImageSrc}
            alt=""
            width={140}
            height={140}
            className="size-32 object-contain"
            data-testid="dudu-scanner-result-target"
          />
        </div>
        <p className="text-lg font-medium text-foreground">
          {t(`targets.${targetMessageKey}.name`)}
        </p>
        <p className="max-w-sm text-sm text-muted-foreground">
          {t(`targets.${targetMessageKey}.description`)}
        </p>
        <p className="max-w-sm text-sm font-medium text-foreground">
          {t(`targets.${targetMessageKey}.suggestion`)}
        </p>
      </div>

      <p className="text-sm text-muted-foreground">{t("disclaimer")}</p>

      <div className="flex w-full max-w-md flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center">
        <Button type="button" size="lg" className="w-full sm:w-auto" onClick={onScanAgain} data-testid="dudu-scanner-scan-again">
          {t("result.scanAgain")}
        </Button>
        <Button
          type="button"
          size="lg"
          variant="outline"
          className="w-full sm:w-auto"
          onClick={onChangeTarget}
          data-testid="dudu-scanner-change-target"
        >
          {t("result.changeTarget")}
        </Button>
      </div>
    </div>
  );
}
