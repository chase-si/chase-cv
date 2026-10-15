import * as React from "react";
import type { Vertex, Wall } from "@/lib/floor-plan";
import { computeWallGeometry } from "@/lib/floor-plan/geometry";
import { cn } from "@/lib/utils";
import type { EntitySelectHandler, SelectedEntity } from "../types";

interface SvgWallProps {
  wall: Wall;
  vertexMap: Map<string, Vertex>;
  selectedEntity: SelectedEntity | null;
  onSelect: EntitySelectHandler;
  isHighlighted?: boolean;
}

export function SvgWall({
  wall,
  vertexMap,
  selectedEntity,
  onSelect,
  isHighlighted = false,
}: SvgWallProps) {
  const geom = React.useMemo(
    () => computeWallGeometry(wall, vertexMap),
    [wall, vertexMap],
  );

  if (!geom) return null;

  const isSelected =
    selectedEntity?.type === "wall" && selectedEntity?.id === wall.id;

  const pointsString = geom.polygonPoints.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <g
      data-testid={`floor-plan-wall-${wall.id}`}
      data-entity-type="wall"
      data-entity-id={wall.id}
      data-selected={isSelected ? "true" : "false"}
      data-highlighted={isHighlighted ? "true" : "false"}
      className="cursor-pointer"
      onClick={(e) => {
        e.stopPropagation();
        onSelect({ type: "wall", id: wall.id });
      }}
    >
      {/* Wall Body */}
      <polygon
        points={pointsString}
        fill={isSelected || isHighlighted ? "#3b82f6" : "#334155"}
        stroke={isSelected || isHighlighted ? "#1d4ed8" : "#1e293b"}
        strokeWidth={isSelected || isHighlighted ? 30 : 12}
        className={cn(
          "transition-colors duration-150 hover:fill-slate-600",
          isHighlighted && "animate-pulse",
        )}
      />
      {/* Centerline indicator on selection */}
      {isSelected ? (
        <line
          x1={geom.from.x}
          y1={geom.from.y}
          x2={geom.to.x}
          y2={geom.to.y}
          stroke="#93c5fd"
          strokeWidth={16}
          strokeDasharray="40 20"
        />
      ) : null}
    </g>
  );
}
