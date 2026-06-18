import type { Metadata } from "next";

import { FlowToolShell } from "@/components/flow/flow-tool-shell";

export const metadata: Metadata = {
  title: "流程编辑器 | Chase's CV",
  description: "可视化查看与编辑 SFC 流程结构的实验工具。",
};

export default function FlowPage() {
  return <FlowToolShell />;
}
