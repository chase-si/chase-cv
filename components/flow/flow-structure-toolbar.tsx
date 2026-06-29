"use client";

import type { ReactNode } from "react";
import {
  GitBranchPlus,
  ListPlus,
  Minus,
  Plus,
  RotateCcw,
  Split,
  Trash2,
} from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatFlowZoomPercent } from "@/lib/flow/flow-zoom";
import type { getFlowToolbarCapabilities } from "@/lib/flow/flow-structure-mutations";
import { cn } from "@/lib/utils";

export type FlowToolbarCapabilities = ReturnType<
  typeof getFlowToolbarCapabilities
>;

export type FlowStructureToolbarProps = {
  zoom: number;
  capabilities: FlowToolbarCapabilities;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomReset: () => void;
  onAddSequentialStep: () => void;
  onAddBranch: () => void;
  onExpandBranch: () => void;
  onDelete: () => void;
  selectedNodeId?: string | null;
  className?: string;
};

type ToolbarAction = {
  key: string;
  label: string;
  icon: ReactNode;
  onClick: () => void;
  disabled?: boolean;
  destructive?: boolean;
};

function ToolbarActionButton({
  label,
  icon,
  onClick,
  disabled,
  destructive,
}: Pick<ToolbarAction, "label" | "icon" | "onClick" | "disabled" | "destructive">) {
  return (
    <Button
      type="button"
      variant={destructive ? "destructive" : "outline"}
      size="sm"
      className="w-full justify-start"
      disabled={disabled}
      onClick={onClick}
    >
      {icon}
      {label}
    </Button>
  );
}

export function FlowStructureToolbar({
  zoom,
  capabilities,
  onZoomIn,
  onZoomOut,
  onZoomReset,
  onAddSequentialStep,
  onAddBranch,
  onExpandBranch,
  onDelete,
  selectedNodeId,
  className,
}: FlowStructureToolbarProps) {
  const structureActions: ToolbarAction[] = [
    {
      key: "add-step",
      label: "增加顺序步",
      icon: <ListPlus aria-hidden />,
      onClick: onAddSequentialStep,
      disabled: !capabilities.canAddSequentialStep,
    },
    {
      key: "add-branch",
      label: "增加分支",
      icon: <GitBranchPlus aria-hidden />,
      onClick: onAddBranch,
      disabled: !capabilities.canAddBranch,
    },
    {
      key: "expand-branch",
      label: "扩展分支",
      icon: <Split aria-hidden />,
      onClick: onExpandBranch,
      disabled: !capabilities.canExpandBranch,
    },
    {
      key: "delete",
      label: "删除节点",
      icon: <Trash2 aria-hidden />,
      onClick: onDelete,
      disabled: !capabilities.canDelete,
      destructive: true,
    },
  ];

  return (
    <Card size="sm" className={cn("h-full shadow-sm", className)}>
      <CardHeader className="border-b border-border">
        <CardTitle className="text-sm">编辑工具</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <section className="flex flex-col gap-2" aria-labelledby="flow-zoom-heading">
          <h2
            id="flow-zoom-heading"
            className="text-xs font-medium text-muted-foreground"
          >
            画布缩放
          </h2>
          <div className="grid grid-cols-[2rem_minmax(3.5rem,1fr)_2rem] items-center overflow-hidden border border-border bg-background shadow-xs">
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="rounded-none border-r border-border"
              aria-label="缩小"
              onClick={onZoomOut}
            >
              <Minus aria-hidden />
            </Button>
            <span
              data-testid="flow-toolbar-zoom-label"
              className="text-center text-xs font-medium tabular-nums text-foreground"
            >
              {formatFlowZoomPercent(zoom)}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="rounded-none border-l border-border"
              aria-label="放大"
              onClick={onZoomIn}
            >
              <Plus aria-hidden />
            </Button>
          </div>
          <Button type="button" variant="ghost" size="sm" onClick={onZoomReset}>
            <RotateCcw aria-hidden />
            重置为 100%
          </Button>
        </section>

        <Separator />

        <section className="flex flex-col gap-2" aria-labelledby="flow-structure-heading">
          <div className="flex flex-col gap-1">
            <h2
              id="flow-structure-heading"
              className="text-xs font-medium text-muted-foreground"
            >
              节点操作
            </h2>
            <p className="truncate text-xs text-muted-foreground">
              {selectedNodeId ? `已选：${selectedNodeId}` : "选择节点后进行编辑"}
            </p>
          </div>
          {!selectedNodeId ? (
            <Alert className="px-3 py-2">
              <AlertDescription className="text-xs text-muted-foreground">
                请先在画布中选择节点
              </AlertDescription>
            </Alert>
          ) : null}
          <div className="flex flex-col gap-2">
            {structureActions.map((action) => (
              <ToolbarActionButton
                key={action.key}
                label={action.label}
                icon={action.icon}
                onClick={action.onClick}
                disabled={action.disabled}
                destructive={action.destructive}
              />
            ))}
          </div>
        </section>
      </CardContent>
    </Card>
  );
}
