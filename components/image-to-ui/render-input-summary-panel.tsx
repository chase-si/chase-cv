"use client";

import Image from "next/image";
import type { CSSProperties } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toggle } from "@/components/ui/toggle";
import { getActiveImageSrc, type ActiveImage } from "@/lib/image-to-ui/active-image-types";
import {
  buildImageToUiRenderInput,
  type ImageToUiRenderInput,
} from "@/lib/image-to-ui/build-image-to-ui-render-input";
import {
  buildScopedPreviewThemeCssVariables,
  derivePreviewThemeTokens,
  type PreviewThemeTokenKey,
} from "@/lib/image-to-ui/derive-preview-theme";

type RenderInputSummaryPanelProps = {
  activeImage: ActiveImage;
  sampleTitleById: Record<string, string>;
  selectedColors: string[];
  onBackToEdit: () => void;
};

const PREVIEW_TOKEN_SUMMARY_KEYS: PreviewThemeTokenKey[] = [
  "primary",
  "secondary",
  "accent",
  "background",
  "card",
  "foreground",
  "border",
  "ring",
];

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

export function RenderInputSummaryPanel({
  activeImage,
  sampleTitleById,
  selectedColors,
  onBackToEdit,
}: RenderInputSummaryPanelProps) {
  const renderInput: ImageToUiRenderInput = buildImageToUiRenderInput(activeImage, selectedColors);
  const imageSrc = getActiveImageSrc(activeImage);
  const imageAlt =
    activeImage.type === "sample"
      ? sampleTitleById[activeImage.sampleId] ?? "示例图片"
      : "本地上传的图片";
  const effectiveThemeMode =
    typeof document !== "undefined" && document.documentElement.classList.contains("dark")
      ? "dark"
      : "light";
  const previewThemeTokens = derivePreviewThemeTokens({
    selectedColors: renderInput.colorRoles.map((entry) => entry.hex),
    mode: effectiveThemeMode,
  });
  const previewRootStyle = buildScopedPreviewThemeCssVariables(previewThemeTokens) as CSSProperties;

  return (
    <section
      className="space-y-6"
      aria-label="渲染输入摘要"
      data-testid="render-input-summary"
      data-render-input={JSON.stringify({
        imageSrc: renderInput.imageSrc,
        colorRoles: renderInput.colorRoles,
      })}
    >
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-base">当前图片摘要</CardTitle>
          <CardDescription>将当前激活图片与三色角色一起作为渲染输入。</CardDescription>
        </CardHeader>
        <CardContent>
          <div
            data-testid="render-input-image-summary"
            className="flex items-center gap-3 border border-border bg-muted/20 p-3"
          >
            <div
              data-testid="render-input-image-thumbnail"
              className="relative h-16 w-24 shrink-0 overflow-hidden border border-border bg-muted/40"
            >
              {activeImage.type === "sample" ? (
                <Image src={imageSrc} alt={imageAlt} fill sizes="96px" className="object-cover" />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element -- blob object URLs are browser-local only
                <img src={imageSrc} alt={imageAlt} className="size-full object-cover" />
              )}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground">已选图片</p>
              <p className="truncate text-xs text-muted-foreground">{imageAlt}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-base">已选颜色角色</CardTitle>
          <CardDescription>按选择顺序对应主色、辅色与强调色。</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="grid gap-3 sm:grid-cols-3" aria-label="三色角色摘要">
            {renderInput.colorRoles.map((entry) => (
              <li
                key={entry.role}
                className="flex items-center gap-3 border border-border bg-card px-3 py-3"
                data-testid={`render-input-color-${entry.role}`}
              >
                <span
                  className="size-10 shrink-0 border border-border"
                  style={{ backgroundColor: entry.hex }}
                  aria-hidden
                />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">{entry.role}</p>
                  <p className="font-mono text-xs text-muted-foreground">{entry.hex}</p>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-base">预览主题 Token</CardTitle>
          <CardDescription>基于三色推导出的只读主题变量，作用域仅限当前预览根节点。</CardDescription>
        </CardHeader>
        <CardContent>
          <ul
            className="grid gap-2 text-xs sm:grid-cols-2 lg:grid-cols-4"
            aria-label="预览主题 token 摘要"
            data-testid="render-preview-token-summary"
          >
            {PREVIEW_TOKEN_SUMMARY_KEYS.map((token) => (
              <li
                key={token}
                className="flex items-center justify-between gap-3 border border-border bg-card px-3 py-2"
                data-testid={`preview-token-${token}`}
              >
                <span className="font-medium text-foreground">{token}</span>
                <span className="font-mono text-[11px] text-muted-foreground">
                  {previewThemeTokens[token]}
                </span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card className="border-dashed shadow-md">
        <CardHeader>
          <CardTitle className="text-base">界面渲染</CardTitle>
          <CardDescription>以下是使用 scoped theme token 的 SaaS 预览切片。</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <section
            data-testid="saas-preview-surface"
            className="space-y-4 border border-border bg-background p-4 text-foreground"
            aria-label="SaaS status and settings preview"
            style={previewRootStyle}
          >
            <Tabs defaultValue="overview">
              <TabsList aria-label="Preview sections">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="settings">Workspace settings</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div data-testid="saas-status-area" className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-sm font-semibold">Platform health</h3>
                    <Badge variant="accent" data-testid="saas-accent-badge">
                      Performance Watch
                    </Badge>
                  </div>
                  <div className="grid gap-3 md:grid-cols-3">
                    <article className="space-y-2 border border-border bg-card p-3">
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
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Accent spotlight
                  </p>
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
          <Button type="button" variant="outline" data-testid="render-back-to-edit" onClick={onBackToEdit}>
            返回编辑
          </Button>
        </CardContent>
      </Card>
    </section>
  );
}
