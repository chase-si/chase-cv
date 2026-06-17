import type { ActiveImage } from "@/lib/image-to-ui/active-image-types";
import { getActiveImageSrc } from "@/lib/image-to-ui/active-image-types";
import {
  getOrderedPaletteRoleLabel,
  ORDERED_PALETTE_ROLE_LABELS,
} from "@/lib/image-to-ui/toggle-ordered-palette-selection";

export type ImageToUiRenderColorRole = {
  role: (typeof ORDERED_PALETTE_ROLE_LABELS)[number];
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
  const colorRoles = selectedColors.map((hex, index) => {
    const role = getOrderedPaletteRoleLabel(index);
    if (!role) {
      throw new Error(`Missing palette role for selection index ${index}`);
    }
    return { role, hex };
  });

  return {
    image,
    imageSrc: getActiveImageSrc(image),
    colorRoles,
  };
}
