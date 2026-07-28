import { homepageWorkExperienceContent } from "@/lib/homepage-work-experience/content";

export {
  homepageWorkExperienceContent,
  type LocalizedString,
  type WorkExperienceEntryContent,
  type WorkExperienceProjectContent,
} from "@/lib/homepage-work-experience/content";
export { patchHomeMessagesWithWorkExperience } from "@/lib/homepage-work-experience/messages";

const { entries } = homepageWorkExperienceContent;

type WorkExperienceEntry = (typeof homepageWorkExperienceContent.entries)[number];

export type HomepageWorkExperienceEntryId = WorkExperienceEntry["id"];

export type HomepageWorkExperienceProjectId = WorkExperienceEntry["projects"][number]["id"];

export const homepageWorkExperienceEntryIds: readonly HomepageWorkExperienceEntryId[] =
  entries.map((entry) => entry.id);

export const homepageWorkExperienceProjectIds = (() => {
  const result = {} as Record<
    HomepageWorkExperienceEntryId,
    readonly HomepageWorkExperienceProjectId[]
  >;
  for (const entry of entries) {
    result[entry.id] = entry.projects.map((project) => project.id);
  }
  return result;
})();

export const workExperienceFieldKeys = [
  "period",
  "role",
  "scope",
  "outcomes",
] as const;

export type WorkExperienceFieldKey = (typeof workExperienceFieldKeys)[number];

export const workExperienceProjectFieldKeys = ["title", "blurb", "image"] as const;

export type WorkExperienceProjectFieldKey = (typeof workExperienceProjectFieldKeys)[number];

/** Marker present in placeholder copy until real resume content is supplied. */
export const WORK_EXPERIENCE_PLACEHOLDER_MARKER = "[[placeholder]]";

/** Patterns that must not appear in timeline body copy (fabricated resume details). */
export const fabricatedResumePatterns = [
  /\bat\s+(Google|Meta|Amazon|Microsoft|Apple|ByteDance|Tencent|Alibaba)\b/i,
  /\b(19|20)\d{2}\s*[-–]\s*(19|20)\d{2}\b/,
  /\b\d+(\.\d+)?%\b/,
  /\b(increased|improved|boosted|reduced)\b.+\bby\b/i,
] as const;
