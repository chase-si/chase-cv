import { describe, expect, it } from "vitest";

import { DEMO_FLOW_ROOT } from "@/lib/flow/demo-flow-data";
import { findFlowNodeById } from "@/lib/flow/find-flow-node";
import { updateFlowNodeById } from "@/lib/flow/update-flow-node";

describe("updateFlowNodeById", () => {
  it("updates a nested step without replacing unrelated nodes", () => {
    const next = updateFlowNodeById(DEMO_FLOW_ROOT, "step004", (node) =>
      node.type === "step" ? { ...node, descStr: "updated-desc" } : node,
    );

    expect(findFlowNodeById(next, "step004")?.type).toBe("step");
    if (findFlowNodeById(next, "step004")?.type === "step") {
      expect(findFlowNodeById(next, "step004")?.descStr).toBe("updated-desc");
    }
    if (findFlowNodeById(DEMO_FLOW_ROOT, "step001")?.type === "step") {
      expect(findFlowNodeById(next, "step001")?.descStr).toBe(
        findFlowNodeById(DEMO_FLOW_ROOT, "step001")?.descStr,
      );
    }
  });

  it("updates transfer expr immutably", () => {
    const next = updateFlowNodeById(DEMO_FLOW_ROOT, "transfer001", (node) =>
      node.type === "transfer" ? { ...node, expr: "x > 1" } : node,
    );

    const updated = findFlowNodeById(next, "transfer001");
    expect(updated?.type).toBe("transfer");
    if (updated?.type === "transfer") {
      expect(updated.expr).toBe("x > 1");
    }
    expect(findFlowNodeById(DEMO_FLOW_ROOT, "transfer001")).not.toBe(updated);
  });
});
