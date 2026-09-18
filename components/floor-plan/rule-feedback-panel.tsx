"use client";

import * as React from "react";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Info,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { FloorPlan, SpaceRuleConfig } from "@/lib/floor-plan/types";
import { evaluatePlanRules, type RuleResult } from "@/lib/floor-plan/rules";
import { cn } from "@/lib/utils";
import type { EntitySelectHandler, SelectedEntity } from "./types";

export interface RuleFeedbackPanelProps {
  plan: FloorPlan;
  ruleResults?: RuleResult[];
  config?: SpaceRuleConfig;
  selectedEntity: SelectedEntity | null;
  onSelect: EntitySelectHandler;
  className?: string;
  defaultExpanded?: boolean;
}

export function RuleFeedbackPanel({
  plan,
  ruleResults,
  config,
  selectedEntity,
  onSelect,
  className = "",
  defaultExpanded = true,
}: RuleFeedbackPanelProps) {
  const [isExpanded, setIsExpanded] = React.useState(defaultExpanded);

  const violations = React.useMemo(
    () => ruleResults ?? evaluatePlanRules(plan, config),
    [plan, ruleResults, config],
  );

  const errorCount = React.useMemo(
    () => violations.filter((v) => v.severity === "error").length,
    [violations],
  );

  const warningCount = React.useMemo(
    () => violations.filter((v) => v.severity === "warning").length,
    [violations],
  );

  const handleEntityClick = React.useCallback(
    (entityId: string) => {
      // Resolve entity type from plan
      if (plan.furniture.some((f) => f.id === entityId)) {
        onSelect({ type: "furniture", id: entityId });
        return;
      }
      if (plan.walls.some((w) => w.id === entityId)) {
        onSelect({ type: "wall", id: entityId });
        return;
      }
      if (plan.rooms.some((r) => r.id === entityId)) {
        onSelect({ type: "room", id: entityId });
        return;
      }
      if (plan.openings.some((o) => o.id === entityId)) {
        onSelect({ type: "opening", id: entityId });
        return;
      }
    },
    [plan, onSelect],
  );

  const getEntityLabel = React.useCallback(
    (entityId: string) => {
      if (plan.furniture.some((f) => f.id === entityId)) return "Furniture";
      if (plan.walls.some((w) => w.id === entityId)) return "Wall";
      if (plan.rooms.some((r) => r.id === entityId)) return "Room";
      if (plan.openings.some((o) => o.id === entityId)) return "Opening";
      return "Entity";
    },
    [plan],
  );

  return (
    <div
      data-testid="rule-feedback-panel"
      className={cn("rounded-xl border border-border bg-card p-3 space-y-2.5 transition-all", className)}
    >
      {/* Header with Title, Count Badge, and Toggle */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {violations.length === 0 ? (
            <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
          ) : errorCount > 0 ? (
            <ShieldAlert className="h-4 w-4 text-destructive shrink-0" />
          ) : (
            <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
          )}
          <span className="font-semibold text-xs text-foreground">Spatial Rules</span>
        </div>

        <div className="flex items-center gap-1.5">
          {violations.length === 0 ? (
            <Badge
              variant="outline"
              className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 border-emerald-500/30 bg-emerald-500/5 px-2 py-0.5"
            >
              0 Issues
            </Badge>
          ) : errorCount > 0 ? (
            <Badge
              data-testid="rule-violations-count-badge"
              variant="outline"
              className="text-[10px] font-mono px-2 py-0.5 border-destructive/40 text-destructive bg-destructive/10"
            >
              {violations.length} {violations.length === 1 ? "Issue" : "Issues"}
            </Badge>
          ) : (
            <Badge
              data-testid="rule-violations-count-badge"
              variant="outline"
              className="text-[10px] font-mono border-amber-500/40 text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5"
            >
              {violations.length} {violations.length === 1 ? "Warning" : "Warnings"}
            </Badge>
          )}

          <Button
            type="button"
            size="sm"
            variant="ghost"
            data-testid="toggle-rule-panel-btn"
            onClick={() => setIsExpanded((prev) => !prev)}
            className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
            aria-label={isExpanded ? "Collapse rules panel" : "Expand rules panel"}
          >
            {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </Button>
        </div>
      </div>

      {/* Uncalibrated Scale Advisory Notice (AC-21) */}
      {plan.meta?.unscaled && (
        <div
          data-testid="unscaled-rule-notice"
          className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-2.5 py-1.5 text-xs text-amber-700 dark:text-amber-400 flex items-center gap-1.5"
        >
          <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-amber-500" />
          <span>Uncalibrated scale: Dimension-dependent clearance rules are suppressed.</span>
        </div>
      )}

      {/* Violations List or Empty State */}
      {isExpanded && (
        <div className="space-y-2 pt-1 animate-in fade-in-50">
          {violations.length === 0 ? (
            <div
              data-testid="rule-clean-state"
              className="flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-2.5 text-xs text-emerald-700 dark:text-emerald-300"
            >
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
              <span className="leading-snug">
                All room boundaries, clearances, passages, and spatial rules passed.
              </span>
            </div>
          ) : (
            <div data-testid="rule-violations-list" className="space-y-2">
              {violations.map((v, idx) => {
                const isError = v.severity === "error";
                const isWarning = v.severity === "warning";

                const isAreaRule =
                  v.ruleId === "furniture-wall-collision" || v.ruleId === "furniture-overlap";
                const formattedMeasured =
                  v.measuredValue !== undefined
                    ? isAreaRule
                      ? `${v.measuredValue} mm²`
                      : `${v.measuredValue} mm`
                    : null;

                return (
                  <div
                    key={`${v.ruleId}-${v.relatedEntityIds.join("-")}-${idx}`}
                    data-testid={`rule-violation-${v.ruleId}`}
                    className={cn(
                      "rounded-lg border p-2.5 space-y-1.5 text-xs transition-colors",
                      isError && "border-destructive/30 bg-destructive/5",
                      isWarning && "border-amber-500/30 bg-amber-500/5",
                      !isError && !isWarning && "border-border/80 bg-muted/20",
                    )}
                  >
                    {/* Title and Severity */}
                    <div className="flex items-center justify-between gap-1.5">
                      <div className="flex items-center gap-1.5 font-medium text-foreground">
                        {isError && <AlertCircle className="h-3.5 w-3.5 text-destructive shrink-0" />}
                        {isWarning && <AlertTriangle className="h-3.5 w-3.5 text-amber-500 shrink-0" />}
                        {!isError && !isWarning && <Info className="h-3.5 w-3.5 text-primary shrink-0" />}
                        <span>{v.title}</span>
                      </div>
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-[9px] font-mono uppercase px-1.5 py-0",
                          isError && "border-destructive/40 text-destructive",
                          isWarning && "border-amber-500/40 text-amber-600 dark:text-amber-400",
                        )}
                      >
                        {v.severity}
                      </Badge>
                    </div>

                    {/* Explanatory Message */}
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      {v.message}
                    </p>

                    {/* Measured & Recommended Values (AC-14) */}
                    {(formattedMeasured !== null || v.recommendedValue !== undefined) && (
                      <div className="grid grid-cols-2 gap-1.5 pt-1 text-[10px]">
                        {formattedMeasured !== null && (
                          <div
                            data-testid={`measured-val-${v.ruleId}`}
                            className="rounded border border-border/60 bg-background/80 p-1"
                          >
                            <span className="text-muted-foreground block">Measured:</span>
                            <span className="font-mono font-semibold text-foreground">
                              {formattedMeasured}
                            </span>
                          </div>
                        )}
                        {v.recommendedValue !== undefined && (
                          <div
                            data-testid={`recommended-val-${v.ruleId}`}
                            className="rounded border border-border/60 bg-background/80 p-1"
                          >
                            <span className="text-muted-foreground block">Recommended:</span>
                            <span className="font-mono font-semibold text-foreground">
                              {v.recommendedValue}
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Affected Entities Jump Buttons */}
                    {v.relatedEntityIds.length > 0 && (
                      <div className="flex items-center gap-1 flex-wrap pt-1 border-t border-border/50">
                        <span className="text-[10px] text-muted-foreground">Affected:</span>
                        {v.relatedEntityIds.map((entityId) => {
                          const isSelected = selectedEntity?.id === entityId;
                          const label = getEntityLabel(entityId);

                          return (
                            <Button
                              key={entityId}
                              type="button"
                              size="sm"
                              variant={isSelected ? "default" : "outline"}
                              data-testid={`rule-entity-btn-${entityId}`}
                              onClick={() => handleEntityClick(entityId)}
                              className={cn(
                                "h-5 px-1.5 text-[10px] font-mono",
                                isSelected && "bg-primary text-primary-foreground",
                              )}
                              title={`Inspect ${label} ${entityId}`}
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
          )}
        </div>
      )}
    </div>
  );
}
