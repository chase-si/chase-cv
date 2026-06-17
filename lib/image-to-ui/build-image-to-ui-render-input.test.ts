import { describe, expect, it } from "vitest";

import { buildImageToUiRenderInput } from "@/lib/image-to-ui/build-image-to-ui-render-input";

describe("buildImageToUiRenderInput", () => {
  it("maps three selected colors to main, secondary, and accent roles", () => {
    const input = buildImageToUiRenderInput(
      { type: "sample", sampleId: "minimal-dashboard", src: "/samples/minimal.png" },
      ["#FF0088", "#112233", "#445566"],
    );

    expect(input.imageSrc).toBe("/samples/minimal.png");
    expect(input.colorRoles).toEqual([
      { role: "主色", hex: "#FF0088" },
      { role: "辅色", hex: "#112233" },
      { role: "强调色", hex: "#445566" },
    ]);
  });
});
