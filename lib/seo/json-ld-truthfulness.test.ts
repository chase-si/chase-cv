import { describe, expect, it } from "vitest";

import { buildHomeProfilePageJsonLd } from "@/lib/seo/structured-data/profile-page";
import { buildWebApplicationJsonLd } from "@/lib/seo/structured-data/web-application";

import { findForbiddenStructuredDataKeys } from "./json-ld-truthfulness";

describe("structured data truthfulness", () => {
  it("flags ratings and reviews anywhere in a JSON-LD tree", () => {
    const hits = findForbiddenStructuredDataKeys({
      "@type": "Product",
      aggregateRating: { ratingValue: 5 },
      offers: {
        review: [{ author: "Bot" }],
      },
    });

    expect(hits).toContain("$.aggregateRating");
    expect(hits).toContain("$.offers.review");
  });

  it("keeps ProfilePage and WebApplication builders free of fabricated claims", () => {
    const profile = buildHomeProfilePageJsonLd({
      name: "Chase",
      description: "Product-minded frontend engineer.",
      pageUrl: "https://example.com/",
      profileUrl: "https://example.com/",
    });
    const webApp = buildWebApplicationJsonLd({
      name: "Image to UI",
      description: "Extract palettes locally.",
      url: "https://example.com/image-to-ui",
      applicationCategory: "DesignApplication",
      operatingSystem: "Web Browser",
      inLanguage: "en-US",
    });

    expect(findForbiddenStructuredDataKeys(profile)).toEqual([]);
    expect(findForbiddenStructuredDataKeys(webApp)).toEqual([]);
  });
});
