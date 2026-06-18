import type { FlowItem, FlowLeafNode, FlowRoot, FlowStepNode } from "@/lib/flow/types";
import { isFlowSequence } from "@/lib/flow/types";

export function insertFlowItemAfterId(
  wholeTreeData: FlowRoot,
  newItem: FlowItem,
  insertAfterId: string,
): FlowRoot {
  const positionIdx = wholeTreeData.findIndex(
    (treeData) => !isFlowSequence(treeData) && treeData.id === insertAfterId,
  );

  if (positionIdx !== -1) {
    const cpData = [...wholeTreeData];
    cpData.splice(positionIdx + 1, 0, newItem);
    return cpData;
  }

  return wholeTreeData.map((treeData) => {
    if (isFlowSequence(treeData)) {
      return insertFlowItemAfterId(treeData, newItem, insertAfterId);
    }

    if (treeData.type === "cond" || treeData.type === "para") {
      return {
        ...treeData,
        steps: insertFlowItemAfterId(treeData.steps, newItem, insertAfterId),
      };
    }
    return treeData;
  });
}

export function deleteFlowItemById(
  wholeTreeData: FlowRoot,
  deleteId: string,
): FlowRoot {
  const positionIdx = wholeTreeData.findIndex(
    (treeData) => !isFlowSequence(treeData) && treeData.id === deleteId,
  );

  if (positionIdx !== -1) {
    const cpData = [...wholeTreeData];
    cpData.splice(positionIdx, 1);
    return cpData;
  }

  return wholeTreeData.map((treeData) => {
    if (isFlowSequence(treeData)) {
      return deleteFlowItemById(treeData, deleteId);
    }

    if (treeData.type === "cond" || treeData.type === "para") {
      return {
        ...treeData,
        steps: deleteFlowItemById(treeData.steps, deleteId),
      };
    }
    return treeData;
  });
}

export function appendFlowBranchStep(
  wholeTreeData: FlowRoot,
  branchNodeId: string,
  newBranch: FlowItem,
): FlowRoot {
  return wholeTreeData.map((treeData) => {
    if (!isFlowSequence(treeData) && treeData.id === branchNodeId) {
      if (treeData.type !== "cond" && treeData.type !== "para") {
        return treeData;
      }
      return {
        ...treeData,
        steps: [...treeData.steps, newBranch],
      };
    }

    if (isFlowSequence(treeData)) {
      return appendFlowBranchStep(treeData, branchNodeId, newBranch);
    }

    if (treeData.type === "cond" || treeData.type === "para") {
      return {
        ...treeData,
        steps: appendFlowBranchStep(treeData.steps, branchNodeId, newBranch),
      };
    }
    return treeData;
  });
}

export function findFlowNodeParentItems(
  wholeTreeData: FlowRoot,
  id: string,
): FlowItem[] | undefined {
  const direct = wholeTreeData.find(
    (treeData) => !isFlowSequence(treeData) && treeData.id === id,
  );
  if (direct) {
    return wholeTreeData;
  }

  for (const treeData of wholeTreeData) {
    if (isFlowSequence(treeData)) {
      const found = findFlowNodeParentItems(treeData, id);
      if (found) {
        return found;
      }
      continue;
    }

    if (treeData.type === "cond" || treeData.type === "para") {
      const found = findFlowNodeParentItems(treeData.steps, id);
      if (found) {
        return found;
      }
    }
  }

  return undefined;
}

export function deleteEmptyFlowBranches(wholeTreeData: FlowRoot): FlowRoot {
  const cpData = wholeTreeData
    .filter(
      (treeData) =>
        JSON.stringify(treeData) !== "[]" && JSON.stringify(treeData) !== "[[]]",
    )
    .map((treeData) => {
      if (isFlowSequence(treeData)) {
        return deleteEmptyFlowBranches(treeData);
      }

      if (treeData.type === "cond" || treeData.type === "para") {
        return {
          ...treeData,
          steps: deleteEmptyFlowBranches(treeData.steps),
        };
      }
      return treeData;
    });

  return cpData;
}

function findSingleBranchCondOrPara(
  wholeTreeData: FlowRoot,
): (FlowLeafNode & { type: "cond" | "para" }) | undefined {
  for (const treeData of wholeTreeData) {
    if (isFlowSequence(treeData)) {
      const found = findSingleBranchCondOrPara(treeData);
      if (found) {
        return found;
      }
      continue;
    }

    if (treeData.type === "cond" || treeData.type === "para") {
      if (treeData.steps.length === 1) {
        return treeData;
      }
      const nested = findSingleBranchCondOrPara(treeData.steps);
      if (nested) {
        return nested;
      }
    }
  }
  return undefined;
}

export function collapseSingleBranchNodes(data: FlowRoot): FlowRoot {
  let newData = deleteEmptyFlowBranches(data);
  const oneBranchNode = findSingleBranchCondOrPara(newData);

  if (!oneBranchNode?.id) {
    return newData;
  }

  const { steps, id } = oneBranchNode;
  const stepsChildArr = steps.flatMap((branch) =>
    isFlowSequence(branch) ? branch : [branch],
  );
  const reversed = [...stepsChildArr].reverse();

  for (const item of reversed) {
    newData = insertFlowItemAfterId(newData, item, id);
  }
  newData = deleteFlowItemById(newData, id);

  return collapseSingleBranchNodes(newData);
}

export function createBlankFlowStep(id: string): FlowStepNode {
  return {
    type: "step",
    id,
    text: "",
    descStr: "",
    status: "ready",
  };
}
