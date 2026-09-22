import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { FloorPlanShell } from "./floor-plan-shell";
import { VALID_STANDARD_FLOOR_PLAN } from "@/lib/floor-plan/fixtures/valid-standard-plan";
import { buildStandardPlanSummary } from "@/lib/floor-plan/catalog";

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

describe("FloorPlanShell Chinese Localization (locale='zh')", () => {
  it("renders Chinese headings, actions, catalog, and context panel", () => {
    render(<FloorPlanShell locale="zh" isMobile={false} />);

    // Heading and description
    expect(
      screen.getByRole("heading", { level: 1, name: "我家适合买多大的床或沙发？" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("选择预设户型，添加通用家具规格，实时评估实体冲突与方向净距。"),
    ).toBeInTheDocument();

    // Chrome action buttons
    expect(screen.getByTestId("open-plan-selector-btn")).toHaveTextContent("切换户型");
    expect(screen.getByTestId("open-furniture-catalog-btn")).toHaveTextContent("+ 放置家具");
    expect(screen.getByTestId("mode-toggle-pan")).toHaveTextContent("平移");
    expect(screen.getByTestId("mode-toggle-edit")).toHaveTextContent("编辑");

    // Catalog dialog (opened on demand via selector button)
    fireEvent.click(screen.getByTestId("open-plan-selector-btn"));
    expect(screen.getByText("标准户型库")).toBeInTheDocument();
    expect(screen.getByTestId("catalog-category-filters")).toBeInTheDocument();
    expect(screen.getByTestId("catalog-filter-all")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("plan-selector-close-btn"));

    // Context task panel
    expect(screen.getByTestId("desktop-context-pane")).toBeInTheDocument();
    expect(screen.getByText("当前户型")).toBeInTheDocument();
    expect(screen.getByText("选择重点评估房间")).toBeInTheDocument();
    expect(screen.getByText("添加家具")).toBeInTheDocument();
  });

  it("displays Chinese labels when inspecting room entity", () => {
    render(<FloorPlanShell locale="zh" isMobile={false} />);

    // Click on room r1
    const room = screen.getByTestId("floor-plan-room-r1");
    fireEvent.click(room);

    // Inspector should display Chinese room parameters and title
    expect(screen.getByText("空间名称")).toBeInTheDocument();
    expect(screen.getByText("实测建筑面积")).toBeInTheDocument();
  });

  it("displays Chinese furniture inspector controls without arbitrary resize inputs (AC-4)", () => {
    render(
      <FloorPlanShell
        locale="zh"
        isMobile={false}
        initialPlans={[buildStandardPlanSummary(VALID_STANDARD_FLOOR_PLAN, "zh")]}
      />,
    );

    // Select the first furniture piece on the active localized plan
    const sofa = screen.getByTestId("floor-plan-furniture-f1");
    fireEvent.click(sofa);

    // Inspector should be displayed with Chinese labels
    expect(screen.getByTestId("inspector-furniture-details")).toBeInTheDocument();
    expect(screen.getByText("家具名称")).toBeInTheDocument();
    expect(screen.getByText("平面尺寸 (宽 × 深 × 高)")).toBeInTheDocument();
    expect(screen.getByText("旋转角度")).toBeInTheDocument();
    expect(screen.getByTestId("rotate-furniture-btn")).toHaveTextContent("旋转 90°");
    expect(screen.getByTestId("delete-furniture-btn")).toHaveTextContent("删除");

    // AC-4: No arbitrary width or depth inputs
    expect(screen.queryByTestId("furniture-width-input")).not.toBeInTheDocument();
    expect(screen.queryByTestId("furniture-depth-input")).not.toBeInTheDocument();
  });

  it("executes decision flow with complete Chinese copy and spatial feedback", async () => {
    render(<FloorPlanShell locale="zh" isMobile={false} />);

    // 1. Focus room selection
    const roomBtn = screen.getByTestId("room-item-r1");
    fireEvent.click(roomBtn);

    // 2. Add furniture from context recommendations
    const addBtns = screen.getAllByTestId(/^add-context-furniture-/);
    expect(addBtns.length).toBeGreaterThan(0);
    fireEvent.click(addBtns[0]);

    // 3. Decision section is present
    await waitFor(() => {
      expect(screen.getByTestId("decision-target-furniture")).toBeInTheDocument();
    });

    expect(screen.getByTestId("furniture-decision-panel")).toBeInTheDocument();
    expect(screen.getByText("目标家具决策结论")).toBeInTheDocument();
    expect(screen.getByTestId("decision-status-badge")).toBeInTheDocument();
    expect(screen.getByTestId("decision-disclaimer")).toHaveTextContent(
      "本结论基于当前空间规则计算，不构成施工、结构安全保证或绝对使用承诺。",
    );

    // Verify position nudge controls in Chinese inspector
    expect(screen.getByTestId("nudge-furniture-left")).toHaveAttribute("aria-label", "向左微调");
  });
});
