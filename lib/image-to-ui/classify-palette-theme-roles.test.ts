import { describe, expect, it } from "vitest";

import {
  classifyPaletteThemeRoles,
  type ClassifiedPaletteThemeRoles,
} from "@/lib/image-to-ui/classify-palette-theme-roles";

function expectClassification(
  selectedColors: string[],
  expected: ClassifiedPaletteThemeRoles,
) {
  expect(classifyPaletteThemeRoles(selectedColors)).toEqual(expected);
}

describe("classifyPaletteThemeRoles", () => {
  it("classifies rubric reference palette regardless of selection order", () => {
    const expected: ClassifiedPaletteThemeRoles = {
      surfaceSeed: "#FAF8F0",
      actionSeed: "#09568C",
      supportSeed: "#9E9982",
    };

    expectClassification(["#faf8f0", "#09568c", "#9e9982"], expected);
    expectClassification(["#09568c", "#9e9982", "#faf8f0"], expected);
    expectClassification(["#9e9982", "#faf8f0", "#09568c"], expected);
  });

  it("classifies a second rubric reference set by color properties", () => {
    expectClassification(["#a1a8ae", "#09568c", "#eaebef"], {
      surfaceSeed: "#EAEBEF",
      actionSeed: "#09568C",
      supportSeed: "#A1A8AE",
    });
  });

  it("classifies the third rubric reference set regardless of selection order", () => {
    for (const selected of [
      ["#3472a1", "#cddadb", "#faf8f0"],
      ["#faf8f0", "#3472a1", "#cddadb"],
    ]) {
      const result = classifyPaletteThemeRoles(selected);
      expect(result.actionSeed).toBe("#3472A1");
      expect([result.surfaceSeed, result.supportSeed].sort()).toEqual(
        ["#CDDADB", "#FAF8F0"].sort(),
      );
    }
  });

  it("throws when fewer than three colors are provided", () => {
    expect(() => classifyPaletteThemeRoles(["#111111", "#222222"])).toThrow(
      /three selected colors/i,
    );
  });

  it("throws on invalid hex input", () => {
    expect(() =>
      classifyPaletteThemeRoles(["#111111", "#222222", "not-a-color"]),
    ).toThrow(/unsupported color/i);
  });
});
