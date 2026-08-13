import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ToolPageChrome } from "@/components/tool-page-chrome";

describe("ToolPageChrome", () => {
  it("locks a compact header and fills the remaining viewport on large screens", () => {
    render(
      <ToolPageChrome title="Flow" description="Build a diagram" actions={<button type="button">Run</button>}>
        <div>workspace</div>
      </ToolPageChrome>,
    );

    const chrome = screen.getByTestId("tool-page-chrome");
    expect(chrome.className).toContain("lg:h-[calc(100dvh-4rem-1px)]");
    expect(chrome.className).toContain("lg:max-h-[calc(100dvh-4rem-1px)]");
    expect(screen.getByRole("main").className).toContain("max-w-7xl");
    const header = screen.getByRole("heading", { level: 1, name: "Flow" }).closest("header");
    expect(header?.className).toContain("py-1");
    expect(screen.getByRole("button", { name: "Run" }).parentElement?.className).toContain(
      "overflow-visible",
    );
    expect(screen.getByRole("heading", { level: 1, name: "Flow" }).className).toContain(
      "truncate",
    );
    expect(screen.getByText("Build a diagram").className).toContain("truncate");
    expect(screen.getByRole("button", { name: "Run" })).toBeInTheDocument();
  });
});
