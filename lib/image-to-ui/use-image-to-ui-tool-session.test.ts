import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { useImageToUiToolSession } from "@/lib/image-to-ui/use-image-to-ui-tool-session";

vi.mock("next/navigation", () => ({
  usePathname: () => "/image-to-ui",
}));

vi.mock("@/lib/image-to-ui/extract-palette-from-image-src", () => ({
  extractPaletteFromImageSrc: vi.fn().mockResolvedValue([
    { role: "Dominant1", hex: "#111111", proportion: 0.3 },
    { role: "Dominant2", hex: "#222222", proportion: 0.2 },
    { role: "Dominant3", hex: "#333333", proportion: 0.1 },
  ]),
}));

describe("useImageToUiToolSession", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("does not advance to render when the palette render gate is closed", async () => {
    const { result } = renderHook(() => useImageToUiToolSession());

    act(() => {
      result.current.selectSample("great-wave", "/imgs/great-wave.webp");
    });

    await act(async () => {
      await Promise.resolve();
    });

    act(() => {
      result.current.confirmRender();
    });

    expect(result.current.displayStep).toBe(1);
    expect(result.current.isRenderEnabled).toBe(false);
  });

  it("advances to render when three swatches are selected and render is confirmed", async () => {
    const { result } = renderHook(() => useImageToUiToolSession());

    act(() => {
      result.current.selectSample("great-wave", "/imgs/great-wave.webp");
    });

    await act(async () => {
      await Promise.resolve();
    });

    act(() => {
      result.current.setSelectedPaletteColors(["#111111", "#222222", "#333333"]);
    });

    act(() => {
      result.current.confirmRender();
    });

    expect(result.current.displayStep).toBe(2);
    expect(result.current.isRenderEnabled).toBe(true);
  });

  it("returns to step 1 when the active image changes after render", async () => {
    const { result } = renderHook(() => useImageToUiToolSession());

    act(() => {
      result.current.selectSample("great-wave", "/imgs/great-wave.webp");
    });

    await act(async () => {
      await Promise.resolve();
    });

    act(() => {
      result.current.setSelectedPaletteColors(["#111111", "#222222", "#333333"]);
      result.current.confirmRender();
    });

    act(() => {
      result.current.selectSample("other", "/imgs/other.webp");
    });

    expect(result.current.displayStep).toBe(1);
  });
});
