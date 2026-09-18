import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { FloorPlanCatalog } from "./floor-plan-catalog";
import { getStandardPlans } from "@/lib/floor-plan/catalog";

afterEach(() => {
  cleanup();
});

describe("FloorPlanCatalog (AC-1)", () => {
  const plans = getStandardPlans();

  it("displays each approved standard plan with thumbnail, name, area, room counts, and tags", () => {
    const onSelectPlan = vi.fn();
    render(
      <FloorPlanCatalog
        plans={plans}
        activePlanId={plans[0].id}
        onSelectPlan={onSelectPlan}
      />,
    );

    for (const plan of plans) {
      // 1. Thumbnail
      expect(
        screen.getByTestId(`floor-plan-thumbnail-${plan.id}`),
      ).toBeInTheDocument();

      // 2. Name
      expect(screen.getByTestId(`plan-name-${plan.id}`)).toHaveTextContent(
        plan.name,
      );

      // 3. Area
      expect(screen.getByTestId(`plan-area-${plan.id}`)).toHaveTextContent(
        plan.formattedArea,
      );

      // 4. Room counts / breakdown
      expect(screen.getByTestId(`plan-rooms-${plan.id}`)).toHaveTextContent(
        plan.roomBreakdown,
      );

      // 5. Tags
      const tagsContainer = screen.getByTestId(`plan-tags-${plan.id}`);
      for (const tag of plan.tags) {
        expect(tagsContainer).toHaveTextContent(tag);
      }
    }
  });

  it("opens a selected plan when clicking card or open button", () => {
    const onSelectPlan = vi.fn();
    render(
      <FloorPlanCatalog
        plans={plans}
        activePlanId={plans[0].id}
        onSelectPlan={onSelectPlan}
      />,
    );

    const targetPlan = plans[1];
    const openBtn = screen.getByTestId(`open-plan-btn-${targetPlan.id}`);
    fireEvent.click(openBtn);

    expect(onSelectPlan).toHaveBeenCalledWith(targetPlan.id);
  });

  it("filters standard plans by room category filter tags", () => {
    const onSelectPlan = vi.fn();
    render(
      <FloorPlanCatalog
        plans={plans}
        activePlanId={plans[0].id}
        onSelectPlan={onSelectPlan}
      />,
    );

    // Filter by studio
    const studioFilterBtn = screen.getByTestId("catalog-filter-studio");
    expect(studioFilterBtn).toHaveTextContent("Studio (4)");
    fireEvent.click(studioFilterBtn);

    expect(screen.getByText("Modern Compact Studio")).toBeInTheDocument();
    expect(screen.queryByText("3BR Family Residence")).not.toBeInTheDocument();

    // Toggle off or click All to restore
    const allFilterBtn = screen.getByTestId("catalog-filter-all");
    expect(allFilterBtn).toHaveTextContent(`All (${plans.length})`);
    fireEvent.click(allFilterBtn);

    expect(screen.getByText("Modern Compact Studio")).toBeInTheDocument();
    expect(screen.getByText("3BR Family Residence")).toBeInTheDocument();
  });
});
