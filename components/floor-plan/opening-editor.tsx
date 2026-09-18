"use client";

import * as React from "react";
import {
  AlertCircle,
  Check,
  DoorOpen,
  Eye,
  Minus,
  Plus,
  RotateCcw,
  SlidersHorizontal,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { FloorPlan } from "@/lib/floor-plan/types";
import {
  DEFAULT_OPENING_END_MARGIN_MM,
  getOpeningEditDetails,
  MIN_OPENING_WIDTH_MM,
  previewOpeningUpdate,
  updateOpening,
  type UpdateOpeningResult,
} from "@/lib/floor-plan/opening-adjustment";
import { cn } from "@/lib/utils";

interface OpeningEditorProps {
  plan: FloorPlan;
  openingId: string;
  onUpdatePlan?: (updatedPlan: FloorPlan) => void;
  className?: string;
}

export function OpeningEditor({
  plan,
  openingId,
  onUpdatePlan,
  className = "",
}: OpeningEditorProps) {
  const [endMarginInput, setEndMarginInput] = React.useState<string>(
    String(DEFAULT_OPENING_END_MARGIN_MM),
  );

  const marginNum = React.useMemo(() => {
    const val = Number(endMarginInput);
    return isNaN(val) ? DEFAULT_OPENING_END_MARGIN_MM : val;
  }, [endMarginInput]);

  const details = React.useMemo(
    () => getOpeningEditDetails(plan, openingId, marginNum),
    [plan, openingId, marginNum],
  );

  const [widthInput, setWidthInput] = React.useState<string>(
    details?.opening.width ? String(details.opening.width) : "900",
  );
  const [positionRatio, setPositionRatio] = React.useState<number>(
    details?.opening.position ?? 0.5,
  );

  const [previewResult, setPreviewResult] = React.useState<UpdateOpeningResult | null>(null);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  // Sync state whenever opening changes in plan
  React.useEffect(() => {
    if (details) {
      setWidthInput(String(details.opening.width));
      setPositionRatio(details.opening.position);
      setPreviewResult(null);
      setErrorMessage(null);
    }
  }, [details?.opening.id, details?.opening.width, details?.opening.position]);

  if (!details) {
    return (
      <div className="rounded-lg border border-border/70 p-3 text-xs text-muted-foreground">
        Opening metadata cannot be found or attached wall is invalid.
      </div>
    );
  }

  const handlePreview = () => {
    const widthMm = Number(widthInput);
    const result = previewOpeningUpdate(plan, {
      openingId,
      widthMm,
      positionRatio,
      endMarginMm: marginNum,
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
    const widthMm = Number(widthInput);
    const result = updateOpening(plan, {
      openingId,
      widthMm,
      positionRatio,
      endMarginMm: marginNum,
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
    setWidthInput(String(details.opening.width));
    setPositionRatio(details.opening.position);
    setEndMarginInput(String(DEFAULT_OPENING_END_MARGIN_MM));
    setPreviewResult(null);
    setErrorMessage(null);
  };

  const handleWidthQuickStep = (stepMm: number) => {
    const current = Number(widthInput) || details.opening.width;
    const next = Math.max(MIN_OPENING_WIDTH_MM, current + stepMm);
    setWidthInput(String(next));
    setPreviewResult(null);
    setErrorMessage(null);
  };

  return (
    <div
      data-testid="opening-editor"
      className={cn("space-y-3 rounded-xl border border-border bg-muted/20 p-3 text-xs", className)}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <DoorOpen className="h-3.5 w-3.5 text-primary" />
          <span className="font-semibold text-foreground">Opening Adjustment</span>
        </div>
        <Badge
          data-testid="opening-type-badge"
          variant="outline"
          className="font-mono text-[10px] capitalize"
        >
          {details.opening.type.replace("_", " ")}
        </Badge>
      </div>

      {/* Wall attachment badge */}
      <div className="flex items-center justify-between rounded-lg border border-border/70 bg-background/80 px-2.5 py-1.5">
        <span className="text-[11px] text-muted-foreground">Attached Wall</span>
        <span className="font-mono font-medium text-foreground">
          {details.wall.id} ({Math.round(details.wallLengthMm)} mm)
        </span>
      </div>

      {/* Width Input with Quick Buttons */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-[11px] text-muted-foreground">Opening Width</label>
          <span className="font-mono text-[10px] text-muted-foreground">
            Max: {Math.round(details.maxAllowedWidthMm)} mm
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <Button
            type="button"
            size="sm"
            variant="outline"
            data-testid="width-dec-btn"
            onClick={() => handleWidthQuickStep(-100)}
            className="h-8 w-8 p-0 shrink-0"
            title="Decrease width by 100 mm"
          >
            <Minus className="h-3.5 w-3.5" />
          </Button>

          <div className="relative flex-1">
            <Input
              data-testid="opening-width-input"
              type="number"
              value={widthInput}
              onChange={(e) => {
                setWidthInput(e.target.value);
                setPreviewResult(null);
                setErrorMessage(null);
              }}
              placeholder="Width in mm"
              className="h-8 pr-10 font-mono text-xs bg-background"
            />
            <span className="absolute right-3 top-2 font-mono text-[11px] text-muted-foreground pointer-events-none">
              mm
            </span>
          </div>

          <Button
            type="button"
            size="sm"
            variant="outline"
            data-testid="width-inc-btn"
            onClick={() => handleWidthQuickStep(100)}
            className="h-8 w-8 p-0 shrink-0"
            title="Increase width by 100 mm"
          >
            <Plus className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Position Ratio Slider & Distance */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-[11px] text-muted-foreground">Position Along Wall</label>
          <div className="flex items-center gap-1 font-mono text-[11px] text-foreground font-medium">
            <span>{(positionRatio * 100).toFixed(1)}%</span>
            <span className="text-muted-foreground">
              ({Math.round(positionRatio * details.wallLengthMm)} mm)
            </span>
          </div>
        </div>

        <input
          type="range"
          data-testid="opening-position-slider"
          min="0"
          max="1"
          step="0.01"
          value={positionRatio}
          onChange={(e) => {
            setPositionRatio(Number(e.target.value));
            setPreviewResult(null);
            setErrorMessage(null);
          }}
          className="w-full accent-primary h-2 bg-background rounded-lg cursor-pointer border border-border"
        />

        <div className="flex justify-between text-[10px] font-mono text-muted-foreground px-0.5">
          <span>Start ({(details.minPositionRatio * 100).toFixed(0)}%)</span>
          <span>Center (50%)</span>
          <span>End ({(details.maxPositionRatio * 100).toFixed(0)}%)</span>
        </div>
      </div>

      {/* End Margin Setting */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <label className="text-[11px] text-muted-foreground">End Margin</label>
          <span className="font-mono text-[10px] text-muted-foreground">Configurable</span>
        </div>
        <div className="relative flex items-center">
          <Input
            data-testid="opening-end-margin-input"
            type="number"
            value={endMarginInput}
            onChange={(e) => {
              setEndMarginInput(e.target.value);
              setPreviewResult(null);
              setErrorMessage(null);
            }}
            placeholder="Margin in mm"
            className="h-8 pr-10 font-mono text-xs bg-background"
          />
          <span className="absolute right-3 font-mono text-[11px] text-muted-foreground pointer-events-none">
            mm
          </span>
        </div>
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div
          data-testid="opening-error-alert"
          className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-2.5 text-xs text-destructive animate-in fade-in-50"
        >
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <span data-testid="opening-error-message" className="leading-tight">
            {errorMessage}
          </span>
        </div>
      )}

      {/* Preview Simulation Details */}
      {previewResult && previewResult.success && (
        <div
          data-testid="opening-preview-details"
          className="space-y-1.5 rounded-lg border border-primary/20 bg-primary/5 p-2.5 text-xs animate-in fade-in-50"
        >
          <div className="flex items-center justify-between">
            <span className="font-medium text-foreground">Preview Width:</span>
            <span
              data-testid="preview-opening-width"
              className="font-mono font-semibold text-primary"
            >
              {previewResult.opening.width} mm
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Preview Position:</span>
            <span
              data-testid="preview-opening-position"
              className="font-mono text-foreground font-semibold"
            >
              {(previewResult.opening.position * 100).toFixed(1)}% (
              {Math.round(previewResult.distanceFromStartMm)} mm)
            </span>
          </div>
        </div>
      )}

      {/* Action Buttons: Preview, Apply, Cancel */}
      <div className="flex items-center gap-1.5 pt-1">
        <Button
          type="button"
          size="sm"
          variant="outline"
          data-testid="preview-opening-btn"
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
          data-testid="apply-opening-btn"
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
          data-testid="cancel-opening-btn"
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
