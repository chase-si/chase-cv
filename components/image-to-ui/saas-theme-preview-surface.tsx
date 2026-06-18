"use client";

import type { CSSProperties } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress, ProgressLabel, ProgressValue } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Toggle } from "@/components/ui/toggle";
import { cn } from "@/lib/utils";

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

const DASHBOARD_NAV_ITEMS = [
  { label: "Dashboard", icon: LayoutDashboard, active: true },
  { label: "Lifecycle", icon: Activity, active: false },
  { label: "Documents", icon: FileText, active: false },
  { label: "Team", icon: Users, active: false },
  { label: "Settings", icon: Settings, active: false },
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
  return (
    <section
      data-testid="saas-preview-surface"
      className={cn(
        "border border-border bg-background p-3 text-foreground tracking-normal sm:p-4",
        className,
      )}
      aria-label="SaaS status and settings preview"
      style={previewRootStyle}
    >
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
                  Scoped theme preview generated from selected image colors
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <TabsList aria-label="Preview sections">
                <TabsTrigger
                  value="overview"
                  className="aria-selected:bg-primary aria-selected:text-primary-foreground"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger
                  value="settings"
                  className="aria-selected:bg-primary aria-selected:text-primary-foreground"
                >
                  Workspace settings
                </TabsTrigger>
                <TabsTrigger
                  value="landing"
                  className="aria-selected:bg-primary aria-selected:text-primary-foreground"
                >
                  Landing page
                </TabsTrigger>
              </TabsList>
              <Button type="button" variant="outline" size="sm">
                <ArrowUpRight data-icon="inline-start" aria-hidden />
                Share
              </Button>
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
    </section>
  );
}

