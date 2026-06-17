import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ExtractedPalettePanel } from "@/components/image-to-ui/extracted-palette-panel";
import { emptyPaletteSelection } from "@/lib/image-to-ui/active-image-types";

describe("ExtractedPalettePanel", () => {
  it("shows loading and swatches with role names and hex values", () => {
    const { rerender } = render(
      <ExtractedPalettePanel
        hasActiveImage
        paletteSelection={{
          ...emptyPaletteSelection(),
          extractionStatus: "loading",
        }}
      />,
    );

    expect(screen.getByTestId("palette-extraction-loading")).toHaveTextContent("正在提取色板");

    rerender(
      <ExtractedPalettePanel
        hasActiveImage
        paletteSelection={{
          ...emptyPaletteSelection(),
          extractionStatus: "ready",
          swatches: [
            { role: "Vibrant", hex: "#FF0088" },
            { role: "Muted", hex: "#112233" },
            { role: "DarkVibrant", hex: "#445566" },
          ],
        }}
      />,
    );

    expect(screen.getByTestId("palette-swatch-Vibrant")).toHaveTextContent("Vibrant");
    expect(screen.getByTestId("palette-swatch-Vibrant")).toHaveTextContent("#FF0088");
  });

  it("shows inline error and insufficient swatch guidance", () => {
    render(
      <ExtractedPalettePanel
        hasActiveImage
        paletteSelection={{
          ...emptyPaletteSelection(),
          extractionStatus: "error",
          extractionError: "无法从当前图片提取色板，请换一张图片或重新上传。",
        }}
      />,
    );

    expect(screen.getByRole("alert")).toHaveTextContent("无法从当前图片提取色板");

    render(
      <ExtractedPalettePanel
        hasActiveImage
        paletteSelection={{
          ...emptyPaletteSelection(),
          extractionStatus: "ready",
          swatches: [{ role: "Vibrant", hex: "#FF0088" }],
        }}
      />,
    );

    expect(screen.getByTestId("palette-insufficient-swatches")).toHaveTextContent("不足 3 个");
  });
});
