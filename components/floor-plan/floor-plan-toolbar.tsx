"use client";

import {
  AlertCircle,
  AlertTriangle,
  Armchair,
  Compass,
  Hand,
  Home,
  MousePointer2,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { StandardPlanSummary } from "@/lib/floor-plan/catalog";
import type { FloorPlanDictionary } from "@/lib/floor-plan/i18n";
import type { RuleResult } from "@/lib/floor-plan/rules/types";
import type { FloorPlan } from "@/lib/floor-plan/types";
import { cn } from "@/lib/utils";

export type FloorPlanToolbarProps = {
  className?: string;
  currentPlan: FloorPlan;
  activePlanSummary: StandardPlanSummary;
  violations: RuleResult[];
  canvasMode: "pan" | "edit";
  t: FloorPlanDictionary;
  onCanvasModeChange: (mode: "pan" | "edit") => void;
  onOpenMobileSheet: (type: "entity" | "furniture-palette" | "rules" | "catalog") => void;
  onOpenPlanSelector?: () => void;
  onClearSelection: () => void;
  onOpenFurnitureCatalog?: () => void;
};

const touchBtn =
  "h-11 min-h-[44px] min-w-[44px] sm:h-7 sm:min-h-0 sm:min-w-0 text-xs flex items-center gap-1.5 touch-manipulation";

/**
 * Clean, streamlined toolbar for the floor-plan workspace.
 * Preserves plan identity, canvas modes, plan selector, furniture addition, and spatial rule indicators.
 */
export function FloorPlanToolbar(props: FloorPlanToolbarProps) {
  const {
    className,
    currentPlan,
    activePlanSummary,
    violations,
    canvasMode,
    t,
    onCanvasModeChange,
    onOpenMobileSheet,
    onOpenPlanSelector,
    onClearSelection,
    onOpenFurnitureCatalog,
  } = props;

  const openRules = () => {
    onClearSelection();
    onOpenMobileSheet("rules");
  };

  return (
    <div
      data-testid="floor-plan-toolbar"
      className={cn(
        "flex shrink-0 flex-col gap-2 rounded-2xl border border-border bg-card p-2 shadow-md sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
    >
      <div className="flex min-w-0 flex-wrap items-center gap-1.5">
        <Badge
          variant="secondary"
          className="inline-flex items-center gap-1.5 font-mono text-xs px-2.5 py-1"
        >
          <Home className="h-3.5 w-3.5 shrink-0 text-primary" />
          <span className="truncate max-w-[140px]">{activePlanSummary.name}</span>
          <span className="text-muted-foreground">({activePlanSummary.formattedArea})</span>
        </Badge>

        {violations.length > 0 && (
          <Badge
            data-testid="shell-violations-badge"
            variant="outline"
            className={cn(
              "inline-flex cursor-pointer items-center gap-1 px-2 py-0.5 font-mono text-xs transition-opacity hover:opacity-90",
              violations.some((v) => v.severity === "error")
                ? "border-destructive/40 bg-destructive/10 text-destructive"
                : "border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400",
            )}
            onClick={openRules}
            title={t.actions.rules}
          >
            {violations.some((v) => v.severity === "error") ? (
              <AlertCircle className="h-3 w-3" />
            ) : (
              <AlertTriangle className="h-3 w-3 text-amber-500" />
            )}
            <span>
              {violations.length}{" "}
              {violations.length === 1
                ? violations[0].severity === "error"
                  ? t.badges.issue
                  : t.badges.warning
                : violations.some((v) => v.severity === "error")
                  ? t.badges.issues
                  : t.badges.warnings}
            </span>
          </Badge>
        )}

        {currentPlan.meta?.unscaled && (
          <Badge
            data-testid="shell-unscaled-badge"
            variant="outline"
            className="inline-flex items-center gap-1.5 border-amber-500/40 bg-amber-500/10 px-2 py-0.5 font-mono text-xs text-amber-600 dark:text-amber-400"
            title={t.badges.unscaledAdvisory}
          >
            <AlertTriangle className="h-3 w-3 text-amber-500" />
            <span>{t.badges.uncalibrated}</span>
          </Badge>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        <div className="flex items-center rounded-xl border border-border bg-card p-0.5 shadow-xs touch-manipulation">
          <Button
            type="button"
            size="sm"
            variant={canvasMode === "pan" ? "default" : "ghost"}
            data-testid="mode-toggle-pan"
            onClick={() => onCanvasModeChange("pan")}
            className={cn(touchBtn, "px-3 sm:px-2.5 font-medium")}
            title={t.canvasModes.panTooltip}
          >
            <Hand className="h-4 w-4" />
            <span>{t.canvasModes.pan}</span>
          </Button>
          <Button
            type="button"
            size="sm"
            variant={canvasMode === "edit" ? "default" : "ghost"}
            data-testid="mode-toggle-edit"
            onClick={() => onCanvasModeChange("edit")}
            className={cn(touchBtn, "px-3 sm:px-2.5 font-medium")}
            title={t.canvasModes.editTooltip}
          >
            <MousePointer2 className="h-4 w-4" />
            <span>{t.canvasModes.edit}</span>
          </Button>
        </div>

        <Button
          type="button"
          size="sm"
          variant="outline"
          data-testid="toolbar-select-plan-btn"
          onClick={
            onOpenPlanSelector ??
            (() => {
              onClearSelection();
              onOpenMobileSheet("catalog");
            })
          }
          className={cn(touchBtn, "px-3 sm:px-2.5")}
          title={t.actions.plans}
        >
          <Compass className="h-3.5 w-3.5 text-primary" />
          <span>{t.actions.plans}</span>
        </Button>

        {onOpenFurnitureCatalog && (
          <Button
            type="button"
            size="sm"
            variant="outline"
            data-testid="toolbar-add-furniture-btn"
            onClick={onOpenFurnitureCatalog}
            className={cn(touchBtn, "px-3 sm:px-2.5 hidden sm:flex")}
            title={t.actions.addFurniture}
          >
            <Armchair className="h-3.5 w-3.5 text-primary" />
            <span>{t.actions.addFurniture}</span>
          </Button>
        )}

        {/* Mobile controls */}
        <Button
          type="button"
          size="sm"
          variant="outline"
          data-testid="mobile-add-furniture-btn"
          onClick={() => {
            onClearSelection();
            onOpenMobileSheet("furniture-palette");
          }}
          className={cn(touchBtn, "px-2.5 lg:hidden")}
          title={t.actions.addFurniture}
        >
          <Armchair className="h-3.5 w-3.5 text-primary" />
          <span>{t.actions.addFurniture}</span>
        </Button>

        <Button
          type="button"
          size="sm"
          variant="outline"
          data-testid="mobile-catalog-btn"
          onClick={() => {
            if (onOpenPlanSelector) {
              onOpenPlanSelector();
            } else {
              onClearSelection();
              onOpenMobileSheet("catalog");
            }
          }}
          className={cn(touchBtn, "px-2.5 lg:hidden")}
          title={t.actions.plans}
        >
          <Compass className="h-3.5 w-3.5 text-primary" />
          <span className="hidden sm:inline">{t.actions.plans}</span>
        </Button>

        <Button
          type="button"
          size="sm"
          variant="outline"
          data-testid="mobile-rules-btn"
          onClick={openRules}
          className={cn(touchBtn, "px-2.5 lg:hidden")}
          title={t.actions.rules}
        >
          <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
          <span className="hidden sm:inline">{t.actions.rules}</span>
        </Button>
      </div>
    </div>
  );
}