function DashboardPreview() {
  return (
    <section
      data-testid="saas-dashboard-preview"
      className="overflow-hidden border border-border bg-card"
      aria-label="Dashboard theme preview"
    >
      <div className="grid min-h-[42rem] lg:grid-cols-[14rem_minmax(0,1fr)]">
        <aside
          data-testid="saas-dashboard-sidebar"
          className="hidden border-r border-border bg-muted/30 p-3 lg:flex lg:flex-col lg:gap-5"
          aria-label="Dashboard navigation"
        >
          <div className="flex items-center gap-2 border border-border bg-background p-2">
            <div className="flex size-8 items-center justify-center bg-primary text-primary-foreground">
              A
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-foreground">Acme Inc.</p>
              <p className="truncate text-xs text-muted-foreground">Scale plan</p>
            </div>
          </div>
          <nav className="flex flex-col gap-1" aria-label="Preview dashboard sections">
            {DASHBOARD_NAV_ITEMS.map((item) => {
              const Icon = item.icon;

              return (
                <button
                  key={item.label}
                  type="button"
                  aria-current={item.active ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 text-left text-sm text-muted-foreground transition-colors",
                    "hover:bg-background hover:text-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none",
                    item.active && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                  )}
                >
                  <Icon className="size-4" aria-hidden />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
          <div className="mt-auto flex flex-col gap-2 border border-accent/40 bg-accent/10 p-3">
            <Badge variant="accent" data-testid="saas-accent-badge">
              Performance Watch
            </Badge>
            <p className="text-xs text-muted-foreground">
              Expansion risk is concentrated in enterprise renewals.
            </p>
          </div>
        </aside>

        <div className="min-w-0 bg-background">
          <div
            data-testid="saas-dashboard-toolbar"
            className="flex flex-col gap-3 border-b border-border bg-card p-4 md:flex-row md:items-center md:justify-between"
          >
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-lg font-semibold tracking-tight text-foreground">Documents</h3>
                <Badge variant="secondary" data-testid="saas-secondary-chip">
                  Revenue focus
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Executive status, customer pipeline, and expansion momentum.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button type="button" variant="outline" size="sm">
                <Search data-icon="inline-start" aria-hidden />
                Search
              </Button>
              <Button type="button" variant="outline" size="icon-sm" aria-label="Notifications">
                <Bell aria-hidden />
              </Button>
              <Button type="button" size="sm" data-testid="saas-primary-action">
                Quick Create
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-4 p-4">
            <section
              data-testid="saas-status-area"
              className="grid gap-3 md:grid-cols-2 xl:grid-cols-4"
              aria-label="Platform health"
            >
              {DASHBOARD_KPI_CARDS.map((card) => (
                <article
                  key={card.label}
                  data-testid="saas-kpi-card"
                  className="flex min-h-32 flex-col justify-between gap-4 border border-border bg-card p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm text-muted-foreground">{card.label}</p>
                      <p className="mt-1 text-2xl font-semibold text-foreground" data-testid={card.testId}>
                        {card.value}
                      </p>
                    </div>
                    <Badge variant="secondary">{card.delta}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{card.detail}</p>
                </article>
              ))}
            </section>

            <div className="grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(0,0.85fr)]">
              <section
                data-testid="saas-revenue-chart-section"
                className="flex min-h-80 flex-col gap-4 border border-border bg-card p-4"
                aria-label="Revenue trend chart"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h4 className="text-base font-semibold text-foreground">Total visitors</h4>
                    <p className="text-sm text-muted-foreground">Revenue and expansion trend for the last 6 months.</p>
                  </div>
                  <Badge variant="outline">Last 6 months</Badge>
                </div>
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
              </section>

              <section
                data-testid="saas-segment-chart-section"
                className="flex min-h-80 flex-col gap-4 border border-border bg-card p-4"
                aria-label="Segment bar chart"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h4 className="text-base font-semibold text-foreground">Account segments</h4>
                    <p className="text-sm text-muted-foreground">Active and risk volume by segment.</p>
                  </div>
                  <Badge variant="accent">Live</Badge>
                </div>
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
                        cursor={{ fill: "var(--muted)" }}
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
              </section>
            </div>

            <Alert variant="default" data-testid="saas-alert-notification">
              <AlertTitle>Incident response notice</AlertTitle>
              <AlertDescription>
                API latency remains above SLO in APAC. Keep mitigation playbook v2 active until traffic normalizes.
              </AlertDescription>
            </Alert>

            <section className="flex flex-wrap items-center justify-between gap-3 border border-border bg-card p-3">
              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium text-foreground">Response team</p>
                <p className="text-xs text-muted-foreground">
                  On-call engineers are actively watching APAC latency.
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
                    aria-label="Show incident response details"
                  >
                    Details
                  </TooltipTrigger>
                  <TooltipContent side="left">
                    Escalation owner, support lead, and infra SRE are assigned.
                  </TooltipContent>
                </Tooltip>
              </div>
            </section>

            <CustomerPipelineTable />

            <section
              data-testid="saas-accent-section"
              className="flex flex-col gap-3 border border-accent/40 bg-accent/10 p-4 md:flex-row md:items-center md:justify-between"
              aria-label="Accent actions"
            >
              <div className="min-w-0">
                <p className="text-xs font-medium uppercase text-muted-foreground">Accent spotlight</p>
                <p className="text-sm text-foreground">
                  Trigger a focused outreach campaign for churn-risk accounts this week.
                </p>
              </div>
              <Button type="button" size="sm">
                <Zap data-icon="inline-start" aria-hidden />
                Launch campaign
              </Button>
            </section>
          </div>
        </div>
      </div>
    </section>
  );
}

function CustomerPipelineTable() {
  return (
    <section
      data-testid="saas-data-table-section"
      className="flex flex-col gap-3 border border-border bg-card p-4"
      aria-label="Customer pipeline table section"
    >
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h4 className="text-base font-semibold text-foreground">Customer pipeline</h4>
          <p className="text-sm text-muted-foreground">Prioritized accounts for this week&apos;s operators.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button type="button" variant="outline" size="sm">
            Customize Columns
          </Button>
          <Button type="button" size="sm">
            Add Section
          </Button>
        </div>
      </div>
      <Table aria-label="Customer pipeline health">
        <TableHeader>
          <TableRow>
            <TableHead>Customer</TableHead>
            <TableHead>Owner</TableHead>
            <TableHead>ARR</TableHead>
            <TableHead>Stage</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
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
        <p>0 of 68 row(s) selected.</p>
        <div className="flex items-center gap-2">
          <span>Page 1 of 7</span>
          <Button type="button" variant="outline" size="icon-xs" aria-label="Go to previous page">
            <ChevronLeft aria-hidden />
          </Button>
          <Button type="button" variant="outline" size="icon-xs" aria-label="Go to next page">
            <ChevronRight aria-hidden />
          </Button>
        </div>
      </div>
    </section>
  );
}

function WorkspaceSettingsPreview() {
  return (
    <form
      className="flex flex-col gap-4 border border-border bg-card p-4"
      data-testid="saas-settings-form"
      onSubmit={(event) => event.preventDefault()}
    >
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
            <SelectContent>
              <SelectItem value="starter">Starter</SelectItem>
              <SelectItem value="scale">Scale</SelectItem>
              <SelectItem value="enterprise">Enterprise</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="autoscale-threshold">Auto-scale threshold</Label>
        <Slider aria-label="Auto-scale threshold" id="autoscale-threshold" min={20} max={95} defaultValue={[65]} />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Toggle type="button" variant="outline" defaultPressed>
          Enable maintenance mode
        </Toggle>
        <label className="flex items-center gap-2 text-sm text-foreground">
          <Checkbox defaultChecked aria-label="Notify on-call via SMS" />
          <span>Notify on-call via SMS</span>
        </label>
        <label className="flex items-center gap-2 text-sm text-foreground">
          <Switch defaultChecked aria-label="Allow public status page" />
          <span>Allow public status page</span>
        </label>
      </div>

      <div className="flex flex-wrap items-center justify-end gap-2">
        <Button type="button" variant="secondary">
          Reset
        </Button>
        <Button type="submit">Save changes</Button>
      </div>
    </form>
  );
}

function MarketingPreview() {
  return (
    <section
      data-testid="landing-page-preview"
      className="overflow-hidden border border-border bg-card"
      aria-label="Branded landing page preview"
    >
      <nav
        data-testid="landing-nav"
        className="flex flex-col gap-3 border-b border-border bg-background/80 p-4 md:flex-row md:items-center md:justify-between"
        aria-label="Marketing preview navigation"
      >
        <div className="flex items-center gap-2">
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
      </nav>

      <div data-testid="landing-hero" className="grid gap-6 bg-muted/30 p-5 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="flex min-w-0 flex-col justify-center gap-5 py-6">
          <Badge variant="accent">Customer success OS</Badge>
          <div className="max-w-2xl">
            <h3 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
              Launch customer success faster
            </h3>
            <p className="mt-3 text-sm leading-6 text-muted-foreground md:text-base">
              Turn extracted brand colors into a polished SaaS landing page with clear proof,
              conversion paths, and operational momentum.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="button" data-testid="landing-primary-cta">
              Start free trial
            </Button>
            <Button type="button" variant="outline" className="border-primary text-primary hover:bg-primary/10">
              View demo
            </Button>
          </div>
        </div>

        <aside
          data-testid="landing-hero-panel"
          className="flex flex-col gap-3 border border-border bg-card p-4 shadow-md"
          aria-label="Marketing dashboard preview card"
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-foreground">Launch readiness</p>
              <p className="text-xs text-muted-foreground">Q3 activation target</p>
            </div>
            <Badge variant="secondary">74%</Badge>
          </div>
          <Progress value={74}>
            <ProgressLabel>Launch readiness</ProgressLabel>
            <ProgressValue />
          </Progress>
          <Separator />
          <div className="grid gap-2">
            {["Executive brief", "Lifecycle playbook", "Renewal motion"].map((item) => (
              <div key={item} className="flex items-center justify-between gap-3 border border-border bg-background p-2">
                <span className="text-sm text-foreground">{item}</span>
                <Badge variant="outline">Ready</Badge>
              </div>
            ))}
          </div>
        </aside>
      </div>

      <div className="grid gap-3 p-4 md:grid-cols-3">
        {LANDING_FEATURE_CARDS.map((feature) => (
          <article
            key={feature.title}
            data-testid="landing-feature-card"
            className="flex min-h-36 flex-col justify-between gap-4 border border-border bg-background p-4"
          >
            <div className="flex size-9 items-center justify-center bg-secondary text-secondary-foreground">
              <Zap className="size-4" aria-hidden />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground">{feature.title}</h4>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">{feature.description}</p>
            </div>
          </article>
        ))}
      </div>

      <div className="grid gap-3 border-t border-border p-4 md:grid-cols-[minmax(0,1fr)_minmax(0,18rem)]">
        <section
          data-testid="landing-social-proof"
          className="flex flex-wrap items-center justify-between gap-3 border border-secondary/50 bg-secondary/10 p-4"
        >
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
        </section>

        <section
          data-testid="landing-conversion-strip"
          className="flex flex-col justify-between gap-3 border border-accent/50 bg-accent/10 p-4"
        >
          <div>
            <p className="text-sm font-medium text-foreground">Ready to operationalize?</p>
            <p className="text-xs text-muted-foreground">Invite the team and ship a branded workspace.</p>
          </div>
          <Button type="button" size="sm">
            <ArrowUpRight data-icon="inline-start" aria-hidden />
            Upgrade workspace
          </Button>
        </section>
      </div>
    </section>
  );
}
