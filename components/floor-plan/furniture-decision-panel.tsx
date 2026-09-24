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
import type {
  AssessmentStatus,
  FloorPlan,
  SpaceAssessment,
  SpaceRuleConfig,
} from "@/lib/floor-plan/types";
import type { RuleResult } from "@/lib/floor-plan/rules";
import {
  summarizeFurnitureDecision,
  resolvePlanEntityType,
  getPlanEntityLabel,
  type FurnitureDecisionStatus,
} from "@/lib/floor-plan/furniture-decision";
import { useFloorPlanI18n } from "@/lib/floor-plan/i18n";
import { cn } from "@/lib/utils";
import type { EntitySelectHandler, SelectedEntity } from "./types";

function normalizeAssessmentStatus(
  status: FurnitureDecisionStatus | AssessmentStatus,
): AssessmentStatus {
  if (status === "not-recommended" || status === "must-adjust") return "must-adjust";
  if (status === "caution" || status === "trade-off") return "trade-off";
  if (status === "suitable") return "suitable";
  return "unavailable";
}

export interface FurnitureDecisionPanelProps {
  plan: FloorPlan;
  targetRoomId: string | null;
  targetFurnitureId: string | null;
  ruleResults?: RuleResult[];
  config?: SpaceRuleConfig;
  assessment?: SpaceAssessment;
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
  assessment,
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

  const normalizedStatus = React.useMemo(
    () => normalizeAssessmentStatus(assessment ? assessment.status : decision.status),
    [assessment, decision.status],
  );

  const effectiveStatusLabel = React.useMemo(() => {
    if (assessment) {
      switch (normalizedStatus) {
        case "must-adjust":
          return isZh ? "必须调整" : "Must Adjust";
        case "trade-off":
          return isZh ? "需要权衡" : "Trade-off";
        case "suitable":
          return isZh ? "适合" : "Suitable";
        case "unavailable":
        default:
          return isZh ? "暂无法判断" : "Unavailable";
      }
    }
    return decision.statusLabel;
  }, [assessment, decision.statusLabel, isZh, normalizedStatus]);

  const effectiveSummary = React.useMemo(() => {
    if (!assessment || !decision.hasTargetFurniture) {
      return decision.summary;
    }
    const dimText = decision.dimensions ? `（${decision.dimensions.formatted}）` : "";
    const dimTextEn = decision.dimensions ? ` (${decision.dimensions.formatted})` : "";
    switch (normalizedStatus) {
      case "unavailable":
        return isZh
          ? "当前户型尚未标定真实毫米比例（显示相对像素坐标），暂无法判断净距与活动空间是否通过。需要可靠真实尺寸后才能完成评估，请先标定真实尺寸。"
          : "The floor plan is uncalibrated; millimeter clearances and passage space cannot be determined without reliable real-world dimensions. Please calibrate dimensions first.";
      case "must-adjust":
        return isZh
          ? `在当前${decision.roomName}放入${decision.furnitureName}${dimText}存在空间冲突或方向净距低于最低要求，评估为必须调整，请移动位置、旋转方向或切换更小规格。`
          : `Spatial conflicts or clearances below minimum requirements were detected for ${decision.furnitureName}${dimTextEn} in ${decision.roomName}. This placement must be adjusted.`;
      case "trade-off":
        return isZh
          ? `${decision.furnitureName}${dimText}可以放入当前${decision.roomName}，但存在部分方向净距低于推荐值，需要权衡考虑。`
          : `${decision.furnitureName}${dimTextEn} fits within ${decision.roomName}, but some directional clearances are below recommended thresholds and require trade-off consideration.`;
      case "suitable":
      default:
        return decision.summary;
    }
  }, [
    assessment,
    decision.dimensions,
    decision.furnitureName,
    decision.hasTargetFurniture,
    decision.roomName,
    decision.summary,
    isZh,
    normalizedStatus,
  ]);

