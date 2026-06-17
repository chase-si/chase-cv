import type { Palette } from "@vibrant/color";
import { describe, expect, it } from "vitest";

import { normalizeVibrantPalette } from "@/lib/image-to-ui/normalize-vibrant-palette";

function mockPalette(
  entries: Partial<Record<keyof Palette, string | null>>,
): Palette {
  const palette = {} as Palette;
  for (const [role, hex] of Object.entries(entries)) {
    palette[role] = hex
      ? {
          get hex() {
            return hex;
          },
        }
      : null;
  }
  return palette;
}

describe("normalizeVibrantPalette", () => {
  it("returns standard roles in fixed order with normalized uppercase hex", () => {
    const result = normalizeVibrantPalette(
      mockPalette({
        LightMuted: "#aabbcc",
        Vibrant: "#ff0088",
        Muted: "#112233",
        DarkVibrant: null,
        DarkMuted: "not-a-color",
        LightVibrant: "#ffffff",
      }),
    );

    expect(result).toEqual([
      { role: "Vibrant", hex: "#FF0088" },
      { role: "Muted", hex: "#112233" },
      { role: "LightVibrant", hex: "#FFFFFF" },
      { role: "LightMuted", hex: "#AABBCC" },
    ]);
  });
});
