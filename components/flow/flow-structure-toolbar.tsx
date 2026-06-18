"use client";

import type { ReactNode } from "react";
import {
  GitBranchPlus,
  ListPlus,
  Maximize2,
  Minus,
  Plus,
  Split,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatFlowZoomPercent } from "@/lib/flow/flow-zoom";
import type { getFlowToolbarCapabilities } from "@/lib/flow/flow-structure-mutations";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
  className?: string;
};

type ToolbarAction = {
  key: string;
  label: string;
  icon: ReactNode;
  onClick: () => void;
  disabled?: boolean;
  destructive?: boolean;
  dividerBefore?: boolean;
};

function ToolbarIconButton({
  label,
  icon,
  onClick,
  disabled,
  destructive,
}: Pick<ToolbarAction, "label" | "icon" | "onClick" | "disabled" | "destructive">) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            type="button"
            variant={destructive ? "destructive" : "outline"}
            size="icon-sm"
            className="size-9 rounded-xl"
            aria-label={label}
            disabled={disabled}
            onClick={onClick}
          />
        }
      >
        {icon}
      </TooltipTrigger>
      <TooltipContent side="right">{label}</TooltipContent>
    </Tooltip>
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
  className,
}: FlowStructureToolbarProps) {
  const structureActions: ToolbarAction[] = [
    {
      key: "zoom-in",
      label: "放大",
      icon: <Plus aria-hidden />,
      onClick: onZoomIn,
    },
    {
      key: "zoom-out",
      label: "缩小",
      icon: <Minus aria-hidden />,
      onClick: onZoomOut,
    },
    {
      key: "zoom-reset",
      label: "正常",
      icon: <Maximize2 aria-hidden />,
      onClick: onZoomReset,
      dividerBefore: true,
    },
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
      dividerBefore: true,
    },
    {
      key: "delete",
      label: "删除",
      icon: <Trash2 aria-hidden />,
      onClick: onDelete,
      disabled: !capabilities.canDelete,
      destructive: true,
    },
  ];

  return (
    <TooltipProvider>
      <Card className={cn("h-full shadow-sm", className)}>
        <CardHeader className="border-b border-border py-3">
          <CardTitle className="text-xs font-medium text-muted-foreground">
            工具
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-2 py-4">
          {structureActions.map((action) => (
            <div key={action.key} className="flex w-full flex-col items-center gap-2">
              {action.dividerBefore ? (
                <div className="h-px w-full bg-border" aria-hidden />
              ) : null}
              <ToolbarIconButton
                label={action.label}
                icon={action.icon}
                onClick={action.onClick}
                disabled={action.disabled}
                destructive={action.destructive}
              />
            </div>
          ))}
          <p
            data-testid="flow-toolbar-zoom-label"
            className="mt-2 text-center text-xs tabular-nums text-muted-foreground"
          >
            {formatFlowZoomPercent(zoom)}
          </p>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
