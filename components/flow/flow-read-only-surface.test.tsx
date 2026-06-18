import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import { FlowReadOnlySurface } from "@/components/flow/flow-read-only-surface";
import { DEMO_FLOW_ROOT, listDemoTransferLabels } from "@/lib/flow/demo-flow-data";

describe("FlowReadOnlySurface", () => {
  it("renders seeded demo with descStr visible for steps and start", () => {
    render(<FlowReadOnlySurface datas={DEMO_FLOW_ROOT} />);

    expect(screen.getByText("开始")).toBeInTheDocument();
    expect(screen.getByText("desc1")).toBeInTheDocument();
    expect(screen.getByText("desc12")).toBeInTheDocument();
  });

  it("shows transfer labels as T sequence from seeded data", () => {
    const labels = listDemoTransferLabels();
    expect(labels.length).toBeGreaterThan(0);
    expect(labels).toEqual(labels.map((_, index) => `T${index + 1}`));

    render(<FlowReadOnlySurface datas={DEMO_FLOW_ROOT} />);

    const firstTransfer = document.querySelector(
      '[data-flow-node-id="transfer001"]',
    );
    expect(firstTransfer?.textContent).toContain("T1");
    expect(
      document.querySelector('[data-flow-node-id="transfer009"]')?.textContent,
    ).toContain(`T${labels.length}`);
  });

  it("applies idColorMap fill on matching step nodes", () => {
    render(
      <FlowReadOnlySurface
        datas={[
          { type: "start", id: "s1", descStr: "起" },
          {
            type: "step",
            id: "step-colored",
            text: "001",
            descStr: "着色步骤",
            status: "ready",
          },
          { type: "end" },
        ]}
        idColorMap={{ "step-colored": "var(--primary)" }}
      />,
    );

    const stepGroup = document.querySelector('[data-flow-node-id="step-colored"]');
    expect(stepGroup).toBeTruthy();
    const fills = stepGroup!.querySelectorAll("rect[fill]");
    const fillValues = [...fills].map((el) => el.getAttribute("fill"));
    expect(fillValues).toContain("var(--primary)");
  });

  it("renders green progress arrow when step id is in greenArrowIds", () => {
    render(
      <FlowReadOnlySurface
        datas={[
          { type: "start", id: "s1" },
          {
            type: "step",
            id: "running-step",
            text: "001",
            descStr: "运行中",
          },
          { type: "end" },
        ]}
        greenArrowIds={["running-step"]}
      />,
    );

    const arrow = document.querySelector('[data-flow-green-arrow="running-step"]');
    expect(arrow).toBeInTheDocument();
  });

  it("exposes an svg root with positive dimensions for the demo flow", () => {
    render(<FlowReadOnlySurface datas={DEMO_FLOW_ROOT} />);
    const svg = document.querySelector('[data-testid="flow-read-only-svg"]');
    expect(svg).toBeTruthy();
    expect(Number(svg!.getAttribute("width"))).toBeGreaterThan(0);
    expect(Number(svg!.getAttribute("height"))).toBeGreaterThan(0);
  });
});
