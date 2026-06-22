export const homepageWorkExperienceEntryIds = ["entry1", "entry2", "entry3"] as const;

export type HomepageWorkExperienceEntryId =
  (typeof homepageWorkExperienceEntryIds)[number];

export const workExperienceFieldKeys = [
  "period",
  "role",
  "scope",
  "outcomes",
] as const;

export type WorkExperienceFieldKey = (typeof workExperienceFieldKeys)[number];

/** Marker present in placeholder copy until real resume content is supplied. */
export const WORK_EXPERIENCE_PLACEHOLDER_MARKER = "[[placeholder]]";

/** Patterns that must not appear in timeline body copy (fabricated resume details). */
export const fabricatedResumePatterns = [
  /\bat\s+(Google|Meta|Amazon|Microsoft|Apple|ByteDance|Tencent|Alibaba)\b/i,
  /\b(19|20)\d{2}\s*[-–]\s*(19|20)\d{2}\b/,
  /\b\d+(\.\d+)?%\b/,
  /\b(increased|improved|boosted|reduced)\b.+\bby\b/i,
] as const;
