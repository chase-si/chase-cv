import { describe, expect, it, vi } from "vitest";

const { getPalette } = vi.hoisted(() => ({
  getPalette: vi.fn(),
}));

vi.mock("colorthief", () => ({
  getPalette,
}));

import { extractPaletteFromImageSrc } from "@/lib/image-to-ui/extract-palette-from-image-src";

describe("extractPaletteFromImageSrc", () => {
  it("returns normalized dominant swatches from colorthief", async () => {
    getPalette.mockResolvedValue([
      { hex: () => "#ff0088" },
      { hex: () => "#223344" },
    ]);

    const OriginalImage = globalThis.Image;

    class MockImage {
      onload: (() => void) | null = null;
      onerror: (() => void) | null = null;
      src = "";

      set decoding(_value: string) {
        // noop for test double
      }
    }

    vi.stubGlobal(
      "Image",
      class extends MockImage {
        constructor() {
          super();
          queueMicrotask(() => this.onload?.());
        }
      },
    );

    const swatches = await extractPaletteFromImageSrc("/imgs/image-to-ui/mondrian-1280.webp");

    expect(getPalette).toHaveBeenCalledWith(expect.any(MockImage), {
      colorCount: 6,
      ignoreWhite: false,
    });
    expect(swatches).toEqual([
      { role: "Dominant1", hex: "#FF0088" },
      { role: "Dominant2", hex: "#223344" },
    ]);

    vi.stubGlobal("Image", OriginalImage);
  });
});
