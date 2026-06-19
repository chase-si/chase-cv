import type { ActiveImage } from "@/lib/image-to-ui/active-image-types";
import {
  buildImageToUiRenderInput,
  type ImageToUiRenderInput,
} from "@/lib/image-to-ui/build-image-to-ui-render-input";
import {
  classifyPaletteThemeRoles,
  type ClassifiedPaletteThemeRoles,
  type ThemePaletteRoleLabels,
  type ThemePaletteRoleRationaleLabels,
} from "@/lib/image-to-ui/classify-palette-theme-roles";
import {
  derivePreviewThemeTokens,
  type PreviewThemeTokens,
} from "@/lib/image-to-ui/derive-preview-theme";

export type BuildImageToUiStep2PreviewPipelineInput = {
  activeImage: ActiveImage;
  selectedColors: string[];
  mode: "light" | "dark";
  labels?: {
    roles?: ThemePaletteRoleLabels;
    roleRationales?: ThemePaletteRoleRationaleLabels;
  };
};

export type ImageToUiStep2PreviewPipelineResult = {
  classifiedRoles: ClassifiedPaletteThemeRoles;
  renderInput: ImageToUiRenderInput;
  previewThemeTokens: PreviewThemeTokens;
};

export function buildImageToUiStep2PreviewPipeline({
  activeImage,
  selectedColors,
  mode,
  labels,
}: BuildImageToUiStep2PreviewPipelineInput): ImageToUiStep2PreviewPipelineResult {
  const classifiedRoles = classifyPaletteThemeRoles(selectedColors);
  const renderInput = buildImageToUiRenderInput(
    activeImage,
    selectedColors,
    labels,
    classifiedRoles,
  );
  const previewThemeTokens = derivePreviewThemeTokens({
    selectedColors,
    mode,
    classifiedRoles,
  });

  return {
    classifiedRoles,
    renderInput,
    previewThemeTokens,
  };
}
