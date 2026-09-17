import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { FloorPlanShell } from "./floor-plan-shell";

// Mock ResizeObserver for jsdom
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

describe("FloorPlanShell Integration", () => {
  it("renders ToolPageChrome header, catalog, canvas, and inspector", () => {
    render(<FloorPlanShell />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Floor Plan Space Validator" }),
    ).toBeInTheDocument();
    expect(screen.getByTestId("tool-page-chrome")).toBeInTheDocument();
    expect(screen.getByTestId("floor-plan-catalog")).toBeInTheDocument();
    expect(screen.getByTestId("floor-plan-viewer-surface")).toBeInTheDocument();
    expect(screen.getByTestId("floor-plan-inspector")).toBeInTheDocument();
  });

  it("switches plan when clicking on a different standard plan in the catalog", () => {
    render(<FloorPlanShell />);

    // Default plan is 2BR-Nordic-Standard
    expect(
      screen.getByTestId("plan-name-plan-std-2br-01"),
    ).toHaveTextContent("2BR-Nordic-Standard");

    // Select Studio plan
    const studioOpenBtn = screen.getByTestId("open-plan-btn-plan-std-studio-01");
    fireEvent.click(studioOpenBtn);

    // Header badge updates
    expect(screen.getAllByText("Modern Compact Studio").length).toBeGreaterThanOrEqual(1);

    // Canvas renders studio rooms
    expect(screen.getByTestId("floor-plan-room-sr1")).toBeInTheDocument();
  });

  it("updates inspector panel when selecting an entity in the canvas", () => {
    render(<FloorPlanShell />);

    // Initially shows plan summary
    expect(screen.getByTestId("inspector-plan-summary")).toBeInTheDocument();

    // Click on wall w1
    const wall1 = screen.getByTestId("floor-plan-wall-w1");
    fireEvent.click(wall1);

    // Inspector shows wall details
    expect(screen.getByTestId("inspector-wall-details")).toBeInTheDocument();
    expect(screen.getByText("3000 mm")).toBeInTheDocument();

    // Deselect entity
    const deselectBtn = screen.getByTestId("inspector-deselect-btn");
    fireEvent.click(deselectBtn);

    expect(screen.getByTestId("inspector-plan-summary")).toBeInTheDocument();
  });
});
