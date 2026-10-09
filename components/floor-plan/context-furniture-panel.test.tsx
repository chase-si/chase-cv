import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { VALID_STANDARD_FLOOR_PLAN } from "@/lib/floor-plan/fixtures/valid-standard-plan";
import { getDefaultFurnitureCatalog } from "@/lib/floor-plan/furniture-catalog";
import type { FloorPlan } from "@/lib/floor-plan/types";
import { ContextFurniturePanel } from "./context-furniture-panel";

afterEach(() => {
  cleanup();
});

function createTestPlan(): FloorPlan {
  return JSON.parse(JSON.stringify(VALID_STANDARD_FLOOR_PLAN));
}

describe("ContextFurniturePanel", () => {
  const catalog = getDefaultFurnitureCatalog();

  it("AC-10: displays bed options and default dimensions when target room is master_bedroom", () => {
    const plan = createTestPlan();
    const onAdd = vi.fn();
    const onOpenCatalog = vi.fn();

    // r2 in VALID_STANDARD_FLOOR_PLAN is master_bedroom
    render(
      <ContextFurniturePanel
        plan={plan}
        targetRoomId="r2"
        catalog={catalog}
        onAddFurniture={onAdd}
        onOpenFullCatalog={onOpenCatalog}
      />,
    );

    expect(screen.getByTestId("context-furniture-panel")).toBeInTheDocument();
    expect(screen.getByTestId("recommended-furniture-bed-double")).toBeInTheDocument();
    expect(screen.getByTestId("recommended-furniture-bed-single")).toBeInTheDocument();

    // Default dimensions
    expect(screen.getByTestId("furniture-default-size-bed-double")).toHaveTextContent("1800 × 2000 mm");
    expect(screen.getByTestId("furniture-default-size-bed-single")).toHaveTextContent("1200 × 2000 mm");

    // Click Add
    const addBtn = screen.getByTestId("add-context-furniture-bed-double");
    fireEvent.click(addBtn);
    expect(onAdd).toHaveBeenCalledWith("bed-double");
  });

  it("AC-10: displays bed options when target room is bedroom", () => {
    const plan = createTestPlan();
    // Add a secondary bedroom
    plan.rooms.push({
      id: "r-guest",
      type: "bedroom",
      name: "Guest Bedroom",
      boundaryWallIds: ["w2", "w5"],
    });

    render(
      <ContextFurniturePanel
        plan={plan}
        targetRoomId="r-guest"
        catalog={catalog}
        onAddFurniture={vi.fn()}
        onOpenFullCatalog={vi.fn()}
      />,
    );

    expect(screen.getByTestId("recommended-furniture-bed-double")).toBeInTheDocument();
    expect(screen.getByTestId("recommended-furniture-bed-single")).toBeInTheDocument();
  });

  it("AC-11: displays sofa options and default dimensions when target room is living_room", () => {
    const plan = createTestPlan();
    const onAdd = vi.fn();
    const onOpenCatalog = vi.fn();

    // r1 in VALID_STANDARD_FLOOR_PLAN is living_room
    render(
      <ContextFurniturePanel
        plan={plan}
        targetRoomId="r1"
        catalog={catalog}
        onAddFurniture={onAdd}
        onOpenFullCatalog={onOpenCatalog}
      />,
    );

    expect(screen.getByTestId("context-furniture-panel")).toBeInTheDocument();
    expect(screen.getByTestId("recommended-furniture-sofa-3seat")).toBeInTheDocument();
    expect(screen.getByTestId("recommended-furniture-sofa-2seat")).toBeInTheDocument();

    // Default dimensions
    expect(screen.getByTestId("furniture-default-size-sofa-3seat")).toHaveTextContent("2100 × 900 mm");
    expect(screen.getByTestId("furniture-default-size-sofa-2seat")).toHaveTextContent("1500 × 850 mm");

    // Click Add
    const addBtn = screen.getByTestId("add-context-furniture-sofa-3seat");
    fireEvent.click(addBtn);
    expect(onAdd).toHaveBeenCalledWith("sofa-3seat");
  });

  it("AC-12: provides an entry to open full furniture catalog", () => {
    const plan = createTestPlan();
    const onOpenCatalog = vi.fn();

    render(
      <ContextFurniturePanel
        plan={plan}
        targetRoomId="r1"
        catalog={catalog}
        onAddFurniture={vi.fn()}
        onOpenFullCatalog={onOpenCatalog}
      />,
    );

    const browseBtn = screen.getByTestId("browse-full-catalog-btn");
    expect(browseBtn).toBeInTheDocument();
    fireEvent.click(browseBtn);
    expect(onOpenCatalog).toHaveBeenCalledTimes(1);
  });

  it("AC-4: lists predefined specifications for recommended furniture and allows adding a selected specification", () => {
    const plan = createTestPlan();
    const onAdd = vi.fn();

    render(
      <ContextFurniturePanel
        plan={plan}
        targetRoomId="r2"
        catalog={catalog}
        onAddFurniture={onAdd}
        onOpenFullCatalog={vi.fn()}
      />,
    );

    expect(screen.getByTestId("context-spec-list-bed-double")).toBeInTheDocument();
    const spec1500 = screen.getByTestId("context-spec-option-bed-double-1500");
    expect(spec1500).toHaveTextContent("1500 × 2000 mm");

    fireEvent.click(spec1500);
    expect(screen.getByTestId("furniture-default-size-bed-double")).toHaveTextContent("1500 × 2000 mm");

    fireEvent.click(screen.getByTestId("add-context-furniture-bed-double"));
    expect(onAdd).toHaveBeenCalledWith("bed-double", "bed-double-1500");
  });
});
