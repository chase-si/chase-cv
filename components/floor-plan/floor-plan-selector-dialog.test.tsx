import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { getFloorPlanI18n } from "@/lib/floor-plan/i18n";
import { getStandardPlans } from "@/lib/floor-plan/catalog";
import { FloorPlanSelectorDialog } from "./floor-plan-selector-dialog";

// Mock ResizeObserver for jsdom
class MockResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

vi.stubGlobal("ResizeObserver", MockResizeObserver);

afterEach(() => {
  cleanup();
});

describe("FloorPlanSelectorDialog (AC-2)", () => {
  const plans = getStandardPlans("en");
  const i18n = getFloorPlanI18n("en");
  const activePlanId = plans[0]!.id;
  const alternatePlan = plans.find((p) => p.id !== activePlanId) ?? plans[1]!;

  it("does not render popup when open is false", () => {
    render(
      <FloorPlanSelectorDialog
        open={false}
        onOpenChange={vi.fn()}
        plans={plans}
        activePlanId={activePlanId}
        onSelectPlan={vi.fn()}
        t={i18n.t}
      />,
    );

    expect(screen.queryByTestId("floor-plan-selector-dialog")).not.toBeInTheDocument();
  });

  it("renders on-demand dialog and allows selecting a standard plan", () => {
    const handleOpenChange = vi.fn();
    const handleSelectPlan = vi.fn();

    render(
      <FloorPlanSelectorDialog
        open={true}
        onOpenChange={handleOpenChange}
        plans={plans}
        activePlanId={activePlanId}
        onSelectPlan={handleSelectPlan}
        t={i18n.t}
      />,
    );

    const dialog = screen.getByTestId("floor-plan-selector-dialog");
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveAttribute("role", "dialog");
    expect(dialog).toHaveAttribute("aria-modal", "true");

    // Reuses FloorPlanCatalog inside
    expect(screen.getByTestId("floor-plan-catalog")).toBeInTheDocument();

    // Select an alternate plan
    const openBtn = screen.getByTestId(`open-plan-btn-${alternatePlan.id}`);
    fireEvent.click(openBtn);

    expect(handleSelectPlan).toHaveBeenCalledWith(alternatePlan.id);
    expect(handleOpenChange).toHaveBeenCalledWith(false);
  });

  it("closes when clicking close button or pressing Escape", () => {
    const handleOpenChange = vi.fn();

    render(
      <FloorPlanSelectorDialog
        open={true}
        onOpenChange={handleOpenChange}
        plans={plans}
        activePlanId={activePlanId}
        onSelectPlan={vi.fn()}
        t={i18n.t}
      />,
    );

    const closeBtn = screen.getByTestId("plan-selector-close-btn");
    fireEvent.click(closeBtn);
    expect(handleOpenChange).toHaveBeenCalledWith(false);

    // Press Escape
    fireEvent.keyDown(window, { key: "Escape" });
    expect(handleOpenChange).toHaveBeenCalledWith(false);
  });
});
