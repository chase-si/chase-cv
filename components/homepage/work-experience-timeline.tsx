"use client";

import { useTranslations } from "next-intl";

import {
  homepageWorkExperienceEntryIds,
  type HomepageWorkExperienceEntryId,
} from "@/lib/homepage-work-experience";
import { cn } from "@/lib/utils";

function TimelineEntry({ entryId }: { entryId: HomepageWorkExperienceEntryId }) {
  const t = useTranslations("home");
  const outcomes = t.raw(`experience.entries.${entryId}.outcomes`) as string[];

  const fields = [
    { key: "period" as const, label: t("experience.fields.period") },
    { key: "role" as const, label: t("experience.fields.role") },
    { key: "scope" as const, label: t("experience.fields.scope") },
  ];

  return (
    <li
      data-testid={`work-experience-entry-${entryId}`}
      data-timeline-entry={entryId}
      className="relative"
    >
      <span
        aria-hidden
        className="absolute -left-[calc(0.625rem+1px)] top-5 size-3 rounded-full border-2 border-border bg-background shadow-[2px_2px_0_0] shadow-foreground/80 sm:-left-[calc(0.75rem+1px)]"
      />

      <article className="min-w-0 rounded-2xl border border-border bg-card p-5 shadow-[4px_4px_0_0] shadow-foreground/90 sm:p-6">
        <dl className="space-y-4">
          {fields.map(({ key, label }) => (
            <div key={key} className="min-w-0">
              <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {label}
              </dt>
              <dd
                data-testid={`work-experience-field-${key}`}
                data-field={key}
                className="mt-1 text-sm leading-relaxed text-foreground break-words"
              >
                {t(`experience.entries.${entryId}.${key}`)}
              </dd>
            </div>
          ))}

          <div className="min-w-0">
            <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {t("experience.fields.outcomes")}
            </dt>
            <dd className="mt-1">
              <ul
                data-testid="work-experience-field-outcomes"
                data-field="outcomes"
                className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground"
              >
                {outcomes.map((outcome) => (
                  <li key={outcome} className="break-words">
                    {outcome}
                  </li>
                ))}
              </ul>
            </dd>
          </div>
        </dl>
      </article>
    </li>
  );
}

export function HomepageWorkExperienceTimeline() {
  const t = useTranslations("home");

  return (
    <section
      id="experience"
      aria-label={t("experience.sectionAria")}
      className={cn("scroll-mt-24 space-y-6")}
    >
      <header className="space-y-3">
        <h2 className="text-2xl font-semibold tracking-tight">{t("experienceTitle")}</h2>
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
          {t("experienceDescription")}
        </p>
        <p className="max-w-2xl text-sm leading-relaxed text-foreground">
          {t("experience.supportingLine")}
        </p>
      </header>

      <ol
        data-testid="work-experience-timeline"
        className="relative space-y-8 border-l-2 border-border pl-6 sm:pl-8"
      >
        {homepageWorkExperienceEntryIds.map((entryId) => (
          <TimelineEntry key={entryId} entryId={entryId} />
        ))}
      </ol>
    </section>
  );
}
