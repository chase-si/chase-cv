import { homepageWorkExperienceContent } from "@/lib/homepage-work-experience/content";

type ExperienceEntries = (typeof homepageWorkExperienceContent.entries)[number];

type ExperienceEntryMessages = {
  [E in ExperienceEntries as E["id"]]: {
    yearLabel: string;
    company: string;
    period: string;
    role: string;
    scope: string;
    outcomes: string[];
    projects: {
      [P in E["projects"][number]["id"]]: {
        title: string;
        blurb: string;
        image: string;
      };
    };
  };
};

/** Keys merged into `home` by `patchHomeMessagesWithWorkExperience` (not in locale JSON). */
export type PatchedHomeExperienceMessages = {
  experienceTitle: string;
  experienceDescription: string;
  experience: {
    sectionAria: string;
    supportingLine: string;
    fields: {
      period: string;
      role: string;
      scope: string;
      outcomes: string;
    };
    entries: ExperienceEntryMessages;
  };
};
