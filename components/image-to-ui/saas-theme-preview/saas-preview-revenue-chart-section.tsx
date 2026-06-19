"use client";

import { useTranslations } from "next-intl";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as ChartTooltip,
  XAxis,
  YAxis,
} from "recharts";

import { REVENUE_SERIES } from "@/components/image-to-ui/saas-theme-preview/preview-demo-data";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function SaasPreviewRevenueChartSection() {
  const t = useTranslations("imageToUi.preview");

  return (
    <Card
      size="sm"
      data-testid="saas-revenue-chart-section"
      className="min-h-80 shadow-sm"
      aria-label={t("revenueChartAria")}
    >
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <CardTitle>{t("totalVisitors")}</CardTitle>
            <CardDescription>{t("revenueTrend")}</CardDescription>
          </div>
          <Badge variant="outline">{t("lastSixMonths")}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-56 min-w-0" data-testid="saas-recharts-area">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={REVENUE_SERIES} margin={{ left: -16, right: 8, top: 8, bottom: 0 }}>
              <CartesianGrid stroke="var(--border)" strokeDasharray="4 4" vertical={false} />
              <XAxis
                dataKey="month"
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
                cursor={{ stroke: "var(--ring)", strokeWidth: 1 }}
                contentStyle={{
                  background: "var(--popover)",
                  border: "1px solid var(--border)",
                  color: "var(--popover-foreground)",
                }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="var(--primary)"
                fill="var(--primary)"
                fillOpacity={0.16}
                strokeWidth={2}
                name="Revenue"
              />
              <Area
                type="monotone"
                dataKey="expansion"
                stroke="var(--accent)"
                fill="var(--accent)"
                fillOpacity={0.14}
                strokeWidth={2}
                name="Expansion"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
