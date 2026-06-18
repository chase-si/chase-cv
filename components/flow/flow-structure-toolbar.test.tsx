import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import {
  FlowStructureToolbar,
  type FlowToolbarCapabilities,
} from "@/components/flow/flow-structure-toolbar";

const allEnabled: FlowToolbarCapabilities = {
  canAddSequentialStep: true,
  canAddBranch: true,
  canExpandBranch: true,
  canDelete: true,
};

const allDisabled: FlowToolbarCapabilities = {
  canAddSequentialStep: false,
  canAddBranch: false,
  canExpandBranch: false,
  canDelete: false,
};

afterEach(() => {
  cleanup();
});

describe("FlowStructureToolbar", () => {
  it("shows zoom percentage and structure action buttons", () => {
    render(
      <FlowStructureToolbar
        zoom={1.1}
        capabilities={allDisabled}
        onZoomIn={vi.fn()}
        onZoomOut={vi.fn()}
        onZoomReset={vi.fn()}
        onAddSequentialStep={vi.fn()}
        onAddBranch={vi.fn()}
        onExpandBranch={vi.fn()}
        onDelete={vi.fn()}
      />,
    );

    expect(screen.getByTestId("flow-toolbar-zoom-label")).toHaveTextContent("110%");
    expect(screen.getByRole("button", { name: "放大" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "增加顺序步" })).toBeDisabled();
  });

  it("disables structure actions when capabilities are false", () => {
    render(
      <FlowStructureToolbar
        zoom={1}
        capabilities={allDisabled}
        onZoomIn={vi.fn()}
        onZoomOut={vi.fn()}
        onZoomReset={vi.fn()}
        onAddSequentialStep={vi.fn()}
        onAddBranch={vi.fn()}
        onExpandBranch={vi.fn()}
        onDelete={vi.fn()}
      />,
    );

    expect(screen.getByRole("button", { name: "增加分支" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "扩展分支" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "删除" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "放大" })).toBeEnabled();
  });

  it("invokes handlers when enabled actions are clicked", () => {
    const onAddSequentialStep = vi.fn();
    render(
      <FlowStructureToolbar
        zoom={1}
        capabilities={allEnabled}
        onZoomIn={vi.fn()}
        onZoomOut={vi.fn()}
        onZoomReset={vi.fn()}
        onAddSequentialStep={onAddSequentialStep}
        onAddBranch={vi.fn()}
        onExpandBranch={vi.fn()}
        onDelete={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "增加顺序步" }));
    expect(onAddSequentialStep).toHaveBeenCalledTimes(1);
  });
});
