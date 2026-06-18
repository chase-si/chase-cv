"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import type { PaletteSelectionState } from "@/lib/image-to-ui/active-image-types";
import { MIN_SELECTABLE_PALETTE_SWATCHES } from "@/lib/image-to-ui/active-image-types";
import { isPaletteRenderEnabled } from "@/lib/image-to-ui/is-palette-render-enabled";
import {
  toggleOrderedPaletteSwatch,
} from "@/lib/image-to-ui/toggle-ordered-palette-selection";
import { formatPaletteProportionPercent } from "@/lib/image-to-ui/normalize-dominant-palette";
import { cn } from "@/lib/utils";

const SELECTION_LIMIT_MESSAGE = "最多只能选择 3 个颜色，请先取消已选颜色再更换。";

type ExtractedPalettePanelProps = {
  hasActiveImage: boolean;
  paletteSelection: PaletteSelectionState;
  onSelectedColorsChange: (selectedColors: string[]) => void;
  onRender?: () => void;
  labels?: {
    paletteEmpty: string;
    paletteLoading: string;
    paletteAria: string;
    paletteShare: (percent: string) => string;
    paletteSwatchAria: (hex: string, percent: string) => string;
    paletteInsufficient: (count: number) => string;
    selectionLimit: string;
    renderButton: string;
    selectionProgress: (selected: number, required: number) => string;
    selectedColor: (index: number) => string;
  };
};

