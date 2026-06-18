"use client";

import type { CSSProperties } from "react";
import { useTranslations } from "next-intl";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as ChartTooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Activity,
  ArrowUpRight,
  Bell,
  ChevronLeft,
  ChevronRight,
  FileText,
  LayoutDashboard,
  Search,
  Settings,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarGroup, AvatarGroupCount } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress, ProgressLabel, ProgressValue } from "@/components/ui/progress";
import { Select, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Toggle } from "@/components/ui/toggle";
import {
  PreviewSelectContent,
  PreviewThemeScopeProvider,
  PreviewTooltipContent,
} from "@/components/image-to-ui/preview-theme-scope";
import { cn } from "@/lib/utils";

const BAR_CHART_HOVER_CURSOR = "color-mix(in srgb, var(--primary) 14%, transparent)";

const SETTINGS_TEAM_MEMBERS = [
  { initials: "S", name: "Sofia Davis", email: "m@example.com", role: "Owner" as const },
  { initials: "J", name: "Jackson Lee", email: "p@example.com", role: "Developer" as const },
  { initials: "I", name: "Isabella Nguyen", email: "i@example.com", role: "Billing" as const },
];

const PREVIEW_CUSTOMER_PIPELINE_ROWS: Array<{
  customer: string;
  owner: string;
  arr: string;
  stage: string;
  status: string;
  statusVariant: "secondary" | "accent" | "outline";
  actionLabel: string;
  actionText: string;
}> = [
  {
    customer: "Acme Robotics",
    owner: "Nora West",
    arr: "$124k",
    stage: "Expansion",
    status: "At risk",
    statusVariant: "accent",
    actionLabel: "Open Acme Robotics account",
    actionText: "Open account",
  },
  {
    customer: "Northwind Labs",
    owner: "Alex Li",
    arr: "$88k",
    stage: "QBR",
    status: "Healthy",
    statusVariant: "secondary",
    actionLabel: "Schedule QBR for Northwind Labs",
    actionText: "Schedule QBR",
  },
  {
    customer: "Zephyr Mobility",
    owner: "Mina Park",
    arr: "$63k",
    stage: "Renewal",
    status: "Renewal due",
    statusVariant: "outline",
    actionLabel: "Review Zephyr Mobility renewal",
    actionText: "Review renewal",
  },
];

const DASHBOARD_KPI_CARDS = [
  {
    label: "Total revenue",
    value: "$84,200",
    delta: "+12.4%",
    detail: "Trending up this month",
    testId: "saas-metric-mrr",
  },
  {
    label: "New customers",
    value: "1,284",
    delta: "+18.2%",
    detail: "Pipeline conversion improved",
    testId: "saas-metric-customers",
  },
  {
    label: "Open incidents",
    value: "3",
    delta: "-2",
    detail: "APAC latency remains watched",
    testId: "saas-metric-incidents",
  },
  {
    label: "Expansion rate",
    value: "42%",
    delta: "+4.5%",
    detail: "Healthy account momentum",
    testId: "saas-metric-growth",
  },
];

const REVENUE_SERIES = [
  { month: "Jan", revenue: 42, expansion: 16 },
  { month: "Feb", revenue: 48, expansion: 22 },
  { month: "Mar", revenue: 51, expansion: 27 },
  { month: "Apr", revenue: 58, expansion: 31 },
  { month: "May", revenue: 64, expansion: 36 },
  { month: "Jun", revenue: 78, expansion: 44 },
];

const SEGMENT_SERIES = [
  { segment: "SMB", active: 36, risk: 10 },
  { segment: "Mid", active: 48, risk: 12 },
  { segment: "Ent", active: 62, risk: 8 },
  { segment: "Gov", active: 28, risk: 6 },
];

const LANDING_FEATURE_CARDS = [
  {
    title: "Pipeline intelligence",
    description: "Surface expansion risk and revenue signals before they become escalations.",
  },
  {
    title: "Guided playbooks",
    description: "Turn best practices into repeatable motions for every customer segment.",
  },
  {
    title: "Executive visibility",
    description: "Share progress, blockers, and proof points in one branded command center.",
  },
];

