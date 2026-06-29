"use client";

import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";

import { getHomepageMotionCapabilities } from "@/lib/homepage-motion/capabilities";
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
  company,
  className,
  testId,
}: {
  title: string;
  blurb: string;
  company: string;
  className?: string;
  testId: string;
}) {
  return (
    <div className={cn("min-w-0", className)}>
      <article
        data-testid={testId}
        className="rounded-3xl border-2 border-border bg-card p-4 shadow-[5px_5px_0_0] shadow-foreground/50 sm:p-5"
      >
        <h3 className="text-lg font-black tracking-tight text-foreground">{title}</h3>
        <p
          data-testid={`${testId}-blurb`}
          data-field="blurb"
          className="mt-2 text-sm leading-relaxed text-muted-foreground"
        >
          {blurb}
        </p>
      </article>
      <p className="mt-1 font-mono text-[10px] text-muted-foreground">{company}</p>
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

function StaticExperienceDetails({
  entryId,
}: {
  entryId: HomepageWorkExperienceEntryId;
}) {
  const t = useTranslations("home");
  const fields = [
    { key: "period" as const, label: t("experience.fields.period") },
    { key: "role" as const, label: t("experience.fields.role") },
    { key: "scope" as const, label: t("experience.fields.scope") },
  ];

  return (
    <dl className="mt-3 grid gap-3 rounded-2xl border border-border bg-muted/20 p-4 text-sm">
      {fields.map(({ key, label }) => (
        <div key={key}>
          <dt className="font-mono text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
            {label}
          </dt>
          <dd
            data-testid={`work-experience-field-${key}`}
            data-field={key}
            className="mt-1 font-semibold leading-relaxed text-foreground"
          >
            {t(`experience.entries.${entryId}.${key}`)}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export function WorkExperienceScrollStage() {
  const t = useTranslations("home");
  const scopeRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const cardRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const [pathNodes, setPathNodes] = useState<ExperiencePathNode[]>([]);
  const [motionEnabled, setMotionEnabled] = useState(false);

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
        items.push({
          entryId,
          projectId,
          globalIndex,
        });
        globalIndex += 1;
      }
    }
    return items;
  }, []);

  useLayoutEffect(() => {
    const capabilities = getHomepageMotionCapabilities();
    setMotionEnabled(capabilities.animate);

    if (!capabilities.animate) {
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

    return registerHomepageExperienceScroll({
      scope,
      pin,
      path,
      cardRefs: cardRefs.current,
      flatProjects,
      onPathNodes: setPathNodes,
    });
  }, [flatProjects]);

  return (
    <div ref={scopeRef} data-testid="work-experience-timeline" className="relative">
      <section
        ref={pinRef}
        className={cn(
          motionEnabled && "min-h-[calc(100dvh-4rem)]",
          "flex flex-col justify-center",
        )}
      >
        <div className="grid gap-8 md:grid-cols-2 md:items-center md:gap-10">
          <div className="flex justify-center md:justify-start">
            <ExperienceCurveSvg pathRef={pathRef} nodes={pathNodes} yearLabels={yearLabels} />
          </div>

          <div
            className={cn(
              "relative mx-auto w-full max-w-lg md:mx-0",
              motionEnabled
                ? "h-[min(42vh,22rem)] md:h-[min(52vh,28rem)]"
                : "space-y-6",
            )}
          >
            {flatProjects.map(({ entryId, projectId, globalIndex }) => {
              const company = t(`experience.entries.${entryId}.company`);
              const title = t(`experience.entries.${entryId}.projects.${projectId}.title`);
              const blurb = t(`experience.entries.${entryId}.projects.${projectId}.blurb`);
              const testId = `work-experience-project-${projectId}`;

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
                    <ExperienceProjectCard
                      testId={testId}
                      title={title}
                      blurb={blurb}
                      company={company}
                    />
                  </div>
                );
              }

              return (
                <div
                  key={projectId}
                  ref={(node) => {
                    if (node) {
                      cardRefs.current.set(projectId, node);
                    } else {
                      cardRefs.current.delete(projectId);
                    }
                  }}
                  data-timeline-entry={entryId}
                  className="absolute inset-x-0 top-8 will-change-transform"
                >
                  <ExperienceProjectCard
                    testId={testId}
                    title={title}
                    blurb={blurb}
                    company={company}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {!motionEnabled ? (
          <div className="mt-10 space-y-8">
            {homepageWorkExperienceEntryIds.map((entryId) => (
              <div key={entryId} data-testid={`work-experience-entry-${entryId}`} data-timeline-entry={entryId}>
                <StaticExperienceDetails entryId={entryId} />
              </div>
            ))}
          </div>
        ) : (
          <div className="sr-only">
            {homepageWorkExperienceEntryIds.map((entryId) => (
              <div key={entryId} data-testid={`work-experience-entry-${entryId}`} data-timeline-entry={entryId}>
                <StaticExperienceDetails entryId={entryId} />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
