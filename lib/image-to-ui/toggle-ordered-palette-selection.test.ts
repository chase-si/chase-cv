import { describe, expect, it } from "vitest";

import { toggleOrderedPaletteSwatch } from "@/lib/image-to-ui/toggle-ordered-palette-selection";

describe("toggleOrderedPaletteSwatch", () => {
  it("appends an unselected color in selection order", () => {
    const result = toggleOrderedPaletteSwatch(["#111111"], "#222222");

    expect(result).toEqual({
      type: "updated",
      selectedColors: ["#111111", "#222222"],
    });
  });

  it("removes a color when the same swatch is toggled again", () => {
    const result = toggleOrderedPaletteSwatch(
      ["#111111", "#222222", "#333333"],
      "#222222",
    );

    expect(result).toEqual({
      type: "updated",
      selectedColors: ["#111111", "#333333"],
    });
  });

  it("rejects a fourth selection and keeps the existing three colors", () => {
    const current = ["#111111", "#222222", "#333333"];
    const result = toggleOrderedPaletteSwatch(current, "#444444");

    expect(result).toEqual({
      type: "limit",
      selectedColors: current,
    });
  });
});
