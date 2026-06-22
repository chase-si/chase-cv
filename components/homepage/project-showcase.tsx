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
      <div aria-hidden className="flex h-full min-h-[10rem] flex-col justify-between bg-muted/30 p-4">
        <div className="flex gap-2">
          {["bg-primary", "bg-chart-2", "bg-secondary"].map((tone) => (
            <span key={tone} className={cn("size-8 rounded-lg border border-border", tone)} />
          ))}
        </div>
        <div className="space-y-2 rounded-xl border border-border bg-card p-3 shadow-[3px_3px_0_0] shadow-foreground/70">
          <div className="h-2 w-1/2 rounded-sm bg-muted" />
          <div className="h-8 rounded-md bg-primary/90" />
        </div>
      </div>
    );
  }

  if (id === "magicCursor") {
    return (
      <div
        aria-hidden
        className="relative flex h-full min-h-[10rem] items-center justify-center bg-muted/20"
      >
        <div className="size-24 rounded-2xl border border-dashed border-border bg-card/80" />
        <span className="absolute size-3 rounded-full bg-primary shadow-[0_0_0_8px] shadow-primary/20" />
        <MousePointer2 className="absolute bottom-6 right-8 size-8 text-foreground/70" />
      </div>
    );
  }

  return (
    <div
      aria-hidden
      className="relative flex h-full min-h-[10rem] items-center justify-center gap-3 bg-muted/20 p-6"
    >
      <div className="rounded-lg border border-border bg-card px-3 py-2 text-xs font-medium shadow-sm">
        Node
      </div>
      <div className="h-px w-8 bg-border" />
      <div className="rounded-lg border border-border bg-muted/60 px-3 py-2 text-xs">Child</div>
      <Workflow className="absolute bottom-4 right-4 size-5 text-muted-foreground" />
    </div>
  );
}

export function HomepageProjectShowcase() {
  const t = useTranslations("home");
  const tNav = useTranslations("siteNav");

  return (
    <section
      id="projects"
      aria-label={t("projectsSectionAria")}
      className="scroll-mt-24 space-y-8"
    >
      <h2 className="text-2xl font-semibold tracking-tight">{t("projectsSectionTitle")}</h2>

      <ul className="grid gap-8">
        {homepageProjectShowcaseOrder.map((id) => {
          const nav = navById[id];
          const Icon = projectIcons[id];

          return (
            <li key={id}>
              <article className="overflow-hidden rounded-2xl border border-border bg-card shadow-[4px_4px_0_0] shadow-foreground/90">
                <div className="grid gap-0 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
                  <div className="relative border-b border-border lg:border-b-0 lg:border-r">
                    <ProjectPreviewArt id={id} />
                  </div>

                  <div className="flex flex-col gap-4 p-5 sm:p-6">
                    <div className="flex items-start gap-3">
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-border bg-background text-muted-foreground">
                        <Icon className="size-5" aria-hidden />
                      </span>
                      <div className="min-w-0">
                        <h3 className="text-lg font-semibold tracking-tight">
                          {tNav(`projects.items.${id}.name`)}
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                          {t(`projects.items.${id}.problem`)}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">{t(`projects.items.${id}.tag1`)}</Badge>
                      <Badge variant="outline">{t(`projects.items.${id}.tag2`)}</Badge>
                    </div>

                    <div className="mt-auto pt-2">
                      <Button
                        render={<Link href={nav.href} />}
                        nativeButton={false}
                        className="shadow-[2px_2px_0_0] shadow-foreground/80"
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
