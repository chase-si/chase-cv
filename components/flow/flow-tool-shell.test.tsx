import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { FlowToolShell } from "@/components/flow/flow-tool-shell";

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
});
