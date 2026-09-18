"use client";

import * as React from "react";
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
  Sparkles,
  Undo2,
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
import {
  canRedo,
  canUndo,
  commitPlanChange,
  createPlanHistory,
  redo,
  undo,
  type PlanHistory,
} from "@/lib/floor-plan/history";
import type { FloorPlan } from "@/lib/floor-plan/types";
import {
  createOrResumeUserPlan,
  downloadFloorPlanJson,
} from "@/lib/floor-plan/user-plan";
import { cn } from "@/lib/utils";
import { evaluatePlanRules } from "@/lib/floor-plan/rules";
import type { SelectedEntity } from "./types";
import { FloorPlanCatalog } from "./floor-plan-catalog";
import { FloorPlanInspector } from "./floor-plan-inspector";
import { FloorPlanSvgViewer } from "./floor-plan-svg-viewer";
import { MobileBottomSheet } from "./mobile-bottom-sheet";
import { FurnitureCatalogPalette } from "./furniture-catalog-palette";
import { RuleFeedbackPanel } from "./rule-feedback-panel";

interface FloorPlanShellProps {
  initialPlans?: StandardPlanSummary[];
  storage?: FloorPlanDraftStorage;
  isMobile?: boolean;
}

export function useIsMobile(propIsMobile?: boolean): boolean {
  const [isMobile, setIsMobile] = React.useState<boolean>(() => {
    if (propIsMobile !== undefined) return propIsMobile;
    if (typeof window !== "undefined") {
      if (typeof window.matchMedia === "function") {
        return window.matchMedia("(max-width: 1023px)").matches;
      }
      return window.innerWidth < 1024;
    }
    return false;
  });

  React.useEffect(() => {
    if (propIsMobile !== undefined) {
      setIsMobile(propIsMobile);
      return;
    }

    const checkMobile = () => {
      if (typeof window !== "undefined") {
        if (typeof window.matchMedia === "function") {
          return window.matchMedia("(max-width: 1023px)").matches;
        }
        return window.innerWidth < 1024;
      }
      return false;
    };

    setIsMobile(checkMobile());

    const handleResize = () => {
      setIsMobile(checkMobile());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [propIsMobile]);

  return propIsMobile ?? isMobile;
}

export function FloorPlanShell({
  initialPlans,
  storage: customStorage,
  isMobile: propIsMobile,
}: FloorPlanShellProps) {
  const isMobile = useIsMobile(propIsMobile);
  const defaultStorage = React.useMemo(() => createDraftStorage(), []);
  const storage = customStorage ?? defaultStorage;

  const plans = React.useMemo(() => initialPlans ?? getStandardPlans(), [initialPlans]);
  const [activePlanId, setActivePlanId] = React.useState<string>(
    plans[0]?.id ?? "plan-std-2br-01",
  );
  const [selectedEntity, setSelectedEntity] = React.useState<SelectedEntity | null>(null);

  // Mobile canvas mode: "pan" (pure pan, prevent accidental edits) vs "edit" (select & edit entities)
  const [canvasMode, setCanvasMode] = React.useState<"pan" | "edit">("edit");

  // Mobile bottom properties surface state: "entity" | "furniture-palette" | "rules" | "catalog" | null
  const [mobileSheetType, setMobileSheetType] = React.useState<
    "entity" | "furniture-palette" | "rules" | "catalog" | null
  >(null);

  const activePlanSummary = React.useMemo(
    () => plans.find((p) => p.id === activePlanId) ?? plans[0],
    [plans, activePlanId],
  );

  // Active FloorPlan being viewed or edited
  const [currentPlan, setCurrentPlan] = React.useState<FloorPlan>(
    activePlanSummary ? activePlanSummary.plan : ({} as FloorPlan),
  );
  const [history, setHistory] = React.useState<PlanHistory>(() =>
    createPlanHistory(activePlanSummary ? activePlanSummary.plan : ({} as FloorPlan)),
  );
  const [isDraftMode, setIsDraftMode] = React.useState<boolean>(false);
  const [saveStatus, setSaveStatus] = React.useState<"idle" | "saving" | "saved" | "failed">("idle");
  const [storedDraft, setStoredDraft] = React.useState<FloorPlan | null>(null);
  const [promptRestore, setPromptRestore] = React.useState<boolean>(false);

  // Evaluate spatial rules deterministically (US-12, US-14, AC-12, AC-14)
  const violations = React.useMemo(() => evaluatePlanRules(currentPlan), [currentPlan]);

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
      setMobileSheetType(null);
      setIsDraftMode(false);
      setSaveStatus("idle");
      const targetSummary = plans.find((p) => p.id === planId) ?? plans[0];
      if (targetSummary) {
        setCurrentPlan(targetSummary.plan);
        setHistory(createPlanHistory(targetSummary.plan));
      }
    },
    [plans],
  );

  const handleSelectEntity = React.useCallback((entity: SelectedEntity | null) => {
    setSelectedEntity(entity);
    if (entity) {
      setMobileSheetType("entity");
    } else {
      setMobileSheetType((prev) => (prev === "entity" ? null : prev));
    }
  }, []);

  const handleCloseMobileSheet = React.useCallback(() => {
    setSelectedEntity(null);
    setMobileSheetType(null);
  }, []);

  // Customize Plan: converts standard template into editable User plan
  const handleCustomizePlan = React.useCallback(async () => {
    if (!activePlanSummary) return;

    const userPlan = createOrResumeUserPlan(activePlanSummary.plan, storedDraft);
    setCurrentPlan(userPlan);
    setHistory(createPlanHistory(userPlan, { description: "Initial custom draft" }));
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
    async (updatedPlan: FloorPlan, description?: string) => {
      setCurrentPlan(updatedPlan);
      setHistory((prev) => commitPlanChange(prev, updatedPlan, description));
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

  // Undo committed operation (AC-8)
  const handleUndo = React.useCallback(async () => {
    if (!isDraftMode || !canUndo(history)) return;

    const nextHistory = undo(history);
    setHistory(nextHistory);
    const restoredPlan = nextHistory.present.plan;
    setCurrentPlan(restoredPlan);

    // If selected entity no longer exists in restored plan, deselect
    setSelectedEntity((prev) => {
      if (!prev) return null;
      const exists =
        prev.type === "wall"
          ? restoredPlan.walls.some((w) => w.id === prev.id)
          : prev.type === "room"
            ? restoredPlan.rooms.some((r) => r.id === prev.id)
            : prev.type === "opening"
              ? restoredPlan.openings.some((o) => o.id === prev.id)
              : prev.type === "furniture"
                ? restoredPlan.furniture.some((f) => f.id === prev.id)
                : true;
      return exists ? prev : null;
    });

    setSaveStatus("saving");
    try {
      await storage.saveDraft(activePlanId, restoredPlan);
      setStoredDraft(restoredPlan);
      setSaveStatus("saved");
    } catch {
      setSaveStatus("failed");
    }
  }, [isDraftMode, history, activePlanId, storage]);

  // Redo undone operation (AC-8)
  const handleRedo = React.useCallback(async () => {
    if (!isDraftMode || !canRedo(history)) return;

    const nextHistory = redo(history);
    setHistory(nextHistory);
    const restoredPlan = nextHistory.present.plan;
    setCurrentPlan(restoredPlan);

    setSelectedEntity((prev) => {
      if (!prev) return null;
      const exists =
        prev.type === "wall"
          ? restoredPlan.walls.some((w) => w.id === prev.id)
          : prev.type === "room"
            ? restoredPlan.rooms.some((r) => r.id === prev.id)
            : prev.type === "opening"
              ? restoredPlan.openings.some((o) => o.id === prev.id)
              : prev.type === "furniture"
                ? restoredPlan.furniture.some((f) => f.id === prev.id)
                : true;
      return exists ? prev : null;
    });

    setSaveStatus("saving");
    try {
      await storage.saveDraft(activePlanId, restoredPlan);
      setStoredDraft(restoredPlan);
      setSaveStatus("saved");
    } catch {
      setSaveStatus("failed");
    }
  }, [isDraftMode, history, activePlanId, storage]);

  // Global keyboard shortcuts for Undo (Cmd+Z / Ctrl+Z) and Redo (Cmd+Shift+Z / Ctrl+Shift+Z / Ctrl+Y)
  React.useEffect(() => {
    if (!isDraftMode) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      if (
        activeEl &&
        (activeEl.tagName === "INPUT" ||
          activeEl.tagName === "TEXTAREA" ||
          (activeEl as HTMLElement).isContentEditable)
      ) {
        return;
      }

      const isCmdOrCtrl = e.metaKey || e.ctrlKey;
      if (!isCmdOrCtrl) return;

      if (e.key === "z" || e.key === "Z") {
        e.preventDefault();
        if (e.shiftKey) {
          handleRedo();
        } else {
          handleUndo();
        }
      } else if (e.key === "y" || e.key === "Y") {
        e.preventDefault();
        handleRedo();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isDraftMode, handleUndo, handleRedo]);

  // Continue draft from restoration banner
  const handleContinueDraft = React.useCallback(() => {
    if (!storedDraft) return;

    setCurrentPlan(storedDraft);
    setHistory(createPlanHistory(storedDraft, { description: "Restored draft" }));
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
    setHistory(createPlanHistory(activePlanSummary.plan));
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

      {/* Spatial Violations Badge (AC-12, AC-13, AC-14) */}
      {violations.length > 0 && (
        <Badge
          data-testid="shell-violations-badge"
          variant="outline"
          className={cn(
            "inline-flex items-center gap-1 text-xs font-mono px-2 py-0.5 cursor-pointer hover:opacity-90 transition-opacity",
            violations.some((v) => v.severity === "error")
              ? "border-destructive/40 text-destructive bg-destructive/10"
              : "border-amber-500/40 text-amber-600 dark:text-amber-400 bg-amber-500/10",
          )}
          onClick={() => {
            setSelectedEntity(null);
            setMobileSheetType("rules");
          }}
          title="View spatial rule guidance"
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
                ? "Error"
                : "Warning"
              : violations.some((v) => v.severity === "error")
                ? "Issues"
                : "Warnings"}
          </span>
        </Badge>
      )}

      {/* Mode Toggle: Pan Mode vs Edit Mode (AC-5) */}
      <div className="flex items-center rounded-xl border border-border bg-card p-0.5 shadow-xs touch-manipulation">
        <Button
          type="button"
          size="sm"
          variant={canvasMode === "pan" ? "default" : "ghost"}
          data-testid="mode-toggle-pan"
          onClick={() => setCanvasMode("pan")}
          className="h-11 min-h-[44px] min-w-[44px] px-3 sm:h-7 sm:min-h-0 sm:min-w-0 sm:px-2.5 gap-1.5 text-xs touch-manipulation font-medium"
          title="Pan Canvas Mode (pure pan, prevent accidental edits)"
        >
          <Hand className="h-4 w-4" />
          <span>Pan</span>
        </Button>
        <Button
          type="button"
          size="sm"
          variant={canvasMode === "edit" ? "default" : "ghost"}
          data-testid="mode-toggle-edit"
          onClick={() => setCanvasMode("edit")}
          className="h-11 min-h-[44px] min-w-[44px] px-3 sm:h-7 sm:min-h-0 sm:min-w-0 sm:px-2.5 gap-1.5 text-xs touch-manipulation font-medium"
          title="Edit Mode (select & edit entities)"
        >
          <MousePointer2 className="h-4 w-4" />
          <span>Edit</span>
        </Button>
      </div>

      {/* Action Buttons */}
      {!isDraftMode ? (
        <div className="flex items-center gap-1.5 flex-wrap">
          <Button
            type="button"
            size="sm"
            variant="default"
            data-testid="customize-plan-btn"
            onClick={handleCustomizePlan}
            className="h-11 min-h-[44px] min-w-[44px] sm:h-7 sm:min-h-0 sm:min-w-0 px-3 sm:px-2.5 text-xs flex items-center gap-1.5 touch-manipulation"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span>Customize Plan</span>
          </Button>

          <Button
            type="button"
            size="sm"
            variant="outline"
            data-testid="mobile-catalog-btn"
            onClick={() => {
              setSelectedEntity(null);
              setMobileSheetType("catalog");
            }}
            className="h-11 min-h-[44px] min-w-[44px] px-2.5 text-xs flex items-center gap-1.5 touch-manipulation lg:hidden"
            title="Browse standard plans"
          >
            <Compass className="h-3.5 w-3.5 text-primary" />
            <span className="hidden sm:inline">Plans</span>
          </Button>

          <Button
            type="button"
            size="sm"
            variant="outline"
            data-testid="mobile-rules-btn"
            onClick={() => {
              setSelectedEntity(null);
              setMobileSheetType("rules");
            }}
            className="h-11 min-h-[44px] min-w-[44px] px-2.5 text-xs flex items-center gap-1.5 touch-manipulation lg:hidden"
            title="View spatial rule guidance"
          >
            <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
            <span className="hidden sm:inline">Rules</span>
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Undo Button (AC-8) */}
          <Button
            type="button"
            size="sm"
            variant="outline"
            data-testid="undo-btn"
            onClick={handleUndo}
            disabled={!canUndo(history)}
            className="h-11 min-h-[44px] min-w-[44px] sm:h-7 sm:min-h-0 sm:min-w-0 px-2.5 text-xs flex items-center gap-1 touch-manipulation"
            title="Undo (Ctrl+Z / ⌘Z)"
            aria-label="Undo"
          >
            <Undo2 className="h-3.5 w-3.5" />
            <span className="hidden md:inline">Undo</span>
          </Button>

          {/* Redo Button (AC-8) */}
          <Button
            type="button"
            size="sm"
            variant="outline"
            data-testid="redo-btn"
            onClick={handleRedo}
            disabled={!canRedo(history)}
            className="h-11 min-h-[44px] min-w-[44px] sm:h-7 sm:min-h-0 sm:min-w-0 px-2.5 text-xs flex items-center gap-1 touch-manipulation"
            title="Redo (Ctrl+Shift+Z / ⌘⇧Z / Ctrl+Y)"
            aria-label="Redo"
          >
            <Redo2 className="h-3.5 w-3.5" />
            <span className="hidden md:inline">Redo</span>
          </Button>

          {/* Mobile Add Furniture Button (AC-5) */}
          <Button
            type="button"
            size="sm"
            variant="outline"
            data-testid="mobile-add-furniture-btn"
            onClick={() => {
              setSelectedEntity(null);
              setMobileSheetType("furniture-palette");
            }}
            className="h-11 min-h-[44px] min-w-[44px] px-2.5 text-xs flex items-center gap-1.5 touch-manipulation lg:hidden"
            title="Add Furniture"
          >
            <Armchair className="h-3.5 w-3.5 text-primary" />
            <span>+ Furniture</span>
          </Button>

          {/* Mobile Rules Button (AC-5) */}
          <Button
            type="button"
            size="sm"
            variant="outline"
            data-testid="mobile-rules-btn"
            onClick={() => {
              setSelectedEntity(null);
              setMobileSheetType("rules");
            }}
            className="h-11 min-h-[44px] min-w-[44px] px-2.5 text-xs flex items-center gap-1.5 touch-manipulation lg:hidden"
            title="View spatial rule feedback"
          >
            {violations.some((v) => v.severity === "error") ? (
              <AlertCircle className="h-3.5 w-3.5 text-destructive" />
            ) : violations.length > 0 ? (
              <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
            ) : (
              <Check className="h-3.5 w-3.5 text-emerald-500" />
            )}
            <span className="hidden sm:inline">Rules</span>
            {violations.length > 0 && (
              <Badge variant="secondary" className="px-1.5 py-0 text-[10px] font-mono">
                {violations.length}
              </Badge>
            )}
          </Button>

          {/* Mobile Plans Catalog Button */}
          <Button
            type="button"
            size="sm"
            variant="outline"
            data-testid="mobile-catalog-btn"
            onClick={() => {
              setSelectedEntity(null);
              setMobileSheetType("catalog");
            }}
            className="h-11 min-h-[44px] min-w-[44px] px-2.5 text-xs flex items-center gap-1.5 touch-manipulation lg:hidden"
            title="Browse standard plans"
          >
            <Compass className="h-3.5 w-3.5 text-primary" />
            <span className="hidden sm:inline">Plans</span>
          </Button>

          {/* Export JSON Button (AC-16) */}
          <Button
            type="button"
            size="sm"
            variant="outline"
            data-testid="export-json-btn"
            onClick={handleExportJson}
            className="h-11 min-h-[44px] min-w-[44px] sm:h-7 sm:min-h-0 sm:min-w-0 px-2.5 text-xs flex items-center gap-1.5 touch-manipulation"
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
            className="h-11 min-h-[44px] min-w-[44px] sm:h-7 sm:min-h-0 sm:min-w-0 px-2 text-xs flex items-center gap-1 text-muted-foreground hover:text-foreground touch-manipulation"
            title="Restart from template"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="hidden md:inline">Restart</span>
          </Button>
        </div>
      )}
    </div>
  );

  const isMobileSheetOpen = isMobile && (selectedEntity !== null || mobileSheetType !== null);

  const mobileSheetTitle = React.useMemo(() => {
    if (selectedEntity) {
      switch (selectedEntity.type) {
        case "room":
          return "Room Properties";
        case "wall":
          return "Wall Properties";
        case "opening":
          return "Opening Properties";
        case "furniture":
          return "Furniture Properties";
        case "dimension":
          return "Dimension Properties";
        default:
          return "Entity Properties";
      }
    }
    if (mobileSheetType === "furniture-palette") return "Furniture Catalog";
    if (mobileSheetType === "rules") return "Spatial Rule Feedback";
    if (mobileSheetType === "catalog") return "Standard Plans";
    return "Details";
  }, [selectedEntity, mobileSheetType]);

  const mobileSheetBadge = React.useMemo(() => {
    if (selectedEntity) {
      return (
        <Badge variant="outline" className="text-[10px] uppercase font-mono">
          {selectedEntity.type}
        </Badge>
      );
    }
    if (mobileSheetType === "rules") {
      return (
        <Badge
          variant="outline"
          className={cn(
            "text-[10px] font-mono",
            violations.some((v) => v.severity === "error")
              ? "border-destructive/40 text-destructive bg-destructive/10"
              : "border-amber-500/40 text-amber-600 dark:text-amber-400 bg-amber-500/10",
          )}
        >
          {violations.length} {violations.length === 1 ? "issue" : "issues"}
        </Badge>
      );
    }
    return null;
  }, [selectedEntity, mobileSheetType, violations]);

  const mobileSheetBody = React.useMemo(() => {
    if (selectedEntity) {
      return (
        <FloorPlanInspector
          plan={currentPlan}
          isDraftMode={isDraftMode}
          onUpdatePlan={handleUpdatePlan}
          selectedEntity={selectedEntity}
          onSelect={handleSelectEntity}
          violations={violations}
        />
      );
    }
    if (mobileSheetType === "furniture-palette") {
      return (
        <FurnitureCatalogPalette
          plan={currentPlan}
          onUpdatePlan={handleUpdatePlan}
          onSelect={(entity) => {
            handleSelectEntity(entity);
          }}
          onClose={() => setMobileSheetType(null)}
        />
      );
    }
    if (mobileSheetType === "rules") {
      return (
        <RuleFeedbackPanel
          plan={currentPlan}
          ruleResults={violations}
          selectedEntity={selectedEntity}
          onSelect={(entity) => {
            handleSelectEntity(entity);
          }}
        />
      );
    }
    if (mobileSheetType === "catalog") {
      return (
        <FloorPlanCatalog
          plans={plans}
          activePlanId={activePlanId}
          onSelectPlan={(id) => {
            handleSelectPlan(id);
            setMobileSheetType(null);
          }}
        />
      );
    }
    return null;
  }, [
    selectedEntity,
    mobileSheetType,
    currentPlan,
    isDraftMode,
    handleUpdatePlan,
    handleSelectEntity,
    violations,
    plans,
    activePlanId,
    handleSelectPlan,
  ]);

  return (
    <ToolPageChrome
      title="Floor Plan Space Validator"
      description="Browse standard plans in responsive SVG viewer, verify room boundaries, openings, and furniture dimensions."
      actions={headerActions}
    >
      {/* 3-Pane Desktop Layout, Responsive Mobile Layout with Primary Canvas */}
      <div className="grid min-h-0 flex-1 gap-3 lg:grid-cols-[19rem_minmax(0,1fr)_18rem] lg:items-stretch">
        {/* Left Pane: Standard Plans Catalog */}
        <aside className="hidden min-h-0 flex-col lg:flex">
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
        <section className="flex min-h-0 flex-1 flex-col overflow-hidden">
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
                    className="h-11 min-h-[44px] min-w-[44px] sm:h-7 sm:min-h-0 sm:min-w-0 px-2.5 text-xs touch-manipulation"
                  >
                    Continue draft
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    data-testid="discard-draft-btn"
                    onClick={handleRestartFromTemplate}
                    className="h-11 min-h-[44px] min-w-[44px] sm:h-7 sm:min-h-0 sm:min-w-0 px-2.5 text-xs text-muted-foreground hover:text-destructive touch-manipulation"
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
              isDraftMode={isDraftMode}
              onUpdatePlan={handleUpdatePlan}
              violations={violations}
              canvasMode={canvasMode}
              className="flex-1"
            />
          </Card>
        </section>

        {/* Right Pane: Entity Inspector / Plan Details (Desktop) */}
        {!isMobile && (
          <aside className="hidden min-h-0 flex-col lg:flex">
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
                  violations={violations}
                />
              </CardScrollArea>
            </Card>
          </aside>
        )}
      </div>

      {/* Mobile Bottom Properties Surface (AC-5) */}
      {isMobile && (
        <MobileBottomSheet
          open={isMobileSheetOpen}
          onClose={handleCloseMobileSheet}
          title={mobileSheetTitle}
          badge={mobileSheetBadge}
        >
          {mobileSheetBody}
        </MobileBottomSheet>
      )}
    </ToolPageChrome>
  );
}
