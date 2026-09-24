import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import FloorPlanLabPage from "@/app/[locale]/floor-plan/lab/page";
import {
  getFurnitureCatalog,
  STANDARD_FURNITURE_CATALOG,
} from "@/lib/floor-plan/furniture-catalog";
import {
  FurnitureAssetPreview,
  prepareFurnitureDefinitionForRender,
  serializeFurnitureDefinitionFinalJson,
  validateFurnitureCatalog,
  validateFurnitureDefinition,
} from "./furniture-asset-preview";

vi.mock("next-intl/server", () => ({
  setRequestLocale: vi.fn(),
  getTranslations: vi.fn().mockImplementation(async () => (key: string) => key),
}));

class MockResizeObserver {
  observe(el: Element) {
    this.callback([
      {
        contentRect: { width: 800, height: 600 },
        target: el,
      },
    ]);
  }
  unobserve() {}
  disconnect() {}
  constructor(private callback: (entries: any[]) => void) {}
}

vi.stubGlobal("ResizeObserver", MockResizeObserver);

afterEach(() => {
  cleanup();
});

describe("FurnitureAssetPreview & Catalog Validation Gate (AC-19, AC-20, AC-21)", () => {
  let writeTextMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    writeTextMock = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: writeTextMock },
      configurable: true,
    });
  });

  it("validates STANDARD_FURNITURE_CATALOG and getFurnitureCatalog with the exact same validator used by the preview and reports definition/specification IDs on failure (AC-19, AC-21)", () => {
    const catalogResult = validateFurnitureCatalog(STANDARD_FURNITURE_CATALOG);
    expect(catalogResult.ok).toBe(true);

    const loadedCatalog = getFurnitureCatalog();
    expect(loadedCatalog.version).toBe(2);
    expect(loadedCatalog.unit).toBe("mm");
    expect(loadedCatalog.definitions.length).toBeGreaterThanOrEqual(12);

    // Every definition passes prepareFurnitureDefinitionForRender
    for (const def of loadedCatalog.definitions) {
      const renderRes = prepareFurnitureDefinitionForRender(
        serializeFurnitureDefinitionFinalJson(def),
      );
      expect(renderRes.ok).toBe(true);
    }

    // Corrupt a specific specification in a definition and verify both validateFurnitureDefinition and getFurnitureCatalog report the exact definition ID and specification ID
    const brokenDef = {
      ...STANDARD_FURNITURE_CATALOG.definitions[0],
      id: "bed-double-broken",
      specifications: [
        {
          ...STANDARD_FURNITURE_CATALOG.definitions[0].specifications[0],
          id: "spec-bad-clearance-01",
          clearance: {
            ...STANDARD_FURNITURE_CATALOG.definitions[0].specifications[0].clearance,
            front: { minimum: 950, recommended: 600 }, // minimum > recommended
          },
        },
      ],
    };

    const previewValidation = prepareFurnitureDefinitionForRender(
      JSON.stringify(brokenDef),
    );
    expect(previewValidation.ok).toBe(false);
    if (!previewValidation.ok) {
      expect(
        previewValidation.errors.some(
          (e) =>
            e.message.includes("bed-double-broken") &&
            e.message.includes("spec-bad-clearance-01"),
        ),
      ).toBe(true);
    }

    const brokenCatalog = {
      ...STANDARD_FURNITURE_CATALOG,
      definitions: [brokenDef],
    };
    expect(() => getFurnitureCatalog(brokenCatalog)).toThrow(
      /bed-double-broken.*spec-bad-clearance-01|spec-bad-clearance-01.*bed-double-broken/,
    );
  });

  it("switches predefined specifications, rotates across 0°/90°/180°/270° updating footprint & directional clearance zones/labels, and copies final JSON (AC-20)", async () => {
    render(<FurnitureAssetPreview locale="zh" />);

    // 1. Default valid state: bed-double with spec bed-double-1800 (1800 x 2000 mm) at 0°
    expect(screen.getByTestId("furniture-validation-status")).toHaveTextContent(
      /验证通过|Valid/i,
    );
    expect(
      screen.getByTestId("furniture-asset-svg-preview"),
    ).toBeInTheDocument();

    const footprint = screen.getByTestId("furniture-footprint-polygon");
    expect(footprint).toHaveAttribute("data-width", "1800");
    expect(footprint).toHaveAttribute("data-depth", "2000");
    expect(footprint).toHaveAttribute("data-rotation", "0");
    expect(footprint).toHaveAttribute("data-rotated-span-x", "1800");
    expect(footprint).toHaveAttribute("data-rotated-span-y", "2000");

    // Verify 0° side directions and rotated label positions:
    // back -> top (-Y), front -> bottom (+Y), left -> left (-X), right -> right (+X)
    const backLabel0 = screen.getByTestId("clearance-side-label-back");
    const frontLabel0 = screen.getByTestId("clearance-side-label-front");
    const leftLabel0 = screen.getByTestId("clearance-side-label-left");
    const rightLabel0 = screen.getByTestId("clearance-side-label-right");

    expect(backLabel0).toHaveAttribute("data-screen-direction", "top");
    expect(Number(backLabel0.getAttribute("data-label-y"))).toBeLessThan(0);

    expect(frontLabel0).toHaveAttribute("data-screen-direction", "bottom");
    expect(Number(frontLabel0.getAttribute("data-label-y"))).toBeGreaterThan(0);

    expect(leftLabel0).toHaveAttribute("data-screen-direction", "left");
    expect(Number(leftLabel0.getAttribute("data-label-x"))).toBeLessThan(0);

    expect(rightLabel0).toHaveAttribute("data-screen-direction", "right");
    expect(Number(rightLabel0.getAttribute("data-label-x"))).toBeGreaterThan(0);

    // Verify minimum and recommended clearance zones for front (600 / 900 mm)
    const frontGroup = screen.getByTestId("clearance-side-group-front");
    expect(frontGroup).toHaveAttribute("data-minimum-mm", "600");
    expect(frontGroup).toHaveAttribute("data-recommended-mm", "900");
    expect(
      screen.getByTestId("clearance-minimum-zone-front"),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("clearance-recommended-zone-front"),
    ).toBeInTheDocument();

    // 2. Switch predefined specification to bed-double-1500 (1500 x 2000 mm)
    fireEvent.click(screen.getByTestId("furniture-spec-btn-bed-double-1500"));
    expect(
      screen.getByTestId("active-spec-dimensions-badge"),
    ).toHaveTextContent("1500 × 2000");
    expect(
      screen.getByTestId("furniture-footprint-polygon"),
    ).toHaveAttribute("data-width", "1500");
    expect(
      screen.getByTestId("furniture-footprint-polygon"),
    ).toHaveAttribute("data-rotated-span-x", "1500");

    // 3. Rotate through 90°, 180°, 270° and verify rotated footprint & directional sides
    // 90° clockwise: back -> right (+X), front -> left (-X), left -> top (-Y), right -> bottom (+Y)
    fireEvent.click(screen.getByTestId("furniture-rotation-90"));
    expect(screen.getByTestId("active-rotation-badge")).toHaveTextContent(
      "90°",
    );
    expect(
      screen.getByTestId("furniture-footprint-polygon"),
    ).toHaveAttribute("data-rotated-span-x", "2000");
    expect(
      screen.getByTestId("furniture-footprint-polygon"),
    ).toHaveAttribute("data-rotated-span-y", "1500");
    expect(screen.getByTestId("clearance-side-label-back")).toHaveAttribute(
      "data-screen-direction",
      "right",
    );
    expect(screen.getByTestId("clearance-side-label-front")).toHaveAttribute(
      "data-screen-direction",
      "left",
    );
    expect(screen.getByTestId("clearance-side-label-left")).toHaveAttribute(
      "data-screen-direction",
      "top",
    );
    expect(screen.getByTestId("clearance-side-label-right")).toHaveAttribute(
      "data-screen-direction",
      "bottom",
    );

    // 180°: back -> bottom (+Y), front -> top (-Y), left -> right (+X), right -> left (-X)
    fireEvent.click(screen.getByTestId("furniture-rotation-180"));
    expect(screen.getByTestId("active-rotation-badge")).toHaveTextContent(
      "180°",
    );
    expect(
      screen.getByTestId("furniture-footprint-polygon"),
    ).toHaveAttribute("data-rotated-span-x", "1500");
    expect(
      screen.getByTestId("furniture-footprint-polygon"),
    ).toHaveAttribute("data-rotated-span-y", "2000");
    expect(screen.getByTestId("clearance-side-label-back")).toHaveAttribute(
      "data-screen-direction",
      "bottom",
    );
    expect(screen.getByTestId("clearance-side-label-front")).toHaveAttribute(
      "data-screen-direction",
      "top",
    );
    expect(screen.getByTestId("clearance-side-label-left")).toHaveAttribute(
      "data-screen-direction",
      "right",
    );
    expect(screen.getByTestId("clearance-side-label-right")).toHaveAttribute(
      "data-screen-direction",
      "left",
    );

    // 270°: back -> left (-X), front -> right (+X), left -> bottom (+Y), right -> top (-Y)
    fireEvent.click(screen.getByTestId("furniture-rotation-270"));
    expect(screen.getByTestId("active-rotation-badge")).toHaveTextContent(
      "270°",
    );
    expect(
      screen.getByTestId("furniture-footprint-polygon"),
    ).toHaveAttribute("data-rotated-span-x", "2000");
    expect(
      screen.getByTestId("furniture-footprint-polygon"),
    ).toHaveAttribute("data-rotated-span-y", "1500");
    expect(screen.getByTestId("clearance-side-label-back")).toHaveAttribute(
      "data-screen-direction",
      "left",
    );
    expect(screen.getByTestId("clearance-side-label-front")).toHaveAttribute(
      "data-screen-direction",
      "right",
    );
    expect(screen.getByTestId("clearance-side-label-left")).toHaveAttribute(
      "data-screen-direction",
      "bottom",
    );
    expect(screen.getByTestId("clearance-side-label-right")).toHaveAttribute(
      "data-screen-direction",
      "top",
    );

    // Verify orientation semantic legend is visible
    const legend = screen.getByTestId("furniture-orientation-semantic-legend");
    expect(legend).toHaveTextContent("back（后侧 / 靠墙侧）");
    expect(legend).toHaveTextContent("front（前侧 / 使用侧）");
    expect(legend).toHaveTextContent("left / right（左右侧）");

    // 4. Copy Final JSON
    const copyBtn = screen.getByTestId("copy-furniture-final-json-btn");
    expect(copyBtn).not.toBeDisabled();
    fireEvent.click(copyBtn);

    await waitFor(() => {
      expect(writeTextMock).toHaveBeenCalledTimes(1);
    });
    const copiedText = writeTextMock.mock.calls[0][0];
    const parsedCopied = JSON.parse(copiedText);
    expect(parsedCopied.id).toBe("bed-double");
    expect(parsedCopied.specifications).toHaveLength(2);
    expect(
      screen.getByTestId("copy-furniture-final-json-status"),
    ).toHaveTextContent(/已复制|Copied/i);
  });

  it("blocks SVG preview and displays deterministic errors when FurnitureDefinition JSON fails validation (AC-19, AC-20)", () => {
    render(<FurnitureAssetPreview locale="zh" />);

    const editor = screen.getByTestId("furniture-json-editor");
    const invalidDef = {
      ...STANDARD_FURNITURE_CATALOG.definitions[0],
      id: "sofa-invalid-01",
      specifications: [
        {
          ...STANDARD_FURNITURE_CATALOG.definitions[0].specifications[0],
          id: "sofa-spec-bad",
          width: -500,
          clearance: {
            ...STANDARD_FURNITURE_CATALOG.definitions[0].specifications[0].clearance,
            front: { minimum: 800, recommended: 400 },
          },
        },
      ],
    };

    fireEvent.change(editor, {
      target: { value: JSON.stringify(invalidDef, null, 2) },
    });

    // SVG preview MUST NOT render when invalid
    expect(
      screen.queryByTestId("furniture-asset-svg-preview"),
    ).not.toBeInTheDocument();

    // Validation errors panel must render with path, definition ID, and specification ID
    const errorPanel = screen.getByTestId("furniture-validation-errors");
    expect(errorPanel).toBeInTheDocument();
    expect(errorPanel).toHaveTextContent("specifications[0].width");
    expect(errorPanel).toHaveTextContent("sofa-invalid-01");
    expect(errorPanel).toHaveTextContent("sofa-spec-bad");
    expect(errorPanel).toHaveTextContent("specifications[0].clearance.front");

    // Copy Final JSON button is disabled when invalid
    expect(
      screen.getByTestId("copy-furniture-final-json-btn"),
    ).toBeDisabled();
  });

  it("switches seamlessly between Candidate Plan Preview and Furniture Asset Preview at /floor-plan/lab (AC-17, AC-20)", async () => {
    const pageJsx = await FloorPlanLabPage({
      params: Promise.resolve({ locale: "zh" }),
    });
    render(pageJsx);

    // Starts in CandidatePlanPreview by default
    expect(screen.getByTestId("candidate-plan-preview")).toBeInTheDocument();
    expect(screen.getByTestId("lab-mode-furniture-asset")).toBeInTheDocument();

    // Switch to FurnitureAssetPreview
    fireEvent.click(screen.getByTestId("lab-mode-furniture-asset"));
    expect(screen.getByTestId("furniture-asset-preview")).toBeInTheDocument();
    expect(
      screen.getByTestId("furniture-asset-svg-preview"),
    ).toBeInTheDocument();

    // Switch back to CandidatePlanPreview
    fireEvent.click(screen.getByTestId("lab-mode-candidate-plan"));
    expect(screen.getByTestId("candidate-plan-preview")).toBeInTheDocument();
  });
});
