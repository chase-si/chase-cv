import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
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

describe("Mobile Floor Plan Editor Ergonomics (AC-5, AC-4, AC-27)", () => {
  it("renders canvas as primary surface and exposes mobile touch-sized mode toggle", () => {
    render(<FloorPlanShell initialPlans={FIXTURE_PLANS} isMobile={true} />);

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
    render(<FloorPlanShell initialPlans={FIXTURE_PLANS} isMobile={true} />);

    // Switch to Pan Mode
    const panModeBtn = screen.getByTestId("mode-toggle-pan");
    fireEvent.click(panModeBtn);

    // In Pan mode, clicking on a wall or room does not open bottom sheet or select entity
    const wall1 = screen.getByTestId("floor-plan-wall-w1");
    fireEvent.click(wall1);

    expect(screen.queryByTestId("mobile-bottom-sheet")).not.toBeInTheDocument();
  });

  it("opens mobile bottom properties surface when an entity is selected in Edit Mode", () => {
    render(<FloorPlanShell initialPlans={FIXTURE_PLANS} isMobile={true} />);

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

  it("reaches Furniture catalog palette from mobile action button", () => {
    render(<FloorPlanShell initialPlans={FIXTURE_PLANS} isMobile={true} />);

    // Tap mobile "Add Furniture" action button
    const addFurnitureBtn = screen.getByTestId("mobile-add-furniture-btn");
    expect(addFurnitureBtn.className).toMatch(/min-h-\[44px\]|h-11/);
    fireEvent.click(addFurnitureBtn);

    // Furniture catalog opens in mobile bottom sheet
    const sheet = screen.getByTestId("mobile-bottom-sheet");
    expect(sheet).toBeInTheDocument();
    expect(within(sheet).getByTestId("furniture-catalog-palette")).toBeInTheDocument();
  });

  it("reaches Furniture rotate and delete in mobile bottom sheet without arbitrary resize inputs (AC-4)", () => {
    render(<FloorPlanShell initialPlans={FIXTURE_PLANS} isMobile={true} />);

    // Ensure Edit Mode
    const editModeBtn = screen.getByTestId("mode-toggle-edit");
    fireEvent.click(editModeBtn);

    // Select Sofa f1
    const sofa = screen.getByTestId("floor-plan-furniture-f1");
    fireEvent.click(sofa);

    // Inspector opens in mobile bottom sheet
    const sheet = screen.getByTestId("mobile-bottom-sheet");
    expect(sheet).toBeInTheDocument();
    expect(within(sheet).getByTestId("inspector-furniture-details")).toBeInTheDocument();
    expect(within(sheet).getByTestId("rotate-furniture-btn")).toBeInTheDocument();
    expect(within(sheet).getByTestId("delete-furniture-btn")).toBeInTheDocument();

    // AC-4: No arbitrary width or depth inputs
    expect(within(sheet).queryByTestId("furniture-width-input")).not.toBeInTheDocument();
    expect(within(sheet).queryByTestId("furniture-depth-input")).not.toBeInTheDocument();
  });

  it("exposes Spatial Rule Feedback panel in mobile bottom sheet", () => {
    render(<FloorPlanShell initialPlans={FIXTURE_PLANS} isMobile={true} />);

    // Mobile Rules button exists with >= 44px touch target
    const mobileRulesBtn = screen.getByTestId("mobile-rules-btn");
    expect(mobileRulesBtn.className).toMatch(/min-h-\[44px\]|h-11/);
    fireEvent.click(mobileRulesBtn);

    // Rule Feedback Panel opens in bottom sheet
    const sheet = screen.getByTestId("mobile-bottom-sheet");
    expect(sheet).toBeInTheDocument();
    expect(within(sheet).getByTestId("rule-feedback-panel")).toBeInTheDocument();
  });

  it("ensures critical touch targets on mobile are at least 44x44 CSS pixels", () => {
    render(<FloorPlanShell isMobile={true} initialPlans={FIXTURE_PLANS} />);

    // Mode toggle buttons
    const panModeBtn = screen.getByTestId("mode-toggle-pan");
    expect(panModeBtn.className).toMatch(/min-h-\[44px\]|h-11/);
    const editModeBtn = screen.getByTestId("mode-toggle-edit");
    expect(editModeBtn.className).toMatch(/min-h-\[44px\]|h-11/);

    // Toolbar buttons
    const addFurnitureBtn = screen.getByTestId("mobile-add-furniture-btn");
    expect(addFurnitureBtn.className).toMatch(/min-h-\[44px\]|h-11/);

    const catalogBtn = screen.getByTestId("mobile-catalog-btn");
    expect(catalogBtn.className).toMatch(/min-h-\[44px\]|h-11/);

    const rulesBtn = screen.getByTestId("mobile-rules-btn");
    expect(rulesBtn.className).toMatch(/min-h-\[44px\]|h-11/);
  });
});
