import { assignFlowNodeLabels } from "@/lib/flow/assign-flow-node-labels";
import { findFlowNodeById } from "@/lib/flow/find-flow-node";
import type { FlowIdFactory } from "@/lib/flow/flow-id-factory";
import {
  appendFlowBranchStep,
  collapseSingleBranchNodes,
  createBlankFlowStep,
  deleteFlowItemById,
  findFlowNodeParentItems,
  insertFlowItemAfterId,
} from "@/lib/flow/flow-tree-ops";
import type { FlowLeafNode, FlowRoot, FlowStepNode } from "@/lib/flow/types";

export type FlowStructureMutationResult = {
  newFlowData: FlowRoot;
  newAddedSteps: FlowStepNode[];
  selectedNodeId: string | null;
};

function labelFlow(flow: FlowRoot) {
  return assignFlowNodeLabels(flow);
}

function createTransfer(id: string) {
  return {
    type: "transfer" as const,
    id,
    text: "",
    expr: "",
    status: "ready" as const,
  };
}

export function addSequentialFlowStep(options: {
  renderData: FlowRoot;
  activeId: string;
  createId: FlowIdFactory;
}): FlowStructureMutationResult {
  const { renderData, activeId, createId } = options;
  const selectedData = findFlowNodeById(renderData, activeId);
  if (!selectedData) {
    throw new Error("未找到选中节点");
  }

  let newFlowData: FlowRoot;
  let newStep: FlowStepNode;

  if (selectedData.type === "transfer") {
    const stepId = createId();
    newStep = createBlankFlowStep(stepId);
    const withStep = insertFlowItemAfterId(renderData, newStep, activeId);
    const transferId = createId();
    newFlowData = insertFlowItemAfterId(withStep, createTransfer(transferId), stepId);
  } else if (selectedData.type === "start" || selectedData.type === "step") {
    const transferId = createId();
    const withTransfer = insertFlowItemAfterId(
      renderData,
      createTransfer(transferId),
      activeId,
    );
    newStep = createBlankFlowStep(createId());
    newFlowData = insertFlowItemAfterId(withTransfer, newStep, transferId);
  } else {
    throw new Error("当前节点不可增加顺序步");
  }

  return {
    newFlowData: labelFlow(newFlowData),
    newAddedSteps: [newStep],
    selectedNodeId: newStep.id ?? null,
  };
}

export function addFlowBranch(options: {
  renderData: FlowRoot;
  activeId: string;
  createId: FlowIdFactory;
}): FlowStructureMutationResult {
  const { renderData, activeId, createId } = options;
  const selectedData = findFlowNodeById(renderData, activeId);
  if (!selectedData) {
    throw new Error("未找到选中节点");
  }

  if (selectedData.type === "step") {
    const newCondId = createId();
    const condNode = {
      type: "cond" as const,
      id: newCondId,
      status: "ready" as const,
      steps: [
        [createTransfer(createId())],
        [createTransfer(createId())],
      ] as FlowRoot,
    };
    const withCond = insertFlowItemAfterId(renderData, condNode, activeId);
    const newStep = createBlankFlowStep(createId());
    const newFlowData = insertFlowItemAfterId(withCond, newStep, newCondId);

    return {
      newFlowData: labelFlow(newFlowData),
      newAddedSteps: [newStep],
      selectedNodeId: newStep.id ?? null,
    };
  }

  if (selectedData.type === "transfer") {
    const newParaId = createId();
    const stepId1 = createId();
    const stepId2 = createId();
    const newStep1 = createBlankFlowStep(stepId1);
    const newStep2 = createBlankFlowStep(stepId2);
    const paraNode = {
      type: "para" as const,
      id: newParaId,
      status: "ready" as const,
      steps: [[newStep1], [newStep2]] as FlowRoot,
    };
    const withPara = insertFlowItemAfterId(renderData, paraNode, activeId);
    const newFlowData = insertFlowItemAfterId(
      withPara,
      createTransfer(createId()),
      newParaId,
    );

    return {
      newFlowData: labelFlow(newFlowData),
      newAddedSteps: [newStep1, newStep2],
      selectedNodeId: newStep1.id ?? null,
    };
  }

  return {
    newFlowData: renderData,
    newAddedSteps: [],
    selectedNodeId: activeId,
  };
}