type SaasThemePreviewSurfaceProps = {
  previewRootStyle: CSSProperties;
  className?: string;
};

export function SaasThemePreviewSurface({
  previewRootStyle,
  className,
}: SaasThemePreviewSurfaceProps) {
  const t = useTranslations("imageToUi.preview");

  return (
    <section
      data-testid="saas-preview-surface"
      className={cn(
        "border border-border bg-background p-3 text-foreground tracking-normal sm:p-4",
        className,
      )}
      aria-label={t("surfaceAria")}
      style={previewRootStyle}
    >
      <PreviewThemeScopeProvider previewRootStyle={previewRootStyle}>
        <TooltipProvider>
          <Tabs defaultValue="overview">
          <div className="flex flex-col gap-3 border-b border-border pb-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center border border-primary/30 bg-primary/10 text-primary">
                <Sparkles className="size-4" aria-hidden />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-foreground">Atlas Control Room</p>
                <p className="truncate text-xs text-muted-foreground">
                  {t("subtitle")}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <TabsList aria-label={t("tabsAria")}>
                <TabsTrigger
                  value="overview"
                  className="aria-selected:bg-primary aria-selected:text-primary-foreground"
                >
                  {t("overview")}
                </TabsTrigger>
                <TabsTrigger
                  value="settings"
                  className="aria-selected:bg-primary aria-selected:text-primary-foreground"
                >
                  {t("settings")}
                </TabsTrigger>
                <TabsTrigger
                  value="landing"
                  className="aria-selected:bg-primary aria-selected:text-primary-foreground"
                >
                  {t("landing")}
                </TabsTrigger>
              </TabsList>
            </div>
          </div>

          <TabsContent value="overview">
            <DashboardPreview />
          </TabsContent>

          <TabsContent value="settings">
            <WorkspaceSettingsPreview />
          </TabsContent>

          <TabsContent value="landing">
            <MarketingPreview />
          </TabsContent>
          </Tabs>
        </TooltipProvider>
      </PreviewThemeScopeProvider>
    </section>
  );
}

