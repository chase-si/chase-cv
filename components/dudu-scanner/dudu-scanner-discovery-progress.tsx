import { Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";

import { DUDU_SCANNER_TARGET_IDS } from "@/lib/dudu-scanner/catalog";

export function DuduScannerDiscoveryProgress({ discoveredCount }: { discoveredCount: number }) {
  const t = useTranslations("duduScanner");

  return (
    <div
      className="flex w-full max-w-md items-center gap-3 rounded-xl border border-primary/30 bg-primary/5 px-4 py-3 text-left"
      data-testid="dudu-scanner-discovery-progress"
    >
      <Sparkles className="size-4 shrink-0 text-primary" aria-hidden />
      <p className="text-sm font-medium text-foreground">
        {t("discoveryProgress", { count: discoveredCount, total: DUDU_SCANNER_TARGET_IDS.length })}
      </p>
    </div>
  );
}
