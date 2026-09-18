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
import type { EntitySelectHandler, SelectedEntity } from "./types";

interface FloorPlanInspectorProps {
  plan: FloorPlan;
  isDraftMode?: boolean;
  onUpdatePlan?: (updated: FloorPlan) => void;
  selectedEntity: SelectedEntity | null;
  onSelect: EntitySelectHandler;
  className?: string;
}

export function FloorPlanInspector({
  plan,
  isDraftMode = false,
  onUpdatePlan,
  selectedEntity,
  onSelect,
  className = "",
}: FloorPlanInspectorProps) {
  const vertexMap = React.useMemo(() => getVertexMap(plan), [plan]);
  const wallMap = React.useMemo(() => getWallMap(plan), [plan]);
  const totalArea = React.useMemo(() => computePlanTotalArea(plan), [plan]);

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
      {selectedEntity && (
        <div className="flex items-center justify-between pb-2 border-b border-border">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-xs text-foreground uppercase tracking-wider">
              Entity Inspector
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
            title="Deselect entity"
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      )}

      {/* 1. Wall Inspection */}
      {selectedWall && (
        <div data-testid="inspector-wall-details" className="space-y-3">
          <div className="space-y-1">
            <span className="text-[11px] text-muted-foreground">Wall ID</span>
            <p className="font-mono text-xs font-semibold text-foreground">
              {selectedWall.wall.id}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="rounded-lg border border-border/80 bg-muted/30 p-2">
              <span className="text-[10px] text-muted-foreground block">Length</span>
              <span className="font-mono font-semibold text-foreground">
                {selectedWall.geom?.length ?? "—"} mm
              </span>
            </div>
            <div className="rounded-lg border border-border/80 bg-muted/30 p-2">
              <span className="text-[10px] text-muted-foreground block">Thickness</span>
              <span className="font-mono font-semibold text-foreground">
                {selectedWall.wall.thickness} mm
              </span>
            </div>
            <div className="rounded-lg border border-border/80 bg-muted/30 p-2">
              <span className="text-[10px] text-muted-foreground block">Lock Axis</span>
              <span className="font-mono font-semibold text-foreground capitalize">
                {selectedWall.wall.lockAxis}
              </span>
            </div>
            <div className="rounded-lg border border-border/80 bg-muted/30 p-2">
              <span className="text-[10px] text-muted-foreground block">Angle</span>
              <span className="font-mono font-semibold text-foreground">
                {selectedWall.geom ? Math.round(selectedWall.geom.angleDeg) : 0}°
              </span>
            </div>
          </div>

          <div className="space-y-1 text-xs">
            <span className="text-[10px] text-muted-foreground">Topology Endpoints</span>
            <p className="font-mono text-[11px] text-foreground/80">
              {selectedWall.wall.from} → {selectedWall.wall.to}
            </p>
          </div>

          {boundedRooms.length > 0 && (
            <div className="space-y-1.5 text-xs pt-1 border-t border-border/60">
              <span className="text-[10px] text-muted-foreground block">
                Boundary of Room{boundedRooms.length > 1 ? "s" : ""}
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
                    <span>{r.name ?? r.type}</span>
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
            <span className="text-[11px] text-muted-foreground">Room Name</span>
            <p className="font-semibold text-sm text-foreground">
              {selectedRoom.room.name ?? selectedRoom.room.type}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="rounded-lg border border-border/80 bg-muted/30 p-2">
              <span className="text-[10px] text-muted-foreground block">Area</span>
              <span className="font-mono font-semibold text-foreground">
                {selectedRoom.area.formattedAreaM2}
              </span>
            </div>
            <div className="rounded-lg border border-border/80 bg-muted/30 p-2">
              <span className="text-[10px] text-muted-foreground block">Room Type</span>
              <span className="font-mono font-semibold text-foreground capitalize">
                {selectedRoom.room.type.replace("_", " ")}
              </span>
            </div>
          </div>

          {/* Room Spans Overview (Read-Only) or Interactive Room Span Editor (Draft Mode) */}
          {isDraftMode ? (
            <div className="pt-1">
              <RoomSpanEditor
                plan={plan}
                roomId={selectedRoom.room.id}
                onUpdatePlan={onUpdatePlan}
              />
            </div>
          ) : (
            roomSpans && (
              <div className="rounded-lg border border-border/80 bg-muted/20 p-2.5 space-y-1.5 text-xs">
                <span className="text-[11px] font-medium text-foreground block">
                  Room Spans
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded border border-border/60 bg-background p-1.5">
                    <span className="text-[10px] text-muted-foreground block">Width (X)</span>
                    <span className="font-mono font-semibold text-foreground">
                      {roomSpans.horizontal ? `${roomSpans.horizontal.spanMm} mm` : "—"}
                    </span>
                  </div>
                  <div className="rounded border border-border/60 bg-background p-1.5">
                    <span className="text-[10px] text-muted-foreground block">Depth (Y)</span>
                    <span className="font-mono font-semibold text-foreground">
                      {roomSpans.vertical ? `${roomSpans.vertical.spanMm} mm` : "—"}
                    </span>
                  </div>
                </div>
              </div>
            )
          )}

          <div className="space-y-1 text-xs">
            <span className="text-[10px] text-muted-foreground">Boundary Walls ({selectedRoom.room.boundaryWallIds.length})</span>
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
            <span className="text-[11px] text-muted-foreground">Opening Type</span>
            <p className="font-semibold text-sm text-foreground capitalize">
              {selectedOpening.opening.type.replace("_", " ")}
            </p>
          </div>

          {isDraftMode ? (
            <div className="pt-1">
              <OpeningEditor
                plan={plan}
                openingId={selectedOpening.opening.id}
                onUpdatePlan={onUpdatePlan}
              />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-lg border border-border/80 bg-muted/30 p-2">
                <span className="text-[10px] text-muted-foreground block">Width</span>
                <span className="font-mono font-semibold text-foreground">
                  {selectedOpening.opening.width} mm
                </span>
              </div>
              <div className="rounded-lg border border-border/80 bg-muted/30 p-2">
                <span className="text-[10px] text-muted-foreground block">Position</span>
                <span className="font-mono font-semibold text-foreground">
                  {(selectedOpening.opening.position * 100).toFixed(0)}%
                </span>
              </div>
              <div className="rounded-lg border border-border/80 bg-muted/30 p-2">
                <span className="text-[10px] text-muted-foreground block">Attached Wall</span>
                <span className="font-mono font-semibold text-foreground">
                  {selectedOpening.opening.wallId}
                </span>
              </div>
              <div className="rounded-lg border border-border/80 bg-muted/30 p-2">
                <span className="text-[10px] text-muted-foreground block">Height</span>
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
          <div className="space-y-1">
            <span className="text-[11px] text-muted-foreground">Furniture Item</span>
            <p className="font-semibold text-sm text-foreground">
              {selectedFurniture.definitionId}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="rounded-lg border border-border/80 bg-muted/30 p-2">
              <span className="text-[10px] text-muted-foreground block">Size (W × D)</span>
              <span className="font-mono font-semibold text-foreground">
                {selectedFurniture.width} × {selectedFurniture.depth} mm
              </span>
            </div>
            <div className="rounded-lg border border-border/80 bg-muted/30 p-2">
              <span className="text-[10px] text-muted-foreground block">Rotation</span>
              <span className="font-mono font-semibold text-foreground">
                {selectedFurniture.rotation}°
              </span>
            </div>
            <div className="rounded-lg border border-border/80 bg-muted/30 p-2 col-span-2">
              <span className="text-[10px] text-muted-foreground block">Coordinates</span>
              <span className="font-mono font-semibold text-foreground">
                X: {selectedFurniture.x} mm, Y: {selectedFurniture.y} mm
              </span>
            </div>
          </div>

          {isDraftMode && (
            <div className="flex items-center gap-2 pt-2">
              <Button
                type="button"
                size="sm"
                variant="outline"
                data-testid="rotate-furniture-btn"
                onClick={() => {
                  const nextRot = ((selectedFurniture.rotation || 0) + 90) % 360;
                  const updatedFurniture = plan.furniture.map((f) =>
                    f.id === selectedFurniture.id ? { ...f, rotation: nextRot } : f,
                  );
                  onUpdatePlan?.({
                    ...plan,
                    furniture: updatedFurniture,
                  });
                }}
                className="flex-1 h-8 text-xs flex items-center justify-center gap-1.5"
              >
                <RotateCw className="h-3.5 w-3.5 text-primary" />
                <span>Rotate 90°</span>
              </Button>

              <Button
                type="button"
                size="sm"
                variant="destructive"
                data-testid="delete-furniture-btn"
                onClick={() => {
                  const updatedFurniture = plan.furniture.filter(
                    (f) => f.id !== selectedFurniture.id,
                  );
                  onSelect(null);
                  onUpdatePlan?.({
                    ...plan,
                    furniture: updatedFurniture,
                  });
                }}
                className="h-8 px-2.5 text-xs flex items-center justify-center gap-1"
                title="Delete furniture item"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Delete</span>
              </Button>
            </div>
          )}
        </div>
      )}

      {/* 5. Dimension Inspection */}
      {selectedDimension && (
        <div data-testid="inspector-dimension-details" className="space-y-3">
          <div className="space-y-1">
            <span className="text-[11px] text-muted-foreground">Principal Dimension</span>
            <p className="font-semibold text-sm text-foreground">
              {selectedDimension.orientation === "horizontal" ? "Total Plan Width" : "Total Plan Height"}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="rounded-lg border border-border/80 bg-muted/30 p-2">
              <span className="text-[10px] text-muted-foreground block">Length</span>
              <span className="font-mono font-semibold text-foreground">
                {selectedDimension.valueMm} mm
              </span>
            </div>
            <div className="rounded-lg border border-border/80 bg-muted/30 p-2">
              <span className="text-[10px] text-muted-foreground block">Orientation</span>
              <span className="font-mono font-semibold text-foreground capitalize">
                {selectedDimension.orientation}
              </span>
            </div>
          </div>

          <div className="rounded-lg border border-border/70 bg-muted/20 p-2.5 text-xs text-muted-foreground space-y-1">
            <span className="font-medium text-foreground block">Spatial Adjustment Tip</span>
            <p className="leading-relaxed">
              To adjust this dimension, select any room on the plan to adjust its boundary span using numeric wall translation.
            </p>
          </div>
        </div>
      )}

      {/* 6. Default Plan Summary when no entity is selected */}
      {!selectedEntity && (
        <div data-testid="inspector-plan-summary" className="space-y-3 text-xs">
          <div className="flex items-center gap-1.5 text-muted-foreground pb-1">
            <Info className="h-3.5 w-3.5" />
            <span className="font-medium text-[11px]">Plan Overview</span>
          </div>

          <div className="rounded-xl border border-border/80 bg-muted/20 p-3 space-y-2">
            {isDraftMode ? (
              <div className="space-y-1">
                <span className="text-[11px] text-muted-foreground block font-medium">
                  Plan Name
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
                  placeholder="Custom Plan Name"
                />
              </div>
            ) : (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Plan Name</span>
                <span className="font-semibold text-foreground">{plan.meta.name}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Area</span>
              <span className="font-mono font-semibold text-foreground">{totalArea.formattedAreaM2}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Contract Unit</span>
              <span className="font-mono text-foreground">{plan.unit}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Contract Version</span>
              <span className="font-mono text-foreground">v{plan.version}</span>
            </div>
          </div>

          {isDraftMode && (
            <div className="pt-1">
              <Button
                type="button"
                size="sm"
                variant="outline"
                data-testid="add-furniture-btn"
                onClick={() => {
                  const newId = `f-custom-${Date.now()}`;
                  const newFurniture = {
                    id: newId,
                    definitionId: "chair-arm",
                    x: 2000,
                    y: 2000,
                    width: 800,
                    depth: 800,
                    rotation: 0,
                  };
                  onUpdatePlan?.({
                    ...plan,
                    furniture: [...plan.furniture, newFurniture],
                  });
                  onSelect({ type: "furniture", id: newId });
                }}
                className="w-full h-8 text-xs flex items-center justify-center gap-1.5"
              >
                <Plus className="h-3.5 w-3.5 text-primary" />
                <span>Add Furniture</span>
              </Button>
            </div>
          )}

          <div className="space-y-1.5 pt-1">
            <span className="text-[11px] text-muted-foreground block">Topology Elements</span>
            <div className="grid grid-cols-2 gap-1.5">
              <div className="flex items-center justify-between rounded-lg border border-border/60 p-2 bg-background">
                <span className="text-muted-foreground">Rooms</span>
                <span className="font-mono font-semibold text-foreground">{plan.rooms.length}</span>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border/60 p-2 bg-background">
                <span className="text-muted-foreground">Walls</span>
                <span className="font-mono font-semibold text-foreground">{plan.walls.length}</span>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border/60 p-2 bg-background">
                <span className="text-muted-foreground">Openings</span>
                <span className="font-mono font-semibold text-foreground">{plan.openings.length}</span>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border/60 p-2 bg-background">
                <span className="text-muted-foreground">Furniture</span>
                <span className="font-mono font-semibold text-foreground">{plan.furniture.length}</span>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-muted-foreground/80 pt-2 leading-relaxed">
            Click any wall, room, door, window, or furniture on the canvas to inspect its real-world dimensions and coordinates.
          </p>
        </div>
      )}
    </div>
  );
}
