import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { PaletteSwatch } from "@/lib/image-to-ui/normalize-dominant-palette";
import { useActiveImageSelection } from "@/lib/image-to-ui/use-active-image-selection";

describe("useActiveImageSelection palette extraction", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("extracts palette when the active image changes", async () => {
    const swatches: PaletteSwatch[] = [
      { role: "Dominant1", hex: "#FF0088", proportion: 0.35 },
      { role: "Dominant2", hex: "#112233", proportion: 0.22 },
      { role: "Dominant3", hex: "#445566", proportion: 0.15 },
    ];
    const extractPalette = vi.fn().mockResolvedValue(swatches);

    const { result } = renderHook(() => useActiveImageSelection({ extractPalette }));

    act(() => {
      result.current.selectSample("minimal-dashboard", "/samples/minimal.png");
    });

    expect(result.current.paletteSelection.extractionStatus).toBe("loading");

    await waitFor(() => {
      expect(result.current.paletteSelection.extractionStatus).toBe("ready");
    });

    expect(extractPalette).toHaveBeenCalledWith("/samples/minimal.png");
    expect(result.current.paletteSelection.swatches).toEqual(swatches);
    expect(result.current.paletteSelection.extractionError).toBeNull();
  });

  it("ignores stale extraction results after fast image switching", async () => {
    let resolveSlow: (value: PaletteSwatch[]) => void;
    const slowPromise = new Promise<PaletteSwatch[]>((resolve) => {
      resolveSlow = resolve;
    });
    const extractPalette = vi
      .fn()
      .mockImplementationOnce(() => slowPromise)
      .mockResolvedValueOnce([{ role: "Dominant1", hex: "#AABBCC", proportion: 0.2 }]);

    const { result } = renderHook(() => useActiveImageSelection({ extractPalette }));

    act(() => {
      result.current.selectSample("minimal-dashboard", "/samples/slow.png");
    });

    act(() => {
      result.current.selectSample("dark-product-card", "/samples/fast.png");
    });

    await waitFor(() => {
      expect(result.current.paletteSelection.extractionStatus).toBe("ready");
    });

    expect(result.current.paletteSelection.swatches).toEqual([
      { role: "Dominant1", hex: "#AABBCC", proportion: 0.2 },
    ]);

    act(() => {
      resolveSlow!([{ role: "Dominant2", hex: "#000000", proportion: 0.1 }]);
    });

    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current.paletteSelection.swatches).toEqual([
      { role: "Dominant1", hex: "#AABBCC", proportion: 0.2 },
    ]);
  });

  it("records a durable extraction error when palette parsing fails", async () => {
    const extractPalette = vi.fn().mockRejectedValue(new Error("unsupported"));

    const { result } = renderHook(() => useActiveImageSelection({ extractPalette }));

    act(() => {
      result.current.selectSample("minimal-dashboard", "/samples/broken.png");
    });

    await waitFor(() => {
      expect(result.current.paletteSelection.extractionStatus).toBe("error");
    });

    expect(result.current.paletteSelection.extractionError).toMatch(/无法从当前图片提取色板/);
    expect(result.current.paletteSelection.swatches).toEqual([]);
  });
});
