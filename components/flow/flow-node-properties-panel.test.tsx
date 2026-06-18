import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { FlowNodePropertiesPanel } from "@/components/flow/flow-node-properties-panel";
import type { FlowLeafNode } from "@/lib/flow/types";

afterEach(() => {
  cleanup();
});

const stepNode: FlowLeafNode = {
  type: "step",
  id: "step-test",
  text: "001",
  descStr: "desc-a",
};

describe("FlowNodePropertiesPanel", () => {
  it("shows empty state when nothing is selected", () => {
    render(
      <FlowNodePropertiesPanel selectedNode={null} onPatchNode={vi.fn()} />,
    );
    expect(screen.getByTestId("flow-properties-empty")).toHaveTextContent(
      "尚未选中节点",
    );
  });

  it("renders read-only structural summary for condition nodes", () => {
    const cond: FlowLeafNode = {
      type: "cond",
      id: "cond-test",
      steps: [[{ type: "end", id: "e1" }], [{ type: "end", id: "e2" }]],
    };
    render(
      <FlowNodePropertiesPanel selectedNode={cond} onPatchNode={vi.fn()} />,
    );
    const panel = screen.getByTestId("flow-properties-readonly");
    expect(panel).toHaveTextContent("条件节点");
    expect(screen.getByTestId("flow-properties-form")).toHaveTextContent("cond-test");
    expect(panel).toHaveTextContent("2");
    expect(panel).toHaveTextContent("扩展分支");
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
  });

  it("patches step fields on input", () => {
    const onPatchNode = vi.fn();
    render(
      <FlowNodePropertiesPanel
        selectedNode={stepNode}
        onPatchNode={onPatchNode}
      />,
    );

    fireEvent.change(screen.getByLabelText("描述"), {
      target: { value: "new-desc" },
    });

    expect(onPatchNode).toHaveBeenCalledWith("step-test", { descStr: "new-desc" });
  });
});
