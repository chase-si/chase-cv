import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { VALID_STANDARD_FLOOR_PLAN } from "@/lib/floor-plan/fixtures/valid-standard-plan";
import { FurnitureCatalogPalette } from "./furniture-catalog-palette";

afterEach(() => {
  cleanup();
});

describe("FurnitureCatalogPalette Component (US-10, AC-10)", () => {
  it("renders all configured furniture categories and definitions", () => {
    render(
      <FurnitureCatalogPalette
        plan={VALID_STANDARD_FLOOR_PLAN}
      />,
    );

    expect(screen.getByTestId("furniture-catalog-palette")).toBeInTheDocument();
    expect(screen.getByTestId("category-filter-all")).toBeInTheDocument();
    expect(screen.getByTestId("category-filter-bed")).toBeInTheDocument();
    expect(screen.getByTestId("category-filter-sofa")).toBeInTheDocument();
    expect(screen.getByTestId("category-filter-table")).toBeInTheDocument();
    expect(screen.getByTestId("category-filter-chair")).toBeInTheDocument();
    expect(screen.getByTestId("category-filter-storage")).toBeInTheDocument();
    expect(screen.getByTestId("category-filter-desk")).toBeInTheDocument();
    expect(screen.getByTestId("category-filter-tv_stand")).toBeInTheDocument();

    // Default item presence
    expect(screen.getByTestId("furniture-catalog-card-bed-double")).toBeInTheDocument();
    expect(screen.getByTestId("furniture-catalog-card-sofa-3seat")).toBeInTheDocument();
  });

  it("filters items by selected category", () => {
    render(
      <FurnitureCatalogPalette
        plan={VALID_STANDARD_FLOOR_PLAN}
      />,
    );

    const bedFilter = screen.getByTestId("category-filter-bed");
    fireEvent.click(bedFilter);

    // Bed cards should be visible
    expect(screen.getByTestId("furniture-catalog-card-bed-double")).toBeInTheDocument();
    expect(screen.getByTestId("furniture-catalog-card-bed-single")).toBeInTheDocument();

    // Sofa card should be hidden
    expect(screen.queryByTestId("furniture-catalog-card-sofa-3seat")).not.toBeInTheDocument();
  });

  it("filters items by search query", () => {
    render(
      <FurnitureCatalogPalette
        plan={VALID_STANDARD_FLOOR_PLAN}
      />,
    );

    const searchInput = screen.getByTestId("furniture-search-input");
    fireEvent.change(searchInput, { target: { value: "wardrobe" } });

    expect(screen.getByTestId("furniture-catalog-card-wardrobe-large")).toBeInTheDocument();
    expect(screen.queryByTestId("furniture-catalog-card-bed-double")).not.toBeInTheDocument();
  });

  it("adds furniture item using default dimensions when Add is clicked (AC-10)", () => {
    const handleUpdatePlan = vi.fn();
    const handleSelect = vi.fn();

    render(
      <FurnitureCatalogPalette
        plan={VALID_STANDARD_FLOOR_PLAN}
        onUpdatePlan={handleUpdatePlan}
        onSelect={handleSelect}
      />,
    );

    const addBedBtn = screen.getByTestId("add-furniture-item-bed-double");
    fireEvent.click(addBedBtn);

    expect(handleUpdatePlan).toHaveBeenCalledTimes(1);
    const updatedPlan = handleUpdatePlan.mock.calls[0][0];

    // Added instance has bed-double default dimensions: 1800 x 2000
    const addedInstance = updatedPlan.furniture[updatedPlan.furniture.length - 1];
    expect(addedInstance).toBeDefined();
    expect(addedInstance.definitionId).toBe("bed-double");
    expect(addedInstance.width).toBe(1800);
    expect(addedInstance.depth).toBe(2000);
    expect(addedInstance.rotation).toBe(0);

    expect(handleSelect).toHaveBeenCalledWith(
      expect.objectContaining({ type: "furniture", id: addedInstance.id }),
    );
  });

  it("AC-4: displays predefined specifications under each furniture definition and allows adding a selected specification without arbitrary size inputs", () => {
    const handleUpdatePlan = vi.fn();

    render(
      <FurnitureCatalogPalette
        plan={VALID_STANDARD_FLOOR_PLAN}
        onUpdatePlan={handleUpdatePlan}
      />,
    );

    // Predefined specifications for bed-double (1800x2000 and 1500x2000) must be visible
    expect(screen.getByTestId("furniture-spec-list-bed-double")).toBeInTheDocument();
    const spec1800 = screen.getByTestId("catalog-spec-option-bed-double-1800");
    const spec1500 = screen.getByTestId("catalog-spec-option-bed-double-1500");
    expect(spec1800).toHaveTextContent("1800 × 2000 mm");
    expect(spec1500).toHaveTextContent("1500 × 2000 mm");

    // No arbitrary width/depth inputs or range text in MVP catalog
    expect(screen.queryByTestId("furniture-width-input")).not.toBeInTheDocument();
    expect(screen.queryByTestId("furniture-depth-input")).not.toBeInTheDocument();
    expect(screen.queryByText(/Range: W/i)).not.toBeInTheDocument();

    // Select 1500 × 2000 mm specification and click Add
    fireEvent.click(spec1500);
    fireEvent.click(screen.getByTestId("add-furniture-item-bed-double"));

    expect(handleUpdatePlan).toHaveBeenCalledTimes(1);
    const updatedPlan = handleUpdatePlan.mock.calls[0][0];
    const addedInstance = updatedPlan.furniture[updatedPlan.furniture.length - 1];
    expect(addedInstance.definitionId).toBe("bed-double");
    expect(addedInstance.specificationId).toBe("bed-double-1500");
    expect(addedInstance.width).toBe(1500);
    expect(addedInstance.depth).toBe(2000);
  });
});
