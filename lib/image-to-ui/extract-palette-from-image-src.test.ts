import { describe, expect, it, vi } from "vitest";

const { getPaletteSync } = vi.hoisted(() => ({
  getPaletteSync: vi.fn(),
}));

vi.mock("colorthief", () => ({
  getPaletteSync,
}));

import { extractPaletteFromImageSrc } from "@/lib/image-to-ui/extract-palette-from-image-src";

describe("extractPaletteFromImageSrc", () => {
  it("returns normalized palette swatches from colorthief sync API", async () => {
    getPaletteSync.mockReturnValue([
      { hex: () => "#ff0088" },
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

    const swatches = await extractPaletteFromImageSrc("/imgs/image-to-ui/great-wave-1280.webp");

    expect(getPaletteSync).toHaveBeenCalledWith(expect.any(MockImage), {
      colorCount: 8,
      ignoreWhite: false,
    });
    expect(swatches).toEqual([
      { role: "Dominant1", hex: "#FF0088" },
      { role: "Dominant2", hex: "#223344" },
      { role: "Dominant3", hex: "#AABBCC" },
    ]);

    vi.stubGlobal("Image", OriginalImage);
  });

  it("deduplicates identical hex values in the palette", async () => {
    getPaletteSync.mockReturnValue([
      { hex: () => "#ff0088" },
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

    const swatches = await extractPaletteFromImageSrc("/imgs/image-to-ui/great-wave-1280.webp");

    expect(swatches.map((swatch) => swatch.hex)).toEqual(["#FF0088", "#223344"]);

    vi.stubGlobal("Image", OriginalImage);
  });
});
