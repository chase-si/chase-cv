"use client";

import * as React from "react";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Info,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { FloorPlan, SpaceRuleConfig } from "@/lib/floor-plan/types";
import type { RuleResult } from "@/lib/floor-plan/rules";
import {
  summarizeFurnitureDecision,
  type FurnitureDecisionStatus,
} from "@/lib/floor-plan/furniture-decision";
import { useFloorPlanI18n } from "@/lib/floor-plan/i18n";
import { cn } from "@/lib/utils";
import type { EntitySelectHandler, SelectedEntity } from "./types";

export interface FurnitureDecisionPanelProps {
  plan: FloorPlan;
  targetRoomId: string | null;
  targetFurnitureId: string | null;
  ruleResults?: RuleResult[];
  config?: SpaceRuleConfig;
  selectedEntity?: SelectedEntity | null;
  onSelectEntity?: EntitySelectHandler;
  locale?: string;
  className?: string;
}

export function FurnitureDecisionPanel({
  plan,
  targetRoomId,
  targetFurnitureId,
  ruleResults,
  config,
  selectedEntity,
  onSelectEntity,
  locale,
  className = "",
}: FurnitureDecisionPanelProps) {
  const i18n = useFloorPlanI18n(locale);
  const isZh = i18n.locale === "zh";

  const decision = React.useMemo(() => {
    return summarizeFurnitureDecision({
      plan,
      targetRoomId,
      targetFurnitureId,
      ruleResults,
      config,
      locale,
    });
  }, [plan, targetRoomId, targetFurnitureId, ruleResults, config, locale]);

  const resolveEntityType = React.useCallback(
    (entityId: string): "furniture" | "wall" | "room" | "opening" | null => {
      if (plan.furniture.some((f) => f.id === entityId)) return "furniture";
      if (plan.walls.some((w) => w.id === entityId)) return "wall";
      if (plan.rooms.some((r) => r.id === entityId)) return "room";
      if (plan.openings.some((o) => o.id === entityId)) return "opening";
      return null;
    },
    [plan],
  );

  const getEntityLabel = React.useCallback(
    (entityId: string) => {
      const type = resolveEntityType(entityId);
      if (isZh) {
        switch (type) {
          case "furniture":
            return "家具";
          case "wall":
            return "墙体";
          case "room":
            return "房间";
          case "opening":
            return "门窗";
          default:
            return "构件";
        }
      }
      switch (type) {
        case "furniture":
          return "Furniture";
        case "wall":
          return "Wall";
        case "room":
          return "Room";
        case "opening":
          return "Opening";
        default:
          return "Entity";
      }
    },
    [resolveEntityType, isZh],
  );

  const handleEntityClick = React.useCallback(
    (entityId: string) => {
      const type = resolveEntityType(entityId);
      if (type && onSelectEntity) {
        onSelectEntity({ type, id: entityId });
      }
    },
    [resolveEntityType, onSelectEntity],
  );

  const renderStatusBadge = (status: FurnitureDecisionStatus) => {
    switch (status) {
      case "suitable":
        return (
          <Badge
            data-testid="decision-status-badge"
            variant="outline"
            className="border-emerald-500/40 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 gap-1 px-2 py-0.5 text-xs font-semibold"
          >
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
            <span data-testid="decision-status-suitable">{decision.statusLabel}</span>
          </Badge>
        );
      case "caution":
        return (
          <Badge
            data-testid="decision-status-badge"
            variant="outline"
            className="border-amber-500/40 text-amber-600 dark:text-amber-400 bg-amber-500/10 gap-1 px-2 py-0.5 text-xs font-semibold"
          >
            <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
            <span data-testid="decision-status-caution">{decision.statusLabel}</span>
          </Badge>
        );
      case "not-recommended":
        return (
          <Badge
            data-testid="decision-status-badge"
            variant="outline"
            className="border-destructive/40 text-destructive bg-destructive/10 gap-1 px-2 py-0.5 text-xs font-semibold"
          >
            <AlertCircle className="h-3.5 w-3.5 text-destructive" />
            <span data-testid="decision-status-not-recommended">{decision.statusLabel}</span>
          </Badge>
        );
      case "unavailable":
      default:
        return (
          <Badge
            data-testid="decision-status-badge"
            variant="outline"
            className="border-muted-foreground/40 text-muted-foreground bg-muted/20 gap-1 px-2 py-0.5 text-xs font-semibold"
          >
            <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
            <span data-testid="decision-status-unavailable">{decision.statusLabel}</span>
          </Badge>
        );
    }
  };

  return (
    <div
      data-testid="furniture-decision-panel"
      className={cn("rounded-xl border border-border bg-card p-3 space-y-3", className)}
    >
      {/* 1. Header: Section Tag, Status Badge, Title */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            {decision.status === "suitable" ? (
              <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
            ) : decision.status === "caution" ? (
              <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
            ) : decision.status === "not-recommended" ? (
              <ShieldAlert className="h-4 w-4 text-destructive shrink-0" />
            ) : (
              <Info className="h-4 w-4 text-muted-foreground shrink-0" />
            )}
            <span className="font-semibold text-xs text-foreground">
              {isZh ? "目标家具决策结论" : "Furniture Decision Verdict"}
            </span>
          </div>
          {renderStatusBadge(decision.status)}
        </div>

        <h3
          data-testid="decision-title"
          className="text-sm font-semibold text-foreground leading-snug pt-0.5"
        >
          {decision.title}
        </h3>
      </div>

      {/* 2. Target Context & Dimensions */}
      {decision.hasTargetFurniture && decision.dimensions && (
        <div
          data-testid="decision-target-details"
          className="rounded-lg border border-border/80 bg-muted/30 p-2.5 space-y-1.5 text-xs"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-muted-foreground">
              {isZh ? "检测对象" : "Target Subject"}
            </span>
            <span
              data-testid="decision-dimensions"
              className="font-mono font-medium text-foreground text-[11px]"
            >
              {decision.dimensions.formatted}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs font-medium">
            <span className="text-foreground">{decision.roomName}</span>
            <span className="text-foreground">{decision.furnitureName}</span>
          </div>
        </div>
      )}

      {/* 3. Decision Summary Narrative (AC-15) */}
      <div
        data-testid="decision-summary-card"
        className={cn(
          "rounded-lg border p-2.5 text-xs leading-relaxed transition-colors",
          decision.status === "suitable" && "border-emerald-500/30 bg-emerald-500/5 text-foreground",
          decision.status === "caution" && "border-amber-500/30 bg-amber-500/5 text-foreground",
          decision.status === "not-recommended" && "border-destructive/30 bg-destructive/5 text-foreground",
          decision.status === "unavailable" && "border-border/80 bg-muted/20 text-muted-foreground",
        )}
      >
        <p data-testid="decision-summary" className="text-xs leading-relaxed">
          {decision.summary}
        </p>
      </div>

      {/* 4. Relevant Issues Prioritized List (AC-16, AC-17) */}
      {decision.relevantIssues.length > 0 ? (
        <div data-testid="decision-issues-list" className="space-y-2 pt-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-foreground">
              {isZh ? "相关空间问题说明" : "Relevant Spatial Issues"}
            </span>
            <Badge variant="outline" className="text-[10px] font-mono px-1.5 py-0">
              {decision.relevantIssues.length} {isZh ? "项" : "Issues"}
            </Badge>
          </div>

          <div className="space-y-2">
            {decision.relevantIssues.map((issue, idx) => {
              const isError = issue.severity === "error";
              const isWarning = issue.severity === "warning";

              return (
                <div
                  key={`${issue.ruleId}-${issue.relatedEntityIds.join("-")}-${idx}`}
                  data-testid={`decision-issue-${issue.ruleId}`}
                  className={cn(
                    "rounded-lg border p-2.5 space-y-1.5 text-xs transition-colors",
                    isError && "border-destructive/30 bg-destructive/5",
                    isWarning && "border-amber-500/30 bg-amber-500/5",
                    !isError && !isWarning && "border-border/80 bg-muted/20",
                  )}
                >
                  <div className="flex items-center justify-between gap-1.5">
                    <div className="flex items-center gap-1.5 font-medium text-foreground">
                      {isError ? (
                        <AlertCircle className="h-3.5 w-3.5 text-destructive shrink-0" />
                      ) : isWarning ? (
                        <AlertTriangle className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                      ) : (
                        <Info className="h-3.5 w-3.5 text-primary shrink-0" />
                      )}
                      <span>{issue.title}</span>
                    </div>
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-[9px] font-mono uppercase px-1.5 py-0",
                        isError && "border-destructive/40 text-destructive",
                        isWarning && "border-amber-500/40 text-amber-600 dark:text-amber-400",
                      )}
                    >
                      {isZh ? (isError ? "冲突" : "警告") : issue.severity}
                    </Badge>
                  </div>

                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    {issue.message}
                  </p>

                  {/* Measured vs Recommended Values (AC-16) */}
                  {(issue.measuredFormatted || issue.recommendedFormatted) && (
                    <div className="grid grid-cols-2 gap-1.5 pt-1 text-[10px]">
                      {issue.measuredFormatted && (
                        <div
                          data-testid={`decision-measured-${issue.ruleId}`}
                          className="rounded border border-border/60 bg-background/80 p-1"
                        >
                          <span className="text-muted-foreground block">
                            {isZh ? "实测值" : "Measured"}
                          </span>
                          <span className="font-mono font-semibold text-foreground">
                            {issue.measuredFormatted}
                          </span>
                        </div>
                      )}
                      {issue.recommendedFormatted && (
                        <div
                          data-testid={`decision-recommended-${issue.ruleId}`}
                          className="rounded border border-border/60 bg-background/80 p-1"
                        >
                          <span className="text-muted-foreground block">
                            {isZh ? "建议值" : "Recommended"}
                          </span>
                          <span className="font-mono font-semibold text-foreground">
                            {issue.recommendedFormatted}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Affected Entities Focus Buttons (AC-17) */}
                  {issue.relatedEntityIds.length > 0 && onSelectEntity && (
                    <div className="flex items-center gap-1 flex-wrap pt-1 border-t border-border/50">
                      <span className="text-[10px] text-muted-foreground">
                        {isZh ? "关联对象：" : "Affected:"}
                      </span>
                      {issue.relatedEntityIds.map((entityId) => {
                        const isSelected = selectedEntity?.id === entityId;
                        const label = getEntityLabel(entityId);

                        return (
                          <Button
                            key={entityId}
                            type="button"
                            size="sm"
                            variant={isSelected ? "default" : "outline"}
                            data-testid={`decision-entity-btn-${entityId}`}
                            onClick={() => handleEntityClick(entityId)}
                            className={cn(
                              "h-5 px-1.5 text-[10px] font-mono",
                              isSelected && "bg-primary text-primary-foreground",
                            )}
                            title={isZh ? `定位并微调 ${label} ${entityId}` : `Focus & Adjust ${label} ${entityId}`}
                          >
                            <span>{label} {entityId}</span>
                          </Button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        decision.hasTargetFurniture &&
        !decision.uncalibrated && (
          <div
            data-testid="decision-clean-notice"
            className="flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-2.5 text-xs text-emerald-700 dark:text-emerald-300"
          >
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
            <span>
              {isZh
                ? "当前目标家具在所选房间中未发现空间规则冲突。"
                : "No spatial rule conflicts detected for target furniture in selected room."}
            </span>
          </div>
        )
      )}

      {/* 5. Non-Guarantee Legal/Technical Disclaimer (AC-15) */}
      <p
        data-testid="decision-disclaimer"
        className="text-[10px] text-muted-foreground/80 leading-normal pt-1 border-t border-border/60"
      >
        {decision.disclaimer}
      </p>
    </div>
  );
}
