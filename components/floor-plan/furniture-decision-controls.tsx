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
  RotateCw,
  ShieldAlert,
  Trash2,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  summarizeFurnitureDecision,
  type FurnitureDecisionStatus,
} from "@/lib/floor-plan/furniture-decision";
import { getDefaultFurnitureCatalog } from "@/lib/floor-plan/furniture-catalog";
import {
  changeFurnitureSpecification,
  deleteFurnitureInstance,
  moveFurnitureInstance,
  rotateFurnitureInstance,
} from "@/lib/floor-plan/furniture-operations";
import type { RuleResult } from "@/lib/floor-plan/rules";
import type { FloorPlan, FurnitureCatalog } from "@/lib/floor-plan/types";
import { cn } from "@/lib/utils";

type FurnitureDecisionControlsProps = {
  plan: FloorPlan;
  catalog?: FurnitureCatalog;
  targetRoomId: string | null;
  targetFurnitureId: string | null;
  ruleResults: RuleResult[];
  locale?: string;
  onUpdatePlan: (plan: FloorPlan, description?: string) => void | Promise<void>;
  onChangeSpecification?: (furnitureId: string, specificationId: string) => void;
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
  catalog: propCatalog,
  targetRoomId,
  targetFurnitureId,
  ruleResults,
  locale,
  onUpdatePlan,
  onChangeSpecification,
}: FurnitureDecisionControlsProps) {
  const isZh = locale?.toLowerCase().startsWith("zh") ?? false;
  const catalog = React.useMemo(
    () => propCatalog ?? getDefaultFurnitureCatalog(),
    [propCatalog],
  );
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

  const specifications = React.useMemo(() => {
    return definition?.specifications ?? [];
  }, [definition]);

  const activeSpecId = React.useMemo(() => {
    if (!furniture || !definition) return undefined;
    if (
      furniture.specificationId &&
      definition.specifications.some((s) => s.id === furniture.specificationId)
    ) {
      return furniture.specificationId;
    }
    const byDims = definition.specifications.find(
      (s) => s.width === furniture.width && s.depth === furniture.depth,
    );
    return byDims?.id ?? definition.specifications[0]?.id;
  }, [definition, furniture]);

  const conciseSummary = React.useMemo(() => {
    if (decision.status === "suitable") {
      return isZh
        ? "当前规格通过已配置的边界、碰撞与方向净距规则，可以优先考虑。"
        : "This specification passes the configured boundary, collision, and directional clearance checks.";
    }
    if (decision.status === "caution") {
      return isZh
        ? "家具可以放入，但局部净距偏紧。试着切换预设规格或轻微移动，观察下方实测变化。"
        : "It fits, but some clearances are tight. Try another preset specification or nudge the placement.";
    }
    if (decision.status === "not-recommended") {
      return isZh
        ? "当前规格或位置存在明显冲突，建议切换更小的预设规格或调整摆放。"
        : "The current specification or position has a clear conflict. Switch to a smaller specification or reposition it.";
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

  const handleSelectSpecification = (specificationId: string) => {
    if (!furniture) return;
    if (onChangeSpecification) {
      onChangeSpecification(furniture.id, specificationId);
      return;
    }
    const result = changeFurnitureSpecification(
      plan,
      catalog,
      furniture.id,
      specificationId,
    );
    if (result.success) {
      void onUpdatePlan(result.plan, "Change furniture specification");
    }
  };

  const handleNudge = (dx: number, dy: number) => {
    if (!furniture) return;
    const result = moveFurnitureInstance(plan, furniture.id, furniture.x + dx, furniture.y + dy);
    if (result.success) {
      void onUpdatePlan(result.plan, "Nudge target furniture");
    }
  };

  const handleRotate = () => {
    if (!furniture) return;
    const result = rotateFurnitureInstance(plan, furniture.id, 90);
    if (result.success) {
      void onUpdatePlan(result.plan, "Rotate target furniture");
    }
  };

  const handleDelete = () => {
    if (!furniture) return;
    const result = deleteFurnitureInstance(plan, furniture.id);
    if (result.success) {
      void onUpdatePlan(result.plan, "Delete target furniture");
    }
  };

  return (
    <div data-testid="furniture-decision-controls" className="space-y-4">
      <div className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-[11px] text-muted-foreground">
              {decision.roomName}
            </p>
            <h3 className="text-base font-semibold text-foreground">
              {decision.furnitureName}
              {decision.dimensions ? ` · ${decision.dimensions.formatted}` : ""}
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

      {furniture && specifications.length > 0 && (
        <div data-testid="decision-controls-specifications" className="space-y-2.5">
          <div className="flex items-center gap-1.5 text-xs font-medium text-foreground">
            <Maximize2 className="h-3.5 w-3.5 text-primary" />
            {isZh ? "切换预设规格" : "Switch Predefined Specification"}
          </div>
          <div className="grid grid-cols-2 gap-2">
            {specifications.map((spec) => {
              const isSelected = activeSpecId === spec.id;
              return (
                <Button
                  key={spec.id}
                  type="button"
                  size="sm"
                  variant={isSelected ? "default" : "outline"}
                  data-testid={`decision-spec-option-${spec.id}`}
                  aria-pressed={isSelected}
                  onClick={() => handleSelectSpecification(spec.id)}
                  className="h-9 font-mono text-xs"
                >
                  {spec.name}
                </Button>
              );
            })}
          </div>
        </div>
      )}

      {furniture && (
        <div className="space-y-2.5">
          <div className="flex items-center gap-1.5 text-xs font-medium text-foreground">
            <Move className="h-3.5 w-3.5 text-primary" />
            {isZh ? "微调位置与旋转" : "Fine-tune Placement"}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              data-testid="rotate-decision-furniture-btn"
              onClick={handleRotate}
              className="h-8 text-xs gap-1.5"
            >
              <RotateCw className="h-3.5 w-3.5" />
              <span>{isZh ? "旋转 90°" : "Rotate 90°"}</span>
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              data-testid="delete-decision-furniture-btn"
              onClick={handleDelete}
              className="h-8 text-xs gap-1.5 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>{isZh ? "删除" : "Delete"}</span>
            </Button>
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
    </div>
  );
}
