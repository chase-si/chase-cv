import * as React from "react";
import type { DimensionAnnotation } from "@/lib/floor-plan/geometry";

import type { EntitySelectHandler, SelectedEntity } from "../types";

interface SvgDimensionProps {
  dimension: DimensionAnnotation;
  selectedEntity?: SelectedEntity | null;
  onSelect?: EntitySelectHandler;
}

export function SvgDimension({
  dimension,
  selectedEntity,
  onSelect,
}: SvgDimensionProps) {
  const { label, start, end, offset, textPoint, orientation } = dimension;

  const isSelected =
    selectedEntity?.type === "dimension" && selectedEntity?.id === dimension.id;

  // Offset points where the dimension line runs
  const dimStart = {
    x: start.x + offset.x,
    y: start.y + offset.y,
  };
  const dimEnd = {
    x: end.x + offset.x,
    y: end.y + offset.y,
  };

  // 45-degree architectural tick mark half-length (in mm)
  const tickSize = 80;

  return (
    <g
      data-testid={`floor-plan-dimension-${dimension.id}`}
      data-entity-type="dimension"
      data-entity-id={dimension.id}
      data-selected={isSelected ? "true" : "false"}
      className={onSelect ? "cursor-pointer select-none" : "pointer-events-none select-none"}
      onClick={(e) => {
        if (onSelect) {
          e.stopPropagation();
          onSelect({ type: "dimension", id: dimension.id });
        }
      }}
    >
      {/* Extension / Witness line from start */}
      <line
        x1={start.x}
        y1={start.y}
        x2={dimStart.x + (offset.x > 0 ? 100 : offset.x < 0 ? -100 : 0)}
        y2={dimStart.y + (offset.y > 0 ? 100 : offset.y < 0 ? -100 : 0)}
        stroke="#94a3b8"
        strokeWidth="10"
        strokeDasharray="20 10"
      />

      {/* Extension / Witness line from end */}
      <line
        x1={end.x}
        y1={end.y}
        x2={dimEnd.x + (offset.x > 0 ? 100 : offset.x < 0 ? -100 : 0)}
        y2={dimEnd.y + (offset.y > 0 ? 100 : offset.y < 0 ? -100 : 0)}
        stroke="#94a3b8"
        strokeWidth="10"
        strokeDasharray="20 10"
      />

      {/* Main dimension line */}
      <line
        x1={dimStart.x}
        y1={dimStart.y}
        x2={dimEnd.x}
        y2={dimEnd.y}
        stroke="#64748b"
        strokeWidth="14"
      />

      {/* 45-degree tick marks */}
      <line
        x1={dimStart.x - tickSize}
        y1={dimStart.y - tickSize}
        x2={dimStart.x + tickSize}
        y2={dimStart.y + tickSize}
        stroke="#475569"
        strokeWidth="18"
        strokeLinecap="square"
      />
      <line
        x1={dimEnd.x - tickSize}
        y1={dimEnd.y - tickSize}
        x2={dimEnd.x + tickSize}
        y2={dimEnd.y + tickSize}
        stroke="#475569"
        strokeWidth="18"
        strokeLinecap="square"
      />

      {/* Dimension text */}
      <g
        transform={`translate(${textPoint.x}, ${textPoint.y})${orientation === "vertical" ? " rotate(-90)" : ""}`}
      >
        <rect
          x="-220"
          y="-90"
          width="440"
          height="160"
          rx="30"
          fill={isSelected ? "rgba(59, 130, 246, 0.15)" : "var(--background, #ffffff)"}
          stroke={isSelected ? "#2563eb" : "#cbd5e1"}
          strokeWidth={isSelected ? 16 : 4}
          fillOpacity="0.95"
        />
        <text
          x="0"
          y="20"
          textAnchor="middle"
          fontSize="110"
          fontWeight="600"
          fill={isSelected ? "#1d4ed8" : "#475569"}
          className="font-mono"
        >
          {label}
        </text>
      </g>
    </g>
  );
}
