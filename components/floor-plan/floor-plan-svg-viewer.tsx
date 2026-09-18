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
import { SvgDimension } from "./svg/svg-dimension";
import { SvgFurniture } from "./svg/svg-furniture";
import { SvgOpening } from "./svg/svg-opening";
import { SvgRoom } from "./svg/svg-room";
import { SvgWall } from "./svg/svg-wall";

interface FloorPlanSvgViewerProps {
  plan: FloorPlan;
  selectedEntity: SelectedEntity | null;
  onSelect: EntitySelectHandler;
  isDraftMode?: boolean;
  onUpdatePlan?: (updated: FloorPlan) => void;
  className?: string;
}

export function FloorPlanSvgViewer({
  plan,
  selectedEntity,
  onSelect,
  isDraftMode = false,
  onUpdatePlan,
  className = "",
}: FloorPlanSvgViewerProps) {
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
    if (!isDraftMode) return;
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
      onUpdatePlan(res.plan);
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
          onUpdatePlan(res.plan);
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
          isDragging ? "cursor-grabbing" : "cursor-grab"
        }`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onClick={(e) => {
          // Deselect when clicking canvas background
          if (e.target === e.currentTarget) {
            onSelect(null);
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
          onClick={() => onSelect(null)}
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
          <g data-testid="floor-plan-rooms-layer">
            {plan.rooms.map((room) => (
              <SvgRoom
                key={room.id}
                room={room}
                wallMap={wallMap}
                vertexMap={vertexMap}
                selectedEntity={selectedEntity}
                onSelect={onSelect}
              />
            ))}
          </g>

          {/* 2. Walls Layer */}
          <g data-testid="floor-plan-walls-layer">
            {plan.walls.map((wall) => (
              <SvgWall
                key={wall.id}
                wall={wall}
                vertexMap={vertexMap}
                selectedEntity={selectedEntity}
                onSelect={onSelect}
              />
            ))}
          </g>

          {/* 3. Openings Layer */}
          <g data-testid="floor-plan-openings-layer">
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
                  onSelect={onSelect}
                />
              );
            })}
          </g>

          {/* 4. Furniture Layer */}
          <g data-testid="floor-plan-furniture-layer">
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
                  onSelect={onSelect}
                  isDraftMode={isDraftMode}
                  onRotate={handleRotateFurniture}
                  onDragStart={handleFurnitureDragStart}
                />
              );
            })}
          </g>

          {/* 5. Principal Dimensions Layer */}
          <g data-testid="floor-plan-dimensions-layer">
            {dimensions.map((dim) => (
              <SvgDimension
                key={dim.id}
                dimension={dim}
                selectedEntity={selectedEntity}
                onSelect={onSelect}
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
          aria-label="Zoom in"
          title="Zoom in"
          onClick={handleZoomIn}
          className="h-8 w-8 p-0"
        >
          <Plus className="h-4 w-4" />
        </Button>

        <span
          data-testid="zoom-level-badge"
          className="min-w-14 text-center font-mono text-xs font-medium text-muted-foreground"
        >
          {displayZoomPercentage}%
        </span>

        <Button
          type="button"
          size="sm"
          variant="outline"
          aria-label="Zoom out"
          title="Zoom out"
          onClick={handleZoomOut}
          className="h-8 w-8 p-0"
        >
          <Minus className="h-4 w-4" />
        </Button>

        <div className="mx-1 h-4 w-px bg-border" />

        <Button
          type="button"
          size="sm"
          variant="outline"
          aria-label="Fit to view"
          title="Fit plan to view"
          onClick={() => fitToView(viewportSize.width, viewportSize.height)}
          className="h-8 px-2.5 text-xs font-medium gap-1"
        >
          <Maximize2 className="h-3.5 w-3.5" />
          <span>Fit</span>
        </Button>

        <Button
          type="button"
          size="sm"
          variant="ghost"
          aria-label="Reset zoom"
          title="Reset"
          onClick={handleResetZoom}
          className="h-8 w-8 p-0 text-muted-foreground"
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* Instructions / Status hint */}
      <div className="absolute top-3 left-3 z-10 hidden sm:flex items-center gap-2 rounded-lg bg-card/85 px-2.5 py-1 text-xs text-muted-foreground border border-border/70 backdrop-blur-xs pointer-events-none">
        <span className="font-medium text-foreground">{plan.meta.name}</span>
        <span>•</span>
        <span>Drag to pan, scroll to zoom, click entities to inspect</span>
      </div>
    </div>
  );
}
