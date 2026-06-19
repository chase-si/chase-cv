"use client";

import { useTranslations } from "next-intl";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as ChartTooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  BAR_CHART_HOVER_CURSOR,
  SEGMENT_SERIES,
} from "@/components/image-to-ui/saas-theme-preview/preview-demo-data";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function SaasPreviewSegmentChartSection() {
  const t = useTranslations("imageToUi.preview");

  return (
    <Card
      size="sm"
      data-testid="saas-segment-chart-section"
      className="min-h-80 shadow-sm"
      aria-label={t("segmentChartAria")}
    >
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <CardTitle>{t("accountSegments")}</CardTitle>
            <CardDescription>{t("segmentDescription")}</CardDescription>
          </div>
          <Badge variant="accent">{t("live")}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-56 min-w-0" data-testid="saas-recharts-bar">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={SEGMENT_SERIES} margin={{ left: -18, right: 8, top: 8, bottom: 0 }}>
              <CartesianGrid stroke="var(--border)" strokeDasharray="4 4" vertical={false} />
              <XAxis
                dataKey="segment"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
              />
              <ChartTooltip
                cursor={{ fill: BAR_CHART_HOVER_CURSOR }}
                contentStyle={{
                  background: "var(--popover)",
                  border: "1px solid var(--border)",
                  color: "var(--popover-foreground)",
                }}
              />
              <Bar dataKey="active" fill="var(--secondary)" radius={[6, 6, 0, 0]} name="Active" />
              <Bar dataKey="risk" fill="var(--accent)" radius={[6, 6, 0, 0]} name="Risk" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
