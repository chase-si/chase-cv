import { describe, expect, it } from "vitest";

import {
  HOMEPAGE_CONTACT_GITHUB_URL,
  HOMEPAGE_CONTACT_UPWORK_URL,
} from "@/lib/homepage-contact/constants";
import { buildHomeProfilePageJsonLd } from "@/lib/seo/structured-data/profile-page";

describe("buildHomeProfilePageJsonLd", () => {
  it("describes Chase as a Person on a ProfilePage without legal name, photo, or logo", () => {
    const schema = buildHomeProfilePageJsonLd({
      name: "Chase",
      description: "Product-minded frontend engineer building interaction tools.",
      pageUrl: "https://example.com/en",
      profileUrl: "https://example.com/en",
    });

    expect(schema["@type"]).toBe("ProfilePage");
    expect(schema.mainEntity["@type"]).toBe("Person");
    expect(schema.mainEntity.name).toBe("Chase");
    expect(schema.mainEntity.sameAs).toEqual([
      HOMEPAGE_CONTACT_GITHUB_URL,
      HOMEPAGE_CONTACT_UPWORK_URL,
    ]);
    expect(schema.mainEntity).not.toHaveProperty("image");
    expect(schema.mainEntity).not.toHaveProperty("familyName");
    expect(schema.mainEntity).not.toHaveProperty("givenName");
    expect(schema).not.toHaveProperty("aggregateRating");
  });
});
