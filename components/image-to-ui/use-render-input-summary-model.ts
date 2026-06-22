"use client";

import { useTheme } from "@/components/theme-provider";
import type { CSSProperties } from "react";

import type { ActiveImage } from "@/lib/image-to-ui/active-image-types";
import { getActiveImageSrc } from "@/lib/image-to-ui/active-image-types";
import type { ImageToUiRenderInput } from "@/lib/image-to-ui/build-image-to-ui-render-input";
import { buildImageToUiStep2PreviewPipeline } from "@/lib/image-to-ui/image-to-ui-step2-preview-pipeline";
import type {
  ThemePaletteRoleLabels,
  ThemePaletteRoleRationaleLabels,
} from "@/lib/image-to-ui/classify-palette-theme-roles";
import {
  buildScopedPreviewThemeCssVariables,
  type PreviewThemeTokenKey,
  type PreviewThemeTokens,
} from "@/lib/image-to-ui/derive-preview-theme";

export const PREVIEW_TOKEN_SUMMARY_KEYS: PreviewThemeTokenKey[] = [
  "primary",
  "secondary",
  "accent",
  "background",
  "card",
  "popover",
  "muted",
  "input",
  "foreground",
  "border",
  "ring",
];

export type UseRenderInputSummaryModelInput = {
  activeImage: ActiveImage;
  sampleTitleById: Record<string, string>;
  selectedColors: string[];
  labels?: {
    sampleImage: string;
    uploadedImage: string;
    roles: ThemePaletteRoleLabels;
    roleRationales: ThemePaletteRoleRationaleLabels;
  };
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
  labels = {
    sampleImage: "示例图片",
    uploadedImage: "本地上传的图片",
    roles: {
      surface: "表面基底",
      action: "动作色",
      support: "辅助色",
    },
    roleRationales: {
      surfaceLowSaturation: "偏亮且低饱和，适合作背景与表面基底",
      surfaceBrighter: "相对更亮，适合作背景与表面层级",
      surfaceCalm: "饱和度较低、偏平静，适合作表面与弱化区域",
      surfaceDefault: "表面适应性最高，适合作背景与卡片基底",
      actionVivid: (contrast) => `与表面基底${contrast}且色彩鲜明，适合作主操作与焦点色`,
      actionDefault: (contrast) => `与表面基底${contrast}，适合作主操作与焦点色`,
      supportNeutral: "中调中性色，适合作边框、输入框与弱强调",
      supportSecondary: "中调辅助色，适合作次要界面与弱强调",
      supportMuted: "偏中性，适合作边框与弱化层次",
      supportDefault: "辅助适应性最高，适合作次要界面元素",
      contrastHigh: "高对比",
      contrastMedium: "较高对比",
      contrastUsable: "可用对比",
    },
  },
}: UseRenderInputSummaryModelInput): RenderInputSummaryModel {
  const { resolvedTheme } = useTheme();
  const effectiveThemeMode = resolvedTheme === "dark" ? "dark" : "light";
  const { renderInput, previewThemeTokens } = buildImageToUiStep2PreviewPipeline({
    activeImage,
    selectedColors,
    mode: effectiveThemeMode,
    labels: {
      roles: labels.roles,
      roleRationales: labels.roleRationales,
    },
  });
  const imageSrc = getActiveImageSrc(activeImage);
  const imageAlt =
    activeImage.type === "sample"
      ? (sampleTitleById[activeImage.sampleId] ?? labels.sampleImage)
      : labels.uploadedImage;
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
