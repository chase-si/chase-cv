import { assignFlowNodeLabels } from "@/lib/flow/assign-flow-node-labels";
import type { FlowItem, FlowRoot } from "@/lib/flow/types";

const RAW_DEMO_FLOW: FlowRoot = [
  {
    type: "start",
    id: "start-step",
    text: "start",
    descStr: "开始",
    start: true,
    status: "finished",
  },
  {
    type: "transfer",
    id: "transfer001",
    expr: "true",
    status: "ready",
  },
  {
    type: "step",
    id: "step001",
    descStr: "desc1",
    status: "ready",
    params: { duration: 3 },
  },
  {
    type: "transfer",
    id: "transfer002",
    expr: "true",
    status: "ready",
  },
  {
    type: "step",
    id: "step002",
    descStr: "desc2",
    status: "ready",
    params: { duration: 3 },
  },
  {
    type: "transfer",
    id: "transfer003",
    expr: "true",
    status: "ready",
  },
  {
    type: "step",
    id: "step003",
    descStr: "desc3",
    status: "ready",
    params: { duration: 3 },
  },
  {
    type: "transfer",
    id: "transfer004",
    expr: "true",
    status: "ready",
  },
  {
    type: "cond",
    id: "cond1",
    status: "ready",
    steps: [
      [
        {
          type: "transfer",
          id: "transfer005",
          expr: "true",
          status: "ready",
        },
        {
          type: "step",
          id: "step004",
          descStr: "desc4",
          status: "ready",
          params: { duration: 3 },
        },
      ],
      [
        {
          type: "transfer",
          id: "transfer007",
          expr: "false",
          status: "ready",
        },
        {
          type: "step",
          id: "step005",
          descStr: "desc5",
          status: "ready",
        },
        {
          type: "transfer",
          id: "transfer-jump",
          jump: true,
          expr: "001",
        },
      ],
    ],
  },
  {
    type: "transfer",
    id: "transfer006",
    expr: "true",
    status: "ready",
  },
  {
    type: "step",
    id: "step006",
    descStr: "desc6",
    status: "ready",
    params: { duration: 3 },
  },
  {
    type: "transfer",
    id: "transfer008",
    expr: "true",
    status: "ready",
  },
  {
    type: "para",
    id: "para1",
    status: "ready",
    steps: [
      [
        {
          type: "step",
          id: "step007",
          descStr: "desc7",
          status: "ready",
          params: { duration: 1 },
        },
      ],
      [
        {
          type: "step",
          id: "step008",
          descStr: "desc8",
          status: "ready",
          params: { duration: 2 },
        },
      ],
      [
        {
          type: "step",
          id: "step009",
          descStr: "desc9",
          status: "ready",
          params: { duration: 3 },
        },
        {
          type: "step",
          id: "step010",
          descStr: "desc10",
          status: "ready",
          params: { duration: 3 },
        },
        {
          type: "step",
          id: "step011",
          descStr: "desc11",
          status: "ready",
          params: { duration: 3 },
        },
        {
          type: "step",
          id: "step012",
          descStr: "desc12",
          status: "ready",
          params: { duration: 3 },
        },
      ],
    ],
  },
  {
    type: "transfer",
    id: "transfer009",
    expr: "true",
    status: "ready",
  },
  { type: "end", id: "end-step" },
];

export const DEMO_FLOW_ROOT: FlowRoot = assignFlowNodeLabels(RAW_DEMO_FLOW);

export function listDemoTransferLabels(flow: FlowRoot = DEMO_FLOW_ROOT): string[] {
  const labels: string[] = [];

  function walk(items: FlowItem[]) {
    for (const item of items) {
      if (Array.isArray(item)) {
        walk(item);
        continue;
      }
      if (item.type === "transfer" && item.text) {
        labels.push(item.text);
      }
      if (item.type === "cond" || item.type === "para") {
        for (const branch of item.steps) {
          walk(Array.isArray(branch) ? branch : [branch]);
        }
      }
    }
  }

  walk(flow);
  return labels;
}
