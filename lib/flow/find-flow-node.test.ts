import { describe, expect, it } from "vitest";

import { DEMO_FLOW_ROOT } from "@/lib/flow/demo-flow-data";
import { findFlowNodeById } from "@/lib/flow/find-flow-node";

describe("findFlowNodeById", () => {
  it("finds root-level and nested branch nodes by id", () => {
    expect(findFlowNodeById(DEMO_FLOW_ROOT, "start-step")?.type).toBe("start");
    expect(findFlowNodeById(DEMO_FLOW_ROOT, "step001")?.type).toBe("step");
    expect(findFlowNodeById(DEMO_FLOW_ROOT, "cond1")?.type).toBe("cond");
    expect(findFlowNodeById(DEMO_FLOW_ROOT, "step004")?.type).toBe("step");
    expect(findFlowNodeById(DEMO_FLOW_ROOT, "end-step")?.type).toBe("end");
  });

  it("returns undefined when id is missing", () => {
    expect(findFlowNodeById(DEMO_FLOW_ROOT, "missing-id")).toBeUndefined();
  });
});
