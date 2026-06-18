import { DEMO_FLOW_ROOT } from "@/lib/flow/demo-flow-data";
import type { FlowRoot } from "@/lib/flow/types";

export function cloneDemoFlowRoot(): FlowRoot {
  return structuredClone(DEMO_FLOW_ROOT);
}
