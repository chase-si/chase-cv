import { describe, expect, it } from "vitest";

import {
  homepageWorkExperienceContent,
  homepageWorkExperienceEntryIds,
} from "@/lib/homepage-work-experience";

describe("homepageWorkExperienceEntryIds", () => {
  it("lists timeline entries in display order", () => {
    expect(homepageWorkExperienceEntryIds).toEqual(["entry1", "entry2", "entry3"]);
  });

  it("derives entry and project ids from content config", () => {
    const entryIds = homepageWorkExperienceContent.entries.map((entry) => entry.id);
    expect(entryIds).toEqual(homepageWorkExperienceEntryIds);

    for (const entry of homepageWorkExperienceContent.entries) {
      for (const project of entry.projects) {
        expect(project.image).toMatch(/^\/imgs\/work-experience\//);
      }
    }
  });
});
