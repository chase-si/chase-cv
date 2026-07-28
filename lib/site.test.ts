import { describe, expect, it } from "vitest";

import {
  absoluteUrl,
  getLanguageAlternates,
  indexedPathnames,
  localizePathname,
} from "@/lib/site";

describe("localized site URL helpers", () => {
  it("indexes flow alongside other locale-aware tool routes", () => {
    expect(indexedPathnames).toContain("/flow");
    expect(indexedPathnames).toContain("/dudu-scanner");
  });

  it("keeps English paths unprefixed and prefixes Chinese paths", () => {
    expect(localizePathname("/", "en")).toBe("/");
    expect(localizePathname("/magic-cursor", "en")).toBe("/magic-cursor");
    expect(localizePathname("/flow", "en")).toBe("/flow");
    expect(localizePathname("/dudu-scanner", "en")).toBe("/dudu-scanner");
    expect(localizePathname("/", "zh")).toBe("/zh");
    expect(localizePathname("/magic-cursor", "zh")).toBe("/zh/magic-cursor");
    expect(localizePathname("/flow", "zh")).toBe("/zh/flow");
    expect(localizePathname("/dudu-scanner", "zh")).toBe("/zh/dudu-scanner");
  });

  it("builds absolute canonical URLs with the production fallback domain", () => {
    expect(absoluteUrl("/image-to-ui", "en")).toBe("https://dashuaibi.vip/image-to-ui");
    expect(absoluteUrl("/image-to-ui", "zh")).toBe("https://dashuaibi.vip/zh/image-to-ui");
    expect(absoluteUrl("/flow", "en")).toBe("https://dashuaibi.vip/flow");
    expect(absoluteUrl("/flow", "zh")).toBe("https://dashuaibi.vip/zh/flow");
  });

  it("returns hreflang alternates for English, Chinese, and x-default", () => {
    expect(getLanguageAlternates("/magic-cursor")).toEqual({
      en: "https://dashuaibi.vip/magic-cursor",
      zh: "https://dashuaibi.vip/zh/magic-cursor",
      "x-default": "https://dashuaibi.vip/magic-cursor",
    });
    expect(getLanguageAlternates("/dudu-scanner")).toEqual({
      en: "https://dashuaibi.vip/dudu-scanner",
      zh: "https://dashuaibi.vip/zh/dudu-scanner",
      "x-default": "https://dashuaibi.vip/dudu-scanner",
    });
  });
});
