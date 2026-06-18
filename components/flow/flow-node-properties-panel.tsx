"use client";

import type { FlowLeafNode } from "@/lib/flow/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type FlowNodePropertiesPanelProps = {
  selectedNode: FlowLeafNode | null;
  onPatchNode: (id: string, patch: Partial<FlowLeafNode>) => void;
  onClearSelection?: () => void;
  className?: string;
};

function ReadOnlyRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <Label className="text-muted-foreground">{label}</Label>
      <p className="text-sm text-foreground">{value}</p>
    </div>
  );
}

function StructuralSummary({
  node,
}: {
  node: Extract<FlowLeafNode, { type: "cond" | "para" | "end" }>;
}) {
  const typeLabel =
    node.type === "cond"
      ? "条件节点"
      : node.type === "para"
        ? "并行节点"
        : "结束节点";

  const branchCount =
    node.type === "cond" || node.type === "para" ? node.steps.length : null;

  return (
    <div className="space-y-4" data-testid="flow-properties-readonly">
      <ReadOnlyRow label="类型" value={typeLabel} />
      {branchCount !== null ? (
        <>
          <ReadOnlyRow label="分支数" value={String(branchCount)} />
          <p className="text-xs text-muted-foreground">
            在画布中选中该节点后，可使用工具栏「扩展分支」查看并编辑各分支内的子节点。
          </p>
        </>
      ) : null}
      <p className="text-xs text-muted-foreground">此节点为结构节点，属性只读。</p>
    </div>
  );
}

export function FlowNodePropertiesPanel({
  selectedNode,
  onPatchNode,
  onClearSelection,
  className,
}: FlowNodePropertiesPanelProps) {
  if (!selectedNode?.id) {
    return (
      <p
        data-testid="flow-properties-empty"
        className={cn("text-sm text-muted-foreground", className)}
      >
        尚未选中节点
      </p>
    );
  }

  const nodeId = selectedNode.id;

  return (
    <div className={cn("space-y-4", className)} data-testid="flow-properties-form">
      <div className="flex items-center justify-between gap-2">
        <ReadOnlyRow label="ID" value={nodeId} />
        {onClearSelection ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClearSelection}
          >
            取消选择
          </Button>
        ) : null}
      </div>

      {selectedNode.type === "step" ? (
        <>
          <div className="space-y-1">
            <Label htmlFor="flow-prop-text">编号</Label>
            <Input
              id="flow-prop-text"
              value={selectedNode.text ?? ""}
              onChange={(e) => onPatchNode(nodeId, { text: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="flow-prop-desc">描述</Label>
            <Input
              id="flow-prop-desc"
              value={selectedNode.descStr ?? ""}
              onChange={(e) => onPatchNode(nodeId, { descStr: e.target.value })}
            />
          </div>
        </>
      ) : null}

      {selectedNode.type === "start" ? (
        <>
          <div className="space-y-1">
            <Label htmlFor="flow-prop-text">编号</Label>
            <Input
              id="flow-prop-text"
              value={selectedNode.text ?? ""}
              onChange={(e) => onPatchNode(nodeId, { text: e.target.value })}
            />
          </div>
          <ReadOnlyRow label="描述" value={selectedNode.descStr ?? "—"} />
        </>
      ) : null}

      {selectedNode.type === "transfer" ? (
        <>
          <div className="space-y-1">
            <Label htmlFor="flow-prop-text">编号</Label>
            <Input
              id="flow-prop-text"
              value={selectedNode.text ?? ""}
              onChange={(e) => onPatchNode(nodeId, { text: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="flow-prop-expr">条件表达式</Label>
            <Input
              id="flow-prop-expr"
              value={
                selectedNode.expr === undefined || selectedNode.expr === null
                  ? ""
                  : String(selectedNode.expr)
              }
              onChange={(e) => onPatchNode(nodeId, { expr: e.target.value })}
            />
          </div>
        </>
      ) : null}

      {selectedNode.type === "cond" ||
      selectedNode.type === "para" ||
      selectedNode.type === "end" ? (
        <StructuralSummary node={selectedNode} />
      ) : null}
    </div>
  );
}
