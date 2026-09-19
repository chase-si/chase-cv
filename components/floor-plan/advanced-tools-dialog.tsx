"use client";

import * as React from "react";
import {
  AlertTriangle,
  Armchair,
  CheckCircle2,
  Download,
  Layers,
  RotateCcw,
  SlidersHorizontal,
  Wrench,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardScrollArea } from "@/components/ui/card";
import type { FloorPlanDictionary } from "@/lib/floor-plan/i18n";
import type { RuleResult } from "@/lib/floor-plan/rules/types";
import type { FloorPlan } from "@/lib/floor-plan/types";
import { cn } from "@/lib/utils";
import type { EntitySelectHandler, SelectedEntity } from "./types";
import { RuleFeedbackPanel } from "./rule-feedback-panel";
import { FurnitureCatalogPalette } from "./furniture-catalog-palette";
import { FloorPlanInspector } from "./floor-plan-inspector";

export type AdvancedToolsTab = "rules" | "structure" | "furniture" | "manage";

export interface AdvancedToolsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultTab?: AdvancedToolsTab;
  plan: FloorPlan;
  isDraftMode: boolean;
  violations: RuleResult[];
  selectedEntity: SelectedEntity | null;
  onSelectEntity: EntitySelectHandler;
  onUpdatePlan?: (updated: FloorPlan, description?: string) => void;
  onEnsureUserPlan?: () => Promise<FloorPlan>;
  onStartCalibration?: () => void;
  onSelectDefinition?: (definitionId: string) => void;
  onExportJson: () => void;
  onRestartFromTemplate: () => void;
  locale?: string;
  t: FloorPlanDictionary;
  className?: string;
}

