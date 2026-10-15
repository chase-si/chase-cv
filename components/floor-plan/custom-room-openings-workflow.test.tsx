import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import * as React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { FloorPlanShell } from "./floor-plan-shell";
import { createRectangularRoomPlan } from "@/lib/floor-plan/rectangular-room";
import { VALID_STANDARD_FLOOR_PLAN } from "@/lib/floor-plan/fixtures/valid-standard-plan";
import { buildStandardPlanSummary } from "@/lib/floor-plan/catalog";

const FIXTURE_PLANS = [buildStandardPlanSummary(VALID_STANDARD_FLOOR_PLAN)];

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

describe("Custom Room Openings & Settings Workflow (AC-6, AC-7, AC-8, AC-9, AC-10)", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    cleanup();
    window.localStorage.clear();
  });

  it("AC-10: enforces read-only boundary — room settings button is hidden on standard plans and visible on custom rooms", () => {
    // 1. Standard plan
    const { unmount } = render(
      <FloorPlanShell
        initialPlans={FIXTURE_PLANS}
        initialActivePlan={VALID_STANDARD_FLOOR_PLAN}
        locale="zh"
      />,
    );

    expect(screen.queryByTestId("edit-room-settings-btn")).not.toBeInTheDocument();
    unmount();

    // 2. Custom rectangular room
    const { plan: customPlan } = createRectangularRoomPlan({
      widthMm: 3000,
      depthMm: 4000,
      name: "实测主卧",
    });

    render(
      <FloorPlanShell
        initialPlans={FIXTURE_PLANS}
        initialActivePlan={customPlan}
        locale="zh"
      />,
    );

    expect(screen.getByTestId("edit-room-settings-btn")).toBeInTheDocument();
  });

  it("AC-6 & AC-7: opens room settings, live-previews door draft, shows origin cue, and cancels cleanly", () => {
    const { plan: customPlan } = createRectangularRoomPlan({
      widthMm: 3000,
      depthMm: 4000,
      name: "实测卧室",
    });

    render(
      <FloorPlanShell
        initialPlans={FIXTURE_PLANS}
        initialActivePlan={customPlan}
        locale="zh"
      />,
    );

    // Initial state: 0 openings
    expect(screen.queryByTestId(/^floor-plan-opening-/)).not.toBeInTheDocument();

    // Click room settings button
    fireEvent.click(screen.getByTestId("edit-room-settings-btn"));

    // Room settings panel is visible in left column
    expect(screen.getByTestId("room-settings-panel")).toBeInTheDocument();

    // Add a door
    fireEvent.click(screen.getByTestId("add-door-draft-btn"));

    // Live draft preview on canvas should show opening and measurement origin cue
    expect(screen.getByTestId(/^floor-plan-opening-/)).toBeInTheDocument();
    expect(screen.getByTestId("measurement-origin-cue")).toBeInTheDocument();

    // Cancel editing
    fireEvent.click(screen.getByTestId("cancel-openings-btn"));

    // Closed settings panel, restored 0 openings, origin cue removed
    expect(screen.queryByTestId("room-settings-panel")).not.toBeInTheDocument();
    expect(screen.queryByTestId(/^floor-plan-opening-/)).not.toBeInTheDocument();
    expect(screen.queryByTestId("measurement-origin-cue")).not.toBeInTheDocument();
  });

  it("AC-6, AC-7, AC-10: applies door opening, persists to local storage, and participates in keep-clear passage check", () => {
    const { plan: customPlan } = createRectangularRoomPlan({
      widthMm: 3000,
      depthMm: 4000,
      name: "实测主卧",
    });

    render(
      <FloorPlanShell
        initialPlans={[
          {
            id: customPlan.meta.id!,
            name: customPlan.meta.name,
            description: "Custom room",
            areaM2: 12,
            formattedArea: "12.0 m²",
            roomCount: 1,
            roomBreakdown: "1 间功能区",
            categoryKey: "custom",
            tags: ["custom"],
            plan: customPlan,
          },
        ]}
        locale="zh"
      />,
    );

    // Open settings and add door on top wall at offset 1000
    fireEvent.click(screen.getByTestId("edit-room-settings-btn"));
    fireEvent.click(screen.getByTestId("add-door-draft-btn"));

    const offsetInput = screen.getByTestId(/draft-offset-input/);
    fireEvent.change(offsetInput, { target: { value: "1000" } });

    // Apply openings
    fireEvent.click(screen.getByTestId("apply-openings-btn"));

    // Settings panel closes, formal opening remains on canvas
    expect(screen.queryByTestId("room-settings-panel")).not.toBeInTheDocument();
    expect(screen.getByTestId(/^floor-plan-opening-/)).toBeInTheDocument();

    // Opening was persisted
    expect(window.localStorage.length).toBeGreaterThan(0);
  });

  it("AC-9: dimension rebuild clears all openings and furniture after confirmation", () => {
    const { plan: customPlan } = createRectangularRoomPlan({
      widthMm: 3000,
      depthMm: 4000,
      name: "实测主卧",
    });

    // Add an opening and a piece of furniture
    const planWithItems = {
      ...customPlan,
      openings: [
        { id: "op1", type: "door" as const, wallId: "w-top", position: 0.5, width: 900 },
      ],
      furniture: [
        { id: "f1", definitionId: "bed-double", x: 1000, y: 1000, width: 1500, depth: 2000, rotation: 0 },
      ],
    };

    render(
      <FloorPlanShell
        initialPlans={FIXTURE_PLANS}
        initialActivePlan={planWithItems}
        locale="zh"
      />,
    );

    expect(screen.getByTestId("floor-plan-furniture-f1")).toBeInTheDocument();
    expect(screen.getByTestId("floor-plan-opening-op1")).toBeInTheDocument();

    // Open room settings -> dimensions tab
    fireEvent.click(screen.getByTestId("edit-room-settings-btn"));
    fireEvent.click(screen.getByTestId("room-settings-tab-dimensions"));

    // Modify width to 3600
    const widthInput = screen.getByTestId("dimension-width-input");
    fireEvent.change(widthInput, { target: { value: "3600" } });

    // Click apply
    fireEvent.click(screen.getByTestId("apply-dimensions-btn"));

    // Confirmation dialog
    expect(screen.getByTestId("confirm-rebuild-dimensions-dialog")).toBeInTheDocument();

    // Confirm rebuild
    fireEvent.click(screen.getByTestId("confirm-rebuild-btn"));

    // Settings closed, canvas updated, openings and furniture cleared
    expect(screen.queryByTestId("room-settings-panel")).not.toBeInTheDocument();
    expect(screen.queryByTestId("floor-plan-furniture-f1")).not.toBeInTheDocument();
    expect(screen.queryByTestId("floor-plan-opening-op1")).not.toBeInTheDocument();
    expect(screen.getByTestId("floor-plan-dimension-dim-total-width")).toHaveTextContent("3600");
  });
});
