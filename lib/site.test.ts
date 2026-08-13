import { describe, expect, it } from "vitest";

import {
  absoluteUrl,
  getIndexedPathnames,
  getLanguageAlternates,
  localizePathname,
} from "@/lib/site";

describe("site SEO re-exports", () => {
  it("keeps indexed pathnames aligned with the SEO route registry", () => {
    const pathnames = getIndexedPathnames();
    expect(pathnames.length).toBeGreaterThan(0);
    expect(new Set(pathnames).size).toBe(pathnames.length);
    for (const pathname of pathnames) {
      expect(pathname.startsWith("/")).toBe(true);
    }
  });

  it("builds representative localized URLs through the shared helpers", () => {
    expect(localizePathname("/magic-cursor/ring", "zh")).toBe(
      "/zh/magic-cursor/ring",
    );
    expect(absoluteUrl("/magic-cursor/ring", "en")).toBe(
      "https://dashuaibi.vip/magic-cursor/ring",
    );
    expect(getLanguageAlternates("/dudu-scanner")).toEqual({
      en: "https://dashuaibi.vip/dudu-scanner",
      zh: "https://dashuaibi.vip/zh/dudu-scanner",
      "x-default": "https://dashuaibi.vip/dudu-scanner",
    });
  });
});
