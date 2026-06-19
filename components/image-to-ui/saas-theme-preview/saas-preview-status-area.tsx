"use client";

import { useTranslations } from "next-intl";

import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader } from "@/components/ui/card";
import { DASHBOARD_KPI_CARDS } from "@/components/image-to-ui/saas-theme-preview/preview-demo-data";

export function SaasPreviewStatusArea() {
  const t = useTranslations("imageToUi.preview");

  return (
    <section
      data-testid="saas-status-area"
      className="grid gap-3 md:grid-cols-2 xl:grid-cols-4"
      aria-label={t("platformHealthAria")}
    >
      {DASHBOARD_KPI_CARDS.map((card) => (
        <Card key={card.label} size="sm" data-testid="saas-kpi-card" className="min-h-32 shadow-sm">
          <CardHeader className="flex flex-1 flex-col justify-between gap-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <CardDescription>{card.label}</CardDescription>
                <p className="mt-1 text-2xl font-semibold text-foreground" data-testid={card.testId}>
                  {card.value}
                </p>
              </div>
              <Badge variant="secondary">{card.delta}</Badge>
            </div>
            <p className="text-xs text-muted-foreground">{card.detail}</p>
          </CardHeader>
        </Card>
      ))}
    </section>
  );
}
