import {
  FLOW_DESC_RATIO,
  FLOW_PARALLEL_SLIT,
  FLOW_UNIT,
} from "@/lib/flow/constants";
import type {
  FlowCondNode,
  FlowItem,
  FlowParaNode,
  FlowSequence,
} from "@/lib/flow/types";
import { getFlowItemKind, isFlowSequence } from "@/lib/flow/types";

export function getNewFlowY(yParam: number, idx: number, dataArr: FlowItem[]) {
  return (
    yParam -
    dataArr
      .slice(idx)
      .map((item) => getFlowHeight(item))
      .reduce((acc, cur) => acc + cur, 0)
  );
}

export function getNewFlowX(xParam: number, idx: number, dataArr: FlowItem[]) {
  return (
    xParam -
    dataArr
      .slice(idx)
      .map((item) => getFlowWidth(item))
      .reduce((acc, cur) => acc + cur, 0)
  );
}

function sequenceHeight(sequence: FlowSequence) {
  return sequence
    .map((item) => getFlowHeight(item))
    .reduce((acc, cur) => acc + cur, 0);
}

function sequenceWidth(sequence: FlowSequence) {
  return Math.max(...sequence.map((item) => getFlowWidth(item)));
}

function branchContainerHeight(steps: FlowItem[]) {
  return Math.max(...steps.map((item) => getFlowHeight(item)));
}

function branchContainerWidth(steps: FlowItem[]) {
  return steps
    .map((item) => getFlowWidth(item))
    .reduce((acc, cur) => acc + cur, 0);
}

export function getFlowHeight(data: FlowItem): number {
  if (isFlowSequence(data)) {
    return sequenceHeight(data);
  }

  const dataType = getFlowItemKind(data);

  switch (dataType) {
    case "start":
    case "step":
    case "end":
    case "transfer":
      return FLOW_UNIT;
    case "cond":
      return branchContainerHeight((data as FlowCondNode).steps) + 10;
    case "para":
      return (
        branchContainerHeight((data as FlowParaNode).steps) +
        10 +
        2 * FLOW_PARALLEL_SLIT
      );
    default:
      return 0;
  }
}

export function getFlowWidth(data: FlowItem): number {
  if (isFlowSequence(data)) {
    return sequenceWidth(data);
  }

  const dataType = getFlowItemKind(data);

  switch (dataType) {
    case "end":
    case "start":
    case "transfer":
    case "step":
      return FLOW_UNIT * (FLOW_DESC_RATIO + 1);
    case "cond":
      return branchContainerWidth((data as FlowCondNode).steps);
    case "para":
      return branchContainerWidth((data as FlowParaNode).steps);
    default:
      return 0;
  }
}
