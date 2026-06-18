import { describe, expect, it } from "vitest";

import { assignFlowNodeLabels } from "@/lib/flow/assign-flow-node-labels";
import type { FlowRoot } from "@/lib/flow/types";

describe("assignFlowNodeLabels", () => {
  it("numbers transfers as T1, T2 across the tree in document order", () => {
    const input: FlowRoot = [
      { type: "start" },
      { type: "transfer", expr: "true" },
      { type: "step", descStr: "a" },
      { type: "transfer", expr: "false" },
      { type: "end" },
    ];

    const labeled = assignFlowNodeLabels(input);
    const transfers = labeled.filter(
      (n): n is { type: "transfer"; text?: string } =>
        !Array.isArray(n) && n.type === "transfer",
    );

    expect(transfers.map((t) => t.text)).toEqual(["T1", "T2"]);
  });

  it("numbers steps as zero-padded three-digit codes inside branches", () => {
    const input: FlowRoot = [
      {
        type: "cond",
        steps: [
          [
            { type: "transfer" },
            { type: "step", descStr: "one" },
          ],
          [{ type: "step", descStr: "two" }],
        ],
      },
    ];

    const labeled = assignFlowNodeLabels(input);
    const cond = labeled[0] as { type: "cond"; steps: FlowRoot };
    const firstBranch = cond.steps[0] as FlowRoot;
    const stepInBranch = firstBranch.find(
      (n) => !Array.isArray(n) && n.type === "step",
    ) as { text?: string };

    expect(
      firstBranch.find((n) => !Array.isArray(n) && n.type === "transfer") as {
        text?: string;
      },
    ).toMatchObject({ text: "T1" });
    expect(stepInBranch.text).toBe("001");
    const secondStep = (cond.steps[1] as FlowRoot)[0] as { text?: string };
    expect(secondStep.text).toBe("002");
  });
});