  const displayedIssues = React.useMemo(() => {
    if (!assessment) {
      return decision.relevantIssues;
    }

    const getSideLabel = (side?: string) => {
      switch (side) {
        case "front":
          return isZh ? "前方 (front)" : "Front (front)";
        case "back":
          return isZh ? "后方 (back)" : "Back (back)";
        case "left":
          return isZh ? "左侧 (left)" : "Left (left)";
        case "right":
          return isZh ? "右侧 (right)" : "Right (right)";
        default:
          return isZh ? "方向" : "Side";
      }
    };

    const assessmentIssues = assessment.findings.map((f) => {
      const isOverlap = f.kind === "furniture-overlap";
      const isWall = f.kind === "wall-overlap";
      const isOutside = f.kind === "outside-room";
      const isBelowMin = f.kind === "below-minimum-clearance";
      const isBelowRec = f.kind === "below-recommended-clearance";

      const sideLabel = getSideLabel(f.side);
      const obstacleLabel = f.relatedPlacementId
        ? isZh
          ? `家具 ${f.relatedPlacementId}`
          : `furniture ${f.relatedPlacementId}`
        : f.wallId
          ? isZh
            ? `墙体 ${f.wallId}`
            : `wall ${f.wallId}`
          : isZh
            ? "障碍物"
            : "obstacle";

      let title = isZh ? "空间冲突" : "Spatial Conflict";
      let message = "";
      let severity: "error" | "warning" = "error";
      let recommendedVal: number = f.recommendedMm ?? f.minimumMm ?? 0;
      let recommendedFormatted = "0 mm";
      const clearanceRangeFormatted = isZh
        ? `最低 ${f.minimumMm ?? 0} mm / 推荐 ${f.recommendedMm ?? 0} mm`
        : `Min ${f.minimumMm ?? 0} mm / Rec ${f.recommendedMm ?? 0} mm`;

      if (isOverlap) {
        title = isZh ? "家具重叠冲突" : "Furniture Overlap";
        message = isZh
          ? `目标家具与 ${f.relatedPlacementId ?? "其他家具"} 重叠 (实测穿插 ${f.measuredMm ?? 0} mm)`
          : `Overlaps with furniture ${f.relatedPlacementId ?? "other furniture"} (measured ${f.measuredMm ?? 0} mm)`;
      } else if (isWall) {
        title = isZh ? "家具穿墙冲突" : "Wall Collision";
        message = isZh
          ? `目标家具穿插墙体 ${f.wallId ?? ""} (实测穿插 ${f.measuredMm ?? 0} mm)`
          : `Collides with wall ${f.wallId ?? ""} (measured ${f.measuredMm ?? 0} mm)`;
      } else if (isOutside) {
        title = isZh ? "超出房间边界" : "Outside Room Boundary";
        message = isZh
          ? `目标家具超出房间边界 (距边界 ${f.measuredMm ?? 0} mm)`
          : `Placement extends outside room boundaries (measured ${f.measuredMm ?? 0} mm)`;
      } else if (isBelowMin) {
        title = isZh ? "方向净距低于最低要求" : "Below Minimum Clearance";
        severity = "error";
        recommendedVal = f.recommendedMm ?? f.minimumMm ?? 0;
        recommendedFormatted = clearanceRangeFormatted;
        message = isZh
          ? `${sideLabel}距${obstacleLabel}实测净距 ${f.measuredMm ?? 0} mm，低于最低要求 ${f.minimumMm ?? 0} mm（推荐 ${f.recommendedMm ?? 0} mm）`
          : `${sideLabel} clearance to ${obstacleLabel} is ${f.measuredMm ?? 0} mm, below minimum ${f.minimumMm ?? 0} mm (recommended ${f.recommendedMm ?? 0} mm)`;
      } else if (isBelowRec) {
        title = isZh ? "方向净距低于推荐值" : "Below Recommended Clearance";
        severity = "warning";
        recommendedVal = f.recommendedMm ?? 0;
        recommendedFormatted = clearanceRangeFormatted;
        message = isZh
          ? `${sideLabel}距${obstacleLabel}实测净距 ${f.measuredMm ?? 0} mm，已达最低要求 ${f.minimumMm ?? 0} mm，但低于推荐值 ${f.recommendedMm ?? 0} mm`
          : `${sideLabel} clearance to ${obstacleLabel} is ${f.measuredMm ?? 0} mm (meets minimum ${f.minimumMm ?? 0} mm, below recommended ${f.recommendedMm ?? 0} mm)`;
      }

      const relatedIds = [
        f.placementId,
        ...(f.relatedPlacementId ? [f.relatedPlacementId] : []),
        ...(f.wallId ? [f.wallId] : []),
      ];

      return {
        ruleId: f.kind,
        severity,
        title,
        message,
        relatedEntityIds: relatedIds,
        relatedObjectIds: relatedIds,
        measuredValue: f.measuredMm,
        measuredFormatted: f.measuredMm !== undefined ? `${f.measuredMm} mm` : undefined,
        recommendedValue: recommendedVal,
        recommendedFormatted,
      };
    });

    const nonPhysicalLegacyIssues = decision.relevantIssues.filter(
      (issue) =>
        issue.ruleId !== "furniture-overlap" &&
        issue.ruleId !== "furniture-wall-collision" &&
        issue.ruleId !== "furniture-boundary" &&
        issue.ruleId !== "furniture-clearance",
    );

    return [...assessmentIssues, ...nonPhysicalLegacyIssues];
  }, [decision.relevantIssues, assessment, isZh]);

