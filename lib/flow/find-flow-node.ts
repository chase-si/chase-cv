import type { FlowItem, FlowLeafNode, FlowRoot } from "@/lib/flow/types";
import { isFlowSequence } from "@/lib/flow/types";

export function findFlowNodeById(
  flow: FlowRoot,
  id: string,
): FlowLeafNode | undefined {
  function walk(items: FlowItem[]): FlowLeafNode | undefined {
    for (const item of items) {
      if (isFlowSequence(item)) {
        const found = walk(item);
        if (found) {
          return found;
        }
        continue;
      }

      if (item.id === id) {
        return item;
      }

      if (item.type === "cond" || item.type === "para") {
        for (const branch of item.steps) {
          const branchItems = isFlowSequence(branch) ? branch : [branch];
          const found = walk(branchItems);
          if (found) {
            return found;
          }
        }
      }
    }
    return undefined;
  }

  return walk(flow);
}
