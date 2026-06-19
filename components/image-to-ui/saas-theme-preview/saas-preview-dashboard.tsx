"use client";

import {
  Activity,
  Bell,
  FileText,
  LayoutDashboard,
  Search,
  Settings,
  Users,
  Zap,
} from "lucide-react";
import { useTranslations } from "next-intl";

import { SaasPreviewCustomerPipelineTable } from "@/components/image-to-ui/saas-theme-preview/saas-preview-customer-pipeline-table";
import { SaasPreviewRevenueChartSection } from "@/components/image-to-ui/saas-theme-preview/saas-preview-revenue-chart-section";
import { SaasPreviewSegmentChartSection } from "@/components/image-to-ui/saas-theme-preview/saas-preview-segment-chart-section";
import { SaasPreviewStatusArea } from "@/components/image-to-ui/saas-theme-preview/saas-preview-status-area";
import { PreviewTooltipContent } from "@/components/image-to-ui/preview-theme-scope";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarGroup, AvatarGroupCount } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export function SaasPreviewDashboard() {
  const t = useTranslations("imageToUi.preview");
  const navItems = [
    { label: t("overview"), icon: LayoutDashboard, active: true },
    { label: "Lifecycle", icon: Activity, active: false },
    { label: t("documents"), icon: FileText, active: false },
    { label: "Team", icon: Users, active: false },
    { label: t("settings"), icon: Settings, active: false },
  ];

  return (
    <section
      data-testid="saas-dashboard-preview"
      className="bg-background pt-4"
      aria-label={t("dashboardAria")}
    >
      <div className="grid gap-4 lg:grid-cols-[14rem_minmax(0,1fr)]">
        <aside
          data-testid="saas-dashboard-sidebar"
          className="hidden flex-col gap-4 border border-border bg-card p-3 lg:flex"
          aria-label={t("navAria")}
        >
          <div className="flex items-center gap-2 p-1">
            <div className="flex size-8 items-center justify-center bg-primary text-primary-foreground">
              A
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-foreground">{t("company")}</p>
              <p className="truncate text-xs text-muted-foreground">{t("plan")}</p>
            </div>
          </div>
          <nav className="flex flex-col gap-1" aria-label={t("navSectionsAria")}>
            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <button
                  key={item.label}
                  type="button"
                  aria-current={item.active ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 text-left text-sm text-muted-foreground transition-colors",
                    "hover:bg-muted/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none",
                    item.active && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                  )}
                >
                  <Icon className="size-4" aria-hidden />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
          <Card size="sm" className="mt-auto shadow-sm">
            <CardHeader className="pb-2">
              <Badge variant="accent" data-testid="saas-accent-badge">
                {t("watchBadge")}
              </Badge>
              <CardDescription className="text-xs">
                {t("watchDescription")}
              </CardDescription>
            </CardHeader>
          </Card>
        </aside>

        <div className="flex min-w-0 flex-col gap-4">
          <Card size="sm" className="shadow-sm" data-testid="saas-dashboard-toolbar">
            <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="min-w-0 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <CardTitle className="text-lg">{t("documents")}</CardTitle>
                  <Badge variant="secondary" data-testid="saas-secondary-chip">
                    {t("revenueFocus")}
                  </Badge>
                </div>
                <CardDescription>
                  {t("documentsDescription")}
                </CardDescription>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Button type="button" variant="outline" size="sm">
                  <Search data-icon="inline-start" aria-hidden />
                  {t("search")}
                </Button>
                <Button type="button" variant="outline" size="icon-sm" aria-label={t("notifications")}>
                  <Bell aria-hidden />
                </Button>
                <Button type="button" size="sm" data-testid="saas-primary-action">
                  {t("quickCreate")}
                </Button>
              </div>
            </CardHeader>
          </Card>

          <SaasPreviewStatusArea />

          <div className="grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(0,0.85fr)]">
            <SaasPreviewRevenueChartSection />
            <SaasPreviewSegmentChartSection />
          </div>

          <Alert variant="default" data-testid="saas-alert-notification">
            <AlertTitle>{t("incidentTitle")}</AlertTitle>
            <AlertDescription>
              {t("incidentDescription")}
            </AlertDescription>
          </Alert>

          <Card size="sm" className="shadow-sm">
            <CardContent className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium text-foreground">{t("responseTeam")}</p>
                <p className="text-xs text-muted-foreground">
                  {t("responseDescription")}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <AvatarGroup data-testid="saas-response-team">
                  <Avatar size="sm">
                    <AvatarFallback>AL</AvatarFallback>
                  </Avatar>
                  <Avatar size="sm">
                    <AvatarFallback>NW</AvatarFallback>
                  </Avatar>
                  <AvatarGroupCount>+2</AvatarGroupCount>
                </AvatarGroup>
                <Tooltip>
                  <TooltipTrigger
                    type="button"
                    className="text-xs font-medium text-primary underline-offset-4 hover:underline focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none"
                    aria-label={t("detailsAria")}
                  >
                    {t("details")}
                  </TooltipTrigger>
                  <PreviewTooltipContent side="left">
                    {t("detailsTooltip")}
                  </PreviewTooltipContent>
                </Tooltip>
              </div>
            </CardContent>
          </Card>

          <SaasPreviewCustomerPipelineTable />

          <Card size="sm" data-testid="saas-accent-section" className="shadow-sm" aria-label={t("accentActionsAria")}>
            <CardContent className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="min-w-0">
                <p className="text-xs font-medium uppercase text-muted-foreground">{t("accentSpotlight")}</p>
                <p className="text-sm text-foreground">
                  {t("accentDescription")}
                </p>
              </div>
              <Button type="button" size="sm">
                <Zap data-icon="inline-start" aria-hidden />
                {t("launchCampaign")}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
