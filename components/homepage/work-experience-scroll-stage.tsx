"use client";

import Image from "next/image";
import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";

import { Card, CardContent } from "@/components/ui/card";
import { useHomepageMotionCapabilities } from "@/hooks/use-homepage-motion-capabilities";
import {
  HOMEPAGE_EXPERIENCE_S_PATH,
  measureExperiencePathNodes,
  registerHomepageExperienceScroll,
  setExperiencePathFullyDrawn,
  stackPoseForExperienceCard,
  type ExperiencePathNode,
  type FlatExperienceProject,
} from "@/lib/homepage-motion/experience-scroll";
import {
  homepageWorkExperienceEntryIds,
  homepageWorkExperienceProjectIds,
  type HomepageWorkExperienceEntryId,
} from "@/lib/homepage-work-experience";
import { cn } from "@/lib/utils";

function ExperienceProjectCard({
  title,
  blurb,
  imageSrc,
  company,
  testId,
  containImage,
}: {
  title: string;
  blurb: string;
  imageSrc: string;
  company: string;
  testId: string;
  containImage: boolean;
}) {
  return (
    <div className="min-w-0">
      <Card
        data-testid={testId}
        className="gap-0 overflow-hidden rounded-[2rem] border-2 py-0 shadow-[8px_8px_0_0] shadow-foreground/45"
      >
        <div className="relative aspect-16/10 w-full border-b-2 border-border bg-muted/30">
          <Image
            src={imageSrc}
            alt=""
            fill
            data-testid={`${testId}-image`}
            className={cn(
              "object-center",
              containImage ? "object-contain p-3 sm:p-4" : "object-cover",
            )}
            sizes="(max-width: 768px) 100vw, 32rem"
          />
          <span className="absolute top-3 left-3 rounded-full border border-border bg-background/90 px-3 py-1 font-mono text-[10px] font-bold backdrop-blur">
            {company}
          </span>
        </div>
        <CardContent className="p-5 sm:p-6">
          <h3 className="text-xl font-black tracking-tight text-foreground">{title}</h3>
          <p
            data-testid={`${testId}-blurb`}
            data-field="blurb"
            className="mt-2 text-sm leading-relaxed text-muted-foreground"
          >
            {blurb}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function ExperienceCurveSvg({
  pathRef,
  nodes,
  yearLabels,
}: {
  pathRef: React.RefObject<SVGPathElement | null>;
  nodes: ExperiencePathNode[];
  yearLabels: string[];
}) {
  return (
    <svg
      viewBox="0 0 240 648"
      className="h-[min(52vh,36rem)] w-full max-w-xs shrink-0"
      aria-hidden
    >
      <path
        ref={pathRef}
        d={HOMEPAGE_EXPERIENCE_S_PATH}
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        className="text-border"
      />
      {yearLabels.map((label, index) => {
        const point = nodes[index];
        if (!point) {
          return null;
        }
        const labelOnLeft = point.x < 120;
        return (
          <g key={label}>
            <circle
              cx={point.x}
              cy={point.y}
              r="10"
              className="fill-background stroke-border"
              strokeWidth="2"
            />
            <text
              x={labelOnLeft ? point.x + 22 : point.x - 22}
              y={point.y + 4}
              className="fill-foreground text-[11px] font-black"
              textAnchor={labelOnLeft ? "start" : "end"}
            >
              {label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function ExperienceEntryDetails({
  entryId,
  index,
}: {
  entryId: HomepageWorkExperienceEntryId;
  index: number;
}) {
  const t = useTranslations("home");
  const fields = [
    { key: "period" as const, label: t("experience.fields.period") },
    { key: "role" as const, label: t("experience.fields.role") },
    { key: "scope" as const, label: t("experience.fields.scope") },
  ];

  return (
    <article
      data-testid={`work-experience-entry-${entryId}`}
      data-timeline-entry={entryId}
      className="min-w-0 border-l-2 border-border pl-4"
    >
      <div className="flex items-baseline justify-between gap-3">
        <p className="truncate text-base font-black tracking-tight">
          {t(`experience.entries.${entryId}.company`)}
        </p>
        <span className="font-mono text-[10px] text-muted-foreground">0{index + 1}</span>
      </div>
      <dl className="mt-3 space-y-3">
        {fields.map(({ key, label }) => (
          <div key={key} className={cn(key === "scope" && "lg:hidden")}>
            <dt className="font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
              {label}
            </dt>
            <dd
              data-testid={`work-experience-field-${key}`}
              data-field={key}
              className={cn(
                "mt-1 font-semibold text-foreground",
                key === "scope" ? "text-xs leading-relaxed" : "text-sm",
              )}
            >
              {t(`experience.entries.${entryId}.${key}`)}
            </dd>
          </div>
        ))}
      </dl>
    </article>
  );
}

function ExperienceIndex() {
  return (
    <div className="space-y-4">
      {homepageWorkExperienceEntryIds.map((entryId, index) => (
        <ExperienceEntryDetails key={entryId} entryId={entryId} index={index} />
      ))}
    </div>
  );
}

/**
 * Editorial archive layout selected from the homepage work-experience exploration:
 * it keeps career context, the drawn timeline, and project evidence visible together.
 */
export function WorkExperienceScrollStage() {
  const t = useTranslations("home");
  const scopeRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const [pathNodes, setPathNodes] = useState<ExperiencePathNode[]>([]);
  const { animate: motionEnabled } = useHomepageMotionCapabilities();

  const yearLabels = useMemo(
    () =>
      homepageWorkExperienceEntryIds.map((entryId) =>
        t(`experience.entries.${entryId}.yearLabel`),
      ),
    [t],
  );

  const flatProjects = useMemo(() => {
    const items: FlatExperienceProject[] = [];
    let globalIndex = 0;
    for (const entryId of homepageWorkExperienceEntryIds) {
      for (const projectId of homepageWorkExperienceProjectIds[entryId]) {
        items.push({ entryId, projectId, globalIndex });
        globalIndex += 1;
      }
    }
    return items;
  }, []);

  useLayoutEffect(() => {
    if (!motionEnabled) {
      const path = pathRef.current;
      if (path) {
        setExperiencePathFullyDrawn(path);
        setPathNodes(measureExperiencePathNodes(path));
      }
      return;
    }

    const scope = scopeRef.current;
    const pin = pinRef.current;
    const path = pathRef.current;
    if (!scope || !pin || !path) {
      return;
    }

    const projectCards = new Map<string, HTMLDivElement>();
    scope.querySelectorAll<HTMLDivElement>("[data-experience-project]").forEach((node) => {
      const projectId = node.dataset.experienceProject;
      if (projectId) {
        projectCards.set(projectId, node);
      }
    });

    return registerHomepageExperienceScroll({
      scope,
      pin,
      path,
      cardRefs: projectCards,
      flatProjects,
      onPathNodes: setPathNodes,
    });
  }, [flatProjects, motionEnabled]);

  const cards = flatProjects.map(({ entryId, projectId, globalIndex }) => {
    const card = (
      <ExperienceProjectCard
        testId={`work-experience-project-${projectId}`}
        title={t(`experience.entries.${entryId}.projects.${projectId}.title`)}
        blurb={t(`experience.entries.${entryId}.projects.${projectId}.blurb`)}
        imageSrc={t(`experience.entries.${entryId}.projects.${projectId}.image`)}
        company={t(`experience.entries.${entryId}.company`)}
        containImage={projectId === "aladia-mobile"}
      />
    );

    if (!motionEnabled) {
      const pose = stackPoseForExperienceCard(projectId);
      return (
        <div
          key={projectId}
          className="relative"
          style={{
            transform: `translate(${pose.x}px, ${pose.y}px) rotate(${pose.rotation}deg)`,
            zIndex: 10 + globalIndex,
          }}
        >
          {card}
        </div>
      );
    }

    return (
      <div
        key={projectId}
        data-experience-project={projectId}
        data-timeline-entry={entryId}
        className="absolute inset-x-0 top-1/2 -translate-y-1/2 will-change-transform"
      >
        {card}
      </div>
    );
  });

  return (
    <div ref={scopeRef} data-testid="work-experience-timeline" className="relative">
      <section
        ref={pinRef}
        className={cn(
          "flex flex-col justify-center",
          motionEnabled && "min-h-[calc(100dvh-4rem)]",
        )}
      >
        <Card className="gap-0 rounded-[2rem] border-2 py-0 shadow-[10px_10px_0_0] shadow-foreground/45">
          <div className="grid min-h-0 lg:grid-cols-[minmax(14rem,0.65fr)_minmax(9rem,0.45fr)_minmax(0,1.35fr)]">
            <aside className="order-2 border-t-2 border-border bg-muted/15 p-5 lg:order-1 lg:border-t-0 lg:border-r-2 lg:p-7">
              <p className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-primary">
                2018 — 2026
              </p>
              <p className="mt-3 text-2xl font-black tracking-[-0.04em]">
                {t("experience.archiveStatement")}
              </p>
              <div className="mt-8">
                <ExperienceIndex />
              </div>
            </aside>

            <div className="order-1 hidden items-center justify-center border-r-2 border-border bg-background lg:flex">
              <ExperienceCurveSvg
                pathRef={pathRef}
                nodes={pathNodes}
                yearLabels={yearLabels}
              />
            </div>

            <div className="order-3 p-4 sm:p-7">
              <p className="relative z-40 mb-5 inline-flex min-h-7 items-center rounded-full border border-border bg-background/90 px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-foreground shadow-xs backdrop-blur">
                {t("experience.projectEvidenceLabel")}
              </p>
              <div
                className={cn(
                  "relative mx-auto w-full max-w-2xl",
                  motionEnabled ? "h-[min(52vh,30rem)]" : "space-y-6",
                )}
              >
                {cards}
              </div>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}
