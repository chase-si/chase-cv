"use client";

import { ImageIcon, Menu, MousePointer2, ScanLine } from "lucide-react";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";

export function HomepageHeroWorkbenchPreview() {
  const t = useTranslations("home");

  return (
    <div
      aria-label={t("workbenchLabel")}
      className="relative overflow-hidden rounded-4xl border-2 border-border bg-card shadow-[8px_8px_0_0] shadow-foreground/50"
    >
      <div className="flex items-center justify-between border-b-2 border-border px-5 py-3">
        <div className="font-mono text-xs font-bold uppercase tracking-wide">Workbench</div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase">
            <span className="size-2 rounded-full border border-border bg-chart-2" />
            Online
          </span>
          <Menu className="size-4" aria-hidden />
        </div>
      </div>
      <div className="grid gap-3 p-4 sm:grid-cols-[minmax(0,1fr)_minmax(10rem,0.58fr)] sm:p-5">
        <div className="grid gap-3">
          <WorkbenchCursorPane />
          <WorkbenchPalettePane />
        </div>
        <WorkbenchScannerPane />
      </div>
      <div className="flex items-center gap-4 border-t-2 border-border px-5 py-3 font-mono text-xs font-bold uppercase">
        <span>Build</span>
        <span aria-hidden>•</span>
        <span>Debug</span>
        <span aria-hidden>•</span>
        <span>Iterate</span>
        <span className="ml-auto rounded-md border border-border bg-chart-2/60 px-2 py-1 text-[10px]">
          Ready
        </span>
      </div>
    </div>
  );
}

function WorkbenchCursorPane() {
  return (
    <div aria-hidden className="relative min-h-36 overflow-hidden rounded-2xl border-2 border-border bg-background p-4">
      <div className="font-mono text-[10px] font-bold uppercase tracking-wide">
        Magic Cursor
      </div>
      <div className="relative mt-5 h-20 rounded-2xl border-2 border-border bg-card">
        <div className="absolute left-6 right-14 top-1/2 h-px -translate-y-1/2 border-t-2 border-dashed border-primary/70" />
        <span className="absolute left-5 top-8 size-3 rounded-full border border-border bg-primary shadow-[0_0_0_10px] shadow-primary/20" />
        <span className="absolute left-28 top-12 size-3 rounded-full border border-border bg-primary" />
        <span className="absolute right-20 top-6 size-3 rounded-full border border-border bg-primary" />
        <MousePointer2 className="absolute bottom-4 right-5 size-8 text-foreground" />
      </div>
    </div>
  );
}

function WorkbenchPalettePane() {
  return (
    <div aria-hidden className="relative min-h-44 overflow-hidden rounded-2xl border-2 border-border bg-background p-4">
      <div className="font-mono text-[10px] font-bold uppercase tracking-wide">
        Image to UI
      </div>
      <div className="mt-4 flex items-center gap-3">
        <div className="flex size-14 items-center justify-center rounded-lg border-2 border-border bg-muted text-muted-foreground">
          <ImageIcon className="size-6" />
        </div>
        <span className="text-2xl font-black">→</span>
        <div className="flex rounded-lg border-2 border-border bg-card p-1">
          {["bg-foreground", "bg-secondary", "bg-primary", "bg-chart-2", "bg-background"].map((swatch) => (
            <span key={swatch} className={cn("h-7 w-9 border-r border-border last:border-r-0", swatch)} />
          ))}
        </div>
      </div>
      <div className="mt-4 rounded-xl border-2 border-border bg-card p-3">
        <div className="h-2 w-1/3 rounded-sm bg-muted-foreground/30" />
        <div className="mt-3 grid grid-cols-[1fr_4rem] gap-3">
          <div className="h-8 rounded-md border border-border bg-background" />
          <div className="h-8 rounded-md bg-primary" />
        </div>
        <div className="mt-3 flex gap-2">
          <div className="h-3 flex-1 rounded-sm bg-muted" />
          <div className="h-3 w-12 rounded-sm bg-chart-2" />
        </div>
      </div>
    </div>
  );
}

function WorkbenchScannerPane() {
  return (
    <div aria-hidden className="relative min-h-full overflow-hidden rounded-2xl border-2 border-border bg-background p-4">
      <div className="font-mono text-[10px] font-bold uppercase tracking-wide">
        Dudu Scanner
      </div>
      <div className="relative mt-5 flex min-h-64 flex-col justify-between gap-5">
        <div className="relative mx-auto flex size-36 items-center justify-center">
          <span className="absolute inset-0 rounded-full border-2 border-dashed border-primary/70" />
          <span className="size-14 rounded-full border border-border bg-primary shadow-[0_0_0_14px] shadow-primary/20" />
          <ScanLine className="absolute size-7 text-primary-foreground" />
        </div>
        <div className="rounded-xl border-2 border-border bg-card p-3 shadow-[3px_3px_0_0] shadow-foreground/50">
          {["Signal", "Lock", "Tip"].map((label, index) => (
            <div key={label} className="mb-2 grid grid-cols-[3.5rem_1fr] items-center gap-3 last:mb-0">
              <span className="font-mono text-[10px]">{label}</span>
              <span className="relative h-1 rounded-full bg-muted">
                <span
                  className={cn(
                    "absolute top-1/2 size-3 -translate-y-1/2 rounded-full border border-border bg-background",
                    index === 0 && "left-2/3",
                    index === 1 && "left-1/2",
                    index === 2 && "left-1/3",
                  )}
                />
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
