"use client";

import * as React from "react";
import { Maximize2, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SvgFurniture } from "@/components/floor-plan/svg/svg-furniture";
import { SvgOpening } from "@/components/floor-plan/svg/svg-opening";
import { SvgWall } from "@/components/floor-plan/svg/svg-wall";
import { PlanDimension } from "./dimension";
import { computePlanFitBounds, computePrincipalDimensions, computeRoomPolygon, computePolygonArea, computePolygonCentroid, getVertexMap, getWallMap, type Point } from "@/lib/floor-plan/geometry";
import { computePlacementClearanceZones } from "@/lib/floor-plan/space-assessment";
import { floorPlanToPlacementScenario } from "@/lib/floor-plan/placement-scenario";
import { calculateFitToView, zoomByFactor, type ViewTransform } from "@/lib/floor-plan/view-transform";
import { getFloorPlanI18n } from "@/lib/floor-plan/i18n";
import type { FloorPlan } from "@/lib/floor-plan/types";
import type { SelectedEntity } from "@/components/floor-plan/types";

const i18n = getFloorPlanI18n("zh");
const noop = () => {};
const pointsString = (points: Point[]) => points.map((p) => `${p.x},${p.y}`).join(" ");
type Gesture = {
  type: "pan" | "move" | "pinch";
  start: Point;
  view: ViewTransform;
  entity: SelectedEntity | null;
  furniture?: { id: string; x: number; y: number };
  distance?: number;
  moved: boolean;
};

