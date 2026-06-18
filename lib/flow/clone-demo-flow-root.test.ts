import { describe, expect, it } from "vitest";

import { cloneDemoFlowRoot } from "@/lib/flow/clone-demo-flow-root";
import { DEMO_FLOW_ROOT } from "@/lib/flow/demo-flow-data";

describe("cloneDemoFlowRoot", () => {
  it("returns a deep copy that can be mutated independently", () => {
    const clone = cloneDemoFlowRoot();

    expect(clone).toEqual(DEMO_FLOW_ROOT);
    expect(clone).not.toBe(DEMO_FLOW_ROOT);

    const first = clone[0];
    if (first && !Array.isArray(first) && first.type === "start") {
      first.descStr = "mutated";
    }

    expect(DEMO_FLOW_ROOT[0]).toMatchObject({ descStr: "开始" });
  });
});
