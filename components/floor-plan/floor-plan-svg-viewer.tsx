"use client";

import * as React from "react";
import { Maximize2, Minus, Plus, Ruler } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { FloorPlan } from "@/lib/floor-plan";
import {
  computeFloorPlanBounds,
  computePlanFitBounds,
  computePrincipalDimensions,
  computeRoomPolygon,
  computeRoomSpanDimensions,
  getVertexMap,
  getWallMap,
} from "@/lib/floor-plan/geometry";
import {
  calculateFitToView,
  DEFAULT_VIEW_TRANSFORM,
  type ViewTransform,
  zoomByFactor,
} from "@/lib/floor-plan/view-transform";
import type { EntitySelectHandler, SelectedEntity } from "./types";
import { cn } from "@/lib/utils";
import { moveFurnitureInstance, rotateFurnitureInstance } from "@/lib/floor-plan/furniture-operations";
import {
  computeFurnitureClearanceZones,
  computeOpeningKeepClearZone,
  assessmentFromRuleResults,
  evaluatePlanRules,
  type RuleResult,
} from "@/lib/floor-plan/rules";
import { SvgDimension } from "./svg/svg-dimension";
import { SvgFurniture } from "./svg/svg-furniture";
import { SvgOpening } from "./svg/svg-opening";
import { SvgRoom } from "./svg/svg-room";
import { SvgWall } from "./svg/svg-wall";
import { useFloorPlanI18n } from "@/lib/floor-plan/i18n";
import {
  type CustomRoomWallSide,
  WALL_SIDE_TO_ID,
} from "@/lib/floor-plan/custom-room-openings";

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
  compact?: boolean;
  svgRef?: React.Ref<SVGSVGElement>;
  highlightWallSide?: CustomRoomWallSide | null;
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
  compact = false,
  svgRef,
  highlightWallSide = null,
}: FloorPlanSvgViewerProps) {
  const i18n = useFloorPlanI18n(locale);
  const t = i18n.t.svgViewer;

  const highlightWallId = highlightWallSide ? WALL_SIDE_TO_ID[highlightWallSide] : null;

  const measurementOrigin = React.useMemo(() => {
    if (!highlightWallSide) return null;
    const isZh = locale?.startsWith("zh") ?? true;
    const customRoom = plan.meta.customRoom ?? plan.rooms[0]?.customNetDimensions;
    if (!customRoom) return null;
    const { widthMm: roomW, depthMm: roomD } = customRoom;

    if (highlightWallSide === "top") {
      return {
        x: 0,
        y: 0,
        textX: 80,
        textY: -35,
        textAnchor: "start" as const,
        label: isZh ? "起点 (0 mm) →" : "Origin (0 mm) →",
      };
    }
    if (highlightWallSide === "bottom") {
      return {
        x: 0,
        y: roomD,
        textX: 80,
        textY: roomD + 120,
        textAnchor: "start" as const,
        label: isZh ? "起点 (0 mm) →" : "Origin (0 mm) →",
      };
    }
    if (highlightWallSide === "right") {
      return {
        x: roomW,
        y: 0,
        textX: roomW + 70,
        textY: 80,
        textAnchor: "start" as const,
        label: isZh ? "起点 (0 mm) ↓" : "Origin (0 mm) ↓",
      };
    }
    if (highlightWallSide === "left") {
      return {
        x: 0,
        y: 0,
        textX: -70,
        textY: 80,
        textAnchor: "end" as const,
        label: isZh ? "起点 (0 mm) ↓" : "Origin (0 mm) ↓",
      };
    }
    return null;
  }, [highlightWallSide, plan.meta.customRoom, plan.rooms, locale]);

  const containerRef = React.useRef<HTMLDivElement>(null);
  const [viewportSize, setViewportSize] = React.useState({ width: 800, height: 600 });
  const [transform, setTransform] = React.useState<ViewTransform>(DEFAULT_VIEW_TRANSFORM);
  const [isDragging, setIsDragging] = React.useState(false);
  const [showRoomSpans, setShowRoomSpans] = React.useState(false);
  const dragStartRef = React.useRef({ x: 0, y: 0 });
  const initialPanRef = React.useRef({ panX: 0, panY: 0 });
  const isPointerDownRef = React.useRef(false);
  const activePointers = React.useRef(new Map<number, { x: number; y: number }>());
  const pinchRef = React.useRef<{
    distance: number; center: { x: number; y: number }; transform: ViewTransform;
  } | null>(null);
  const suppressClickRef = React.useRef(false);

  type FurnitureDrag = {
    id: string;
    startX: number;
    startY: number;
    initialX: number;
    initialY: number;
    currentX: number;
    currentY: number;
  };
  const [draggingFurniture, setDraggingFurniture] = React.useState<FurnitureDrag | null>(null);
  // Touch moves can arrive before React rerenders the drag state. Read this ref so the first move drags furniture instead of panning the canvas.
  const draggingFurnitureRef = React.useRef<FurnitureDrag | null>(null);
  const ignoreLostCaptureRef = React.useRef(false);

  const vertexMap = React.useMemo(() => getVertexMap(plan), [plan]);
  const wallMap = React.useMemo(() => getWallMap(plan), [plan]);
  const roomPolygons = React.useMemo(
    () =>
      plan.rooms
        .map((room) => ({
          room,
          points: computeRoomPolygon(room, wallMap, vertexMap),
        }))
        .filter((rp) => rp.points.length >= 3),
    [plan.rooms, wallMap, vertexMap],
  );
  const bounds = React.useMemo(() => computeFloorPlanBounds(plan), [plan]);
  const fitBounds = React.useMemo(() => computePlanFitBounds(plan), [plan]);
  const dimensions = React.useMemo(() => computePrincipalDimensions(plan), [plan]);
  const roomSpanDimensions = React.useMemo(
    () =>
      roomPolygons.flatMap(({ room, points }) =>
        computeRoomSpanDimensions(points, `room-${room.id}`),
      ),
    [roomPolygons],
  );

  const evaluatedViolations = React.useMemo(
    () => propViolations ?? evaluatePlanRules(plan),
    [propViolations, plan],
  );

  const violationFurnitureIds = React.useMemo(() => {
    const set = new Set<string>();
    for (const v of evaluatedViolations) {
      for (const entityId of v.affectedFurnitureIds ?? v.relatedEntityIds) {
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
      if (v.ruleId === "opening-keep-clear" || v.ruleId === "local-passage") {
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
        for (const entityId of v.affectedFurnitureIds ?? v.relatedEntityIds) {
          if (plan.furniture.some((f) => f.id === entityId)) {
            set.add(entityId);
          }
        }
      }
    }
    return set;
  }, [evaluatedViolations, plan.furniture]);

  // Fit to view helper using stable plan fit bounds and 5% padding
  const fitToView = React.useCallback(
    (width: number, height: number) => {
      const fitted = calculateFitToView(fitBounds, width, height, 0.05);
      setTransform(fitted);
    },
    [fitBounds],
  );

  const viewportSizeRef = React.useRef({ width: 0, height: 0 });
  const fitToViewRef = React.useRef(fitToView);
  React.useEffect(() => { fitToViewRef.current = fitToView; }, [fitToView]);

  // Measure container and auto-fit on initial mount & container resize
  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Immediate dimension detection if container is already measured
    const initW = container.clientWidth;
    const initH = container.clientHeight;
    if (initW > 0 && initH > 0 && viewportSizeRef.current.width === 0) {
      viewportSizeRef.current = { width: initW, height: initH };
      setViewportSize({ width: initW, height: initH });
      fitToViewRef.current(initW, initH);
    }

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) {
          const prev = viewportSizeRef.current;
          const hasResized = Math.abs(width - prev.width) > 2 || Math.abs(height - prev.height) > 2;
          viewportSizeRef.current = { width, height };
          setViewportSize({ width, height });
          if (hasResized) {
            fitToViewRef.current(width, height);
          }
        }
      }
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  // Auto-fit when plan identity changes (e.g. user selects a different plan in catalog)
  const planIdentity = plan.meta.id || plan.meta.name;
  const prevPlanIdentityRef = React.useRef(planIdentity);
  React.useEffect(() => {
    if (prevPlanIdentityRef.current !== planIdentity) {
      prevPlanIdentityRef.current = planIdentity;
      const { width, height } = viewportSizeRef.current;
      if (width > 0 && height > 0) {
        fitToView(width, height);
      }
    }
  }, [planIdentity, fitToView]);

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

  const isInteractiveEdit = isDraftMode || (Boolean(onUpdatePlan) && canvasMode !== "pan");

  const handleFurnitureDragStart = (
    e: React.PointerEvent,
    furniture: FloorPlan["furniture"][number],
  ) => {
    if (!isInteractiveEdit || canvasMode === "pan" || isDraftMode) return;
    const drag: FurnitureDrag = {
      id: furniture.id,
      startX: e.clientX,
      startY: e.clientY,
      initialX: furniture.x,
      initialY: furniture.y,
      currentX: furniture.x,
      currentY: furniture.y,
    };
    draggingFurnitureRef.current = drag;
    setDraggingFurniture(drag);
  };

  const handleRotateFurniture = (furnitureId: string, stepDeg: number = 90) => {
    if (!isInteractiveEdit || !onUpdatePlan) return;
    const res = rotateFurnitureInstance(plan, furnitureId, stepDeg);
    if (res.success) {
      onUpdatePlan(res.plan, "Rotate furniture");
    }
  };

  const hasMovedRef = React.useRef(false);

  // Pan interaction handlers
  const handlePointerDownCapture = (e: React.PointerEvent<SVGSVGElement>) => {
    if (e.button !== 0) return;
    suppressClickRef.current = false;
    activePointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (activePointers.current.size >= 2) {
      e.preventDefault(); e.stopPropagation();
      const [a, b] = [...activePointers.current.values()];
      const rect = e.currentTarget.getBoundingClientRect();
      pinchRef.current = { distance: Math.max(1, Math.hypot(a.x - b.x, a.y - b.y)),
        center: { x: (a.x + b.x) / 2 - rect.left, y: (a.y + b.y) / 2 - rect.top }, transform };
      draggingFurnitureRef.current = null;
      setDraggingFurniture(null); isPointerDownRef.current = false;
      suppressClickRef.current = true;
      ignoreLostCaptureRef.current = true;
      try { e.currentTarget.setPointerCapture(e.pointerId); } catch { /* Pointer may have ended. */ }
      queueMicrotask(() => { ignoreLostCaptureRef.current = false; });
    }
  };

  const handlePointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    if (e.button !== 0) return; // Only primary button
    isPointerDownRef.current = true;
    hasMovedRef.current = false;
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    initialPanRef.current = { panX: transform.panX, panY: transform.panY };
  };

  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (activePointers.current.has(e.pointerId)) activePointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pinchRef.current && activePointers.current.size >= 2) {
      const [a, b] = [...activePointers.current.values()];
      const rect = e.currentTarget.getBoundingClientRect();
      const pinch = pinchRef.current;
      const center = { x: (a.x + b.x) / 2 - rect.left, y: (a.y + b.y) / 2 - rect.top };
      const next = zoomByFactor(pinch.transform, Math.hypot(a.x - b.x, a.y - b.y) / pinch.distance, pinch.center);
      setTransform({ ...next, panX: next.panX + center.x - pinch.center.x, panY: next.panY + center.y - pinch.center.y });
      return;
    }
    if (pinchRef.current) return;
    const activeDrag = draggingFurnitureRef.current;
    if (activeDrag) {
      if (Math.hypot(e.clientX - activeDrag.startX, e.clientY - activeDrag.startY) <= 4) return;
      suppressClickRef.current = true;
      const deltaX = (e.clientX - activeDrag.startX) / transform.scale;
      const deltaY = (e.clientY - activeDrag.startY) / transform.scale;
      const nextDrag = {
        ...activeDrag,
        currentX: Math.round(activeDrag.initialX + deltaX),
        currentY: Math.round(activeDrag.initialY + deltaY),
      };
      draggingFurnitureRef.current = nextDrag;
      setDraggingFurniture(nextDrag);
      return;
    }

    if (!isPointerDownRef.current) return;
    const deltaX = e.clientX - dragStartRef.current.x;
    const deltaY = e.clientY - dragStartRef.current.y;

    if (!hasMovedRef.current && Math.hypot(deltaX, deltaY) > 4) {
      hasMovedRef.current = true;
      setIsDragging(true);
    }

    if (hasMovedRef.current) {
      suppressClickRef.current = true;
      setTransform((prev) => ({
        ...prev,
        panX: initialPanRef.current.panX + deltaX,
        panY: initialPanRef.current.panY + deltaY,
      }));
    }
  };

  const handlePointerUp = (e: React.PointerEvent<SVGSVGElement>, cancelled = false) => {
    activePointers.current.delete(e.pointerId);
    if (pinchRef.current) {
      if (activePointers.current.size === 0) pinchRef.current = null;
      draggingFurnitureRef.current = null;
      setDraggingFurniture(null); isPointerDownRef.current = false; setIsDragging(false);
      return;
    }
    const finishedDrag = draggingFurnitureRef.current;
    if (finishedDrag) {
      const moved = Math.hypot(
        finishedDrag.currentX - finishedDrag.initialX,
        finishedDrag.currentY - finishedDrag.initialY,
      ) > 5;
      if (!cancelled && moved && onUpdatePlan) {
        const res = moveFurnitureInstance(
          plan,
          finishedDrag.id,
          finishedDrag.currentX,
          finishedDrag.currentY,
        );
        if (res.success) {
          onUpdatePlan(res.plan, "Move furniture");
        }
      }
      draggingFurnitureRef.current = null;
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

  const fitted = calculateFitToView(fitBounds, viewportSize.width, viewportSize.height, 0.05);
  const displayZoomPercentage = Math.round(transform.scale / fitted.scale * 100);

  const handleSelect = React.useCallback<EntitySelectHandler>(
    (entity) => {
      if (canvasMode === "pan" || pinchRef.current) return;
      onSelect(entity);
    },
    [canvasMode, onSelect],
  );

  return (
    <div
      ref={containerRef}
      data-testid="floor-plan-viewer-surface"
      className={cn(
        "relative w-full h-full overflow-hidden bg-card select-none",
        compact ? "min-h-0" : "min-h-[320px] lg:min-h-0",
        "dark:[&_[data-entity-type=wall]_polygon]:fill-muted-foreground dark:[&_[data-entity-type=wall]_polygon]:stroke-foreground dark:[&_[data-entity-type=wall][data-selected=true]_polygon]:fill-primary dark:[&_[data-entity-type=furniture]_text]:fill-foreground",
        className,
      )}
    >
      {/* Interactive SVG Canvas */}
      <svg
        ref={svgRef}
        data-testid="floor-plan-svg-canvas"
        className={`w-full h-full block touch-none ${
          isDragging ? "cursor-grabbing" : canvasMode === "pan" ? "cursor-grab" : "cursor-default"
        }`}
        onPointerDown={handlePointerDown}
        onPointerDownCapture={handlePointerDownCapture}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={(e) => handlePointerUp(e, true)}
        onLostPointerCapture={(e) => {
          if (ignoreLostCaptureRef.current || !activePointers.current.has(e.pointerId)) return;
          handlePointerUp(e, false);
        }}
        onClickCapture={(e) => { if (suppressClickRef.current) { e.stopPropagation(); suppressClickRef.current = false; } }}
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
                labelFontSize={compact ? Math.max(140, Math.min(350, 11 / transform.scale)) : undefined}
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
                isHighlighted={highlightWallId === wall.id}
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

              const zone = computeOpeningKeepClearZone(op, wall, vertexMap, 900, roomPolygons);
              if (!zone || (zone.activeSides.length === 0 && zone.passageSides.length === 0)) {
                return null;
              }

              const strokeColor = hasViolation ? "#f59e0b" : "#3b82f6";
              const fillColor = hasViolation ? "rgba(245, 158, 11, 0.12)" : "rgba(59, 130, 246, 0.08)";
              const zones = [
                ...zone.activeSides.map((side) => ({
                  key: `swing-${side}`,
                  kind: "swing" as const,
                  side,
                  points: side === "a" ? zone.sideAPoints : zone.sideBPoints,
                })),
                ...zone.passageSides.map((side) => ({
                  key: `passage-${side}`,
                  kind: "passage" as const,
                  side,
                  points: side === "a" ? zone.passageSideAPoints : zone.passageSideBPoints,
                })),
              ];

              return (
                <g
                  key={`clearance-door-${op.id}`}
                  data-testid={`opening-clearance-overlay-${op.id}`}
                  data-violation={hasViolation ? "true" : "false"}
                >
                  {zones.map((zoneShape) => (
                    <polygon
                      key={zoneShape.key}
                      data-keep-clear-side={zoneShape.side}
                      data-keep-clear-kind={zoneShape.kind}
                      points={zoneShape.points.map((p) => `${p.x},${p.y}`).join(" ")}
                      fill={fillColor}
                      stroke={strokeColor}
                      strokeWidth={zoneShape.kind === "swing" ? 14 : 10}
                      strokeDasharray={zoneShape.kind === "swing" ? "40 20" : "18 14"}
                    />
                  ))}
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
                  isDraftMode={isInteractiveEdit}
                  onRotate={handleRotateFurniture}
                  onDragStart={handleFurnitureDragStart}
                  hasViolation={violationFurnitureIds.has(f.id)}
                  assessmentStatus={assessmentFromRuleResults(plan, evaluatedViolations, f.id).status}
                  locale={locale}
                />
              );
            })}
          </g>

          {/* 5. Principal Dimensions Layer */}
          <g
            data-testid="floor-plan-dimensions-layer"
            className={canvasMode === "pan" ? "pointer-events-none" : undefined}
          >
            {showRoomSpans && roomSpanDimensions.map((dim) => (
              <SvgDimension
                key={dim.id}
                dimension={dim}
                labelFontSize={compact ? Math.max(110, Math.min(220, 8 / transform.scale)) : 110}
              />
            ))}
            {dimensions.map((dim) => (
              <SvgDimension
                key={dim.id}
                dimension={dim}
                labelFontSize={compact ? Math.max(110, Math.min(350, 10 / transform.scale)) : undefined}
                selectedEntity={selectedEntity}
                onSelect={handleSelect}
              />
            ))}
          </g>

          {/* Measurement Origin & Direction Cue (AC-7) */}
          {measurementOrigin && (
            <g data-testid="measurement-origin-cue" className="pointer-events-none select-none">
              <circle
                cx={measurementOrigin.x}
                cy={measurementOrigin.y}
                r={44}
                className="fill-primary stroke-background"
                strokeWidth={8}
              />
              <circle
                cx={measurementOrigin.x}
                cy={measurementOrigin.y}
                r={72}
                fill="none"
                className="stroke-primary"
                strokeWidth={6}
                strokeDasharray="24 12"
                opacity={0.8}
              />
              <text
                x={measurementOrigin.textX}
                y={measurementOrigin.textY}
                className="fill-primary font-mono font-bold"
                fontSize={110}
                textAnchor={measurementOrigin.textAnchor}
              >
                {measurementOrigin.label}
              </text>
            </g>
          )}
        </g>
      </svg>

      {/* Floating Canvas Controls Overlay */}
      <div
        data-testid="floor-plan-viewer-controls"
        className="absolute bottom-3 right-3 z-10 flex items-center gap-2 lg:bottom-4 lg:right-4"
      >
        <Button
          type="button"
          size="sm"
          variant={showRoomSpans ? "default" : "outline"}
          aria-pressed={showRoomSpans}
          aria-label={t.showRoomSpans}
          title={t.showRoomSpans}
          data-testid="toggle-room-spans"
          onClick={() => setShowRoomSpans((visible) => !visible)}
          className={cn("h-11 min-h-[44px] lg:h-8 lg:min-h-0 px-3 text-xs font-medium gap-1 touch-manipulation", compact && "w-11 min-w-11 px-0")}
        >
          <Ruler className="h-3.5 w-3.5" />
          {!compact && <span>{t.roomSpans}</span>}
        </Button>

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

        <Button
          type="button"
          size="sm"
          variant="outline"
          aria-label={t.fitView}
          title={t.fitView}
          onClick={() => fitToView(viewportSize.width, viewportSize.height)}
          className={cn("h-11 min-h-[44px] lg:h-8 lg:min-h-0 px-3 text-xs font-medium gap-1 touch-manipulation", compact && "w-11 min-w-11 px-0")}
        >
          <Maximize2 className="h-3.5 w-3.5" />
          {!compact && <span>{i18n.locale === "zh" ? "适屏" : "Fit"}</span>}
        </Button>
      </div>

      {/* Permanent Millimeter Unit Notice (AC-13) */}
      <div
        data-testid="canvas-unit-notice"
        className={cn(
          "pointer-events-none absolute z-10 rounded-lg border border-border bg-card/90 px-2.5 py-1 text-[11px] font-medium text-muted-foreground shadow-2xs backdrop-blur-xs select-none",
          compact
            ? "bottom-16 right-3 lg:bottom-4 lg:left-4"
            : "bottom-3 left-3 lg:bottom-4 lg:left-4",
        )}
      >
        {i18n.locale === "zh" ? "尺寸单位：mm" : "Dimensions: mm"}
      </div>

      {/* Instructions / Status hint */}
      <div className="pointer-events-none absolute inset-x-3 top-3 z-10 flex items-start justify-between gap-2 text-[11px] text-muted-foreground">
        <span className="rounded-lg border border-border bg-card/90 px-2 py-1">
          {compact ? i18n.locale === "zh" ? canvasMode === "pan" ? "单指移动画布 · 双指缩放" : "拖动家具 · 双指缩放" : canvasMode === "pan" ? "Drag to pan · Pinch to zoom" : "Drag furniture · Pinch to zoom"
            : i18n.locale === "zh" ? "拖动家具摆放 · 滚轮缩放 · 点击查看详情" : "Drag furniture · Scroll to zoom · Click to inspect"}
        </span>
        <span data-testid="zoom-level-badge" className="rounded-lg border border-border bg-card/90 px-2 py-1 font-mono">{displayZoomPercentage}%</span>
      </div>
    </div>
  );
}
