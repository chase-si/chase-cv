import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { useActiveImageSelection } from "@/lib/image-to-ui/use-active-image-selection";

vi.mock("@/lib/image-to-ui/extract-palette-from-image-src", () => ({
  extractPaletteFromImageSrc: vi.fn().mockResolvedValue([]),
}));

describe("useActiveImageSelection", () => {
  const createObjectURL = vi.fn();
  const revokeObjectURL = vi.fn();

  afterEach(() => {
    vi.restoreAllMocks();
  });

  function stubObjectUrls() {
    vi.stubGlobal("URL", {
      createObjectURL,
      revokeObjectURL,
    });
  }

  it("selecting a sample sets the active image source", () => {
    const { result } = renderHook(() => useActiveImageSelection());

    act(() => {
      result.current.selectSample("minimal-dashboard", "/image-to-ui/samples/minimal-dashboard.png");
    });

    expect(result.current.activeImage).toEqual({
      type: "sample",
      sampleId: "minimal-dashboard",
      src: "/image-to-ui/samples/minimal-dashboard.png",
    });
  });

  it("selecting an upload uses a browser object URL", () => {
    stubObjectUrls();
    createObjectURL.mockReturnValue("blob:upload-1");
    const file = new File(["pixels"], "photo.png", { type: "image/png" });

    const { result } = renderHook(() => useActiveImageSelection());

    act(() => {
      result.current.selectUpload(file);
    });

    expect(createObjectURL).toHaveBeenCalledWith(file);
    expect(result.current.activeImage).toEqual({
      type: "upload",
      objectUrl: "blob:upload-1",
    });
  });

  it("replaces the active image when switching between sample and upload", () => {
    stubObjectUrls();
    createObjectURL.mockReturnValue("blob:upload-1");
    const file = new File(["pixels"], "photo.png", { type: "image/png" });

    const { result } = renderHook(() => useActiveImageSelection());

    act(() => {
      result.current.selectSample("dark-product-card", "/samples/dark.png");
    });
    act(() => {
      result.current.selectUpload(file);
    });

    expect(result.current.activeImage?.type).toBe("upload");

    act(() => {
      result.current.selectSample("gradient-landing", "/samples/gradient.png");
    });

    expect(result.current.activeImage).toEqual({
      type: "sample",
      sampleId: "gradient-landing",
      src: "/samples/gradient.png",
    });
  });

  it("revokes the previous upload object URL when replaced or cleared", () => {
    stubObjectUrls();
    createObjectURL
      .mockReturnValueOnce("blob:first")
      .mockReturnValueOnce("blob:second");
    const first = new File(["a"], "a.png", { type: "image/png" });
    const second = new File(["b"], "b.png", { type: "image/png" });

    const { result } = renderHook(() => useActiveImageSelection());

    act(() => {
      result.current.selectUpload(first);
    });
    act(() => {
      result.current.selectUpload(second);
    });

    expect(revokeObjectURL).toHaveBeenCalledWith("blob:first");

    act(() => {
      result.current.selectSample("minimal-dashboard", "/samples/minimal.png");
    });

    expect(revokeObjectURL).toHaveBeenCalledWith("blob:second");
  });

  it("revokes upload object URLs on unmount", () => {
    stubObjectUrls();
    createObjectURL.mockReturnValue("blob:upload-1");
    const file = new File(["pixels"], "photo.png", { type: "image/png" });

    const { result, unmount } = renderHook(() => useActiveImageSelection());

    act(() => {
      result.current.selectUpload(file);
    });

    unmount();

    expect(revokeObjectURL).toHaveBeenCalledWith("blob:upload-1");
  });

  it("clears palette selection when the active image changes", () => {
    stubObjectUrls();
    createObjectURL.mockReturnValue("blob:upload-1");
    const file = new File(["pixels"], "photo.png", { type: "image/png" });

    const { result } = renderHook(() => useActiveImageSelection());

    act(() => {
      result.current.updatePaletteSelection({
        selectedColors: ["#112233", "#445566"],
        extractionStatus: "ready",
        swatches: [{ role: "Vibrant", hex: "#112233" }],
        extractionError: null,
      });
    });

    act(() => {
      result.current.selectSample("minimal-dashboard", "/samples/minimal.png");
    });

    expect(result.current.paletteSelection.selectedColors).toEqual([]);
    expect(result.current.paletteSelection.swatches).toEqual([]);
    expect(result.current.paletteSelection.extractionError).toBeNull();

    act(() => {
      result.current.updatePaletteSelection({
        selectedColors: ["#ffffff"],
        extractionStatus: "loading",
        swatches: [],
        extractionError: null,
      });
    });
    act(() => {
      result.current.selectUpload(file);
    });

    expect(result.current.paletteSelection.selectedColors).toEqual([]);
    expect(result.current.paletteSelection.swatches).toEqual([]);
    expect(result.current.paletteSelection.extractionError).toBeNull();
  });
});
