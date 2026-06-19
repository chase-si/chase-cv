import type { ActiveImage } from "@/lib/image-to-ui/active-image-types";
import { getActiveImageSrc } from "@/lib/image-to-ui/active-image-types";
import {
  assignedRoleLabelForHex,
  assignedRoleRationaleForHex,
  classifyPaletteThemeRoles,
  type ClassifiedPaletteThemeRoles,
  type ThemePaletteRoleLabels,
  type ThemePaletteRoleRationaleLabels,
} from "@/lib/image-to-ui/classify-palette-theme-roles";

export type ImageToUiRenderColorRole = {
  role: string;
  hex: string;
  rationale: string;
};

export type ImageToUiRenderInput = {
  image: ActiveImage;
  imageSrc: string;
  colorRoles: ImageToUiRenderColorRole[];
};

export function buildImageToUiRenderInput(
  image: ActiveImage,
  selectedColors: string[],
  labels?: {
    roles?: ThemePaletteRoleLabels;
    roleRationales?: ThemePaletteRoleRationaleLabels;
  },
  classifiedRoles?: ClassifiedPaletteThemeRoles,
): ImageToUiRenderInput {
  const classification = classifiedRoles ?? classifyPaletteThemeRoles(selectedColors);
  const colorRoles = selectedColors.map((hex) => ({
    role: assignedRoleLabelForHex(hex, classification, labels?.roles),
    hex,
    rationale: assignedRoleRationaleForHex(
      hex,
      selectedColors,
      labels?.roleRationales,
      classification,
    ),
  }));

  return {
    image,
    imageSrc: getActiveImageSrc(image),
    colorRoles,
  };
}
