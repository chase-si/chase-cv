"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { FloorPlan } from "@/lib/floor-plan/types";
import {
  computePolygonArea,
  computeRoomPolygon,
  getVertexMap,
  getWallMap,
} from "@/lib/floor-plan/geometry";
import { getRoomSpans } from "@/lib/floor-plan/room-adjustment";
import { useFloorPlanI18n } from "@/lib/floor-plan/i18n";
import { cn } from "@/lib/utils";

export interface RoomListProps {
  plan: FloorPlan;
  targetRoomId: string | null;
  onSelectRoom: (roomId: string) => void;
  locale?: string;
  className?: string;
  compact?: boolean;
}

export function RoomList({
  plan,
  targetRoomId,
  onSelectRoom,
  locale,
  className = "",
  compact = false,
}: RoomListProps) {
  const i18n = useFloorPlanI18n(locale);
  const vertexMap = React.useMemo(() => getVertexMap(plan), [plan]);
  const wallMap = React.useMemo(() => getWallMap(plan), [plan]);

  const roomItems = React.useMemo(() => {
    return plan.rooms.map((room) => {
      const points = computeRoomPolygon(room, wallMap, vertexMap);
      const { formattedAreaM2 } = computePolygonArea(points);
      const spans = getRoomSpans(plan, room.id);
      const displayName =
        room.name ??
        (locale === "zh"
          ? i18n.getRoomTypeLabel(room.type)
          : room.type.replace("_", " "));

      return {
        room,
        displayName,
        formattedAreaM2,
        spans,
        isSelected: targetRoomId === room.id,
      };
    });
  }, [plan, wallMap, vertexMap, locale, i18n, targetRoomId]);

  return (
    <div
      data-testid="room-list"
      role="listbox"
      aria-label={i18n.t.workflow?.roomListAriaLabel || (locale === "zh" ? "户型房间选择列表" : "Room selection list")}
      className={cn(compact ? "grid grid-cols-2 gap-2" : "flex flex-col gap-1.5", className)}
    >
      {roomItems.map(({ room, displayName, formattedAreaM2, spans, isSelected }) => (
        <button
          key={room.id}
          type="button"
          role="option"
          data-testid={`room-item-${room.id}`}
          data-selected={isSelected ? "true" : "false"}
          aria-selected={isSelected}
          aria-label={`${displayName}, ${formattedAreaM2}${isSelected ? (locale === "zh" ? "，已选为目标房间" : ", selected target room") : ""}`}
          onClick={() => onSelectRoom(room.id)}
          className={cn(
            "group flex w-full items-center justify-between rounded-xl border p-2.5 min-h-[44px] text-left text-xs transition-all touch-manipulation focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary",
            compact && "p-2",
            isSelected
              ? "border-primary/40 bg-primary/10 text-foreground font-semibold shadow-xs"
              : "border-border/70 bg-card text-muted-foreground hover:border-border hover:bg-muted/30 hover:text-foreground",
          )}
        >
          <div className="min-w-0 flex-1 space-y-0.5">
            <div className="flex items-center gap-1.5">
              <span className="truncate text-xs font-semibold text-foreground">
                {displayName}
              </span>
              {isSelected && (
                <Badge
                  variant="default"
                  className="h-4 px-1 text-[9px] font-medium"
                >
                  {locale === "zh" ? "目标房间" : "Target"}
                </Badge>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground font-mono">
              <span>{formattedAreaM2}</span>
              {!compact && spans?.horizontal && spans?.vertical && (
                <span className="text-muted-foreground/70">
                  {spans.horizontal.spanMm} × {spans.vertical.spanMm} mm
                </span>
              )}
            </div>
          </div>

          <div
            className={cn(
              "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors",
              isSelected
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border/80 bg-background text-transparent group-hover:border-muted-foreground/50",
            )}
          >
            <Check className="h-3 w-3 stroke-[3]" />
          </div>
        </button>
      ))}
    </div>
  );
}
