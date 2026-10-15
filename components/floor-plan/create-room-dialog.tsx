"use client";

import * as React from "react";
import { PlusSquare, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  DEFAULT_ROOM_DEPTH_MM,
  DEFAULT_ROOM_WIDTH_MM,
  FIXED_WALL_THICKNESS_MM,
} from "@/lib/floor-plan/rectangular-room";

export interface CreateRoomDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateRoom: (params: { name?: string; widthMm: number; depthMm: number }) => void;
  locale?: string;
  className?: string;
}

export function CreateRoomDialog({
  open,
  onOpenChange,
  onCreateRoom,
  locale = "zh",
  className,
}: CreateRoomDialogProps) {
  const isZh = locale.startsWith("zh");

  const [name, setName] = React.useState("");
  const [widthStr, setWidthStr] = React.useState(String(DEFAULT_ROOM_WIDTH_MM));
  const [depthStr, setDepthStr] = React.useState(String(DEFAULT_ROOM_DEPTH_MM));

  // Reset inputs when opened
  /* eslint-disable react-hooks/set-state-in-effect */
  React.useEffect(() => {
    if (open) {
      setName("");
      setWidthStr(String(DEFAULT_ROOM_WIDTH_MM));
      setDepthStr(String(DEFAULT_ROOM_DEPTH_MM));
    }
  }, [open]);
  /* eslint-enable react-hooks/set-state-in-effect */

  // Handle escape key
  React.useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onOpenChange(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onOpenChange]);

  if (!open) return null;

  const widthNum = Number(widthStr);
  const depthNum = Number(depthStr);

  const isWidthValid =
    Number.isInteger(widthNum) && widthNum > 0 && widthStr.trim() !== "";
  const isDepthValid =
    Number.isInteger(depthNum) && depthNum > 0 && depthStr.trim() !== "";
  const isValid = isWidthValid && isDepthValid;

  let errorMessage: string | null = null;
  if (!isWidthValid || !isDepthValid) {
    errorMessage = isZh
      ? "墙内净宽和净深须为大于 0 的整数毫米"
      : "Net width and depth must be positive integers in mm";
  }

  const calculatedAreaM2 = isValid ? (widthNum * depthNum) / 1_000_000 : 0;
  const formattedArea = `${calculatedAreaM2.toFixed(1)} m²`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    onCreateRoom({
      name: name.trim() || undefined,
      widthMm: widthNum,
      depthMm: depthNum,
    });
    onOpenChange(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
      {/* Backdrop */}
      <div
        data-testid="create-room-backdrop"
        className="fixed inset-0 bg-foreground/30 backdrop-blur-xs transition-opacity"
        onClick={() => onOpenChange(false)}
        aria-hidden="true"
      />

      {/* Modal Popup */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-room-title"
        data-testid="create-room-dialog"
        className={cn(
          "relative z-10 flex w-full max-w-lg flex-col rounded-2xl border border-border bg-card p-0 shadow-2xl text-card-foreground outline-hidden overflow-hidden",
          className,
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-5 py-3.5 shrink-0 bg-card">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <PlusSquare className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <h2
                id="create-room-title"
                data-testid="create-room-title"
                className="text-sm font-semibold tracking-tight text-foreground truncate"
              >
                {isZh ? "新建矩形房间" : "Create Rectangular Room"}
              </h2>
              <p className="text-[11px] text-muted-foreground truncate">
                {isZh
                  ? "按实测墙内净尺寸快速建立独立房间"
                  : "Build an independent room with measured net dimensions"}
              </p>
            </div>
          </div>

          <Button
            type="button"
            size="icon"
            variant="ghost"
            data-testid="create-room-close-btn"
            onClick={() => onOpenChange(false)}
            className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground touch-manipulation"
            aria-label={isZh ? "关闭" : "Close"}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Room Name */}
          <div className="space-y-1.5">
            <label
              htmlFor="create-room-name-input"
              className="text-xs font-medium text-foreground block"
            >
              {isZh ? "房间名称（选填）" : "Room Name (Optional)"}
            </label>
            <Input
              id="create-room-name-input"
              data-testid="create-room-name-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={isZh ? "留空自动命名，例如：客厅、主卧" : "e.g., Living Room, Bedroom"}
              className="h-9 text-sm"
            />
          </div>

          {/* Width & Depth Inputs */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label
                htmlFor="create-room-width-input"
                className="text-xs font-medium text-foreground block"
              >
                {isZh ? "净宽 (mm)" : "Net Width (mm)"}
              </label>
              <Input
                id="create-room-width-input"
                data-testid="create-room-width-input"
                type="number"
                min="1"
                step="1"
                value={widthStr}
                onChange={(e) => setWidthStr(e.target.value)}
                className="h-9 font-mono text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <label
                htmlFor="create-room-depth-input"
                className="text-xs font-medium text-foreground block"
              >
                {isZh ? "净深 (mm)" : "Net Depth (mm)"}
              </label>
              <Input
                id="create-room-depth-input"
                data-testid="create-room-depth-input"
                type="number"
                min="1"
                step="1"
                value={depthStr}
                onChange={(e) => setDepthStr(e.target.value)}
                className="h-9 font-mono text-sm"
              />
            </div>
          </div>

          <p className="text-[11px] text-muted-foreground">
            {isZh
              ? `* 墙厚固定 ${FIXED_WALL_THICKNESS_MM} mm。墙中心线向外偏移半个墙厚，确保净使用面积完全符合实测。`
              : `* Wall thickness is fixed at ${FIXED_WALL_THICKNESS_MM} mm. Centerlines are offset outward so net space equals exact inputs.`}
          </p>

          {/* Live Preview Card */}
          {isValid ? (
            <div
              data-testid="create-room-preview"
              className="rounded-xl border border-primary/30 bg-primary/5 p-3 flex items-center justify-between"
            >
              <div>
                <p className="text-xs font-semibold text-foreground">
                  {name.trim() || (isZh ? "矩形房间" : "Rectangle Room")}
                </p>
                <p className="text-[11px] text-muted-foreground font-mono">
                  {widthNum} × {depthNum} mm
                </p>
              </div>
              <Badge variant="default" className="font-mono text-xs">
                {formattedArea}
              </Badge>
            </div>
          ) : (
            <div
              data-testid="create-room-error"
              className="rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-xs text-destructive"
            >
              {errorMessage}
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/70">
            <Button
              type="button"
              variant="outline"
              size="sm"
              data-testid="create-room-cancel-btn"
              onClick={() => onOpenChange(false)}
            >
              {isZh ? "取消" : "Cancel"}
            </Button>
            <Button
              type="submit"
              variant="default"
              size="sm"
              disabled={!isValid}
              data-testid="create-room-submit-btn"
            >
              {isZh ? "创建房间" : "Create Room"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
