export const MAX_PALETTE_SELECTION_COUNT = 3;

export const PALETTE_SELECTION_ORDER_LABELS = [
  "已选色 1",
  "已选色 2",
  "已选色 3",
] as const;

export type PaletteSelectionOrderLabel =
  (typeof PALETTE_SELECTION_ORDER_LABELS)[number];

export type ToggleOrderedPaletteSwatchResult =
  | { type: "updated"; selectedColors: string[] }
  | { type: "limit"; selectedColors: string[] };

export function toggleOrderedPaletteSwatch(
  selectedColors: string[],
  hex: string,
): ToggleOrderedPaletteSwatchResult {
  const existingIndex = selectedColors.indexOf(hex);
  if (existingIndex >= 0) {
    return {
      type: "updated",
      selectedColors: selectedColors.filter((_, index) => index !== existingIndex),
    };
  }

  if (selectedColors.length >= MAX_PALETTE_SELECTION_COUNT) {
    return {
      type: "limit",
      selectedColors,
    };
  }

  return {
    type: "updated",
    selectedColors: [...selectedColors, hex],
  };
}

export function getPaletteSelectionOrderLabel(
  selectionIndex: number,
): PaletteSelectionOrderLabel | null {
  return PALETTE_SELECTION_ORDER_LABELS[selectionIndex] ?? null;
}
