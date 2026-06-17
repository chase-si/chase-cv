"use client";

import type { CSSProperties } from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
      <Tabs defaultValue="overview">
        <TabsList aria-label="Preview sections">
          <TabsTrigger value="overview" className="aria-selected:bg-primary aria-selected:text-primary-foreground">
            Overview
          </TabsTrigger>
          <TabsTrigger value="settings" className="aria-selected:bg-primary aria-selected:text-primary-foreground">
            Workspace settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div
            data-testid="saas-status-area"
            className="space-y-3 border border-primary/40 bg-primary/10 p-3"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-sm font-semibold">Platform health</h3>
              <Badge variant="accent" data-testid="saas-accent-badge">
                Performance Watch
              </Badge>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              <article
                data-testid="saas-primary-surface"
                className="space-y-2 border border-primary/40 bg-primary/10 p-3"
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

          <Alert variant="default" data-testid="saas-alert-notification">
            <AlertTitle>Incident response notice</AlertTitle>
            <AlertDescription>
              API latency remains above SLO in APAC. Keep mitigation playbook v2 active until traffic normalizes.
            </AlertDescription>
          </Alert>

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
      </Tabs>
    </section>
  );
}
