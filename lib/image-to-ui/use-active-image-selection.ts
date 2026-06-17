"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import {
  type ActiveImage,
  emptyPaletteSelection,
  type PaletteSelectionState,
} from "@/lib/image-to-ui/active-image-types";

export function useActiveImageSelection() {
  const [activeImage, setActiveImage] = useState<ActiveImage | null>(null);
  const [paletteSelection, setPaletteSelection] = useState<PaletteSelectionState>(
    emptyPaletteSelection,
  );
  const uploadObjectUrlRef = useRef<string | null>(null);

  const revokeUploadUrl = useCallback(() => {
    if (uploadObjectUrlRef.current) {
      URL.revokeObjectURL(uploadObjectUrlRef.current);
      uploadObjectUrlRef.current = null;
    }
  }, []);

  const applyActiveImage = useCallback(
    (next: ActiveImage | null) => {
      setPaletteSelection(emptyPaletteSelection());
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

  useEffect(() => {
    return () => {
      revokeUploadUrl();
    };
  }, [revokeUploadUrl]);

  return {
    activeImage,
    paletteSelection,
    selectSample,
    selectUpload,
    updatePaletteSelection,
  };
}
