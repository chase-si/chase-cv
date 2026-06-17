import {
  MIN_SELECTABLE_PALETTE_SWATCHES,
  type PaletteSelectionState,
} from "@/lib/image-to-ui/active-image-types";

export function isPaletteRenderEnabled(paletteSelection: PaletteSelectionState): boolean {
  if (paletteSelection.extractionStatus !== "ready") {
    return false;
  }

  if (paletteSelection.swatches.length < MIN_SELECTABLE_PALETTE_SWATCHES) {
    return false;
  }

  return paletteSelection.selectedColors.length === MIN_SELECTABLE_PALETTE_SWATCHES;
}
