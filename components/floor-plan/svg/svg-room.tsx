import * as React from "react";
import type { Room, Vertex, Wall } from "@/lib/floor-plan";
import {
  computePolygonArea,
  computePolygonCentroid,
  computeRoomPolygon,
} from "@/lib/floor-plan/geometry";
import type { EntitySelectHandler, SelectedEntity } from "../types";

interface SvgRoomProps {
  room: Room;
  wallMap: Map<string, Wall>;
  vertexMap: Map<string, Vertex>;
  selectedEntity: SelectedEntity | null;
  onSelect: EntitySelectHandler;
}

const ROOM_THEMES: Record<
  string,
  { fill: string; stroke: string; labelColor: string; defaultName: string }
> = {
  living_room: {
    fill: "rgba(245, 158, 11, 0.09)",
    stroke: "rgba(245, 158, 11, 0.35)",
    labelColor: "#b45309",
    defaultName: "Living Room",
  },
  bedroom: {
    fill: "rgba(99, 102, 241, 0.09)",
    stroke: "rgba(99, 102, 241, 0.35)",
    labelColor: "#4338ca",
    defaultName: "Bedroom",
  },
  master_bedroom: {
    fill: "rgba(79, 70, 229, 0.12)",
    stroke: "rgba(79, 70, 229, 0.4)",
    labelColor: "#3730a3",
    defaultName: "Master Bedroom",
  },
  kitchen: {
    fill: "rgba(16, 185, 129, 0.09)",
    stroke: "rgba(16, 185, 129, 0.35)",
    labelColor: "#047857",
    defaultName: "Kitchen",
  },
  bathroom: {
    fill: "rgba(6, 182, 212, 0.09)",
    stroke: "rgba(6, 182, 212, 0.35)",
    labelColor: "#0e7490",
    defaultName: "Bathroom",
  },
  balcony: {
    fill: "rgba(20, 184, 166, 0.09)",
    stroke: "rgba(20, 184, 166, 0.35)",
    labelColor: "#0f766e",
    defaultName: "Balcony",
  },
  dining_room: {
    fill: "rgba(234, 88, 12, 0.09)",
    stroke: "rgba(234, 88, 12, 0.35)",
    labelColor: "#c2410c",
    defaultName: "Dining Room",
  },
  study: {
    fill: "rgba(139, 92, 246, 0.09)",
    stroke: "rgba(139, 92, 246, 0.35)",
    labelColor: "#6d28d9",
    defaultName: "Study",
  },
  hallway: {
    fill: "rgba(148, 163, 184, 0.09)",
    stroke: "rgba(148, 163, 184, 0.35)",
    labelColor: "#475569",
    defaultName: "Hallway",
  },
  storage: {
    fill: "rgba(120, 113, 108, 0.09)",
    stroke: "rgba(120, 113, 108, 0.35)",
    labelColor: "#57534e",
    defaultName: "Storage",
  },
  other: {
    fill: "rgba(100, 116, 139, 0.08)",
    stroke: "rgba(100, 116, 139, 0.3)",
    labelColor: "#475569",
    defaultName: "Room",
  },
};

export function SvgRoom({
  room,
  wallMap,
  vertexMap,
  selectedEntity,
  onSelect,
}: SvgRoomProps) {
  const points = React.useMemo(
    () => computeRoomPolygon(room, wallMap, vertexMap),
    [room, wallMap, vertexMap],
  );

  const { formattedAreaM2 } = React.useMemo(
    () => computePolygonArea(points),
    [points],
  );

  const centroid = React.useMemo(
    () => computePolygonCentroid(points),
    [points],
  );

  const isSelected =
    selectedEntity?.type === "room" && selectedEntity?.id === room.id;

  if (points.length < 3) return null;

  const pointsString = points.map((p) => `${p.x},${p.y}`).join(" ");
  const theme = ROOM_THEMES[room.type] ?? ROOM_THEMES.other;
  const displayName = room.name ?? theme.defaultName;

  return (
    <g
      data-testid={`floor-plan-room-${room.id}`}
      data-entity-type="room"
      data-entity-id={room.id}
      data-selected={isSelected ? "true" : "false"}
      className="cursor-pointer transition-colors duration-150"
      onClick={(e) => {
        e.stopPropagation();
        onSelect({ type: "room", id: room.id });
      }}
    >
      <polygon
        points={pointsString}
        fill={isSelected ? "rgba(59, 130, 246, 0.2)" : theme.fill}
        stroke={isSelected ? "#2563eb" : theme.stroke}
        strokeWidth={isSelected ? 40 : 16}
        strokeDasharray={isSelected ? "80 40" : undefined}
      />
      {/* Room Label and Area */}
      <g
        transform={`translate(${centroid.x}, ${centroid.y})`}
        className="pointer-events-none select-none text-center"
      >
        <rect
          x="-350"
          y="-160"
          width="700"
          height="320"
          rx="60"
          fill="var(--card, #ffffff)"
          fillOpacity="0.85"
          stroke={isSelected ? "#2563eb" : "rgba(148, 163, 184, 0.4)"}
          strokeWidth="10"
        />
        <text
          x="0"
          y="-30"
          textAnchor="middle"
          fontSize="140"
          fontWeight="600"
          fill="currentColor"
          className="fill-foreground font-sans tracking-tight"
        >
          {displayName}
        </text>
        <text
          x="0"
          y="110"
          textAnchor="middle"
          fontSize="110"
          fontWeight="500"
          fill={theme.labelColor}
          className="font-mono tracking-normal"
        >
          {formattedAreaM2}
        </text>
      </g>
    </g>
  );
}
