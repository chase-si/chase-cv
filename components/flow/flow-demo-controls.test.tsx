import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { FlowDemoControls } from "@/components/flow/flow-demo-controls";

afterEach(() => {
  cleanup();
});

describe("FlowDemoControls", () => {
  it("invokes reset without extra confirmation UI", () => {
    const onReset = vi.fn();
    const confirmSpy = vi.spyOn(window, "confirm").mockReturnValue(true);

    render(
      <FlowDemoControls
        runningHighlight={false}
        onRunningHighlightChange={vi.fn()}
        onReset={onReset}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /重置示例/ }));

    expect(onReset).toHaveBeenCalledTimes(1);
    expect(confirmSpy).not.toHaveBeenCalled();
    confirmSpy.mockRestore();
  });

  it("toggles running highlight through the switch", () => {
    const onRunningHighlightChange = vi.fn();

    render(
      <FlowDemoControls
        runningHighlight={false}
        onRunningHighlightChange={onRunningHighlightChange}
        onReset={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByRole("switch", { name: "运行态高亮" }));
    expect(onRunningHighlightChange).toHaveBeenCalledWith(true);
  });
});
