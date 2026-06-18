export type FlowStepStatus =
  | "ready"
  | "finished"
  | "passed"
  | "blocked"
  | (string & {});

export interface FlowStartNode {
  type: "start";
  id?: string;
  text?: string;
  descStr?: string;
  start?: boolean;
  status?: FlowStepStatus;
}

export interface FlowEndNode {
  type: "end";
  id?: string;
}

export interface FlowStepNode {
  type: "step";
  id?: string;
  text?: string;
  descStr?: string;
  status?: FlowStepStatus;
  params?: Record<string, unknown>;
  instance_id?: string;
  instance_name?: string;
}

export interface FlowTransferNode {
  type: "transfer";
  id?: string;
  text?: string;
  expr?: string | boolean;
  jump?: boolean;
  status?: FlowStepStatus;
}

export interface FlowCondNode {
  type: "cond";
  id?: string;
  status?: FlowStepStatus;
  steps: FlowBranchSteps;
}

export interface FlowParaNode {
  type: "para";
  id?: string;
  status?: FlowStepStatus;
  steps: FlowBranchSteps;
}

/** Each branch entry is a sequence (array) or single nested item per legacy protocol */
export type FlowBranchSteps = FlowItem[];

export type FlowLeafNode =
  | FlowStartNode
  | FlowEndNode
  | FlowStepNode
  | FlowTransferNode
  | FlowCondNode
  | FlowParaNode;

/** Nested vertical sequence — represented as a JSON array */
export type FlowSequence = FlowItem[];

export type FlowItem = FlowLeafNode | FlowSequence;

export type FlowRoot = FlowItem[];

export function isFlowSequence(item: FlowItem): item is FlowSequence {
  return Array.isArray(item);
}

export function getFlowItemKind(
  item: FlowItem,
): FlowLeafNode["type"] | "seq" {
  if (isFlowSequence(item)) {
    return "seq";
  }
  return item.type;
}
