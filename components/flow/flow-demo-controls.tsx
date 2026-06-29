"use client";

import { RotateCcw } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

export type FlowDemoControlsProps = {
  runningHighlight: boolean;
  onRunningHighlightChange: (enabled: boolean) => void;
  onReset: () => void;
  dirty?: boolean;
  className?: string;
};

export function FlowDemoControls({
  runningHighlight,
  onRunningHighlightChange,
  onReset,
  dirty = false,
  className,
}: FlowDemoControlsProps) {
  return (
    <div
      data-testid="flow-demo-controls"
      className={cn(
        "flex flex-wrap items-center justify-end gap-3 border border-border bg-card p-3 shadow-sm",
        className,
      )}
    >
      {dirty ? <Badge variant="secondary">已修改</Badge> : null}
      <Button
        type="button"
        variant="outline"
        size="sm"
        data-testid="flow-demo-reset"
        onClick={onReset}
      >
        <RotateCcw aria-hidden />
        重置示例
      </Button>
      <div className="flex items-center gap-2">
        <Switch
          id="flow-demo-running-highlight"
          data-testid="flow-demo-running-highlight"
          checked={runningHighlight}
          onCheckedChange={onRunningHighlightChange}
          aria-label="运行态高亮"
        />
        <Label htmlFor="flow-demo-running-highlight" className="text-sm font-normal">
          运行态高亮
        </Label>
      </div>
    </div>
  );
}
