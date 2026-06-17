"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import {
  type ActiveImage,
  emptyPaletteSelection,
  getActiveImageSrc,
  type PaletteSelectionState,
} from "@/lib/image-to-ui/active-image-types";
import { extractPaletteFromImageSrc } from "@/lib/image-to-ui/extract-palette-from-image-src";
import type { PaletteSwatch } from "@/lib/image-to-ui/normalize-vibrant-palette";

const EXTRACTION_ERROR_MESSAGE = "无法从当前图片提取色板，请换一张图片或重新上传。";

type UseActiveImageSelectionOptions = {
  extractPalette?: (src: string) => Promise<PaletteSwatch[]>;
};

export function useActiveImageSelection(options: UseActiveImageSelectionOptions = {}) {
  const extractPalette = options.extractPalette ?? extractPaletteFromImageSrc;
  const [activeImage, setActiveImage] = useState<ActiveImage | null>(null);
  const [paletteSelection, setPaletteSelection] = useState<PaletteSelectionState>(
    emptyPaletteSelection,
  );
  const uploadObjectUrlRef = useRef<string | null>(null);
  const extractionRequestIdRef = useRef(0);

  const revokeUploadUrl = useCallback(() => {
    if (uploadObjectUrlRef.current) {
      URL.revokeObjectURL(uploadObjectUrlRef.current);
      uploadObjectUrlRef.current = null;
    }
  }, []);

  const applyActiveImage = useCallback(
    (next: ActiveImage | null) => {
      setPaletteSelection(
        next
          ? {
              selectedColors: [],
              extractionStatus: "loading",
              swatches: [],
              extractionError: null,
            }
          : emptyPaletteSelection(),
      );
      setActiveImage((prev) => {
        if (prev?.type === "upload") {
          revokeUploadUrl();
        }
        if (next?.type === "upload") {
          uploadObjectUrlRef.current = next.objectUrl;
        }
        return next;
      });
    },
    [revokeUploadUrl],
  );

  const selectSample = useCallback(
    (sampleId: string, src: string) => {
      applyActiveImage({ type: "sample", sampleId, src });
    },
    [applyActiveImage],
  );

  const selectUpload = useCallback(
    (file: File) => {
      revokeUploadUrl();
      const objectUrl = URL.createObjectURL(file);
      applyActiveImage({ type: "upload", objectUrl });
    },
    [applyActiveImage, revokeUploadUrl],
  );

  const updatePaletteSelection = useCallback((next: PaletteSelectionState) => {
    setPaletteSelection(next);
  }, []);

  const setSelectedPaletteColors = useCallback((selectedColors: string[]) => {
    setPaletteSelection((prev) => ({
      ...prev,
      selectedColors,
    }));
  }, []);

  useEffect(() => {
    return () => {
      revokeUploadUrl();
    };
  }, [revokeUploadUrl]);

  useEffect(() => {
    if (!activeImage) {
      return;
    }

    const src = getActiveImageSrc(activeImage);
    const requestId = ++extractionRequestIdRef.current;

    extractPalette(src)
      .then((swatches) => {
        if (requestId !== extractionRequestIdRef.current) {
          return;
        }
        setPaletteSelection((prev) => ({
          ...prev,
          extractionStatus: "ready",
          swatches,
          extractionError: null,
        }));
      })
      .catch(() => {
        if (requestId !== extractionRequestIdRef.current) {
          return;
        }
        setPaletteSelection((prev) => ({
          ...prev,
          extractionStatus: "error",
          swatches: [],
          extractionError: EXTRACTION_ERROR_MESSAGE,
        }));
      });
  }, [activeImage, extractPalette]);

  return {
    activeImage,
    paletteSelection,
    selectSample,
    selectUpload,
    updatePaletteSelection,
    setSelectedPaletteColors,
  };
}
