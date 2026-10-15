"use client";

import * as React from "react";
import { Compass, DoorOpen, Image as ImageIcon, Plus, PlusSquare } from "lucide-react";
import { ToolPageChrome } from "@/components/tool-page-chrome";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardScrollArea,
  CardTitle,
} from "@/components/ui/card";
import { RoomSettingsPanel } from "./room-settings-panel";
import type { CustomRoomWallSide } from "@/lib/floor-plan/custom-room-openings";
import {
  getStandardPlans,
  resolvePlanCategory,
  type StandardPlanSummary,
} from "@/lib/floor-plan/catalog";
import type { FloorPlan, PlacementScenario, StandardFloorPlan } from "@/lib/floor-plan/types";
import {
  applyPlacementScenarioToFloorPlan,
  floorPlanToPlacementScenario,
} from "@/lib/floor-plan/placement-scenario";
import { assessmentFromRuleResults, evaluatePlanRules } from "@/lib/floor-plan/rules";
import {
  computePolygonArea,
  computeRoomPolygon,
  formatNetArea,
  getVertexMap,
  getWallMap,
} from "@/lib/floor-plan/geometry";
import type { SelectedEntity } from "./types";
import { FloorPlanCatalog } from "./floor-plan-catalog";
import { FloorPlanInspector } from "./floor-plan-inspector";
import { FloorPlanSvgViewer } from "./floor-plan-svg-viewer";
import { FloorPlanToolbar } from "./floor-plan-toolbar";
import { MobileBottomSheet } from "./mobile-bottom-sheet";
import { FurnitureCatalogPalette } from "./furniture-catalog-palette";
import { FloorPlanSelectorDialog } from "./floor-plan-selector-dialog";
import { FurnitureCatalogDialog } from "./furniture-catalog-dialog";
import { ContextFurniturePanel } from "./context-furniture-panel";
import { FurnitureDecisionPanel } from "./furniture-decision-panel";
import {
  addFurnitureInstance,
  changeFurnitureSpecification,
  computeRoomInitialDropPosition,
  deleteFurnitureInstance,
  moveFurnitureInstance,
  rotateFurnitureInstance,
} from "@/lib/floor-plan/furniture-operations";
import { getDefaultFurnitureCatalog } from "@/lib/floor-plan/furniture-catalog";
import { RoomList } from "./room-list";
import { getAssessmentStatusLabel, useFloorPlanI18n } from "@/lib/floor-plan/i18n";
import { RuleFeedbackPanel } from "./rule-feedback-panel";
import { cn } from "@/lib/utils";
import { MobileWorkspace } from "./mobile-workspace";
import { FurnitureSizePicker } from "./furniture-size-picker";
import { FloorPlanImageDialog } from "./floor-plan-image-dialog";
import { renderFloorPlanImage, type FloorPlanImage } from "@/lib/floor-plan/export-image";
import { CreateRoomDialog } from "./create-room-dialog";
import {
  createRectangularRoomPlan,
  type CustomRoomRecord,
} from "@/lib/floor-plan/rectangular-room";
import {
  loadCustomRoomStorage,
  saveCustomRoomRecord,
  setLastActivePlan,
} from "@/lib/floor-plan/custom-room-storage";

