"use client";

import * as React from "react";
import {
  AlertCircle,
  Check,
  Eye,
  Minus,
  Move,
  Plus,
  RotateCcw,
  RotateCw,
  SlidersHorizontal,
  Trash2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  getDefaultFurnitureCatalog,
  getFurnitureDefinitionById,
} from "@/lib/floor-plan/furniture-catalog";
import {
  deleteFurnitureInstance,
  moveFurnitureInstance,
  resizeFurnitureInstance,
  rotateFurnitureInstance,
} from "@/lib/floor-plan/furniture-operations";
import { useFloorPlanI18n } from "@/lib/floor-plan/i18n";
import type { FloorPlan, FurnitureCatalog } from "@/lib/floor-plan/types";
import { cn } from "@/lib/utils";
import type { SelectedEntity } from "./types";

interface FurnitureEditorProps {
  locale?: string;
  plan: FloorPlan;
  catalog?: FurnitureCatalog;
  furnitureId: string;
  onUpdatePlan?: (updatedPlan: FloorPlan) => void;
  onSelect?: (entity: SelectedEntity | null) => void;
  className?: string;
}

export function FurnitureEditor({
  locale,
  plan,
  catalog: propCatalog,
  furnitureId,
  onUpdatePlan,
  onSelect,
  className = "",
}: FurnitureEditorProps) {
  const i18n = useFloorPlanI18n(locale);
  const t = i18n.t.furnitureEditor;

  const catalog = React.useMemo(
    () => propCatalog ?? getDefaultFurnitureCatalog(),
    [propCatalog],
  );

  const instance = React.useMemo(
    () => plan.furniture.find((f) => f.id === furnitureId),
    [plan.furniture, furnitureId],
  );

  const definition = React.useMemo(() => {
    if (!instance) return undefined;
    return getFurnitureDefinitionById(catalog, instance.definitionId);
  }, [catalog, instance]);

  const widthRange = definition?.allowedSizeRanges?.width;
  const depthRange = definition?.allowedSizeRanges?.depth;

  const [xInput, setXInput] = React.useState<string>(
    instance ? String(instance.x) : "0",
  );
  const [yInput, setYInput] = React.useState<string>(
    instance ? String(instance.y) : "0",
  );
  const [widthInput, setWidthInput] = React.useState<string>(
    instance ? String(instance.width) : "1000",
  );
  const [depthInput, setDepthInput] = React.useState<string>(
    instance ? String(instance.depth) : "1000",
  );

  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [previewInfo, setPreviewInfo] = React.useState<{
    widthMm: number;
    depthMm: number;
  } | null>(null);

  // Synchronize input fields whenever active furniture instance updates
  React.useEffect(() => {
    if (instance) {
      setXInput(String(instance.x));
      setYInput(String(instance.y));
      setWidthInput(String(instance.width));
      setDepthInput(String(instance.depth));
      setErrorMessage(null);
      setPreviewInfo(null);
    }
  }, [instance?.id, instance?.x, instance?.y, instance?.width, instance?.depth, instance?.rotation]);

  if (!instance) {
    return (
      <div className="rounded-lg border border-border/70 p-3 text-xs text-muted-foreground">
        {t.notFound}
      </div>
    );
  }

  // Preview immediate resizing validation (AC-11)
  const handlePreview = () => {
    const w = Number(widthInput);
    const d = Number(depthInput);

    const testRes = resizeFurnitureInstance(plan, catalog, furnitureId, w, d);
    if (testRes.success) {
      setPreviewInfo({
        widthMm: testRes.instance.width,
        depthMm: testRes.instance.depth,
      });
      setErrorMessage(null);
    } else {
      setPreviewInfo(null);
      setErrorMessage(testRes.error);
    }
  };

  // Apply dimension & position changes (AC-11)
  const handleApply = () => {
    const w = Number(widthInput);
    const d = Number(depthInput);
    const posX = Number(xInput);
    const posY = Number(yInput);

    if (!Number.isFinite(posX) || !Number.isFinite(posY)) {
      setErrorMessage(t.invalidCoordinates);
      return;
    }

    // Step 1: Resize
    const resizeRes = resizeFurnitureInstance(plan, catalog, furnitureId, w, d);
    if (!resizeRes.success) {
      setErrorMessage(resizeRes.error);
      setPreviewInfo(null);
      return;
    }

    // Step 2: Move if coordinates changed
    let updatedPlan = resizeRes.plan;
    if (posX !== instance.x || posY !== instance.y) {
      const moveRes = moveFurnitureInstance(updatedPlan, furnitureId, posX, posY);
      if (!moveRes.success) {
        setErrorMessage(moveRes.error);
        return;
      }
      updatedPlan = moveRes.plan;
    }

    setErrorMessage(null);
    setPreviewInfo(null);
    onUpdatePlan?.(updatedPlan);
  };

  const handleCancel = () => {
    if (instance) {
      setXInput(String(instance.x));
      setYInput(String(instance.y));
      setWidthInput(String(instance.width));
      setDepthInput(String(instance.depth));
    }
    setErrorMessage(null);
    setPreviewInfo(null);
  };

  // 90° rotation step (AC-11)
  const handleRotate = (stepDeg: number = 90) => {
    const res = rotateFurnitureInstance(plan, furnitureId, stepDeg);
    if (res.success) {
      onUpdatePlan?.(res.plan);
    } else {
      setErrorMessage(res.error);
    }
  };

  // Deletion (AC-11)
  const handleDelete = () => {
    const res = deleteFurnitureInstance(plan, furnitureId);
    if (res.success) {
      onSelect?.(null);
      onUpdatePlan?.(res.plan);
    } else {
      setErrorMessage(res.error);
    }
  };

  // Quick width/depth stepping helper
  const handleStepDimension = (
    dimension: "width" | "depth",
    delta: number,
  ) => {
    if (dimension === "width") {
      const current = Number(widthInput) || instance.width;
      const next = current + delta;
      setWidthInput(String(next));
    } else {
      const current = Number(depthInput) || instance.depth;
      const next = current + delta;
      setDepthInput(String(next));
    }
    setPreviewInfo(null);
    setErrorMessage(null);
  };

  return (
    <div
      data-testid="furniture-editor"
      className={cn("space-y-3.5 rounded-xl border border-border bg-muted/20 p-3 text-xs", className)}
    >
      {/* 1. Header with Name and Category */}
      <div className="flex items-start justify-between gap-2 border-b border-border/60 pb-2.5">
        <div className="space-y-0.5 min-w-0">
          <p className="font-semibold text-sm text-foreground truncate">
            {definition ? i18n.getFurnitureName(instance.definitionId, definition.name) : instance.definitionId}
          </p>
          <span
            data-testid="furniture-instance-id"
            className="font-mono text-[10px] text-muted-foreground block truncate"
          >
            ID: {instance.id}
          </span>
        </div>
        <Badge
          data-testid="furniture-category-badge"
          variant="secondary"
          className="font-mono text-[10px] uppercase shrink-0"
        >
          {definition ? i18n.getFurnitureCategoryLabel(definition.category) : "furniture"}
        </Badge>
      </div>

      {/* 2. Position Coordinates (X, Y in mm) */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <Move className="h-3 w-3" />
          <span>{t.coordinates}</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="relative flex items-center">
            <span className="absolute left-2.5 font-mono text-[11px] text-muted-foreground pointer-events-none">
              X:
            </span>
            <Input
              data-testid="furniture-x-input"
              type="number"
              value={xInput}
              onChange={(e) => {
                setXInput(e.target.value);
                setErrorMessage(null);
              }}
              className="h-8 pl-7 pr-8 font-mono text-xs bg-background"
            />
            <span className="absolute right-2 font-mono text-[10px] text-muted-foreground pointer-events-none">
              mm
            </span>
          </div>
          <div className="relative flex items-center">
            <span className="absolute left-2.5 font-mono text-[11px] text-muted-foreground pointer-events-none">
              Y:
            </span>
            <Input
              data-testid="furniture-y-input"
              type="number"
              value={yInput}
              onChange={(e) => {
                setYInput(e.target.value);
                setErrorMessage(null);
              }}
              className="h-8 pl-7 pr-8 font-mono text-xs bg-background"
            />
            <span className="absolute right-2 font-mono text-[10px] text-muted-foreground pointer-events-none">
              mm
            </span>
          </div>
        </div>
      </div>

      {/* 3. Width Controls (min/max/step) */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-muted-foreground">{t.width}</span>
          {widthRange && (
            <span className="font-mono text-[10px] text-muted-foreground">
              {widthRange.min}–{widthRange.max} mm ({t.stepUnit} {widthRange.step ?? 50}mm)
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          <Button
            type="button"
            size="sm"
            variant="outline"
            data-testid="furniture-width-dec-btn"
            onClick={() => handleStepDimension("width", -(widthRange?.step ?? 100))}
            className="h-8 w-8 p-0 shrink-0"
            title={t.decWidth}
          >
            <Minus className="h-3.5 w-3.5" />
          </Button>

          <div className="relative flex-1">
            <Input
              data-testid="furniture-width-input"
              type="number"
              value={widthInput}
              onChange={(e) => {
                setWidthInput(e.target.value);
                setPreviewInfo(null);
                setErrorMessage(null);
              }}
              className="h-8 pr-8 font-mono text-xs bg-background"
            />
            <span className="absolute right-2.5 top-2 font-mono text-[10px] text-muted-foreground pointer-events-none">
              mm
            </span>
          </div>

          <Button
            type="button"
            size="sm"
            variant="outline"
            data-testid="furniture-width-inc-btn"
            onClick={() => handleStepDimension("width", widthRange?.step ?? 100)}
            className="h-8 w-8 p-0 shrink-0"
            title={t.incWidth}
          >
            <Plus className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* 4. Depth Controls (min/max/step) */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-muted-foreground">{t.depth}</span>
          {depthRange && (
            <span className="font-mono text-[10px] text-muted-foreground">
              {depthRange.min}–{depthRange.max} mm ({t.stepUnit} {depthRange.step ?? 50}mm)
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          <Button
            type="button"
            size="sm"
            variant="outline"
            data-testid="furniture-depth-dec-btn"
            onClick={() => handleStepDimension("depth", -(depthRange?.step ?? 50))}
            className="h-8 w-8 p-0 shrink-0"
            title={t.decDepth}
          >
            <Minus className="h-3.5 w-3.5" />
          </Button>

          <div className="relative flex-1">
            <Input
              data-testid="furniture-depth-input"
              type="number"
              value={depthInput}
              onChange={(e) => {
                setDepthInput(e.target.value);
                setPreviewInfo(null);
                setErrorMessage(null);
              }}
              className="h-8 pr-8 font-mono text-xs bg-background"
            />
            <span className="absolute right-2.5 top-2 font-mono text-[10px] text-muted-foreground pointer-events-none">
              mm
            </span>
          </div>

          <Button
            type="button"
            size="sm"
            variant="outline"
            data-testid="furniture-depth-inc-btn"
            onClick={() => handleStepDimension("depth", depthRange?.step ?? 50)}
            className="h-8 w-8 p-0 shrink-0"
            title={t.incDepth}
          >
            <Plus className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Error Alert (AC-11 Rejection feedback) */}
      {errorMessage && (
        <div
          data-testid="furniture-error-alert"
          className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-2.5 text-xs text-destructive animate-in fade-in-50"
        >
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <span data-testid="furniture-error-message" className="leading-tight">
            {errorMessage}
          </span>
        </div>
      )}

      {/* Preview Simulation (AC-11 Immediate Preview) */}
      {previewInfo && (
        <div
          data-testid="furniture-preview-details"
          className="space-y-1.5 rounded-lg border border-primary/20 bg-primary/5 p-2.5 text-xs animate-in fade-in-50"
        >
          <div className="flex items-center justify-between">
            <span className="font-medium text-foreground">{t.previewSize}</span>
            <span
              data-testid="preview-furniture-dimensions"
              className="font-mono font-semibold text-primary"
            >
              {previewInfo.widthMm} × {previewInfo.depthMm} mm
            </span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-muted-foreground">
            <span>{t.rotation}</span>
            <span className="font-mono text-foreground">{instance.rotation}°</span>
          </div>
        </div>
      )}

      {/* Resize Apply / Preview Controls */}
      <div className="flex items-center gap-1.5 pt-1">
        <Button
          type="button"
          size="sm"
          variant="outline"
          data-testid="preview-furniture-btn"
          onClick={handlePreview}
          className="h-8 flex-1 text-xs flex items-center justify-center gap-1"
        >
          <Eye className="h-3.5 w-3.5 text-primary" />
          <span>{t.preview}</span>
        </Button>

        <Button
          type="button"
          size="sm"
          variant="default"
          data-testid="apply-furniture-btn"
          onClick={handleApply}
          className="h-8 flex-1 text-xs flex items-center justify-center gap-1"
        >
          <Check className="h-3.5 w-3.5" />
          <span>{t.apply}</span>
        </Button>

        <Button
          type="button"
          size="sm"
          variant="ghost"
          data-testid="cancel-furniture-btn"
          onClick={handleCancel}
          className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground"
          title={t.reset}
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* 5. Rotate 90° & Delete Controls (AC-11) */}
      <div className="flex items-center gap-2 pt-2 border-t border-border/60">
        <Button
          type="button"
          size="sm"
          variant="outline"
          data-testid="rotate-furniture-btn"
          onClick={() => handleRotate(90)}
          className="flex-1 h-8 text-xs flex items-center justify-center gap-1.5"
        >
          <RotateCw className="h-3.5 w-3.5 text-primary" />
          <span>{t.rotate90} ({instance.rotation}°)</span>
        </Button>

        <Button
          type="button"
          size="sm"
          variant="destructive"
          data-testid="delete-furniture-btn"
          onClick={handleDelete}
          className="h-8 px-3 text-xs flex items-center justify-center gap-1"
          title={t.deleteTitle}
        >
          <Trash2 className="h-3.5 w-3.5" />
          <span>{t.delete}</span>
        </Button>
      </div>
    </div>
  );
}
