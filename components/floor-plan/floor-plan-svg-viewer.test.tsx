import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { FloorPlanSvgViewer } from "./floor-plan-svg-viewer";
import { VALID_STANDARD_FLOOR_PLAN } from "@/lib/floor-plan/fixtures/valid-standard-plan";

// Mock ResizeObserver for jsdom
class MockResizeObserver {
  observe(el: Element) {
    // immediately trigger with dummy rect
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

describe("FloorPlanSvgViewer (AC-3 & AC-4)", () => {
  it("renders walls, ordered room boundaries, openings, furniture, and principal dimensions (AC-3)", () => {
    const onSelect = vi.fn();
    render(
      <FloorPlanSvgViewer
        plan={VALID_STANDARD_FLOOR_PLAN}
        selectedEntity={null}
        onSelect={onSelect}
      />,
    );

    // Canvas structure
    expect(screen.getByTestId("floor-plan-viewer-surface")).toBeInTheDocument();
    expect(screen.getByTestId("floor-plan-svg-canvas")).toBeInTheDocument();

    // 1. Room boundaries
    expect(screen.getByTestId("floor-plan-rooms-layer")).toBeInTheDocument();
    expect(screen.getByTestId("floor-plan-room-r1")).toBeInTheDocument();
    expect(screen.getByTestId("floor-plan-room-r2")).toBeInTheDocument();

    // 2. Walls
    expect(screen.getByTestId("floor-plan-walls-layer")).toBeInTheDocument();
    expect(screen.getByTestId("floor-plan-wall-w1")).toBeInTheDocument();
    expect(screen.getByTestId("floor-plan-wall-w7")).toBeInTheDocument();

    // 3. Openings (windows & doors)
    expect(screen.getByTestId("floor-plan-openings-layer")).toBeInTheDocument();
    expect(screen.getByTestId("floor-plan-opening-win1")).toBeInTheDocument();
    expect(screen.getByTestId("floor-plan-opening-door1")).toBeInTheDocument();

    // 4. Furniture
    expect(screen.getByTestId("floor-plan-furniture-layer")).toBeInTheDocument();
    expect(screen.getByTestId("floor-plan-furniture-f1")).toBeInTheDocument();
    expect(screen.getByTestId("floor-plan-furniture-f2")).toBeInTheDocument();

    // 5. Principal dimensions
    expect(screen.getByTestId("floor-plan-dimensions-layer")).toBeInTheDocument();
    expect(screen.getByTestId("floor-plan-dimension-dim-total-width")).toBeInTheDocument();
    expect(screen.getByTestId("floor-plan-dimension-dim-total-height")).toBeInTheDocument();
  });

  it("provides zoom in, zoom out, and fit to view controls (AC-4)", () => {
    const onSelect = vi.fn();
    render(
      <FloorPlanSvgViewer
        plan={VALID_STANDARD_FLOOR_PLAN}
        selectedEntity={null}
        onSelect={onSelect}
      />,
    );

    const zoomInBtn = screen.getByRole("button", { name: "Zoom in" });
    const zoomOutBtn = screen.getByRole("button", { name: "Zoom out" });
    const fitBtn = screen.getByRole("button", { name: "Fit to view" });
    const zoomBadge = screen.getByTestId("zoom-level-badge");

    const initialZoomText = zoomBadge.textContent;

    // Zoom in increases zoom percentage
    fireEvent.click(zoomInBtn);
    expect(zoomBadge.textContent).not.toBe(initialZoomText);

    // Zoom out decreases
    fireEvent.click(zoomOutBtn);

    // Fit resets zoom
    fireEvent.click(fitBtn);
    expect(zoomBadge.textContent).toBe(initialZoomText);
  });

  it("selects supported entities on click (AC-4)", () => {
    const onSelect = vi.fn();
    render(
      <FloorPlanSvgViewer
        plan={VALID_STANDARD_FLOOR_PLAN}
        selectedEntity={null}
        onSelect={onSelect}
      />,
    );

    // Select wall
    const wall = screen.getByTestId("floor-plan-wall-w1");
    fireEvent.click(wall);
    expect(onSelect).toHaveBeenCalledWith({ type: "wall", id: "w1" });

    // Select room
    const room = screen.getByTestId("floor-plan-room-r1");
    fireEvent.click(room);
    expect(onSelect).toHaveBeenCalledWith({ type: "room", id: "r1" });

    // Select opening
    const opening = screen.getByTestId("floor-plan-opening-win1");
    fireEvent.click(opening);
    expect(onSelect).toHaveBeenCalledWith({ type: "opening", id: "win1" });

    // Select furniture
    const furniture = screen.getByTestId("floor-plan-furniture-f1");
    fireEvent.click(furniture);
    expect(onSelect).toHaveBeenCalledWith({ type: "furniture", id: "f1" });
  });

  it("renders visual violation indicator badge and styling when violations exist (AC-12)", () => {
    const onSelect = vi.fn();
    const violationPlan = {
      ...VALID_STANDARD_FLOOR_PLAN,
      furniture: [
        {
          id: "f_violating",
          definitionId: "desk",
          x: 9000,
          y: 9000,
          width: 800,
          depth: 600,
          rotation: 0,
        },
      ],
    };

    render(
      <FloorPlanSvgViewer
        plan={violationPlan}
        selectedEntity={null}
        onSelect={onSelect}
      />,
    );

    const fEl = screen.getByTestId("floor-plan-furniture-f_violating");
    expect(fEl).toHaveAttribute("data-has-violation", "true");
    expect(screen.getByTestId("furniture-violation-badge-f_violating")).toBeInTheDocument();
  });
});
