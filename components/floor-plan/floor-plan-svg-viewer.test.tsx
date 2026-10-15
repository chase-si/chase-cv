import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
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
    expect(screen.queryByTestId("floor-plan-dimension-room-r1-h-0")).not.toBeInTheDocument();
  });

  it("shows room length and width only after the canvas toggle is turned on", () => {
    const onSelect = vi.fn();
    render(
      <FloorPlanSvgViewer
        plan={VALID_STANDARD_FLOOR_PLAN}
        selectedEntity={null}
        onSelect={onSelect}
      />,
    );

    const toggle = screen.getByRole("button", { name: "Show room dimensions" });
    expect(toggle).toHaveAttribute("aria-pressed", "false");
    expect(screen.queryByTestId("floor-plan-dimension-room-r1-h-0")).not.toBeInTheDocument();

    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByTestId("floor-plan-dimension-room-r1-h-0")).toHaveTextContent("3000");
    expect(screen.getByTestId("floor-plan-dimension-room-r1-v-0")).toHaveTextContent("5000");
    expect(screen.getByTestId("floor-plan-dimension-room-r2-h-0")).toHaveTextContent("3000");

    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-pressed", "false");
    expect(screen.queryByTestId("floor-plan-dimension-room-r1-h-0")).not.toBeInTheDocument();
    expect(screen.getByTestId("floor-plan-dimension-dim-total-width")).toBeInTheDocument();
  });

  it("moves furniture when touch drags arrive before the next render", () => {
    const onUpdatePlan = vi.fn();
    render(
      <FloorPlanSvgViewer
        plan={VALID_STANDARD_FLOOR_PLAN}
        selectedEntity={null}
        onSelect={vi.fn()}
        onUpdatePlan={onUpdatePlan}
        canvasMode="edit"
      />,
    );

    const furniture = screen.getByTestId("floor-plan-furniture-f1");
    const svg = screen.getByTestId("floor-plan-svg-canvas");
    const pointer = (type: string, x: number, y: number) =>
      new PointerEvent(type, {
        bubbles: true,
        cancelable: true,
        clientX: x,
        clientY: y,
        pointerId: 1,
        button: 0,
        pointerType: "touch",
      });

    act(() => {
      furniture.dispatchEvent(pointer("pointerdown", 40, 40));
      svg.dispatchEvent(pointer("pointermove", 140, 40));
      svg.dispatchEvent(pointer("pointerup", 140, 40));
    });

    expect(onUpdatePlan).toHaveBeenCalled();
    const moved = onUpdatePlan.mock.calls[0][0].furniture.find((item: { id: string }) => item.id === "f1");
    expect(moved.x).toBeGreaterThan(800);
    expect(moved.y).toBe(1200);
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

  it("renders opening keep-clear overlay when door is selected or has clearance violation (AC-13)", () => {
    const onSelect = vi.fn();
    const { rerender } = render(
      <FloorPlanSvgViewer
        plan={VALID_STANDARD_FLOOR_PLAN}
        selectedEntity={{ type: "opening", id: "door1" }}
        onSelect={onSelect}
      />,
    );

    // Entry door reserves the inward swing side and has no outdoor passage side.
    expect(screen.getByTestId("floor-plan-clearance-layer")).toBeInTheDocument();
    const overlay = screen.getByTestId("opening-clearance-overlay-door1");
    expect(overlay.querySelectorAll("[data-keep-clear-kind='swing']")).toHaveLength(1);
    expect(overlay.querySelectorAll("[data-keep-clear-kind='passage']")).toHaveLength(0);

    rerender(
      <FloorPlanSvgViewer
        plan={VALID_STANDARD_FLOOR_PLAN}
        selectedEntity={{ type: "opening", id: "door2" }}
        onSelect={onSelect}
      />,
    );
    const roomDoor = screen.getByTestId("opening-clearance-overlay-door2");
    expect(roomDoor.querySelectorAll("[data-keep-clear-kind='swing']")).toHaveLength(1);
    expect(roomDoor.querySelectorAll("[data-keep-clear-kind='passage']")).toHaveLength(1);

    // Rerender with active violation
    const violationResult = [
      {
        ruleId: "opening-keep-clear" as const,
        severity: "warning" as const,
        relatedEntityIds: ["door1", "f1"],
        relatedObjectIds: ["door1", "f1"],
        measuredValue: 400,
        recommendedValue: "900 mm",
        title: "Opening Keep-Clear Zone",
        message: "Door clearance encroached",
      },
    ];

    rerender(
      <FloorPlanSvgViewer
        plan={VALID_STANDARD_FLOOR_PLAN}
        selectedEntity={null}
        violations={violationResult}
        onSelect={onSelect}
      />,
    );

    expect(screen.getByTestId("opening-clearance-overlay-door1")).toBeInTheDocument();
  });

  it("renders furniture clearance zone overlay when furniture is selected or has clearance violation (AC-13)", () => {
    const onSelect = vi.fn();
    const { rerender } = render(
      <FloorPlanSvgViewer
        plan={VALID_STANDARD_FLOOR_PLAN}
        selectedEntity={{ type: "furniture", id: "f2" }} // f2 is bed-double
        onSelect={onSelect}
      />,
    );

    // Bed f2 has clearance zones (left, right, front)
    expect(screen.getByTestId("furniture-clearance-overlay-f2")).toBeInTheDocument();

    // Rerender with furniture clearance violation
    const clearanceViolation = [
      {
        ruleId: "furniture-clearance" as const,
        severity: "warning" as const,
        relatedEntityIds: ["f2", "w7"],
        relatedObjectIds: ["f2", "w7"],
        measuredValue: 300,
        recommendedValue: "600 mm",
        title: "Furniture Clearance Guidance",
        message: "Bed side clearance encroached",
      },
    ];

    rerender(
      <FloorPlanSvgViewer
        plan={VALID_STANDARD_FLOOR_PLAN}
        selectedEntity={null}
        violations={clearanceViolation}
        onSelect={onSelect}
      />,
    );

    expect(screen.getByTestId("furniture-clearance-overlay-f2")).toBeInTheDocument();
  });
});

