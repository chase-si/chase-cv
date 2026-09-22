"use client";

import * as React from "react";
import { Compass, Plus } from "lucide-react";
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
import type { FloorPlan } from "@/lib/floor-plan/types";
import { evaluatePlanRules } from "@/lib/floor-plan/rules";
import {
  computePolygonArea,
  computeRoomPolygon,
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
  computeRoomInitialDropPosition,
  deleteFurnitureInstance,
  moveFurnitureInstance,
  rotateFurnitureInstance,
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
  storage?: any; // Deprecated prop retained for backward compatibility
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

  // Target room & target furniture state
  const [targetRoomId, setTargetRoomId] = React.useState<string | null>(null);
  const [targetFurnitureId, setTargetFurnitureId] = React.useState<string | null>(null);

  // On-demand dialog states
  const [isPlanSelectorOpen, setIsPlanSelectorOpen] = React.useState<boolean>(false);
  const [isFurnitureCatalogOpen, setIsFurnitureCatalogOpen] = React.useState<boolean>(false);

  // Canvas mode: "pan" vs "edit"
  const [canvasMode, setCanvasMode] = React.useState<"pan" | "edit">("edit");

  // Mobile bottom properties surface state: "entity" | "furniture-palette" | "rules" | "catalog" | "decision" | null
  const [mobileSheetType, setMobileSheetType] = React.useState<
    "entity" | "furniture-palette" | "rules" | "catalog" | "decision" | null
  >(null);

  const activePlanSummary = React.useMemo(
    () => plans.find((p) => p.id === activePlanId) ?? plans[0],
    [plans, activePlanId],
  );

  // Active FloorPlan in memory
  const [currentPlan, setCurrentPlan] = React.useState<FloorPlan>(
    initialActivePlan ?? (activePlanSummary ? activePlanSummary.plan : ({} as FloorPlan)),
  );

  // Synchronize initial plan if prop changes
  React.useEffect(() => {
    if (initialActivePlan) {
      setCurrentPlan(initialActivePlan);
      setActivePlanId(initialActivePlan.meta.id ?? "plan-preview");
    }
  }, [initialActivePlan]);

  // Evaluate spatial rules deterministically
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
    const displayName =
      targetRoom.name ?? i18n.getRoomTypeLabel(targetRoom.type);

    return {
      room: targetRoom,
      displayName,
      area,
    };
  }, [targetRoom, currentPlan, i18n]);

  const targetFurniture = React.useMemo(() => {
    if (!targetFurnitureId) {
      // Default to first furniture if none selected
      return currentPlan.furniture[0] ?? null;
    }
    return currentPlan.furniture.find((f) => f.id === targetFurnitureId) ?? currentPlan.furniture[0] ?? null;
  }, [currentPlan.furniture, targetFurnitureId]);

  const handleSelectPlan = React.useCallback(
    (planId: string) => {
      setActivePlanId(planId);
      setSelectedEntity(null);
      setTargetRoomId(null);
      setTargetFurnitureId(null);
      setMobileSheetType(null);

      const targetSummary = plans.find((p) => p.id === planId) ?? plans[0];
      if (targetSummary) {
        setCurrentPlan(targetSummary.plan);
        onPlanChange?.(targetSummary.plan);
      }
    },
    [plans, onPlanChange],
  );

  const handleSelectTargetRoom = React.useCallback(
    (roomId: string) => {
      setTargetRoomId(roomId);
      if (!isMobile) {
        setSelectedEntity({ type: "room", id: roomId });
      }
    },
    [isMobile],
  );

  const handleSelectEntity = React.useCallback(
    (entity: SelectedEntity | null) => {
      setSelectedEntity(entity);
      if (entity?.type === "room") {
        setTargetRoomId(entity.id);
      } else if (entity?.type === "furniture") {
        setTargetFurnitureId(entity.id);
      }
      if (entity && isMobile) {
        setMobileSheetType("entity");
      }
    },
    [isMobile],
  );

  const handleCloseMobileSheet = React.useCallback(() => {
    setSelectedEntity(null);
    setMobileSheetType(null);
  }, []);

  const handleUpdatePlan = React.useCallback(
    (updatedPlan: FloorPlan, _description?: string) => {
      setCurrentPlan(updatedPlan);
      onPlanChange?.(updatedPlan);
    },
    [onPlanChange],
  );

  // Add furniture to active plan
  const handleAddContextFurniture = React.useCallback(
    (definitionId: string) => {
      const catalog = getDefaultFurnitureCatalog();
      const effectiveRoomId = targetRoomId ?? currentPlan.rooms[0]?.id ?? null;
      const dropPos = effectiveRoomId
        ? computeRoomInitialDropPosition(currentPlan, effectiveRoomId)
        : null;

      const res = addFurnitureInstance(
        currentPlan,
        catalog,
        definitionId,
        dropPos ? { x: dropPos.x, y: dropPos.y } : undefined,
      );

      if (res.success) {
        if (!targetRoomId && effectiveRoomId) {
          setTargetRoomId(effectiveRoomId);
        }
        handleUpdatePlan(res.plan, "Add furniture");
        setTargetFurnitureId(res.instance.id);
        setSelectedEntity({ type: "furniture", id: res.instance.id });
        setIsFurnitureCatalogOpen(false);
        setMobileSheetType(null);
      }
    },
    [currentPlan, targetRoomId, handleUpdatePlan],
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
      handleUpdatePlan(res.plan, "Delete furniture");
    }
  }, [currentPlan, targetFurniture, selectedEntity, handleUpdatePlan]);

  // Global keyboard shortcuts:
  // Arrow keys to nudge selected furniture (50mm / Shift 500mm)
  // Delete / Backspace to remove selected furniture
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

      if (
        e.key === "ArrowLeft" ||
        e.key === "ArrowRight" ||
        e.key === "ArrowUp" ||
        e.key === "ArrowDown"
      ) {
        const furnitureId =
          selectedEntity?.type === "furniture"
            ? selectedEntity.id
            : targetFurnitureId;

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
      } else if (e.key === "Delete" || e.key === "Backspace") {
        if (selectedEntity?.type === "furniture") {
          e.preventDefault();
          const res = deleteFurnitureInstance(currentPlan, selectedEntity.id);
          if (res.success) {
            setSelectedEntity(null);
            if (targetFurnitureId === selectedEntity.id) {
              setTargetFurnitureId(null);
            }
            handleUpdatePlan(res.plan, "Delete furniture");
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentPlan, selectedEntity, targetFurnitureId, handleUpdatePlan]);

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
          onUpdatePlan={handleUpdatePlan}
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
          selectedEntity={selectedEntity}
          onSelectEntity={handleSelectEntity}
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
          onSelect={handleSelectEntity}
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
    handleUpdatePlan,
    handleSelectEntity,
    violations,
    plans,
    activePlanId,
    handleSelectPlan,
    handleCloseMobileSheet,
    targetRoomId,
    targetFurnitureId,
    locale,
  ]);

  if (!activePlanSummary) {
    return null;
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
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            data-testid="open-plan-selector-btn"
            onClick={() => setIsPlanSelectorOpen(true)}
            className="gap-1.5 text-xs font-medium"
          >
            <Compass className="h-3.5 w-3.5 text-primary" />
            <span>{isZh ? "切换户型" : "Change Plan"}</span>
          </Button>
          <Button
            type="button"
            variant="default"
            size="sm"
            data-testid="open-furniture-catalog-btn"
            onClick={() => setIsFurnitureCatalogOpen(true)}
            className="gap-1.5 text-xs font-medium"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>{t.actions.addFurniture}</span>
          </Button>
        </div>
      }
    >
      <div className="flex min-h-0 flex-1 flex-col gap-3">
        {/* Streamlined Workspace: Desktop 2-Pane, Mobile Stack */}
        <div className="grid min-h-0 flex-1 gap-3 lg:grid-cols-[22rem_minmax(0,1fr)] lg:items-start">
          {/* Left Context Rail: Plan summary, Room picker, Furniture recommendations, Decision & Inspector */}
          <aside
            data-testid="desktop-context-pane"
            className="hidden lg:flex min-h-0 flex-col gap-3 lg:max-h-full"
          >
            <Card className="flex min-h-0 flex-1 flex-col overflow-hidden">
              <CardHeader className="shrink-0 border-b border-border/70 p-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-[11px] text-muted-foreground">
                      {isZh ? "当前户型" : "Active Plan"}
                    </p>
                    <CardTitle className="truncate text-sm font-semibold text-foreground">
                      {activePlanSummary.name}
                    </CardTitle>
                  </div>
                  <Badge variant="secondary" className="shrink-0 font-mono text-[10px]">
                    {activePlanSummary.formattedArea}
                  </Badge>
                </div>
              </CardHeader>

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

                {/* 3. Context Furniture Options */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-medium text-foreground">
                      {isZh ? "添加家具" : "Add Furniture"}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsFurnitureCatalogOpen(true)}
                      className="h-6 px-2 text-[10px] text-primary"
                    >
                      {isZh ? "查看全部" : "Browse All"}
                    </Button>
                  </div>
                  <ContextFurniturePanel
                    plan={currentPlan}
                    targetRoomId={targetRoomId}
                    onAddFurniture={handleAddContextFurniture}
                    onOpenFullCatalog={() => setIsFurnitureCatalogOpen(true)}
                    locale={locale}
                  />
                </div>

                {/* 4. Target Furniture Decision & Spatial Assessment */}
                {targetFurniture && (
                  <div data-testid="decision-target-furniture" className="space-y-3 pt-1 border-t border-border/60">
                    <FurnitureDecisionPanel
                      plan={currentPlan}
                      targetRoomId={targetRoomId}
                      targetFurnitureId={targetFurniture.id}
                      ruleResults={violations}
                      selectedEntity={selectedEntity}
                      onSelectEntity={handleSelectEntity}
                      locale={locale}
                    />
                  </div>
                )}

                {/* 5. Entity Inspector (when wall, room, or furniture is selected) */}
                {selectedEntity && (
                  <div className="pt-2 border-t border-border/60">
                    <FloorPlanInspector
                      plan={currentPlan}
                      onUpdatePlan={handleUpdatePlan}
                      selectedEntity={selectedEntity}
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
            </Card>
          </aside>

          {/* Right Main Section: Toolbar + SVG Viewer */}
          <section className="flex min-h-0 flex-1 flex-col gap-2.5 lg:max-h-full">
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
              className="relative flex min-h-[460px] flex-1 flex-col overflow-hidden p-0 sm:min-h-[560px]"
            >
              <FloorPlanSvgViewer
                plan={currentPlan}
                selectedEntity={selectedEntity}
                onSelect={handleSelectEntity}
                canvasMode={canvasMode}
                violations={violations}
                targetRoomId={targetRoomId}
                onUpdatePlan={handleUpdatePlan}
                locale={locale}
              />
            </Card>
          </section>
        </div>
      </div>

      {/* Plan Selector Dialog */}
      <FloorPlanSelectorDialog
        open={isPlanSelectorOpen}
        onOpenChange={setIsPlanSelectorOpen}
        plans={plans}
        activePlanId={activePlanId}
        onSelectPlan={handleSelectPlan}
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

      {/* Mobile Bottom Properties Surface */}
      <MobileBottomSheet
        open={isMobileSheetOpen}
        onClose={handleCloseMobileSheet}
        title={mobileSheetTitle}
        badge={mobileSheetBadge}
      >
        {mobileSheetBody}
      </MobileBottomSheet>
    </ToolPageChrome>
  );
}