export function expandFlowBranch(options: {
  renderData: FlowRoot;
  activeId: string;
  createId: FlowIdFactory;
}): FlowStructureMutationResult {
  const { renderData, activeId, createId } = options;
  const selectedData = findFlowNodeById(renderData, activeId);
  if (!selectedData) {
    throw new Error("未找到选中节点");
  }

  if (selectedData.type === "cond") {
    const newTransId = createId();
    const newFlowData = appendFlowBranchStep(
      renderData,
      activeId,
      [createTransfer(newTransId)],
    );
    return {
      newFlowData: labelFlow(newFlowData),
      newAddedSteps: [],
      selectedNodeId: newTransId,
    };
  }

  if (selectedData.type === "para") {
    const newStep = createBlankFlowStep(createId());
    const newFlowData = appendFlowBranchStep(renderData, activeId, [newStep]);
    return {
      newFlowData: labelFlow(newFlowData),
      newAddedSteps: [newStep],
      selectedNodeId: newStep.id ?? null,
    };
  }

  return {
    newFlowData: renderData,
    newAddedSteps: [],
    selectedNodeId: activeId,
  };
}

export function deleteSupportedFlowNode(options: {
  renderData: FlowRoot;
  activeId: string;
}): FlowStructureMutationResult {
  const { renderData, activeId } = options;
  const selectedData = findFlowNodeById(renderData, activeId);
  if (!selectedData) {
    throw new Error("未找到选中节点");
  }

  if (selectedData.type === "transfer") {
    const parentNodes = findFlowNodeParentItems(renderData, selectedData.id!);
    if (!parentNodes || parentNodes.length !== 1) {
      throw new Error("当前 transfer 不可删除");
    }
    const newFlowData = collapseSingleBranchNodes(
      deleteFlowItemById(renderData, selectedData.id!),
    );
    return {
      newFlowData: labelFlow(newFlowData),
      newAddedSteps: [],
      selectedNodeId: null,
    };
  }

  if (selectedData.type === "step") {
    const parentNodes = findFlowNodeParentItems(renderData, selectedData.id!);
    if (!parentNodes) {
      throw new Error("当前 step 不可删除");
    }

    if (parentNodes.length === 1) {
      const newFlowData = collapseSingleBranchNodes(
        deleteFlowItemById(renderData, selectedData.id!),
      );
      return {
        newFlowData: labelFlow(newFlowData),
        newAddedSteps: [],
        selectedNodeId: null,
      };
    }

    const index = parentNodes.findIndex(
      (item) => !Array.isArray(item) && item.id === selectedData.id,
    );
    const stepNextNode = parentNodes[index + 1] as FlowLeafNode | undefined;
    if (stepNextNode?.type === "transfer" && stepNextNode.id) {
      let newFlowData = deleteFlowItemById(renderData, selectedData.id!);
      newFlowData = deleteFlowItemById(newFlowData, stepNextNode.id);
      return {
        newFlowData: labelFlow(newFlowData),
        newAddedSteps: [],
        selectedNodeId: null,
      };
    }

    throw new Error("当前 step 不可删除");
  }

  throw new Error("当前节点不可删除");
}

export function getFlowToolbarCapabilities(
  selectedNode: FlowLeafNode | null | undefined,
) {
  const type = selectedNode?.type;
  return {
    canAddSequentialStep:
      type === "start" || type === "step" || type === "transfer",
    canAddBranch: type === "step" || type === "transfer",
    canExpandBranch: type === "cond" || type === "para",
    canDelete: type === "step" || type === "transfer",
  };
}
