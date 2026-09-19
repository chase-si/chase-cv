import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { FloorPlanShell } from "./floor-plan-shell";

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
  it("renders Chinese headings, actions, catalog, and inspector overview", () => {
    render(<FloorPlanShell locale="zh" isMobile={false} />);

    // Heading and description
    expect(
      screen.getByRole("heading", { level: 1, name: "标准户型空间验证器" }),
    ).toBeInTheDocument();

    // Chrome action buttons
    expect(screen.getByTestId("customize-plan-btn")).toHaveTextContent("自定义户型");
    expect(screen.getByTestId("mode-toggle-pan")).toHaveTextContent("平移");
    expect(screen.getByTestId("mode-toggle-edit")).toHaveTextContent("编辑");

    // Four-stage stepper
    expect(screen.getByTestId("floor-plan-stage-stepper")).toBeInTheDocument();
    expect(screen.getByText("户型")).toBeInTheDocument();

    // Catalog dialog (opened on demand via selector button)
    fireEvent.click(screen.getByTestId("open-plan-selector-btn"));
    expect(screen.getByText("标准户型库")).toBeInTheDocument();
    expect(screen.getByTestId("catalog-category-filters")).toBeInTheDocument();
    expect(screen.getByText(/全部/)).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("plan-selector-close-btn"));

    // Context task panel / Inspector overview
    expect(screen.getByTestId("desktop-context-pane")).toBeInTheDocument();
    expect(screen.getByText("户型全局概览")).toBeInTheDocument();
    expect(screen.getByText("套内总面积")).toBeInTheDocument();
    expect(screen.getByText("功能分区数")).toBeInTheDocument();
    expect(screen.getByText("家具配置数")).toBeInTheDocument();

    // AC-26: Spatial rules are shelved into Advanced Tools
    fireEvent.click(screen.getByTestId("open-advanced-tools-btn"));
    expect(screen.getByText("空间规范审查")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("advanced-tools-close-btn"));
  });

  it("displays Chinese labels when inspecting room entity", () => {
    render(<FloorPlanShell locale="zh" isMobile={false} />);

    // Click on room r1
    const room = screen.getByTestId("floor-plan-room-r1");
    fireEvent.click(room);

    // Inspector should display Chinese room parameters and title
    expect(screen.getByText("空间属性检查器")).toBeInTheDocument();
    expect(screen.getByText("空间名称")).toBeInTheDocument();
    expect(screen.getByText("实测建筑面积")).toBeInTheDocument();
    expect(screen.getByText("房间开间进深跨度")).toBeInTheDocument();
  });

  it("displays Chinese furniture editor and span editor controls in draft mode", () => {
    render(<FloorPlanShell locale="zh" isMobile={false} />);

    // Enter draft customization mode
    const customizeBtn = screen.getByTestId("customize-plan-btn");
    fireEvent.click(customizeBtn);

    // Draft mode actions: accessible via Advanced Tools (AC-26)
    fireEvent.click(screen.getByTestId("advanced-tools-btn"));
    fireEvent.click(screen.getByTestId("advanced-tab-manage"));
    expect(screen.getByTestId("export-json-btn")).toHaveTextContent("导出 JSON");
    fireEvent.click(screen.getByTestId("advanced-tools-close-btn"));

    // 1. Select a room and verify RoomSpanEditor in Chinese
    const room = screen.getByTestId("floor-plan-room-r1");
    fireEvent.click(room);
    expect(screen.getByTestId("room-span-editor")).toBeInTheDocument();
    expect(screen.getByText("房间开间与进深微调")).toBeInTheDocument();
    expect(screen.getByText("开间宽度 (X)")).toBeInTheDocument();
    expect(screen.getByText("确认应用")).toBeInTheDocument();

    // 2. Select a furniture piece (e.g. f1 sofa)
    const sofa = screen.getByTestId("floor-plan-furniture-f1");
    fireEvent.click(sofa);

    // FurnitureEditor should be displayed with Chinese labels
    expect(screen.getByTestId("furniture-editor")).toBeInTheDocument();
    expect(screen.getByText("平面坐标 (X, Y)")).toBeInTheDocument();
    expect(screen.getByText("宽度")).toBeInTheDocument();
    expect(screen.getByText("进深")).toBeInTheDocument();
    expect(screen.getByTestId("preview-furniture-btn")).toHaveTextContent("预览调整");
    expect(screen.getByTestId("apply-furniture-btn")).toHaveTextContent("确认应用");
    expect(screen.getByTestId("rotate-furniture-btn")).toHaveTextContent("顺时针旋转 90°");
    expect(screen.getByTestId("delete-furniture-btn")).toHaveTextContent("删除");
  });

  it("AC-25: executes complete 4-stage decision flow with complete Chinese copy and no fallback leaks", async () => {
    render(<FloorPlanShell locale="zh" isMobile={false} />);

    // Stage 1: Plan
    expect(screen.getByTestId("stage-step-plan")).toHaveTextContent("户型");
    expect(screen.getByTestId("skip-calibration-btn")).toHaveTextContent("跳过校准，进入房间选择");
    fireEvent.click(screen.getByTestId("skip-calibration-btn"));

    // Stage 2: Room
    expect(screen.getByTestId("stage-step-room")).toHaveTextContent("房间");
    expect(screen.getByText("选择目标房间")).toBeInTheDocument();
    const roomBtn = screen.getByTestId("room-item-r1");
    fireEvent.click(roomBtn);
    expect(screen.getByTestId("next-to-furniture-btn")).toHaveTextContent("进入家具阶段");
    fireEvent.click(screen.getByTestId("next-to-furniture-btn"));

    // Stage 3: Furniture
    expect(screen.getByTestId("stage-step-furniture")).toHaveTextContent("家具");
    expect(screen.getByText("添加与配置家具")).toBeInTheDocument();
    expect(screen.getByTestId("context-furniture-panel")).toBeInTheDocument();
    const addBtns = screen.getAllByTestId(/^add-context-furniture-/);
    fireEvent.click(addBtns[0]);

    // Adding furniture transitions to Decision stage (or sets target furniture)
    await waitFor(() => {
      expect(screen.getByTestId("stage-step-decision")).toHaveAttribute("aria-current", "step");
    });
    expect(screen.getByTestId("decision-target-furniture")).toBeInTheDocument();
    expect(screen.getByText("主结论检测目标")).toBeInTheDocument();
    expect(screen.getByText("唯一目标")).toBeInTheDocument();

    // Stage 4: Decision
    expect(screen.getByTestId("stage-step-decision")).toHaveTextContent("结论");
    expect(screen.getByTestId("furniture-decision-panel")).toBeInTheDocument();
    expect(screen.getByText("目标家具决策结论")).toBeInTheDocument();
    expect(screen.getByTestId("decision-status-badge")).toBeInTheDocument();
    expect(screen.getByTestId("decision-disclaimer")).toHaveTextContent(
      "本结论基于当前空间规则计算，不构成施工、结构安全保证或绝对使用承诺。",
    );

    // Verify position nudge controls in Chinese
    fireEvent.click(screen.getByTestId("tune-target-furniture-btn"));
    expect(screen.getByTestId("nudge-furniture-left")).toHaveAttribute("aria-label", expect.stringMatching(/向左/));
  });
});
