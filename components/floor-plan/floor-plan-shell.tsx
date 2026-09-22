"use client";

import * as React from "react";
import {
  ArrowRight,
  ChevronDown,
  Compass,
  PencilRuler,
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
import { FurnitureDecisionControls } from "./furniture-decision-controls";
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

const WORKFLOW_STAGE_NUMBER: Record<WorkflowStage, number> = {
  plan: 1,
  room: 2,
  furniture: 3,
  decision: 4,
};

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
  const isZh = i18n.locale === "zh";
  const workflowTopRef = React.useRef<HTMLDivElement>(null);
  const stagePanelScrollRef = React.useRef<HTMLDivElement>(null);

  const previewSummary = React.useMemo<StandardPlanSummary | null>(() => {
    if (!initialActivePlan) return null;
    return {
      id: initialActivePlan.meta.id ?? "plan-preview",
      name: initialActivePlan.meta.name,
      description:
        locale === "zh"
          ? "方案资产预览"
          : "Plan Asset Preview",
      areaM2: 0,
      formattedArea:
        locale === "zh"
          ? "预览方案"
          : "Preview Plan",
      roomCount: initialActivePlan.rooms.length,
      roomBreakdown:
        locale === "zh"
          ? `${initialActivePlan.rooms.length} 间功能区`
          : `${initialActivePlan.rooms.length} rooms`,
      categoryKey: resolvePlanCategory(
        initialActivePlan as StandardPlanSummary["plan"],
      ),
      tags: [initialActivePlan.meta.source],
      plan: initialActivePlan as unknown as StandardPlanSummary["plan"],
    };
  }, [initialActivePlan, locale]);

  const basePlans = React.useMemo(
    () => initialPlans ?? getStandardPlans(locale),
    [initialPlans, locale],
  );
  const plans = React.useMemo(() => {
    if (previewSummary) {
      return [previewSummary, ...basePlans.filter((p) => p.id !== previewSummary.id)];
    }
    return basePlans;
  }, [basePlans, previewSummary]);

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

  React.useEffect(() => {
    const node = stagePanelScrollRef.current;
    if (node && typeof node.scrollTo === "function") {
      node.scrollTo({ top: 0 });
    }

    const workflowTop = workflowTopRef.current;
    if (isMobile && workflowTop && typeof workflowTop.scrollIntoView === "function") {
      workflowTop.scrollIntoView({ block: "start" });
    }
  }, [currentStage, isMobile]);

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
  }, [targetRoom, currentPlan, i18n]);

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

  // Adjust room: ensures user plan and prepares room editing
  const handleAdjustRoom = React.useCallback(async () => {
    const editablePlan = await ensureUserPlan();
    const roomId = targetRoomId ?? editablePlan.rooms[0]?.id ?? null;
    if (roomId) {
      setTargetRoomId(roomId);
    }
    setSelectedEntity(null);
    handleOpenAdvancedTools("structure");
  }, [ensureUserPlan, targetRoomId, handleOpenAdvancedTools]);

  // Use plan and proceed to room stage (AC-7)
  const handleUsePlan = React.useCallback(() => {
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
        setSelectedEntity(null);
        setCompletedStages((prev) => Array.from(new Set([...prev, "furniture"])));
        setCurrentStage("decision");
        setIsFurnitureCatalogOpen(false);
        setMobileSheetType(null);
      }
    },
    [ensureUserPlan, targetRoomId, handleUpdatePlan],
  );

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
          showRules={false}
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
            handleCloseMobileSheet();
          }}
          onClose={handleCloseMobileSheet}
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
          onSelectPlan={(planId) => {
            handleSelectPlan(planId);
            handleCloseMobileSheet();
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
    handleAddContextFurniture,
    handleAdjustRoom,
    ensureUserPlan,
    targetRoomId,
    targetFurnitureId,
    locale,
  ]);

  if (!activePlanSummary) {
    return null;
  }

  const renderWorkflowStagePanel = () => {
    return (
      <>
        {currentStage === "plan" && (
          <div data-testid="stage-plan-panel" className="space-y-3 text-xs">
            <div className="space-y-2.5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[11px] text-muted-foreground">
                    {isZh ? "当前户型模板" : "Current floor-plan template"}
                  </p>
                  <h2 className="mt-1 truncate text-base font-semibold text-foreground">
                    {activePlanSummary.name}
                  </h2>
                </div>
                <Badge variant="secondary" className="shrink-0 font-mono text-[10px]">
                  {activePlanSummary.formattedArea}
                </Badge>
              </div>
              <p className="leading-relaxed text-muted-foreground">
                {isZh
                  ? "先选择最接近你家的户型。房间尺寸不完全一致也没关系，需要时再调整。"
                  : "Choose the closest template first. Exact room dimensions can be adjusted only when needed."}
              </p>
              <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                <span>{currentPlan.rooms.length} {isZh ? "个房间" : "rooms"}</span>
                {activePlanSummary.roomBreakdown && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span>{activePlanSummary.roomBreakdown}</span>
                  </>
                )}
              </div>
            </div>

            <details className="group rounded-xl border border-border/70 bg-card">
              <summary className="flex cursor-pointer list-none items-center justify-between px-3 py-2 text-xs font-medium text-muted-foreground">
                <span>{isZh ? "查看户型信息" : "View floor-plan details"}</span>
                <ChevronDown className="h-3.5 w-3.5 transition-transform group-open:rotate-180" />
              </summary>
              <div className="border-t border-border/60 p-3">
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
                  onEnsureUserPlan={ensureUserPlan}
                />
                <div className="mt-3 border-t border-border/60 pt-3">
                  <RoomList
                    plan={currentPlan}
                    targetRoomId={targetRoomId}
                    onSelectRoom={handleSelectTargetRoom}
                    locale={locale}
                  />
                </div>
              </div>
            </details>

            <div className="space-y-2 border-t border-border/60 pt-3">
              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  data-testid="open-plan-selector-btn"
                  aria-label={t.workflow.actions.changePlan}
                  onClick={() => setIsPlanSelectorOpen(true)}
                  className="h-11 min-h-[44px] min-w-0 gap-1.5 px-2 text-xs font-medium focus-visible:ring-2 focus-visible:ring-primary sm:h-9 sm:min-h-0"
                >
                  <Compass className="h-3.5 w-3.5 text-primary" />
                  <span>{t.workflow.actions.changePlan}</span>
                </Button>

                <Button
                  type="button"
                  variant="default"
                  size="sm"
                  data-testid="use-plan-btn"
                  aria-label={t.workflow.actions.usePlan}
                  onClick={handleUsePlan}
                  className="h-11 min-h-[44px] min-w-0 gap-1.5 px-2 text-xs font-medium focus-visible:ring-2 focus-visible:ring-primary sm:h-9 sm:min-h-0"
                >
                  <span>{isZh ? "使用这个户型" : "Use this floor plan"}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </div>
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
                compact
              />
            </div>

            {/* Target Room Details (AC-8) */}
            {targetRoomDetails && (
              <div
                data-testid="target-room-details"
                className="rounded-xl border border-primary/30 bg-primary/5 p-2.5 text-xs"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <span data-testid="target-room-name" className="block truncate text-sm font-semibold text-foreground">
                      {targetRoomDetails.displayName}
                    </span>
                    {targetRoomDetails.spans && (
                      <span data-testid="target-room-spans" className="font-mono text-[10px] text-muted-foreground">
                        {targetRoomDetails.spans.horizontal?.spanMm ?? "—"} × {targetRoomDetails.spans.vertical?.spanMm ?? "—"} mm
                      </span>
                    )}
                  </div>
                  <Badge variant="default" className="shrink-0 text-[10px]">
                    <span data-testid="target-room-area">{targetRoomDetails.area.formattedAreaM2}</span>
                  </Badge>
                </div>
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

            <details className="group rounded-xl border border-border/70 bg-card">
              <summary className="flex cursor-pointer list-none items-center justify-between px-3 py-2 text-xs font-medium text-muted-foreground">
                <span>{isZh ? "换一个房间" : "Change room"}</span>
                <ChevronDown className="h-3.5 w-3.5 transition-transform group-open:rotate-180" />
              </summary>
              <div className="border-t border-border/60 p-2">
                <RoomList
                  plan={currentPlan}
                  targetRoomId={targetRoomId}
                  onSelectRoom={handleSelectTargetRoom}
                  locale={locale}
                  compact
                />
              </div>
            </details>

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
              {targetFurniture && (
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
              )}
            </div>
          </div>
        )}

        {currentStage === "decision" && (
          <div data-testid="stage-decision-panel" className="space-y-4 text-xs">
            {/* Target Furniture Solely Driving Decision (AC-22) */}
            {targetFurniture && (
              <div
                data-testid="decision-target-furniture"
                className="flex items-center justify-between gap-3 rounded-xl border border-primary/30 bg-primary/5 p-2.5 text-xs"
              >
                <div className="min-w-0">
                  <span data-testid="decision-target-furniture-name" className="block truncate text-sm font-semibold text-foreground">
                    {i18n.getFurnitureName(targetFurniture.definitionId, targetFurniture.definitionId)}
                  </span>
                  <span data-testid="decision-target-furniture-dimensions" className="font-mono text-[10px] text-muted-foreground">
                    {targetFurniture.width} × {targetFurniture.depth} mm
                  </span>
                </div>
                <div className="flex shrink-0 items-center gap-1.5">
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
            )}

            <FurnitureDecisionControls
              plan={currentPlan}
              targetRoomId={targetRoomId}
              targetFurnitureId={targetFurnitureId}
              ruleResults={violations}
              locale={locale}
              onUpdatePlan={handleUpdatePlan}
              onAdjustRoom={handleAdjustRoom}
              onMoreSettings={() => handleOpenAdvancedTools("furniture")}
            />

            {/* Full diagnostics remain available on demand instead of dominating the main decision. */}
            <details className="group rounded-xl border border-border/70 bg-card">
              <summary className="flex cursor-pointer list-none items-center justify-between px-3 py-2.5 text-xs font-medium text-muted-foreground">
                <span>{isZh ? "查看完整空间规则" : "View all spatial checks"}</span>
                <ChevronDown className="h-3.5 w-3.5 transition-transform group-open:rotate-180" />
              </summary>
              <div className="border-t border-border/60 p-3">
                <FurnitureDecisionPanel
                  plan={currentPlan}
                  targetRoomId={targetRoomId}
                  targetFurnitureId={targetFurnitureId}
                  ruleResults={violations}
                  selectedEntity={selectedEntity}
                  onSelectEntity={handleSelectEntity}
                  locale={locale}
                  className="border-0 p-0 shadow-none"
                />
              </div>
            </details>

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
                  showRules={false}
                  onEnsureUserPlan={ensureUserPlan}
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-2 border-t border-border/60 pt-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setCurrentStage("room")}
                className="text-xs"
              >
                {isZh ? "换一个房间" : "Change room"}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                data-testid="back-to-furniture-btn"
                aria-label={t.workflow.actions.backToFurniture}
                onClick={() => setCurrentStage("furniture")}
                className="text-xs"
              >
                {isZh ? "换一件家具" : "Change furniture"}
              </Button>
            </div>
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
      <div ref={workflowTopRef} className="scroll-mt-20">
        <FloorPlanWorkflowStepper
          currentStage={currentStage}
          completedStages={completedStages}
          onSelectStage={handleSelectStage}
          t={t}
        />
      </div>

      <FloorPlanToolbar
        className="hidden"
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
      <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-x-hidden lg:grid lg:grid-cols-[minmax(0,1fr)_24rem] lg:items-stretch">
        {/* Left/Main Pane: Interactive Responsive SVG Viewer Canvas + Draft Restoration Banner */}
        <section className="order-2 flex min-h-[340px] flex-1 flex-col overflow-hidden sm:min-h-[420px] lg:order-none lg:min-h-0">
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
            className="order-1 w-full shrink-0 space-y-4 overflow-x-hidden lg:hidden"
          >
            <Card className="p-4 border-border bg-card overflow-hidden">
              {renderWorkflowStagePanel()}
            </Card>
          </section>
        )}

        {/* Right Pane: Context Task Panel / Entity Inspector (Desktop) */}
        {!isMobile && (
          <aside className="hidden min-h-0 flex-col lg:flex" data-testid="desktop-context-pane">
            <Card className="flex min-h-0 flex-1 flex-col overflow-hidden border-border bg-card">
              <CardHeader className="shrink-0 border-b border-border/60 px-5 py-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <Badge variant="outline" className="shrink-0 border-primary/30 text-[10px] font-mono text-primary">
                      {t.workflow[`${currentStage}Stage`].stepTag}
                    </Badge>
                    <CardTitle className="truncate text-sm font-semibold">
                      {t.workflow.steps[currentStage]}
                    </CardTitle>
                  </div>
                  {currentStage !== "decision" && (
                    <Badge variant="outline" className="shrink-0 text-[10px] font-mono">
                      {WORKFLOW_STAGE_NUMBER[currentStage]}/4
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardScrollArea ref={stagePanelScrollRef} className="min-h-0 flex-1 px-5 pb-5">
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
