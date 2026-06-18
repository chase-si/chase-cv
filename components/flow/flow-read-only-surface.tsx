"use client";

import type { FlowRoot } from "@/lib/flow/types";
import { FlowRenderSvg, type FlowRenderSvgProps } from "@/components/flow/flow-render-svg";
import { cn } from "@/lib/utils";

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
    <div
      data-testid="flow-read-only-surface"
      className={cn(
        "overflow-auto rounded-2xl border border-border bg-card p-4",
        className,
      )}
    >
      <FlowRenderSvg datas={datas} {...renderProps} />
    </div>
  );
}
