"use client";

import * as React from "react";
import {
  AlertTriangle,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  CheckCircle2,
  HelpCircle,
  Maximize2,
  Move,
  ShieldAlert,
  SlidersHorizontal,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  summarizeFurnitureDecision,
  type FurnitureDecisionStatus,
} from "@/lib/floor-plan/furniture-decision";
import { getDefaultFurnitureCatalog } from "@/lib/floor-plan/furniture-catalog";
import {
  moveFurnitureInstance,
  resizeFurnitureInstance,
} from "@/lib/floor-plan/furniture-operations";
import type { RuleResult } from "@/lib/floor-plan/rules";
import type { FloorPlan } from "@/lib/floor-plan/types";
import { cn } from "@/lib/utils";

type FurnitureDecisionControlsProps = {
  plan: FloorPlan;
  targetRoomId: string | null;
  targetFurnitureId: string | null;
  ruleResults: RuleResult[];
  locale?: string;
  onUpdatePlan: (plan: FloorPlan, description?: string) => void | Promise<void>;
  onAdjustRoom: () => void;
  onMoreSettings: () => void;
};

const statusStyles: Record<FurnitureDecisionStatus, string> = {
  suitable: "border-emerald-500/35 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  caution: "border-amber-500/35 bg-amber-500/10 text-amber-700 dark:text-amber-300",
  "not-recommended": "border-destructive/35 bg-destructive/10 text-destructive",
  unavailable: "border-border bg-muted/50 text-muted-foreground",
};

function StatusIcon({ status }: { status: FurnitureDecisionStatus }) {
  if (status === "suitable") return <CheckCircle2 className="h-4 w-4" />;
  if (status === "caution") return <AlertTriangle className="h-4 w-4" />;
  if (status === "not-recommended") return <ShieldAlert className="h-4 w-4" />;
  return <HelpCircle className="h-4 w-4" />;
}

