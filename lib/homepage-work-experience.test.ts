import { describe, expect, it } from "vitest";

import { homepageWorkExperienceEntryIds } from "@/lib/homepage-work-experience";

describe("homepageWorkExperienceEntryIds", () => {
  it("lists timeline entries in display order", () => {
    expect(homepageWorkExperienceEntryIds).toEqual(["entry1", "entry2", "entry3"]);
  });
});
