"use client";

import { useTheme } from "next-themes";
import type { CSSProperties } from "react";

import type { ActiveImage } from "@/lib/image-to-ui/active-image-types";
import { getActiveImageSrc } from "@/lib/image-to-ui/active-image-types";
import {
  buildImageToUiRenderInput,
  type ImageToUiRenderInput,
} from "@/lib/image-to-ui/build-image-to-ui-render-input";
import {
  buildScopedPreviewThemeCssVariables,
  derivePreviewThemeTokens,
  type PreviewThemeTokenKey,
  type PreviewThemeTokens,
} from "@/lib/image-to-ui/derive-preview-theme";

export const PREVIEW_TOKEN_SUMMARY_KEYS: PreviewThemeTokenKey[] = [
  "primary",
  "secondary",
  "accent",
  "background",
  "card",
  "foreground",
  "border",
  "ring",
];

export type UseRenderInputSummaryModelInput = {
  activeImage: ActiveImage;
  sampleTitleById: Record<string, string>;
  selectedColors: string[];
};

export type RenderInputSummaryModel = {
  renderInput: ImageToUiRenderInput;
  imageSrc: string;
  imageAlt: string;
  previewThemeTokens: PreviewThemeTokens;
  previewRootStyle: CSSProperties;
  summaryDataAttr: string;
};

export function useRenderInputSummaryModel({
  activeImage,
  sampleTitleById,
  selectedColors,
}: UseRenderInputSummaryModelInput): RenderInputSummaryModel {
  const { resolvedTheme } = useTheme();
  const renderInput = buildImageToUiRenderInput(activeImage, selectedColors);
  const imageSrc = getActiveImageSrc(activeImage);
  const imageAlt =
    activeImage.type === "sample"
      ? (sampleTitleById[activeImage.sampleId] ?? "示例图片")
      : "本地上传的图片";
  const effectiveThemeMode = resolvedTheme === "dark" ? "dark" : "light";
  const previewThemeTokens = derivePreviewThemeTokens({
    selectedColors: renderInput.colorRoles.map((entry) => entry.hex),
    mode: effectiveThemeMode,
  });
  const previewRootStyle = buildScopedPreviewThemeCssVariables(previewThemeTokens) as CSSProperties;

  return {
    renderInput,
    imageSrc,
    imageAlt,
    previewThemeTokens,
    previewRootStyle,
    summaryDataAttr: JSON.stringify({
      imageSrc: renderInput.imageSrc,
      colorRoles: renderInput.colorRoles,
    }),
  };
}
