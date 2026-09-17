import * as React from "react";
import type { FurnitureInstance } from "@/lib/floor-plan";
import type { EntitySelectHandler, SelectedEntity } from "../types";

interface SvgFurnitureProps {
  furniture: FurnitureInstance;
  selectedEntity: SelectedEntity | null;
  onSelect: EntitySelectHandler;
}

export function SvgFurniture({
  furniture,
  selectedEntity,
  onSelect,
}: SvgFurnitureProps) {
  const isSelected =
    selectedEntity?.type === "furniture" && selectedEntity?.id === furniture.id;

  const { x, y, width, depth, rotation, definitionId } = furniture;
  const halfW = width / 2;
  const halfD = depth / 2;

  const isBed = definitionId.includes("bed");
  const isSofa = definitionId.includes("sofa");
  const isTable = definitionId.includes("table");
  const isDesk = definitionId.includes("desk");
  const isWardrobe = definitionId.includes("wardrobe") || definitionId.includes("storage");

  return (
    <g
      data-testid={`floor-plan-furniture-${furniture.id}`}
      data-entity-type="furniture"
      data-entity-id={furniture.id}
      data-selected={isSelected ? "true" : "false"}
      transform={`translate(${x}, ${y}) rotate(${rotation})`}
      className="cursor-pointer"
      onClick={(e) => {
        e.stopPropagation();
        onSelect({ type: "furniture", id: furniture.id });
      }}
    >
      {/* Outer base box */}
      <rect
        x={-halfW}
        y={-halfD}
        width={width}
        height={depth}
        rx={Math.min(60, width / 10)}
        fill={isSelected ? "rgba(59, 130, 246, 0.15)" : "#f8fafc"}
        stroke={isSelected ? "#2563eb" : "#64748b"}
        strokeWidth={isSelected ? 32 : 16}
        className="transition-colors duration-150"
      />

      {/* Domain Furniture Interior Details */}
      {isBed ? (
        <g>
          {/* Headboard */}
          <rect
            x={-halfW}
            y={-halfD}
            width={width}
            height={Math.min(180, depth * 0.15)}
            fill="#475569"
            stroke="none"
          />
          {/* Pillows */}
          {width > 1400 ? (
            <>
              <rect
                x={-halfW + width * 0.1}
                y={-halfD + depth * 0.18}
                width={width * 0.35}
                height={depth * 0.22}
                rx="30"
                fill="#ffffff"
                stroke="#94a3b8"
                strokeWidth="10"
              />
              <rect
                x={halfW - width * 0.45}
                y={-halfD + depth * 0.18}
                width={width * 0.35}
                height={depth * 0.22}
                rx="30"
                fill="#ffffff"
                stroke="#94a3b8"
                strokeWidth="10"
              />
            </>
          ) : (
            <rect
              x={-width * 0.3}
              y={-halfD + depth * 0.18}
              width={width * 0.6}
              height={depth * 0.22}
              rx="30"
              fill="#ffffff"
              stroke="#94a3b8"
              strokeWidth="10"
            />
          )}
          {/* Duvet fold line */}
          <line
            x1={-halfW + 40}
            y1={-halfD + depth * 0.48}
            x2={halfW - 40}
            y2={-halfD + depth * 0.48}
            stroke="#94a3b8"
            strokeWidth="12"
          />
        </g>
      ) : isSofa ? (
        <g>
          {/* Backrest along top */}
          <rect
            x={-halfW}
            y={-halfD}
            width={width}
            height={depth * 0.3}
            rx="20"
            fill="#cbd5e1"
            stroke="#94a3b8"
            strokeWidth="10"
          />
          {/* Armrests */}
          <rect
            x={-halfW}
            y={-halfD}
            width={width * 0.15}
            height={depth}
            rx="20"
            fill="#cbd5e1"
            stroke="#94a3b8"
            strokeWidth="10"
          />
          <rect
            x={halfW - width * 0.15}
            y={-halfD}
            width={width * 0.15}
            height={depth}
            rx="20"
            fill="#cbd5e1"
            stroke="#94a3b8"
            strokeWidth="10"
          />
          {/* Cushion divides */}
          <line
            x1={-halfW + width * 0.42}
            y1={-halfD + depth * 0.3}
            x2={-halfW + width * 0.42}
            y2={halfD - 20}
            stroke="#94a3b8"
            strokeWidth="10"
          />
          <line
            x1={halfW - width * 0.42}
            y1={-halfD + depth * 0.3}
            x2={halfW - width * 0.42}
            y2={halfD - 20}
            stroke="#94a3b8"
            strokeWidth="10"
          />
        </g>
      ) : isTable ? (
        <g>
          {/* Tabletop center icon */}
          <ellipse
            cx="0"
            cy="0"
            rx={halfW * 0.3}
            ry={halfD * 0.3}
            fill="none"
            stroke="#cbd5e1"
            strokeWidth="10"
          />
        </g>
      ) : isDesk ? (
        <g>
          {/* Monitor / Laptop outline */}
          <rect
            x={-halfW * 0.35}
            y={-halfD + 80}
            width={halfW * 0.7}
            height={depth * 0.18}
            rx="10"
            fill="#94a3b8"
          />
          {/* Chair seating notch */}
          <path
            d={`M ${-halfW * 0.4} ${halfD} C ${-halfW * 0.3} ${halfD - 120}, ${halfW * 0.3} ${halfD - 120}, ${halfW * 0.4} ${halfD}`}
            fill="none"
            stroke="#cbd5e1"
            strokeWidth="12"
          />
        </g>
      ) : isWardrobe ? (
        <g>
          {/* Sliding door dividing line */}
          <line
            x1="0"
            y1={-halfD}
            x2="0"
            y2={halfD}
            stroke="#94a3b8"
            strokeWidth="12"
          />
          <line
            x1={-halfW}
            y1={-halfD + depth * 0.5}
            x2={halfW}
            y2={-halfD + depth * 0.5}
            stroke="#cbd5e1"
            strokeWidth="8"
            strokeDasharray="20 20"
          />
        </g>
      ) : null}

      {/* Furniture Name Label */}
      <text
        x="0"
        y="12"
        textAnchor="middle"
        fontSize={Math.min(90, Math.max(50, width / 18))}
        fontWeight="500"
        fill={isSelected ? "#1d4ed8" : "#475569"}
        className="pointer-events-none select-none font-sans"
      >
        {definitionId}
      </text>
    </g>
  );
}
