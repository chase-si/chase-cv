import { renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";

import type { ActiveImage, PaletteSelectionState } from "@/lib/image-to-ui/active-image-types";
import { emptyPaletteSelection } from "@/lib/image-to-ui/active-image-types";
import { useImageToUiAnalytics } from "@/lib/image-to-ui/use-image-to-ui-analytics";

const trackEvent = vi.fn();

vi.mock("next-intl", () => ({
  useLocale: () => "en",
}));

vi.mock("@/lib/analytics", () => ({
  trackEvent: (...args: unknown[]) => trackEvent(...args),
}));

const sampleImage: ActiveImage = {
  type: "sample",
  sampleId: "great-wave",
  src: "/imgs/image-to-ui/great-wave-1280.webp",
};

function readyPalette(): PaletteSelectionState {
  return {
    ...emptyPaletteSelection(),
    extractionStatus: "ready",
    swatches: [
      { role: "Dominant1", hex: "#111111", proportion: 0.4 },
      { role: "Dominant2", hex: "#222222", proportion: 0.3 },
      { role: "Dominant3", hex: "#333333", proportion: 0.2 },
    ],
    selectedColors: ["#111111", "#222222", "#333333"],
  };
}

describe("useImageToUiAnalytics", () => {
  beforeEach(() => {
    trackEvent.mockClear();
  });

  it("records funnel events without upload filenames or personal data", async () => {
    const { rerender } = renderHook(
      (props: {
        activeImage: ActiveImage | null;
        paletteSelection: PaletteSelectionState;
        displayStep: 1 | 2;
      }) => useImageToUiAnalytics(props),
      {
        initialProps: {
          activeImage: null,
          paletteSelection: emptyPaletteSelection(),
          displayStep: 1 as const,
        },
      },
    );

    await waitFor(() => {
      expect(trackEvent).toHaveBeenCalledWith("image_to_ui_tool_start", {
        locale: "en",
        tool: "image_to_ui",
      });
    });

    rerender({
      activeImage: sampleImage,
      paletteSelection: { ...emptyPaletteSelection(), extractionStatus: "loading" },
      displayStep: 1,
    });

    await waitFor(() => {
      expect(trackEvent).toHaveBeenCalledWith("image_to_ui_image_source", {
        locale: "en",
        tool: "image_to_ui",
        source: "sample",
        sample_id: "great-wave",
      });
    });

    rerender({
      activeImage: sampleImage,
      paletteSelection: readyPalette(),
      displayStep: 1,
    });

    await waitFor(() => {
      expect(trackEvent).toHaveBeenCalledWith("image_to_ui_palette_extracted", {
        locale: "en",
        tool: "image_to_ui",
        swatch_count: 3,
      });
      expect(trackEvent).toHaveBeenCalledWith("image_to_ui_palette_complete", {
        locale: "en",
        tool: "image_to_ui",
      });
    });

    rerender({
      activeImage: sampleImage,
      paletteSelection: readyPalette(),
      displayStep: 2,
    });

    await waitFor(() => {
      expect(trackEvent).toHaveBeenCalledWith("image_to_ui_preview_generated", {
        locale: "en",
        tool: "image_to_ui",
      });
    });

    for (const call of trackEvent.mock.calls) {
      const params = call[1] as Record<string, unknown> | undefined;
      if (!params) continue;
      expect(JSON.stringify(params)).not.toMatch(/filename|@|\.png/i);
    }
  });
});
