import {
  MIN_SELECTABLE_PALETTE_SWATCHES,
  type PaletteSelectionState,
} from "@/lib/image-to-ui/active-image-types";

export type PaletteRenderGateDenyReason =
  | "extraction_not_ready"
  | "insufficient_swatches"
  | "selection_count_invalid";

export type PaletteRenderGateResult =
  | { eligible: true }
  | { eligible: false; reason: PaletteRenderGateDenyReason };

export type SelectedColorsRenderAction =
  | "classify palette theme roles"
  | "derive preview theme tokens";

export function evaluatePaletteRenderGate(
  paletteSelection: PaletteSelectionState,
): PaletteRenderGateResult {
  if (paletteSelection.extractionStatus !== "ready") {
    return { eligible: false, reason: "extraction_not_ready" };
  }

  if (paletteSelection.swatches.length < MIN_SELECTABLE_PALETTE_SWATCHES) {
    return { eligible: false, reason: "insufficient_swatches" };
  }

  if (paletteSelection.selectedColors.length !== MIN_SELECTABLE_PALETTE_SWATCHES) {
    return { eligible: false, reason: "selection_count_invalid" };
  }

  return { eligible: true };
}

export function isPaletteRenderEnabled(paletteSelection: PaletteSelectionState): boolean {
  return evaluatePaletteRenderGate(paletteSelection).eligible;
}

export function assertSelectedColorsEligibleForRender(
  selectedColors: string[],
  action: SelectedColorsRenderAction,
): void {
  if (selectedColors.length !== MIN_SELECTABLE_PALETTE_SWATCHES) {
    throw new Error(`Three selected colors are required to ${action}`);
  }
}
