import { describe, expect, it } from "vitest";

import {
  emptyPaletteSelection,
  MIN_SELECTABLE_PALETTE_SWATCHES,
} from "@/lib/image-to-ui/active-image-types";
import { isPaletteRenderEnabled } from "@/lib/image-to-ui/is-palette-render-enabled";

describe("isPaletteRenderEnabled", () => {
  it("requires exactly three selected colors when enough swatches exist", () => {
    const base = {
      ...emptyPaletteSelection(),
      extractionStatus: "ready" as const,
      swatches: [
        { role: "Dominant1" as const, hex: "#111111" },
        { role: "Dominant2" as const, hex: "#222222" },
        { role: "Dominant3" as const, hex: "#333333" },
      ],
    };

    expect(isPaletteRenderEnabled({ ...base, selectedColors: [] })).toBe(false);
    expect(
      isPaletteRenderEnabled({
        ...base,
        selectedColors: ["#111111", "#222222"],
      }),
    ).toBe(false);
    expect(
      isPaletteRenderEnabled({
        ...base,
        selectedColors: ["#111111", "#222222", "#333333"],
      }),
    ).toBe(true);
  });

  it("stays disabled when fewer than three swatches are available", () => {
    expect(
      isPaletteRenderEnabled({
        ...emptyPaletteSelection(),
        extractionStatus: "ready",
        swatches: [{ role: "Dominant1", hex: "#111111" }],
        selectedColors: ["#111111", "#222222", "#333333"],
      }),
    ).toBe(false);
  });

  it("stays disabled while extraction is not ready", () => {
    expect(
      isPaletteRenderEnabled({
        ...emptyPaletteSelection(),
        extractionStatus: "loading",
        swatches: [],
        selectedColors: [],
      }),
    ).toBe(false);
    expect(MIN_SELECTABLE_PALETTE_SWATCHES).toBe(3);
  });
});
