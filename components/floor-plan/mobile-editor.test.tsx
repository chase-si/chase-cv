import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryDraftStorage } from "@/lib/floor-plan/draft-storage";
import { buildStandardPlanSummary } from "@/lib/floor-plan/catalog";
import { VALID_STANDARD_FLOOR_PLAN } from "@/lib/floor-plan/fixtures/valid-standard-plan";
import {
  STUDIO_STANDARD_FLOOR_PLAN,
  THREE_BED_STANDARD_FLOOR_PLAN,
} from "@/lib/floor-plan/fixtures/standard-plans";
import { FloorPlanShell } from "./floor-plan-shell";

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
    render(<FloorPlanShell initialPlans={FIXTURE_PLANS} />);

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
    render(<FloorPlanShell initialPlans={FIXTURE_PLANS} />);

    // Switch to Pan Mode
    const panModeBtn = screen.getByTestId("mode-toggle-pan");
    fireEvent.click(panModeBtn);

    // In Pan mode, clicking on a wall or room does not open bottom sheet or select entity
    const wall1 = screen.getByTestId("floor-plan-wall-w1");
    fireEvent.click(wall1);

    expect(screen.queryByTestId("mobile-bottom-sheet")).not.toBeInTheDocument();
  });

  it("opens mobile bottom properties surface when an entity is selected in Edit Mode", () => {
    render(<FloorPlanShell initialPlans={FIXTURE_PLANS} />);

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
    render(<FloorPlanShell storage={storage} initialPlans={FIXTURE_PLANS} />);

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
    render(<FloorPlanShell storage={storage} initialPlans={FIXTURE_PLANS} />);

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
    render(<FloorPlanShell storage={storage} initialPlans={FIXTURE_PLANS} />);

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
    render(<FloorPlanShell storage={storage} initialPlans={FIXTURE_PLANS} />);

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
    render(<FloorPlanShell storage={storage} initialPlans={FIXTURE_PLANS} />);

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
    render(<FloorPlanShell storage={storage} initialPlans={FIXTURE_PLANS} />);

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
    render(<FloorPlanShell storage={storage} initialPlans={FIXTURE_PLANS} />);

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

  describe("Mobile Workflow Decision Flow & Touch Ergonomics (AC-23)", () => {
    it("keeps canvas as primary surface and completes 4-stage workflow in mobile bottom panel", async () => {
      render(<FloorPlanShell isMobile={true} initialPlans={FIXTURE_PLANS} />);

      // 1. Canvas is primary surface
      expect(screen.getByTestId("floor-plan-viewer-surface")).toBeInTheDocument();
      expect(screen.getByTestId("floor-plan-svg-canvas")).toBeInTheDocument();

      // 2. Active workflow step is presented in mobile bottom panel
      const mobilePanel = screen.getByTestId("mobile-step-panel");
      expect(mobilePanel).toBeInTheDocument();

      // Stage 1: Plan stage is active
      expect(within(mobilePanel).getByTestId("stage-plan-panel")).toBeInTheDocument();
      const skipBtn = within(mobilePanel).getByTestId("skip-calibration-btn");
      expect(skipBtn.className).toMatch(/min-h-\[44px\]|h-11/);
      fireEvent.click(skipBtn);

      // Stage 2: Room stage
      expect(within(mobilePanel).getByTestId("stage-room-panel")).toBeInTheDocument();
      const roomItem = within(mobilePanel).getByTestId("room-item-r1");
      expect(roomItem.className).toMatch(/min-h-\[44px\]/);
      fireEvent.click(roomItem);
      const nextToFurnitureBtn = within(mobilePanel).getByTestId("next-to-furniture-btn");
      expect(nextToFurnitureBtn.className).toMatch(/min-h-\[44px\]|h-11/);
      fireEvent.click(nextToFurnitureBtn);

      // Stage 3: Furniture stage
      expect(within(mobilePanel).getByTestId("stage-furniture-panel")).toBeInTheDocument();
      const contextPanel = within(mobilePanel).getByTestId("context-furniture-panel");
      expect(contextPanel).toBeInTheDocument();
      // Verify touch target on context furniture add buttons
      const addContextBtns = within(contextPanel).getAllByTestId(/^add-context-furniture-/);
      expect(addContextBtns.length).toBeGreaterThan(0);
      expect(addContextBtns[0].className).toMatch(/min-h-\[44px\]|h-11/);
      fireEvent.click(addContextBtns[0]);

      // Adding a recommendation immediately produces the decision.
      await waitFor(() => {
        expect(within(mobilePanel).getByTestId("stage-decision-panel")).toBeInTheDocument();
      });

      // Stage 4: Decision stage
      expect(within(mobilePanel).getByTestId("furniture-decision-panel")).toBeInTheDocument();
      expect(within(mobilePanel).getByTestId("decision-status-badge")).toBeInTheDocument();
    });

    it("ensures critical touch targets on mobile are at least 44x44 CSS pixels", () => {
      render(<FloorPlanShell isMobile={true} initialPlans={FIXTURE_PLANS} />);

      // Stepper buttons
      const stepPlan = screen.getByTestId("stage-step-plan");
      expect(stepPlan.className).toMatch(/min-h-\[44px\]|h-11/);

      // Room item buttons
      const mobilePanel = screen.getByTestId("mobile-step-panel");
      const roomItems = within(mobilePanel).getAllByTestId(/^room-item-/);
      expect(roomItems[0].className).toMatch(/min-h-\[44px\]/);

      // Workflow actions
      const openPlanBtn = within(mobilePanel).getByTestId("open-plan-selector-btn");
      expect(openPlanBtn.className).toMatch(/min-h-\[44px\]|h-11/);

      const startCalibrateBtn = within(mobilePanel).getByTestId("start-calibration-btn");
      expect(startCalibrateBtn.className).toMatch(/min-h-\[44px\]|h-11/);

      const skipCalibrateBtn = within(mobilePanel).getByTestId("skip-calibration-btn");
      expect(skipCalibrateBtn.className).toMatch(/min-h-\[44px\]|h-11/);
    });
  });
});
