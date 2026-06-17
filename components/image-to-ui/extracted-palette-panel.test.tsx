import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useState } from "react";

import { ExtractedPalettePanel } from "@/components/image-to-ui/extracted-palette-panel";
import { emptyPaletteSelection, type PaletteSelectionState } from "@/lib/image-to-ui/active-image-types";

const readySwatches = [
  { role: "Dominant1" as const, hex: "#FF0088" },
  { role: "Dominant2" as const, hex: "#112233" },
  { role: "Dominant3" as const, hex: "#445566" },
  { role: "Dominant4" as const, hex: "#AABBCC" },
];

function renderPanel(
  paletteSelection: PaletteSelectionState,
  onSelectedColorsChange = vi.fn(),
) {
  return render(
    <ExtractedPalettePanel
      hasActiveImage
      paletteSelection={paletteSelection}
      onSelectedColorsChange={onSelectedColorsChange}
    />,
  );
}

function StatefulPalettePanel({ initial }: { initial: PaletteSelectionState }) {
  const [paletteSelection, setPaletteSelection] = useState(initial);

  return (
    <ExtractedPalettePanel
      hasActiveImage
      paletteSelection={paletteSelection}
      onSelectedColorsChange={(selectedColors) =>
        setPaletteSelection((prev) => ({ ...prev, selectedColors }))
      }
    />
  );
}

describe("ExtractedPalettePanel", () => {
  afterEach(() => {
    cleanup();
  });

  it("shows loading and swatches with role names and hex values", () => {
    const { rerender } = render(
      <ExtractedPalettePanel
        hasActiveImage
        paletteSelection={{
          ...emptyPaletteSelection(),
          extractionStatus: "loading",
        }}
        onSelectedColorsChange={vi.fn()}
      />,
    );

    expect(screen.getByTestId("palette-extraction-loading")).toHaveTextContent("正在提取色板");

    rerender(
      <ExtractedPalettePanel
        hasActiveImage
        paletteSelection={{
          ...emptyPaletteSelection(),
          extractionStatus: "ready",
          swatches: readySwatches.slice(0, 3),
        }}
        onSelectedColorsChange={vi.fn()}
      />,
    );

    expect(screen.getByTestId("palette-swatch-Dominant1")).toHaveTextContent("主导色 1");
    expect(screen.getByTestId("palette-swatch-Dominant1")).toHaveTextContent("#FF0088");
  });

  it("shows inline error and insufficient swatch guidance", () => {
    renderPanel({
      ...emptyPaletteSelection(),
      extractionStatus: "error",
      extractionError: "无法从当前图片提取色板，请换一张图片或重新上传。",
    });

    expect(screen.getByRole("alert")).toHaveTextContent("无法从当前图片提取色板");

    renderPanel({
      ...emptyPaletteSelection(),
      extractionStatus: "ready",
      swatches: [{ role: "Dominant1", hex: "#FF0088" }],
    });

    expect(screen.getByTestId("palette-insufficient-swatches")).toHaveTextContent("不足 3 个");
  });

  it("shows selection order, role labels inline, and keeps render disabled until three colors", () => {
    renderPanel({
      ...emptyPaletteSelection(),
      extractionStatus: "ready",
      swatches: readySwatches,
      selectedColors: ["#FF0088", "#112233", "#445566"],
    });

    expect(screen.getByTestId("palette-swatch-order-Dominant1")).toHaveTextContent("1");
    expect(screen.getByTestId("palette-swatch-role-Dominant1")).toHaveTextContent("已选色 1");
    expect(screen.getByTestId("palette-swatch-role-Dominant2")).toHaveTextContent("已选色 2");
    expect(screen.getByTestId("palette-swatch-role-Dominant3")).toHaveTextContent("已选色 3");
    const dominant1Button = screen.getByTestId("palette-swatch-Dominant1");
    expect(within(dominant1Button).queryByTestId("palette-swatch-role-Dominant1")).toBeInTheDocument();
    expect(screen.getByTestId("palette-render-button")).toBeEnabled();
  });

  it("deselects a swatch and shows the selection limit message", () => {
    render(
      <StatefulPalettePanel
        initial={{
          ...emptyPaletteSelection(),
          extractionStatus: "ready",
          swatches: readySwatches,
          selectedColors: [],
        }}
      />,
    );

    fireEvent.click(screen.getByTestId("palette-swatch-Dominant1"));
    fireEvent.click(screen.getByTestId("palette-swatch-Dominant2"));
    fireEvent.click(screen.getByTestId("palette-swatch-Dominant3"));
    fireEvent.click(screen.getByTestId("palette-swatch-Dominant4"));

    expect(screen.getByTestId("palette-selection-limit")).toHaveTextContent("最多只能选择 3 个颜色");
    expect(screen.getByTestId("palette-swatch-role-Dominant1")).toHaveTextContent("已选色 1");

    fireEvent.click(screen.getByTestId("palette-swatch-Dominant2"));
    expect(screen.queryByTestId("palette-swatch-role-Dominant2")).not.toBeInTheDocument();
  });

  it("keeps render disabled when fewer than three colors are selected", () => {
    renderPanel({
      ...emptyPaletteSelection(),
      extractionStatus: "ready",
      swatches: readySwatches,
      selectedColors: ["#FF0088"],
    });

    expect(screen.getByTestId("palette-render-button")).toBeDisabled();
  });

  it("keeps render disabled when swatches are insufficient even with three picks", () => {
    renderPanel({
      ...emptyPaletteSelection(),
      extractionStatus: "ready",
      swatches: [{ role: "Dominant1", hex: "#FF0088" }],
      selectedColors: ["#FF0088", "#112233", "#445566"],
    });

    expect(screen.getByTestId("palette-render-button")).toBeDisabled();
  });
});