export function PlanCanvas({ plan, selected, roomId, panMode, showClearance, problemIds, onSelect, onMove, svgRef }: {
  plan: FloorPlan; selected: SelectedEntity | null; roomId: string | null;
  panMode: boolean; showClearance: boolean; problemIds: Set<string>;
  onSelect: (entity: SelectedEntity | null) => void;
  onMove: (id: string, x: number, y: number) => void;
  svgRef: React.RefObject<SVGSVGElement | null>;
}) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [view, setView] = React.useState<ViewTransform>({ scale: 0.04, panX: 0, panY: 0 });
  const viewRef = React.useRef(view);
  const fitScale = React.useRef(0.04);
  const [baselineScale, setBaselineScale] = React.useState(0.04);
  const pointers = React.useRef(new Map<number, Point>());
  const gesture = React.useRef<Gesture | null>(null);
  const [preview, setPreview] = React.useState<{ id: string; x: number; y: number } | null>(null);
  // The parent keys this component by plan ID; furniture edits must not reset zoom.
  const [bounds] = React.useState(() => computePlanFitBounds(plan));
  const updateView = React.useCallback((next: ViewTransform) => { viewRef.current = next; setView(next); }, []);
  const fit = React.useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const next = calculateFitToView(bounds, el.clientWidth, el.clientHeight, 0.06);
    fitScale.current = next.scale;
    setBaselineScale(next.scale);
    updateView(next);
  }, [bounds, updateView]);
  React.useEffect(() => {
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(containerRef.current!);
    return () => observer.disconnect();
  }, [fit]);
  React.useEffect(() => {
    const el = containerRef.current!;
    const wheel = (e: WheelEvent) => {
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      updateView(zoomByFactor(viewRef.current, e.deltaY < 0 ? 1.12 : 1 / 1.12,
        { x: e.clientX - rect.left, y: e.clientY - rect.top }, fitScale.current * 0.5, fitScale.current * 6));
    };
    el.addEventListener("wheel", wheel, { passive: false });
    return () => el.removeEventListener("wheel", wheel);
  }, [updateView]);

  const location = (e: React.PointerEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };
  const down = (e: React.PointerEvent<SVGSVGElement>) => {
    if (e.button !== 0) return;
    e.preventDefault(); e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);
    const point = location(e);
    pointers.current.set(e.pointerId, point);
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      setPreview(null);
      gesture.current = { type: "pinch", start: { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 },
        view: viewRef.current, entity: null, distance: Math.hypot(a.x - b.x, a.y - b.y), moved: true };
      return;
    }
    if (pointers.current.size !== 1) return;
    const target = (e.target as Element).closest("[data-entity-type]");
    const entity = target ? { type: target.getAttribute("data-entity-type"), id: target.getAttribute("data-entity-id") } as SelectedEntity : null;
    const furniture = entity?.type === "furniture" ? plan.furniture.find((f) => f.id === entity.id) : undefined;
    gesture.current = { type: furniture && !panMode ? "move" : "pan", start: point, view: viewRef.current,
      entity, furniture, moved: false };
    if (furniture && !panMode) onSelect(entity);
  };
  const move = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!pointers.current.has(e.pointerId)) return;
    e.preventDefault();
    const point = location(e);
    pointers.current.set(e.pointerId, point);
    const current = gesture.current;
    if (!current) return;
    if (current.type === "pinch" && pointers.current.size >= 2) {
      const [a, b] = [...pointers.current.values()];
      const center = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
      const distance = Math.hypot(a.x - b.x, a.y - b.y);
      const next = zoomByFactor(current.view, distance / Math.max(1, current.distance!), current.start,
        fitScale.current * 0.5, fitScale.current * 6);
      updateView({ ...next, panX: next.panX + center.x - current.start.x, panY: next.panY + center.y - current.start.y });
      return;
    }
    const dx = point.x - current.start.x, dy = point.y - current.start.y;
    if (!current.moved && Math.hypot(dx, dy) < 5) return;
    current.moved = true;
    if (current.type === "move" && current.furniture) {
      setPreview({ id: current.furniture.id,
        x: Math.round((current.furniture.x + dx / current.view.scale) / 50) * 50,
        y: Math.round((current.furniture.y + dy / current.view.scale) / 50) * 50 });
    } else {
      updateView({ ...current.view, panX: current.view.panX + dx, panY: current.view.panY + dy });
    }
  };
  const finish = (e: React.PointerEvent<SVGSVGElement>, cancelled = false) => {
    if (!pointers.current.has(e.pointerId)) return;
    const current = gesture.current;
    pointers.current.delete(e.pointerId);
    if (current?.type === "pinch") { gesture.current = null; setPreview(null); return; }
    if (!cancelled && current) {
      if (current.type === "move" && current.moved && preview) onMove(preview.id, preview.x, preview.y);
      else if (!current.moved) onSelect(current.entity);
    }
    gesture.current = null; setPreview(null);
  };
  const zoom = (factor: number) => {
    const el = containerRef.current!;
    updateView(zoomByFactor(viewRef.current, factor, { x: el.clientWidth / 2, y: el.clientHeight / 2 }, fitScale.current * 0.5, fitScale.current * 6));
  };
  const renderedPlan = preview ? { ...plan, furniture: plan.furniture.map((f) => f.id === preview.id ? { ...f, ...preview } : f) } : plan;
  const vertexMap = getVertexMap(plan), wallMap = getWallMap(plan);
  const placement = floorPlanToPlacementScenario(renderedPlan).placements.find((p) => p.id === selected?.id);
  const zones = showClearance && placement ? Object.values(computePlacementClearanceZones(placement)) : [];

  return <Card className="canvas-card relative min-h-0 flex-1 gap-0 p-0" ref={containerRef}>
    <svg ref={svgRef} role="group" aria-label="户型画布，可拖动家具和双指缩放" className="plan-canvas h-full w-full"
      onPointerDownCapture={down} onPointerMove={move} onPointerUp={(e) => finish(e)}
      onPointerCancel={(e) => finish(e, true)} onLostPointerCapture={(e) => finish(e, true)}
      onKeyDownCapture={(e) => {
        const target = (e.target as Element).closest('[data-entity-type="furniture"]');
        if (target && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault(); e.stopPropagation();
          onSelect({ type: "furniture", id: target.getAttribute("data-entity-id")! });
        }
      }}>
      <g data-plan-drawing="true" transform={`translate(${view.panX},${view.panY}) scale(${view.scale})`}>
        {plan.rooms.map((room) => {
          const polygon = computeRoomPolygon(room, wallMap, vertexMap), center = computePolygonCentroid(polygon);
          const active = room.id === roomId;
          return <g key={room.id} data-entity-type="room" data-entity-id={room.id} role="button" tabIndex={0}
            aria-label={`选择${room.name ?? i18n.getRoomTypeLabel(room.type)}`} aria-pressed={active}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onSelect({ type: "room", id: room.id }); } }}>
            <polygon points={pointsString(polygon)} fill={active ? "var(--primary)" : "var(--muted)"} fillOpacity={active ? 0.12 : 0.5} />
            <text x={center.x} y={center.y} textAnchor="middle" fill="var(--muted-foreground)" fontSize={Math.min(270, 11 / view.scale)} pointerEvents="none">
              {room.name ?? i18n.getRoomTypeLabel(room.type)}
              <tspan x={center.x} dy="1.4em">{computePolygonArea(polygon).formattedAreaM2}</tspan>
            </text>
            {active && <polygon points={pointsString(polygon)} fill="none" stroke="var(--primary)" strokeWidth={24} strokeDasharray="80 40" />}
          </g>;
        })}
        {zones.map((zone) => <g key={zone.side} pointerEvents="none">
          <polygon points={pointsString(zone.recommendedZonePolygon)} fill="var(--primary)" fillOpacity={0.08} stroke="var(--primary)" strokeWidth={12} strokeDasharray="70 40" />
          <polygon points={pointsString(zone.minimumZonePolygon)} fill="var(--primary)" fillOpacity={0.12} />
        </g>)}
        {plan.walls.map((wall) => <SvgWall key={wall.id} wall={wall} vertexMap={vertexMap} selectedEntity={selected} onSelect={noop} />)}
        {plan.openings.map((opening) => <SvgOpening key={opening.id} opening={opening} wall={wallMap.get(opening.wallId)!} vertexMap={vertexMap} selectedEntity={selected} onSelect={noop} />)}
        {renderedPlan.furniture.map((furniture) => <SvgFurniture key={furniture.id} furniture={furniture} selectedEntity={selected} hasViolation={problemIds.has(furniture.id)}
          onSelect={noop} locale="zh" />)}
        {computePrincipalDimensions(plan).map((dimension) => <PlanDimension key={dimension.id} dimension={dimension} scale={view.scale} />)}
      </g>
    </svg>
    <div className="pointer-events-none absolute inset-x-3 top-3 flex items-start justify-between gap-2">
      <span className="rounded-lg border border-border bg-background/90 px-2 py-1 text-[11px] text-muted-foreground">{panMode ? "单指移动画布" : "拖动家具 · 双指缩放"}</span>
      <span className="rounded-lg border border-border bg-background/90 px-2 py-1 text-[11px] text-muted-foreground">{Math.round(view.scale / baselineScale * 100)}%</span>
    </div>
    <div className="absolute bottom-3 right-3 flex gap-2">
      <Button variant="outline" className="size-11 bg-background" aria-label="缩小画布" onClick={() => zoom(1 / 1.3)}><Minus /></Button>
      <Button variant="outline" className="size-11 bg-background" aria-label="放大画布" onClick={() => zoom(1.3)}><Plus /></Button>
      <Button variant="outline" className="size-11 bg-background" aria-label="适应画布" onClick={fit}><Maximize2 /></Button>
    </div>
  </Card>;
}
