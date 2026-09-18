"use client";

import * as React from "react";
import { AlertCircle, ArrowRight, Check, Eye, RotateCcw, SlidersHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { FloorPlan } from "@/lib/floor-plan/types";
import {
  adjustRoomSpan,
  getRoomSpans,
  previewRoomSpanAdjustment,
  type RoomSpanAdjustmentResult,
} from "@/lib/floor-plan/room-adjustment";
import { cn } from "@/lib/utils";

interface RoomSpanEditorProps {
  plan: FloorPlan;
  roomId: string;
  onUpdatePlan?: (updatedPlan: FloorPlan) => void;
  className?: string;
}

export function RoomSpanEditor({
  plan,
  roomId,
  onUpdatePlan,
  className = "",
}: RoomSpanEditorProps) {
  const spans = React.useMemo(() => getRoomSpans(plan, roomId), [plan, roomId]);

  // Active axis to edit: "horizontal" (Width) or "vertical" (Depth)
  const [activeAxis, setActiveAxis] = React.useState<"horizontal" | "vertical">(
    spans?.horizontal ? "horizontal" : spans?.vertical ? "vertical" : "horizontal",
  );

  // Which boundary side to translate along its normal: "max" (right/bottom) or "min" (left/top)
  const [boundarySide, setBoundarySide] = React.useState<"min" | "max">("max");

  // Numeric input string
  const currentSpan = activeAxis === "horizontal" ? spans?.horizontal?.spanMm : spans?.vertical?.spanMm;
  const [inputVal, setInputVal] = React.useState<string>(
    currentSpan !== undefined ? String(currentSpan) : "",
  );

  // Preview result and error state
  const [previewResult, setPreviewResult] = React.useState<RoomSpanAdjustmentResult | null>(null);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  // Sync input when activeAxis or plan changes
  React.useEffect(() => {
    const span = activeAxis === "horizontal" ? spans?.horizontal?.spanMm : spans?.vertical?.spanMm;
    if (span !== undefined) {
      setInputVal(String(span));
      setPreviewResult(null);
      setErrorMessage(null);
    }
  }, [activeAxis, spans]);

  if (!spans) {
    return (
      <div className="rounded-lg border border-border/70 p-3 text-xs text-muted-foreground">
        Room boundaries cannot be automatically resolved for span editing.
      </div>
    );
  }

  const handlePreview = () => {
    const num = Number(inputVal);
    const result = previewRoomSpanAdjustment({
      plan,
      roomId,
      axis: activeAxis,
      boundarySide,
      targetSpanMm: num,
    });

    if (result.success) {
      setPreviewResult(result);
      setErrorMessage(null);
    } else {
      setPreviewResult(null);
      setErrorMessage(result.error);
    }
  };

  const handleApply = () => {
    const num = Number(inputVal);
    const result = adjustRoomSpan({
      plan,
      roomId,
      axis: activeAxis,
      boundarySide,
      targetSpanMm: num,
    });

    if (result.success) {
      setPreviewResult(null);
      setErrorMessage(null);
      onUpdatePlan?.(result.plan);
    } else {
      setPreviewResult(null);
      setErrorMessage(result.error);
    }
  };

  const handleCancel = () => {
    if (currentSpan !== undefined) {
      setInputVal(String(currentSpan));
    }
    setPreviewResult(null);
    setErrorMessage(null);
  };

  return (
    <div
      data-testid="room-span-editor"
      className={cn("space-y-3 rounded-xl border border-border bg-muted/20 p-3 text-xs", className)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <SlidersHorizontal className="h-3.5 w-3.5 text-primary" />
          <span className="font-semibold text-foreground">Room Span Adjustment</span>
        </div>
        <Badge variant="outline" className="font-mono text-[10px]">
          mm
        </Badge>
      </div>

      {/* Axis Selection Tabs */}
      <div className="grid grid-cols-2 gap-1.5 rounded-lg border border-border bg-background p-1">
        <button
          type="button"
          data-testid="select-axis-horizontal"
          onClick={() => {
            setActiveAxis("horizontal");
            setBoundarySide("max");
          }}
          disabled={!spans.horizontal}
          className={cn(
            "flex flex-col items-start rounded-md px-2 py-1.5 text-left transition-all",
            activeAxis === "horizontal"
              ? "bg-primary text-primary-foreground font-semibold shadow-xs"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          <span className="text-[10px] uppercase tracking-wider opacity-80">Width (X)</span>
          <span data-testid="room-span-summary-width" className="font-mono text-xs">
            {spans.horizontal ? `${spans.horizontal.spanMm} mm` : "N/A"}
          </span>
        </button>

        <button
          type="button"
          data-testid="select-axis-vertical"
          onClick={() => {
            setActiveAxis("vertical");
            setBoundarySide(spans.vertical ? "min" : "max");
          }}
          disabled={!spans.vertical}
          className={cn(
            "flex flex-col items-start rounded-md px-2 py-1.5 text-left transition-all",
            activeAxis === "vertical"
              ? "bg-primary text-primary-foreground font-semibold shadow-xs"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          <span className="text-[10px] uppercase tracking-wider opacity-80">Depth (Y)</span>
          <span data-testid="room-span-summary-depth" className="font-mono text-xs">
            {spans.vertical ? `${spans.vertical.spanMm} mm` : "N/A"}
          </span>
        </button>
      </div>

      {/* Boundary Edge Selector */}
      <div className="space-y-1">
        <label className="text-[11px] text-muted-foreground">Moving Boundary</label>
        <div className="grid grid-cols-2 gap-1.5">
          {activeAxis === "horizontal" ? (
            <>
              <button
                type="button"
                data-testid="boundary-side-max"
                onClick={() => setBoundarySide("max")}
                className={cn(
                  "rounded-lg border px-2 py-1.5 text-center text-xs transition-colors",
                  boundarySide === "max"
                    ? "border-primary bg-primary/10 text-primary font-medium"
                    : "border-border bg-card text-muted-foreground hover:text-foreground",
                )}
              >
                Right Wall
              </button>
              <button
                type="button"
                data-testid="boundary-side-min"
                onClick={() => setBoundarySide("min")}
                className={cn(
                  "rounded-lg border px-2 py-1.5 text-center text-xs transition-colors",
                  boundarySide === "min"
                    ? "border-primary bg-primary/10 text-primary font-medium"
                    : "border-border bg-card text-muted-foreground hover:text-foreground",
                )}
              >
                Left Wall
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                data-testid="boundary-side-max"
                onClick={() => setBoundarySide("max")}
                className={cn(
                  "rounded-lg border px-2 py-1.5 text-center text-xs transition-colors",
                  boundarySide === "max"
                    ? "border-primary bg-primary/10 text-primary font-medium"
                    : "border-border bg-card text-muted-foreground hover:text-foreground",
                )}
              >
                Bottom Wall
              </button>
              <button
                type="button"
                data-testid="boundary-side-min"
                onClick={() => setBoundarySide("min")}
                className={cn(
                  "rounded-lg border px-2 py-1.5 text-center text-xs transition-colors",
                  boundarySide === "min"
                    ? "border-primary bg-primary/10 text-primary font-medium"
                    : "border-border bg-card text-muted-foreground hover:text-foreground",
                )}
              >
                Top Wall
              </button>
            </>
          )}
        </div>
      </div>

      {/* Target Span Numeric Input */}
      <div className="space-y-1">
        <label className="text-[11px] text-muted-foreground">Target Span</label>
        <div className="relative flex items-center">
          <Input
            data-testid="target-span-input"
            type="number"
            value={inputVal}
            onChange={(e) => {
              setInputVal(e.target.value);
              setPreviewResult(null);
              setErrorMessage(null);
            }}
            placeholder="Dimension in mm"
            className="h-8 pr-10 font-mono text-xs bg-background"
          />
          <span className="absolute right-3 font-mono text-[11px] text-muted-foreground pointer-events-none">
            mm
          </span>
        </div>
      </div>

      {/* Error Alert (AC-7) */}
      {errorMessage && (
        <div
          data-testid="span-error-alert"
          className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-2.5 text-xs text-destructive animate-in fade-in-50"
        >
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <span data-testid="span-error-message" className="leading-tight">
            {errorMessage}
          </span>
        </div>
      )}

      {/* Preview Simulation (AC-6, AC-7) */}
      {previewResult && previewResult.success && (
        <div
          data-testid="span-preview-details"
          className="space-y-1.5 rounded-lg border border-primary/20 bg-primary/5 p-2.5 text-xs animate-in fade-in-50"
        >
          <div className="flex items-center justify-between">
            <span className="font-medium text-foreground">Preview Dimension:</span>
            <span data-testid="preview-new-span" className="font-mono font-semibold text-primary">
              {previewResult.newSpanMm} mm
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Adjustment Delta:</span>
            <span data-testid="preview-delta" className="font-mono text-foreground">
              {previewResult.deltaMm > 0 ? `+${previewResult.deltaMm}` : previewResult.deltaMm} mm
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">New Room Area:</span>
            <span data-testid="preview-new-area" className="font-mono font-semibold text-foreground">
              {(previewResult.newAreaMm2 / 1_000_000).toFixed(1)} m²
            </span>
          </div>
        </div>
      )}

      {/* Control Actions: Preview, Apply, Cancel */}
      <div className="flex items-center gap-1.5 pt-1">
        <Button
          type="button"
          size="sm"
          variant="outline"
          data-testid="preview-span-btn"
          onClick={handlePreview}
          className="h-8 flex-1 text-xs flex items-center justify-center gap-1"
        >
          <Eye className="h-3.5 w-3.5 text-primary" />
          <span>Preview</span>
        </Button>

        <Button
          type="button"
          size="sm"
          variant="default"
          data-testid="apply-span-btn"
          onClick={handleApply}
          className="h-8 flex-1 text-xs flex items-center justify-center gap-1"
        >
          <Check className="h-3.5 w-3.5" />
          <span>Apply</span>
        </Button>

        <Button
          type="button"
          size="sm"
          variant="ghost"
          data-testid="cancel-span-btn"
          onClick={handleCancel}
          className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground"
          title="Cancel changes"
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