  const handleEntityClick = React.useCallback(
    (entityId: string) => {
      const type = resolvePlanEntityType(plan, entityId);
      if (type && onSelectEntity) {
        onSelectEntity({ type, id: entityId });
      }
    },
    [plan, onSelectEntity],
  );

  const renderStatusBadge = (status: AssessmentStatus) => {
    switch (status) {
      case "suitable":
        return (
          <Badge
            data-testid="decision-status-badge"
            role="status"
            aria-label={effectiveStatusLabel}
            variant="outline"
            className="border-emerald-500/40 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 gap-1 px-2 py-0.5 text-xs font-semibold"
          >
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
            <span data-testid="decision-status-suitable">{effectiveStatusLabel}</span>
          </Badge>
        );
      case "trade-off":
        return (
          <Badge
            data-testid="decision-status-badge"
            role="status"
            aria-label={effectiveStatusLabel}
            variant="outline"
            className="border-amber-500/40 text-amber-600 dark:text-amber-400 bg-amber-500/10 gap-1 px-2 py-0.5 text-xs font-semibold"
          >
            <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
            <span data-testid="decision-status-caution">{effectiveStatusLabel}</span>
            <span data-testid="decision-status-trade-off" className="sr-only">
              {effectiveStatusLabel}
            </span>
          </Badge>
        );
      case "must-adjust":
        return (
          <Badge
            data-testid="decision-status-badge"
            role="status"
            aria-label={effectiveStatusLabel}
            variant="outline"
            className="border-destructive/40 text-destructive bg-destructive/10 gap-1 px-2 py-0.5 text-xs font-semibold"
          >
            <AlertCircle className="h-3.5 w-3.5 text-destructive" />
            {assessment?.status === "must-adjust" ? (
              <>
                <span data-testid="decision-status-must-adjust">{effectiveStatusLabel}</span>
                <span data-testid="decision-status-not-recommended" className="sr-only">
                  {effectiveStatusLabel}
                </span>
              </>
            ) : (
              <>
                <span data-testid="decision-status-not-recommended">{effectiveStatusLabel}</span>
                <span data-testid="decision-status-must-adjust" className="sr-only">
                  {effectiveStatusLabel}
                </span>
              </>
            )}
          </Badge>
        );
      case "unavailable":
      default:
        return (
          <Badge
            data-testid="decision-status-badge"
            role="status"
            aria-label={effectiveStatusLabel}
            variant="outline"
            className="border-muted-foreground/40 text-muted-foreground bg-muted/20 gap-1 px-2 py-0.5 text-xs font-semibold"
          >
            <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
            <span data-testid="decision-status-unavailable">{effectiveStatusLabel}</span>
          </Badge>
        );
    }
  };

