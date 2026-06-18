import type { FlowItem, FlowLeafNode, FlowRoot } from "@/lib/flow/types";
import { isFlowSequence } from "@/lib/flow/types";

export type FlowNodeUpdater = (node: FlowLeafNode) => FlowLeafNode;

function mapItem(item: FlowItem, id: string, updater: FlowNodeUpdater): FlowItem {
  if (isFlowSequence(item)) {
    return item.map((child) => mapItem(child, id, updater));
  }

  if (item.id === id) {
    return updater(item);
  }

  if (item.type === "cond" || item.type === "para") {
    return {
      ...item,
      steps: item.steps.map((branch) => mapItem(branch, id, updater)),
    };
  }

  return item;
}

export function updateFlowNodeById(
  flow: FlowRoot,
  id: string,
  updater: FlowNodeUpdater,
): FlowRoot {
  return flow.map((item) => mapItem(item, id, updater));
}
