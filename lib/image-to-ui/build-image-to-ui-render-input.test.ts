import { describe, expect, it } from "vitest";

import { buildImageToUiRenderInput } from "@/lib/image-to-ui/build-image-to-ui-render-input";
import {
  assignedRoleLabelForHex,
  classifyPaletteThemeRoles,
} from "@/lib/image-to-ui/classify-palette-theme-roles";

describe("buildImageToUiRenderInput", () => {
  it("assigns classified theme roles instead of selection-order labels", () => {
    const selectedColors = ["#FF0088", "#112233", "#445566"];
    const classification = classifyPaletteThemeRoles(selectedColors);

    const input = buildImageToUiRenderInput(
      { type: "sample", sampleId: "minimal-dashboard", src: "/samples/minimal.png" },
      selectedColors,
    );

    expect(input.imageSrc).toBe("/samples/minimal.png");
    expect(input.colorRoles).toEqual(
      selectedColors.map((hex) => ({
        hex,
        role: assignedRoleLabelForHex(hex, classification),
      })),
    );
    expect(input.colorRoles.map((entry) => entry.role)).not.toEqual(["主色", "辅色", "强调色"]);
  });
});
