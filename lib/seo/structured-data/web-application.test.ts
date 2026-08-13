import { describe, expect, it } from "vitest";

import { buildWebApplicationJsonLd } from "@/lib/seo/structured-data/web-application";

describe("buildWebApplicationJsonLd", () => {
  it("emits truthful WebApplication JSON-LD without ratings or reviews", () => {
    const jsonLd = buildWebApplicationJsonLd({
      name: "Image to UI",
      description: "Extract UI palettes locally in the browser.",
      url: "https://example.com/image-to-ui",
      applicationCategory: "DesignApplication",
      operatingSystem: "Web Browser",
      inLanguage: "en-US",
    });

    expect(jsonLd["@type"]).toBe("WebApplication");
    expect(jsonLd.name).toBe("Image to UI");
    expect(jsonLd.offers).toEqual({
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    });
    expect(jsonLd.isAccessibleForFree).toBe(true);
    expect(jsonLd).not.toHaveProperty("aggregateRating");
    expect(jsonLd).not.toHaveProperty("review");
  });
});
