import { describe, expect, it, vi } from "vitest";

import { buildImageToUiStep2PreviewPipeline } from "@/lib/image-to-ui/image-to-ui-step2-preview-pipeline";
import * as classifyModule from "@/lib/image-to-ui/classify-palette-theme-roles";
import { parseHexToRgb } from "@/lib/image-to-ui/palette-color-math";

describe("buildImageToUiStep2PreviewPipeline", () => {
  it("classifies palette roles once and keeps summary roles aligned with preview seeds", () => {
    const selectedColors = ["#445566", "#FF0088", "#112233"];
    const classifySpy = vi.spyOn(classifyModule, "classifyPaletteThemeRoles");

    const { renderInput, previewThemeTokens, classifiedRoles } =
      buildImageToUiStep2PreviewPipeline({
        activeImage: {
          type: "sample",
          sampleId: "minimal-dashboard",
          src: "/samples/minimal.png",
        },
        selectedColors,
        mode: "light",
      });

    expect(classifySpy).toHaveBeenCalledTimes(1);
    expect(classifySpy).toHaveBeenCalledWith(selectedColors);

    const actionRole = renderInput.colorRoles.find(
      (entry) => entry.hex.toLowerCase() === classifiedRoles.actionSeed.toLowerCase(),
    );
    expect(actionRole).toBeDefined();
    expect(previewThemeTokens.primary).toBe(
      `rgb(${parseHexToRgb(classifiedRoles.actionSeed).r}, ${parseHexToRgb(classifiedRoles.actionSeed).g}, ${parseHexToRgb(classifiedRoles.actionSeed).b})`,
    );
    expect(actionRole!.role).toBe("动作色");

    classifySpy.mockRestore();
  });
});
