"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import type { PaletteSelectionState } from "@/lib/image-to-ui/active-image-types";
import { MIN_SELECTABLE_PALETTE_SWATCHES } from "@/lib/image-to-ui/active-image-types";
import { isPaletteRenderEnabled } from "@/lib/image-to-ui/is-palette-render-enabled";
import {
  getOrderedPaletteRoleLabel,
  toggleOrderedPaletteSwatch,
} from "@/lib/image-to-ui/toggle-ordered-palette-selection";
import { cn } from "@/lib/utils";

const SELECTION_LIMIT_MESSAGE = "最多只能选择 3 个颜色，请先取消已选颜色再更换。";

type ExtractedPalettePanelProps = {
  hasActiveImage: boolean;
  paletteSelection: PaletteSelectionState;
  onSelectedColorsChange: (selectedColors: string[]) => void;
  onRender?: () => void;
};

export function ExtractedPalettePanel({
  hasActiveImage,
  paletteSelection,
  onSelectedColorsChange,
  onRender,
}: ExtractedPalettePanelProps) {
  const { extractionStatus, swatches, extractionError, selectedColors } = paletteSelection;
  const [selectionLimitMessage, setSelectionLimitMessage] = useState<string | null>(null);
  const renderEnabled = isPaletteRenderEnabled(paletteSelection);
  const hasInsufficientSwatches =
    extractionStatus === "ready" && swatches.length < MIN_SELECTABLE_PALETTE_SWATCHES;

  if (!hasActiveImage) {
    return (
      <p className="text-sm text-muted-foreground">选择图片后将显示色板与选色控件。</p>
    );
  }

  const handleSwatchClick = (hex: string) => {
    const result = toggleOrderedPaletteSwatch(selectedColors, hex);
    if (result.type === "limit") {
      setSelectionLimitMessage(SELECTION_LIMIT_MESSAGE);
      return;
    }
    setSelectionLimitMessage(null);
    onSelectedColorsChange(result.selectedColors);
  };

  return (
    <div className="space-y-4" data-testid="palette-selection">
      {extractionStatus === "loading" ? (
        <p className="text-sm text-muted-foreground" data-testid="palette-extraction-loading">
          正在提取色板…
        </p>
      ) : null}

      {extractionStatus === "error" && extractionError ? (
        <p className="text-sm text-destructive" role="alert" data-testid="palette-extraction-error">
          {extractionError}
        </p>
      ) : null}

      {extractionStatus === "ready" && swatches.length > 0 ? (
        <ul className="grid gap-2 sm:grid-cols-2" aria-label="提取的色板">
          {swatches.map((swatch) => {
            const selectionIndex = selectedColors.indexOf(swatch.hex);
            const isSelected = selectionIndex >= 0;
            const roleLabel = isSelected ? getOrderedPaletteRoleLabel(selectionIndex) : null;

            return (
              <li key={swatch.role}>
                <button
                  type="button"
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg border border-border bg-card px-3 py-2 text-left transition-colors",
                    "hover:bg-muted/60 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none",
                    isSelected && "border-primary ring-2 ring-primary/30",
                  )}
                  data-testid={`palette-swatch-${swatch.role}`}
                  aria-pressed={isSelected}
                  onClick={() => handleSwatchClick(swatch.hex)}
                >
                  <span
                    className="relative size-10 shrink-0 rounded-md border border-border"
                    style={{ backgroundColor: swatch.hex }}
                    aria-hidden
                  >
                    {isSelected ? (
                      <span
                        className="absolute -top-1.5 -right-1.5 flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground"
                        data-testid={`palette-swatch-order-${swatch.role}`}
                      >
                        {selectionIndex + 1}
                      </span>
                    ) : null}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground">{swatch.role}</p>
                    <p className="font-mono text-xs text-muted-foreground">{swatch.hex}</p>
                    {roleLabel ? (
                      <p
                        className="text-xs font-medium text-primary"
                        data-testid={`palette-swatch-role-${swatch.role}`}
                      >
                        {roleLabel}
                      </p>
                    ) : null}
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}

      {hasInsufficientSwatches ? (
        <p className="text-sm text-muted-foreground" data-testid="palette-insufficient-swatches">
          当前图片可用的可选颜色不足 {MIN_SELECTABLE_PALETTE_SWATCHES} 个，请换一张对比更丰富的图片。
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
          onClick={() => onRender?.()}
        >
          渲染
        </Button>
        <p className="text-sm text-muted-foreground" data-testid="palette-selection-progress">
          已选 {selectedColors.length} / {MIN_SELECTABLE_PALETTE_SWATCHES} 个颜色
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
