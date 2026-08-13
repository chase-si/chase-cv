"use client";

import { useEffect, useRef } from "react";
import { useLocale } from "next-intl";

import type { ActiveImage, PaletteSelectionState } from "@/lib/image-to-ui/active-image-types";
import { MIN_SELECTABLE_PALETTE_SWATCHES } from "@/lib/image-to-ui/active-image-types";
import { imageToUiAnalyticsImageKey } from "@/lib/image-to-ui/image-to-ui-analytics-image-key";
import { trackEvent } from "@/lib/analytics";

type UseImageToUiAnalyticsOptions = {
  activeImage: ActiveImage | null;
  paletteSelection: PaletteSelectionState;
  displayStep: 1 | 2;
};

export function useImageToUiAnalytics({
  activeImage,
  paletteSelection,
  displayStep,
}: UseImageToUiAnalyticsOptions) {
  const locale = useLocale();
  const toolStartSent = useRef(false);
  const lastImageKey = useRef<string | null>(null);
  const extractionTrackedFor = useRef<string | null>(null);
  const selectionCompleteFor = useRef<string | null>(null);
  const previewTrackedFor = useRef<string | null>(null);

  useEffect(() => {
    if (toolStartSent.current) return;
    toolStartSent.current = true;
    trackEvent("image_to_ui_tool_start", { locale, tool: "image_to_ui" });
  }, [locale]);

  useEffect(() => {
    if (!activeImage) {
      lastImageKey.current = null;
      return;
    }

    const imageKey = imageToUiAnalyticsImageKey(activeImage);

    if (lastImageKey.current === imageKey) {
      return;
    }
    lastImageKey.current = imageKey;

    trackEvent("image_to_ui_image_source", {
      locale,
      tool: "image_to_ui",
      source: activeImage.type === "sample" ? "sample" : "upload",
      ...(activeImage.type === "sample" ? { sample_id: activeImage.sampleId } : {}),
    });
  }, [activeImage, locale]);

  useEffect(() => {
    if (!activeImage || paletteSelection.extractionStatus !== "ready") {
      return;
    }

    const imageKey = imageToUiAnalyticsImageKey(activeImage);

    if (extractionTrackedFor.current === imageKey) {
      return;
    }
    extractionTrackedFor.current = imageKey;
    selectionCompleteFor.current = null;
    previewTrackedFor.current = null;

    trackEvent("image_to_ui_palette_extracted", {
      locale,
      tool: "image_to_ui",
      swatch_count: paletteSelection.swatches.length,
    });
  }, [activeImage, locale, paletteSelection.extractionStatus, paletteSelection.swatches.length]);

  useEffect(() => {
    if (!activeImage) return;
    if (paletteSelection.selectedColors.length < MIN_SELECTABLE_PALETTE_SWATCHES) {
      return;
    }

    const imageKey = imageToUiAnalyticsImageKey(activeImage);

    if (selectionCompleteFor.current === imageKey) {
      return;
    }
    selectionCompleteFor.current = imageKey;

    trackEvent("image_to_ui_palette_complete", {
      locale,
      tool: "image_to_ui",
    });
  }, [activeImage, locale, paletteSelection.selectedColors.length]);

  useEffect(() => {
    if (displayStep !== 2 || !activeImage) {
      return;
    }

    const imageKey = imageToUiAnalyticsImageKey(activeImage);

    if (previewTrackedFor.current === imageKey) {
      return;
    }
    previewTrackedFor.current = imageKey;

    trackEvent("image_to_ui_preview_generated", {
      locale,
      tool: "image_to_ui",
    });
  }, [activeImage, displayStep, locale]);
}
