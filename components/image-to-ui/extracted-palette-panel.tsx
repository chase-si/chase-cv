import type { PaletteSelectionState } from "@/lib/image-to-ui/active-image-types";
import { MIN_SELECTABLE_PALETTE_SWATCHES } from "@/lib/image-to-ui/active-image-types";
import { cn } from "@/lib/utils";

type ExtractedPalettePanelProps = {
  hasActiveImage: boolean;
  paletteSelection: PaletteSelectionState;
};

export function ExtractedPalettePanel({
  hasActiveImage,
  paletteSelection,
}: ExtractedPalettePanelProps) {
  const { extractionStatus, swatches, extractionError, selectedColors } = paletteSelection;

  if (!hasActiveImage) {
    return (
      <p className="text-sm text-muted-foreground">选择图片后将显示色板与选色控件。</p>
    );
  }

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
          {swatches.map((swatch) => (
            <li
              key={swatch.role}
              className="flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-2"
              data-testid={`palette-swatch-${swatch.role}`}
            >
              <span
                className={cn("size-10 shrink-0 rounded-md border border-border")}
                style={{ backgroundColor: swatch.hex }}
                aria-hidden
              />
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground">{swatch.role}</p>
                <p className="font-mono text-xs text-muted-foreground">{swatch.hex}</p>
              </div>
            </li>
          ))}
        </ul>
      ) : null}

      {extractionStatus === "ready" && swatches.length < MIN_SELECTABLE_PALETTE_SWATCHES ? (
        <p className="text-sm text-muted-foreground" data-testid="palette-insufficient-swatches">
          当前图片可用的可选颜色不足 {MIN_SELECTABLE_PALETTE_SWATCHES} 个，请换一张对比更丰富的图片。
        </p>
      ) : null}

      <p
        className="sr-only"
        data-selected-count={selectedColors.length}
        data-extraction-status={extractionStatus}
      />
    </div>
  );
}
