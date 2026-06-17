import { describe, expect, it } from "vitest";

import {
  buildScopedPreviewThemeCssVariables,
  derivePreviewThemeTokens,
  hasReadableContrast,
} from "@/lib/image-to-ui/derive-preview-theme";

describe("derivePreviewThemeTokens", () => {
  it("uses classified action color for primary and ring instead of first selection", () => {
    const tokens = derivePreviewThemeTokens({
      selectedColors: ["#445566", "#FF0088", "#112233"],
      mode: "light",
    });

    expect(tokens.primary).toBe("rgb(255, 0, 136)");
    expect(tokens.ring).toBe("rgb(255, 0, 136)");
  });

  it("includes globals.css-level preview tokens for surfaces, charts, sidebar, radius, and shadow", () => {
    const tokens = derivePreviewThemeTokens({
      selectedColors: ["#9C27B0", "#2563EB", "#14B8A6"],
      mode: "dark",
    });

    expect(tokens).toMatchObject({
      background: expect.any(String),
      foreground: expect.any(String),
      card: expect.any(String),
      "card-foreground": expect.any(String),
      popover: expect.any(String),
      "popover-foreground": expect.any(String),
      muted: expect.any(String),
      "muted-foreground": expect.any(String),
      border: expect.any(String),
      input: expect.any(String),
      ring: expect.any(String),
      primary: expect.any(String),
      "primary-foreground": expect.any(String),
      secondary: expect.any(String),
      "secondary-foreground": expect.any(String),
      accent: expect.any(String),
      "accent-foreground": expect.any(String),
      destructive: expect.any(String),
      "destructive-foreground": expect.any(String),
      "chart-1": expect.any(String),
      "chart-2": expect.any(String),
      "chart-3": expect.any(String),
      "chart-4": expect.any(String),
      "chart-5": expect.any(String),
      sidebar: expect.any(String),
      "sidebar-foreground": expect.any(String),
      "sidebar-primary": expect.any(String),
      "sidebar-primary-foreground": expect.any(String),
      "sidebar-accent": expect.any(String),
      "sidebar-accent-foreground": expect.any(String),
      "sidebar-border": expect.any(String),
      "sidebar-ring": expect.any(String),
      radius: expect.any(String),
      "shadow-color": expect.any(String),
      "shadow-sm": expect.any(String),
    });
  });

  it("keeps surface hierarchy independent from primary", () => {
    const tokens = derivePreviewThemeTokens({
      selectedColors: ["#faf8f0", "#09568c", "#9e9982"],
      mode: "light",
    });

    const surfaceValues = [
      tokens.background,
      tokens.card,
      tokens.popover,
      tokens.muted,
      tokens.border,
      tokens.input,
    ];
    expect(new Set(surfaceValues).size).toBeGreaterThan(2);
    expect(surfaceValues.every((value) => value === tokens.primary)).toBe(false);
    expect(tokens.primary).toBe("rgb(9, 86, 140)");
  });

  it("derives dark mode from the same palette relationships instead of inverting light output", () => {
    const selectedColors = ["#faf8f0", "#09568c", "#9e9982"];
    const light = derivePreviewThemeTokens({ selectedColors, mode: "light" });
    const dark = derivePreviewThemeTokens({ selectedColors, mode: "dark" });

    expect(dark.background).not.toBe(light.foreground);
    expect(dark.primary).not.toBe(light.primary);
    expect(dark.primary).toBe("rgb(107, 154, 186)");
    expect(hasReadableContrast(dark.background, dark.foreground)).toBe(true);
  });

  it("generates radius and shadow defaults tied to the palette character", () => {
    const calm = derivePreviewThemeTokens({
      selectedColors: ["#faf8f0", "#09568c", "#9e9982"],
      mode: "light",
    });
    const vivid = derivePreviewThemeTokens({
      selectedColors: ["#FF0088", "#00FF88", "#8800FF"],
      mode: "light",
    });

    expect(calm.radius).toMatch(/rem$/);
    expect(vivid.radius).toMatch(/rem$/);
    expect(Number.parseFloat(calm.radius)).toBeGreaterThan(Number.parseFloat(vivid.radius));
    expect(calm["shadow-color"]).toMatch(/^#/);
    expect(calm["shadow-sm"]).toContain("4px 4px");
  });

  it("selects readable foreground tokens on colored surfaces", () => {
    const tokens = derivePreviewThemeTokens({
      selectedColors: ["#FF0088", "#FDE047", "#0EA5E9"],
      mode: "light",
    });

    expect(hasReadableContrast(tokens.primary, tokens["primary-foreground"])).toBe(true);
    expect(hasReadableContrast(tokens.secondary, tokens["secondary-foreground"])).toBe(true);
    expect(hasReadableContrast(tokens.accent, tokens["accent-foreground"])).toBe(true);
  });

  it("derives rubric-aligned light theme from painting palette order", () => {
    const tokens = derivePreviewThemeTokens({
      selectedColors: ["#faf8f0", "#09568c", "#9e9982"],
      mode: "light",
    });

    expect(tokens.primary).toBe("rgb(9, 86, 140)");
    expect(tokens.ring).toBe("rgb(9, 86, 140)");
    expect(tokens.foreground).not.toBe("rgb(0, 0, 0)");
    expect(tokens.foreground).not.toBe("rgb(255, 255, 255)");
    expect(hasReadableContrast(tokens.background, tokens.foreground)).toBe(true);
  });

  it("derives dark background from classified surface seed", () => {
    const tokens = derivePreviewThemeTokens({
      selectedColors: ["#3366FF", "#00AA55", "#FFAA00"],
      mode: "dark",
    });

    expect(tokens.primary).toBe("rgb(133, 163, 255)");
    expect(hasReadableContrast(tokens.background, tokens.foreground)).toBe(true);
    expect(hasReadableContrast(tokens.primary, tokens["primary-foreground"])).toBe(true);
  });

  it("throws when fewer than three colors are provided", () => {
    expect(() =>
      derivePreviewThemeTokens({
        selectedColors: ["#111111", "#222222"],
        mode: "light",
      }),
    ).toThrow(/three selected colors/i);
  });
});

describe("buildScopedPreviewThemeCssVariables", () => {
  it("returns local css variables for preview root", () => {
    const tokens = derivePreviewThemeTokens({
      selectedColors: ["#faf8f0", "#09568c", "#9e9982"],
      mode: "light",
    });

    expect(buildScopedPreviewThemeCssVariables(tokens)).toMatchObject({
      "--background": expect.any(String),
      "--foreground": expect.any(String),
      "--card": expect.any(String),
      "--card-foreground": expect.any(String),
      "--popover": expect.any(String),
      "--popover-foreground": expect.any(String),
      "--muted": expect.any(String),
      "--muted-foreground": expect.any(String),
      "--border": expect.any(String),
      "--input": expect.any(String),
      "--ring": expect.any(String),
      "--primary": "rgb(9, 86, 140)",
      "--primary-foreground": expect.any(String),
      "--secondary": expect.any(String),
      "--secondary-foreground": expect.any(String),
      "--accent": expect.any(String),
      "--accent-foreground": expect.any(String),
      "--chart-1": "rgb(9, 86, 140)",
      "--sidebar": expect.any(String),
      "--radius": expect.any(String),
      "--shadow-sm": expect.any(String),
    });
  });
});
