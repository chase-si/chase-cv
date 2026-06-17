import { describe, expect, it } from "vitest";

import {
  buildScopedPreviewThemeCssVariables,
  derivePreviewThemeTokens,
  hasReadableContrast,
} from "@/lib/image-to-ui/derive-preview-theme";

describe("derivePreviewThemeTokens", () => {
  it("maps selected colors to primary, secondary, accent", () => {
    const tokens = derivePreviewThemeTokens({
      selectedColors: ["#FF0088", "#112233", "#445566"],
      mode: "light",
    });

    expect(tokens.primary).toBe("rgb(255, 0, 136)");
    expect(tokens.secondary).toBe("rgb(17, 34, 51)");
    expect(tokens.accent).toBe("rgb(68, 85, 102)");
  });

  it("includes all required preview tokens", () => {
    const tokens = derivePreviewThemeTokens({
      selectedColors: ["#9C27B0", "#2563EB", "#14B8A6"],
      mode: "dark",
    });

    expect(tokens).toMatchObject({
      background: expect.any(String),
      foreground: expect.any(String),
      card: expect.any(String),
      "card-foreground": expect.any(String),
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
    });
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

  it("uses the primary color to drive brand focus and key surfaces", () => {
    const tokens = derivePreviewThemeTokens({
      selectedColors: ["#3366FF", "#00AA55", "#FFAA00"],
      mode: "light",
    });

    expect(tokens.ring).toBe("rgb(51, 102, 255)");
    expect(tokens.card).toBe("rgb(224, 232, 255)");
    expect(tokens.border).toBe("rgb(173, 194, 255)");
  });
});

describe("buildScopedPreviewThemeCssVariables", () => {
  it("returns local css variables for preview root", () => {
    const tokens = derivePreviewThemeTokens({
      selectedColors: ["#FF0088", "#112233", "#445566"],
      mode: "light",
    });

    expect(buildScopedPreviewThemeCssVariables(tokens)).toMatchObject({
      "--background": expect.any(String),
      "--foreground": expect.any(String),
      "--card": expect.any(String),
      "--card-foreground": expect.any(String),
      "--muted": expect.any(String),
      "--muted-foreground": expect.any(String),
      "--border": expect.any(String),
      "--input": expect.any(String),
      "--ring": expect.any(String),
      "--primary": "rgb(255, 0, 136)",
      "--primary-foreground": expect.any(String),
      "--secondary": "rgb(17, 34, 51)",
      "--secondary-foreground": expect.any(String),
      "--accent": "rgb(68, 85, 102)",
      "--accent-foreground": expect.any(String),
    });
  });
});
