import * as React from "react";
import { CircleAlert } from "lucide-react";
import type { FurnitureInstance } from "@/lib/floor-plan";
import type { AssessmentStatus } from "@/lib/floor-plan/types";
import { cn } from "@/lib/utils";
import { getAssessmentStatusLabel, useFloorPlanI18n } from "@/lib/floor-plan/i18n";
import type { EntitySelectHandler, SelectedEntity } from "../types";

interface SvgFurnitureProps {
  furniture: FurnitureInstance;
  selectedEntity: SelectedEntity | null;
  onSelect: EntitySelectHandler;
  isDraftMode?: boolean;
  onRotate?: (id: string, stepDeg?: number) => void;
  onDragStart?: (e: React.PointerEvent, furniture: FurnitureInstance) => void;
  hasViolation?: boolean;
  assessmentStatus?: AssessmentStatus;
  locale?: string;
}

export function SvgFurniture({
  furniture,
  selectedEntity,
  onSelect,
  isDraftMode = false,
  onRotate,
  onDragStart,
  hasViolation = false,
  assessmentStatus,
  locale,
}: SvgFurnitureProps) {
  const i18n = useFloorPlanI18n(locale);
  const isSelected =
    selectedEntity?.type === "furniture" && selectedEntity?.id === furniture.id;

  const { x, y, width, depth, rotation, definitionId } = furniture;
  const localizedName = i18n.getFurnitureName(definitionId);
  const status = assessmentStatus ?? (hasViolation ? "must-adjust" : "suitable");
  const hasAlert = hasViolation && (status === "must-adjust" || status === "trade-off");
  const halfW = width / 2;
  const halfD = depth / 2;

  const isBed = definitionId.includes("bed");
  const isSofa = definitionId.includes("sofa");
  const isTable = definitionId.includes("table");
  const isDesk = definitionId.includes("desk");
  const isWardrobe = definitionId.includes("wardrobe") || definitionId.includes("storage");
  const isChair = definitionId.includes("chair") || definitionId.includes("armchair");
  const isTvStand = definitionId.includes("tv-stand") || definitionId.includes("tv_stand");

  return (
    <g
      data-testid={`floor-plan-furniture-${furniture.id}`}
      data-entity-type="furniture"
      data-entity-id={furniture.id}
      data-specification-id={furniture.specificationId ?? ""}
      data-width={width}
      data-depth={depth}
      data-selected={isSelected ? "true" : "false"}
      data-has-violation={hasAlert ? "true" : "false"}
      data-assessment-status={status}
      transform={`translate(${x}, ${y}) rotate(${rotation})`}
      tabIndex={0}
      role="button"
      aria-label={`${localizedName} (${width} × ${depth} mm) ${furniture.id}`}
      aria-pressed={isSelected}
      aria-selected={isSelected}
      className={
        isDraftMode
          ? "cursor-move focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
          : "cursor-pointer focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
      }
      onPointerDown={(e) => {
        if (e.button !== 0) return;
        onSelect({ type: "furniture", id: furniture.id });
        if (isDraftMode && onDragStart) {
          onDragStart(e, furniture);
        }
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect({ type: "furniture", id: furniture.id });
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          e.stopPropagation();
          onSelect({ type: "furniture", id: furniture.id });
        } else if ((e.key === "r" || e.key === "R") && !e.ctrlKey && !e.metaKey && !e.altKey) {
          e.preventDefault();
          e.stopPropagation();
          onSelect({ type: "furniture", id: furniture.id });
          onRotate?.(furniture.id, 90);
        }
      }}
    >
      {/* Outer base box */}
      <rect
        data-testid={`furniture-footprint-${furniture.id}`}
        x={-halfW}
        y={-halfD}
        width={width}
        height={depth}
        rx={Math.min(60, width / 10)}
        fill={
          isSelected
            ? "rgba(59, 130, 246, 0.15)"
            : hasAlert
              ? "currentColor"
              : "#f8fafc"
        }
        stroke={
          isSelected
            ? "#2563eb"
            : hasAlert
              ? "currentColor"
              : "#64748b"
        }
        strokeWidth={isSelected ? 32 : hasAlert ? 28 : 16}
        strokeDasharray={hasAlert && !isSelected ? "40 20" : undefined}
        fillOpacity={!isSelected && hasAlert ? 0.1 : undefined}
        className={cn("transition-colors duration-150", hasAlert && (status === "trade-off" ? "text-amber-500" : "text-destructive"))}
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
      ) : isChair ? (
        <g>
          {/* Chair seat and curved back */}
          <rect
            x={-halfW * 0.75}
            y={-halfD * 0.75}
            width={width * 0.75}
            height={depth * 0.75}
            rx="15"
            fill="#e2e8f0"
            stroke="#94a3b8"
            strokeWidth="8"
          />
          <path
            d={`M ${-halfW * 0.8} ${-halfD * 0.4} C ${-halfW * 0.8} ${-halfD * 0.9}, ${halfW * 0.8} ${-halfD * 0.9}, ${halfW * 0.8} ${-halfD * 0.4}`}
            fill="none"
            stroke="#64748b"
            strokeWidth="12"
          />
        </g>
      ) : isTvStand ? (
        <g>
          {/* Stand top and screen bar */}
          <rect
            x={-halfW + 40}
            y={-halfD + 40}
            width={width - 80}
            height={depth - 80}
            rx="10"
            fill="#e2e8f0"
            stroke="#94a3b8"
            strokeWidth="8"
          />
          <rect
            x={-halfW * 0.6}
            y={-15}
            width={width * 0.6}
            height={30}
            rx="5"
            fill="#334155"
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
        {localizedName}
      </text>

      {/* Violation Alert Badge on canvas (AC-12) */}
      {hasAlert && (
        <g
          data-testid={`furniture-violation-badge-${furniture.id}`}
          transform={`translate(${halfW - 25}, ${-halfD + 25})`}
          data-assessment-status={status}
          className={cn("pointer-events-none", status === "trade-off" ? "text-amber-500" : "text-destructive")}
        >
          <title>{getAssessmentStatusLabel(status, locale)}</title>
          <CircleAlert x={-78} y={-78} width={156} height={156} className="fill-background" strokeWidth={2} />
        </g>
      )}

      {/* 90° Rotation handle on canvas when selected in draft mode (AC-11) */}
      {isSelected && isDraftMode && onRotate && (
        <g
          data-testid={`canvas-rotate-furniture-${furniture.id}`}
          className="cursor-pointer"
          transform={`translate(0, ${-halfD - 80})`}
          onClick={(e) => {
            e.stopPropagation();
            onRotate(furniture.id, 90);
          }}
        >
          <circle
            r="78"
            fill="#2563eb"
            stroke="#ffffff"
            strokeWidth="9"
            className="hover:scale-110 transition-transform"
          />
          {/* Circular arrow icon */}
          <path
            d="M -30 -10 A 38 38 0 1 1 0 42 L 0 20 M 0 42 L -22 42"
            fill="none"
            stroke="#ffffff"
            strokeWidth="12"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      )}
    </g>
  );
}
