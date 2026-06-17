import { describe, expect, it } from "vitest";

import {
  derivePreviewThemeTokens,
  hasReadableContrast,
  type PreviewThemeTokens,
} from "@/lib/image-to-ui/derive-preview-theme";
import {
  buildPaintingThemeComparisonSnapshot,
  formatPaintingThemeComparisonLines,
  primaryMatchesFirstSelectedSwatch,
} from "@/lib/image-to-ui/format-painting-theme-comparison";
import {
  PAINTING_THEME_COMPARISON_FIXTURES,
  paintingThemeComparisonFixturesByTag,
} from "@/lib/image-to-ui/painting-theme-comparison-fixtures";
import { getSaturation, parseHexToRgb } from "@/lib/image-to-ui/palette-color-math";

function assertSurfaceRolesStayDistinct(tokens: PreviewThemeTokens): void {
  const roleValues = [
    tokens.background,
    tokens.card,
    tokens.muted,
    tokens.border,
    tokens.input,
    tokens.primary,
  ];
  expect(new Set(roleValues).size).toBeGreaterThanOrEqual(4);
  expect(roleValues.filter((value) => value === tokens.primary).length).toBeLessThan(
    roleValues.length - 2,
  );
}

function assertReadableSurfacePairs(tokens: PreviewThemeTokens): void {
  expect(hasReadableContrast(tokens.background, tokens.foreground)).toBe(true);
  expect(hasReadableContrast(tokens.card, tokens["card-foreground"])).toBe(true);
  expect(hasReadableContrast(tokens.muted, tokens["muted-foreground"])).toBe(true);
  expect(hasReadableContrast(tokens.primary, tokens["primary-foreground"])).toBe(true);
}

function parseRgbCss(color: string) {
  const match = color.match(/^rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/);
  if (!match) {
    throw new Error(`Expected rgb() color, got ${color}`);
  }
  return {
    r: Number(match[1]),
    g: Number(match[2]),
    b: Number(match[3]),
  };
}

function assertPrimaryFeelsPaintingAnchored(
  fixture: (typeof PAINTING_THEME_COMPARISON_FIXTURES)[number],
  tokens: PreviewThemeTokens,
): void {
  const palette = fixture.selectedColors.map((hex) => parseHexToRgb(hex));
  const primaryRgb = parseRgbCss(tokens.primary);
  const primarySaturation = getSaturation(primaryRgb);
  const paletteMaxSaturation = Math.max(...palette.map((color) => getSaturation(color)));

  expect(primarySaturation).toBeGreaterThan(0.08);
  expect(primarySaturation).toBeLessThanOrEqual(paletteMaxSaturation + 0.05);
}

describe("painting theme comparison fixtures", () => {
  it("covers New Colors.md-style harmonious palettes", () => {
    expect(paintingThemeComparisonFixturesByTag("new-colors-harmonious").length).toBeGreaterThanOrEqual(
      1,
    );
  });

  it.each(PAINTING_THEME_COMPARISON_FIXTURES)(
    "$id keeps readable surfaces and distinct UI roles ($mode)",
    (fixture) => {
      const tokens = derivePreviewThemeTokens({
        selectedColors: fixture.selectedColors,
        mode: fixture.mode,
      });

      assertReadableSurfacePairs(tokens);
      assertSurfaceRolesStayDistinct(tokens);

      if (fixture.primaryMustNotBeFirstSelected) {
        expect(primaryMatchesFirstSelectedSwatch(fixture, tokens)).toBe(false);
      }

      assertPrimaryFeelsPaintingAnchored(fixture, tokens);
    },
  );

  it("formats stable comparison lines for reviewing painting-like output", () => {
    const fixture = PAINTING_THEME_COMPARISON_FIXTURES[0];
    const snapshot = buildPaintingThemeComparisonSnapshot(fixture);
    const lines = formatPaintingThemeComparisonLines(snapshot);

    expect(lines[0]).toMatch(/^fixture=new-colors-cream-blue-neutral mode=light$/);
    expect(lines.join("\n")).toMatchSnapshot();
  });

  it("snapshots representative fixtures across light, dark, and mixed palettes", () => {
    const ids = [
      "new-colors-gray-blue-mist",
      "primary-not-first-neutral-lead",
      "low-contrast-warm-surfaces",
      "warm-cool-mixed-dark",
    ] as const;

    const report = ids.map((id) => {
      const fixture = PAINTING_THEME_COMPARISON_FIXTURES.find((entry) => entry.id === id);
      if (!fixture) {
        throw new Error(`Missing fixture ${id}`);
      }
      return formatPaintingThemeComparisonLines(buildPaintingThemeComparisonSnapshot(fixture)).join(
        "\n",
      );
    });

    expect(report).toMatchSnapshot();
  });
});
