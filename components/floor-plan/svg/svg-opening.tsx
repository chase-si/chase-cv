import * as React from "react";
import type { Opening, Vertex, Wall } from "@/lib/floor-plan";
import { computeOpeningGeometry } from "@/lib/floor-plan/geometry";
import type { EntitySelectHandler, SelectedEntity } from "../types";

interface SvgOpeningProps {
  opening: Opening;
  wall: Wall;
  vertexMap: Map<string, Vertex>;
  selectedEntity: SelectedEntity | null;
  onSelect: EntitySelectHandler;
}

export function SvgOpening({
  opening,
  wall,
  vertexMap,
  selectedEntity,
  onSelect,
}: SvgOpeningProps) {
  const geom = React.useMemo(
    () => computeOpeningGeometry(opening, wall, vertexMap),
    [opening, wall, vertexMap],
  );

  if (!geom) return null;

  const isSelected =
    selectedEntity?.type === "opening" && selectedEntity?.id === opening.id;

  const { center, start, end, width, wallThickness, unit, normal, angleDeg } = geom;

  // Opening mask polygon to clear out the solid wall
  const halfT = wallThickness / 2 + 4; // slight margin to cleanly mask wall
  const maskPoints = [
    { x: start.x + normal.x * halfT, y: start.y + normal.y * halfT },
    { x: end.x + normal.x * halfT, y: end.y + normal.y * halfT },
    { x: end.x - normal.x * halfT, y: end.y - normal.y * halfT },
    { x: start.x - normal.x * halfT, y: start.y - normal.y * halfT },
  ];
  const maskPointsStr = maskPoints.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <g
      data-testid={`floor-plan-opening-${opening.id}`}
      data-entity-type="opening"
      data-entity-id={opening.id}
      data-selected={isSelected ? "true" : "false"}
      className="cursor-pointer"
      onClick={(e) => {
        e.stopPropagation();
        onSelect({ type: "opening", id: opening.id });
      }}
    >
      {/* Wall opening cutout / mask */}
      <polygon
        points={maskPointsStr}
        fill="var(--background, #ffffff)"
        stroke="none"
      />

      {opening.type === "window" ? (
        // Window rendering
        <g>
          {/* Outer frame */}
          <polygon
            points={maskPointsStr}
            fill="rgba(56, 189, 248, 0.15)"
            stroke={isSelected ? "#0284c7" : "#0ea5e9"}
            strokeWidth={isSelected ? 30 : 16}
          />
          {/* Glass lines */}
          <line
            x1={start.x + normal.x * (wallThickness / 4)}
            y1={start.y + normal.y * (wallThickness / 4)}
            x2={end.x + normal.x * (wallThickness / 4)}
            y2={end.y + normal.y * (wallThickness / 4)}
            stroke="#38bdf8"
            strokeWidth={14}
          />
          <line
            x1={start.x - normal.x * (wallThickness / 4)}
            y1={start.y - normal.y * (wallThickness / 4)}
            x2={end.x - normal.x * (wallThickness / 4)}
            y2={end.y - normal.y * (wallThickness / 4)}
            stroke="#38bdf8"
            strokeWidth={14}
          />
        </g>
      ) : opening.type === "door" ? (
        // Door rendering as clean wall-bound opening without door leaf or swing arc (AC-9)
        <g>
          {/* Clean opening frame / threshold background */}
          <polygon
            points={maskPointsStr}
            fill={isSelected ? "rgba(37, 99, 235, 0.08)" : "rgba(248, 250, 252, 0.95)"}
            stroke={isSelected ? "#2563eb" : "#64748b"}
            strokeWidth={isSelected ? 26 : 14}
          />
          {/* Start jamb line across wall thickness */}
          <line
            x1={start.x + normal.x * (wallThickness / 2)}
            y1={start.y + normal.y * (wallThickness / 2)}
            x2={start.x - normal.x * (wallThickness / 2)}
            y2={start.y - normal.y * (wallThickness / 2)}
            stroke={isSelected ? "#2563eb" : "#334155"}
            strokeWidth={isSelected ? 24 : 16}
            strokeLinecap="square"
          />
          {/* End jamb line across wall thickness */}
          <line
            x1={end.x + normal.x * (wallThickness / 2)}
            y1={end.y + normal.y * (wallThickness / 2)}
            x2={end.x - normal.x * (wallThickness / 2)}
            y2={end.y - normal.y * (wallThickness / 2)}
            stroke={isSelected ? "#2563eb" : "#334155"}
            strokeWidth={isSelected ? 24 : 16}
            strokeLinecap="square"
          />
          {/* Clear opening threshold line */}
          <line
            x1={start.x}
            y1={start.y}
            x2={end.x}
            y2={end.y}
            stroke={isSelected ? "#2563eb" : "#94a3b8"}
            strokeWidth={isSelected ? 16 : 10}
            strokeDasharray="24 16"
          />
        </g>
      ) : opening.type === "sliding_door" ? (
        // Sliding door rendering
        <g>
          <polygon
            points={maskPointsStr}
            fill="rgba(241, 245, 249, 0.9)"
            stroke={isSelected ? "#2563eb" : "#64748b"}
            strokeWidth={isSelected ? 24 : 12}
          />
          <line
            x1={start.x + normal.x * 30}
            y1={start.y + normal.y * 30}
            x2={center.x + unit.x * 50 + normal.x * 30}
            y2={center.y + unit.y * 50 + normal.y * 30}
            stroke={isSelected ? "#2563eb" : "#334155"}
            strokeWidth={20}
          />
          <line
            x1={center.x - unit.x * 50 - normal.x * 30}
            y1={center.y - unit.y * 50 - normal.y * 30}
            x2={end.x - normal.x * 30}
            y2={end.y - normal.y * 30}
            stroke={isSelected ? "#2563eb" : "#334155"}
            strokeWidth={20}
          />
        </g>
      ) : (
        // Plain opening / passage
        <line
          x1={start.x}
          y1={start.y}
          x2={end.x}
          y2={end.y}
          stroke={isSelected ? "#2563eb" : "#cbd5e1"}
          strokeWidth={isSelected ? 24 : 12}
          strokeDasharray="20 20"
        />
      )}
    </g>
  );
}
