import { cleanup, fireEvent, render, screen } from "@testing-library/react";
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
    expect(screen.getByText("空间规范审查")).toBeInTheDocument();
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

    // Draft mode actions
    expect(screen.getByTestId("export-json-btn")).toHaveTextContent("导出 JSON");

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
});
