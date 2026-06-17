"use client";

import type { CSSProperties } from "react";

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
  arr: string;
  status: string;
  statusVariant: "secondary" | "accent" | "outline";
  actionLabel: string;
  actionText: string;
}> = [
  {
    customer: "Acme Robotics",
    arr: "$124k",
    status: "At risk",
    statusVariant: "accent",
    actionLabel: "Open Acme Robotics account",
    actionText: "Open account",
  },
  {
    customer: "Northwind Labs",
    arr: "$88k",
    status: "Healthy",
    statusVariant: "secondary",
    actionLabel: "Schedule QBR for Northwind Labs",
    actionText: "Schedule QBR",
  },
  {
    customer: "Zephyr Mobility",
    arr: "$63k",
    status: "Renewal due",
    statusVariant: "outline",
    actionLabel: "Review Zephyr Mobility renewal",
    actionText: "Review renewal",
  },
];

const LANDING_FEATURE_CARDS = [
  {
    title: "Pipeline intelligence",
    description: "Spot expansion risk and revenue signals before they become escalations.",
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

export function SaasThemePreviewSurface({ previewRootStyle, className }: SaasThemePreviewSurfaceProps) {
  return (
    <section
      data-testid="saas-preview-surface"
      className={cn(
        "space-y-4 border border-border bg-background p-4 text-foreground tracking-normal",
        className,
      )}
      aria-label="SaaS status and settings preview"
      style={previewRootStyle}
    >
      <TooltipProvider>
        <Tabs defaultValue="overview">
          <TabsList aria-label="Preview sections">
            <TabsTrigger value="overview" className="aria-selected:bg-primary aria-selected:text-primary-foreground">
              Overview
            </TabsTrigger>
            <TabsTrigger value="settings" className="aria-selected:bg-primary aria-selected:text-primary-foreground">
              Workspace settings
            </TabsTrigger>
            <TabsTrigger value="landing" className="aria-selected:bg-primary aria-selected:text-primary-foreground">
              Landing page
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div
              data-testid="saas-status-area"
              className="space-y-3 border border-border bg-muted/30 p-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-sm font-semibold">Platform health</h3>
                <Badge variant="accent" data-testid="saas-accent-badge">
                  Performance Watch
                </Badge>
              </div>
              <Progress value={82} data-testid="saas-health-progress">
                <ProgressLabel>SLA attainment</ProgressLabel>
                <ProgressValue />
              </Progress>
              <div className="grid gap-3 md:grid-cols-3">
                <article
                  data-testid="saas-primary-surface"
                  className="space-y-2 border border-secondary/50 bg-secondary/10 p-3"
                >
                  <p className="text-xs text-muted-foreground">Monthly recurring revenue</p>
                  <p className="text-2xl font-semibold" data-testid="saas-metric-mrr">
                    $84,200
                  </p>
                  <Badge variant="secondary" data-testid="saas-secondary-chip">
                    +12.4% vs last month
                  </Badge>
                </article>
                <article className="space-y-2 border border-border bg-card p-3">
                  <p className="text-xs text-muted-foreground">Open incidents</p>
                  <p className="text-2xl font-semibold" data-testid="saas-metric-incidents">
                    3
                  </p>
                  <p className="text-xs text-muted-foreground">2 degraded regions, 1 api latency alert</p>
                </article>
                <article className="space-y-2 border border-border bg-card p-3">
                  <p className="text-xs text-muted-foreground">Enterprise renewals due</p>
                  <p className="text-2xl font-semibold">7</p>
                  <Button type="button" size="sm" data-testid="saas-primary-action">
                    Review contracts
                  </Button>
                </article>
              </div>
            </div>

            <Separator data-testid="saas-overview-separator" />

            <Alert variant="default" data-testid="saas-alert-notification">
              <AlertTitle>Incident response notice</AlertTitle>
              <AlertDescription>
                API latency remains above SLO in APAC. Keep mitigation playbook v2 active until traffic normalizes.
              </AlertDescription>
            </Alert>

            <section className="flex flex-wrap items-center justify-between gap-3 border border-border bg-card p-3">
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">Response team</p>
                <p className="text-xs text-muted-foreground">On-call engineers are actively watching APAC latency.</p>
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
                    className="text-xs font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/30"
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

          <section
            data-testid="saas-data-table-section"
            className="space-y-2 border border-border bg-card p-3"
            aria-label="Customer pipeline table section"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h4 className="text-sm font-semibold text-foreground">Customer pipeline</h4>
              <Badge variant="secondary">Revenue focus</Badge>
            </div>
            <Table aria-label="Customer pipeline health">
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>ARR</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {PREVIEW_CUSTOMER_PIPELINE_ROWS.map((row) => (
                  <TableRow key={row.customer}>
                    <TableCell className="font-medium">{row.customer}</TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">{row.arr}</TableCell>
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
          </section>

          <section
            data-testid="saas-accent-section"
            className="space-y-2 border border-accent/40 bg-accent/10 p-3"
            aria-label="Accent actions"
          >
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Accent spotlight</p>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-foreground">
                Trigger a focused outreach campaign for churn-risk accounts this week.
              </p>
              <Button type="button" size="sm">
                Launch campaign
              </Button>
            </div>
          </section>
          </TabsContent>

          <TabsContent value="settings">
          <form
            className="space-y-4 border border-border bg-card p-4"
            data-testid="saas-settings-form"
            onSubmit={(event) => event.preventDefault()}
          >
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="workspace-name">Workspace name</Label>
                <Input id="workspace-name" defaultValue="Atlas Control Room" />
              </div>
              <div className="space-y-2">
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

            <div className="space-y-2">
              <Label htmlFor="autoscale-threshold">Auto-scale threshold</Label>
              <Slider
                aria-label="Auto-scale threshold"
                id="autoscale-threshold"
                min={20}
                max={95}
                defaultValue={[65]}
              />
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
          </TabsContent>

          <TabsContent value="landing" className="space-y-4">
            <section
              data-testid="landing-page-preview"
              className="space-y-4 border border-border bg-card p-4"
              aria-label="Branded landing page preview"
            >
              <div
                data-testid="landing-hero"
                className="space-y-4 border border-border bg-muted/30 p-4"
              >
                <Badge variant="accent">Customer success OS</Badge>
                <div className="max-w-2xl space-y-2">
                  <h3 className="text-2xl font-semibold tracking-tight text-foreground">
                    Launch customer success faster
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Turn extracted brand colors into a polished SaaS landing page with clear proof,
                    conversion paths, and operational momentum.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button type="button" data-testid="landing-primary-cta">
                    Start free trial
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="border-primary text-primary hover:bg-primary/10"
                  >
                    View demo
                  </Button>
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-3">
                {LANDING_FEATURE_CARDS.map((feature) => (
                  <article
                    key={feature.title}
                    data-testid="landing-feature-card"
                    className="space-y-2 border border-border bg-background p-3"
                  >
                    <h4 className="text-sm font-semibold text-foreground">{feature.title}</h4>
                    <p className="text-xs text-muted-foreground">{feature.description}</p>
                  </article>
                ))}
              </div>

              <Separator />

              <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(0,16rem)]">
                <section
                  data-testid="landing-social-proof"
                  className="flex flex-wrap items-center justify-between gap-3 border border-secondary/50 bg-secondary/10 p-3"
                >
                  <div className="space-y-1">
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
                  data-testid="landing-progress-strip"
                  className="space-y-2 border border-accent/50 bg-accent/10 p-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium text-foreground">Activation target</p>
                    <Badge variant="accent">Q3 launch</Badge>
                  </div>
                  <Progress value={74}>
                    <ProgressLabel>Launch readiness</ProgressLabel>
                    <ProgressValue />
                  </Progress>
                </section>
              </div>
            </section>
          </TabsContent>
        </Tabs>
      </TooltipProvider>
    </section>
  );
}
