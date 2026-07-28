"use client";

import type { FlowRoot } from "@/lib/flow/types";
import { FlowRenderSvg, type FlowRenderSvgProps } from "@/components/flow/flow-render-svg";
import { Card, CardScrollArea } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const flowReadOnlyScrollClassName =
  "h-full p-4";

export type FlowReadOnlySurfaceProps = {
  datas: FlowRoot;
  className?: string;
} & Omit<FlowRenderSvgProps, "datas">;

export function FlowReadOnlySurface({
  datas,
  className,
  ...renderProps
}: FlowReadOnlySurfaceProps) {
  return (
    <Card
      data-testid="flow-read-only-surface"
      className={cn(
        "gap-0 bg-muted/20 p-0 shadow-inner",
        className,
      )}
    >
      <CardScrollArea className={flowReadOnlyScrollClassName}>
        <FlowRenderSvg datas={datas} {...renderProps} />
      </CardScrollArea>
    </Card>
  );
}
