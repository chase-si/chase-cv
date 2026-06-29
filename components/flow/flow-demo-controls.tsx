"use client";

import { RotateCcw } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { defaultFlowUiCopy, type FlowUiCopy } from "@/components/flow/flow-ui-copy";
import { cn } from "@/lib/utils";

export type FlowDemoControlsProps = {
  runningHighlight: boolean;
  onRunningHighlightChange: (enabled: boolean) => void;
  onReset: () => void;
  dirty?: boolean;
  copy?: FlowUiCopy["demo"];
  className?: string;
};

export function FlowDemoControls({
  runningHighlight,
  onRunningHighlightChange,
  onReset,
  dirty = false,
  copy = defaultFlowUiCopy.demo,
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
      {dirty ? <Badge variant="secondary">{copy.dirty}</Badge> : null}
      <Button
        type="button"
        variant="outline"
        size="sm"
        data-testid="flow-demo-reset"
        onClick={onReset}
      >
        <RotateCcw aria-hidden />
        {copy.reset}
      </Button>
      <div className="flex items-center gap-2">
        <Switch
          id="flow-demo-running-highlight"
          data-testid="flow-demo-running-highlight"
          checked={runningHighlight}
          onCheckedChange={onRunningHighlightChange}
          aria-label={copy.runningHighlight}
        />
        <Label htmlFor="flow-demo-running-highlight" className="text-sm font-normal">
          {copy.runningHighlight}
        </Label>
      </div>
    </div>
  );
}
