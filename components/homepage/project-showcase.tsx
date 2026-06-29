"use client";

import { ImageIcon, MousePointer2, Workflow } from "lucide-react";
import { useTranslations } from "next-intl";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import {
  homepageProjectShowcaseOrder,
  projectNavigationItems,
  type ProjectId,
} from "@/lib/projects";
import { cn } from "@/lib/utils";

const projectIcons = {
  magicCursor: MousePointer2,
  imageToUi: ImageIcon,
  flowEditor: Workflow,
} satisfies Record<ProjectId, React.ComponentType<React.SVGProps<SVGSVGElement>>>;

const navById = Object.fromEntries(
  projectNavigationItems.map((item) => [item.id, item]),
) as Record<ProjectId, (typeof projectNavigationItems)[number]>;

function ProjectPreviewArt({ id }: { id: ProjectId }) {
  if (id === "imageToUi") {
    return (
      <div aria-hidden className="flex h-full min-h-56 flex-col justify-between overflow-hidden bg-muted/20 p-4 sm:p-5">
        <div className="flex items-center gap-4">
          <div className="flex size-16 shrink-0 items-center justify-center rounded-xl border-2 border-border bg-card text-muted-foreground shadow-[3px_3px_0_0] shadow-foreground/70 sm:size-20">
            <ImageIcon className="size-7 sm:size-8" />
          </div>
          <span className="shrink-0 text-3xl font-black sm:text-4xl">→</span>
          <div className="flex min-w-0 rounded-xl border-2 border-border bg-card p-1 shadow-[3px_3px_0_0] shadow-foreground/70">
            {["bg-foreground", "bg-muted-foreground/60", "bg-primary", "bg-chart-2", "bg-background"].map((tone) => (
              <span key={tone} className={cn("h-10 w-8 border-r border-border last:border-r-0 sm:h-12 sm:w-12", tone)} />
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 rounded-2xl border-2 border-border bg-card p-4 shadow-[4px_4px_0_0] shadow-foreground/80">
          <div className="space-y-3">
            <div className="h-3 w-3/4 rounded-sm bg-muted-foreground/30" />
            <div className="h-9 rounded-md bg-primary" />
          </div>
          <div className="space-y-3">
            <div className="h-3 w-1/2 rounded-sm bg-muted-foreground/30" />
            <div className="flex gap-2">
              <span className="size-4 rounded-full border border-border bg-primary" />
              <span className="size-4 rounded-full border border-border bg-chart-2" />
              <span className="size-4 rounded-full border border-border bg-background" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (id === "magicCursor") {
    return (
      <div
        aria-hidden
        className="relative flex h-full min-h-56 items-center justify-center overflow-hidden bg-muted/20 p-5"
      >
        <div className="absolute left-10 right-10 top-1/2 border-t-2 border-dashed border-primary/70 sm:left-12 sm:right-24" />
        <span className="absolute left-12 top-20 size-4 rounded-full border border-border bg-primary shadow-[0_0_0_14px] shadow-primary/20 sm:left-16" />
        <span className="absolute left-1/2 top-28 size-4 rounded-full border border-border bg-primary" />
        <span className="absolute right-16 top-20 size-4 rounded-full border border-border bg-primary sm:right-44" />
        <div className="absolute bottom-5 left-5 w-48 rounded-xl border-2 border-border bg-card p-3 shadow-[3px_3px_0_0] shadow-foreground/70 sm:w-56">
          {["Magnetic", "Friction", "Size"].map((label, index) => (
            <div key={label} className="mb-2 grid grid-cols-[4rem_1fr] items-center gap-3 last:mb-0">
              <span className="font-mono text-[10px]">{label}</span>
              <span className="relative h-1 rounded-full bg-muted">
                <span
                  className={cn(
                    "absolute top-1/2 size-3 -translate-y-1/2 rounded-full border border-border bg-background",
                    index === 0 && "left-2/3",
                    index === 1 && "left-1/3",
                    index === 2 && "left-1/2",
                  )}
                />
              </span>
            </div>
          ))}
        </div>
        <MousePointer2 className="absolute bottom-10 right-7 size-9 text-foreground sm:right-12 sm:size-10" />
      </div>
    );
  }

  return (
    <div
      aria-hidden
      className="relative flex h-full min-h-56 items-center justify-center overflow-hidden bg-muted/20 p-6"
    >
      <div className="absolute left-4 top-4 flex flex-col gap-2 rounded-xl border-2 border-border bg-card p-2 shadow-[3px_3px_0_0] shadow-foreground/70">
        {["↖", "○", "□", "T"].map((tool) => (
          <span key={tool} className="flex size-7 items-center justify-center rounded-md border border-border font-mono text-xs">
            {tool}
          </span>
        ))}
      </div>
      <div className="ml-8 flex flex-col items-center gap-3 sm:ml-0">
        <span className="rounded-xl border-2 border-border bg-chart-2/70 px-5 py-2 text-xs font-bold shadow-[3px_3px_0_0] shadow-foreground/70">
          Start
        </span>
        <span className="h-8 w-px bg-border" />
        <span className="rounded-xl border-2 border-border bg-primary px-5 py-2 text-xs font-bold text-primary-foreground shadow-[3px_3px_0_0] shadow-foreground/70">
          Check
        </span>
        <div className="grid grid-cols-2 gap-4 sm:gap-10">
          <span className="rounded-xl border-2 border-border bg-card px-5 py-2 text-xs font-bold shadow-[3px_3px_0_0] shadow-foreground/70">
            Action A
          </span>
          <span className="rounded-xl border-2 border-border bg-card px-5 py-2 text-xs font-bold shadow-[3px_3px_0_0] shadow-foreground/70">
            Action B
          </span>
        </div>
      </div>
      <div className="absolute bottom-5 right-4 hidden w-28 rounded-xl border-2 border-border bg-card p-3 font-mono text-[10px] shadow-[3px_3px_0_0] shadow-foreground/70 sm:block">
        <div className="font-bold">Node</div>
        <div className="mt-2 h-2 rounded-sm bg-muted" />
        <div className="mt-2 h-2 w-2/3 rounded-sm bg-muted" />
      </div>
    </div>
  );
}

export function HomepageProjectShowcase() {
  const t = useTranslations("home");
  const tNav = useTranslations("siteNav");

  return (
    <section id="projects" aria-label={t("projectsSectionAria")} className="scroll-mt-24 space-y-6">
      <header className="flex items-center gap-4">
        <span className="size-5 shrink-0 bg-foreground" />
        <h2 className="text-3xl font-black tracking-tight">{t("projectsSectionTitle")}</h2>
        <span className="h-px flex-1 bg-border" />
      </header>

      <ul className="grid gap-6">
        {homepageProjectShowcaseOrder.map((id) => {
          const nav = navById[id];
          const Icon = projectIcons[id];

          return (
            <li key={id}>
              <article className="overflow-hidden rounded-[2rem] border-2 border-border bg-card shadow-[8px_8px_0_0] shadow-foreground">
                <div className="grid gap-0 lg:grid-cols-[minmax(0,0.86fr)_minmax(0,1fr)]">
                  <div className="relative border-b-2 border-border lg:border-b-0 lg:border-r-2">
                    <ProjectPreviewArt id={id} />
                  </div>

                  <div className="flex flex-col gap-5 p-6 sm:p-8">
                    <div className="flex items-start gap-3">
                      <span className="flex size-11 shrink-0 items-center justify-center rounded-full border-2 border-border bg-background text-muted-foreground">
                        <Icon className="size-5" aria-hidden />
                      </span>
                      <div className="min-w-0">
                        <h3 className="font-mono text-3xl font-black tracking-tight">
                          {tNav(`projects.items.${id}.name`)}
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                          {t(`projects.items.${id}.problem`)}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="rounded-md border-border font-mono shadow-[2px_2px_0_0] shadow-foreground/60">
                        {t(`projects.items.${id}.tag1`)}
                      </Badge>
                      <Badge variant="outline" className="rounded-md border-border font-mono shadow-[2px_2px_0_0] shadow-foreground/60">
                        {t(`projects.items.${id}.tag2`)}
                      </Badge>
                    </div>

                    <div className="mt-auto pt-2">
                      <Button
                        render={<Link href={nav.href} />}
                        nativeButton={false}
                        className="min-w-32 rounded-xl shadow-[4px_4px_0_0] shadow-foreground/90"
                      >
                        {t(`projects.items.${id}.entry`)}
                      </Button>
                    </div>
                  </div>
                </div>
              </article>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
