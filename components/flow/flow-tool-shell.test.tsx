import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { FlowToolShell } from "@/components/flow/flow-tool-shell";
import {
  FLOW_SVG_RUNTIME_DEMO_BRANCH_FILL,
  FLOW_SVG_RUNTIME_DEMO_FINISHED_FILL,
} from "@/components/flow/flow-svg-tokens";

vi.mock("sonner", () => ({
  toast: {
    info: vi.fn(),
    error: vi.fn(),
  },
}));

import { toast } from "sonner";

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("FlowToolShell", () => {
  it("shows page title and editor layout regions", () => {
    render(<FlowToolShell />);

    expect(
      screen.getByRole("heading", { level: 1, name: "流程编辑器" }),
    ).toBeInTheDocument();
    expect(screen.getByTestId("flow-editor-toolbar")).toBeInTheDocument();
    expect(screen.getByTestId("flow-editor-canvas")).toBeInTheDocument();
    expect(screen.getByTestId("flow-editor-properties")).toBeInTheDocument();
  });

  it("renders seeded demo flow in the canvas region", () => {
    render(<FlowToolShell />);

    const canvas = screen.getByTestId("flow-editor-canvas");
    const canvasQueries = within(canvas);
    expect(canvasQueries.getByTestId("flow-read-only-surface")).toBeInTheDocument();
    expect(canvasQueries.getByText("开始")).toBeInTheDocument();
  });

  it("shows properties empty state until a node is selected", () => {
    render(<FlowToolShell />);

    const properties = within(screen.getByTestId("flow-editor-properties"));
    expect(properties.getByTestId("flow-properties-empty")).toBeInTheDocument();
  });

  it("selects a step and edits description with immediate canvas update", () => {
    render(<FlowToolShell />);

    const canvas = screen.getByTestId("flow-editor-canvas");
    const stepNode = canvas.querySelector('[data-flow-node-id="step001"]');
    expect(stepNode).toBeTruthy();
    fireEvent.click(stepNode!);

    const properties = within(screen.getByTestId("flow-editor-properties"));
    expect(properties.queryByTestId("flow-properties-empty")).not.toBeInTheDocument();
    expect(properties.getByLabelText("描述")).toHaveValue("desc1");

    fireEvent.change(properties.getByLabelText("描述"), {
      target: { value: "live-edit" },
    });

    expect(properties.getByLabelText("描述")).toHaveValue("live-edit");
    expect(canvas.querySelector('[data-flow-node-id="step001"]')).toHaveAttribute(
      "data-flow-selected",
      "true",
    );
    expect(canvas).toHaveTextContent("live-edit");
  });

  it("clears selection back to empty properties state", () => {
    render(<FlowToolShell />);

    const stepNode = screen
      .getByTestId("flow-editor-canvas")
      .querySelector('[data-flow-node-id="transfer001"]');
    fireEvent.click(stepNode!);

    fireEvent.click(screen.getByRole("button", { name: "取消选择" }));

    expect(
      within(screen.getByTestId("flow-editor-properties")).getByTestId(
        "flow-properties-empty",
      ),
    ).toBeInTheDocument();
  });

  it("disables structure toolbar actions until a supported node is selected", () => {
    render(<FlowToolShell />);

    const toolbar = within(screen.getByTestId("flow-editor-toolbar"));
    expect(toolbar.getByRole("button", { name: "增加顺序步" })).toBeDisabled();
    expect(toolbar.getByRole("button", { name: "删除" })).toBeDisabled();
    expect(toolbar.getByTestId("flow-toolbar-zoom-label")).toHaveTextContent("100%");
  });

  it("selects a newly added sequential step after toolbar add", () => {
    render(<FlowToolShell />);

    const canvas = screen.getByTestId("flow-editor-canvas");
    fireEvent.click(canvas.querySelector('[data-flow-node-id="transfer001"]')!);

    const toolbar = within(screen.getByTestId("flow-editor-toolbar"));
    fireEvent.click(toolbar.getByRole("button", { name: "增加顺序步" }));

    const selected = canvas.querySelector('[data-flow-selected="true"]');
    expect(selected).toBeTruthy();
    expect(selected?.getAttribute("data-flow-node-id")).not.toBe("transfer001");
    expect(
      within(screen.getByTestId("flow-editor-properties")).queryByTestId(
        "flow-properties-empty",
      ),
    ).not.toBeInTheDocument();
  });

  it("clears selection after deleting a supported step", () => {
    render(<FlowToolShell />);

    const canvas = screen.getByTestId("flow-editor-canvas");
    fireEvent.click(canvas.querySelector('[data-flow-node-id="step002"]')!);

    const toolbar = within(screen.getByTestId("flow-editor-toolbar"));
    fireEvent.click(toolbar.getByRole("button", { name: "删除" }));

    expect(
      within(screen.getByTestId("flow-editor-properties")).getByTestId(
        "flow-properties-empty",
      ),
    ).toBeInTheDocument();
    expect(canvas.querySelector('[data-flow-selected="true"]')).toBeNull();
  });

  it("shows toast when zooming in at maximum", () => {
    render(<FlowToolShell />);
    const toolbar = within(screen.getByTestId("flow-editor-toolbar"));

    for (let i = 0; i < 12; i += 1) {
      fireEvent.click(toolbar.getByRole("button", { name: "放大" }));
    }

    expect(toolbar.getByTestId("flow-toolbar-zoom-label")).toHaveTextContent("200%");
    expect(toast.info).toHaveBeenCalledWith("已达到最大缩放 200%");
  });

  it("resets demo data and clears selection without confirmation", () => {
    const confirmSpy = vi.spyOn(window, "confirm").mockReturnValue(false);
    render(<FlowToolShell />);

    const canvas = screen.getByTestId("flow-editor-canvas");
    fireEvent.click(canvas.querySelector('[data-flow-node-id="step001"]')!);

    const properties = within(screen.getByTestId("flow-editor-properties"));
    fireEvent.change(properties.getByLabelText("描述"), {
      target: { value: "mutated-desc" },
    });
    expect(canvas).toHaveTextContent("mutated-desc");

    fireEvent.click(screen.getByRole("button", { name: /重置示例/ }));

    expect(confirmSpy).not.toHaveBeenCalled();
    expect(canvas).toHaveTextContent("desc1");
    expect(canvas).not.toHaveTextContent("mutated-desc");
    expect(
      within(screen.getByTestId("flow-editor-properties")).getByTestId(
        "flow-properties-empty",
      ),
    ).toBeInTheDocument();
    confirmSpy.mockRestore();
  });

  it("preserves running highlight toggle after reset", () => {
    render(<FlowToolShell />);

    fireEvent.click(screen.getByRole("switch", { name: "运行态高亮" }));
    expect(screen.getByRole("switch", { name: "运行态高亮" })).toHaveAttribute(
      "aria-checked",
      "true",
    );

    const canvas = screen.getByTestId("flow-editor-canvas");
    fireEvent.click(canvas.querySelector('[data-flow-node-id="step001"]')!);
    fireEvent.change(within(screen.getByTestId("flow-editor-properties")).getByLabelText("描述"), {
      target: { value: "temporary" },
    });

    fireEvent.click(screen.getByRole("button", { name: /重置示例/ }));

    expect(screen.getByRole("switch", { name: "运行态高亮" })).toHaveAttribute(
      "aria-checked",
      "true",
    );
  });

  it("applies fixed demo runtime highlight to top-level and nested nodes", () => {
    render(<FlowToolShell />);
    fireEvent.click(screen.getByRole("switch", { name: "运行态高亮" }));

    const canvas = screen.getByTestId("flow-editor-canvas");
    const topLevelFills = [
      ...canvas.querySelectorAll('[data-flow-node-id="step001"] rect[fill]'),
    ].map((el) => el.getAttribute("fill"));
    expect(topLevelFills).toContain(FLOW_SVG_RUNTIME_DEMO_FINISHED_FILL);

    const nestedFills = [
      ...canvas.querySelectorAll('[data-flow-node-id="step004"] rect[fill]'),
    ].map((el) => el.getAttribute("fill"));
    expect(nestedFills).toContain(FLOW_SVG_RUNTIME_DEMO_BRANCH_FILL);

    expect(
      canvas.querySelector('[data-flow-green-arrow="step003"]'),
    ).toBeInTheDocument();
  });

  it("allows property edits while runtime highlight is enabled", () => {
    render(<FlowToolShell />);
    fireEvent.click(screen.getByRole("switch", { name: "运行态高亮" }));

    const canvas = screen.getByTestId("flow-editor-canvas");
    fireEvent.click(canvas.querySelector('[data-flow-node-id="step001"]')!);

    fireEvent.change(within(screen.getByTestId("flow-editor-properties")).getByLabelText("描述"), {
      target: { value: "highlight-edit" },
    });

    expect(canvas).toHaveTextContent("highlight-edit");
    expect(canvas.querySelector('[data-flow-node-id="step001"]')).toHaveAttribute(
      "data-flow-selected",
      "true",
    );
  });
});
