"use client";

import * as React from "react";
import { Maximize2, Minus, Plus, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { FloorPlan } from "@/lib/floor-plan";
import {
  computeFloorPlanBounds,
  computePrincipalDimensions,
  getVertexMap,
  getWallMap,
} from "@/lib/floor-plan/geometry";
import {
  calculateFitToView,
  clampZoom,
  DEFAULT_VIEW_TRANSFORM,
  type ViewTransform,
  zoomByFactor,
} from "@/lib/floor-plan/view-transform";
import type { EntitySelectHandler, SelectedEntity } from "./types";
import { moveFurnitureInstance, rotateFurnitureInstance } from "@/lib/floor-plan/furniture-operations";
import {
  computeFurnitureClearanceZones,
  computeOpeningKeepClearZone,
  evaluatePlanRules,
  type RuleResult,
} from "@/lib/floor-plan/rules";
import { SvgDimension } from "./svg/svg-dimension";
import { SvgFurniture } from "./svg/svg-furniture";
import { SvgOpening } from "./svg/svg-opening";
import { SvgRoom } from "./svg/svg-room";
import { SvgWall } from "./svg/svg-wall";
import { useFloorPlanI18n } from "@/lib/floor-plan/i18n";

interface FloorPlanSvgViewerProps {
  locale?: string;
  plan: FloorPlan;
  selectedEntity: SelectedEntity | null;
  targetRoomId?: string | null;
  onSelect: EntitySelectHandler;
  isDraftMode?: boolean;
  onUpdatePlan?: (updated: FloorPlan, description?: string) => void;
  violations?: RuleResult[];
  canvasMode?: "pan" | "edit";
  className?: string;
}

export function FloorPlanSvgViewer({
  locale,
  plan,
  selectedEntity,
  targetRoomId,
  onSelect,
  isDraftMode = false,
  onUpdatePlan,
  violations: propViolations,
  canvasMode = "edit",
  className = "",
}: FloorPlanSvgViewerProps) {
  const i18n = useFloorPlanI18n(locale);
  const t = i18n.t.svgViewer;

  const containerRef = React.useRef<HTMLDivElement>(null);
  const [viewportSize, setViewportSize] = React.useState({ width: 800, height: 600 });
  const [transform, setTransform] = React.useState<ViewTransform>(DEFAULT_VIEW_TRANSFORM);
  const [isDragging, setIsDragging] = React.useState(false);
  const dragStartRef = React.useRef({ x: 0, y: 0 });
  const initialPanRef = React.useRef({ panX: 0, panY: 0 });
  const isPointerDownRef = React.useRef(false);

  const [draggingFurniture, setDraggingFurniture] = React.useState<{
    id: string;
    startX: number;
    startY: number;
    initialX: number;
    initialY: number;
    currentX: number;
    currentY: number;
  } | null>(null);

  const vertexMap = React.useMemo(() => getVertexMap(plan), [plan]);
  const wallMap = React.useMemo(() => getWallMap(plan), [plan]);
  const bounds = React.useMemo(() => computeFloorPlanBounds(plan), [plan]);
  const dimensions = React.useMemo(() => computePrincipalDimensions(plan), [plan]);

  const evaluatedViolations = React.useMemo(
    () => propViolations ?? evaluatePlanRules(plan),
    [propViolations, plan],
  );

  const violationFurnitureIds = React.useMemo(() => {
    const set = new Set<string>();
    for (const v of evaluatedViolations) {
      for (const entityId of v.relatedEntityIds) {
        if (plan.furniture.some((f) => f.id === entityId)) {
          set.add(entityId);
        }
      }
    }
    return set;
  }, [evaluatedViolations, plan.furniture]);

  const openingViolationIds = React.useMemo(() => {
    const set = new Set<string>();
    for (const v of evaluatedViolations) {
      if (v.ruleId === "opening-keep-clear") {
        for (const entityId of v.relatedEntityIds) {
          if (plan.openings.some((o) => o.id === entityId)) {
            set.add(entityId);
          }
        }
      }
    }
    return set;
  }, [evaluatedViolations, plan.openings]);

  const furnitureClearanceViolationIds = React.useMemo(() => {
    const set = new Set<string>();
    for (const v of evaluatedViolations) {
      if (v.ruleId === "furniture-clearance" || v.ruleId === "local-passage") {
        for (const entityId of v.relatedEntityIds) {
          if (plan.furniture.some((f) => f.id === entityId)) {
            set.add(entityId);
          }
        }
      }
    }
    return set;
  }, [evaluatedViolations, plan.furniture]);

  // Fit to view helper
  const fitToView = React.useCallback(
    (width: number, height: number) => {
      const fitted = calculateFitToView(bounds, width, height, 0.15);
      setTransform(fitted);
    },
    [bounds],
  );

  // Measure container and auto-fit on plan change or container resize
  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) {
          setViewportSize({ width, height });
          fitToView(width, height);
        }
      }
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, [fitToView]);

  // Wheel zoom handler with passive: false to prevent document scroll
  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const rect = container.getBoundingClientRect();
      const anchor = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
      const factor = e.deltaY < 0 ? 1.15 : 1 / 1.15;
      setTransform((prev) => zoomByFactor(prev, factor, anchor));
    };

    container.addEventListener("wheel", onWheel, { passive: false });
    return () => container.removeEventListener("wheel", onWheel);
  }, []);

  const handleFurnitureDragStart = (
    e: React.PointerEvent,
    furniture: FloorPlan["furniture"][number],
  ) => {
    if (!isDraftMode || canvasMode === "pan") return;
    setDraggingFurniture({
      id: furniture.id,
      startX: e.clientX,
      startY: e.clientY,
      initialX: furniture.x,
      initialY: furniture.y,
      currentX: furniture.x,
      currentY: furniture.y,
    });
  };

  const handleRotateFurniture = (furnitureId: string, stepDeg: number = 90) => {
    if (!isDraftMode || !onUpdatePlan) return;
    const res = rotateFurnitureInstance(plan, furnitureId, stepDeg);
    if (res.success) {
      onUpdatePlan(res.plan, "Rotate furniture");
    }
  };

  const hasMovedRef = React.useRef(false);

  // Pan interaction handlers
  const handlePointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    if (e.button !== 0) return; // Only primary button
    isPointerDownRef.current = true;
    hasMovedRef.current = false;
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    initialPanRef.current = { panX: transform.panX, panY: transform.panY };
  };

  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (draggingFurniture) {
      const deltaX = (e.clientX - draggingFurniture.startX) / transform.scale;
      const deltaY = (e.clientY - draggingFurniture.startY) / transform.scale;
      const nextX = Math.round(draggingFurniture.initialX + deltaX);
      const nextY = Math.round(draggingFurniture.initialY + deltaY);
      setDraggingFurniture((prev) => (prev ? { ...prev, currentX: nextX, currentY: nextY } : null));
      return;
    }

    if (!isPointerDownRef.current) return;
    const deltaX = e.clientX - dragStartRef.current.x;
    const deltaY = e.clientY - dragStartRef.current.y;

    if (!hasMovedRef.current && Math.hypot(deltaX, deltaY) > 4) {
      hasMovedRef.current = true;
      setIsDragging(true);
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {
        // Ignore if pointer capture fails
      }
    }

    if (hasMovedRef.current) {
      setTransform((prev) => ({
        ...prev,
        panX: initialPanRef.current.panX + deltaX,
        panY: initialPanRef.current.panY + deltaY,
      }));
    }
  };

  const handlePointerUp = (e: React.PointerEvent<SVGSVGElement>) => {
    if (draggingFurniture) {
      const moved = Math.hypot(
        draggingFurniture.currentX - draggingFurniture.initialX,
        draggingFurniture.currentY - draggingFurniture.initialY,
      ) > 5;
      if (moved && onUpdatePlan) {
        const res = moveFurnitureInstance(
          plan,
          draggingFurniture.id,
          draggingFurniture.currentX,
          draggingFurniture.currentY,
        );
        if (res.success) {
          onUpdatePlan(res.plan, "Move furniture");
        }
      }
      setDraggingFurniture(null);
    }

    isPointerDownRef.current = false;
    if (hasMovedRef.current) {
      setIsDragging(false);
      try {
        if (e.currentTarget.hasPointerCapture(e.pointerId)) {
          e.currentTarget.releasePointerCapture(e.pointerId);
        }
      } catch {
        // Ignore if pointer capture already released
      }
    }
  };

  // Zoom button controls
  const handleZoomIn = () => {
    const anchor = { x: viewportSize.width / 2, y: viewportSize.height / 2 };
    setTransform((prev) => zoomByFactor(prev, 1.25, anchor));
  };

  const handleZoomOut = () => {
    const anchor = { x: viewportSize.width / 2, y: viewportSize.height / 2 };
    setTransform((prev) => zoomByFactor(prev, 1 / 1.25, anchor));
  };

  const handleResetZoom = () => {
    fitToView(viewportSize.width, viewportSize.height);
  };

  const displayZoomPercentage = Math.round(transform.scale * 1000);

  const handleSelect = React.useCallback<EntitySelectHandler>(
    (entity) => {
      if (canvasMode === "pan") return;
      onSelect(entity);
    },
    [canvasMode, onSelect],
  );

  return (
    <div
      ref={containerRef}
      data-testid="floor-plan-viewer-surface"
      className={`relative w-full h-full min-h-[400px] overflow-hidden bg-slate-50/60 dark:bg-slate-950/60 select-none ${className}`}
    >
      {/* Interactive SVG Canvas */}
      <svg
        data-testid="floor-plan-svg-canvas"
        className={`w-full h-full block touch-none ${
          isDragging ? "cursor-grabbing" : canvasMode === "pan" ? "cursor-grab" : "cursor-default"
        }`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onClick={(e) => {
          // Deselect when clicking canvas background
          if (e.target === e.currentTarget) {
            handleSelect(null);
          }
        }}
      >
        <defs>
          {/* Subtle architectural background grid */}
          <pattern
            id="plan-grid-subtle"
            width="500"
            height="500"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 500 0 L 0 0 0 500"
              fill="none"
              stroke="rgba(148, 163, 184, 0.12)"
              strokeWidth="2"
            />
          </pattern>
        </defs>

        {/* Global canvas background rectangle to capture clicks */}
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="transparent"
          onClick={() => handleSelect(null)}
        />

        {/* World transform container */}
        <g
          data-testid="floor-plan-world"
          transform={`translate(${transform.panX}, ${transform.panY}) scale(${transform.scale})`}
        >
          {/* Grid background behind the plan */}
          <rect
            x={bounds.minX - 3000}
            y={bounds.minY - 3000}
            width={bounds.width + 6000}
            height={bounds.height + 6000}
            fill="url(#plan-grid-subtle)"
            className="pointer-events-none"
          />

          {/* 1. Ordered Room Boundaries Layer */}
          <g
            data-testid="floor-plan-rooms-layer"
            className={canvasMode === "pan" ? "pointer-events-none" : undefined}
          >
            {plan.rooms.map((room) => (
              <SvgRoom
                key={room.id}
                room={room}
                wallMap={wallMap}
                vertexMap={vertexMap}
                selectedEntity={selectedEntity}
                targetRoomId={targetRoomId}
                onSelect={handleSelect}
              />
            ))}
          </g>

          {/* 2. Walls Layer */}
          <g
            data-testid="floor-plan-walls-layer"
            className={canvasMode === "pan" ? "pointer-events-none" : undefined}
          >
            {plan.walls.map((wall) => (
              <SvgWall
                key={wall.id}
                wall={wall}
                vertexMap={vertexMap}
                selectedEntity={selectedEntity}
                onSelect={handleSelect}
              />
            ))}
          </g>

          {/* Clearance & Keep-Clear Overlays Layer (AC-13) */}
          <g data-testid="floor-plan-clearance-layer" className="pointer-events-none select-none">
            {/* Door Keep-Clear Overlays */}
            {plan.openings.map((op) => {
              if (op.type !== "door") return null;
              const wall = wallMap.get(op.wallId);
              if (!wall) return null;

              const isSelected = selectedEntity?.type === "opening" && selectedEntity.id === op.id;
              const hasViolation = openingViolationIds.has(op.id);

              if (!isSelected && !hasViolation) return null;

              const zone = computeOpeningKeepClearZone(op, wall, vertexMap);
              if (!zone) return null;

              const sideAStr = zone.sideAPoints.map((p) => `${p.x},${p.y}`).join(" ");
              const sideBStr = zone.sideBPoints.map((p) => `${p.x},${p.y}`).join(" ");

              const strokeColor = hasViolation ? "#f59e0b" : "#3b82f6";
              const fillColor = hasViolation ? "rgba(245, 158, 11, 0.12)" : "rgba(59, 130, 246, 0.08)";

              return (
                <g
                  key={`clearance-door-${op.id}`}
                  data-testid={`opening-clearance-overlay-${op.id}`}
                  data-violation={hasViolation ? "true" : "false"}
                >
                  <polygon
                    points={sideAStr}
                    fill={fillColor}
                    stroke={strokeColor}
                    strokeWidth={14}
                    strokeDasharray="40 20"
                  />
                  <polygon
                    points={sideBStr}
                    fill={fillColor}
                    stroke={strokeColor}
                    strokeWidth={14}
                    strokeDasharray="40 20"
                  />
                </g>
              );
            })}

            {/* Furniture Clearance Overlays */}
            {plan.furniture.map((f) => {
              const isSelected = selectedEntity?.type === "furniture" && selectedEntity.id === f.id;
              const hasViolation = furnitureClearanceViolationIds.has(f.id);

              if (!isSelected && !hasViolation) return null;

              const renderedFurniture =
                draggingFurniture?.id === f.id
                  ? {
                      ...f,
                      x: draggingFurniture.currentX,
                      y: draggingFurniture.currentY,
                    }
                  : f;

              const zones = computeFurnitureClearanceZones(renderedFurniture);
              if (zones.length === 0) return null;

              const strokeColor = hasViolation ? "#f59e0b" : "#3b82f6";
              const fillColor = hasViolation ? "rgba(245, 158, 11, 0.12)" : "rgba(59, 130, 246, 0.08)";

              return (
                <g
                  key={`clearance-furniture-${f.id}`}
                  data-testid={`furniture-clearance-overlay-${f.id}`}
                  data-violation={hasViolation ? "true" : "false"}
                >
                  {zones.map((zone, zIdx) => {
                    const pointsStr = zone.zonePolygon.map((p) => `${p.x},${p.y}`).join(" ");
                    return (
                      <polygon
                        key={`${f.id}-zone-${zone.side}-${zIdx}`}
                        data-clearance-side={zone.side}
                        points={pointsStr}
                        fill={fillColor}
                        stroke={strokeColor}
                        strokeWidth={14}
                        strokeDasharray="40 20"
                      />
                    );
                  })}
                </g>
              );
            })}
          </g>

          {/* 3. Openings Layer */}
          <g
            data-testid="floor-plan-openings-layer"
            className={canvasMode === "pan" ? "pointer-events-none" : undefined}
          >
            {plan.openings.map((op) => {
              const wall = wallMap.get(op.wallId);
              if (!wall) return null;
              return (
                <SvgOpening
                  key={op.id}
                  opening={op}
                  wall={wall}
                  vertexMap={vertexMap}
                  selectedEntity={selectedEntity}
                  onSelect={handleSelect}
                />
              );
            })}
          </g>

          {/* 4. Furniture Layer */}
          <g
            data-testid="floor-plan-furniture-layer"
            className={canvasMode === "pan" ? "pointer-events-none" : undefined}
          >
            {plan.furniture.map((f) => {
              const renderedFurniture =
                draggingFurniture?.id === f.id
                  ? {
                      ...f,
                      x: draggingFurniture.currentX,
                      y: draggingFurniture.currentY,
                    }
                  : f;
              return (
                <SvgFurniture
                  key={f.id}
                  furniture={renderedFurniture}
                  selectedEntity={selectedEntity}
                  onSelect={handleSelect}
                  isDraftMode={isDraftMode}
                  onRotate={handleRotateFurniture}
                  onDragStart={handleFurnitureDragStart}
                  hasViolation={violationFurnitureIds.has(f.id)}
                />
              );
            })}
          </g>

          {/* 5. Principal Dimensions Layer */}
          <g
            data-testid="floor-plan-dimensions-layer"
            className={canvasMode === "pan" ? "pointer-events-none" : undefined}
          >
            {dimensions.map((dim) => (
              <SvgDimension
                key={dim.id}
                dimension={dim}
                selectedEntity={selectedEntity}
                onSelect={handleSelect}
              />
            ))}
          </g>
        </g>
      </svg>

      {/* Floating Canvas Controls Overlay */}
      <div
        data-testid="floor-plan-viewer-controls"
        className="absolute bottom-4 right-4 z-10 flex items-center gap-1.5 rounded-xl border border-border bg-card/90 p-1.5 shadow-md backdrop-blur-md"
      >
        <Button
          type="button"
          size="sm"
          variant="outline"
          aria-label={t.zoomIn}
          title={t.zoomIn}
          onClick={handleZoomIn}
          className="h-11 w-11 min-h-[44px] min-w-[44px] lg:h-8 lg:w-8 lg:min-h-0 lg:min-w-0 p-0 touch-manipulation"
        >
          <Plus className="h-4 w-4" />
        </Button>

        <span
          data-testid="zoom-level-badge"
          className="min-w-14 text-center font-mono text-xs font-medium text-muted-foreground select-none"
        >
          {displayZoomPercentage}%
        </span>

        <Button
          type="button"
          size="sm"
          variant="outline"
          aria-label={t.zoomOut}
          title={t.zoomOut}
          onClick={handleZoomOut}
          className="h-11 w-11 min-h-[44px] min-w-[44px] lg:h-8 lg:w-8 lg:min-h-0 lg:min-w-0 p-0 touch-manipulation"
        >
          <Minus className="h-4 w-4" />
        </Button>

        <div className="mx-1 h-4 w-px bg-border" />

        <Button
          type="button"
          size="sm"
          variant="outline"
          aria-label={t.fitView}
          title={t.fitView}
          onClick={() => fitToView(viewportSize.width, viewportSize.height)}
          className="h-11 min-h-[44px] lg:h-8 lg:min-h-0 px-3 text-xs font-medium gap-1 touch-manipulation"
        >
          <Maximize2 className="h-3.5 w-3.5" />
          <span>{i18n.locale === "zh" ? "适屏" : "Fit"}</span>
        </Button>

        <Button
          type="button"
          size="sm"
          variant="ghost"
          aria-label={t.reset}
          title={t.reset}
          onClick={handleResetZoom}
          className="h-11 w-11 min-h-[44px] min-w-[44px] lg:h-8 lg:w-8 lg:min-h-0 lg:min-w-0 p-0 text-muted-foreground touch-manipulation"
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* Instructions / Status hint */}
      <div className="absolute top-3 left-3 z-10 hidden sm:flex items-center gap-2 rounded-lg bg-card/85 px-2.5 py-1 text-xs text-muted-foreground border border-border/70 backdrop-blur-xs pointer-events-none">
        <span className="font-medium text-foreground">{i18n.getPlanName(plan.meta.id || plan.meta.templateId || "", plan.meta.name)}</span>
        <span>•</span>
        <span>
          {i18n.locale === "zh"
            ? "拖拽平移画布，滚轮缩放，点击构件查看参数"
            : "Drag to pan, scroll to zoom, click entities to inspect"}
        </span>
      </div>
    </div>
  );
}
