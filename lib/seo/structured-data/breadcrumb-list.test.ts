import { describe, expect, it } from "vitest";

import { buildBreadcrumbListJsonLd } from "@/lib/seo/structured-data/breadcrumb-list";

describe("buildBreadcrumbListJsonLd", () => {
  it("maps ordered items to ListItem positions", () => {
    const jsonLd = buildBreadcrumbListJsonLd([
      { name: "Magic Cursor", url: "https://example.com/magic-cursor" },
      { name: "Ring effect", url: "https://example.com/magic-cursor/ring" },
    ]);

    expect(jsonLd["@type"]).toBe("BreadcrumbList");
    expect(jsonLd.itemListElement).toEqual([
      {
        "@type": "ListItem",
        position: 1,
        name: "Magic Cursor",
        item: "https://example.com/magic-cursor",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Ring effect",
        item: "https://example.com/magic-cursor/ring",
      },
    ]);
  });
});
