import { cleanup, render, screen, within } from "@testing-library/react";
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
});
