export type ActiveSampleImage = {
  type: "sample";
  sampleId: string;
  src: string;
};

export type ActiveUploadImage = {
  type: "upload";
  /** Browser-local object URL for preview only. */
  objectUrl: string;
};

export type ActiveImage = ActiveSampleImage | ActiveUploadImage;

export function getActiveImageSrc(image: ActiveImage): string {
  return image.type === "sample" ? image.src : image.objectUrl;
}

import type { PaletteSwatch } from "@/lib/image-to-ui/normalize-vibrant-palette";

export type PaletteExtractionStatus = "idle" | "loading" | "ready" | "error";

export type PaletteSelectionState = {
  selectedColors: string[];
  extractionStatus: PaletteExtractionStatus;
  swatches: PaletteSwatch[];
  extractionError: string | null;
};

export const emptyPaletteSelection = (): PaletteSelectionState => ({
  selectedColors: [],
  extractionStatus: "idle",
  swatches: [],
  extractionError: null,
});

export const MIN_SELECTABLE_PALETTE_SWATCHES = 3;
