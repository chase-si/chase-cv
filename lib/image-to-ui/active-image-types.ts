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

export type PaletteSelectionState = {
  selectedColors: string[];
  extractionFeedback: string | null;
};

export const emptyPaletteSelection = (): PaletteSelectionState => ({
  selectedColors: [],
  extractionFeedback: null,
});
