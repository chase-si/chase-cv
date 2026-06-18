import type { FlowItem, FlowRoot } from "@/lib/flow/types";
import { isFlowSequence } from "@/lib/flow/types";

interface LabelCounters {
  transfer: number;
  step: number;
}

function formatStepLabel(stepIndex: number) {
  return String(stepIndex).padStart(3, "0");
}

function labelItem(item: FlowItem, counters: LabelCounters): FlowItem {
  if (isFlowSequence(item)) {
    return item.map((child) => labelItem(child, counters));
  }

  if (item.type === "transfer") {
    counters.transfer += 1;
    return { ...item, text: `T${counters.transfer}` };
  }

  if (item.type === "step") {
    counters.step += 1;
    return { ...item, text: formatStepLabel(counters.step) };
  }

  if (item.type === "cond" || item.type === "para") {
    return {
      ...item,
      steps: item.steps.map((branch) => labelItem(branch, counters)),
    };
  }

  return item;
}

export function assignFlowNodeLabels(flow: FlowRoot): FlowRoot {
  const counters: LabelCounters = { transfer: 0, step: 0 };
  return flow.map((item) => labelItem(item, counters));
}
