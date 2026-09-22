import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { VALID_STANDARD_FLOOR_PLAN } from "@/lib/floor-plan/fixtures/valid-standard-plan";
import { FloorPlanInspector } from "./floor-plan-inspector";

afterEach(() => {
  cleanup();
});

describe("FloorPlanInspector Component (AC-6, AC-7)", () => {
  it("renders plan summary when no entity is selected", () => {
    const handleSelect = vi.fn();
    render(
      <FloorPlanInspector
        plan={VALID_STANDARD_FLOOR_PLAN}
        selectedEntity={null}
        onSelect={handleSelect}
      />,
    );

    expect(screen.getByTestId("inspector-plan-summary")).toBeInTheDocument();
    expect(screen.getByText("2BR-Nordic-Standard")).toBeInTheDocument();
  });

  it("renders room details with area and walls and no span editor", () => {
    const handleSelect = vi.fn();
    render(
      <FloorPlanInspector
        plan={VALID_STANDARD_FLOOR_PLAN}
        selectedEntity={{ type: "room", id: "r1" }}
        onSelect={handleSelect}
      />,
    );

    expect(screen.getByTestId("inspector-room-details")).toBeInTheDocument();
    expect(screen.getByTestId("target-room-name")).toHaveTextContent("Living Room");
    expect(screen.getByTestId("target-room-area")).toHaveTextContent("15.0 m²");
    expect(screen.queryByTestId("room-span-editor")).not.toBeInTheDocument();
    expect(screen.queryByTestId("target-span-input")).not.toBeInTheDocument();
  });

  it("renders wall details and bounded rooms with navigation", () => {
    const handleSelect = vi.fn();
    render(
      <FloorPlanInspector
        plan={VALID_STANDARD_FLOOR_PLAN}
        selectedEntity={{ type: "wall", id: "w7" }}
        onSelect={handleSelect}
      />,
    );

    expect(screen.getByTestId("inspector-wall-details")).toBeInTheDocument();
    expect(screen.getByText("w7")).toBeInTheDocument();
    // w7 divides r1 (Living Room) and r2 (Master Bedroom)
    expect(screen.getByText("Living Room")).toBeInTheDocument();
    expect(screen.getByText("Master Bedroom")).toBeInTheDocument();

    // Clicking bounded room button navigates to that room
    fireEvent.click(screen.getByText("Living Room"));
    expect(handleSelect).toHaveBeenCalledWith({ type: "room", id: "r1" });
  });

  it("renders principal dimension details when dimension is selected", () => {
    const handleSelect = vi.fn();
    render(
      <FloorPlanInspector
        plan={VALID_STANDARD_FLOOR_PLAN}
        selectedEntity={{ type: "dimension", id: "dim-total-width" }}
        onSelect={handleSelect}
      />,
    );

    expect(screen.getByTestId("inspector-dimension-details")).toBeInTheDocument();
    expect(screen.getByText("Total Plan Width")).toBeInTheDocument();
    expect(screen.getByText("6000 mm")).toBeInTheDocument();
  });

  it("allows deselecting entity using deselect button", () => {
    const handleSelect = vi.fn();
    render(
      <FloorPlanInspector
        plan={VALID_STANDARD_FLOOR_PLAN}
        selectedEntity={{ type: "room", id: "r1" }}
        onSelect={handleSelect}
      />,
    );

    const deselectBtn = screen.getByTestId("inspector-deselect-btn");
    fireEvent.click(deselectBtn);
    expect(handleSelect).toHaveBeenCalledWith(null);
  });

  it("renders opening details in read-only mode without opening editor", () => {
    const handleSelect = vi.fn();
    render(
      <FloorPlanInspector
        plan={VALID_STANDARD_FLOOR_PLAN}
        selectedEntity={{ type: "opening", id: "door1" }}
        onSelect={handleSelect}
      />,
    );

    expect(screen.getByTestId("inspector-opening-details")).toBeInTheDocument();
    expect(screen.getByText("900 mm")).toBeInTheDocument();
    expect(screen.queryByTestId("opening-editor")).not.toBeInTheDocument();
    expect(screen.queryByTestId("opening-width-input")).not.toBeInTheDocument();
  });

  it("renders furniture details with rotate and delete actions and without arbitrary resize inputs (AC-4)", () => {
    const handleSelect = vi.fn();
    const handleUpdatePlan = vi.fn();
    render(
      <FloorPlanInspector
        plan={VALID_STANDARD_FLOOR_PLAN}
        onUpdatePlan={handleUpdatePlan}
        selectedEntity={{ type: "furniture", id: "f1" }}
        onSelect={handleSelect}
      />,
    );

    expect(screen.getByTestId("inspector-furniture-details")).toBeInTheDocument();
    expect(screen.getByTestId("inspector-furniture-dimensions")).toHaveTextContent("2100 × 900 mm");

    // AC-4: No arbitrary width or depth inputs
    expect(screen.queryByTestId("furniture-width-input")).not.toBeInTheDocument();
    expect(screen.queryByTestId("furniture-depth-input")).not.toBeInTheDocument();

    // Rotate button rotates furniture
    const rotateBtn = screen.getByTestId("rotate-furniture-btn");
    fireEvent.click(rotateBtn);
    expect(handleUpdatePlan).toHaveBeenCalled();
    const rotatedPlan = handleUpdatePlan.mock.calls[0][0];
    const rotatedF1 = rotatedPlan.furniture.find((f: any) => f.id === "f1");
    expect(rotatedF1.rotation).toBe(90);

    // Delete button removes furniture
    const deleteBtn = screen.getByTestId("delete-furniture-btn");
    fireEvent.click(deleteBtn);
    expect(handleUpdatePlan).toHaveBeenCalledTimes(2);
    const deletedPlan = handleUpdatePlan.mock.calls[1][0];
    expect(deletedPlan.furniture.find((f: any) => f.id === "f1")).toBeUndefined();
  });
});
