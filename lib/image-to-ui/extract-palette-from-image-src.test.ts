import { describe, expect, it, vi } from "vitest";

import { extractPaletteFromImageSrc } from "@/lib/image-to-ui/extract-palette-from-image-src";

const getPalette = vi.fn();

vi.mock("node-vibrant/browser", () => ({
  Vibrant: {
    from: vi.fn(() => ({
      getPalette,
    })),
  },
}));

describe("extractPaletteFromImageSrc", () => {
  it("returns normalized swatches from node-vibrant", async () => {
    getPalette.mockResolvedValue({
      Vibrant: { hex: "#ff0088" },
      Muted: { hex: "#223344" },
      DarkVibrant: null,
      DarkMuted: null,
      LightVibrant: null,
      LightMuted: null,
    });

    const swatches = await extractPaletteFromImageSrc("/imgs/image-to-ui/mondrian-1280.webp");

    expect(swatches).toEqual([
      { role: "Vibrant", hex: "#FF0088" },
      { role: "Muted", hex: "#223344" },
    ]);
  });
});
