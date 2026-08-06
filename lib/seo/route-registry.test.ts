import { describe, expect, it } from "vitest";

import { MAGIC_CURSOR_EFFECT_ORDER } from "@/lib/constants/magic-cursor";
import { routing } from "@/i18n/routing";

import {
  getIndexedSeoRoutes,
  getIndexedPathnames,
  getIndexedToolOverviewPathnames,
} from "./route-registry";

describe("indexed SEO route registry", () => {
  it("lists core tool routes and every magic cursor effect page", () => {
    const pathnames = getIndexedPathnames();
    const toolOverviews = getIndexedToolOverviewPathnames();

    for (const pathname of toolOverviews) {
      expect(pathnames).toContain(pathname);
    }

    for (const effect of MAGIC_CURSOR_EFFECT_ORDER) {
      expect(pathnames).toContain(`/magic-cursor/${effect}`);
    }

    expect(pathnames.length).toBe(
      1 + toolOverviews.length + MAGIC_CURSOR_EFFECT_ORDER.length,
    );
  });

  it("assigns a major content lastModified date to every indexed route", () => {
    for (const route of getIndexedSeoRoutes()) {
      expect(route.lastModified).toBeInstanceOf(Date);
      expect(Number.isNaN(route.lastModified.getTime())).toBe(false);
    }
  });

  it("only contains canonical pathnames for supported locales", () => {
    for (const route of getIndexedSeoRoutes()) {
      expect(route.pathname.startsWith("/")).toBe(true);
      expect(route.pathname.includes("/zh")).toBe(false);
      expect(routing.locales.every((locale) => locale.length > 0)).toBe(true);
    }
  });
});