function DashboardPreview() {
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

          <div className="grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(0,0.85fr)]">
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

          <CustomerPipelineTable />

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

function CustomerPipelineTable() {
  const t = useTranslations("imageToUi.preview");

  return (
    <Card
      size="sm"
      data-testid="saas-data-table-section"
      className="shadow-sm"
      aria-label={t("tableSectionAria")}
    >
      <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <CardTitle>{t("customerPipeline")}</CardTitle>
          <CardDescription>{t("customerPipelineDescription")}</CardDescription>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button type="button" variant="outline" size="sm">
            {t("customizeColumns")}
          </Button>
          <Button type="button" size="sm">
            {t("addSection")}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
      <Table aria-label={t("tableAria")}>
        <TableHeader>
          <TableRow>
            <TableHead>{t("customer")}</TableHead>
            <TableHead>{t("owner")}</TableHead>
            <TableHead>ARR</TableHead>
            <TableHead>{t("stage")}</TableHead>
            <TableHead>{t("status")}</TableHead>
            <TableHead className="text-right">{t("actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {PREVIEW_CUSTOMER_PIPELINE_ROWS.map((row) => (
            <TableRow key={row.customer}>
              <TableCell className="font-medium">{row.customer}</TableCell>
              <TableCell className="text-muted-foreground">{row.owner}</TableCell>
              <TableCell className="font-mono text-xs text-muted-foreground">{row.arr}</TableCell>
              <TableCell>{row.stage}</TableCell>
              <TableCell>
                <Badge variant={row.statusVariant}>{row.status}</Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button type="button" size="sm" variant="ghost" aria-label={row.actionLabel}>
                  {row.actionText}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex flex-col gap-2 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between">
        <p>{t("rowsSelected")}</p>
        <div className="flex items-center gap-2">
          <span>{t("pageCount")}</span>
          <Button type="button" variant="outline" size="icon-xs" aria-label={t("previousPage")}>
            <ChevronLeft aria-hidden />
          </Button>
          <Button type="button" variant="outline" size="icon-xs" aria-label={t("nextPage")}>
            <ChevronRight aria-hidden />
          </Button>
        </div>
      </div>
      </CardContent>
    </Card>
  );
}

function WorkspaceSettingsPreview() {
  const t = useTranslations("imageToUi.preview");

  return (
    <div
      className="flex flex-col gap-4 bg-background pt-4"
      data-testid="saas-settings-form"
      aria-label={t("settingsAria")}
    >
      <Card size="sm" data-testid="saas-settings-upgrade" className="shadow-sm">
        <CardHeader>
          <CardTitle>{t("upgradeTitle")}</CardTitle>
          <CardDescription>
            {t("upgradeDescription")}
          </CardDescription>
        </CardHeader>
        <CardFooter className="justify-end gap-2">
          <Button type="button" variant="outline">
            {t("cancel")}
          </Button>
          <Button type="button">{t("upgradePlan")}</Button>
        </CardFooter>
      </Card>

      <Card size="sm" data-testid="saas-settings-team" className="shadow-sm">
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
          <CardDescription>Invite your team members to collaborate.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {SETTINGS_TEAM_MEMBERS.map((member) => (
            <div key={member.email} className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <Avatar size="sm">
                  <AvatarFallback>{member.initials}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">{member.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{member.email}</p>
                </div>
              </div>
              <Badge variant="secondary">{member.role}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card size="sm" data-testid="saas-settings-create-account" className="shadow-sm">
        <CardHeader>
          <CardTitle>Create an account</CardTitle>
          <CardDescription>Enter your email below to create your account</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="grid gap-2 sm:grid-cols-2">
            <Button type="button" variant="outline">
              GitHub
            </Button>
            <Button type="button" variant="outline">
              Google
            </Button>
          </div>
          <div className="relative flex items-center gap-3">
            <Separator className="flex-1" />
            <span className="text-xs text-muted-foreground">Or continue with</span>
            <Separator className="flex-1" />
          </div>
          <div className="grid gap-3">
            <div className="flex flex-col gap-2">
              <Label htmlFor="preview-account-email">Email</Label>
              <Input id="preview-account-email" type="email" placeholder="m@example.com" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="preview-account-password">Password</Label>
              <Input id="preview-account-password" type="password" />
            </div>
          </div>
          <Button type="button" className="w-full sm:w-auto">
            Create account
          </Button>
        </CardContent>
      </Card>

      <Card size="sm" className="shadow-sm">
        <CardHeader>
          <CardTitle>Workspace</CardTitle>
          <CardDescription>Name, plan, and operational defaults.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="workspace-name">Workspace name</Label>
              <Input id="workspace-name" defaultValue="Atlas Control Room" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="workspace-plan">Plan</Label>
              <Select defaultValue="scale">
                <SelectTrigger id="workspace-plan" aria-label="Plan" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <PreviewSelectContent>
                  <SelectItem value="starter">Starter</SelectItem>
                  <SelectItem value="scale">Scale</SelectItem>
                  <SelectItem value="enterprise">Enterprise</SelectItem>
                </PreviewSelectContent>
              </Select>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="autoscale-threshold">{t("autoScale")}</Label>
            <Slider aria-label={t("autoScale")} id="autoscale-threshold" min={20} max={95} defaultValue={[65]} />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Toggle type="button" variant="outline" defaultPressed>
              Enable maintenance mode
            </Toggle>
            <label className="flex items-center gap-2 text-sm text-foreground">
              <Checkbox defaultChecked aria-label={t("notifySms")} />
              <span>{t("notifySms")}</span>
            </label>
          </div>
        </CardContent>
        <CardFooter className="justify-end gap-2">
          <Button type="button" variant="secondary">
            Reset
          </Button>
          <Button type="button">{t("saveChanges")}</Button>
        </CardFooter>
      </Card>

      <Card size="sm" data-testid="saas-settings-cookies" className="shadow-sm">
        <CardHeader>
          <CardTitle>Cookie Settings</CardTitle>
          <CardDescription>Manage your cookie settings here.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-foreground">Strictly Necessary</p>
              <p className="text-xs text-muted-foreground">
                These cookies are essential in order to use the website and its features.
              </p>
            </div>
            <Switch defaultChecked aria-label="Strictly necessary cookies" />
          </div>
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-foreground">Functional Cookies</p>
              <p className="text-xs text-muted-foreground">
                These cookies allow the website to provide personalized functionality.
              </p>
            </div>
            <Switch aria-label="Functional cookies" />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="button" size="sm">
            Save preferences
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

function MarketingPreview() {
  const t = useTranslations("imageToUi.preview");

  return (
    <section
      data-testid="landing-page-preview"
      className="flex flex-col gap-4 bg-background pt-4"
      aria-label={t("landingAria")}
    >
      <Card size="sm" className="shadow-sm">
        <CardContent className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2" data-testid="landing-nav">
            <div className="flex size-8 items-center justify-center bg-primary text-sm font-semibold text-primary-foreground">
              A
            </div>
            <span className="text-sm font-semibold text-foreground">Atlas</span>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <span>Platform</span>
            <span>Customers</span>
            <span>Pricing</span>
          </div>
          <Button type="button" size="sm">
            Book demo
          </Button>
        </CardContent>
      </Card>

      <div
        data-testid="landing-hero"
        className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_22rem]"
      >
        <Card size="sm" className="shadow-sm">
          <CardContent className="flex min-w-0 flex-col justify-center gap-5 py-4">
            <Badge variant="accent">{t("landingEyebrow")}</Badge>
            <div className="max-w-2xl">
              <h3 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
                {t("landingHeadline")}
              </h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground md:text-base">
                {t("landingDescription")}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button type="button" data-testid="landing-primary-cta">
                {t("startTrial")}
              </Button>
              <Button type="button" variant="outline" className="border-primary text-primary hover:bg-primary/10">
                {t("watchDemo")}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card size="sm" data-testid="landing-hero-panel" className="shadow-sm" aria-label="Marketing dashboard preview card">
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <div>
                <CardTitle className="text-sm">Launch readiness</CardTitle>
                <CardDescription>Q3 activation target</CardDescription>
              </div>
              <Badge variant="secondary">74%</Badge>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Progress value={74}>
              <ProgressLabel>Launch readiness</ProgressLabel>
              <ProgressValue />
            </Progress>
            <Separator />
            <div className="grid gap-2">
              {["Executive brief", "Lifecycle playbook", "Renewal motion"].map((item) => (
                <div
                  key={item}
                  className="flex items-center justify-between gap-3 border border-border px-2 py-2"
                >
                  <span className="text-sm text-foreground">{item}</span>
                  <Badge variant="outline">Ready</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {LANDING_FEATURE_CARDS.map((feature) => (
          <Card key={feature.title} size="sm" data-testid="landing-feature-card" className="min-h-36 shadow-sm">
            <CardHeader>
              <div className="flex size-9 items-center justify-center bg-secondary text-secondary-foreground">
                <Zap className="size-4" aria-hidden />
              </div>
              <CardTitle className="text-sm">{feature.title}</CardTitle>
              <CardDescription className="text-xs leading-5">{feature.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,18rem)]">
        <Card size="sm" data-testid="landing-social-proof" className="shadow-sm">
          <CardContent className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium text-foreground">Trusted by growth teams</p>
              <p className="text-xs text-muted-foreground">
                2,400+ workspaces coordinate renewals and expansion launches here.
              </p>
            </div>
            <AvatarGroup>
              <Avatar size="sm">
                <AvatarFallback>AK</AvatarFallback>
              </Avatar>
              <Avatar size="sm">
                <AvatarFallback>MS</AvatarFallback>
              </Avatar>
              <Avatar size="sm">
                <AvatarFallback>JP</AvatarFallback>
              </Avatar>
              <AvatarGroupCount>+8</AvatarGroupCount>
            </AvatarGroup>
          </CardContent>
        </Card>

        <Card size="sm" data-testid="landing-conversion-strip" className="shadow-sm">
          <CardContent className="flex flex-col justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-foreground">Ready to operationalize?</p>
              <p className="text-xs text-muted-foreground">Invite the team and ship a branded workspace.</p>
            </div>
            <Button type="button" size="sm">
              <ArrowUpRight data-icon="inline-start" aria-hidden />
              Upgrade workspace
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
