import { describe, expect, it } from "vitest";

import { DEMO_FLOW_ROOT } from "@/lib/flow/demo-flow-data";
import {
  getFlowHeight,
  getFlowWidth,
  getNewFlowX,
  getNewFlowY,
} from "@/lib/flow/layout-metrics";
import { FLOW_UNIT } from "@/lib/flow/constants";
import type { FlowItem } from "@/lib/flow/types";

describe("flow layout metrics", () => {
  it("treats a leaf step as one unit tall", () => {
    const step: FlowItem = { type: "step", text: "001", descStr: "a" };
    expect(getFlowHeight(step)).toBe(FLOW_UNIT);
  });

  it("sums heights for a nested sequence array", () => {
    const seq: FlowItem = [
      { type: "step", text: "001" },
      { type: "step", text: "002" },
    ];
    expect(getFlowHeight(seq)).toBe(FLOW_UNIT * 2);
  });

  it("uses the widest branch for sequence width", () => {
    const seq: FlowItem = [
      { type: "step", text: "001" },
      [
        { type: "step", text: "002" },
        { type: "step", text: "003" },
      ],
    ];
    expect(getFlowWidth(seq)).toBe(getFlowWidth([{ type: "step" }, { type: "step" }]));
  });

  it("stacks vertical offsets from the bottom for root items", () => {
    const items: FlowItem[] = [
      { type: "start" },
      { type: "end" },
    ];
    const totalHeight = getFlowHeight(items[0]!) + getFlowHeight(items[1]!);
    expect(getNewFlowY(totalHeight, 0, items)).toBe(0);
    expect(getNewFlowY(totalHeight, 1, items)).toBe(FLOW_UNIT);
  });

  it("lays out condition branches side by side in width", () => {
    const cond: FlowItem = {
      type: "cond",
      steps: [
        [{ type: "step", text: "001" }],
        [{ type: "step", text: "002" }, { type: "step", text: "003" }],
      ],
    };
    const branchWidths = (cond as { steps: FlowItem[] }).steps.map((b) =>
      getFlowWidth(b),
    );
    expect(getFlowWidth(cond)).toBe(branchWidths[0]! + branchWidths[1]!);
    expect(getNewFlowX(getFlowWidth(cond), 1, (cond as { steps: FlowItem[] }).steps)).toBe(
      branchWidths[1]!,
    );
  });

  it("produces positive dimensions for the seeded demo flow", () => {
    const width = Math.max(...DEMO_FLOW_ROOT.map((item) => getFlowWidth(item)));
    const height = DEMO_FLOW_ROOT.map((item) => getFlowHeight(item)).reduce(
      (a, b) => a + b,
      0,
    );
    expect(width).toBeGreaterThan(0);
    expect(height).toBeGreaterThan(0);
  });
});
