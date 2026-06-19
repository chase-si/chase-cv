"use client";

import { useCallback, useReducer } from "react";

import type { ActiveImage, PaletteSelectionState } from "@/lib/image-to-ui/active-image-types";
import {
  imageToUiToolSessionReducer,
  initialImageToUiToolSessionFlowState,
} from "@/lib/image-to-ui/image-to-ui-tool-session";
import { isPaletteRenderEnabled } from "@/lib/image-to-ui/palette-render-gate";
import type { ImageToUiPathnameAdapter } from "@/lib/image-to-ui/image-to-ui-route-pathname";
import { resolveImageToUiFlowStep } from "@/lib/image-to-ui/resolve-image-to-ui-flow-step";
import {
  useActiveImageSelection,
  type UseActiveImageSelectionOptions,
} from "@/lib/image-to-ui/use-active-image-selection";
import {
  useImageToUiRouteRestore,
  type UseImageToUiRouteRestoreOptions,
} from "@/lib/image-to-ui/use-image-to-ui-route-restore";

export type ImageToUiToolSession = {
  activeImage: ActiveImage | null;
  paletteSelection: PaletteSelectionState;
  displayStep: ReturnType<typeof resolveImageToUiFlowStep>;
  isRenderEnabled: boolean;
  selectSample: (sampleId: string, src: string) => void;
  selectUpload: (file: File) => void;
  setSelectedPaletteColors: (colors: string[]) => void;
  backToEdit: () => void;
  confirmRender: () => void;
};

type UseImageToUiToolSessionOptions = UseActiveImageSelectionOptions &
  UseImageToUiRouteRestoreOptions;

export function useImageToUiToolSession(
  options: UseImageToUiToolSessionOptions = {},
): ImageToUiToolSession {
  const { pathnameAdapter, ...selectionOptions } = options;
  const {
    activeImage,
    paletteSelection,
    selectSample: selectSampleBase,
    selectUpload: selectUploadBase,
    setSelectedPaletteColors,
    resetForRouteRestore,
  } = useActiveImageSelection(selectionOptions);

  const [flowState, dispatch] = useReducer(
    imageToUiToolSessionReducer,
    undefined,
    initialImageToUiToolSessionFlowState,
  );

  const selectSample = useCallback(
    (sampleId: string, src: string) => {
      dispatch({ type: "active_image_changed" });
      selectSampleBase(sampleId, src);
    },
    [selectSampleBase],
  );

  const selectUpload = useCallback(
    (file: File) => {
      dispatch({ type: "active_image_changed" });
      selectUploadBase(file);
    },
    [selectUploadBase],
  );

  const backToEdit = useCallback(() => {
    dispatch({ type: "back_to_edit" });
  }, []);

  const confirmRender = useCallback(() => {
    if (!activeImage || !isPaletteRenderEnabled(paletteSelection)) {
      return;
    }
    dispatch({ type: "advance_to_render" });
  }, [activeImage, paletteSelection]);

  const handleRouteRestore = useCallback(() => {
    dispatch({ type: "route_restore" });
    resetForRouteRestore();
  }, [resetForRouteRestore]);

  useImageToUiRouteRestore(handleRouteRestore, { pathnameAdapter });

  const displayStep = resolveImageToUiFlowStep(flowState.flowStep, Boolean(activeImage));
  const isRenderEnabled = isPaletteRenderEnabled(paletteSelection);

  return {
    activeImage,
    paletteSelection,
    displayStep,
    isRenderEnabled,
    selectSample,
    selectUpload,
    setSelectedPaletteColors,
    backToEdit,
    confirmRender,
  };
}
