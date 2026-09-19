"use client";

import {
  AlertCircle,
  AlertTriangle,
  Armchair,
  Check,
  Compass,
  Download,
  Hand,
  Home,
  Loader2,
  MousePointer2,
  PenTool,
  Redo2,
  RotateCcw,
  SlidersHorizontal,
  Undo2,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { StandardPlanSummary } from "@/lib/floor-plan/catalog";
import { canRedo, canUndo, type PlanHistory } from "@/lib/floor-plan/history";
import type { FloorPlanDictionary } from "@/lib/floor-plan/i18n";
import type { RuleResult } from "@/lib/floor-plan/rules/types";
import type { FloorPlan } from "@/lib/floor-plan/types";
import { cn } from "@/lib/utils";

export type FloorPlanToolbarProps = {
  isDraftMode: boolean;
  currentPlan: FloorPlan;
  activePlanSummary: StandardPlanSummary;
  saveStatus: "idle" | "saving" | "saved" | "failed";
  violations: RuleResult[];
  canvasMode: "pan" | "edit";
  history: PlanHistory;
  t: FloorPlanDictionary;
  onCustomizePlan: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onExportJson: () => void;
  onRestartFromTemplate: () => void;
  onCanvasModeChange: (mode: "pan" | "edit") => void;
  onOpenMobileSheet: (type: "entity" | "furniture-palette" | "rules" | "catalog") => void;
  onClearSelection: () => void;
};

const touchBtn =
  "h-11 min-h-[44px] min-w-[44px] sm:h-7 sm:min-h-0 sm:min-w-0 text-xs flex items-center gap-1.5 touch-manipulation";

/**
 * Full-width tool strip below ToolPageChrome title.
 * Keeps plan identity + draft actions out of the chrome's 36rem actions slot.
 */
export function FloorPlanToolbar(props: FloorPlanToolbarProps) {
  const {
    isDraftMode,
    currentPlan,
    activePlanSummary,
    saveStatus,
    violations,
    canvasMode,
    history,
    t,
    onCustomizePlan,
    onUndo,
    onRedo,
    onExportJson,
    onRestartFromTemplate,
    onCanvasModeChange,
    onOpenMobileSheet,
    onClearSelection,
  } = props;

  const openRules = () => {
    onClearSelection();
    onOpenMobileSheet("rules");
  };

  return (
    <div
      data-testid="floor-plan-toolbar"
      className="flex shrink-0 flex-col gap-2 rounded-2xl border border-border bg-card p-2 shadow-md sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="flex min-w-0 flex-wrap items-center gap-1.5">
        {isDraftMode ? (
          <Badge
            variant="outline"
            className="inline-flex items-center gap-1.5 font-mono text-xs px-2.5 py-1 border-primary/40 bg-primary/5 text-primary"
          >
            <PenTool className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate max-w-[160px]">{currentPlan.meta.name}</span>
            <span className="text-muted-foreground text-[10px]">{t.badges.userDraft}</span>
          </Badge>
        ) : (
          <Badge
            variant="secondary"
            className="inline-flex items-center gap-1.5 font-mono text-xs px-2.5 py-1"
          >
            <Home className="h-3.5 w-3.5 shrink-0 text-primary" />
            <span className="truncate max-w-[140px]">{activePlanSummary.name}</span>
            <span className="text-muted-foreground">({activePlanSummary.formattedArea})</span>
          </Badge>
        )}

        {isDraftMode && (
          <Badge
            data-testid="save-status-badge"
            variant="outline"
            className={cn(
              "inline-flex items-center gap-1.5 text-xs font-mono px-2 py-0.5 transition-colors",
              saveStatus === "saved" &&
                "text-emerald-600 dark:text-emerald-400 border-emerald-500/30 bg-emerald-500/5",
              saveStatus === "saving" && "text-primary border-primary/30 bg-primary/5",
              saveStatus === "failed" &&
                "text-destructive border-destructive/30 bg-destructive/5",
            )}
          >
            {saveStatus === "saving" && <Loader2 className="h-3 w-3 animate-spin text-primary" />}
            {saveStatus === "saved" && <Check className="h-3 w-3 text-emerald-500" />}
            {saveStatus === "failed" && <AlertCircle className="h-3 w-3 text-destructive" />}
            <span className="capitalize">
              {saveStatus === "saving"
                ? t.badges.saving
                : saveStatus === "saved"
                  ? t.badges.saved
                  : saveStatus === "failed"
                    ? t.badges.saveFailed
                    : t.badges.draft}
            </span>
          </Badge>
        )}

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

        {!isDraftMode ? (
          <>
            <Button
              type="button"
              size="sm"
              variant="default"
              data-testid="customize-plan-btn"
              onClick={onCustomizePlan}
              className={cn(touchBtn, "px-3 sm:px-2.5")}
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              <span>{t.actions.customizePlan}</span>
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              data-testid="mobile-catalog-btn"
              onClick={() => {
                onClearSelection();
                onOpenMobileSheet("catalog");
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
          </>
        ) : (
          <>
            <Button
              type="button"
              size="sm"
              variant="outline"
              data-testid="undo-btn"
              onClick={onUndo}
              disabled={!canUndo(history)}
              className={cn(touchBtn, "gap-1 px-2.5")}
              title="Undo (Ctrl+Z / ⌘Z)"
              aria-label={t.actions.undo}
            >
              <Undo2 className="h-3.5 w-3.5" />
              <span className="hidden md:inline">{t.actions.undo}</span>
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              data-testid="redo-btn"
              onClick={onRedo}
              disabled={!canRedo(history)}
              className={cn(touchBtn, "gap-1 px-2.5")}
              title="Redo (Ctrl+Shift+Z / ⌘⇧Z / Ctrl+Y)"
              aria-label={t.actions.redo}
            >
              <Redo2 className="h-3.5 w-3.5" />
              <span className="hidden md:inline">{t.actions.redo}</span>
            </Button>
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
              data-testid="mobile-rules-btn"
              onClick={openRules}
              className={cn(touchBtn, "px-2.5 lg:hidden")}
              title={t.actions.rules}
            >
              {violations.some((v) => v.severity === "error") ? (
                <AlertCircle className="h-3.5 w-3.5 text-destructive" />
              ) : violations.length > 0 ? (
                <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
              ) : (
                <Check className="h-3.5 w-3.5 text-emerald-500" />
              )}
              <span className="hidden sm:inline">{t.actions.rules}</span>
              {violations.length > 0 && (
                <Badge variant="secondary" className="px-1.5 py-0 font-mono text-[10px]">
                  {violations.length}
                </Badge>
              )}
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              data-testid="mobile-catalog-btn"
              onClick={() => {
                onClearSelection();
                onOpenMobileSheet("catalog");
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
              data-testid="export-json-btn"
              onClick={onExportJson}
              className={cn(touchBtn, "px-2.5")}
            >
              <Download className="h-3.5 w-3.5 text-primary" />
              <span className="hidden sm:inline">{t.actions.exportJson}</span>
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              data-testid="restart-template-btn"
              onClick={onRestartFromTemplate}
              className={cn(
                touchBtn,
                "gap-1 px-2 text-muted-foreground hover:text-foreground",
              )}
              title={t.actions.restartTitle}
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span className="hidden md:inline">{t.actions.restart}</span>
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
