"use client";

import { AlertCircle, AlertTriangle, Hand, MousePointer2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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

export function FloorPlanToolbar({ className, currentPlan, violations, canvasMode, t, onCanvasModeChange, onOpenMobileSheet }: FloorPlanToolbarProps) {
  const hasErrors = violations.some((v) => v.severity === "error");
  return <Card data-testid="floor-plan-toolbar" className={cn("shrink-0 flex-row items-center justify-between gap-3 p-2", className)}>
    <div className="flex items-center gap-2">
      <Button size="sm" variant={canvasMode === "edit" ? "default" : "outline"} data-testid="mode-toggle-edit"
        aria-pressed={canvasMode === "edit"} onClick={() => onCanvasModeChange("edit")} title={t.canvasModes.editTooltip} className="h-9 px-3">
        <MousePointer2 />{t.canvasModes.edit}
      </Button>
      <Button size="sm" variant={canvasMode === "pan" ? "default" : "outline"} data-testid="mode-toggle-pan"
        aria-pressed={canvasMode === "pan"} onClick={() => onCanvasModeChange("pan")} title={t.canvasModes.panTooltip} className="h-9 px-3">
        <Hand />{t.canvasModes.pan}
      </Button>
    </div>
    <div className="flex min-w-0 items-center gap-2">
      {currentPlan.meta?.unscaled && <Badge data-testid="shell-unscaled-badge" variant="outline" title={t.badges.unscaledAdvisory}>{t.badges.uncalibrated}</Badge>}
      <Button variant="outline" size="sm" data-testid={violations.length ? "shell-violations-badge" : "desktop-rules-btn"}
        className={cn("h-9 text-xs", hasErrors && "text-destructive")} onClick={() => onOpenMobileSheet("rules")}>
        {hasErrors ? <AlertCircle /> : <AlertTriangle />}
        {t.actions.rules}{violations.length > 0 && <span className="font-mono">{violations.length}</span>}
      </Button>
    </div>
  </Card>;
}
