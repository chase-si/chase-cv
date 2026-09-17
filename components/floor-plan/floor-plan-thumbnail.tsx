import * as React from "react";
import type { FloorPlan } from "@/lib/floor-plan";
import {
  computeFloorPlanBounds,
  computeOpeningGeometry,
  computeRoomPolygon,
  computeWallGeometry,
  getVertexMap,
  getWallMap,
} from "@/lib/floor-plan/geometry";

interface FloorPlanThumbnailProps {
  plan: FloorPlan;
  className?: string;
}

export function FloorPlanThumbnail({ plan, className = "" }: FloorPlanThumbnailProps) {
  const vertexMap = React.useMemo(() => getVertexMap(plan), [plan]);
  const wallMap = React.useMemo(() => getWallMap(plan), [plan]);
  const bounds = React.useMemo(() => computeFloorPlanBounds(plan), [plan]);

  const padding = 400;
  const viewBox = `${bounds.minX - padding} ${bounds.minY - padding} ${bounds.width + padding * 2} ${bounds.height + padding * 2}`;

  return (
    <svg
      viewBox={viewBox}
      className={`w-full h-full block select-none ${className}`}
      data-testid={`floor-plan-thumbnail-${plan.meta.id ?? plan.meta.name}`}
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Background grid / subtle card bg */}
      <rect
        x={bounds.minX - padding}
        y={bounds.minY - padding}
        width={bounds.width + padding * 2}
        height={bounds.height + padding * 2}
        fill="var(--card, #ffffff)"
      />

      {/* Room Polygons */}
      {plan.rooms.map((room) => {
        const points = computeRoomPolygon(room, wallMap, vertexMap);
        if (points.length < 3) return null;
        return (
          <polygon
            key={room.id}
            points={points.map((p) => `${p.x},${p.y}`).join(" ")}
            fill="rgba(241, 245, 249, 0.8)"
            stroke="#cbd5e1"
            strokeWidth="16"
          />
        );
      })}

      {/* Walls */}
      {plan.walls.map((wall) => {
        const geom = computeWallGeometry(wall, vertexMap);
        if (!geom) return null;
        return (
          <polygon
            key={wall.id}
            points={geom.polygonPoints.map((p) => `${p.x},${p.y}`).join(" ")}
            fill="#334155"
            stroke="#1e293b"
            strokeWidth="10"
          />
        );
      })}

      {/* Openings */}
      {plan.openings.map((op) => {
        const wall = wallMap.get(op.wallId);
        if (!wall) return null;
        const geom = computeOpeningGeometry(op, wall, vertexMap);
        if (!geom) return null;
        return (
          <line
            key={op.id}
            x1={geom.start.x}
            y1={geom.start.y}
            x2={geom.end.x}
            y2={geom.end.y}
            stroke={op.type === "window" ? "#38bdf8" : "#94a3b8"}
            strokeWidth={geom.wallThickness + 20}
          />
        );
      })}

      {/* Furniture */}
      {plan.furniture.map((f) => (
        <g
          key={f.id}
          transform={`translate(${f.x}, ${f.y}) rotate(${f.rotation})`}
        >
          <rect
            x={-f.width / 2}
            y={-f.depth / 2}
            width={f.width}
            height={f.depth}
            rx="40"
            fill="#e2e8f0"
            stroke="#94a3b8"
            strokeWidth="12"
          />
        </g>
      ))}
    </svg>
  );
}
