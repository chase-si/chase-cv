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

  it("renders room details with read-only spans when selected in read-only mode", () => {
    const handleSelect = vi.fn();
    render(
      <FloorPlanInspector
        plan={VALID_STANDARD_FLOOR_PLAN}
        isDraftMode={false}
        selectedEntity={{ type: "room", id: "r1" }}
        onSelect={handleSelect}
      />,
    );

    expect(screen.getByTestId("inspector-room-details")).toBeInTheDocument();
    expect(screen.getByText("Living Room")).toBeInTheDocument();
    expect(screen.getByText("3000 mm")).toBeInTheDocument(); // Width
    expect(screen.getByText("5000 mm")).toBeInTheDocument(); // Depth
    expect(screen.queryByTestId("room-span-editor")).not.toBeInTheDocument();
  });

  it("renders interactive RoomSpanEditor when room is selected in draft mode (AC-6)", () => {
    const handleSelect = vi.fn();
    const handleUpdatePlan = vi.fn();
    render(
      <FloorPlanInspector
        plan={VALID_STANDARD_FLOOR_PLAN}
        isDraftMode={true}
        onUpdatePlan={handleUpdatePlan}
        selectedEntity={{ type: "room", id: "r1" }}
        onSelect={handleSelect}
      />,
    );

    expect(screen.getByTestId("inspector-room-details")).toBeInTheDocument();
    expect(screen.getByTestId("room-span-editor")).toBeInTheDocument();
    expect(screen.getByTestId("target-span-input")).toHaveValue(3000);
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
});
