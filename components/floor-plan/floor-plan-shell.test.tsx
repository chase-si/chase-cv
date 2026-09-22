import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { VALID_STANDARD_FLOOR_PLAN } from "@/lib/floor-plan/fixtures/valid-standard-plan";
import {
  STUDIO_STANDARD_FLOOR_PLAN,
  THREE_BED_STANDARD_FLOOR_PLAN,
} from "@/lib/floor-plan/fixtures/standard-plans";
import { buildStandardPlanSummary } from "@/lib/floor-plan/catalog";
import { FloorPlanShell } from "./floor-plan-shell";

/** Editor fixtures with furniture — used by shell integration tests */
const FIXTURE_PLANS = [
  VALID_STANDARD_FLOOR_PLAN,
  STUDIO_STANDARD_FLOOR_PLAN,
  THREE_BED_STANDARD_FLOOR_PLAN,
].map((plan) => buildStandardPlanSummary(plan));

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

describe("FloorPlanShell Integration (Streamlined MVP Architecture)", () => {
  it("renders ToolPageChrome header, 2-pane workspace, toolbar, and viewer", () => {
    render(<FloorPlanShell initialPlans={FIXTURE_PLANS} />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Floor Plan Space Validator" }),
    ).toBeInTheDocument();
    expect(screen.getByTestId("tool-page-chrome")).toBeInTheDocument();
    expect(screen.getByTestId("desktop-context-pane")).toBeInTheDocument();
    expect(screen.getByTestId("floor-plan-viewer-surface")).toBeInTheDocument();
    expect(screen.getByTestId("open-plan-selector-btn")).toBeInTheDocument();
    expect(screen.getByTestId("open-furniture-catalog-btn")).toBeInTheDocument();

    // Pruned surfaces must not exist
    expect(screen.queryByTestId("floor-plan-stage-stepper")).not.toBeInTheDocument();
    expect(screen.queryByTestId("undo-btn")).not.toBeInTheDocument();
    expect(screen.queryByTestId("redo-btn")).not.toBeInTheDocument();
    expect(screen.queryByTestId("customize-plan-btn")).not.toBeInTheDocument();
    expect(screen.queryByTestId("open-advanced-tools-btn")).not.toBeInTheDocument();
  });

  it("browses and selects standard plan from on-demand selector dialog, updating canvas and summary", () => {
    render(<FloorPlanShell initialPlans={FIXTURE_PLANS} />);

    // Catalog dialog is closed initially
    expect(screen.queryByTestId("floor-plan-selector-dialog")).not.toBeInTheDocument();

    // Open on-demand selector
    fireEvent.click(screen.getByTestId("open-plan-selector-btn"));

    expect(screen.getByTestId("floor-plan-selector-dialog")).toBeInTheDocument();
    expect(screen.getByTestId("floor-plan-catalog")).toBeInTheDocument();
    expect(
      screen.getByTestId("plan-name-floor-plan-std-studio-01"),
    ).toHaveTextContent("Modern Compact Studio");

    // Select Studio plan
    const studioOpenBtn = screen.getByTestId("open-plan-btn-floor-plan-std-studio-01");
    fireEvent.click(studioOpenBtn);

    // Dialog closes and studio plan is active
    expect(screen.queryByTestId("floor-plan-selector-dialog")).not.toBeInTheDocument();
    expect(screen.getAllByText("Modern Compact Studio").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByTestId("floor-plan-room-sr1")).toBeInTheDocument();
  });

  it("selects room on canvas or room list, updating target room details and focus", () => {
    render(<FloorPlanShell initialPlans={FIXTURE_PLANS} />);

    // Click room r1 on canvas
    const room1 = screen.getByTestId("floor-plan-room-r1");
    fireEvent.click(room1);

    // Inspector shows room details
    const roomDetails = screen.getByTestId("inspector-room-details");
    expect(roomDetails).toBeInTheDocument();
    expect(within(roomDetails).getByTestId("target-room-name")).toHaveTextContent("Living Room");
    expect(within(roomDetails).getByTestId("target-room-area")).toBeInTheDocument();

    // Pruned room span editor is absent
    expect(screen.queryByTestId("room-span-editor")).not.toBeInTheDocument();
    expect(screen.queryByTestId("target-span-input")).not.toBeInTheDocument();
  });

  it("selects wall on canvas and shows read-only inspector details with bounded room navigation", () => {
    render(<FloorPlanShell initialPlans={FIXTURE_PLANS} />);

    const wall7 = screen.getByTestId("floor-plan-wall-w7");
    fireEvent.click(wall7);

    const wallDetails = screen.getByTestId("inspector-wall-details");
    expect(wallDetails).toBeInTheDocument();
    expect(within(wallDetails).getByText("w7")).toBeInTheDocument();
    expect(within(wallDetails).getByText("Living Room")).toBeInTheDocument();
    expect(within(wallDetails).getByText("Master Bedroom")).toBeInTheDocument();

    // Click bounded room to navigate
    fireEvent.click(within(wallDetails).getByText("Master Bedroom"));
    const roomDetails = screen.getByTestId("inspector-room-details");
    expect(roomDetails).toBeInTheDocument();
    expect(within(roomDetails).getByTestId("target-room-name")).toHaveTextContent("Master Bedroom");
  });

  it("selects opening on canvas and shows read-only inspector details without opening editor", () => {
    render(<FloorPlanShell initialPlans={FIXTURE_PLANS} />);

    const door1 = screen.getByTestId("floor-plan-opening-door1");
    fireEvent.click(door1);

    expect(screen.getByTestId("inspector-opening-details")).toBeInTheDocument();
    expect(screen.getByText("900 mm")).toBeInTheDocument();
    expect(screen.queryByTestId("opening-editor")).not.toBeInTheDocument();
    expect(screen.queryByTestId("opening-width-input")).not.toBeInTheDocument();
  });

  it("adds furniture from context recommendations panel into the active plan", () => {
    render(<FloorPlanShell initialPlans={FIXTURE_PLANS} />);

    const addBtns = screen.getAllByTestId(/^add-context-furniture-/);
    expect(addBtns.length).toBeGreaterThan(0);
    const initialFurnitureCount = screen.getAllByTestId(/^floor-plan-furniture-/).length;

    fireEvent.click(addBtns[0]);

    const newFurnitureCount = screen.getAllByTestId(/^floor-plan-furniture-/).length;
    expect(newFurnitureCount).toBe(initialFurnitureCount + 1);
  });

  it("opens full furniture catalog dialog and adds furniture", () => {
    render(<FloorPlanShell initialPlans={FIXTURE_PLANS} />);

    fireEvent.click(screen.getByTestId("open-furniture-catalog-btn"));
    expect(screen.getByTestId("furniture-catalog-dialog")).toBeInTheDocument();

    const addDefBtns = screen.getAllByTestId(/^add-furniture-item-/);
    expect(addDefBtns.length).toBeGreaterThan(0);
    fireEvent.click(addDefBtns[0]);

    // Dialog closes
    expect(screen.queryByTestId("furniture-catalog-dialog")).not.toBeInTheDocument();
  });

  it("selects furniture and displays read-only dimensions without arbitrary resize inputs (AC-4)", () => {
    render(<FloorPlanShell initialPlans={FIXTURE_PLANS} />);

    const sofa = screen.getByTestId("floor-plan-furniture-f1");
    fireEvent.click(sofa);

    expect(screen.getByTestId("inspector-furniture-details")).toBeInTheDocument();
    expect(screen.getByTestId("inspector-furniture-dimensions")).toHaveTextContent("2100 × 900 mm");

    // AC-4: No arbitrary inputs
    expect(screen.queryByTestId("furniture-width-input")).not.toBeInTheDocument();
    expect(screen.queryByTestId("furniture-depth-input")).not.toBeInTheDocument();

    // Rotate and Delete actions are available
    expect(screen.getByTestId("rotate-furniture-btn")).toBeInTheDocument();
    expect(screen.getByTestId("delete-furniture-btn")).toBeInTheDocument();
  });

  it("rotates and deletes selected furniture instance", () => {
    render(<FloorPlanShell initialPlans={FIXTURE_PLANS} />);

    const sofa = screen.getByTestId("floor-plan-furniture-f1");
    fireEvent.click(sofa);

    // Rotate
    fireEvent.click(screen.getByTestId("rotate-furniture-btn"));
    expect(screen.getByText("90°")).toBeInTheDocument();

    // Delete
    fireEvent.click(screen.getByTestId("delete-furniture-btn"));
    expect(screen.queryByTestId("floor-plan-furniture-f1")).not.toBeInTheDocument();
  });

  it("nudges furniture via on-screen nudge buttons and keyboard arrow keys", () => {
    render(<FloorPlanShell initialPlans={FIXTURE_PLANS} />);

    const sofa = screen.getByTestId("floor-plan-furniture-f1");
    fireEvent.click(sofa);

    expect(screen.getByText("X: 800 mm, Y: 1200 mm")).toBeInTheDocument();

    // On-screen nudge right
    fireEvent.click(screen.getByTestId("nudge-furniture-right"));
    expect(screen.getByText("X: 900 mm, Y: 1200 mm")).toBeInTheDocument();

    // Keyboard arrow down
    fireEvent.keyDown(window, { key: "ArrowDown" });
    expect(screen.getByText("X: 900 mm, Y: 1300 mm")).toBeInTheDocument();

    // Keyboard arrow up with Shift (500mm)
    fireEvent.keyDown(window, { key: "ArrowUp", shiftKey: true });
    expect(screen.getByText("X: 900 mm, Y: 800 mm")).toBeInTheDocument();
  });

  it("displays decision panel and updates verdict and spatial feedback", () => {
    render(<FloorPlanShell initialPlans={FIXTURE_PLANS} />);

    expect(screen.getByTestId("furniture-decision-panel")).toBeInTheDocument();
    expect(screen.getByTestId("decision-status-badge")).toBeInTheDocument();
    expect(screen.getByTestId("decision-summary-card")).toBeInTheDocument();
  });

  it("toggles canvas mode between pan and edit", () => {
    render(<FloorPlanShell initialPlans={FIXTURE_PLANS} />);

    const panBtn = screen.getByTestId("mode-toggle-pan");
    const editBtn = screen.getByTestId("mode-toggle-edit");

    fireEvent.click(panBtn);
    expect(panBtn.className).toContain("bg-primary");
    expect(editBtn.className).not.toContain("bg-primary");

    fireEvent.click(editBtn);
    expect(editBtn.className).toContain("bg-primary");
    expect(panBtn.className).not.toContain("bg-primary");
  });
});
