import { describe, expect, it, vi } from "vitest";

const { getColorSync, getPaletteSync } = vi.hoisted(() => ({
  getColorSync: vi.fn(),
  getPaletteSync: vi.fn(),
}));

vi.mock("colorthief", () => ({
  getColorSync,
  getPaletteSync,
}));

import { extractPaletteFromImageSrc } from "@/lib/image-to-ui/extract-palette-from-image-src";

describe("extractPaletteFromImageSrc", () => {
  it("returns merged dominant and palette swatches from colorthief sync APIs", async () => {
    getColorSync.mockReturnValue({ hex: () => "#ff0088" });
    getPaletteSync.mockReturnValue([
      { hex: () => "#223344" },
      { hex: () => "#aabbcc" },
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

    expect(getColorSync).toHaveBeenCalledWith(expect.any(MockImage), {
      ignoreWhite: false,
    });
    expect(getPaletteSync).toHaveBeenCalledWith(expect.any(MockImage), {
      colorCount: 6,
      ignoreWhite: false,
    });
    expect(swatches).toEqual([
      { role: "Dominant1", hex: "#FF0088" },
      { role: "Dominant2", hex: "#223344" },
      { role: "Dominant3", hex: "#AABBCC" },
    ]);

    vi.stubGlobal("Image", OriginalImage);
  });

  it("deduplicates when dominant color is already in the palette", async () => {
    getColorSync.mockReturnValue({ hex: () => "#ff0088" });
    getPaletteSync.mockReturnValue([
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

    expect(swatches.map((swatch) => swatch.hex)).toEqual(["#FF0088", "#223344"]);

    vi.stubGlobal("Image", OriginalImage);
  });
});
