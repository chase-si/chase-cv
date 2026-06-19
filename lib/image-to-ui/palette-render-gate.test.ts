import { describe, expect, it } from "vitest";

import {
  emptyPaletteSelection,
  MIN_SELECTABLE_PALETTE_SWATCHES,
} from "@/lib/image-to-ui/active-image-types";
import {
  assertSelectedColorsEligibleForRender,
  evaluatePaletteRenderGate,
  isPaletteRenderEnabled,
} from "@/lib/image-to-ui/palette-render-gate";

describe("evaluatePaletteRenderGate", () => {
  const readyWithSwatches = {
    ...emptyPaletteSelection(),
    extractionStatus: "ready" as const,
    swatches: [
      { role: "Dominant1" as const, hex: "#111111", proportion: 0.4 },
      { role: "Dominant2" as const, hex: "#222222", proportion: 0.3 },
      { role: "Dominant3" as const, hex: "#333333", proportion: 0.2 },
    ],
  };

  it("denies render while extraction is not ready", () => {
    expect(
      evaluatePaletteRenderGate({
        ...emptyPaletteSelection(),
        extractionStatus: "loading",
        swatches: [],
        selectedColors: [],
      }),
    ).toEqual({ eligible: false, reason: "extraction_not_ready" });
  });

  it("denies render when fewer than three swatches are available", () => {
    expect(
      evaluatePaletteRenderGate({
        ...emptyPaletteSelection(),
        extractionStatus: "ready",
        swatches: [{ role: "Dominant1", hex: "#111111", proportion: 0.5 }],
        selectedColors: ["#111111", "#222222", "#333333"],
      }),
    ).toEqual({ eligible: false, reason: "insufficient_swatches" });
  });

  it("denies render until exactly three colors are selected", () => {
    expect(
      evaluatePaletteRenderGate({ ...readyWithSwatches, selectedColors: [] }),
    ).toEqual({ eligible: false, reason: "selection_count_invalid" });
    expect(
      evaluatePaletteRenderGate({
        ...readyWithSwatches,
        selectedColors: ["#111111", "#222222"],
      }),
    ).toEqual({ eligible: false, reason: "selection_count_invalid" });
  });

  it("allows render when extraction is ready, swatches suffice, and three colors are selected", () => {
    expect(
      evaluatePaletteRenderGate({
        ...readyWithSwatches,
        selectedColors: ["#111111", "#222222", "#333333"],
      }),
    ).toEqual({ eligible: true });
  });
});

describe("isPaletteRenderEnabled", () => {
  it("mirrors evaluatePaletteRenderGate eligibility", () => {
    const base = {
      ...emptyPaletteSelection(),
      extractionStatus: "ready" as const,
      swatches: [
        { role: "Dominant1" as const, hex: "#111111", proportion: 0.4 },
        { role: "Dominant2" as const, hex: "#222222", proportion: 0.3 },
        { role: "Dominant3" as const, hex: "#333333", proportion: 0.2 },
      ],
    };

    expect(isPaletteRenderEnabled({ ...base, selectedColors: [] })).toBe(false);
    expect(
      isPaletteRenderEnabled({
        ...base,
        selectedColors: ["#111111", "#222222", "#333333"],
      }),
    ).toBe(true);
    expect(MIN_SELECTABLE_PALETTE_SWATCHES).toBe(3);
  });
});

describe("assertSelectedColorsEligibleForRender", () => {
  it("throws when selection count does not match the render gate", () => {
    expect(() =>
      assertSelectedColorsEligibleForRender(["#111111", "#222222"], "classify palette theme roles"),
    ).toThrow(/three selected colors are required to classify palette theme roles/i);
    expect(() =>
      assertSelectedColorsEligibleForRender(["#111111", "#222222"], "derive preview theme tokens"),
    ).toThrow(/three selected colors are required to derive preview theme tokens/i);
  });

  it("allows exactly three selected colors", () => {
    expect(() =>
      assertSelectedColorsEligibleForRender(
        ["#111111", "#222222", "#333333"],
        "derive preview theme tokens",
      ),
    ).not.toThrow();
  });
});
