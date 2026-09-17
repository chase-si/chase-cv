"use client";

import * as React from "react";
import {
  AlertCircle,
  Check,
  Compass,
  Download,
  Home,
  Loader2,
  PenTool,
  RotateCcw,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";
import { ToolPageChrome } from "@/components/tool-page-chrome";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardScrollArea,
  CardTitle,
} from "@/components/ui/card";
import { getStandardPlans, type StandardPlanSummary } from "@/lib/floor-plan/catalog";
import { createDraftStorage, type FloorPlanDraftStorage } from "@/lib/floor-plan/draft-storage";
import type { FloorPlan } from "@/lib/floor-plan/types";
import {
  createOrResumeUserPlan,
  downloadFloorPlanJson,
} from "@/lib/floor-plan/user-plan";
import { cn } from "@/lib/utils";
import type { SelectedEntity } from "./types";
import { FloorPlanCatalog } from "./floor-plan-catalog";
import { FloorPlanInspector } from "./floor-plan-inspector";
import { FloorPlanSvgViewer } from "./floor-plan-svg-viewer";

interface FloorPlanShellProps {
  initialPlans?: StandardPlanSummary[];
  storage?: FloorPlanDraftStorage;
}

export function FloorPlanShell({ initialPlans, storage: customStorage }: FloorPlanShellProps) {
  const defaultStorage = React.useMemo(() => createDraftStorage(), []);
  const storage = customStorage ?? defaultStorage;

  const plans = React.useMemo(() => initialPlans ?? getStandardPlans(), [initialPlans]);
  const [activePlanId, setActivePlanId] = React.useState<string>(
    plans[0]?.id ?? "plan-std-2br-01",
  );
  const [selectedEntity, setSelectedEntity] = React.useState<SelectedEntity | null>(null);

  // Mobile navigation tabs: "catalog" | "canvas" | "inspector"
  const [mobileTab, setMobileTab] = React.useState<"catalog" | "canvas" | "inspector">("canvas");

  const activePlanSummary = React.useMemo(
    () => plans.find((p) => p.id === activePlanId) ?? plans[0],
    [plans, activePlanId],
  );

  // Active FloorPlan being viewed or edited
  const [currentPlan, setCurrentPlan] = React.useState<FloorPlan>(
    activePlanSummary ? activePlanSummary.plan : ({} as FloorPlan),
  );
  const [isDraftMode, setIsDraftMode] = React.useState<boolean>(false);
  const [saveStatus, setSaveStatus] = React.useState<"idle" | "saving" | "saved" | "failed">("idle");
  const [storedDraft, setStoredDraft] = React.useState<FloorPlan | null>(null);
  const [promptRestore, setPromptRestore] = React.useState<boolean>(false);

  // Check storage whenever active plan template changes
  React.useEffect(() => {
    let isCancelled = false;

    async function checkDraft() {
      try {
        const draft = await storage.getDraft(activePlanId);
        if (isCancelled) return;

        if (draft) {
          setStoredDraft(draft);
          setPromptRestore(true);
        } else {
          setStoredDraft(null);
          setPromptRestore(false);
        }
      } catch {
        if (!isCancelled) {
          setStoredDraft(null);
          setPromptRestore(false);
        }
      }
    }

    checkDraft();

    return () => {
      isCancelled = true;
    };
  }, [activePlanId, storage]);

  const handleSelectPlan = React.useCallback(
    (planId: string) => {
      setActivePlanId(planId);
      setSelectedEntity(null);
      setIsDraftMode(false);
      setSaveStatus("idle");
      const targetSummary = plans.find((p) => p.id === planId) ?? plans[0];
      if (targetSummary) {
        setCurrentPlan(targetSummary.plan);
      }
      setMobileTab("canvas");
    },
    [plans],
  );

  const handleSelectEntity = React.useCallback((entity: SelectedEntity | null) => {
    setSelectedEntity(entity);
    if (entity) {
      setMobileTab("inspector");
    }
  }, []);

  // Customize Plan: converts standard template into editable User plan
  const handleCustomizePlan = React.useCallback(async () => {
    if (!activePlanSummary) return;

    const userPlan = createOrResumeUserPlan(activePlanSummary.plan, storedDraft);
    setCurrentPlan(userPlan);
    setIsDraftMode(true);
    setPromptRestore(false);
    setSaveStatus("saving");

    try {
      await storage.saveDraft(activePlanId, userPlan);
      setStoredDraft(userPlan);
      setSaveStatus("saved");
    } catch {
      setSaveStatus("failed");
    }
  }, [activePlanSummary, storedDraft, storage, activePlanId]);

  // Update plan in draft mode with autosave
  const handleUpdatePlan = React.useCallback(
    async (updatedPlan: FloorPlan) => {
      setCurrentPlan(updatedPlan);
      setSaveStatus("saving");

      try {
        await storage.saveDraft(activePlanId, updatedPlan);
        setStoredDraft(updatedPlan);
        setSaveStatus("saved");
      } catch {
        setSaveStatus("failed");
      }
    },
    [activePlanId, storage],
  );

  // Continue draft from restoration banner
  const handleContinueDraft = React.useCallback(() => {
    if (!storedDraft) return;

    setCurrentPlan(storedDraft);
    setIsDraftMode(true);
    setPromptRestore(false);
    setSaveStatus("saved");
  }, [storedDraft]);

  // Restart from template: resets current plan and deletes draft from storage
  const handleRestartFromTemplate = React.useCallback(async () => {
    if (!activePlanSummary) return;

    try {
      await storage.deleteDraft(activePlanId);
    } catch {
      // safe fallback
    }

    setStoredDraft(null);
    setPromptRestore(false);
    setCurrentPlan(activePlanSummary.plan);
    setIsDraftMode(false);
    setSaveStatus("idle");
    setSelectedEntity(null);
  }, [activePlanId, activePlanSummary, storage]);

  // Export current plan as JSON (AC-16)
  const handleExportJson = React.useCallback(() => {
    downloadFloorPlanJson(currentPlan);
  }, [currentPlan]);

  if (!activePlanSummary) {
    return null;
  }

  const headerActions = (
    <div className="flex items-center gap-2">
      {/* Plan Identification Badge */}
      {isDraftMode ? (
        <Badge
          variant="outline"
          className="hidden sm:inline-flex items-center gap-1.5 font-mono text-xs px-2.5 py-1 border-primary/40 bg-primary/5 text-primary"
        >
          <PenTool className="h-3.5 w-3.5" />
          <span className="truncate max-w-[140px]">{currentPlan.meta.name}</span>
          <span className="text-muted-foreground text-[10px]">(User Draft)</span>
        </Badge>
      ) : (
        <Badge
          variant="secondary"
          className="hidden sm:inline-flex items-center gap-1.5 font-mono text-xs px-2.5 py-1"
        >
          <Home className="h-3.5 w-3.5 text-primary" />
          <span>{activePlanSummary.name}</span>
          <span className="text-muted-foreground">({activePlanSummary.formattedArea})</span>
        </Badge>
      )}

      {/* Save Status Badge */}
      {isDraftMode && (
        <Badge
          data-testid="save-status-badge"
          variant="outline"
          className={cn(
            "inline-flex items-center gap-1.5 text-xs font-mono px-2 py-0.5 transition-colors",
            saveStatus === "saved" &&
              "text-emerald-600 dark:text-emerald-400 border-emerald-500/30 bg-emerald-500/5",
            saveStatus === "saving" && "text-primary border-primary/30 bg-primary/5",
            saveStatus === "failed" && "text-destructive border-destructive/30 bg-destructive/5",
          )}
        >
          {saveStatus === "saving" && <Loader2 className="h-3 w-3 animate-spin text-primary" />}
          {saveStatus === "saved" && <Check className="h-3 w-3 text-emerald-500" />}
          {saveStatus === "failed" && <AlertCircle className="h-3 w-3 text-destructive" />}
          <span className="capitalize">
            {saveStatus === "saving" ? "Saving..." : saveStatus === "saved" ? "Saved" : saveStatus === "failed" ? "Save failed" : "Draft"}
          </span>
        </Badge>
      )}

      {/* Action Buttons */}
      {!isDraftMode ? (
        <Button
          type="button"
          size="sm"
          variant="default"
          data-testid="customize-plan-btn"
          onClick={handleCustomizePlan}
          className="h-7 px-2.5 text-xs flex items-center gap-1.5"
        >
          <SlidersHorizontal className="h-3.5 w-3.5" />
          <span>Customize Plan</span>
        </Button>
      ) : (
        <div className="flex items-center gap-1.5">
          <Button
            type="button"
            size="sm"
            variant="outline"
            data-testid="export-json-btn"
            onClick={handleExportJson}
            className="h-7 px-2.5 text-xs flex items-center gap-1.5"
          >
            <Download className="h-3.5 w-3.5 text-primary" />
            <span className="hidden sm:inline">Export JSON</span>
          </Button>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            data-testid="restart-template-btn"
            onClick={handleRestartFromTemplate}
            className="h-7 px-2 text-xs flex items-center gap-1 text-muted-foreground hover:text-foreground"
            title="Restart from template"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="hidden md:inline">Restart</span>
          </Button>
        </div>
      )}

      {/* Mobile view toggle buttons */}
      <div className="flex items-center rounded-lg border border-border bg-card p-0.5 lg:hidden">
        <Button
          type="button"
          size="sm"
          variant={mobileTab === "catalog" ? "default" : "ghost"}
          onClick={() => setMobileTab("catalog")}
          className="h-7 px-2 text-xs"
        >
          Catalog
        </Button>
        <Button
          type="button"
          size="sm"
          variant={mobileTab === "canvas" ? "default" : "ghost"}
          onClick={() => setMobileTab("canvas")}
          className="h-7 px-2 text-xs"
        >
          Plan
        </Button>
        <Button
          type="button"
          size="sm"
          variant={mobileTab === "inspector" ? "default" : "ghost"}
          onClick={() => setMobileTab("inspector")}
          className="h-7 px-2 text-xs"
        >
          Details
        </Button>
      </div>
    </div>
  );

  return (
    <ToolPageChrome
      title="Floor Plan Space Validator"
      description="Browse standard plans in responsive SVG viewer, verify room boundaries, openings, and furniture dimensions."
      actions={headerActions}
    >
      {/* 3-Pane Desktop Layout, Responsive Mobile Layout */}
      <div className="grid min-h-0 flex-1 gap-3 lg:grid-cols-[19rem_minmax(0,1fr)_18rem] lg:items-stretch">
        {/* Left Pane: Standard Plans Catalog */}
        <aside
          className={`min-h-0 flex-col lg:flex ${
            mobileTab === "catalog" ? "flex flex-1" : "hidden"
          }`}
        >
          <Card className="flex min-h-0 flex-1 flex-col overflow-hidden">
            <CardHeader className="shrink-0 pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Compass className="h-4 w-4 text-primary" />
                  <span>Standard Plans</span>
                </CardTitle>
                <Badge variant="outline" className="text-[10px] font-mono">
                  {plans.length} approved
                </Badge>
              </div>
            </CardHeader>
            <CardScrollArea className="min-h-0 flex-1 px-4 pb-4">
              <FloorPlanCatalog
                plans={plans}
                activePlanId={activePlanId}
                onSelectPlan={handleSelectPlan}
              />
            </CardScrollArea>
          </Card>
        </aside>

        {/* Center Pane: Interactive Responsive SVG Viewer Canvas + Draft Restoration Banner */}
        <section
          className={`min-h-0 flex-col lg:flex ${
            mobileTab === "canvas" ? "flex flex-1" : "hidden"
          }`}
        >
          <Card className="flex min-h-0 flex-1 flex-col overflow-hidden border-border bg-card p-0">
            {/* Draft Restoration Banner (AC-15) */}
            {promptRestore && storedDraft && !isDraftMode && (
              <div
                data-testid="draft-restore-banner"
                className="flex flex-wrap items-center justify-between gap-2 border-b border-primary/20 bg-primary/5 px-3 py-2 text-xs text-foreground shrink-0"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary shrink-0" />
                  <span>
                    A saved draft was found for this plan (
                    <strong className="font-semibold">{storedDraft.meta.name}</strong>).
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Button
                    type="button"
                    size="sm"
                    variant="default"
                    data-testid="continue-draft-btn"
                    onClick={handleContinueDraft}
                    className="h-7 px-2.5 text-xs"
                  >
                    Continue draft
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    data-testid="discard-draft-btn"
                    onClick={handleRestartFromTemplate}
                    className="h-7 px-2.5 text-xs text-muted-foreground hover:text-destructive"
                  >
                    Restart from template
                  </Button>
                </div>
              </div>
            )}

            <FloorPlanSvgViewer
              plan={currentPlan}
              selectedEntity={selectedEntity}
              onSelect={handleSelectEntity}
              className="flex-1"
            />
          </Card>
        </section>

        {/* Right Pane: Entity Inspector / Plan Details */}
        <aside
          className={`min-h-0 flex-col lg:flex ${
            mobileTab === "inspector" ? "flex flex-1" : "hidden"
          }`}
        >
          <Card className="flex min-h-0 flex-1 flex-col overflow-hidden">
            <CardHeader className="shrink-0 pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-primary" />
                <span>Spatial Inspector</span>
              </CardTitle>
            </CardHeader>
            <CardScrollArea className="min-h-0 flex-1 px-4 pb-4">
              <FloorPlanInspector
                plan={currentPlan}
                isDraftMode={isDraftMode}
                onUpdatePlan={handleUpdatePlan}
                selectedEntity={selectedEntity}
                onSelect={handleSelectEntity}
              />
            </CardScrollArea>
          </Card>
        </aside>
      </div>
    </ToolPageChrome>
  );
}
