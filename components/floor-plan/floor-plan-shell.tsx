"use client";

import * as React from "react";
import {
  Armchair,
  ArrowRight,
  Compass,
  SlidersHorizontal,
  Sparkles,
  Wrench,
  X,
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
import {
  getStandardPlans,
  resolvePlanCategory,
  type StandardPlanSummary,
} from "@/lib/floor-plan/catalog";
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
import { evaluatePlanRules } from "@/lib/floor-plan/rules";
import {
  computePolygonArea,
  computeRoomPolygon,
  getVertexMap,
  getWallMap,
} from "@/lib/floor-plan/geometry";
import { getRoomSpans } from "@/lib/floor-plan/room-adjustment";
import type { SelectedEntity } from "./types";
import { FloorPlanCatalog } from "./floor-plan-catalog";
import { FloorPlanInspector } from "./floor-plan-inspector";
import { FloorPlanSvgViewer } from "./floor-plan-svg-viewer";
import { FloorPlanToolbar } from "./floor-plan-toolbar";
import { MobileBottomSheet } from "./mobile-bottom-sheet";
import { FurnitureCatalogPalette } from "./furniture-catalog-palette";
import { FloorPlanWorkflowStepper, type WorkflowStage } from "./floor-plan-workflow-stepper";
import { FloorPlanSelectorDialog } from "./floor-plan-selector-dialog";
import { FurnitureCatalogDialog } from "./furniture-catalog-dialog";
import { AdvancedToolsDialog, type AdvancedToolsTab } from "./advanced-tools-dialog";
import { ContextFurniturePanel } from "./context-furniture-panel";
import { FurnitureDecisionPanel } from "./furniture-decision-panel";
import {
  addFurnitureInstance,
  computeRoomInitialDropPosition,
  moveFurnitureInstance,
} from "@/lib/floor-plan/furniture-operations";
import { getDefaultFurnitureCatalog } from "@/lib/floor-plan/furniture-catalog";
import { RoomList } from "./room-list";
import { useFloorPlanI18n } from "@/lib/floor-plan/i18n";
import { RuleFeedbackPanel } from "./rule-feedback-panel";
import { cn } from "@/lib/utils";

export interface FloorPlanShellProps {
  initialPlans?: StandardPlanSummary[];
  initialActivePlan?: FloorPlan;
  onPlanChange?: (plan: FloorPlan) => void;
  storage?: FloorPlanDraftStorage;
  isMobile?: boolean;
  locale?: string;
}

export function useIsMobile(propIsMobile?: boolean): boolean {
  const subscribe = React.useCallback(
    (onStoreChange: () => void) => {
      if (typeof window === "undefined" || propIsMobile !== undefined) {
        return () => {};
      }
      if (typeof window.matchMedia !== "function") {
        window.addEventListener("resize", onStoreChange);
        return () => window.removeEventListener("resize", onStoreChange);
      }
      const mql = window.matchMedia("(max-width: 1023px)");
      mql.addEventListener("change", onStoreChange);
      window.addEventListener("resize", onStoreChange);
      return () => {
        mql.removeEventListener("change", onStoreChange);
        window.removeEventListener("resize", onStoreChange);
      };
    },
    [propIsMobile],
  );

  const getSnapshot = React.useCallback(() => {
    if (propIsMobile !== undefined) return propIsMobile;
    if (typeof window === "undefined") return false;
    if (typeof window.matchMedia === "function") {
      return window.matchMedia("(max-width: 1023px)").matches;
    }
    return window.innerWidth < 1024;
  }, [propIsMobile]);

  const getServerSnapshot = React.useCallback(() => {
    return propIsMobile ?? false;
  }, [propIsMobile]);

  return React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function FloorPlanShell({
  initialPlans,
  initialActivePlan,
  onPlanChange,
  storage: customStorage,
  isMobile: propIsMobile,
  locale,
}: FloorPlanShellProps) {
  const isMobile = useIsMobile(propIsMobile);
  const defaultStorage = React.useMemo(() => createDraftStorage(), []);
  const storage = customStorage ?? defaultStorage;
  const i18n = useFloorPlanI18n(locale);
  const t = i18n.t;

  const recognizedSummary = React.useMemo<StandardPlanSummary | null>(() => {
    if (!initialActivePlan) return null;
    return {
      id: initialActivePlan.meta.id ?? "plan-custom-recognized",
      name: initialActivePlan.meta.name,
      description: initialActivePlan.meta.unscaled
        ? locale === "zh"
          ? "CubiCasa 未标定相对几何"
          : "CubiCasa Uncalibrated Plan"
        : locale === "zh"
          ? "CubiCasa 已标定标准方案"
          : "CubiCasa Calibrated Plan",
      areaM2: 0,
      formattedArea: initialActivePlan.meta.unscaled
        ? locale === "zh"
          ? "未标定真实尺寸"
          : "Uncalibrated"
        : locale === "zh"
          ? "已标定"
          : "Calibrated",
      roomCount: initialActivePlan.rooms.length,
      roomBreakdown:
        locale === "zh"
          ? `${initialActivePlan.rooms.length} 间功能区`
          : `${initialActivePlan.rooms.length} rooms`,
      categoryKey: resolvePlanCategory(
        initialActivePlan as StandardPlanSummary["plan"],
      ),
      tags: [
        initialActivePlan.meta.source,
        initialActivePlan.meta.unscaled
          ? locale === "zh"
            ? "未标定"
            : "Unscaled"
          : locale === "zh"
            ? "已标定"
            : "Calibrated",
      ],
      plan: initialActivePlan as unknown as StandardPlanSummary["plan"],
    };
  }, [initialActivePlan, locale]);

  const basePlans = React.useMemo(
    () => initialPlans ?? getStandardPlans(locale),
    [initialPlans, locale],
  );
  const plans = React.useMemo(() => {
    if (recognizedSummary) {
      return [recognizedSummary, ...basePlans.filter((p) => p.id !== recognizedSummary.id)];
    }
    return basePlans;
  }, [basePlans, recognizedSummary]);

  const [activePlanId, setActivePlanId] = React.useState<string>(
    initialActivePlan?.meta.id ?? plans[0]?.id ?? "plan-cn-sh-ruidong-2br-67",
  );
  const [selectedEntity, setSelectedEntity] = React.useState<SelectedEntity | null>(null);

  // Four-stage workflow state (AC-1, AC-7)
  const [currentStage, setCurrentStage] = React.useState<WorkflowStage>("plan");
  const [completedStages, setCompletedStages] = React.useState<WorkflowStage[]>([]);

  // Target room & target furniture state (AC-8, AC-9)
  const [targetRoomId, setTargetRoomId] = React.useState<string | null>(null);
  const [targetFurnitureId, setTargetFurnitureId] = React.useState<string | null>(null);

  // On-demand plan selector dialog open state (AC-2)
  const [isPlanSelectorOpen, setIsPlanSelectorOpen] = React.useState<boolean>(false);

  // On-demand furniture catalog dialog open state (AC-12)
  const [isFurnitureCatalogOpen, setIsFurnitureCatalogOpen] = React.useState<boolean>(false);

  // Mobile canvas mode: "pan" (pure pan, prevent accidental edits) vs "edit" (select & edit entities)
  const [canvasMode, setCanvasMode] = React.useState<"pan" | "edit">("edit");

  // Mobile bottom properties surface state: "entity" | "furniture-palette" | "rules" | "catalog" | "decision" | null
  const [mobileSheetType, setMobileSheetType] = React.useState<
    "entity" | "furniture-palette" | "rules" | "catalog" | "decision" | null
  >(null);

  // On-demand Advanced Tools dialog open state (AC-26)
  const [isAdvancedToolsOpen, setIsAdvancedToolsOpen] = React.useState<boolean>(false);
  const [advancedToolsTab, setAdvancedToolsTab] = React.useState<AdvancedToolsTab>("rules");

  const handleOpenAdvancedTools = React.useCallback(
    (tab: AdvancedToolsTab = "rules") => {
      setAdvancedToolsTab(tab);
      setIsAdvancedToolsOpen(true);
    },
    [],
  );

  const activePlanSummary = React.useMemo(
    () => plans.find((p) => p.id === activePlanId) ?? plans[0],
    [plans, activePlanId],
  );

  // Active FloorPlan being viewed or edited
  const [currentPlan, setCurrentPlan] = React.useState<FloorPlan>(
    initialActivePlan ?? (activePlanSummary ? activePlanSummary.plan : ({} as FloorPlan)),
  );
  const [history, setHistory] = React.useState<PlanHistory>(() =>
    createPlanHistory(
      initialActivePlan ?? (activePlanSummary ? activePlanSummary.plan : ({} as FloorPlan)),
    ),
  );
  const [isDraftMode, setIsDraftMode] = React.useState<boolean>(Boolean(initialActivePlan));
  const [saveStatus, setSaveStatus] = React.useState<"idle" | "saving" | "saved" | "failed">("idle");
  const [storedDraft, setStoredDraft] = React.useState<FloorPlan | null>(null);
  const [promptRestore, setPromptRestore] = React.useState<boolean>(false);

  // Evaluate spatial rules deterministically (US-12, US-14, AC-12, AC-14)
  const violations = React.useMemo(() => evaluatePlanRules(currentPlan), [currentPlan]);

  const targetRoom = React.useMemo(() => {
    if (!targetRoomId) return null;
    return currentPlan.rooms.find((r) => r.id === targetRoomId) ?? null;
  }, [currentPlan.rooms, targetRoomId]);

  const targetRoomDetails = React.useMemo(() => {
    if (!targetRoom) return null;
    const vertexMap = getVertexMap(currentPlan);
    const wallMap = getWallMap(currentPlan);
    const points = computeRoomPolygon(targetRoom, wallMap, vertexMap);
    const area = computePolygonArea(points);
    const spans = getRoomSpans(currentPlan, targetRoom.id);
    const displayName =
      targetRoom.name ?? i18n.getRoomTypeLabel(targetRoom.type);

    return {
      room: targetRoom,
      displayName,
      area,
      spans,
    };
  }, [targetRoom, currentPlan, locale, i18n]);

  const targetFurniture = React.useMemo(() => {
    if (!targetFurnitureId) return null;
    return currentPlan.furniture.find((f) => f.id === targetFurnitureId) ?? null;
  }, [currentPlan.furniture, targetFurnitureId]);

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
      const hadSelectionOrDownstream =
        targetRoomId !== null || targetFurnitureId !== null || currentStage !== "plan";
      setActivePlanId(planId);
      setSelectedEntity(null);
      setTargetRoomId(null);
      setTargetFurnitureId(null);
      setMobileSheetType(null);
      setIsDraftMode(false);
      setSaveStatus("idle");
      // AC-22: Changing floor plan clears old room and target furniture selection and returns to room stage
      if (hadSelectionOrDownstream) {
        setCurrentStage("room");
        setCompletedStages(["plan"]);
      } else {
        setCurrentStage("plan");
        setCompletedStages([]);
      }
      const targetSummary = plans.find((p) => p.id === planId) ?? plans[0];
      if (targetSummary) {
        setCurrentPlan(targetSummary.plan);
        setHistory(createPlanHistory(targetSummary.plan));
      }
    },
    [plans, targetRoomId, targetFurnitureId, currentStage],
  );

  const handleSelectTargetRoom = React.useCallback(
    (roomId: string) => {
      const isDifferentRoom = targetRoomId !== null && targetRoomId !== roomId;
      setTargetRoomId(roomId);
      if (!isMobile) {
        setSelectedEntity({ type: "room", id: roomId });
      }

      if (isDifferentRoom) {
        // AC-9: When user switches target room, old target furniture no longer drives current decision
        setTargetFurnitureId(null);
        // Flow returns to that room's furniture selection state
        if (currentStage === "decision") {
          setCurrentStage("furniture");
        }
      }
    },
    [targetRoomId, currentStage, isMobile],
  );

  const handleSelectEntity = React.useCallback(
    (entity: SelectedEntity | null) => {
      if (entity?.type === "room") {
        handleSelectTargetRoom(entity.id);
        if (isDraftMode) {
          setSelectedEntity(entity);
        }
      } else {
        setSelectedEntity(entity);
        if (entity?.type === "furniture") {
          setTargetFurnitureId(entity.id);
        }
      }
      if (
        entity &&
        currentStage !== "decision" &&
        (entity.type !== "room" || isDraftMode)
      ) {
        setMobileSheetType("entity");
      } else {
        setMobileSheetType((prev) => (prev === "entity" ? null : prev));
      }
    },
    [handleSelectTargetRoom, currentStage, isDraftMode],
  );

  const handleCloseMobileSheet = React.useCallback(() => {
    setSelectedEntity(null);
    setMobileSheetType(null);
  }, []);

  // Ensure User Plan (AC-3): automatically converts standard template into editable User plan
  const ensureUserPlan = React.useCallback(async (): Promise<FloorPlan> => {
    if (isDraftMode && currentPlan.meta.source === "user") {
      return currentPlan;
    }
    if (!activePlanSummary) return currentPlan;

    const userPlan = createOrResumeUserPlan(activePlanSummary.plan, storedDraft);
    setCurrentPlan(userPlan);
    setHistory(createPlanHistory(userPlan, { description: "Initial user plan" }));
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
    return userPlan;
  }, [isDraftMode, currentPlan, activePlanSummary, storedDraft, storage, activePlanId]);

  // Customize Plan: converts standard template into editable User plan
  const handleCustomizePlan = React.useCallback(async () => {
    await ensureUserPlan();
  }, [ensureUserPlan]);

  // Start Calibration (AC-3): ensures user plan and prepares room calibration
  const handleStartCalibration = React.useCallback(async () => {
    await ensureUserPlan();
  }, [ensureUserPlan]);

  // Skip calibration and proceed to room stage (AC-7)
  const handleSkipCalibration = React.useCallback(() => {
    setCompletedStages((prev) => Array.from(new Set([...prev, "plan"])));
    setCurrentStage("room");
    setSelectedEntity(null);
  }, []);

  // Select workflow stage
  const handleSelectStage = React.useCallback((stage: WorkflowStage) => {
    setCurrentStage(stage);
    setSelectedEntity(null);
    setMobileSheetType(null);
  }, []);

  // Update plan in draft mode with autosave (AC-3: auto convert standard plan if needed)
  const handleUpdatePlan = React.useCallback(
    async (updatedPlan: FloorPlan, description?: string) => {
      let planToCommit = updatedPlan;
      if (!isDraftMode || currentPlan.meta.source !== "user") {
        const userPlanBase = createOrResumeUserPlan(
          activePlanSummary ? activePlanSummary.plan : currentPlan,
          storedDraft,
        );
        planToCommit = {
          ...updatedPlan,
          meta: {
            ...updatedPlan.meta,
            id: userPlanBase.meta.id,
            source: "user",
            templateId: userPlanBase.meta.templateId ?? activePlanId,
            name:
              updatedPlan.meta.name === activePlanSummary?.plan.meta.name
                ? userPlanBase.meta.name
                : updatedPlan.meta.name,
          },
        };
        setIsDraftMode(true);
        setPromptRestore(false);
      }

      setCurrentPlan(planToCommit);
      onPlanChange?.(planToCommit);
      setHistory((prev) => commitPlanChange(prev, planToCommit, description));
      setSaveStatus("saving");

      try {
        await storage.saveDraft(activePlanId, planToCommit);
        setStoredDraft(planToCommit);
        setSaveStatus("saved");
      } catch {
        setSaveStatus("failed");
      }
    },
    [isDraftMode, currentPlan, activePlanSummary, storedDraft, activePlanId, storage, onPlanChange],
  );

  // Add furniture to target room and establish as active target (AC-10, AC-11, AC-12, AC-13, AC-22)
  const handleAddContextFurniture = React.useCallback(
    async (definitionId: string) => {
      const userPlan = await ensureUserPlan();
      const catalog = getDefaultFurnitureCatalog();
      const effectiveRoomId = targetRoomId ?? userPlan.rooms[0]?.id ?? null;
      const dropPos = effectiveRoomId
        ? computeRoomInitialDropPosition(userPlan, effectiveRoomId)
        : null;

      const res = addFurnitureInstance(
        userPlan,
        catalog,
        definitionId,
        dropPos ? { x: dropPos.x, y: dropPos.y } : undefined,
      );

      if (res.success) {
        if (!targetRoomId && effectiveRoomId) {
          setTargetRoomId(effectiveRoomId);
        }
        await handleUpdatePlan(res.plan, "Add target furniture");
        setTargetFurnitureId(res.instance.id);
        setSelectedEntity({ type: "furniture", id: res.instance.id });
        setCompletedStages((prev) => Array.from(new Set([...prev, "furniture"])));
        setCurrentStage("decision");
        setIsFurnitureCatalogOpen(false);
        setMobileSheetType(null);
      }
    },
    [ensureUserPlan, targetRoomId, handleUpdatePlan],
  );

  // Add furniture directly (AC-3, AC-12, AC-26): ensures user plan and opens catalog
  const handleOpenAddFurniture = React.useCallback(async () => {
    await ensureUserPlan();
    setSelectedEntity(null);
    if (isMobile) {
      setMobileSheetType("furniture-palette");
    } else {
      handleOpenAdvancedTools("furniture");
    }
  }, [ensureUserPlan, isMobile, handleOpenAdvancedTools]);

  // Undo committed operation (AC-8, AC-21)
  const handleUndo = React.useCallback(async () => {
    if (!isDraftMode || !canUndo(history)) return;

    const nextHistory = undo(history);
    setHistory(nextHistory);
    const restoredPlan = nextHistory.present.plan;
    setCurrentPlan(restoredPlan);
    onPlanChange?.(restoredPlan);

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

    if (targetFurnitureId && !restoredPlan.furniture.some((f) => f.id === targetFurnitureId)) {
      setTargetFurnitureId(null);
    }
    if (targetRoomId && !restoredPlan.rooms.some((r) => r.id === targetRoomId)) {
      setTargetRoomId(null);
    }

    setSaveStatus("saving");
    try {
      await storage.saveDraft(activePlanId, restoredPlan);
      setStoredDraft(restoredPlan);
      setSaveStatus("saved");
    } catch {
      setSaveStatus("failed");
    }
  }, [isDraftMode, history, activePlanId, storage, onPlanChange, targetFurnitureId, targetRoomId]);

  // Redo undone operation (AC-8, AC-21)
  const handleRedo = React.useCallback(async () => {
    if (!isDraftMode || !canRedo(history)) return;

    const nextHistory = redo(history);
    setHistory(nextHistory);
    const restoredPlan = nextHistory.present.plan;
    setCurrentPlan(restoredPlan);
    onPlanChange?.(restoredPlan);

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

    if (targetFurnitureId && !restoredPlan.furniture.some((f) => f.id === targetFurnitureId)) {
      setTargetFurnitureId(null);
    }
    if (targetRoomId && !restoredPlan.rooms.some((r) => r.id === targetRoomId)) {
      setTargetRoomId(null);
    }

    setSaveStatus("saving");
    try {
      await storage.saveDraft(activePlanId, restoredPlan);
      setStoredDraft(restoredPlan);
      setSaveStatus("saved");
    } catch {
      setSaveStatus("failed");
    }
  }, [isDraftMode, history, activePlanId, storage, onPlanChange, targetFurnitureId, targetRoomId]);

  // Global keyboard shortcuts:
  // 1. Undo (Cmd+Z / Ctrl+Z) and Redo (Cmd+Shift+Z / Ctrl+Shift+Z / Ctrl+Y)
  // 2. Arrow keys (ArrowUp, ArrowDown, ArrowLeft, ArrowRight) to nudge selected furniture (50mm / Shift 500mm) (AC-24)
  React.useEffect(() => {
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
      if (isCmdOrCtrl) {
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
        return;
      }

      if (
        e.key === "ArrowLeft" ||
        e.key === "ArrowRight" ||
        e.key === "ArrowUp" ||
        e.key === "ArrowDown"
      ) {
        const furnitureId =
          selectedEntity?.type === "furniture"
            ? selectedEntity.id
            : currentStage === "decision" && targetFurnitureId
              ? targetFurnitureId
              : null;

        if (furnitureId) {
          const furniture = currentPlan.furniture.find((f) => f.id === furnitureId);
          if (furniture) {
            e.preventDefault();
            const step = e.shiftKey ? 500 : 50;
            let dx = 0;
            let dy = 0;
            if (e.key === "ArrowLeft") dx = -step;
            else if (e.key === "ArrowRight") dx = step;
            else if (e.key === "ArrowUp") dy = -step;
            else if (e.key === "ArrowDown") dy = step;

            const nextX = furniture.x + dx;
            const nextY = furniture.y + dy;
            const moveRes = moveFurnitureInstance(currentPlan, furnitureId, nextX, nextY);
            if (moveRes.success) {
              handleUpdatePlan(moveRes.plan, "Nudge furniture position");
            }
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    currentPlan,
    selectedEntity,
    targetFurnitureId,
    currentStage,
    handleUpdatePlan,
    handleUndo,
    handleRedo,
  ]);

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
    setTargetRoomId(null);
    setTargetFurnitureId(null);
    setCurrentStage("plan");
    setCompletedStages([]);
  }, [activePlanId, activePlanSummary, storage]);

  // Export current plan as JSON (AC-16)
  const handleExportJson = React.useCallback(() => {
    downloadFloorPlanJson(currentPlan);
  }, [currentPlan]);

  if (!activePlanSummary) {
    return null;
  }

  const isMobileSheetOpen = isMobile && mobileSheetType !== null;

  const mobileSheetTitle = React.useMemo(() => {
    if (selectedEntity) {
      switch (selectedEntity.type) {
        case "room":
          return t.mobileSheet.roomProperties;
        case "wall":
          return t.mobileSheet.wallProperties;
        case "opening":
          return t.mobileSheet.openingProperties;
        case "furniture":
          return t.mobileSheet.furnitureProperties;
        case "dimension":
          return t.mobileSheet.dimensionProperties;
        default:
          return t.mobileSheet.entityProperties;
      }
    }
    if (mobileSheetType === "furniture-palette") return t.mobileSheet.furnitureCatalog;
    if (mobileSheetType === "rules") return t.mobileSheet.spatialRules;
    if (mobileSheetType === "catalog") return t.mobileSheet.standardPlans;
    if (mobileSheetType === "decision") return t.mobileSheet.decision;
    return t.mobileSheet.details;
  }, [selectedEntity, mobileSheetType, t]);

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
          {violations.length} {violations.length === 1 ? t.badges.issue : t.badges.issues}
        </Badge>
      );
    }
    return null;
  }, [selectedEntity, mobileSheetType, violations, t]);

  const mobileSheetBody = React.useMemo(() => {
    if (selectedEntity) {
      return (
        <FloorPlanInspector
          plan={currentPlan}
          isDraftMode={isDraftMode}
          allowSpanEdit={true}
          onUpdatePlan={handleUpdatePlan}
          selectedEntity={selectedEntity}
          onSelect={handleSelectEntity}
          violations={violations}
          locale={locale}
          onStartCalibration={handleStartCalibration}
          onEnsureUserPlan={ensureUserPlan}
        />
      );
    }
    if (mobileSheetType === "decision") {
      return (
        <FurnitureDecisionPanel
          plan={currentPlan}
          targetRoomId={targetRoomId}
          targetFurnitureId={targetFurnitureId}
          ruleResults={violations}
          selectedEntity={selectedEntity}
          onSelectEntity={(entity) => {
            handleSelectEntity(entity);
          }}
          locale={locale}
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
          onSelectDefinition={handleAddContextFurniture}
          onClose={() => setMobileSheetType(null)}
          locale={locale}
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
          locale={locale}
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
          locale={locale}
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
    locale,
  ]);

  const renderWorkflowStagePanel = () => {
    return (
      <>
        {currentStage === "plan" && (
          <div data-testid="stage-plan-panel" className="space-y-4 text-xs">
            <FloorPlanInspector
              plan={currentPlan}
              isDraftMode={isDraftMode}
              allowSpanEdit={true}
              onUpdatePlan={handleUpdatePlan}
              selectedEntity={
                selectedEntity?.type === "wall" || selectedEntity?.type === "opening"
                  ? null
                  : selectedEntity
              }
              onSelect={handleSelectEntity}
              violations={violations}
              locale={locale}
              showRules={false}
              onStartCalibration={handleStartCalibration}
              onEnsureUserPlan={ensureUserPlan}
            />

            {/* Room List for Preparation and Calibration (AC-5, AC-8) */}
            <div className="space-y-1.5 pt-2 border-t border-border/60">
              <span className="text-[11px] font-medium text-foreground block">
                {t.workflow.roomStage.roomsInPlan}
              </span>
              <RoomList
                plan={currentPlan}
                targetRoomId={targetRoomId}
                onSelectRoom={handleSelectTargetRoom}
                locale={locale}
              />
            </div>

            {/* Stage 1 Workflow Actions (AC-2, AC-3, AC-7) */}
            <div className="space-y-2 pt-2 border-t border-border/60">
              <Button
                type="button"
                variant="outline"
                size="sm"
                data-testid="open-plan-selector-btn"
                aria-label={t.workflow.actions.changePlan}
                onClick={() => setIsPlanSelectorOpen(true)}
                className="w-full h-11 min-h-[44px] sm:h-9 sm:min-h-0 text-xs font-medium gap-1.5 focus-visible:ring-2 focus-visible:ring-primary"
              >
                <Compass className="h-3.5 w-3.5 text-primary" />
                <span>{t.workflow.actions.changePlan}</span>
              </Button>

              <Button
                type="button"
                variant="outline"
                size="sm"
                data-testid="start-calibration-btn"
                aria-label={t.workflow.actions.calibrateDimensions}
                onClick={handleStartCalibration}
                className="w-full h-11 min-h-[44px] sm:h-9 sm:min-h-0 text-xs font-medium gap-1.5 focus-visible:ring-2 focus-visible:ring-primary"
              >
                <SlidersHorizontal className="h-3.5 w-3.5 text-primary" />
                <span>{t.workflow.actions.calibrateDimensions}</span>
              </Button>

              <Button
                type="button"
                variant="default"
                size="sm"
                data-testid="skip-calibration-btn"
                aria-label={t.workflow.actions.skipCalibration}
                onClick={handleSkipCalibration}
                className="w-full h-11 min-h-[44px] sm:h-10 sm:min-h-0 text-xs font-medium gap-1.5 shadow-xs focus-visible:ring-2 focus-visible:ring-primary"
              >
                <span>{t.workflow.actions.skipCalibration}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
              <p className="text-[10px] text-muted-foreground text-center">
                {t.workflow.planStage.accurateNotice}
              </p>
            </div>
          </div>
        )}

        {currentStage === "room" && (
          <div data-testid="stage-room-panel" className="space-y-4 text-xs">
            <div className="rounded-xl border border-border/70 bg-card p-3 space-y-2">
              <span className="font-semibold text-foreground text-xs block">
                {t.workflow.roomStage.title}
              </span>
              <p className="text-muted-foreground text-xs leading-relaxed">
                {t.workflow.roomStage.placeholder}
              </p>
            </div>

            {/* Room List (AC-8) */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-medium text-foreground block">
                {t.workflow.roomStage.selectPrompt}
              </span>
              <RoomList
                plan={currentPlan}
                targetRoomId={targetRoomId}
                onSelectRoom={handleSelectTargetRoom}
                locale={locale}
              />
            </div>

            {/* Target Room Details (AC-8) */}
            {targetRoomDetails && (
              <div
                data-testid="target-room-details"
                className="rounded-xl border border-primary/30 bg-primary/5 p-3 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-muted-foreground">
                    {t.workflow.roomStage.selectedTargetRoom}
                  </span>
                  <Badge variant="default" className="text-[10px]">
                    {t.workflow.roomStage.targetBadge}
                  </Badge>
                </div>
                <div className="flex items-baseline justify-between">
                  <span
                    data-testid="target-room-name"
                    className="text-sm font-semibold text-foreground"
                  >
                    {targetRoomDetails.displayName}
                  </span>
                  <span
                    data-testid="target-room-area"
                    className="font-mono font-medium text-foreground"
                  >
                    {targetRoomDetails.area.formattedAreaM2}
                  </span>
                </div>
                {targetRoomDetails.spans && (
                  <div
                    data-testid="target-room-spans"
                    className="flex items-center gap-3 pt-1 text-[11px] font-mono text-muted-foreground border-t border-primary/20"
                  >
                    <span>
                      {t.roomSpanEditor.widthAxis}: {targetRoomDetails.spans.horizontal?.spanMm ?? "—"} mm
                    </span>
                    <span>
                      {t.roomSpanEditor.depthAxis}: {targetRoomDetails.spans.vertical?.spanMm ?? "—"} mm
                    </span>
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                data-testid="back-to-plan-btn"
                aria-label={t.workflow.actions.backToPlan}
                onClick={() => setCurrentStage("plan")}
                className="flex-1 h-11 min-h-[44px] sm:h-8 sm:min-h-0 text-xs focus-visible:ring-2 focus-visible:ring-primary"
              >
                {t.workflow.actions.backToPlan}
              </Button>
              <Button
                type="button"
                variant="default"
                size="sm"
                data-testid="next-to-furniture-btn"
                aria-label={t.workflow.actions.nextToFurniture}
                onClick={() => {
                  if (!targetRoomId && currentPlan.rooms.length > 0) {
                    handleSelectTargetRoom(currentPlan.rooms[0].id);
                  }
                  setCompletedStages((prev) => Array.from(new Set([...prev, "room"])));
                  setCurrentStage("furniture");
                }}
                className="flex-1 h-11 min-h-[44px] sm:h-8 sm:min-h-0 text-xs focus-visible:ring-2 focus-visible:ring-primary"
              >
                {t.workflow.actions.nextToFurniture}
              </Button>
            </div>
          </div>
        )}

        {currentStage === "furniture" && (
          <div data-testid="stage-furniture-panel" className="space-y-4 text-xs">
            {/* 1. Context Furniture Recommendations (AC-10, AC-11, AC-12) */}
            <ContextFurniturePanel
              plan={currentPlan}
              targetRoomId={targetRoomId}
              onAddFurniture={handleAddContextFurniture}
              onOpenFullCatalog={() => {
                if (isMobile) {
                  setMobileSheetType("furniture-palette");
                } else {
                  setIsFurnitureCatalogOpen(true);
                }
              }}
              locale={locale}
            />

            {/* Current Target Furniture Summary (AC-13, AC-22) */}
            {targetFurniture && (
              <div
                data-testid="target-furniture-summary"
                className="rounded-xl border border-primary/30 bg-primary/5 p-3 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-muted-foreground">
                    {t.workflow.targetFurniture.currentLabel}
                  </span>
                  <Badge variant="default" className="text-[10px]">
                    {t.workflow.targetFurniture.activeBadge}
                  </Badge>
                </div>
                <div className="flex items-baseline justify-between">
                  <span
                    data-testid="target-furniture-name"
                    className="text-sm font-semibold text-foreground"
                  >
                    {i18n.getFurnitureName(targetFurniture.definitionId, targetFurniture.definitionId)}
                  </span>
                  <span
                    data-testid="target-furniture-dimensions"
                    className="font-mono font-medium text-foreground"
                  >
                    {targetFurniture.width} × {targetFurniture.depth} mm
                  </span>
                </div>
              </div>
            )}

            {/* Furniture Inspector when an item is selected */}
            {selectedEntity?.type === "furniture" && (
              <FloorPlanInspector
                plan={currentPlan}
                isDraftMode={isDraftMode}
                allowSpanEdit={true}
                onUpdatePlan={handleUpdatePlan}
                selectedEntity={selectedEntity}
                onSelect={handleSelectEntity}
                violations={violations}
                locale={locale}
                onStartCalibration={handleStartCalibration}
                onEnsureUserPlan={ensureUserPlan}
              />
            )}

            <div className="rounded-xl border border-border/70 bg-card p-3 space-y-2">
              <span className="font-semibold text-foreground text-xs block">
                {t.workflow.furnitureStage.title}
              </span>
              <p className="text-muted-foreground text-xs leading-relaxed">
                {t.workflow.furnitureStage.placeholder}
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                data-testid="add-furniture-btn"
                aria-label={t.actions.addFurniture}
                onClick={handleOpenAddFurniture}
                className="w-full h-11 min-h-[44px] sm:h-8 sm:min-h-0 text-xs font-medium gap-1.5 focus-visible:ring-2 focus-visible:ring-primary"
              >
                <Armchair className="h-3.5 w-3.5 text-primary" />
                <span>{t.actions.addFurniture}</span>
              </Button>
            </div>

            {/* Room context & switcher (AC-9, AC-22) */}
            <div className="rounded-xl border border-border/70 bg-card p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-foreground text-xs">
                  {t.workflow.targetFurniture.heading}
                </span>
                {targetRoomDetails && (
                  <Badge variant="secondary" className="text-[10px]">
                    {targetRoomDetails.displayName} · {targetRoomDetails.area.formattedAreaM2}
                  </Badge>
                )}
              </div>
              <p className="text-[11px] text-muted-foreground">
                {t.workflow.targetFurniture.switchPrompt}
              </p>
              <RoomList
                plan={currentPlan}
                targetRoomId={targetRoomId}
                onSelectRoom={handleSelectTargetRoom}
                locale={locale}
              />
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                data-testid="back-to-room-btn"
                aria-label={t.workflow.actions.backToRoom}
                onClick={() => setCurrentStage("room")}
                className="flex-1 h-11 min-h-[44px] sm:h-8 sm:min-h-0 text-xs focus-visible:ring-2 focus-visible:ring-primary"
              >
                {t.workflow.actions.backToRoom}
              </Button>
              <Button
                type="button"
                variant="default"
                size="sm"
                data-testid="next-to-decision-btn"
                aria-label={t.workflow.actions.nextToDecision}
                onClick={() => {
                  setCompletedStages((prev) =>
                    Array.from(new Set([...prev, "furniture"])),
                  );
                  setCurrentStage("decision");
                }}
                className="flex-1 h-11 min-h-[44px] sm:h-8 sm:min-h-0 text-xs focus-visible:ring-2 focus-visible:ring-primary"
              >
                {t.workflow.actions.nextToDecision}
              </Button>
            </div>
          </div>
        )}

        {currentStage === "decision" && (
          <div data-testid="stage-decision-panel" className="space-y-4 text-xs">
            {/* Target Furniture Solely Driving Decision (AC-22) */}
            {targetFurniture && (
              <div
                data-testid="decision-target-furniture"
                className="rounded-xl border border-primary/30 bg-primary/5 p-3 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-muted-foreground">
                    {t.workflow.targetFurniture.mainDecisionTarget}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      data-testid="tune-target-furniture-btn"
                      aria-label={t.furnitureEditor.tuneDimensions}
                      onClick={() => {
                        handleSelectEntity({ type: "furniture", id: targetFurniture.id });
                      }}
                      className="h-11 min-h-[44px] sm:h-6 sm:min-h-0 px-2 text-[10px] font-medium gap-1 focus-visible:ring-2 focus-visible:ring-primary"
                    >
                      <SlidersHorizontal className="h-3 w-3 text-primary" />
                      <span>{t.furnitureEditor.tuneDimensions}</span>
                    </Button>
                    <Badge variant="default" className="text-[10px]">
                      {t.workflow.targetFurniture.soleTarget}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-baseline justify-between">
                  <span
                    data-testid="decision-target-furniture-name"
                    className="text-sm font-semibold text-foreground"
                  >
                    {i18n.getFurnitureName(targetFurniture.definitionId, targetFurniture.definitionId)}
                  </span>
                  <span
                    data-testid="decision-target-furniture-dimensions"
                    className="font-mono font-medium text-foreground"
                  >
                    {targetFurniture.width} × {targetFurniture.depth} mm
                  </span>
                </div>
              </div>
            )}

            {/* Furniture Decision Summary Panel (AC-14, AC-15, AC-16, AC-17) */}
            <FurnitureDecisionPanel
              plan={currentPlan}
              targetRoomId={targetRoomId}
              targetFurnitureId={targetFurnitureId}
              ruleResults={violations}
              selectedEntity={selectedEntity}
              onSelectEntity={handleSelectEntity}
              locale={locale}
            />

            {/* Applicable Adjustment Interface when an entity is selected (AC-17) */}
            {selectedEntity && (
              <div
                data-testid="decision-entity-inspector"
                className="space-y-2 pt-2 border-t border-border/60"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-foreground">
                    {t.workflow.decisionStage.adjustEntity}
                  </span>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    aria-label={t.workflow.decisionStage.closeAdjustment}
                    onClick={() => setSelectedEntity(null)}
                    className="h-11 min-h-[44px] sm:h-6 sm:min-h-0 text-[10px] text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    {t.workflow.decisionStage.closeAdjustment}
                  </Button>
                </div>
                <FloorPlanInspector
                  plan={currentPlan}
                  isDraftMode={isDraftMode}
                  allowSpanEdit={true}
                  onUpdatePlan={handleUpdatePlan}
                  selectedEntity={selectedEntity}
                  onSelect={handleSelectEntity}
                  violations={violations}
                  locale={locale}
                  onStartCalibration={handleStartCalibration}
                  onEnsureUserPlan={ensureUserPlan}
                />
              </div>
            )}

            {/* Room switcher in decision stage (AC-9, AC-22) */}
            <div className="rounded-xl border border-border/70 bg-card p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-foreground text-xs">
                  {t.workflow.decisionStage.switchRoom}
                </span>
                {targetRoomDetails && (
                  <Badge variant="secondary" className="text-[10px]">
                    {targetRoomDetails.displayName}
                  </Badge>
                )}
              </div>
              <p className="text-[11px] text-muted-foreground">
                {t.workflow.decisionStage.switchPrompt}
              </p>
              <RoomList
                plan={currentPlan}
                targetRoomId={targetRoomId}
                onSelectRoom={handleSelectTargetRoom}
                locale={locale}
              />
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              data-testid="back-to-furniture-btn"
              aria-label={t.workflow.actions.backToFurniture}
              onClick={() => setCurrentStage("furniture")}
              className="w-full h-11 min-h-[44px] sm:h-8 sm:min-h-0 text-xs focus-visible:ring-2 focus-visible:ring-primary"
            >
              {t.workflow.actions.backToFurniture}
            </Button>
          </div>
        )}
      </>
    );
  };

  return (
    <ToolPageChrome
      title={t.pageTitle}
      description={t.pageDescription}
    >
      {/* Workflow Stage Stepper */}
      <FloorPlanWorkflowStepper
        currentStage={currentStage}
        completedStages={completedStages}
        onSelectStage={handleSelectStage}
        t={t}
      />

      <FloorPlanToolbar
        isDraftMode={isDraftMode}
        currentPlan={currentPlan}
        activePlanSummary={activePlanSummary}
        saveStatus={saveStatus}
        violations={violations}
        canvasMode={canvasMode}
        history={history}
        t={t}
        onCustomizePlan={handleCustomizePlan}
        onOpenPlanSelector={() => setIsPlanSelectorOpen(true)}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onCanvasModeChange={setCanvasMode}
        onOpenMobileSheet={setMobileSheetType}
        onClearSelection={() => setSelectedEntity(null)}
        onOpenAdvancedTools={handleOpenAdvancedTools}
      />

      {/* 2-Pane Desktop Workspace (Canvas + Context Task Panel), Responsive Mobile Layout */}
      <div className="flex min-h-0 flex-1 flex-col gap-3 lg:grid lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-stretch overflow-x-hidden">
        {/* Left/Main Pane: Interactive Responsive SVG Viewer Canvas + Draft Restoration Banner */}
        <section className="flex min-h-[340px] sm:min-h-[420px] lg:min-h-0 flex-1 flex-col overflow-hidden">
          <Card className="flex min-h-0 flex-1 flex-col overflow-hidden border-border bg-card p-0">
            {/* Draft Restoration Banner (AC-4, AC-15) */}
            {promptRestore && storedDraft && !isDraftMode && (
              <div
                data-testid="draft-restore-banner"
                className="flex flex-wrap items-center justify-between gap-2 border-b border-primary/20 bg-primary/5 px-3 py-2 text-xs text-foreground shrink-0"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary shrink-0" />
                  <span>
                    {t.draftBanner.foundDraft} (
                    <strong className="font-semibold">{storedDraft.meta.name}</strong>)。
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
                    {t.draftBanner.continueDraft}
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    data-testid="discard-draft-btn"
                    onClick={handleRestartFromTemplate}
                    className="h-11 min-h-[44px] min-w-[44px] sm:h-7 sm:min-h-0 sm:min-w-0 px-2.5 text-xs text-muted-foreground hover:text-destructive touch-manipulation"
                  >
                    {t.draftBanner.restartTemplate}
                  </Button>
                </div>
              </div>
            )}

            <FloorPlanSvgViewer
              plan={currentPlan}
              selectedEntity={selectedEntity}
              targetRoomId={targetRoomId}
              onSelect={handleSelectEntity}
              isDraftMode={isDraftMode || currentStage === "furniture" || currentStage === "decision"}
              onUpdatePlan={handleUpdatePlan}
              violations={violations}
              canvasMode={canvasMode}
              locale={locale}
              className="flex-1"
            />
          </Card>
        </section>

        {/* Mobile Bottom Step Panel (AC-23) */}
        {isMobile && (
          <section
            data-testid="mobile-step-panel"
            className="lg:hidden w-full shrink-0 space-y-4 pb-6 overflow-x-hidden"
          >
            <Card className="p-4 border-border bg-card overflow-hidden">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-border/60">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4 text-primary" />
                  <span className="text-sm font-semibold">
                    {`${t.workflow.steps[currentStage]} · ${t.workflow.stepDescriptions[currentStage]}`}
                  </span>
                </div>
                <Badge variant="outline" className="text-[10px] font-mono">
                  {t.workflow[`${currentStage}Stage`].stepTag}
                </Badge>
              </div>
              {renderWorkflowStagePanel()}
            </Card>
          </section>
        )}

        {/* Right Pane: Context Task Panel / Entity Inspector (Desktop) */}
        {!isMobile && (
          <aside className="hidden min-h-0 flex-col lg:flex" data-testid="desktop-context-pane">
            <Card className="flex min-h-0 flex-1 flex-col overflow-hidden">
              <CardHeader className="shrink-0 pb-3 border-b border-border/60">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <SlidersHorizontal className="h-4 w-4 text-primary" />
                    <span>
                      {selectedEntity
                        ? t.inspector.title
                        : `${t.workflow.steps[currentStage]} · ${t.workflow.stepDescriptions[currentStage]}`}
                    </span>
                  </CardTitle>
                  <Badge variant="outline" className="text-[10px] font-mono">
                    {t.workflow[`${currentStage}Stage`].stepTag}
                  </Badge>
                </div>
              </CardHeader>
              <CardScrollArea className="min-h-0 flex-1 px-4 pb-4">
                <div className="space-y-4 pt-3">
                  {/* Non-intrusive Wall / Opening selection cue (AC-26) */}
                  {selectedEntity && (selectedEntity.type === "wall" || selectedEntity.type === "opening") && (
                    <div
                      data-testid="selected-structure-banner"
                      className="rounded-xl border border-primary/20 bg-primary/5 p-2.5 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-1.5 min-w-0">
                        <Badge variant="outline" className="text-[10px] uppercase font-mono shrink-0">
                          {selectedEntity.type}
                        </Badge>
                        <span className="font-semibold text-foreground truncate">{selectedEntity.id}</span>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          data-testid="open-structure-tools-btn"
                          onClick={() => handleOpenAdvancedTools("structure")}
                          className="h-6 text-[10px] font-medium gap-1"
                        >
                          <SlidersHorizontal className="h-3 w-3 text-primary" />
                          <span>{t.advancedTools.structure.inspectBtn}</span>
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => setSelectedEntity(null)}
                          className="h-6 px-1.5 text-[10px] text-muted-foreground hover:text-foreground"
                          title={t.actions.close}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  )}

                  {renderWorkflowStagePanel()}

                  {/* Persistent Advanced Tools Entry at bottom of context pane (AC-26) */}
                  <div className="pt-3 border-t border-border/60">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      data-testid="open-advanced-tools-btn"
                      onClick={() => handleOpenAdvancedTools()}
                      className="w-full text-xs font-medium gap-1.5 text-muted-foreground hover:text-foreground"
                    >
                      <Wrench className="h-3.5 w-3.5 text-primary" />
                      <span>{t.advancedTools.trigger}</span>
                    </Button>
                  </div>
                </div>
              </CardScrollArea>
            </Card>
          </aside>
        )}
      </div>

      {/* On-Demand Standard Plan Selector Dialog (AC-2) */}
      <FloorPlanSelectorDialog
        open={isPlanSelectorOpen}
        onOpenChange={setIsPlanSelectorOpen}
        plans={plans}
        activePlanId={activePlanId}
        onSelectPlan={handleSelectPlan}
        locale={locale}
        t={t}
      />

      {/* On-Demand Full Furniture Catalog Dialog (AC-12) */}
      <FurnitureCatalogDialog
        open={isFurnitureCatalogOpen}
        onOpenChange={setIsFurnitureCatalogOpen}
        plan={currentPlan}
        onSelectDefinition={handleAddContextFurniture}
        locale={locale}
        t={t}
      />

      {/* On-Demand Advanced Tools Dialog (AC-26) */}
      <AdvancedToolsDialog
        open={isAdvancedToolsOpen}
        onOpenChange={setIsAdvancedToolsOpen}
        defaultTab={advancedToolsTab}
        plan={currentPlan}
        isDraftMode={isDraftMode}
        violations={violations}
        selectedEntity={selectedEntity}
        onSelectEntity={handleSelectEntity}
        onUpdatePlan={handleUpdatePlan}
        onEnsureUserPlan={ensureUserPlan}
        onStartCalibration={handleStartCalibration}
        onSelectDefinition={handleAddContextFurniture}
        onExportJson={handleExportJson}
        onRestartFromTemplate={handleRestartFromTemplate}
        locale={locale}
        t={t}
      />

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
