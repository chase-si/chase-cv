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
    expect(rulesBtn.className).toMatch(/min-h-\[44px\]|h-11|min-h-11/);
  });

  it("AC-23: keeps floor-plan canvas primary above stacked controls on 375x812 mobile viewport with no horizontal overflow and completes full placement-assessment journey with >= 44x44px touch targets", () => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 375,
    });
    Object.defineProperty(window, "innerHeight", {
      writable: true,
      configurable: true,
      value: 812,
    });
    window.dispatchEvent(new Event("resize"));

    render(<FloorPlanShell isMobile={true} initialPlans={FIXTURE_PLANS} locale="zh" />);

    // 1. Canvas section is primary (order-1) and precedes controls rail (order-2) in DOM & mobile stack
    const canvasSection = screen.getByTestId("floor-plan-canvas-section");
    const contextPane = screen.getByTestId("desktop-context-pane");
    expect(canvasSection.className).toContain("order-1");
    expect(contextPane.className).toContain("order-2");
    expect(
      canvasSection.compareDocumentPosition(contextPane) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();

    // Outer workspace prevents unintended horizontal scroll
    expect(canvasSection.parentElement?.parentElement?.className).toContain("overflow-x-hidden");

    // 2. Verify >= 44x44px touch target classes across all core flow controls
    const changePlanBtn = screen.getByTestId("open-plan-selector-btn");
    const addFurnitureHeaderBtn = screen.getByTestId("open-furniture-catalog-btn");
    expect(changePlanBtn.className).toMatch(/min-h-11|min-h-\[44px\]/);
    expect(changePlanBtn.className).toMatch(/min-w-11|min-w-\[44px\]/);
    expect(addFurnitureHeaderBtn.className).toMatch(/min-h-11|min-h-\[44px\]/);
    expect(addFurnitureHeaderBtn.className).toMatch(/min-w-11|min-w-\[44px\]/);

    // Select plan via dialog on mobile
    fireEvent.click(changePlanBtn);
    const openStudioBtn = screen.getByTestId("open-plan-btn-floor-plan-std-studio-01");
    expect(openStudioBtn.className).toMatch(/min-h-11|min-h-\[44px\]/);
    expect(openStudioBtn.className).toMatch(/min-w-11|min-w-\[44px\]/);
    fireEvent.click(openStudioBtn);

    // Select focus room in stacked controls
    const roomItem = screen.getByTestId("room-item-sr1");
    expect(roomItem.className).toMatch(/min-h-\[44px\]|min-h-11/);
    fireEvent.click(roomItem);

    // Add furniture from context panel
    const contextSpecOption = screen.getAllByTestId(/^context-spec-option-/)[0];
    expect(contextSpecOption.className).toMatch(/min-h-11|min-h-\[44px\]/);
    expect(contextSpecOption.className).toMatch(/min-w-11|min-w-\[44px\]/);

    const addContextBtn = screen.getAllByTestId(/^add-context-furniture-/)[0];
    expect(addContextBtn.className).toMatch(/min-h-11|min-h-\[44px\]/);
    expect(addContextBtn.className).toMatch(/min-w-11|min-w-\[44px\]/);
    fireEvent.click(addContextBtn);

    // Target placement selector pill in placed-furniture-list
    const targetSelectBtns = screen.getAllByTestId(/^select-target-furniture-/);
    expect(targetSelectBtns.length).toBeGreaterThan(0);
    expect(targetSelectBtns[0].className).toMatch(/min-h-11|min-h-\[44px\]/);
    expect(targetSelectBtns[0].className).toMatch(/min-w-11|min-w-\[44px\]/);

    // Specification switch pills in decision panel & inspector
    const decisionSpecBtns = screen.getAllByTestId(/^switch-specification-/);
    expect(decisionSpecBtns.length).toBeGreaterThan(0);
    expect(decisionSpecBtns[0].className).toMatch(/min-h-11|min-h-\[44px\]/);
    expect(decisionSpecBtns[0].className).toMatch(/min-w-11|min-w-\[44px\]/);
    fireEvent.click(decisionSpecBtns[decisionSpecBtns.length - 1]);

    // Rotate, Nudge, and Delete buttons in stacked inspector on mobile
    const rotateBtn = screen.getByTestId("rotate-furniture-btn");
    const deleteBtn = screen.getByTestId("delete-furniture-btn");
    const nudgeLeft = screen.getByTestId("nudge-furniture-left");
    const nudgeRight = screen.getByTestId("nudge-furniture-right");
    const nudgeUp = screen.getByTestId("nudge-furniture-up");
    const nudgeDown = screen.getByTestId("nudge-furniture-down");

    for (const btn of [rotateBtn, deleteBtn, nudgeLeft, nudgeRight, nudgeUp, nudgeDown]) {
      expect(btn.className).toMatch(/min-h-11|min-h-\[44px\]/);
      expect(btn.className).toMatch(/min-w-11|min-w-\[44px\]/);
    }

    // Perform non-drag nudge, rotate, and delete on mobile
    fireEvent.click(nudgeRight);
    fireEvent.click(nudgeDown);
    fireEvent.click(rotateBtn);
    expect(screen.getByTestId("furniture-decision-panel")).toBeInTheDocument();
  });

  it("AC-24: exposes accessible names, visible focus rings, programmatic selection states, and full keyboard/button non-drag placement adjustments", () => {
    render(<FloorPlanShell isMobile={false} initialPlans={FIXTURE_PLANS} locale="zh" />);

    // 1. Canvas furniture has accessible name, focus-visible ring, role='button', aria-pressed, and data-selected
    const svgSofa = screen.getByTestId("floor-plan-furniture-f1");
    expect(svgSofa).toHaveAttribute("role", "button");
    expect(svgSofa).toHaveAttribute("tabindex", "0");
    expect(svgSofa.getAttribute("aria-label")).toContain("三人位沙发");
    expect(svgSofa.getAttribute("class")).toContain("focus-visible:ring-2");

    // Select via keyboard Enter on canvas furniture
    fireEvent.keyDown(svgSofa, { key: "Enter" });
    expect(svgSofa).toHaveAttribute("data-selected", "true");
    expect(svgSofa).toHaveAttribute("aria-pressed", "true");
    expect(svgSofa).toHaveAttribute("aria-selected", "true");

    // 2. Placed furniture list button has accessible name, focus ring, aria-pressed, and data-selected
    const targetBtnF1 = screen.getByTestId("select-target-furniture-f1");
    expect(targetBtnF1).toHaveAttribute("aria-pressed", "true");
    expect(targetBtnF1).toHaveAttribute("data-selected", "true");
    expect(targetBtnF1.getAttribute("aria-label")).toContain("三人位沙发");
    expect(targetBtnF1.className).toContain("focus-visible:ring-2");

    // 3. Specification switch buttons have accessible name, focus ring, aria-pressed, and data-selected
    const specBtn = screen.getByTestId("switch-specification-sofa-3seat-2100");
    expect(specBtn).toHaveAttribute("aria-pressed", "true");
    expect(specBtn).toHaveAttribute("data-selected", "true");
    expect(specBtn.getAttribute("aria-label")).toContain("2100 × 900 mm");
    expect(specBtn.className).toContain("focus-visible:ring-2");

    // 4. Assessment status region has role='status', aria-live='polite', and accessible label
    const statusBadge = screen.getByTestId("decision-status-badge");
    expect(statusBadge).toHaveAttribute("role", "status");
    expect(statusBadge).toHaveAttribute("aria-live", "polite");
    expect(statusBadge.getAttribute("aria-label")).toBeTruthy();

    // 5. Non-drag placement adjustments via keyboard arrows (100mm & Shift 500mm), R to rotate 90°, Delete to remove
    expect(screen.getByText("X: 800 mm, Y: 1200 mm")).toBeInTheDocument();

    fireEvent.keyDown(window, { key: "ArrowRight" });
    expect(screen.getByText("X: 900 mm, Y: 1200 mm")).toBeInTheDocument();

    fireEvent.keyDown(window, { key: "ArrowDown", shiftKey: true });
    expect(screen.getByText("X: 900 mm, Y: 1700 mm")).toBeInTheDocument();

    fireEvent.keyDown(window, { key: "r" });
    expect(screen.getByText("90°")).toBeInTheDocument();

    fireEvent.keyDown(window, { key: "Delete" });
    expect(screen.queryByTestId("floor-plan-furniture-f1")).not.toBeInTheDocument();
  });
});
