import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { buildStandardPlanSummary } from "@/lib/floor-plan/catalog";
import { getDefaultFurnitureCatalog } from "@/lib/floor-plan/furniture-catalog";
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

  it("keeps the canvas unobstructed on selection and opens properties on request", () => {
    render(<FloorPlanShell initialPlans={FIXTURE_PLANS} isMobile={true} />);

    // Switch to Edit Mode
    const editModeBtn = screen.getByTestId("mode-toggle-edit");
    fireEvent.click(editModeBtn);

    // Click on wall w1
    const wall1 = screen.getByTestId("floor-plan-wall-w1");
    fireEvent.click(wall1);

    // Selection updates the summary without interrupting a drag with a modal.
    expect(screen.queryByTestId("mobile-bottom-sheet")).not.toBeInTheDocument();
    fireEvent.click(within(screen.getByTestId("mobile-selection-card")).getByRole("button", { name: "View details" }));
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

  it("offers only preset sizes in the sheet and keeps rotation and removal outside", () => {
    render(<FloorPlanShell initialPlans={FIXTURE_PLANS} isMobile={true} />);

    // Ensure Edit Mode
    const editModeBtn = screen.getByTestId("mode-toggle-edit");
    fireEvent.click(editModeBtn);

    // Select Sofa f1
    const sofa = screen.getByTestId("floor-plan-furniture-f1");
    fireEvent.click(sofa);

    expect(screen.queryByTestId("mobile-bottom-sheet")).not.toBeInTheDocument();
    fireEvent.click(screen.getByTestId("mobile-open-properties-btn"));

    // The mobile panel contains only size choices.
    const sheet = screen.getByTestId("mobile-bottom-sheet");
    expect(sheet).toBeInTheDocument();
    expect(within(sheet).getByTestId("furniture-size-picker")).toBeInTheDocument();
    expect(within(sheet).queryByText("FURNITURE")).not.toBeInTheDocument();
    expect(within(sheet).queryByTestId("rotate-furniture-btn")).not.toBeInTheDocument();
    expect(within(sheet).queryByTestId("delete-furniture-btn")).not.toBeInTheDocument();
    expect(within(sheet).queryByTestId("nudge-furniture-right")).not.toBeInTheDocument();
    const originalPosition = sofa.getAttribute("transform");
    const specification = getDefaultFurnitureCatalog().definitions.find((item) => item.id === "sofa-3seat")!.specifications.at(-1)!;
    fireEvent.click(within(sheet).getByTestId(`inspector-spec-option-${specification.id}`));
    expect(sofa).toHaveAttribute("data-width", String(specification.width));
    expect(sofa).toHaveAttribute("transform", originalPosition);

    // AC-4: No arbitrary width or depth inputs
    expect(within(sheet).queryByTestId("furniture-width-input")).not.toBeInTheDocument();
    expect(within(sheet).queryByTestId("furniture-depth-input")).not.toBeInTheDocument();
    fireEvent.click(screen.getByTestId("mobile-bottom-sheet-close"));
    expect(screen.getByTestId("mobile-open-properties-btn")).toHaveTextContent("Choose size");
    fireEvent.click(screen.getByRole("button", { name: "Rotate furniture 90°" }));
    expect(sofa.getAttribute("transform")).toContain("rotate(90)");
    fireEvent.click(screen.getByRole("button", { name: "Remove furniture" }));
    expect(screen.queryByTestId("floor-plan-furniture-f1")).not.toBeInTheDocument();
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

    const catalogBtn = screen.getByTestId("open-plan-selector-btn");
    expect(catalogBtn.className).toMatch(/min-h-\[44px\]|h-11|min-h-11/);

    const rulesBtn = screen.getByTestId("mobile-rules-btn");
    expect(rulesBtn.className).toMatch(/min-h-\[44px\]|h-11|min-h-11/);
  });

  it("does not change furniture positions while a modal panel handles keyboard input", () => {
    render(<FloorPlanShell isMobile initialPlans={FIXTURE_PLANS} />);
    const sofa = screen.getByTestId("floor-plan-furniture-f1");
    fireEvent.click(sofa);
    const position = sofa.getAttribute("transform");
    fireEvent.click(screen.getByTestId("mobile-rooms-btn"));
    fireEvent.keyDown(window, { key: "ArrowRight" });
    expect(sofa).toHaveAttribute("transform", position);
    fireEvent.click(screen.getByTestId("mobile-bottom-sheet-close"));
    fireEvent.keyDown(window, { key: "ArrowRight" });
    expect(sofa.getAttribute("transform")).not.toBe(position);
  });

  it("completes mobile room, placement, adjustment and assessment flows through on-demand panels", () => {
    render(<FloorPlanShell isMobile={true} initialPlans={FIXTURE_PLANS} locale="zh" />);
    expect(screen.queryByTestId("desktop-context-pane")).not.toBeInTheDocument();
    expect(screen.getByTestId("floor-plan-svg-canvas")).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("open-plan-selector-btn"));
    fireEvent.click(screen.getByTestId("open-plan-btn-floor-plan-std-studio-01"));
    expect(screen.queryByTestId("mobile-bottom-sheet")).not.toBeInTheDocument();

    fireEvent.click(screen.getByTestId("mobile-rooms-btn"));
    fireEvent.click(screen.getByTestId("room-item-sr1"));
    expect(screen.queryByTestId("mobile-bottom-sheet")).not.toBeInTheDocument();
    expect(screen.getByTestId("mobile-selection-name")).toHaveTextContent("Studio Suite");

    const count = screen.getAllByTestId(/^floor-plan-furniture-/).length;
    fireEvent.click(screen.getByTestId("mobile-add-furniture-btn"));
    fireEvent.click(screen.getAllByTestId(/^add-furniture-item-/)[0]);
    expect(screen.getAllByTestId(/^floor-plan-furniture-/)).toHaveLength(count + 1);
    expect(screen.queryByTestId("mobile-bottom-sheet")).not.toBeInTheDocument();

    fireEvent.click(screen.getByTestId("mobile-open-properties-btn"));
    const sheet = screen.getByTestId("mobile-bottom-sheet");
    const specs = within(sheet).getAllByTestId(/^inspector-spec-option-/);
    fireEvent.click(specs[specs.length - 1]);
    expect(within(sheet).getByTestId("furniture-size-picker")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("mobile-bottom-sheet-close"));
    fireEvent.click(screen.getByRole("button", { name: "旋转家具 90 度" }));

    fireEvent.click(screen.getByTestId("mobile-rules-btn"));
    expect(within(screen.getByTestId("mobile-bottom-sheet")).getByTestId("furniture-decision-panel")).toBeInTheDocument();
    expect(within(screen.getByTestId("mobile-bottom-sheet")).getByTestId("rule-feedback-panel")).toBeInTheDocument();
    // Checks must remain the requested panel even though a furniture item is selected.
    expect(screen.queryByTestId("inspector-furniture-details")).not.toBeInTheDocument();
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
