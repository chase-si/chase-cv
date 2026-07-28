"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { type DuduScannerTargetId } from "@/lib/dudu-scanner/catalog";
import { DUDU_SCANNER_TARGET_MESSAGE_KEY } from "@/lib/dudu-scanner/i18n-keys";

type DuduScannerResultViewProps = {
  targetId: DuduScannerTargetId;
  targetImageSrc: string;
  onScanAgain: () => void;
  onChangeTarget: () => void;
};

export function DuduScannerResultView({
  targetId,
  targetImageSrc,
  onScanAgain,
  onChangeTarget,
}: DuduScannerResultViewProps) {
  const t = useTranslations("duduScanner");
  const targetMessageKey = DUDU_SCANNER_TARGET_MESSAGE_KEY[targetId];

  return (
    <div
      className="flex min-h-0 flex-1 flex-col items-center justify-center gap-6 overflow-hidden p-6 text-center"
      data-testid="dudu-scanner-result-view"
    >
      <div className="space-y-2">
        <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
          {t("result.eyebrow")}
        </p>
        <h2 className="text-2xl font-semibold text-foreground">{t("result.title")}</h2>
        <p className="max-w-md text-muted-foreground">{t("result.body")}</p>
      </div>

      <div className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-card px-8 py-6 shadow-xs">
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

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button type="button" size="lg" onClick={onScanAgain} data-testid="dudu-scanner-scan-again">
          {t("result.scanAgain")}
        </Button>
        <Button
          type="button"
          size="lg"
          variant="outline"
          onClick={onChangeTarget}
          data-testid="dudu-scanner-change-target"
        >
          {t("result.changeTarget")}
        </Button>
      </div>
    </div>
  );
}
