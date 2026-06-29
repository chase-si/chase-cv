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
        "overflow-auto overscroll-contain rounded-2xl border border-border bg-muted/20 p-4 shadow-inner [scrollbar-color:var(--muted-foreground)_transparent] [scrollbar-gutter:stable_both-edges] [scrollbar-width:thin] [&::-webkit-scrollbar]:size-2.5 [&::-webkit-scrollbar-corner]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:border-2 [&::-webkit-scrollbar-thumb]:border-transparent [&::-webkit-scrollbar-thumb]:bg-muted-foreground/50 [&::-webkit-scrollbar-thumb]:bg-clip-padding [&::-webkit-scrollbar-thumb:hover]:bg-muted-foreground/80 [&::-webkit-scrollbar-track]:bg-transparent",
        className,
      )}
    >
      <FlowRenderSvg datas={datas} {...renderProps} />
    </div>
  );
}
