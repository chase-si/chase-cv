import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryDraftStorage } from "@/lib/floor-plan/draft-storage";
import { getStandardPlans } from "@/lib/floor-plan/catalog";
import { FloorPlanShell } from "./floor-plan-shell";

// Mock ResizeObserver for jsdom
class MockResizeObserver {
  observe(el: Element) {
    this.callback([
      {
        contentRect: { width: 390, height: 844 }, // Representative mobile viewport (e.g. iPhone 14)
        target: el,
      },
    ]);
  }
  unobserve() {}
  disconnect() {}
  constructor(private callback: (entries: any[]) => void) {}
}

vi.stubGlobal("ResizeObserver", MockResizeObserver);

beforeEach(() => {
  Object.defineProperty(window, "innerWidth", {
    writable: true,
    configurable: true,
    value: 390,
  });
  window.dispatchEvent(new Event("resize"));
});

afterEach(() => {
  Object.defineProperty(window, "innerWidth", {
    writable: true,
    configurable: true,
    value: 1024,
  });
  window.dispatchEvent(new Event("resize"));
  cleanup();
});

describe("Mobile Floor Plan Editor Ergonomics (AC-5)", () => {
  it("renders canvas as primary surface and exposes mobile touch-sized mode toggle", () => {
    render(<FloorPlanShell />);

    // Canvas remains primary and visible
    expect(screen.getByTestId("floor-plan-viewer-surface")).toBeInTheDocument();
    expect(screen.getByTestId("floor-plan-svg-canvas")).toBeInTheDocument();

    // Mode toggle buttons exist
    const panModeBtn = screen.getByTestId("mode-toggle-pan");
    const editModeBtn = screen.getByTestId("mode-toggle-edit");

    expect(panModeBtn).toBeInTheDocument();
    expect(editModeBtn).toBeInTheDocument();

    // Mobile touch targets >= 44x44px
    expect(panModeBtn.className).toMatch(/min-h-\[44px\]|h-11/);
    expect(panModeBtn.className).toMatch(/min-w-\[44px\]/);
    expect(editModeBtn.className).toMatch(/min-h-\[44px\]|h-11/);
    expect(editModeBtn.className).toMatch(/min-w-\[44px\]/);
  });

  it("prevents accidental entity selection and edits when in Pan Mode", () => {
    render(<FloorPlanShell />);

    // Switch to Pan Mode
    const panModeBtn = screen.getByTestId("mode-toggle-pan");
    fireEvent.click(panModeBtn);

    // In Pan mode, clicking on a wall or room does not open bottom sheet or select entity
    const wall1 = screen.getByTestId("floor-plan-wall-w1");
    fireEvent.click(wall1);

    expect(screen.queryByTestId("mobile-bottom-sheet")).not.toBeInTheDocument();
  });

  it("opens mobile bottom properties surface when an entity is selected in Edit Mode", () => {
    render(<FloorPlanShell />);

    // Switch to Edit Mode
    const editModeBtn = screen.getByTestId("mode-toggle-edit");
    fireEvent.click(editModeBtn);

    // Click on wall w1
    const wall1 = screen.getByTestId("floor-plan-wall-w1");
    fireEvent.click(wall1);

    // Mobile bottom sheet opens
    const sheet = screen.getByTestId("mobile-bottom-sheet");
    expect(sheet).toBeInTheDocument();
    expect(sheet).toHaveTextContent("Wall");
    expect(within(sheet).getByTestId("inspector-wall-details")).toBeInTheDocument();

    // Canvas remains mounted and visible while bottom sheet is open
    expect(screen.getByTestId("floor-plan-svg-canvas")).toBeInTheDocument();

    // Close bottom sheet
    const closeBtn = screen.getByTestId("mobile-bottom-sheet-close");
    expect(closeBtn.className).toMatch(/min-h-\[44px\]|h-11/);
    fireEvent.click(closeBtn);

    expect(screen.queryByTestId("mobile-bottom-sheet")).not.toBeInTheDocument();
  });

  it("reaches Room span editing in mobile bottom sheet during draft mode", async () => {
    const storage = new MemoryDraftStorage();
    render(<FloorPlanShell storage={storage} />);

    // Enter draft mode
    const customizeBtn = screen.getByTestId("customize-plan-btn");
    fireEvent.click(customizeBtn);

    await waitFor(() => {
      expect(screen.getByTestId("save-status-badge")).toBeInTheDocument();
    });

    // Ensure Edit Mode
    const editModeBtn = screen.getByTestId("mode-toggle-edit");
    fireEvent.click(editModeBtn);

    // Select Living Room (r1)
    const room1 = screen.getByTestId("floor-plan-room-r1");
    fireEvent.click(room1);

    // Mobile bottom sheet opens with Room Span Editor
    const sheet = screen.getByTestId("mobile-bottom-sheet");
    expect(sheet).toBeInTheDocument();
    expect(within(sheet).getByTestId("room-span-editor")).toBeInTheDocument();
    expect(within(sheet).getByTestId("apply-span-btn")).toBeInTheDocument();
  });

  it("reaches Opening position/width editing in mobile bottom sheet", async () => {
    const storage = new MemoryDraftStorage();
    render(<FloorPlanShell storage={storage} />);

    // Enter draft mode
    const customizeBtn = screen.getByTestId("customize-plan-btn");
    fireEvent.click(customizeBtn);

    await waitFor(() => {
      expect(screen.getByTestId("save-status-badge")).toBeInTheDocument();
    });

    // Ensure Edit Mode
    const editModeBtn = screen.getByTestId("mode-toggle-edit");
    fireEvent.click(editModeBtn);

    // Select Door door1
    const door1 = screen.getByTestId("floor-plan-opening-door1");
    fireEvent.click(door1);

    // Mobile bottom sheet opens with Opening Editor
    const sheet = screen.getByTestId("mobile-bottom-sheet");
    expect(sheet).toBeInTheDocument();
    expect(within(sheet).getByTestId("opening-editor")).toBeInTheDocument();
    expect(within(sheet).getByTestId("opening-width-input")).toBeInTheDocument();
  });

  it("reaches Furniture catalog palette from mobile action button", async () => {
    const storage = new MemoryDraftStorage();
    render(<FloorPlanShell storage={storage} />);

    // Enter draft mode
    const customizeBtn = screen.getByTestId("customize-plan-btn");
    fireEvent.click(customizeBtn);

    await waitFor(() => {
      expect(screen.getByTestId("save-status-badge")).toBeInTheDocument();
    });

    // Tap mobile "Add Furniture" action button
    const addFurnitureBtn = screen.getByTestId("mobile-add-furniture-btn");
    expect(addFurnitureBtn.className).toMatch(/min-h-\[44px\]|h-11/);
    fireEvent.click(addFurnitureBtn);

    // Furniture catalog opens in mobile bottom sheet
    const sheet = screen.getByTestId("mobile-bottom-sheet");
    expect(sheet).toBeInTheDocument();
    expect(within(sheet).getByTestId("furniture-catalog-palette")).toBeInTheDocument();
  });

  it("reaches Furniture rotate, delete, and resize in mobile bottom sheet", async () => {
    const storage = new MemoryDraftStorage();
    render(<FloorPlanShell storage={storage} />);

    // Enter draft mode
    const customizeBtn = screen.getByTestId("customize-plan-btn");
    fireEvent.click(customizeBtn);

    await waitFor(() => {
      expect(screen.getByTestId("save-status-badge")).toBeInTheDocument();
    });

    // Ensure Edit Mode
    const editModeBtn = screen.getByTestId("mode-toggle-edit");
    fireEvent.click(editModeBtn);

    // Select Sofa f1
    const sofa = screen.getByTestId("floor-plan-furniture-f1");
    fireEvent.click(sofa);

    // Furniture Editor opens in mobile bottom sheet
    const sheet = screen.getByTestId("mobile-bottom-sheet");
    expect(sheet).toBeInTheDocument();
    expect(within(sheet).getByTestId("furniture-editor")).toBeInTheDocument();
    expect(within(sheet).getByTestId("rotate-furniture-btn")).toBeInTheDocument();
    expect(within(sheet).getByTestId("delete-furniture-btn")).toBeInTheDocument();
    expect(within(sheet).getByTestId("furniture-width-input")).toBeInTheDocument();
  });

  it("exposes Undo and Redo actions on mobile with touch-sized targets", async () => {
    const storage = new MemoryDraftStorage();
    render(<FloorPlanShell storage={storage} />);

    // Enter draft mode
    const customizeBtn = screen.getByTestId("customize-plan-btn");
    fireEvent.click(customizeBtn);

    await waitFor(() => {
      expect(screen.getByTestId("save-status-badge")).toBeInTheDocument();
    });

    // Undo and Redo buttons exist with >= 44px touch targets
    const undoBtn = screen.getByTestId("undo-btn");
    const redoBtn = screen.getByTestId("redo-btn");

    expect(undoBtn.className).toMatch(/min-h-\[44px\]|h-11/);
    expect(redoBtn.className).toMatch(/min-h-\[44px\]|h-11/);
  });

  it("exposes Spatial Rule Feedback panel in mobile bottom sheet", async () => {
    const storage = new MemoryDraftStorage();
    render(<FloorPlanShell storage={storage} />);

    // Mobile Rules button exists with >= 44px touch target
    const mobileRulesBtn = screen.getByTestId("mobile-rules-btn");
    expect(mobileRulesBtn.className).toMatch(/min-h-\[44px\]|h-11/);
    fireEvent.click(mobileRulesBtn);

    // Rule Feedback Panel opens in bottom sheet
    const sheet = screen.getByTestId("mobile-bottom-sheet");
    expect(sheet).toBeInTheDocument();
    expect(within(sheet).getByTestId("rule-feedback-panel")).toBeInTheDocument();
  });

  it("exposes Export JSON action on mobile with touch-sized target", async () => {
    const storage = new MemoryDraftStorage();
    render(<FloorPlanShell storage={storage} />);

    // Enter draft mode
    const customizeBtn = screen.getByTestId("customize-plan-btn");
    fireEvent.click(customizeBtn);

    await waitFor(() => {
      expect(screen.getByTestId("save-status-badge")).toBeInTheDocument();
    });

    // Open Advanced Tools dialog (AC-26)
    const advancedBtn = screen.getByTestId("advanced-tools-btn");
    expect(advancedBtn.className).toMatch(/min-h-\[44px\]|h-11/);
    fireEvent.click(advancedBtn);
    fireEvent.click(screen.getByTestId("advanced-tab-manage"));

    const exportBtn = screen.getByTestId("export-json-btn");
    expect(exportBtn.className).toMatch(/min-h-\[44px\]|h-11/);
  });
});
