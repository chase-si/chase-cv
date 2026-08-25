import { describe, expect, it } from "vitest";

import { absoluteUrl } from "@/lib/site";

import { buildRobotsConfig } from "./robots";

describe("robots config", () => {
  it("allows Bingbot and advertises the sitemap", () => {
    const robots = buildRobotsConfig();

    expect(robots.sitemap).toBe(absoluteUrl("/sitemap.xml", "en"));
    expect(robots.rules).toEqual(
      expect.arrayContaining([
        { userAgent: "*", allow: "/" },
        { userAgent: "bingbot", allow: "/" },
      ]),
    );
  });
});
