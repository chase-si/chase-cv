import { describe, expect, it } from "vitest";

import {
  absoluteUrl,
  getLanguageAlternates,
  localizePathname,
} from "@/lib/site";

describe("localized site URL helpers", () => {
  it("keeps English paths unprefixed and prefixes Chinese paths", () => {
    expect(localizePathname("/", "en")).toBe("/");
    expect(localizePathname("/magic-cursor", "en")).toBe("/magic-cursor");
    expect(localizePathname("/", "zh")).toBe("/zh");
    expect(localizePathname("/magic-cursor", "zh")).toBe("/zh/magic-cursor");
  });

  it("builds absolute canonical URLs with the production fallback domain", () => {
    expect(absoluteUrl("/image-to-ui", "en")).toBe("https://dashuaibi.vip/image-to-ui");
    expect(absoluteUrl("/image-to-ui", "zh")).toBe("https://dashuaibi.vip/zh/image-to-ui");
  });

  it("returns hreflang alternates for English, Chinese, and x-default", () => {
    expect(getLanguageAlternates("/magic-cursor")).toEqual({
      en: "https://dashuaibi.vip/magic-cursor",
      zh: "https://dashuaibi.vip/zh/magic-cursor",
      "x-default": "https://dashuaibi.vip/magic-cursor",
    });
  });
});