export interface FloorPlanShellProps {
  initialPlans?: StandardPlanSummary[];
  initialActivePlan?: FloorPlan;
  initialScenario?: PlacementScenario;
  onPlanChange?: (plan: FloorPlan) => void;
  onScenarioChange?: (scenario: PlacementScenario) => void;
  storage?: unknown; // Deprecated prop retained for backward compatibility
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
  initialScenario,
  onPlanChange,
  onScenarioChange,
  isMobile: propIsMobile,
  locale,
}: FloorPlanShellProps) {
  const isMobile = useIsMobile(propIsMobile);
  const i18n = useFloorPlanI18n(locale);
  const t = i18n.t;
  const isZh = i18n.locale === "zh";

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
        initialActivePlan as unknown as StandardFloorPlan,
      ),
      tags: [initialActivePlan.meta.source],
      plan: initialActivePlan as unknown as StandardPlanSummary["plan"],
    };
  }, [initialActivePlan, locale]);

  const basePlans = React.useMemo(
    () => initialPlans ?? getStandardPlans(locale),
    [initialPlans, locale],
  );
  const [customRooms, setCustomRooms] = React.useState<CustomRoomRecord[]>([]);
  const [isHydrated, setIsHydrated] = React.useState<boolean>(false);
  const [isCreateRoomOpen, setIsCreateRoomOpen] = React.useState<boolean>(false);

  const customSummaries = React.useMemo<StandardPlanSummary[]>(() => {
    return customRooms.map((cr) => {
      const netArea = formatNetArea(cr.widthMm, cr.depthMm);
      return {
        id: cr.id,
        name: cr.name,
        description: locale === "zh" ? "实测净尺寸矩形房间" : "Measured rectangular room",
        areaM2: netArea.areaM2,
        formattedArea: netArea.formattedAreaM2,
        roomCount: 1,
        roomBreakdown: locale === "zh" ? "1 间功能区" : "1 room",
        categoryKey: "custom",
        tags: ["user", "custom"],
        plan: cr.plan,
      };
    });
  }, [customRooms, locale]);

  const plans = React.useMemo(() => {
    const list: StandardPlanSummary[] = [];
    if (previewSummary) list.push(previewSummary);
    list.push(...customSummaries);
    list.push(
      ...basePlans.filter(
        (p) => p.id !== previewSummary?.id && !customSummaries.some((c) => c.id === p.id),
      ),
    );
    return list;
  }, [basePlans, previewSummary, customSummaries]);

  const [activePlanId, setActivePlanId] = React.useState<string>(
    initialActivePlan?.meta.id ?? plans[0]?.id ?? "plan-cn-sh-ruidong-2br-67",
  );
  const [selectedEntity, setSelectedEntity] = React.useState<SelectedEntity | null>(null);

  // Target room & target furniture state
  const [targetRoomId, setTargetRoomId] = React.useState<string | null>(null);
  const [targetFurnitureId, setTargetFurnitureId] = React.useState<string | null>(
    initialScenario?.targetPlacementId ?? null,
  );

  // On-demand dialog states
  const [isPlanSelectorOpen, setIsPlanSelectorOpen] = React.useState<boolean>(false);
  const [isFurnitureCatalogOpen, setIsFurnitureCatalogOpen] = React.useState<boolean>(false);

  // Canvas mode: "pan" vs "edit"
  const [canvasMode, setCanvasMode] = React.useState<"pan" | "edit">("edit");

  // Mobile bottom properties surface state: "entity" | "furniture-palette" | "rules" | "catalog" | "decision" | "rooms" | "help" | "room-settings" | null
  const [mobileSheetType, setMobileSheetType] = React.useState<
    "entity" | "furniture-palette" | "rules" | "catalog" | "decision" | "rooms" | "help" | "room-settings" | null
  >(null);

  // Custom room settings editing state & draft preview (AC-6, AC-7, AC-9)
  const [isEditingRoomSettings, setIsEditingRoomSettings] = React.useState<boolean>(false);
  const [draftPlanPreview, setDraftPlanPreview] = React.useState<FloorPlan | null>(null);
  const [highlightWallSide, setHighlightWallSide] = React.useState<CustomRoomWallSide | null>(null);
  const [highlightOpeningId, setHighlightOpeningId] = React.useState<string | null>(null);

  const handleDraftPreviewChange = React.useCallback(
    (draft: FloorPlan | null, wallSide?: CustomRoomWallSide | null, opId?: string | null) => {
      setDraftPlanPreview(draft);
      setHighlightWallSide(wallSide ?? null);
      setHighlightOpeningId(opId ?? null);
    },
    [],
  );

  const svgRef = React.useRef<SVGSVGElement>(null);
  const imageRequest = React.useRef(0);
  const [isImageOpen, setIsImageOpen] = React.useState(false);
  const [planImage, setPlanImage] = React.useState<FloorPlanImage | null>(null);
  const [imageError, setImageError] = React.useState(false);

  const activePlanSummary = React.useMemo(
    () => plans.find((p) => p.id === activePlanId) ?? plans[0],
    [plans, activePlanId],
  );

  // Active FloorPlan in memory
  const [currentPlan, setCurrentPlan] = React.useState<FloorPlan>(() => {
    const base =
      initialActivePlan ?? (activePlanSummary ? activePlanSummary.plan : ({} as FloorPlan));
    if (initialScenario) {
      return applyPlacementScenarioToFloorPlan(base, initialScenario);
    }
    return base;
  });

  const isCustomRoom =
    activePlanSummary?.categoryKey === "custom" ||
    Boolean(currentPlan?.meta?.customRoom);

  // Hydrate custom rooms and restore last active plan from localStorage on mount (AC-4, AC-5)
  /* eslint-disable react-hooks/set-state-in-effect */
  React.useEffect(() => {
    if (initialActivePlan || initialPlans) {
      setIsHydrated(true);
      return;
    }

    const res = loadCustomRoomStorage();
    if (res.ok) {
      setCustomRooms(res.doc.rooms);
      if (res.doc.lastActive) {
        if (res.doc.lastActive.type === "custom") {
          const found = res.doc.rooms.find((r) => r.id === res.doc.lastActive?.id);
          if (found) {
            setActivePlanId(found.id);
            setCurrentPlan(found.plan);
            setTargetRoomId("room-1");
            setSelectedEntity({ type: "room", id: "room-1" });
            setTargetFurnitureId(found.plan.furniture[0]?.id ?? null);
          }
        } else if (res.doc.lastActive.type === "standard") {
          const found = basePlans.find((p) => p.id === res.doc.lastActive?.id);
          if (found) {
            setActivePlanId(found.id);
            setCurrentPlan(found.plan);
            setTargetRoomId(null);
            setTargetFurnitureId(found.plan.furniture[0]?.id ?? null);
          }
        }
      }
    }
    setIsHydrated(true);
  }, [initialActivePlan, initialPlans, basePlans]);
  /* eslint-enable react-hooks/set-state-in-effect */

  // Synchronize initial plan or scenario if prop changes
  React.useEffect(() => {
    if (initialActivePlan) {
      const base = initialScenario
        ? applyPlacementScenarioToFloorPlan(initialActivePlan, initialScenario)
        : initialActivePlan;
      // The asset preview supplies replacement topology/scenario props; reset its editor state together.
      /* eslint-disable react-hooks/set-state-in-effect */
      setCurrentPlan(base);
      setActivePlanId(initialActivePlan.meta.id ?? "plan-preview");
      if (initialScenario?.targetPlacementId !== undefined) {
        setTargetFurnitureId(initialScenario.targetPlacementId);
      }
      /* eslint-enable react-hooks/set-state-in-effect */
    }
  }, [initialActivePlan, initialScenario]);

  // Evaluate spatial rules deterministically
  const violations = React.useMemo(() => evaluatePlanRules(currentPlan), [currentPlan]);

  const targetFurniture = React.useMemo(() => {
    if (!targetFurnitureId) {
      // Default to first furniture if none selected
      return currentPlan.furniture[0] ?? null;
    }
    return currentPlan.furniture.find((f) => f.id === targetFurnitureId) ?? currentPlan.furniture[0] ?? null;
  }, [currentPlan.furniture, targetFurnitureId]);

  const effectiveTargetFurnitureId = targetFurniture?.id ?? null;

  // Both target and whole-layout verdicts come from the same normalized issues.
  const spaceAssessment = React.useMemo(() => {
    return assessmentFromRuleResults(currentPlan, violations, effectiveTargetFurnitureId ?? undefined);
  }, [currentPlan, violations, effectiveTargetFurnitureId]);

  const layoutAssessment = React.useMemo(
    () => assessmentFromRuleResults(currentPlan, violations),
    [currentPlan, violations],
  );

  const targetRoom = React.useMemo(() => {
    if (!targetRoomId) return null;
    return currentPlan.rooms.find((r) => r.id === targetRoomId) ?? null;
  }, [currentPlan.rooms, targetRoomId]);

  const targetRoomDetails = React.useMemo(() => {
    if (!targetRoom) return null;
    const vertexMap = getVertexMap(currentPlan);
    const wallMap = getWallMap(currentPlan);
    const points = computeRoomPolygon(targetRoom, wallMap, vertexMap);
    const customDim = (targetRoom as { customNetDimensions?: { widthMm: number; depthMm: number } })
      .customNetDimensions;
    const area = computePolygonArea(points, customDim);
    const displayName =
      targetRoom.name ?? i18n.getRoomTypeLabel(targetRoom.type);

    return {
      room: targetRoom,
      displayName,
      area,
    };
  }, [targetRoom, currentPlan, i18n]);

  const handleCreateRoom = React.useCallback(
    (params: { name?: string; widthMm: number; depthMm: number }) => {
      const { plan, record } = createRectangularRoomPlan({
        name: params.name,
        widthMm: params.widthMm,
        depthMm: params.depthMm,
        sequenceNumber: customRooms.length + 1,
        locale,
      });

      if (!initialActivePlan && !initialPlans) {
        saveCustomRoomRecord(record);
      }
      setCustomRooms((prev) => [record, ...prev.filter((r) => r.id !== record.id)]);
      setActivePlanId(record.id);
      setCurrentPlan(plan);
      setSelectedEntity({ type: "room", id: "room-1" });
      setTargetRoomId("room-1");
      setTargetFurnitureId(null);
      setMobileSheetType(null);
      setIsEditingRoomSettings(false);
      setDraftPlanPreview(null);
      setHighlightWallSide(null);
      setHighlightOpeningId(null);

      onPlanChange?.(plan);
      if (onScenarioChange) {
        onScenarioChange(floorPlanToPlacementScenario(plan));
      }
    },
    [customRooms, locale, initialActivePlan, initialPlans, onPlanChange, onScenarioChange, setCurrentPlan],
  );

  const handleSelectPlan = React.useCallback(
    (planId: string) => {
      setActivePlanId(planId);
      setSelectedEntity(null);
      setTargetRoomId(null);
      setMobileSheetType(null);
      setIsEditingRoomSettings(false);
      setDraftPlanPreview(null);
      setHighlightWallSide(null);
      setHighlightOpeningId(null);

      const isCustom = customRooms.some((r) => r.id === planId);
      if (!initialActivePlan && !initialPlans && isHydrated) {
        setLastActivePlan(isCustom ? "custom" : "standard", planId);
      }

      const targetSummary = plans.find((p) => p.id === planId) ?? plans[0];
      if (targetSummary) {
        const defaultTargetId = targetSummary.plan.furniture[0]?.id ?? null;
        setTargetFurnitureId(defaultTargetId);
        setCurrentPlan(targetSummary.plan);
        if (isCustom) {
          setSelectedEntity({ type: "room", id: "room-1" });
          setTargetRoomId("room-1");
        }
        onPlanChange?.(targetSummary.plan);
        if (onScenarioChange) {
          onScenarioChange(
            floorPlanToPlacementScenario(
              targetSummary.plan,
              defaultTargetId ?? undefined,
            ),
          );
        }
      }
    },
    [plans, customRooms, initialActivePlan, initialPlans, isHydrated, onPlanChange, onScenarioChange, setCurrentPlan],
  );

  const handleSelectTargetRoom = React.useCallback(
    (roomId: string) => {
      setTargetRoomId(roomId);
      setSelectedEntity({ type: "room", id: roomId });
    },
    [],
  );

  const handleSelectEntity = React.useCallback(
    (entity: SelectedEntity | null) => {
      setSelectedEntity(entity);
      if (entity?.type === "room") {
        setTargetRoomId(entity.id);
      } else if (entity?.type === "furniture") {
        setTargetFurnitureId(entity.id);
        if (onScenarioChange) {
          const scenario = floorPlanToPlacementScenario(currentPlan, entity.id);
          onScenarioChange(scenario);
        }
      }
    },
    [currentPlan, onScenarioChange],
  );

  const handleCloseMobileSheet = React.useCallback(() => {
    setMobileSheetType(null);
  }, []);

  const handleUpdatePlan = React.useCallback(
    (updatedPlan: FloorPlan, _description?: string, overrideTargetId?: string | null) => {
      setCurrentPlan(updatedPlan);

      const isCustom =
        customRooms.some((r) => r.id === updatedPlan.meta.id || r.id === activePlanId) ||
        updatedPlan.meta.source === "user" ||
        Boolean(updatedPlan.meta.customRoom);

      if (isCustom && !initialActivePlan && isHydrated) {
        const targetId = updatedPlan.meta.id ?? activePlanId;
        const existingRecord = customRooms.find((r) => r.id === targetId);
        const customDim = updatedPlan.meta.customRoom;
        const recordToSave: CustomRoomRecord = {
          id: targetId,
          name: updatedPlan.meta.name,
          widthMm: customDim?.widthMm ?? existingRecord?.widthMm ?? 3000,
          depthMm: customDim?.depthMm ?? existingRecord?.depthMm ?? 4000,
          createdAt: existingRecord?.createdAt ?? updatedPlan.meta.createdAt ?? new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          plan: updatedPlan,
        };
        saveCustomRoomRecord(recordToSave);
        setCustomRooms((prev) => [
          recordToSave,
          ...prev.filter((r) => r.id !== recordToSave.id),
        ]);
      }

      onPlanChange?.(updatedPlan);
      if (onScenarioChange) {
        const effectiveTarget =
          overrideTargetId !== undefined
            ? overrideTargetId ?? undefined
            : targetFurnitureId ?? undefined;
        const scenario = floorPlanToPlacementScenario(updatedPlan, effectiveTarget);
        onScenarioChange(scenario);
      }
    },
    [activePlanId, customRooms, initialActivePlan, initialPlans, isHydrated, onPlanChange, onScenarioChange, targetFurnitureId, setCurrentPlan],
  );

  // Add furniture to active plan with predefined specification
  const handleAddContextFurniture = React.useCallback(
    (definitionId: string, specificationId?: string) => {
      const catalog = getDefaultFurnitureCatalog();
      const effectiveRoomId = targetRoomId ?? currentPlan.rooms[0]?.id ?? null;
      const dropPos = effectiveRoomId
        ? computeRoomInitialDropPosition(currentPlan, effectiveRoomId)
        : null;

      const res = addFurnitureInstance(
        currentPlan,
        catalog,
        definitionId,
        {
          ...(dropPos ? { x: dropPos.x, y: dropPos.y } : {}),
          ...(specificationId ? { specificationId } : {}),
        },
      );

      if (res.success) {
        if (!targetRoomId && effectiveRoomId) {
          setTargetRoomId(effectiveRoomId);
        }
        handleUpdatePlan(res.plan, "Add furniture", res.instance.id);
        setTargetFurnitureId(res.instance.id);
        setSelectedEntity({ type: "furniture", id: res.instance.id });
        setIsFurnitureCatalogOpen(false);
        setMobileSheetType(null);
      }
    },
    [currentPlan, targetRoomId, handleUpdatePlan],
  );

  // Switch specificationId on an existing furniture placement while preserving center (x, y) and rotation (AC-5)
  const handleChangeSpecification = React.useCallback(
    (furnitureId: string, specificationId: string) => {
      const catalog = getDefaultFurnitureCatalog();
      const res = changeFurnitureSpecification(
        currentPlan,
        catalog,
        furnitureId,
        specificationId,
      );
      if (res.success) {
        handleUpdatePlan(res.plan, "Change furniture specification", furnitureId);
      }
    },
    [currentPlan, handleUpdatePlan],
  );

  const handleRotateTargetFurniture = React.useCallback(() => {
    if (!targetFurniture) return;
    const res = rotateFurnitureInstance(currentPlan, targetFurniture.id, 90);
    if (res.success) {
      handleUpdatePlan(res.plan, "Rotate furniture");
    }
  }, [currentPlan, targetFurniture, handleUpdatePlan]);

  const handleDeleteTargetFurniture = React.useCallback(() => {
    if (!targetFurniture) return;
    const res = deleteFurnitureInstance(currentPlan, targetFurniture.id);
    if (res.success) {
      if (selectedEntity?.id === targetFurniture.id) {
        setSelectedEntity(null);
      }
      setTargetFurnitureId(null);
      handleUpdatePlan(res.plan, "Delete furniture", null);
    }
  }, [currentPlan, targetFurniture, selectedEntity, handleUpdatePlan]);

  // Global keyboard shortcuts:
  // Arrow keys to nudge selected/target furniture (100mm / Shift 500mm)
  // R / r to rotate selected/target furniture by 90°
  // Delete / Backspace to remove selected/target furniture
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (canvasMode === "pan" || mobileSheetType !== null || isImageOpen || isPlanSelectorOpen || isFurnitureCatalogOpen) return;
      const activeEl = document.activeElement;
      if (
        activeEl &&
        (activeEl.tagName === "INPUT" || activeEl.tagName === "SELECT" ||
          activeEl.tagName === "TEXTAREA" ||
          (activeEl as HTMLElement).isContentEditable)
      ) {
        return;
      }

      const furnitureId =
        selectedEntity?.type === "furniture"
          ? selectedEntity.id
          : effectiveTargetFurnitureId;

      if (
        e.key === "ArrowLeft" ||
        e.key === "ArrowRight" ||
        e.key === "ArrowUp" ||
        e.key === "ArrowDown"
      ) {
        if (furnitureId) {
          const furniture = currentPlan.furniture.find((f) => f.id === furnitureId);
          if (furniture) {
            e.preventDefault();
            const step = e.shiftKey ? 500 : 100;
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
      } else if (
        (e.key === "r" || e.key === "R") &&
        !e.ctrlKey &&
        !e.metaKey &&
        !e.altKey
      ) {
        if (furnitureId) {
          e.preventDefault();
          const rotRes = rotateFurnitureInstance(currentPlan, furnitureId, 90);
          if (rotRes.success) {
            handleUpdatePlan(rotRes.plan, "Rotate furniture");
          }
        }
      } else if (e.key === "Delete" || e.key === "Backspace") {
        if (furnitureId) {
          e.preventDefault();
          const res = deleteFurnitureInstance(currentPlan, furnitureId);
          if (res.success) {
            if (selectedEntity?.id === furnitureId) {
              setSelectedEntity(null);
            }
            if (targetFurnitureId === furnitureId || effectiveTargetFurnitureId === furnitureId) {
              setTargetFurnitureId(null);
            }
            handleUpdatePlan(res.plan, "Delete furniture", null);
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
    targetFurniture,
    effectiveTargetFurnitureId,
    handleUpdatePlan,
    canvasMode,
    mobileSheetType,
    isImageOpen,
    isPlanSelectorOpen,
    isFurnitureCatalogOpen,
  ]);

  const isMobileSheetOpen = mobileSheetType !== null;

  const mobileSheetTitle = React.useMemo(() => {
    if (mobileSheetType === "entity" && selectedEntity) {
      switch (selectedEntity.type) {
        case "room":
          return t.mobileSheet.roomProperties;
        case "wall":
          return t.mobileSheet.wallProperties;
        case "opening":
          return t.mobileSheet.openingProperties;
        case "furniture":
          return isMobile ? isZh ? "选择尺寸" : "Choose size" : t.mobileSheet.furnitureProperties;
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
    if (mobileSheetType === "rooms") return isZh ? "房间与已摆放家具" : "Rooms & placed furniture";
    if (mobileSheetType === "help") return isZh ? "操作指南" : "How to use";
    if (mobileSheetType === "room-settings") return isZh ? "房间设置与门窗" : "Room Settings";
    return t.mobileSheet.details;
  }, [selectedEntity, mobileSheetType, t, isZh, isMobile]);

  const mobileSheetBadge = React.useMemo(() => {
    if (mobileSheetType === "entity" && selectedEntity) {
      if (isMobile && selectedEntity.type === "furniture") return null;
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
  }, [selectedEntity, mobileSheetType, violations, t, isMobile]);

  const mobileSheetBody = React.useMemo(() => {
    if (mobileSheetType === "entity" && selectedEntity) {
      if (isMobile && selectedEntity.type === "furniture") {
        const furniture = currentPlan.furniture.find((item) => item.id === selectedEntity.id);
        return furniture ? <FurnitureSizePicker furniture={furniture} locale={locale}
          onChange={(specificationId) => handleChangeSpecification(furniture.id, specificationId)} /> : null;
      }
      return (
        <FloorPlanInspector
          plan={currentPlan}
          onUpdatePlan={handleUpdatePlan}
          onChangeSpecification={handleChangeSpecification}
          selectedEntity={selectedEntity}
          onSelect={handleSelectEntity}
          violations={violations}
          locale={locale}
          showRules={false}
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
          assessment={spaceAssessment}
          selectedEntity={selectedEntity}
          onSelectEntity={handleSelectEntity}
          onChangeSpecification={handleChangeSpecification}
          locale={locale}
        />
      );
    }
    if (mobileSheetType === "furniture-palette") {
      return (
        <FurnitureCatalogPalette
          plan={currentPlan}
          onSelectDefinition={handleAddContextFurniture}
          onClose={handleCloseMobileSheet}
          locale={locale}
        />
      );
    }
    if (mobileSheetType === "rules") {
      return (
        <div className="space-y-4">
          <p className="text-xs text-muted-foreground">{isZh
            ? "全屋检查：数字为下方问题条数。同一对家具重叠计 1 项；不同方向的净距分别计数。红色表示需要调整，黄色表示空间略紧。"
            : "Whole-layout check: the count matches the issues below. Each overlapping pair counts once; directional clearance shortfalls count separately. Red means adjust; amber means a tight fit."}</p>
        <RuleFeedbackPanel
          plan={currentPlan}
          ruleResults={violations}
          selectedEntity={selectedEntity}
          onSelect={handleSelectEntity}
          locale={locale}
        />
        </div>
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
          onCreateRoomClick={() => {
            handleCloseMobileSheet();
            setIsCreateRoomOpen(true);
          }}
          locale={locale}
        />
      );
    }
    if (mobileSheetType === "rooms") {
      return <div className="space-y-4">
        <RoomList plan={currentPlan} targetRoomId={targetRoomId} locale={locale}
          onSelectRoom={(id) => { handleSelectTargetRoom(id); setMobileSheetType(null); }} />
        {currentPlan.furniture.length > 0 && <div className="space-y-2"><p className="text-sm font-semibold">{isZh ? "已摆放家具" : "Placed furniture"}</p>
          {currentPlan.furniture.map((item) => <Button key={item.id} variant={selectedEntity?.id === item.id ? "default" : "outline"}
            className="h-11 w-full justify-start" data-testid={`select-target-furniture-${item.id}`}
            aria-pressed={selectedEntity?.id === item.id} onClick={() => { handleSelectEntity({ type: "furniture", id: item.id }); setMobileSheetType(null); }}>
            {i18n.getFurnitureName(item.definitionId)} · {item.width} × {item.depth} mm
          </Button>)}
        </div>}
      </div>;
    }
    if (mobileSheetType === "help") {
      return <div className="space-y-4 text-sm text-muted-foreground">
        <p>{isZh ? "选择户型，点击房间，再添加家具。" : "Choose a plan, select a room, then add furniture."}</p>
        <p>{isZh ? "摆放模式下单指拖动家具；浏览模式下单指移动画布。双指捏合缩放，适屏按钮回到完整户型。" : "Drag furniture in Place mode, or drag the canvas in Pan mode. Pinch to zoom, and Fit returns to the full plan."}</p>
        <p>{isZh ? "选中家具后，点击选择尺寸切换规格；旋转和删除在底部直接操作，位置通过拖动调整。点击检查查看碰撞、净距和通行提醒。" : "Select furniture and choose its size. Rotate or remove it from the bottom bar, and drag it to adjust the position. Check reports collisions, clearance and passage constraints."}</p>
        <p>{isZh ? "出图可保存当前布局。户型是简化模型，请以实测尺寸为准。" : "Save an image of your layout. These are simplified plans; verify real measurements."}</p>
      </div>;
    }
    if (mobileSheetType === "room-settings") {
      return (
        <div className="min-h-0 h-[60vh] max-h-[500px]">
          <RoomSettingsPanel
            plan={currentPlan}
            onApplyPlan={(newPlan) => {
              if (newPlan.furniture.length === 0) {
                setSelectedEntity(null);
                setTargetFurnitureId(null);
              }
              handleUpdatePlan(newPlan, "Apply room settings");
              setMobileSheetType(null);
              setDraftPlanPreview(null);
              setHighlightWallSide(null);
              setHighlightOpeningId(null);
            }}
            onCancel={() => {
              setMobileSheetType(null);
              setDraftPlanPreview(null);
              setHighlightWallSide(null);
              setHighlightOpeningId(null);
            }}
            onDraftPreviewChange={handleDraftPreviewChange}
            locale={locale}
            isMobile={true}
          />
        </div>
      );
    }
    return null;
  }, [
    selectedEntity,
    mobileSheetType,
    currentPlan,
    handleUpdatePlan,
    handleChangeSpecification,
    handleSelectEntity,
    violations,
    spaceAssessment,
    plans,
    activePlanId,
    handleSelectPlan,
    handleCloseMobileSheet,
    handleAddContextFurniture,
    handleSelectTargetRoom,
    targetRoomId,
    targetFurnitureId,
    locale,
    isZh,
    i18n,
    isMobile,
  ]);

  if (!activePlanSummary) {
    return null;
  }

  const exportImage = async () => {
    if (!svgRef.current) return;
    const request = ++imageRequest.current;
    setPlanImage(null); setImageError(false); setIsImageOpen(true);
    try {
      const result = await renderFloorPlanImage(svgRef.current, currentPlan, activePlanSummary.name, locale);
      if (request === imageRequest.current) setPlanImage(result);
    } catch { if (request === imageRequest.current) setImageError(true); }
  };
  const imageDialog = <FloorPlanImageDialog open={isImageOpen} onClose={() => { imageRequest.current++; setIsImageOpen(false); }}
    image={planImage} error={imageError} locale={locale} name={activePlanSummary.name} />;
  const createRoomDialog = (
    <CreateRoomDialog
      open={isCreateRoomOpen}
      onOpenChange={setIsCreateRoomOpen}
      onCreateRoom={handleCreateRoom}
      locale={locale}
    />
  );
  const mobilePanel = <MobileBottomSheet open={isMobileSheetOpen} onClose={handleCloseMobileSheet}
    title={mobileSheetTitle} badge={mobileSheetBadge} desktop={!isMobile} closeLabel={isZh ? "关闭面板" : "Close bottom sheet"}>{mobileSheetBody}</MobileBottomSheet>;
  const displayPlan = draftPlanPreview ?? currentPlan;
  const viewer = <FloorPlanSvgViewer plan={displayPlan} selectedEntity={selectedEntity} onSelect={handleSelectEntity}
    canvasMode={canvasMode} violations={violations} targetRoomId={targetRoomId} onUpdatePlan={handleUpdatePlan}
    locale={locale} svgRef={svgRef} compact={isMobile} className="min-h-0 h-full w-full flex-1"
    isDraftMode={Boolean(draftPlanPreview || isEditingRoomSettings)}
    highlightWallSide={highlightWallSide} />;

  if (isMobile) {
    return <MobileWorkspace plan={currentPlan} summary={activePlanSummary} selectedEntity={selectedEntity}
      roomName={targetRoomDetails?.displayName} roomArea={targetRoomDetails?.area.formattedAreaM2}
      assessment={selectedEntity?.type === "furniture" ? spaceAssessment : layoutAssessment} canvasMode={canvasMode} issueCount={violations.length} locale={locale}
      canvas={viewer} overlays={<>{mobilePanel}{imageDialog}{createRoomDialog}</>} onModeChange={setCanvasMode} onOpen={setMobileSheetType}
      onRotate={handleRotateTargetFurniture} onDelete={handleDeleteTargetFurniture} onExport={exportImage} />;
  }

  return (
    <ToolPageChrome
      title={isZh ? "我家适合买多大的床或沙发？" : "Floor Plan Space Validator"}
      description={
        isZh
          ? "选择预设户型，添加通用家具规格，实时评估实体冲突与方向净距。"
          : "Choose a standard plan, place furniture, and evaluate physical collisions and directional clearances."
      }
      actions={
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" data-testid="export-plan-image-btn" onClick={exportImage}><ImageIcon />{isZh ? "出图" : "Save image"}</Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            data-testid="create-room-btn"
            aria-label={isZh ? "新建房间" : "Create Room"}
            onClick={() => setIsCreateRoomOpen(true)}
            className="min-h-11 min-w-11 lg:min-h-8 lg:min-w-0 gap-1.5 text-xs font-medium touch-manipulation"
          >
            <PlusSquare className="h-3.5 w-3.5 text-primary" />
            <span>{isZh ? "新建房间" : "Create Room"}</span>
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            data-testid="open-plan-selector-btn"
            aria-label={isZh ? "切换户型" : "Change Plan"}
            onClick={() => setIsPlanSelectorOpen(true)}
            className="min-h-11 min-w-11 lg:min-h-8 lg:min-w-0 gap-1.5 text-xs font-medium touch-manipulation focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
          >
            <Compass className="h-3.5 w-3.5 text-primary" />
            <span>{isZh ? "切换户型" : "Change Plan"}</span>
          </Button>
          <Button
            type="button"
            variant="default"
            size="sm"
            data-testid="open-furniture-catalog-btn"
            aria-label={t.actions.addFurniture}
            onClick={() => setIsFurnitureCatalogOpen(true)}
            className="min-h-11 min-w-11 lg:min-h-8 lg:min-w-0 gap-1.5 text-xs font-medium touch-manipulation focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>{t.actions.addFurniture}</span>
          </Button>
        </div>
      }
    >
      <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-x-hidden lg:h-full">
        {/* Streamlined Workspace: Mobile Canvas-Primary Stack, Desktop 2-Pane */}
        <div className="grid min-h-0 flex-1 gap-3 lg:grid-cols-[20rem_minmax(0,1fr)] xl:grid-cols-[21rem_minmax(0,1fr)] lg:grid-rows-1 lg:items-stretch lg:h-full">
          {/* Primary Floor-Plan Canvas Section (Order 1 on Mobile, Right Pane on Desktop) */}
          <section
            data-testid="floor-plan-canvas-section"
            className="order-1 flex min-h-0 flex-1 flex-col gap-2.5 lg:order-2 lg:h-full"
          >
            <FloorPlanToolbar
              currentPlan={currentPlan}
              activePlanSummary={activePlanSummary}
              violations={violations}
              canvasMode={canvasMode}
              t={t}
              onCanvasModeChange={setCanvasMode}
              onOpenMobileSheet={setMobileSheetType}
              onOpenPlanSelector={() => setIsPlanSelectorOpen(true)}
              onOpenFurnitureCatalog={() => setIsFurnitureCatalogOpen(true)}
              onClearSelection={() => setSelectedEntity(null)}
            />

            <Card
              className="relative flex min-h-[340px] flex-1 flex-col overflow-hidden p-0 sm:min-h-[460px] lg:min-h-0 lg:h-full"
            >
              {viewer}
            </Card>
          </section>

          {/* Context & Assessment Controls Rail (Order 2 Stacked Below Canvas on Mobile, Left Pane on Desktop) */}
          <aside
            data-testid="desktop-context-pane"
            className="order-2 flex min-h-0 flex-col gap-3 lg:order-1 lg:h-full"
          >
            <Card className="flex h-full min-h-0 flex-1 flex-col gap-0 overflow-hidden py-0">
              <CardHeader
                data-testid="active-plan-summary"
                className="shrink-0 border-b border-border/70 p-3 space-y-1"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-[11px] text-muted-foreground">
                      {isZh ? "当前户型" : "Active Plan"}
                    </p>
                    <CardTitle
                      data-testid="active-plan-name"
                      className="truncate text-sm font-semibold text-foreground"
                    >
                      {activePlanSummary.name}
                    </CardTitle>
                  </div>
                  <Badge
                    variant="secondary"
                    data-testid="active-plan-area"
                    className="shrink-0 font-mono text-[10px]"
                  >
                    {activePlanSummary.formattedArea}
                  </Badge>
                </div>
                <p
                  data-testid="active-plan-room-breakdown"
                  className="text-[11px] text-muted-foreground truncate"
                >
                  {activePlanSummary.roomBreakdown}
                </p>
                <div className="flex items-center justify-between gap-2 pt-1">
                  <span className="text-[11px] text-muted-foreground">{currentPlan.furniture.length} {isZh ? "件已摆放家具" : "placed items"}</span>
                  <div className="flex items-center gap-1.5">
                    {isCustomRoom && (
                      <Button
                        type="button"
                        variant={isEditingRoomSettings ? "default" : "outline"}
                        size="sm"
                        data-testid="edit-room-settings-btn"
                        className="h-8 px-2 text-xs gap-1"
                        onClick={() => setIsEditingRoomSettings((prev) => !prev)}
                      >
                        <DoorOpen className="h-3.5 w-3.5" />
                        <span>{isZh ? "门窗与尺寸" : "Settings"}</span>
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" className={cn("h-8 px-2 text-xs", layoutAssessment.status === "must-adjust" && "text-destructive")}
                      data-testid="desktop-assessment-btn" onClick={() => setMobileSheetType("rules")}>
                      {currentPlan.furniture.length ? getAssessmentStatusLabel(layoutAssessment.status, locale) : isZh ? "待摆放" : "No furniture"}
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {isEditingRoomSettings ? (
                <div className="min-h-0 flex-1 flex flex-col p-3 overflow-hidden">
                  <RoomSettingsPanel
                    plan={currentPlan}
                    onApplyPlan={(newPlan) => {
                      if (newPlan.furniture.length === 0) {
                        setSelectedEntity(null);
                        setTargetFurnitureId(null);
                      }
                      handleUpdatePlan(newPlan, "Apply room settings");
                      setIsEditingRoomSettings(false);
                      setDraftPlanPreview(null);
                      setHighlightWallSide(null);
                      setHighlightOpeningId(null);
                    }}
                    onCancel={() => {
                      setIsEditingRoomSettings(false);
                      setDraftPlanPreview(null);
                      setHighlightWallSide(null);
                      setHighlightOpeningId(null);
                    }}
                    onDraftPreviewChange={handleDraftPreviewChange}
                    locale={locale}
                  />
                </div>
              ) : (
                <CardScrollArea className="min-h-0 flex-1 p-3 space-y-4">
                {/* 1. Target Room Selection */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-medium text-foreground block">
                    {isZh ? "选择重点评估房间" : "Select Focus Room"}
                  </span>
                  <RoomList
                    plan={currentPlan}
                    targetRoomId={targetRoomId}
                    onSelectRoom={handleSelectTargetRoom}
                    locale={locale}
                    compact
                  />
                </div>

                {/* 2. Target Room Details */}
                {targetRoomDetails && (
                  <div
                    data-testid="target-room-details"
                    className="rounded-xl border border-primary/30 bg-primary/5 p-2.5 text-xs"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <span
                          data-testid="target-room-name"
                          className="block truncate text-sm font-semibold text-foreground"
                        >
                          {targetRoomDetails.displayName}
                        </span>
                      </div>
                      <Badge variant="default" className="shrink-0 text-[10px]">
                        <span data-testid="target-room-area">
                          {targetRoomDetails.area.formattedAreaM2}
                        </span>
                      </Badge>
                    </div>
                  </div>
                )}

                {/* Keep the selected object's controls above the furniture catalog. */}
                {!isMobileSheetOpen && selectedEntity && (
                  <FloorPlanInspector plan={currentPlan} onUpdatePlan={handleUpdatePlan}
                    onChangeSpecification={handleChangeSpecification} selectedEntity={selectedEntity}
                    onSelect={handleSelectEntity} violations={violations} locale={locale} showRules={false} />
                )}

                {/* 3. Context Furniture Options */}
                <details open={selectedEntity?.type !== "furniture"} className="group/recommendations space-y-2">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-2 rounded-lg py-1 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                    <span className="text-[11px] font-medium text-foreground">
                      {isZh ? "添加家具" : "Add Furniture"}
                    </span>
                    <Plus className="size-4 transition-transform group-open/recommendations:rotate-45" />
                  </summary>
                  <ContextFurniturePanel
                    plan={currentPlan}
                    targetRoomId={targetRoomId}
                    onAddFurniture={handleAddContextFurniture}
                    onOpenFullCatalog={() => setIsFurnitureCatalogOpen(true)}
                    locale={locale}
                  />
                </details>

                {/* 3.5 Placed Furniture & Active Assessment Target Switcher (AC-3) */}
                {currentPlan.furniture.length > 0 && (
                  <div
                    data-testid="placed-furniture-list"
                    className="space-y-1.5 pt-1 border-t border-border/60"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-medium text-foreground">
                        {isZh ? "已摆放家具（点击切换主评估目标）" : "Placed Furniture (Select Target)"}
                      </span>
                      <Badge variant="outline" className="text-[10px] font-mono px-1.5 py-0">
                        {currentPlan.furniture.length}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {currentPlan.furniture.map((item) => {
                        const isTarget = targetFurniture?.id === item.id;
                        const itemName = i18n.getFurnitureName(item.definitionId);
                        return (
                          <Button
                            key={item.id}
                            type="button"
                            size="sm"
                            variant={isTarget ? "default" : "outline"}
                            data-testid={`select-target-furniture-${item.id}`}
                            data-selected={isTarget ? "true" : "false"}
                            aria-pressed={isTarget}
                            aria-label={
                              isZh
                                ? `选择评估目标：${itemName} (${item.width} × ${item.depth} mm)`
                                : `Select assessment target: ${itemName} (${item.width} × ${item.depth} mm)`
                            }
                            onClick={() =>
                              handleSelectEntity({ type: "furniture", id: item.id })
                            }
                            className="min-h-11 min-w-11 lg:h-7 lg:min-h-0 lg:min-w-0 px-2.5 text-[11px] gap-1.5 touch-manipulation focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
                          >
                            <span className="truncate max-w-[8rem]">{itemName}</span>
                            {isTarget && (
                              <span
                                data-testid={`active-target-badge-${item.id}`}
                                className="text-[9px] font-mono opacity-90"
                              >
                                {isZh ? "当前目标" : "Target"}
                              </span>
                            )}
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 4. Target Furniture Decision & Spatial Assessment */}
                {targetFurniture && !(isMobile && mobileSheetType === "decision") && (
                  <details data-testid="decision-target-furniture" className="group/assessment space-y-3 border-t border-border/60 pt-2">
                    <summary className="flex cursor-pointer list-none items-center justify-between py-1 text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                      {isZh ? "详细空间检查" : "Detailed assessment"}<Plus className="size-4 transition-transform group-open/assessment:rotate-45" />
                    </summary>
                    <FurnitureDecisionPanel
                      plan={currentPlan}
                      targetRoomId={targetRoomId}
                      targetFurnitureId={targetFurniture.id}
                      ruleResults={violations}
                      assessment={spaceAssessment}
                      selectedEntity={selectedEntity}
                      onSelectEntity={handleSelectEntity}
                      onChangeSpecification={handleChangeSpecification}
                      locale={locale}
                    />
                  </details>
                )}

                {/* 5. Entity Inspector (when wall, room, or furniture is selected or target furniture is active) */}
                {!isMobileSheetOpen && !selectedEntity && targetFurniture && (
                  <div className="pt-2 border-t border-border/60">
                    <FloorPlanInspector
                      plan={currentPlan}
                      onUpdatePlan={handleUpdatePlan}
                      onChangeSpecification={handleChangeSpecification}
                      selectedEntity={
                        selectedEntity ??
                        (targetFurniture
                          ? { type: "furniture", id: targetFurniture.id }
                          : null)
                      }
                      onSelect={handleSelectEntity}
                      violations={violations}
                      locale={locale}
                      showRules={false}
                    />
                  </div>
                )}

                {/* 6. General Spatial Rules Feedback */}
                {!selectedEntity && !targetFurniture && (
                  <div className="pt-2 border-t border-border/60">
                    <RuleFeedbackPanel
                      plan={currentPlan}
                      ruleResults={violations}
                      selectedEntity={selectedEntity}
                      onSelect={handleSelectEntity}
                      locale={locale}
                    />
                  </div>
                )}
              </CardScrollArea>
              )}
            </Card>
          </aside>
        </div>
      </div>

      {/* Plan Selector Dialog */}
      <FloorPlanSelectorDialog
        open={isPlanSelectorOpen}
        onOpenChange={setIsPlanSelectorOpen}
        plans={plans}
        activePlanId={activePlanId}
        onSelectPlan={handleSelectPlan}
        onCreateRoomClick={() => setIsCreateRoomOpen(true)}
        locale={locale}
        t={t}
      />

      {/* Full Furniture Catalog Dialog */}
      <FurnitureCatalogDialog
        open={isFurnitureCatalogOpen}
        onOpenChange={setIsFurnitureCatalogOpen}
        plan={currentPlan}
        onSelectDefinition={handleAddContextFurniture}
        locale={locale}
        t={t}
      />

      {/* Create Room Dialog */}
      {createRoomDialog}

      {/* Mobile Bottom Properties Surface */}
      {imageDialog}
      {mobilePanel}
    </ToolPageChrome>
  );
}
