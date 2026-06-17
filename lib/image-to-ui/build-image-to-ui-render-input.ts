import type { ActiveImage } from "@/lib/image-to-ui/active-image-types";
import { getActiveImageSrc } from "@/lib/image-to-ui/active-image-types";
import {
  assignedRoleLabelForHex,
  classifyPaletteThemeRoles,
  type ThemePaletteAssignedRoleLabel,
} from "@/lib/image-to-ui/classify-palette-theme-roles";

export type ImageToUiRenderColorRole = {
  role: ThemePaletteAssignedRoleLabel;
  hex: string;
};

export type ImageToUiRenderInput = {
  image: ActiveImage;
  imageSrc: string;
  colorRoles: ImageToUiRenderColorRole[];
};

export function buildImageToUiRenderInput(
  image: ActiveImage,
  selectedColors: string[],
): ImageToUiRenderInput {
  const classification = classifyPaletteThemeRoles(selectedColors);
  const colorRoles = selectedColors.map((hex) => ({
    role: assignedRoleLabelForHex(hex, classification),
    hex,
  }));

  return {
    image,
    imageSrc: getActiveImageSrc(image),
    colorRoles,
  };
}
