import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { getStandardPlans } from "@/lib/floor-plan/catalog";
import type { FloorPlan, PlacementScenario } from "@/lib/floor-plan/types";
import { FloorPlanShell } from "./floor-plan-shell";

class MockResizeObserver {
  observe(el: Element) {
    this.callback([
      {
        contentRect: { width: 1280, height: 800 },
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

describe("End-to-End Furniture Specification Decision Journey (Issue #226 / PRD #215 AC-26)", () => {
  it("AC-26: completes the full purchase-decision journey (select standard plan -> add multiple furniture -> switch target specification -> move or rotate -> verify status, reasons, and mm measurement updates) while keeping standard plan topology immutable (AC-2, AC-27)", () => {
    const catalogSummaries = getStandardPlans("zh");
    const ruidongSummary = catalogSummaries.find(
      (p) => p.id === "plan-cn-sh-ruidong-2br-67",
    )!;
    expect(ruidongSummary).toBeDefined();

    // Snapshot original standard plan topology to prove AC-2 immutability throughout the journey
    const originalTopologySnapshot = JSON.stringify({
      vertices: ruidongSummary.plan.vertices,
      walls: ruidongSummary.plan.walls,
      openings: ruidongSummary.plan.openings,
      rooms: ruidongSummary.plan.rooms,
    });

    const onScenarioChange = vi.fn();
    const onPlanChange = vi.fn();

    render(
      <FloorPlanShell
        initialPlans={catalogSummaries}
        onScenarioChange={onScenarioChange}
        onPlanChange={onPlanChange}
        locale="zh"
      />,
    );

    // 0. AC-27: Verify legacy capabilities remain absent from the core journey
    expect(screen.queryByTestId("floor-plan-stage-stepper")).not.toBeInTheDocument();
    expect(screen.queryByTestId("undo-btn")).not.toBeInTheDocument();
    expect(screen.queryByTestId("redo-btn")).not.toBeInTheDocument();
    expect(screen.queryByTestId("customize-plan-btn")).not.toBeInTheDocument();
    expect(screen.queryByTestId("furniture-width-input")).not.toBeInTheDocument();
    expect(screen.queryByTestId("furniture-depth-input")).not.toBeInTheDocument();

    // 1. Step 1 (选择标准户型): Open standard plan catalog dialog, switch plan, and verify canvas & summary sync (AC-1)
    fireEvent.click(screen.getByTestId("open-plan-selector-btn"));
    expect(screen.getByTestId("floor-plan-catalog")).toBeInTheDocument();

    // Select Shenzhen 70B plan first
    fireEvent.click(screen.getByTestId("open-plan-btn-plan-cn-sz-shanyuewan-70b-70"));
    expect(screen.queryByTestId("floor-plan-catalog")).not.toBeInTheDocument();
    expect(screen.getByTestId("active-plan-name")).toHaveTextContent("深圳山樾湾");

    // Reopen catalog and select Shanghai Ruidong 2BR (plan-cn-sh-ruidong-2br-67)
    fireEvent.click(screen.getByTestId("open-plan-selector-btn"));
    fireEvent.click(screen.getByTestId("open-plan-btn-plan-cn-sh-ruidong-2br-67"));
    expect(screen.getByTestId("active-plan-name")).toHaveTextContent("上海瑞冬小区两居室");
    expect(screen.getByTestId("floor-plan-room-r2")).toBeInTheDocument();
    expect(screen.getByTestId("floor-plan-room-r5")).toBeInTheDocument();

    // 2. Step 2 (添加多件家具): Add furniture in two rooms and verify both remain placed while one is active target (AC-3)
    // Select Secondary Bedroom (r2 次卧) and add a Single Bed (bed-single, 1200 × 2000 mm)
    fireEvent.click(screen.getByTestId("room-item-r2"));
    expect(
      within(screen.getByTestId("target-room-details")).getByTestId("target-room-name"),
    ).toHaveTextContent("次卧");
    fireEvent.click(screen.getByTestId("add-context-furniture-bed-single"));

    // Select Master Bedroom (r5 主卧) and add a Double Bed (bed-double, 1800 × 2000 mm)
    fireEvent.click(screen.getByTestId("room-item-r5"));
    expect(
      within(screen.getByTestId("target-room-details")).getByTestId("target-room-name"),
    ).toHaveTextContent("主卧");
    fireEvent.click(screen.getByTestId("add-context-furniture-bed-double"));

    // Verify 2 placements exist in PlacementScenario and on the SVG canvas
    const scenarioAfterAdds: PlacementScenario =
      onScenarioChange.mock.calls[onScenarioChange.mock.calls.length - 1][0];
    expect(scenarioAfterAdds.placements).toHaveLength(2);
    const singleBedPlacement = scenarioAfterAdds.placements.find(
      (p) => p.definitionId === "bed-single",
    )!;
    const doubleBedPlacement = scenarioAfterAdds.placements.find(
      (p) => p.definitionId === "bed-double",
    )!;
    expect(singleBedPlacement).toBeDefined();
    expect(doubleBedPlacement).toBeDefined();
    expect(scenarioAfterAdds.targetPlacementId).toBe(doubleBedPlacement.id);

    expect(
      screen.getByTestId(`floor-plan-furniture-${singleBedPlacement.id}`),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId(`floor-plan-furniture-${doubleBedPlacement.id}`),
    ).toBeInTheDocument();

    // Verify switching active target between placed items updates the decision panel while keeping both items on canvas
    fireEvent.click(screen.getByTestId(`select-target-furniture-${singleBedPlacement.id}`));
    expect(screen.getByTestId("decision-title")).toHaveTextContent("单人床");
    fireEvent.click(screen.getByTestId(`select-target-furniture-${doubleBedPlacement.id}`));
    expect(screen.getByTestId("decision-title")).toHaveTextContent("双人床");

    // 3. Step 3 (选择并切换目标家具规格):
    // In r5 (主卧, inner width 3141 mm), Double Bed 1800 × 2000 mm at centroid (3182, 8602) has:
    // Left clearance 671 mm & Right clearance 670 mm (between minimum 600 mm and recommended 750 mm) -> "需要权衡" (trade-off)
    const panel = screen.getByTestId("furniture-decision-panel");
    expect(within(panel).getByTestId("decision-status-badge")).toHaveTextContent("需要权衡");
    expect(within(panel).getByTestId("decision-dimensions")).toHaveTextContent("1800 × 2000 mm");
    expect(
      within(panel).getAllByTestId("decision-measured-below-recommended-clearance")[0],
    ).toHaveTextContent(/67[01] mm/);

    // Switch specification from bed-double-1800 (1800 × 2000 mm) to bed-double-1500 (1500 × 2000 mm)
    fireEvent.click(screen.getByTestId("switch-specification-bed-double-1500"));

    // Verify center (3182, 8602) and rotation (0°) remain strictly fixed while dimensions and assessment immediately update (AC-5)
    const scenarioAfterSpecSwitch: PlacementScenario =
      onScenarioChange.mock.calls[onScenarioChange.mock.calls.length - 1][0];
    const updatedDoubleBed = scenarioAfterSpecSwitch.placements.find(
      (p) => p.id === doubleBedPlacement.id,
    )!;
    expect(updatedDoubleBed.specificationId).toBe("bed-double-1500");
    expect(updatedDoubleBed.x).toBe(3182);
    expect(updatedDoubleBed.y).toBe(8602);
    expect(updatedDoubleBed.rotation).toBe(0);

    expect(within(panel).getByTestId("decision-dimensions")).toHaveTextContent("1500 × 2000 mm");
    expect(screen.getByTestId("inspector-furniture-dimensions")).toHaveTextContent("1500 × 2000 mm");
    expect(within(panel).getByTestId("decision-status-badge")).toHaveTextContent("适合");
    expect(within(panel).getByTestId("decision-clean-notice")).toBeInTheDocument();

    // 4. Step 4 (移动或旋转 → 查看状态、原因和测量值更新):
    // 4a. Nudge right by 100 mm (x: 3182 -> 3282) -> right clearance becomes 720 mm (600 <= 720 < 750) -> status becomes "需要权衡" (trade-off)
    fireEvent.click(screen.getByTestId("nudge-furniture-right"));
    expect(within(panel).getByTestId("decision-status-badge")).toHaveTextContent("需要权衡");
    expect(
      within(panel).getByTestId("decision-measured-below-recommended-clearance"),
    ).toHaveTextContent("720 mm");
    expect(
      within(panel).getByTestId("decision-recommended-below-recommended-clearance"),
    ).toHaveTextContent("最低 600 mm / 推荐 750 mm");
    expect(
      within(panel).getByTestId("finding-minimum-below-recommended-clearance"),
    ).toHaveTextContent("600 mm");

    // 4b. Nudge right twice more (+200 mm, x: 3282 -> 3482) -> right clearance becomes 520 mm (< 600 mm minimum) -> status becomes "必须调整" (must-adjust)
    fireEvent.click(screen.getByTestId("nudge-furniture-right"));
    fireEvent.click(screen.getByTestId("nudge-furniture-right"));
    expect(within(panel).getByTestId("decision-status-badge")).toHaveTextContent("必须调整");
    expect(
      within(panel).getByTestId("decision-measured-below-minimum-clearance"),
    ).toHaveTextContent("520 mm");
    expect(
      within(panel).getByTestId("decision-recommended-below-minimum-clearance"),
    ).toHaveTextContent("最低 600 mm / 推荐 750 mm");
    expect(
      within(panel).getByTestId("finding-minimum-below-minimum-clearance"),
    ).toHaveTextContent("600 mm");

    // 4c. Rotate 90° -> headboard (back: 0/0 mm) now faces East wall while foot (front: min 600 / rec 900 mm)
    // faces West wall with 871 mm clearance -> status improves from "必须调整" to "需要权衡" (proving AC-8 & AC-26)
    fireEvent.click(screen.getByTestId("rotate-furniture-btn"));
    expect(screen.getByTestId("inspector-furniture-details")).toHaveTextContent("90°");
    expect(within(panel).getByTestId("decision-status-badge")).toHaveTextContent("需要权衡");
    expect(
      within(panel).getByTestId("decision-measured-below-recommended-clearance"),
    ).toHaveTextContent("871 mm");
    expect(
      within(panel).getByTestId("decision-recommended-below-recommended-clearance"),
    ).toHaveTextContent("最低 600 mm / 推荐 900 mm");

    // 5. AC-2: Verify standard floor plan topology remained 100% unmutated
    const latestPlan: FloorPlan = onPlanChange.mock.calls[onPlanChange.mock.calls.length - 1][0];
    expect(
      JSON.stringify({
        vertices: latestPlan.vertices,
        walls: latestPlan.walls,
        openings: latestPlan.openings,
        rooms: latestPlan.rooms,
      }),
    ).toBe(originalTopologySnapshot);
  });
});
