export const ORDERED_PALETTE_ROLE_LABELS = ["主色", "辅色", "强调色"] as const;

export type OrderedPaletteRoleLabel = (typeof ORDERED_PALETTE_ROLE_LABELS)[number];

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

  if (selectedColors.length >= ORDERED_PALETTE_ROLE_LABELS.length) {
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

export function getOrderedPaletteRoleLabel(
  selectionIndex: number,
): OrderedPaletteRoleLabel | null {
  return ORDERED_PALETTE_ROLE_LABELS[selectionIndex] ?? null;
}
