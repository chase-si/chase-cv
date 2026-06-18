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
      { hex: () => "#ff0088", proportion: 0.35 },
      { hex: () => "#223344", proportion: 0.22 },
      { hex: () => "#aabbcc", proportion: 0.1 },
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
      colorCount: 10,
      ignoreWhite: false,
    });
    expect(swatches).toEqual([
      { role: "Dominant1", hex: "#FF0088", proportion: 0.35 },
      { role: "Dominant2", hex: "#223344", proportion: 0.22 },
      { role: "Dominant3", hex: "#AABBCC", proportion: 0.1 },
    ]);

    vi.stubGlobal("Image", OriginalImage);
  });

  it("deduplicates identical hex values in the palette", async () => {
    getPaletteSync.mockReturnValue([
      { hex: () => "#ff0088", proportion: 0.4 },
      { hex: () => "#ff0088", proportion: 0.2 },
      { hex: () => "#223344", proportion: 0.15 },
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
    expect(swatches[0]?.proportion).toBe(0.6);

    vi.stubGlobal("Image", OriginalImage);
  });
});