export function ExtractedPalettePanel({
  hasActiveImage,
  paletteSelection,
  onSelectedColorsChange,
  onRender,
  labels = {
    paletteEmpty: "选择图片后将显示色板与选色控件。",
    paletteLoading: "正在提取色板...",
    paletteAria: "提取的色板",
    paletteShare: (percent) => `占比 ${percent}`,
    paletteSwatchAria: (hex, percent) => `${hex}，占比 ${percent}`,
    paletteInsufficient: (count) =>
      `当前图片可用的可选颜色不足 ${count} 个，请换一张对比更丰富的图片。`,
    selectionLimit: SELECTION_LIMIT_MESSAGE,
    renderButton: "渲染",
    selectionProgress: (selected, required) => `已选 ${selected} / ${required} 个颜色`,
    selectedColor: (index) => `已选色 ${index}`,
  },
}: ExtractedPalettePanelProps) {
  const { extractionStatus, swatches, extractionError, selectedColors } = paletteSelection;
  const [selectionLimitMessage, setSelectionLimitMessage] = useState<string | null>(null);
  const renderEnabled = isPaletteRenderEnabled(paletteSelection);
  const hasInsufficientSwatches =
    extractionStatus === "ready" && swatches.length < MIN_SELECTABLE_PALETTE_SWATCHES;

  if (!hasActiveImage) {
    return (
      <p className="text-sm text-muted-foreground">{labels.paletteEmpty}</p>
    );
  }

  const handleSwatchClick = (hex: string) => {
    const result = toggleOrderedPaletteSwatch(selectedColors, hex);
    if (result.type === "limit") {
      setSelectionLimitMessage(labels.selectionLimit);
      return;
    }
    setSelectionLimitMessage(null);
    onSelectedColorsChange(result.selectedColors);
  };

  return (
    <div className="space-y-4" data-testid="palette-selection">
      {extractionStatus === "loading" ? (
        <p className="text-sm text-muted-foreground" data-testid="palette-extraction-loading">
          {labels.paletteLoading}
        </p>
      ) : null}

      {extractionStatus === "error" && extractionError ? (
        <p className="text-sm text-destructive" role="alert" data-testid="palette-extraction-error">
          {extractionError}
        </p>
      ) : null}

      {extractionStatus === "ready" && swatches.length > 0 ? (
        <ul className="grid gap-2 sm:grid-cols-2" aria-label={labels.paletteAria}>
          {swatches.map((swatch) => {
            const selectionIndex = selectedColors.indexOf(swatch.hex);
            const isSelected = selectionIndex >= 0;
            const orderLabel = isSelected ? labels.selectedColor(selectionIndex + 1) : null;
            const percentLabel = formatPaletteProportionPercent(swatch.proportion);
            const widthPercent = Math.max(4, Math.round(swatch.proportion * 1000) / 10);

            return (
              <li key={swatch.role}>
                <button
                  type="button"
                  className={cn(
                    "flex w-full items-center gap-3 border border-border bg-card px-3 py-2 text-left transition-colors",
                    "hover:bg-muted/60 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none",
                    isSelected && "border-primary ring-2 ring-primary/30",
                  )}
                  data-testid={`palette-swatch-${swatch.role}`}
                  aria-pressed={isSelected}
                  aria-label={labels.paletteSwatchAria(swatch.hex, percentLabel)}
                  onClick={() => handleSwatchClick(swatch.hex)}
                >
                  <span
                    className="relative size-10 shrink-0 border border-border"
                    style={{ backgroundColor: swatch.hex }}
                    aria-hidden
                  >
                    {isSelected ? (
                      <span
                        className="absolute -top-1.5 -right-1.5 flex size-5 items-center justify-center bg-primary text-[10px] font-semibold text-primary-foreground"
                        data-testid={`palette-swatch-order-${swatch.role}`}
                      >
                        {selectionIndex + 1}
                      </span>
                    ) : null}
                  </span>
                  <div className="flex min-w-0 flex-1 flex-col justify-center gap-1">
                    <div className="flex min-h-5 items-center justify-between gap-2">
                      <span className="shrink-0 font-mono text-xs text-foreground">{swatch.hex}</span>
                      {orderLabel ? (
                        <span
                          className="inline-flex shrink-0 items-center rounded-md border border-primary/30 bg-primary/10 px-1.5 py-0.5 text-xs font-medium text-primary"
                          data-testid={`palette-swatch-role-${swatch.role}`}
                        >
                          {orderLabel}
                        </span>
                      ) : (
                        <span
                          className="inline-flex shrink-0 items-center rounded-md border border-transparent px-1.5 py-0.5 text-xs font-medium opacity-0"
                          aria-hidden
                        >
                          {labels.selectedColor(1)}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className="h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-muted"
                        role="img"
                        aria-label={labels.paletteShare(percentLabel)}
                      >
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${widthPercent}%`, backgroundColor: swatch.hex }}
                        />
                      </div>
                      <span
                        className="w-10 shrink-0 text-right text-xs font-semibold tabular-nums text-foreground"
                        data-testid={`palette-swatch-share-${swatch.role}`}
                      >
                        {percentLabel}
                      </span>
                    </div>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}

      {hasInsufficientSwatches ? (
        <p className="text-sm text-muted-foreground" data-testid="palette-insufficient-swatches">
          {labels.paletteInsufficient(MIN_SELECTABLE_PALETTE_SWATCHES)}
        </p>
      ) : null}

      {selectionLimitMessage ? (
        <p className="text-sm text-muted-foreground" role="status" data-testid="palette-selection-limit">
          {selectionLimitMessage}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center gap-3 pt-1">
        <Button
          type="button"
          data-testid="palette-render-button"
          disabled={!renderEnabled}
          className='shadow-sm hover:shadow-md'
          onClick={() => onRender?.()}
        >
          {labels.renderButton}
        </Button>
        <p className="text-sm text-muted-foreground" data-testid="palette-selection-progress">
          {labels.selectionProgress(selectedColors.length, MIN_SELECTABLE_PALETTE_SWATCHES)}
        </p>
      </div>

      <p
        className="sr-only"
        data-selected-count={selectedColors.length}
        data-extraction-status={extractionStatus}
        data-render-enabled={renderEnabled ? "true" : "false"}
      />
    </div>
  );
}