  const effectiveTitle = React.useMemo(() => {
    if (assessment) {
      const dimStr = decision.dimensions ? ` (${decision.dimensions.formatted})` : "";
      return `${decision.roomName} · ${decision.furnitureName}${dimStr} - ${effectiveStatusLabel}`;
    }
    return decision.title;
  }, [
    assessment,
    decision.dimensions,
    decision.furnitureName,
    decision.roomName,
    decision.title,
    effectiveStatusLabel,
  ]);

  return (
    <div
      data-testid="furniture-decision-panel"
      className={cn("rounded-xl border border-border bg-card p-3 space-y-3", className)}
    >
      {/* 1. Header: Section Tag, Status Badge, Title */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            {normalizedStatus === "suitable" ? (
              <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
            ) : normalizedStatus === "trade-off" ? (
              <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
            ) : normalizedStatus === "must-adjust" ? (
              <ShieldAlert className="h-4 w-4 text-destructive shrink-0" />
            ) : (
              <Info className="h-4 w-4 text-muted-foreground shrink-0" />
            )}
            <span className="font-semibold text-xs text-foreground">
              {isZh ? "目标家具决策结论" : "Furniture Decision Verdict"}
            </span>
          </div>
          {renderStatusBadge(normalizedStatus)}
        </div>

        <h3
          data-testid="decision-title"
          className="text-sm font-semibold text-foreground leading-snug pt-0.5"
        >
          {effectiveTitle}
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
          normalizedStatus === "suitable" && "border-emerald-500/30 bg-emerald-500/5 text-foreground",
          normalizedStatus === "trade-off" && "border-amber-500/30 bg-amber-500/5 text-foreground",
          normalizedStatus === "must-adjust" && "border-destructive/30 bg-destructive/5 text-foreground",
          normalizedStatus === "unavailable" && "border-border/80 bg-muted/20 text-muted-foreground",
        )}
      >
        <p data-testid="decision-summary" className="text-xs leading-relaxed">
          {effectiveSummary}
        </p>
      </div>

      {/* 4. Relevant Issues Prioritized List (AC-16, AC-17) */}
      {displayedIssues.length > 0 ? (
        <div data-testid="decision-issues-list" className="space-y-2 pt-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-foreground">
              {isZh ? "相关空间问题说明" : "Relevant Spatial Issues"}
            </span>
            <Badge variant="outline" className="text-[10px] font-mono px-1.5 py-0">
              {displayedIssues.length} {isZh ? "项" : "Issues"}
            </Badge>
          </div>

          <div className="space-y-2">
            {displayedIssues.map((issue, idx) => {
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
                        const label = getPlanEntityLabel(plan, entityId, locale);

                        return (
                          <Button
                            key={entityId}
                            type="button"
                            size="sm"
                            variant={isSelected ? "default" : "outline"}
                            data-testid={`decision-entity-btn-${entityId}`}
                            aria-pressed={isSelected}
                            aria-label={isZh ? `定位并微调 ${label} ${entityId}` : `Focus & Adjust ${label} ${entityId}`}
                            onClick={() => handleEntityClick(entityId)}
                            className={cn(
                              "h-11 min-h-[44px] sm:h-5 sm:min-h-0 px-2 text-[10px] font-mono touch-manipulation focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none",
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
        !decision.uncalibrated &&
        normalizedStatus !== "unavailable" && (
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
