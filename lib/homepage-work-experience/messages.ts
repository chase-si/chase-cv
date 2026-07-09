import type { AppLocale } from "@/i18n/routing";
import {
  homepageWorkExperienceContent,
  type WorkExperienceEntryContent,
  type WorkExperienceLocale,
} from "@/lib/homepage-work-experience/content";

function pick<L extends WorkExperienceLocale, T extends Record<L, unknown>>(
  locale: L,
  value: T,
): T[L] {
  return value[locale];
}

type JsonMessages = Record<string, unknown>;

export function patchHomeMessagesWithWorkExperience<M extends JsonMessages>(
  messages: M,
  locale: AppLocale,
): M {
  const { experienceTitle, experienceDescription, section, entries } =
    homepageWorkExperienceContent;

  const home = (messages.home ?? {}) as Record<string, unknown>;

  const experienceEntries = Object.fromEntries(
    entries.map((entry: WorkExperienceEntryContent) => [
      entry.id,
      {
        yearLabel: pick(locale, entry.yearLabel),
        company: pick(locale, entry.company),
        period: pick(locale, entry.period),
        role: pick(locale, entry.role),
        scope: pick(locale, entry.scope),
        outcomes: [...pick(locale, entry.outcomes)],
        projects: Object.fromEntries(
          entry.projects.map((project) => [
            project.id,
            {
              title: pick(locale, project.title),
              blurb: pick(locale, project.blurb),
              image: project.image,
            },
          ]),
        ),
      },
    ]),
  );

  return {
    ...messages,
    home: {
      ...home,
      experienceTitle: pick(locale, experienceTitle),
      experienceDescription: pick(locale, experienceDescription),
      experience: {
        sectionAria: pick(locale, section.sectionAria),
        supportingLine: pick(locale, section.supportingLine),
        fields: {
          period: pick(locale, section.fields.period),
          role: pick(locale, section.fields.role),
          scope: pick(locale, section.fields.scope),
          outcomes: pick(locale, section.fields.outcomes),
        },
        entries: experienceEntries,
      },
    },
  };
}
