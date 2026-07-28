"use client";

import { ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";

export function DuduScannerBackButton({ onClick }: { onClick: () => void }) {
  const t = useTranslations("duduScanner");

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className="-ml-2 shrink-0 self-start"
      onClick={onClick}
      data-testid="dudu-scanner-back"
    >
      <ArrowLeft className="size-4" aria-hidden />
      {t("backToConfig")}
    </Button>
  );
}
