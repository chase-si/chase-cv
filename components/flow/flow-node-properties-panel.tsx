"use client";

import { MousePointerClick } from "lucide-react";

import type { FlowLeafNode } from "@/lib/flow/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { defaultFlowUiCopy, type FlowUiCopy } from "@/components/flow/flow-ui-copy";
import { cn } from "@/lib/utils";

export type FlowNodePropertiesPanelProps = {
  selectedNode: FlowLeafNode | null;
  onPatchNode: (id: string, patch: Partial<FlowLeafNode>) => void;
  onClearSelection?: () => void;
  copy?: FlowUiCopy["properties"];
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
  copy,
}: {
  node: Extract<FlowLeafNode, { type: "cond" | "para" | "end" }>;
  copy: FlowUiCopy["properties"];
}) {
  const typeLabel =
    node.type === "cond"
      ? copy.conditionNode
      : node.type === "para"
        ? copy.parallelNode
        : copy.endNode;

  const branchCount =
    node.type === "cond" || node.type === "para" ? node.steps.length : null;

  return (
    <div className="space-y-4" data-testid="flow-properties-readonly">
      <ReadOnlyRow label={copy.type} value={typeLabel} />
      {branchCount !== null ? (
        <>
          <ReadOnlyRow label={copy.branchCount} value={String(branchCount)} />
          <p className="text-xs text-muted-foreground">
            {copy.structuralHelp}
          </p>
        </>
      ) : null}
      <p className="text-xs text-muted-foreground">{copy.structuralReadonly}</p>
    </div>
  );
}

export function FlowNodePropertiesPanel({
  selectedNode,
  onPatchNode,
  onClearSelection,
  copy = defaultFlowUiCopy.properties,
  className,
}: FlowNodePropertiesPanelProps) {
  if (!selectedNode?.id) {
    return (
      <div
        data-testid="flow-properties-empty"
        className={cn(
          "flex min-h-40 flex-col items-center justify-center gap-3 border border-dashed border-border bg-muted/20 p-5 text-center",
          className,
        )}
      >
        <span className="flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <MousePointerClick aria-hidden className="size-5" />
        </span>
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium text-foreground">{copy.emptyTitle}</p>
          <p className="text-xs leading-5 text-muted-foreground">
            {copy.emptyDescription}
          </p>
        </div>
      </div>
    );
  }

  const nodeId = selectedNode.id;

  return (
    <div className={cn("space-y-4", className)} data-testid="flow-properties-form">
      <div className="flex items-center justify-between gap-2">
        <ReadOnlyRow label={copy.id} value={nodeId} />
        {onClearSelection ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClearSelection}
          >
            {copy.cancelSelection}
          </Button>
        ) : null}
      </div>

      {selectedNode.type === "step" ? (
        <>
          <div className="space-y-1">
            <Label htmlFor="flow-prop-text">{copy.number}</Label>
            <Input
              id="flow-prop-text"
              value={selectedNode.text ?? ""}
              onChange={(e) => onPatchNode(nodeId, { text: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="flow-prop-desc">{copy.descriptionLabel}</Label>
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
            <Label htmlFor="flow-prop-text">{copy.number}</Label>
            <Input
              id="flow-prop-text"
              value={selectedNode.text ?? ""}
              onChange={(e) => onPatchNode(nodeId, { text: e.target.value })}
            />
          </div>
          <ReadOnlyRow label={copy.descriptionLabel} value={selectedNode.descStr ?? "—"} />
        </>
      ) : null}

      {selectedNode.type === "transfer" ? (
        <>
          <div className="space-y-1">
            <Label htmlFor="flow-prop-text">{copy.number}</Label>
            <Input
              id="flow-prop-text"
              value={selectedNode.text ?? ""}
              onChange={(e) => onPatchNode(nodeId, { text: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="flow-prop-expr">{copy.expression}</Label>
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
        <StructuralSummary node={selectedNode} copy={copy} />
      ) : null}
    </div>
  );
}
