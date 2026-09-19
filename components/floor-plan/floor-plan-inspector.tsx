"use client";

import * as React from "react";
import {
  Armchair,
  ArrowRight,
  Box,
  DoorOpen,
  Info,
  Layers,
  Maximize2,
  Minimize2,
  Plus,
  RotateCw,
  SlidersHorizontal,
  Square,
  Trash2,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { FloorPlan } from "@/lib/floor-plan";
import {
  computeOpeningGeometry,
  computePlanTotalArea,
  computePolygonArea,
  computePrincipalDimensions,
  computeRoomPolygon,
  computeWallGeometry,
  getVertexMap,
  getWallMap,
} from "@/lib/floor-plan/geometry";
import { getRoomSpans } from "@/lib/floor-plan/room-adjustment";
import { RoomSpanEditor } from "./room-span-editor";
import { OpeningEditor } from "./opening-editor";
import { FurnitureEditor } from "./furniture-editor";
import { FurnitureCatalogPalette } from "./furniture-catalog-palette";
import { RuleFeedbackPanel } from "./rule-feedback-panel";
import type { RuleResult } from "@/lib/floor-plan/rules";
import { useFloorPlanI18n } from "@/lib/floor-plan/i18n";
import type { EntitySelectHandler, SelectedEntity } from "./types";

interface FloorPlanInspectorProps {
  plan: FloorPlan;
  isDraftMode?: boolean;
  allowSpanEdit?: boolean;
  onUpdatePlan?: (updated: FloorPlan, description?: string) => void;
  selectedEntity: SelectedEntity | null;
  onSelect: EntitySelectHandler;
  violations?: RuleResult[];
  className?: string;
  locale?: string;
  onStartCalibration?: () => void;
  onEnsureUserPlan?: () => void;
}

export function FloorPlanInspector({
  plan,
  isDraftMode = false,
  allowSpanEdit = false,
  onUpdatePlan,
  selectedEntity,
  onSelect,
  violations,
  className = "",
  locale,
  onStartCalibration,
  onEnsureUserPlan,
}: FloorPlanInspectorProps) {
  const i18n = useFloorPlanI18n(locale);
  const t = i18n.t;
  const vertexMap = React.useMemo(() => getVertexMap(plan), [plan]);
  const wallMap = React.useMemo(() => getWallMap(plan), [plan]);
  const totalArea = React.useMemo(() => computePlanTotalArea(plan), [plan]);

  const [showFurniturePalette, setShowFurniturePalette] = React.useState(false);

  React.useEffect(() => {
    setShowFurniturePalette(false);
  }, [selectedEntity]);

  // Selected Wall details
  const selectedWall = React.useMemo(() => {
    if (selectedEntity?.type !== "wall") return null;
    const wall = wallMap.get(selectedEntity.id);
    if (!wall) return null;
    const geom = computeWallGeometry(wall, vertexMap);
    return { wall, geom };
  }, [selectedEntity, wallMap, vertexMap]);

  // Selected Room details
  const selectedRoom = React.useMemo(() => {
    if (selectedEntity?.type !== "room") return null;
    const room = plan.rooms.find((r) => r.id === selectedEntity.id);
    if (!room) return null;
    const points = computeRoomPolygon(room, wallMap, vertexMap);
    const area = computePolygonArea(points);
    return { room, points, area };
  }, [selectedEntity, plan.rooms, wallMap, vertexMap]);

  // Selected Opening details
  const selectedOpening = React.useMemo(() => {
    if (selectedEntity?.type !== "opening") return null;
    const opening = plan.openings.find((o) => o.id === selectedEntity.id);
    if (!opening) return null;
    const wall = wallMap.get(opening.wallId);
    const geom = wall ? computeOpeningGeometry(opening, wall, vertexMap) : null;
    return { opening, wall, geom };
  }, [selectedEntity, plan.openings, wallMap, vertexMap]);

  // Selected Furniture details
  const selectedFurniture = React.useMemo(() => {
    if (selectedEntity?.type !== "furniture") return null;
    return plan.furniture.find((f) => f.id === selectedEntity.id) ?? null;
  }, [selectedEntity, plan.furniture]);

  // Selected Dimension details
  const selectedDimension = React.useMemo(() => {
    if (selectedEntity?.type !== "dimension") return null;
    const dims = computePrincipalDimensions(plan);
    return dims.find((d) => d.id === selectedEntity.id) ?? null;
  }, [selectedEntity, plan]);

  // Room Spans for selected room
  const roomSpans = React.useMemo(() => {
    if (!selectedRoom) return null;
    return getRoomSpans(plan, selectedRoom.room.id);
  }, [selectedRoom, plan]);

  // Rooms bounded by selected wall
  const boundedRooms = React.useMemo(() => {
    if (!selectedWall) return [];
    return plan.rooms.filter((r) => r.boundaryWallIds.includes(selectedWall.wall.id));
  }, [selectedWall, plan.rooms]);

  return (
    <div
      data-testid="floor-plan-inspector"
      className={`flex flex-col gap-3 p-1 ${className}`}
    >
      {/* Spatial Rule Feedback Panel (US-12, US-14, AC-12, AC-14) */}
      <RuleFeedbackPanel
        plan={plan}
        ruleResults={violations}
        selectedEntity={selectedEntity}
        onSelect={onSelect}
        locale={locale}
      />
      {selectedEntity && (
        <div className="flex items-center justify-between pb-2 border-b border-border">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-xs text-foreground uppercase tracking-wider">
              {locale === "zh" ? "实体检查器" : "Entity Inspector"}
            </span>
            <Badge variant="outline" className="text-[10px] uppercase font-mono">
              {selectedEntity.type}
            </Badge>
          </div>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => onSelect(null)}
            className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
            data-testid="inspector-deselect-btn"
            title={t.actions.close}
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      )}

      {/* 1. Wall Inspection */}
      {selectedWall && (
        <div data-testid="inspector-wall-details" className="space-y-3">
          <div className="space-y-1">
            <span className="text-[11px] text-muted-foreground">{t.inspector.wallId}</span>
            <p className="font-mono text-xs font-semibold text-foreground">
              {selectedWall.wall.id}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="rounded-lg border border-border/80 bg-muted/30 p-2">
              <span className="text-[10px] text-muted-foreground block">{t.inspector.wallLength}</span>
              <span className="font-mono font-semibold text-foreground">
                {selectedWall.geom?.length ?? "—"} mm
              </span>
            </div>
            <div className="rounded-lg border border-border/80 bg-muted/30 p-2">
              <span className="text-[10px] text-muted-foreground block">{t.inspector.wallThickness}</span>
              <span className="font-mono font-semibold text-foreground">
                {selectedWall.wall.thickness} mm
              </span>
            </div>
            <div className="rounded-lg border border-border/80 bg-muted/30 p-2">
              <span className="text-[10px] text-muted-foreground block">{t.inspector.wallLockAxis}</span>
              <span className="font-mono font-semibold text-foreground capitalize">
                {selectedWall.wall.lockAxis}
              </span>
            </div>
            <div className="rounded-lg border border-border/80 bg-muted/30 p-2">
              <span className="text-[10px] text-muted-foreground block">{locale === "zh" ? "倾角" : "Angle"}</span>
              <span className="font-mono font-semibold text-foreground">
                {selectedWall.geom ? Math.round(selectedWall.geom.angleDeg) : 0}°
              </span>
            </div>
          </div>

          <div className="space-y-1 text-xs">
            <span className="text-[10px] text-muted-foreground">{locale === "zh" ? "端点连接" : "Topology Endpoints"}</span>
            <p className="font-mono text-[11px] text-foreground/80">
              {selectedWall.wall.from} → {selectedWall.wall.to}
            </p>
          </div>

          {boundedRooms.length > 0 && (
            <div className="space-y-1.5 text-xs pt-1 border-t border-border/60">
              <span className="text-[10px] text-muted-foreground block">
                {locale === "zh" ? "所属房间边界" : `Boundary of Room${boundedRooms.length > 1 ? "s" : ""}`}
              </span>
              <div className="flex flex-wrap gap-1">
                {boundedRooms.map((r) => (
                  <Button
                    key={r.id}
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => onSelect({ type: "room", id: r.id })}
                    className="h-6 px-2 text-[11px] font-medium flex items-center gap-1"
                  >
                    <span>{r.name ?? (locale === "zh" ? i18n.getRoomTypeLabel(r.type) : r.type)}</span>
                    <ArrowRight className="h-3 w-3 text-muted-foreground" />
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. Room Inspection */}
      {selectedRoom && (
        <div data-testid="inspector-room-details" className="space-y-3">
          <div className="space-y-1">
            <span className="text-[11px] text-muted-foreground">{t.inspector.roomName}</span>
            <p data-testid="target-room-name" className="font-semibold text-sm text-foreground">
              {selectedRoom.room.name ?? (locale === "zh" ? i18n.getRoomTypeLabel(selectedRoom.room.type) : selectedRoom.room.type)}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="rounded-lg border border-border/80 bg-muted/30 p-2">
              <span className="text-[10px] text-muted-foreground block">{t.inspector.calculatedArea}</span>
              <span data-testid="target-room-area" className="font-mono font-semibold text-foreground">
                {selectedRoom.area.formattedAreaM2}
              </span>
            </div>
            <div className="rounded-lg border border-border/80 bg-muted/30 p-2">
              <span className="text-[10px] text-muted-foreground block">{t.inspector.roomType}</span>
              <span className="font-mono font-semibold text-foreground capitalize">
                {locale === "zh" ? i18n.getRoomTypeLabel(selectedRoom.room.type) : selectedRoom.room.type.replace("_", " ")}
              </span>
            </div>
          </div>

          {/* Room Spans Overview (Read-Only) or Interactive Room Span Editor (Draft Mode or allowSpanEdit) */}
          {isDraftMode || allowSpanEdit ? (
            <div data-testid="target-room-spans" className="space-y-1.5">
              <span className="text-[11px] font-medium text-foreground block">
                {locale === "zh" ? "房间开间进深跨度" : "Room Spans"}
              </span>
              <RoomSpanEditor
                plan={plan}
                roomId={selectedRoom.room.id}
                onUpdatePlan={onUpdatePlan}
                locale={locale}
              />
              {!isDraftMode && onStartCalibration && (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  data-testid="start-calibration-btn"
                  onClick={onStartCalibration}
                  className="w-full text-xs font-medium mt-1 gap-1.5"
                >
                  <SlidersHorizontal className="h-3.5 w-3.5 text-primary" />
                  <span>{t.workflow?.actions?.calibrateDimensions ?? t.inspector.adjustSpans}</span>
                </Button>
              )}
            </div>
          ) : (
            roomSpans && (
              <div data-testid="target-room-spans" className="rounded-lg border border-border/80 bg-muted/20 p-2.5 space-y-1.5 text-xs">
                <span className="text-[11px] font-medium text-foreground block">
                  {locale === "zh" ? "房间开间进深跨度" : "Room Spans"}
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded border border-border/60 bg-background p-1.5">
                    <span className="text-[10px] text-muted-foreground block">{t.roomSpanEditor.widthAxis}</span>
                    <span className="font-mono font-semibold text-foreground">
                      {roomSpans.horizontal ? `${roomSpans.horizontal.spanMm} mm` : "—"}
                    </span>
                  </div>
                  <div className="rounded border border-border/60 bg-background p-1.5">
                    <span className="text-[10px] text-muted-foreground block">{t.roomSpanEditor.depthAxis}</span>
                    <span className="font-mono font-semibold text-foreground">
                      {roomSpans.vertical ? `${roomSpans.vertical.spanMm} mm` : "—"}
                    </span>
                  </div>
                </div>
                {onStartCalibration && (
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    data-testid="start-calibration-btn"
                    onClick={onStartCalibration}
                    className="w-full text-xs font-medium mt-1 gap-1.5"
                  >
                    <SlidersHorizontal className="h-3.5 w-3.5 text-primary" />
                    <span>{t.workflow?.actions?.calibrateDimensions ?? t.inspector.adjustSpans}</span>
                  </Button>
                )}
              </div>
            )
          )}

          <div className="space-y-1 text-xs">
            <span className="text-[10px] text-muted-foreground">
              {locale === "zh" ? `围合墙体 (${selectedRoom.room.boundaryWallIds.length})` : `Boundary Walls (${selectedRoom.room.boundaryWallIds.length})`}
            </span>
            <div className="flex flex-wrap gap-1">
              {selectedRoom.room.boundaryWallIds.map((wid) => (
                <Badge key={wid} variant="secondary" className="font-mono text-[10px]">
                  {wid}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. Opening Inspection */}
      {selectedOpening && (
        <div data-testid="inspector-opening-details" className="space-y-3">
          <div className="space-y-1">
            <span className="text-[11px] text-muted-foreground">{t.inspector.openingType}</span>
            <p className="font-semibold text-sm text-foreground capitalize">
              {selectedOpening.opening.type === "door"
                ? t.inspector.door
                : selectedOpening.opening.type === "window"
                  ? t.inspector.window
                  : selectedOpening.opening.type.replace("_", " ")}
            </p>
          </div>

          {isDraftMode || allowSpanEdit ? (
            <div className="pt-1">
              <OpeningEditor
                plan={plan}
                openingId={selectedOpening.opening.id}
                onUpdatePlan={onUpdatePlan}
                locale={locale}
              />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-lg border border-border/80 bg-muted/30 p-2">
                <span className="text-[10px] text-muted-foreground block">{t.inspector.openingWidth}</span>
                <span className="font-mono font-semibold text-foreground">
                  {selectedOpening.opening.width} mm
                </span>
              </div>
              <div className="rounded-lg border border-border/80 bg-muted/30 p-2">
                <span className="text-[10px] text-muted-foreground block">{t.inspector.openingPosition}</span>
                <span className="font-mono font-semibold text-foreground">
                  {(selectedOpening.opening.position * 100).toFixed(0)}%
                </span>
              </div>
              <div className="rounded-lg border border-border/80 bg-muted/30 p-2">
                <span className="text-[10px] text-muted-foreground block">{locale === "zh" ? "附着墙体" : "Attached Wall"}</span>
                <span className="font-mono font-semibold text-foreground">
                  {selectedOpening.opening.wallId}
                </span>
              </div>
              <div className="rounded-lg border border-border/80 bg-muted/30 p-2">
                <span className="text-[10px] text-muted-foreground block">{t.inspector.openingHeight}</span>
                <span className="font-mono font-semibold text-foreground">
                  {selectedOpening.opening.height ? `${selectedOpening.opening.height} mm` : "—"}
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. Furniture Inspection */}
      {selectedFurniture && (
        <div data-testid="inspector-furniture-details" className="space-y-3">
          {isDraftMode || allowSpanEdit ? (
            <FurnitureEditor
              plan={plan}
              furnitureId={selectedFurniture.id}
              onUpdatePlan={onUpdatePlan}
              onSelect={onSelect}
              locale={locale}
            />
          ) : (
            <>
              <div className="space-y-1">
                <span className="text-[11px] text-muted-foreground">{t.inspector.furnitureItem}</span>
                <p className="font-semibold text-sm text-foreground">
                  {i18n.getFurnitureName(selectedFurniture.definitionId, selectedFurniture.definitionId)}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-lg border border-border/80 bg-muted/30 p-2">
                  <span className="text-[10px] text-muted-foreground block">{t.inspector.furnitureDimensions}</span>
                  <span className="font-mono font-semibold text-foreground">
                    {selectedFurniture.width} × {selectedFurniture.depth} mm
                  </span>
                </div>
                <div className="rounded-lg border border-border/80 bg-muted/30 p-2">
                  <span className="text-[10px] text-muted-foreground block">{t.inspector.furnitureRotation}</span>
                  <span className="font-mono font-semibold text-foreground">
                    {selectedFurniture.rotation}°
                  </span>
                </div>
                <div className="rounded-lg border border-border/80 bg-muted/30 p-2 col-span-2">
                  <span className="text-[10px] text-muted-foreground block">{t.inspector.furniturePosition}</span>
                  <span className="font-mono font-semibold text-foreground">
                    X: {selectedFurniture.x} mm, Y: {selectedFurniture.y} mm
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* 5. Dimension Inspection */}
      {selectedDimension && (
        <div data-testid="inspector-dimension-details" className="space-y-3">
          <div className="space-y-1">
            <span className="text-[11px] text-muted-foreground">{locale === "zh" ? "主尺寸标注" : "Principal Dimension"}</span>
            <p className="font-semibold text-sm text-foreground">
              {selectedDimension.orientation === "horizontal"
                ? locale === "zh"
                  ? "总开间净宽"
                  : "Total Plan Width"
                : locale === "zh"
                  ? "总进深净长"
                  : "Total Plan Height"}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="rounded-lg border border-border/80 bg-muted/30 p-2">
              <span className="text-[10px] text-muted-foreground block">{locale === "zh" ? "长度" : "Length"}</span>
              <span className="font-mono font-semibold text-foreground">
                {selectedDimension.valueMm} mm
              </span>
            </div>
            <div className="rounded-lg border border-border/80 bg-muted/30 p-2">
              <span className="text-[10px] text-muted-foreground block">{locale === "zh" ? "方向轴" : "Orientation"}</span>
              <span className="font-mono font-semibold text-foreground capitalize">
                {selectedDimension.orientation}
              </span>
            </div>
          </div>

          <div className="rounded-lg border border-border/70 bg-muted/20 p-2.5 text-xs text-muted-foreground space-y-1">
            <span className="font-medium text-foreground block">{locale === "zh" ? "空间微调建议" : "Spatial Adjustment Tip"}</span>
            <p className="leading-relaxed">
              {locale === "zh"
                ? "如需调整此项总尺寸，请在方案中选择任意房间，通过开间与进深微调工具移动墙体边界。"
                : "To adjust this dimension, select any room on the plan to adjust its boundary span using numeric wall translation."}
            </p>
          </div>
        </div>
      )}

      {/* 6. Default Plan Summary when no entity is selected */}
      {!selectedEntity && (
        <div data-testid="inspector-plan-summary" className="space-y-3 text-xs">
          <div className="flex items-center gap-1.5 text-muted-foreground pb-1">
            <Info className="h-3.5 w-3.5" />
            <span className="font-medium text-[11px]">{t.inspector.planSummaryTitle}</span>
          </div>

          <div className="rounded-xl border border-border/80 bg-muted/20 p-3 space-y-2">
            {isDraftMode ? (
              <div className="space-y-1">
                <span className="text-[11px] text-muted-foreground block font-medium">
                  {locale === "zh" ? "方案名称" : "Plan Name"}
                </span>
                <Input
                  data-testid="edit-plan-name-input"
                  value={plan.meta.name}
                  onChange={(e) => {
                    onUpdatePlan?.({
                      ...plan,
                      meta: {
                        ...plan.meta,
                        name: e.target.value,
                      },
                    });
                  }}
                  className="h-8 text-xs font-semibold bg-background"
                  placeholder={locale === "zh" ? "自定义方案名称" : "Custom Plan Name"}
                />
              </div>
            ) : (
              <div className="flex justify-between">
                <span className="text-muted-foreground">{locale === "zh" ? "方案名称" : "Plan Name"}</span>
                <span className="font-semibold text-foreground">{plan.meta.name}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t.inspector.totalArea}</span>
              <span className="font-mono font-semibold text-foreground">{totalArea.formattedAreaM2}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{locale === "zh" ? "设计单位" : "Contract Unit"}</span>
              <span className="font-mono text-foreground">{plan.unit}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{locale === "zh" ? "数据规范版本" : "Contract Version"}</span>
              <span className="font-mono text-foreground">v{plan.version}</span>
            </div>
          </div>

          <div className="pt-1 space-y-2">
            {showFurniturePalette ? (
              <div className="rounded-xl border border-border bg-muted/20 p-3 space-y-3 animate-in fade-in-50">
                <div className="flex items-center justify-between pb-1 border-b border-border/60">
                  <div className="flex items-center gap-1.5 font-semibold text-foreground text-xs">
                    <Armchair className="h-3.5 w-3.5 text-primary" />
                    <span>{t.furniturePalette.title}</span>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    data-testid="close-furniture-palette-btn"
                    onClick={() => setShowFurniturePalette(false)}
                    className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                    title={t.actions.close}
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <FurnitureCatalogPalette
                  plan={plan}
                  onUpdatePlan={onUpdatePlan}
                  onSelect={(entity) => {
                    onSelect(entity);
                    setShowFurniturePalette(false);
                  }}
                  onClose={() => setShowFurniturePalette(false)}
                  locale={locale}
                />
              </div>
            ) : (
              <Button
                type="button"
                size="sm"
                variant="outline"
                data-testid="add-furniture-btn"
                onClick={() => {
                  (onEnsureUserPlan ?? onStartCalibration)?.();
                  setShowFurniturePalette(true);
                }}
                className="w-full h-8 text-xs flex items-center justify-center gap-1.5"
              >
                <Plus className="h-3.5 w-3.5 text-primary" />
                <span>{t.actions.addFurniture}</span>
              </Button>
            )}
          </div>

          <div className="space-y-1.5 pt-1">
            <span className="text-[11px] text-muted-foreground block">{locale === "zh" ? "拓扑要素统计" : "Topology Elements"}</span>
            <div className="grid grid-cols-2 gap-1.5">
              <div className="flex items-center justify-between rounded-lg border border-border/60 p-2 bg-background">
                <span className="text-muted-foreground">{t.inspector.roomCount}</span>
                <span className="font-mono font-semibold text-foreground">{plan.rooms.length}</span>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border/60 p-2 bg-background">
                <span className="text-muted-foreground">{t.inspector.wallCount}</span>
                <span className="font-mono font-semibold text-foreground">{plan.walls.length}</span>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border/60 p-2 bg-background">
                <span className="text-muted-foreground">{t.inspector.openingCount}</span>
                <span className="font-mono font-semibold text-foreground">{plan.openings.length}</span>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border/60 p-2 bg-background">
                <span className="text-muted-foreground">{t.inspector.furnitureCount}</span>
                <span className="font-mono font-semibold text-foreground">{plan.furniture.length}</span>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-muted-foreground/80 pt-2 leading-relaxed">
            {t.inspector.noSelectionDesc}
          </p>
        </div>
      )}
    </div>
  );
}
