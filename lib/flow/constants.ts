export const FLOW_UNIT = 60;
export const FLOW_DESC_RATIO = 4;
export const FLOW_PARALLEL_SLIT = 5;
export const FLOW_FONT_SIZE = 10;
export const FLOW_NODE_FILL = "var(--card)";
export const FLOW_ACTIVE_HIGHLIGHT_FILL = "var(--primary)";
export const FLOW_ARROW_OFFSET = 30;

export const FLOW_NODE_TYPE = {
  start: { type: "start" as const, remark: "开始" },
  end: { type: "end" as const, remark: "结束" },
  step: { type: "step" as const, remark: "普通step" },
  transfer: { type: "transfer" as const, remark: "转化" },
  seq: { type: "seq" as const, remark: "序列" },
  cond: { type: "cond" as const, remark: "条件分支" },
  para: { type: "para" as const, remark: "并行" },
} as const;
