"use client";

import { GitFork, ImageIcon, MousePointer2, Workflow } from "lucide-react";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";

export function HomepageHeroWorkbenchPreview() {
  const t = useTranslations("home");

  return (
    <div
      aria-label={t("workbenchLabel")}
      className="relative overflow-hidden rounded-2xl border border-border bg-card p-4 shadow-[4px_4px_0_0] shadow-foreground/90 sm:p-5"
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <WorkbenchCursorPane />
        <WorkbenchPalettePane />
        <WorkbenchFlowPane className="sm:col-span-2" />
      </div>
    </div>
  );
}

function WorkbenchCursorPane() {
  return (
    <div
      aria-hidden
      className="relative min-h-[7.5rem] overflow-hidden rounded-xl border border-border bg-background p-3"
    >
      <div className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
        Cursor
      </div>
      <div className="relative mt-6 h-16 rounded-lg border border-dashed border-border bg-muted/40">
        <span className="absolute left-3 top-3 size-2 rounded-full bg-primary shadow-[0_0_0_6px] shadow-primary/25" />
        <span className="absolute left-8 top-8 size-6 rounded-md border border-border bg-card shadow-sm" />
        <MousePointer2 className="absolute bottom-2 right-3 size-5 text-foreground/80" />
      </div>
    </div>
  );
}

function WorkbenchPalettePane() {
  return (
    <div
      aria-hidden
      className="relative min-h-[7.5rem] overflow-hidden rounded-xl border border-border bg-background p-3"
    >
      <div className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
        Palette → UI
      </div>
      <div className="mt-3 flex gap-1.5">
        {["bg-primary", "bg-chart-2", "bg-muted-foreground/40"].map((swatch) => (
          <span key={swatch} className={cn("size-5 rounded-md border border-border", swatch)} />
        ))}
      </div>
      <div className="mt-3 space-y-1.5 rounded-lg border border-border bg-card p-2">
        <div className="h-2 w-2/3 rounded-sm bg-muted" />
        <div className="h-6 w-full rounded-md bg-primary/90" />
        <div className="flex gap-1">
          <div className="h-4 flex-1 rounded-sm border border-border bg-background" />
          <div className="h-4 w-10 rounded-sm bg-chart-2/80" />
        </div>
      </div>
      <ImageIcon className="absolute bottom-2 right-3 size-4 text-muted-foreground" />
    </div>
  );
}

function WorkbenchFlowPane({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "relative min-h-[5.5rem] overflow-hidden rounded-xl border border-border bg-background p-3",
        className,
      )}
    >
      <div className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
        Flow tree
      </div>
      <div className="mt-3 flex items-center gap-2 text-[10px] text-muted-foreground">
        <span className="rounded-md border border-border bg-card px-2 py-1 font-medium text-foreground">
          Root
        </span>
        <GitFork className="size-3.5 shrink-0" />
        <span className="rounded-md border border-border bg-muted/50 px-2 py-1">Branch</span>
        <span className="rounded-md border border-border bg-muted/50 px-2 py-1">Leaf</span>
        <Workflow className="ml-auto size-4 text-muted-foreground" />
      </div>
    </div>
  );
}
