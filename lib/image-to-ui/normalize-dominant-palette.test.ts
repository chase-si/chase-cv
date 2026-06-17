import { createColor } from "colorthief";
import { describe, expect, it } from "vitest";

import { normalizeColorthiefPalette } from "@/lib/image-to-ui/normalize-dominant-palette";

describe("normalizeColorthiefPalette", () => {
  it("preserves dominance order and normalizes hex", () => {
    const colors = [
      createColor(255, 0, 136, 4000, 0.35),
      createColor(34, 51, 68, 2500, 0.22),
      createColor(170, 187, 204, 1200, 0.1),
    ];

    expect(normalizeColorthiefPalette(colors)).toEqual([
      { role: "Dominant1", hex: "#FF0088" },
      { role: "Dominant2", hex: "#223344" },
      { role: "Dominant3", hex: "#AABBCC" },
    ]);
  });

  it("includes white and near-white when they lead by population", () => {
    const colors = [
      createColor(252, 252, 250, 6000, 0.45),
      createColor(28, 72, 140, 2200, 0.18),
      createColor(200, 180, 40, 900, 0.08),
    ];

    const swatches = normalizeColorthiefPalette(colors);

    expect(swatches[0]).toEqual({ role: "Dominant1", hex: "#FCFCFA" });
    expect(swatches.some((swatch) => swatch.hex === "#FCFCFA")).toBe(true);
  });

  it("orders swatches by the input palette sequence (population rank from colorthief)", () => {
    const colors = [
      createColor(10, 20, 30, 5000, 0.5),
      createColor(240, 241, 245, 3000, 0.3),
      createColor(180, 90, 20, 1000, 0.1),
    ];

    expect(normalizeColorthiefPalette(colors).map((swatch) => swatch.hex)).toEqual([
      "#0A141E",
      "#F0F1F5",
      "#B45A14",
    ]);
  });

  it("deduplicates identical hex values while keeping dominance ranks contiguous", () => {
    const colors = [
      createColor(255, 0, 0, 4000, 0.4),
      createColor(255, 0, 0, 2000, 0.2),
      createColor(0, 128, 255, 1500, 0.15),
    ];

    expect(normalizeColorthiefPalette(colors)).toEqual([
      { role: "Dominant1", hex: "#FF0000" },
      { role: "Dominant2", hex: "#0080FF" },
    ]);
  });
});