export function AdvancedToolsDialog({
  open,
  onOpenChange,
  defaultTab = "rules",
  plan,
  isDraftMode,
  violations,
  selectedEntity,
  onSelectEntity,
  onUpdatePlan,
  onEnsureUserPlan,
  onStartCalibration,
  onSelectDefinition,
  onExportJson,
  onRestartFromTemplate,
  locale,
  t,
  className,
}: AdvancedToolsDialogProps) {
  const [activeTab, setActiveTab] = React.useState<AdvancedToolsTab>(defaultTab);
  const [structureFilter, setStructureFilter] = React.useState<"walls" | "openings">("walls");

  React.useEffect(() => {
    if (open && defaultTab) {
      setActiveTab(defaultTab);
    }
  }, [open, defaultTab]);

  // Handle escape key
  React.useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onOpenChange(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onOpenChange]);

  if (!open) {
    return null;
  }

  const isWallOrOpeningSelected =
    selectedEntity && (selectedEntity.type === "wall" || selectedEntity.type === "opening");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
      {/* Backdrop */}
      <div
        data-testid="advanced-tools-backdrop"
        className="fixed inset-0 bg-foreground/30 backdrop-blur-xs transition-opacity"
        onClick={() => onOpenChange(false)}
        aria-hidden="true"
      />

      {/* Modal Popup */}
      <Card
        role="dialog"
        aria-modal="true"
        aria-labelledby="advanced-tools-dialog-title"
        data-testid="advanced-tools-dialog"
        className={cn(
          "relative z-10 flex w-full max-w-3xl max-h-[90vh] flex-col rounded-2xl border border-border bg-card p-0 shadow-2xl text-card-foreground outline-hidden overflow-hidden",
          className,
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-5 py-3.5 shrink-0 bg-card">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Wrench className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <h2
                id="advanced-tools-dialog-title"
                data-testid="advanced-tools-dialog-title"
                className="text-sm font-semibold tracking-tight text-foreground truncate"
              >
                {t.advancedTools.title}
              </h2>
              <p className="text-[11px] text-muted-foreground truncate">
                {t.advancedTools.description}
              </p>
            </div>
          </div>

          <Button
            type="button"
            size="icon"
            variant="ghost"
            data-testid="advanced-tools-close-btn"
            onClick={() => onOpenChange(false)}
            className="h-8 w-8 text-muted-foreground hover:text-foreground shrink-0"
            aria-label={t.actions.close}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 border-b border-border/80 px-4 py-2 bg-muted/20 shrink-0 overflow-x-auto">
          <Button
            type="button"
            size="sm"
            variant={activeTab === "rules" ? "default" : "ghost"}
            data-testid="advanced-tab-rules"
            onClick={() => setActiveTab("rules")}
            className="h-8 px-3 text-xs font-medium gap-1.5 shrink-0"
          >
            <AlertTriangle className="h-3.5 w-3.5" />
            <span>{t.advancedTools.tabs.rules}</span>
            {violations.length > 0 && (
              <Badge
                data-testid="advanced-rules-count-badge"
                variant={activeTab === "rules" ? "secondary" : "default"}
                className={cn(
                  "h-4 px-1 text-[10px] font-mono ml-0.5",
                  activeTab !== "rules" && "bg-destructive text-destructive-foreground",
                )}
              >
                {violations.length}
              </Badge>
            )}
          </Button>

          <Button
            type="button"
            size="sm"
            variant={activeTab === "structure" ? "default" : "ghost"}
            data-testid="advanced-tab-structure"
            onClick={() => setActiveTab("structure")}
            className="h-8 px-3 text-xs font-medium gap-1.5 shrink-0"
          >
            <Layers className="h-3.5 w-3.5" />
            <span>{t.advancedTools.tabs.structure}</span>
            {isWallOrOpeningSelected && (
              <Badge variant="outline" className="h-4 px-1 text-[9px] uppercase font-mono ml-0.5">
                {selectedEntity.id}
              </Badge>
            )}
          </Button>

          <Button
            type="button"
            size="sm"
            variant={activeTab === "furniture" ? "default" : "ghost"}
            data-testid="advanced-tab-furniture"
            onClick={() => setActiveTab("furniture")}
            className="h-8 px-3 text-xs font-medium gap-1.5 shrink-0"
          >
            <Armchair className="h-3.5 w-3.5" />
            <span>{t.advancedTools.tabs.furniture}</span>
          </Button>

          <Button
            type="button"
            size="sm"
            variant={activeTab === "manage" ? "default" : "ghost"}
            data-testid="advanced-tab-manage"
            onClick={() => setActiveTab("manage")}
            className="h-8 px-3 text-xs font-medium gap-1.5 shrink-0"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span>{t.advancedTools.tabs.manage}</span>
          </Button>
        </div>

        {/* Dialog Content Body */}
        <CardScrollArea className="flex-1 min-h-[360px] max-h-[65vh] p-4">
          {/* Tab 1: Spatial Rules */}
          {activeTab === "rules" && (
            <div data-testid="advanced-rules-panel" className="space-y-3">
              <RuleFeedbackPanel
                plan={plan}
                ruleResults={violations}
                selectedEntity={selectedEntity}
                onSelect={onSelectEntity}
                locale={locale}
              />
            </div>
          )}

          {/* Tab 2: Wall & Opening Structural Property Editor */}
          {activeTab === "structure" && (
            <div data-testid="advanced-structure-panel" className="space-y-4 text-xs">
              <div className="rounded-xl border border-border/70 bg-card p-3 space-y-2">
                <span className="font-semibold text-foreground text-xs block">
                  {t.advancedTools.structure.title}
                </span>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  {t.advancedTools.structure.description}
                </p>

                {/* Sub-selector for Walls vs Openings */}
                <div className="flex items-center gap-2 pt-2 border-t border-border/60">
                  <span className="text-[11px] text-muted-foreground">
                    {t.advancedTools.structure.selectPrompt}
                  </span>
                  <div className="flex items-center rounded-lg border border-border bg-muted/40 p-0.5">
                    <Button
                      type="button"
                      size="sm"
                      variant={structureFilter === "walls" ? "default" : "ghost"}
                      data-testid="filter-walls-btn"
                      onClick={() => setStructureFilter("walls")}
                      className="h-6 px-2 text-[11px] font-medium"
                    >
                      {t.advancedTools.structure.wallTab} ({plan.walls.length})
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant={structureFilter === "openings" ? "default" : "ghost"}
                      data-testid="filter-openings-btn"
                      onClick={() => setStructureFilter("openings")}
                      className="h-6 px-2 text-[11px] font-medium"
                    >
                      {t.advancedTools.structure.openingTab} ({plan.openings.length})
                    </Button>
                  </div>
                </div>

                {/* List of walls or openings */}
                <div className="flex flex-wrap gap-1.5 pt-1 max-h-28 overflow-y-auto">
                  {structureFilter === "walls"
                    ? plan.walls.map((w) => {
                        const isSelected = selectedEntity?.type === "wall" && selectedEntity.id === w.id;
                        return (
                          <Button
                            key={w.id}
                            type="button"
                            size="sm"
                            variant={isSelected ? "default" : "outline"}
                            data-testid={`select-structure-wall-${w.id}`}
                            onClick={() => onSelectEntity({ type: "wall", id: w.id })}
                            className="h-7 px-2 text-xs font-mono"
                          >
                            {w.id}
                          </Button>
                        );
                      })
                    : plan.openings.map((o) => {
                        const isSelected = selectedEntity?.type === "opening" && selectedEntity.id === o.id;
                        return (
                          <Button
                            key={o.id}
                            type="button"
                            size="sm"
                            variant={isSelected ? "default" : "outline"}
                            data-testid={`select-structure-opening-${o.id}`}
                            onClick={() => onSelectEntity({ type: "opening", id: o.id })}
                            className="h-7 px-2 text-xs font-mono"
                          >
                            {o.id} ({o.type === "door" ? t.inspector.door : t.inspector.window})
                          </Button>
                        );
                      })}
                </div>
              </div>

              {/* Selected Structure Inspector */}
              {isWallOrOpeningSelected ? (
                <FloorPlanInspector
                  plan={plan}
                  isDraftMode={isDraftMode}
                  allowSpanEdit={true}
                  onUpdatePlan={onUpdatePlan}
                  selectedEntity={selectedEntity}
                  onSelect={onSelectEntity}
                  violations={violations}
                  locale={locale}
                  showRules={false}
                  onStartCalibration={onStartCalibration}
                  onEnsureUserPlan={onEnsureUserPlan}
                />
              ) : (
                <div className="rounded-xl border border-dashed border-border p-6 text-center text-muted-foreground text-xs">
                  <p>{t.advancedTools.structure.noSelection}</p>
                </div>
              )}
            </div>
          )}

          {/* Tab 3: Full Furniture Catalog */}
          {activeTab === "furniture" && (
            <div data-testid="advanced-furniture-panel" className="space-y-3">
              <FurnitureCatalogPalette
                plan={plan}
                onUpdatePlan={onUpdatePlan}
                onSelect={onSelectEntity}
                onSelectDefinition={(defId) => {
                  onSelectDefinition?.(defId);
                  onOpenChange(false);
                }}
                locale={locale}
              />
            </div>
          )}

          {/* Tab 4: Plan Lifecycle Management & JSON Export */}
          {activeTab === "manage" && (
            <div data-testid="advanced-manage-panel" className="space-y-4 text-xs">
              {/* 1. Export JSON */}
              <div className="rounded-xl border border-border bg-card p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Download className="h-5 w-5" />
                  </div>
                  <div className="space-y-1 min-w-0 flex-1">
                    <span className="font-semibold text-foreground text-sm block">
                      {t.advancedTools.manage.exportTitle}
                    </span>
                    <p className="text-muted-foreground text-xs leading-relaxed">
                      {t.advancedTools.manage.exportDesc}
                    </p>
                  </div>
                </div>
                <div className="pt-2 border-t border-border/60 flex justify-end">
                  <Button
                    type="button"
                    size="sm"
                    variant="default"
                    data-testid="export-json-btn"
                    onClick={onExportJson}
                    className="h-11 min-h-[44px] min-w-[44px] sm:h-8 sm:min-h-0 sm:min-w-0 px-3 text-xs font-medium gap-1.5 touch-manipulation"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>{t.actions.exportJson}</span>
                  </Button>
                </div>
              </div>

              {/* 2. Reset to Template */}
              <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
                    <RotateCcw className="h-5 w-5" />
                  </div>
                  <div className="space-y-1 min-w-0 flex-1">
                    <span className="font-semibold text-foreground text-sm block">
                      {t.advancedTools.manage.resetTitle}
                    </span>
                    <p className="text-muted-foreground text-xs leading-relaxed">
                      {t.advancedTools.manage.resetDesc}
                    </p>
                  </div>
                </div>
                <div className="pt-2 border-t border-destructive/20 flex justify-end">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    data-testid="restart-template-btn"
                    onClick={() => {
                      onRestartFromTemplate();
                      onOpenChange(false);
                    }}
                    className="h-11 min-h-[44px] min-w-[44px] sm:h-8 sm:min-h-0 sm:min-w-0 px-3 text-xs font-medium gap-1.5 text-destructive border-destructive/30 hover:bg-destructive/10 touch-manipulation"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span>{t.actions.restart}</span>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardScrollArea>
      </Card>
    </div>
  );
}
