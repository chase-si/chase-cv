import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { FlowToolShell } from "@/components/flow/flow-tool-shell";

afterEach(() => {
  cleanup();
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
});