export function FurnitureDecisionControls({
  plan,
  targetRoomId,
  targetFurnitureId,
  ruleResults,
  locale,
  onUpdatePlan,
  onAdjustRoom,
  onMoreSettings,
}: FurnitureDecisionControlsProps) {
  const isZh = locale?.toLowerCase().startsWith("zh") ?? false;
  const catalog = React.useMemo(() => getDefaultFurnitureCatalog(), []);
  const furniture = targetFurnitureId
    ? plan.furniture.find((item) => item.id === targetFurnitureId) ?? null
    : null;
  const definition = furniture
    ? catalog.definitions.find((item) => item.id === furniture.definitionId) ?? null
    : null;

  const decision = React.useMemo(
    () =>
      summarizeFurnitureDecision({
        plan,
        targetRoomId,
        targetFurnitureId,
        ruleResults,
        locale,
      }),
    [plan, targetRoomId, targetFurnitureId, ruleResults, locale],
  );

  const sizeOptions = React.useMemo(() => {
    if (!furniture || !definition) return [];
    const range = definition.allowedSizeRanges?.width;
    if (!range) return [furniture.width];

    const preferred = definition.category === "bed"
      ? [1500, 1600, 1800]
      : [range.min, definition.defaultSize.width, range.max];

    return Array.from(new Set(preferred.filter((value) => value >= range.min && value <= range.max)));
  }, [definition, furniture]);

  const conciseSummary = React.useMemo(() => {
    if (decision.status === "suitable") {
      return isZh
        ? "当前尺寸通过已配置的边界、碰撞与基础净距规则，可以优先考虑。"
        : "This size passes the configured boundary, collision, and basic-clearance checks.";
    }
    if (decision.status === "caution") {
      return isZh
        ? "家具可以放入，但局部净距偏紧。试着缩小尺寸或轻微移动，观察下方实测变化。"
        : "It fits, but some clearances are tight. Try a smaller size or nudge the placement.";
    }
    if (decision.status === "not-recommended") {
      return isZh
        ? "当前尺寸或位置存在明显冲突，建议先缩小家具或调整摆放。"
        : "The current size or position has a clear conflict. Resize or reposition it first.";
    }
    return isZh
      ? "当前户型尚未标定真实尺寸，先调整房间尺寸后才能给出可靠建议。"
      : "Calibrate the room dimensions before relying on the recommendation.";
  }, [decision.status, isZh]);

  const keyIssues = React.useMemo(() => {
    const unique = new Map<string, (typeof decision.relevantIssues)[number]>();
    for (const issue of decision.relevantIssues) {
      const key = `${issue.ruleId}-${issue.measuredFormatted ?? ""}-${issue.recommendedFormatted ?? ""}`;
      if (!unique.has(key)) unique.set(key, issue);
    }
    return Array.from(unique.values()).slice(0, 2);
  }, [decision]);

  const handleResize = (width: number) => {
    if (!furniture) return;
    const result = resizeFurnitureInstance(
      plan,
      catalog,
      furniture.id,
      width,
      furniture.depth,
      { locale, clamp: true },
    );
    if (result.success) {
      void onUpdatePlan(result.plan, "Resize target furniture");
    }
  };

  const handleNudge = (dx: number, dy: number) => {
    if (!furniture) return;
    const result = moveFurnitureInstance(plan, furniture.id, furniture.x + dx, furniture.y + dy);
    if (result.success) {
      void onUpdatePlan(result.plan, "Nudge target furniture");
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-[11px] text-muted-foreground">
              {decision.roomName}
            </p>
            <h3 className="text-base font-semibold text-foreground">
              {decision.furnitureName}
              {decision.dimensions ? ` · ${(decision.dimensions.widthMm / 1000).toFixed(1)}m` : ""}
            </h3>
          </div>
          <Badge
            variant="outline"
            className={cn("gap-1.5 px-2.5 py-1 text-xs font-semibold", statusStyles[decision.status])}
          >
            <StatusIcon status={decision.status} />
            {decision.statusLabel}
          </Badge>
        </div>
        <p className="text-xs leading-relaxed text-muted-foreground">{conciseSummary}</p>
      </div>

      {keyIssues.length > 0 && (
        <div className="space-y-2 rounded-xl border border-border/70 bg-muted/25 p-3">
          <p className="text-[11px] font-medium text-foreground">
            {isZh ? "最需要关注" : "Key checks"}
          </p>
          {keyIssues.map((issue) => (
            <div key={`${issue.ruleId}-${issue.measuredFormatted}`} className="space-y-1">
              <div className="flex items-center justify-between gap-3 text-[11px]">
                <span className="truncate text-muted-foreground">{issue.title}</span>
                <span className="shrink-0 font-mono font-medium text-foreground">
                  {issue.measuredFormatted ?? "—"}
                  {issue.recommendedFormatted ? ` / ${issue.recommendedFormatted}` : ""}
                </span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                <div
                  className={cn(
                    "h-full rounded-full",
                    issue.severity === "error" ? "bg-destructive" : "bg-amber-500",
                  )}
                  style={{
                    width: `${Math.max(
                      12,
                      Math.min(
                        100,
                        typeof issue.measuredValue === "number" &&
                          typeof issue.recommendedValue === "number" &&
                          issue.recommendedValue > 0
                          ? (issue.measuredValue / issue.recommendedValue) * 100
                          : 38,
                      ),
                    )}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {furniture && sizeOptions.length > 0 && (
        <div className="space-y-2.5">
          <div className="flex items-center gap-1.5 text-xs font-medium text-foreground">
            <Maximize2 className="h-3.5 w-3.5 text-primary" />
            {isZh ? "试试其他宽度" : "Try another width"}
          </div>
          <div className="grid grid-cols-3 gap-2">
            {sizeOptions.map((width) => (
              <Button
                key={width}
                type="button"
                size="sm"
                variant={furniture.width === width ? "default" : "outline"}
                onClick={() => handleResize(width)}
                className="h-9 font-mono text-xs"
              >
                {(width / 1000).toFixed(1)}m
              </Button>
            ))}
          </div>
        </div>
      )}

      {furniture && (
        <div className="space-y-2.5">
          <div className="flex items-center gap-1.5 text-xs font-medium text-foreground">
            <Move className="h-3.5 w-3.5 text-primary" />
            {isZh ? "微调摆放位置" : "Fine-tune placement"}
          </div>
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
            <Button type="button" variant="outline" size="icon-sm" onClick={() => handleNudge(-100, 0)} aria-label={isZh ? "向左移动" : "Move left"}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="grid grid-cols-2 gap-2">
              <Button type="button" variant="outline" size="icon-sm" onClick={() => handleNudge(0, -100)} aria-label={isZh ? "向上移动" : "Move up"}>
                <ArrowUp className="h-4 w-4" />
              </Button>
              <Button type="button" variant="outline" size="icon-sm" onClick={() => handleNudge(0, 100)} aria-label={isZh ? "向下移动" : "Move down"}>
                <ArrowDown className="h-4 w-4" />
              </Button>
            </div>
            <Button type="button" variant="outline" size="icon-sm" onClick={() => handleNudge(100, 0)} aria-label={isZh ? "向右移动" : "Move right"}>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-center text-[10px] text-muted-foreground">
            {isZh ? "每次移动 100 mm，结果会即时更新" : "Moves 100 mm per tap; results update instantly"}
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-2 border-t border-border/60 pt-3">
        <Button type="button" variant="ghost" size="sm" onClick={onAdjustRoom} className="justify-start px-2 text-xs text-muted-foreground">
          <Maximize2 className="h-3.5 w-3.5" />
          {isZh ? "调整房间" : "Adjust room"}
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={onMoreSettings} className="justify-end px-2 text-xs text-muted-foreground">
          <SlidersHorizontal className="h-3.5 w-3.5" />
          {isZh ? "更多设置" : "More settings"}
        </Button>
      </div>
    </div>
  );
}
