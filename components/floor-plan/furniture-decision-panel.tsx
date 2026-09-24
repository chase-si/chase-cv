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
  formatAssessmentFinding,
  resolvePlanEntityType,
  getPlanEntityLabel,
  type FurnitureDecisionStatus,
} from "@/lib/floor-plan/furniture-decision";
import { getDefaultFurnitureCatalog } from "@/lib/floor-plan/furniture-catalog";
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
  onChangeSpecification?: (furnitureId: string, specificationId: string) => void;
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
  onChangeSpecification,
  locale,
  className = "",
}: FurnitureDecisionPanelProps) {
  const i18n = useFloorPlanI18n(locale);
  const isZh = i18n.locale === "zh";
  const catalog = React.useMemo(() => getDefaultFurnitureCatalog(), []);

  const targetFurniture = React.useMemo(() => {
    if (!targetFurnitureId) return null;
    return plan.furniture.find((f) => f.id === targetFurnitureId) ?? null;
  }, [plan.furniture, targetFurnitureId]);

  const targetDefinition = React.useMemo(() => {
    if (!targetFurniture) return null;
    return catalog.definitions.find((d) => d.id === targetFurniture.definitionId) ?? null;
  }, [catalog.definitions, targetFurniture]);

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

  // Filter structured findings strictly to the active target furniture item (AC-3, AC-12)
  const targetFindings = React.useMemo(() => {
    if (!assessment) return [];
    if (!targetFurnitureId) return [];
    return assessment.findings.filter((f) => f.placementId === targetFurnitureId);
  }, [assessment, targetFurnitureId]);

  const formattedFindings = React.useMemo(() => {
    return targetFindings.map((f) => formatAssessmentFinding(f, plan, locale));
  }, [targetFindings, plan, locale]);

  const normalizedStatus = React.useMemo<AssessmentStatus>(() => {
    if (!assessment) {
      return normalizeAssessmentStatus(decision.status);
    }
    if (assessment.status === "unavailable" || decision.uncalibrated || !targetFurnitureId) {
      return "unavailable";
    }
    // If assessment contained findings from multiple placements, derive status specifically for targetFindings
    if (assessment.findings.length > 0 && targetFindings.length !== assessment.findings.length) {
      const hasMustAdjust = targetFindings.some(
        (f) =>
          f.kind === "furniture-overlap" ||
          f.kind === "wall-overlap" ||
          f.kind === "outside-room" ||
          f.kind === "below-minimum-clearance",
      );
      if (hasMustAdjust) return "must-adjust";
      if (targetFindings.some((f) => f.kind === "below-recommended-clearance")) {
        return "trade-off";
      }
      return "suitable";
    }
    return normalizeAssessmentStatus(assessment.status);
  }, [assessment, decision.status, decision.uncalibrated, targetFindings, targetFurnitureId]);

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
    const primaryFinding = formattedFindings[0];

    switch (normalizedStatus) {
      case "unavailable":
        return isZh
          ? "当前户型尚未标定真实毫米比例（显示相对像素坐标），暂无法判断净距与活动空间是否通过。需要可靠真实尺寸后才能完成评估，请先标定真实尺寸。"
          : "The floor plan is uncalibrated; millimeter clearances and passage space cannot be determined without reliable real-world dimensions. Please calibrate dimensions first.";
      case "must-adjust": {
        const detailZh = primaryFinding ? `（${primaryFinding.message}）` : "";
        const detailEn = primaryFinding ? ` (${primaryFinding.message})` : "";
        return isZh
          ? `基于当前空间规则检测，在${decision.roomName}摆放${decision.furnitureName}${dimText}存在空间冲突或方向净距低于最低要求${detailZh}，评估为必须调整。${primaryFinding?.repairGuidance ?? "请移动位置、旋转方向或切换更小规格。"}`
          : `Based on current spatial rules, spatial conflicts or clearances below minimum requirements were detected for ${decision.furnitureName}${dimTextEn} in ${decision.roomName}${detailEn}. This placement must be adjusted.`;
      }
      case "trade-off": {
        const detailZh = primaryFinding ? `（${primaryFinding.message}）` : "";
        const detailEn = primaryFinding ? ` (${primaryFinding.message})` : "";
        return isZh
          ? `基于当前空间规则检测，${decision.furnitureName}${dimText}可放入${decision.roomName}，但存在部分方向净距低于推荐值${detailZh}，评估为需要权衡考虑。${primaryFinding?.repairGuidance ?? ""}`
          : `Based on current spatial rules, ${decision.furnitureName}${dimTextEn} fits within ${decision.roomName}, but some directional clearances are below recommended thresholds${detailEn} and require trade-off consideration.`;
      }
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
    formattedFindings,
    isZh,
    normalizedStatus,
  ]);

  const displayedIssues = React.useMemo(() => {
    if (!assessment) {
      return decision.relevantIssues;
    }

    const nonPhysicalLegacyIssues = decision.relevantIssues.filter(
      (issue) =>
        issue.ruleId !== "furniture-overlap" &&
        issue.ruleId !== "furniture-wall-collision" &&
        issue.ruleId !== "furniture-boundary" &&
        issue.ruleId !== "furniture-clearance",
    );

    return [...formattedFindings, ...nonPhysicalLegacyIssues];
  }, [decision.relevantIssues, assessment, formattedFindings]);

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
          {onChangeSpecification &&
            targetFurniture &&
            targetDefinition &&
            targetDefinition.specifications.length > 0 && (
              <div
                data-testid="decision-panel-specifications"
                className="pt-1.5 border-t border-border/60 space-y-1"
              >
                <span className="text-[10px] text-muted-foreground block">
                  {isZh ? "切换预设规格" : "Switch Specification"}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {targetDefinition.specifications.map((spec) => {
                    const isActive =
                      targetFurniture.specificationId === spec.id ||
                      (!targetFurniture.specificationId &&
                        targetFurniture.width === spec.width &&
                        targetFurniture.depth === spec.depth);
                    return (
                      <Button
                        key={spec.id}
                        type="button"
                        size="sm"
                        variant={isActive ? "default" : "outline"}
                        data-testid={`switch-specification-${spec.id}`}
                        aria-pressed={isActive}
                        onClick={() => onChangeSpecification(targetFurniture.id, spec.id)}
                        className="h-6 px-2 text-[10px] font-mono"
                      >
                        {spec.name}
                      </Button>
                    );
                  })}
                </div>
              </div>
            )}
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

                  {/* Structured Finding Context: Related Object & Side (AC-12) */}
                  {(issue.relatedObjectName || issue.sideLabel) && (
                    <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                      {issue.relatedObjectName && (
                        <Badge
                          variant="secondary"
                          data-testid="finding-related-object"
                          className="font-normal text-[10px] px-1.5 py-0"
                        >
                          {isZh ? `相关对象：${issue.relatedObjectName}` : `Object: ${issue.relatedObjectName}`}
                        </Badge>
                      )}
                      {issue.sideLabel && (
                        <Badge
                          variant="outline"
                          data-testid="finding-side"
                          className="font-mono text-[10px] px-1.5 py-0"
                        >
                          {isZh ? `方向：${issue.sideLabel}` : `Side: ${issue.sideLabel}`}
                        </Badge>
                      )}
                    </div>
                  )}

                  {/* Measured vs Minimum / Recommended Values (AC-12, AC-16) */}
                  {(issue.measuredFormatted || issue.minimumFormatted || issue.recommendedFormatted) && (
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
                            {isZh ? "最低 / 推荐标准" : "Min / Recommended"}
                          </span>
                          <span className="font-mono font-semibold text-foreground">
                            {issue.recommendedFormatted}
                          </span>
                          {issue.minimumFormatted && (
                            <span
                              data-testid={`finding-minimum-${issue.ruleId}`}
                              className="sr-only"
                            >
                              {issue.minimumFormatted}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Deterministic Repair Guidance Derived from Finding (AC-12, AC-13) */}
                  {issue.repairGuidance && (
                    <p
                      data-testid="finding-repair-guidance"
                      className="rounded border border-border/50 bg-background/60 p-1.5 text-[11px] font-medium text-foreground leading-snug"
                    >
                      {issue.repairGuidance}
                    </p>
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
