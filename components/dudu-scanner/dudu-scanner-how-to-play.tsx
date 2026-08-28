"use client";

import {
  Activity,
  CircleDot,
  MousePointer2,
  ScanLine,
  Sparkles,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const TUTORIAL_PHASE_COUNT = 3;
const TUTORIAL_PHASE_DURATION_MS = 1800;

function SceneLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="absolute left-2 top-2 z-20 rounded-full border border-primary/30 bg-background/90 px-2 py-0.5 text-[9px] font-bold text-primary shadow-xs">
      {children}
    </div>
  );
}

function ScannerProbe({ active }: { active: boolean }) {
  return (
    <div className="flex items-center" aria-hidden>
      <div
        className={cn(
          "flex h-9 w-5 items-center justify-center rounded-full border-2 bg-card shadow-sm transition-colors duration-500",
          active ? "border-primary text-primary" : "border-muted-foreground text-muted-foreground",
        )}
      >
        <ScanLine className="size-3" />
      </div>
      <span className="h-1 w-3 rounded-full bg-muted-foreground/60" />
    </div>
  );
}

export function DuduScannerHowToPlay({ customMode = false }: { customMode?: boolean }) {
  const t = useTranslations("duduScanner.howToPlay");
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const timer = window.setInterval(() => {
      setPhase((current) => (current + 1) % TUTORIAL_PHASE_COUNT);
    }, TUTORIAL_PHASE_DURATION_MS);

    return () => window.clearInterval(timer);
  }, []);

  const stepLabels = customMode
    ? [t("custom.steps.hide"), t("custom.steps.scan"), t("custom.steps.guess")]
    : [t("steps.move"), t("steps.scan"), t("steps.watch")];

  return (
    <Card
      size="sm"
      className="h-auto min-h-0 gap-3 border-primary/40 py-3 lg:gap-2 lg:py-2"
      data-testid="dudu-scanner-how-to-play"
    >
      <CardHeader className="grid-cols-[1fr_auto] items-center gap-3 border-b border-border px-4 pb-3 lg:pb-2">
        <div className="min-w-0">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold">
            <ScanLine className="size-4 text-primary" aria-hidden />
            {customMode ? t("custom.title") : t("title")}
          </CardTitle>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {customMode ? t("custom.description") : t("description")}
          </p>
        </div>
        <span className="rounded-full border border-primary/30 bg-primary/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary">
          {t("demoLabel")}
        </span>
      </CardHeader>

      <CardContent className="flex min-h-0 flex-1 flex-col justify-center gap-3 px-4 lg:gap-2">
        <div
          className="mx-auto grid aspect-[16/10] h-auto w-full min-h-56 max-h-72 shrink-0 grid-cols-[minmax(0,1.35fr)_minmax(5.5rem,0.65fr)] items-stretch gap-2"
          role="img"
          aria-label={
            customMode ? t("custom.accessibleDescription") : t("accessibleDescription")
          }
        >
          <div className="relative min-h-0 min-w-0 overflow-hidden rounded-sm border border-border bg-muted/35">
            <SceneLabel>{t("bellyArea")}</SceneLabel>

            <div className="absolute inset-2 flex items-center justify-center" aria-hidden>
              <div className="relative h-full w-[78%] max-w-52">
                <div className="absolute left-1/2 top-0 size-10 -translate-x-1/2 rounded-full border border-border bg-muted" />
                <div className="absolute inset-x-0 bottom-0 top-[18%] rounded-[46%_46%_38%_38%] border-2 border-border bg-card shadow-inner" />
                <div className="absolute inset-x-[10%] bottom-[6%] top-[32%] rounded-[50%] border border-border bg-muted/40" />
                <CircleDot className="absolute left-1/2 top-[58%] size-3 -translate-x-1/2 text-muted-foreground" />
                <span
                  className={cn(
                    "absolute left-1/2 top-[50%] size-12 -translate-x-1/2 rounded-full border-2 border-dashed transition-[border-color,background-color,transform] duration-500",
                    phase === 1
                      ? "scale-110 border-primary bg-primary/15"
                      : "border-primary/50 bg-primary/5",
                  )}
                />
                <span className="absolute left-1/2 top-[34%] -translate-x-1/2 whitespace-nowrap rounded-full bg-primary px-2 py-0.5 text-[8px] font-bold text-primary-foreground">
                  {t("scanHere")}
                </span>
              </div>
            </div>

            <div
              className={cn(
                "absolute left-1/2 top-1/2 z-30 flex transition-transform duration-700 ease-in-out motion-reduce:transition-none",
                phase === 0
                  ? "-translate-x-28 translate-y-7 rotate-12"
                  : "-translate-x-10 translate-y-2 -rotate-6",
              )}
              aria-hidden
            >
              <ScannerProbe active={phase > 0} />
              <MousePointer2 className="-ml-2 mt-7 size-4 fill-foreground text-background drop-shadow-sm" />
            </div>

            {phase === 1 ? (
              <span className="absolute left-1/2 top-[56%] size-12 -translate-x-1/2 animate-ping rounded-full border border-primary motion-reduce:animate-none" aria-hidden />
            ) : null}
          </div>

          <div className="relative flex min-h-0 min-w-0 flex-col overflow-hidden rounded-sm border border-border bg-card p-2 pt-8">
            <SceneLabel>{t("screen")}</SceneLabel>
            <span
              className={cn(
                "absolute right-2 top-2.5 z-20 size-1.5 rounded-full transition-colors duration-500",
                phase === 2 ? "bg-chart-2" : "bg-muted-foreground/40",
              )}
              aria-hidden
            />

            <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden rounded-lg border border-primary/30 bg-primary/5">
              <span className="absolute size-14 rounded-full border border-primary/15" aria-hidden />
              <span className="absolute size-9 rounded-full border border-primary/25" aria-hidden />
              <span
                className={cn(
                  "absolute h-px w-full bg-primary/40 transition-transform duration-700 ease-in-out motion-reduce:transition-none",
                  phase === 2 ? "translate-y-5" : "-translate-y-5",
                )}
                aria-hidden
              />
              <Sparkles
                className={cn(
                  "size-6 text-primary transition-[transform,opacity] duration-700 motion-reduce:transition-none",
                  phase === 2 ? "scale-100 opacity-100" : "scale-75 opacity-15",
                )}
                aria-hidden
              />
            </div>

            <div className="mt-1.5 flex min-w-0 items-center gap-1 text-[9px] font-semibold text-muted-foreground" aria-hidden>
              <Activity className="size-3 shrink-0 text-primary" />
              <span className="truncate">{phase === 2 ? t("signalFound") : t("searching")}</span>
            </div>
          </div>
        </div>

        <ol className="grid grid-cols-3 gap-1.5" aria-label={t("stepsLabel")}>
          {stepLabels.map((label, index) => (
            <li
              key={label}
              className={cn(
                "flex min-w-0 items-center gap-1.5 rounded-lg border px-2 py-1.5 text-[10px] font-medium transition-colors duration-300",
                phase === index
                  ? "border-primary/50 bg-primary/10 text-foreground"
                  : "border-transparent bg-muted/35 text-muted-foreground",
              )}
              aria-current={phase === index ? "step" : undefined}
            >
              <span
                className={cn(
                  "flex size-4 shrink-0 items-center justify-center rounded-full text-[9px] font-bold",
                  phase === index
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground",
                )}
              >
                {index + 1}
              </span>
              <span className="truncate">{label}</span>
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  );
}
