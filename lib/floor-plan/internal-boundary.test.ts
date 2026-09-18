import { describe, expect, it } from "vitest";
import { getIndexedPathnames, getIndexedSeoRoutes } from "@/lib/seo/route-registry";
import { buildSitemapEntries } from "@/lib/seo/sitemap-entries";
import { projectNavigationItems } from "@/lib/projects";
import {
  FLOOR_PLAN_INTERNAL_ROUTE,
  FLOOR_PLAN_ROBOTS_METADATA,
  isFloorPlanInternalEnabled,
} from "./internal-boundary";
import { generateMetadata } from "@/app/[locale]/floor-plan/page";

describe("Floor Plan Internal Release Boundary (AC-19)", () => {
  describe("Route Registry and Sitemap Exclusions", () => {
    it("ensures floor plan routes are strictly absent from indexed SEO routes", () => {
      const indexedRoutes = getIndexedSeoRoutes();
      const indexedPathnames = getIndexedPathnames();

      expect(indexedPathnames).not.toContain("/floor-plan");
      expect(indexedPathnames).not.toContain("/zh/floor-plan");
      expect(indexedPathnames).not.toContain("/en/floor-plan");

      const hasFloorPlanInRoutes = indexedRoutes.some(
        (r) => r.pathname.includes("floor-plan") || r.pathname.includes("recognition"),
      );
      expect(hasFloorPlanInRoutes).toBe(false);
    });

    it("ensures public sitemap entries do not include floor-plan or recognition lab URLs", () => {
      const sitemap = buildSitemapEntries();
      const floorPlanUrls = sitemap.filter(
        (entry) => entry.url.includes("/floor-plan") || entry.url.includes("/recognition"),
      );
      expect(floorPlanUrls).toHaveLength(0);
    });
  });

  describe("Public Site Navigation Menus", () => {
    it("ensures public project navigation items do not link to floor plan", () => {
      const projectHrefs = projectNavigationItems.map((p) => p.href);
      expect(projectHrefs).not.toContain("/floor-plan");
      expect(projectHrefs).not.toContain(FLOOR_PLAN_INTERNAL_ROUTE);
      expect(projectNavigationItems.some((p) => p.id as string === "floorPlan")).toBe(false);
    });
  });

  describe("Noindex Metadata", () => {
    it("provides robots metadata declaring index: false and follow: false", () => {
      expect(FLOOR_PLAN_ROBOTS_METADATA).toEqual({
        index: false,
        follow: false,
      });
    });

    it("emits noindex and nofollow metadata from the floor plan page route", async () => {
      const metaZh = await generateMetadata({ params: Promise.resolve({ locale: "zh" }) });
      expect(metaZh.robots).toEqual({
        index: false,
        follow: false,
      });

      const metaEn = await generateMetadata({ params: Promise.resolve({ locale: "en" }) });
      expect(metaEn.robots).toEqual({
        index: false,
        follow: false,
      });
    });
  });

  describe("Environment-Controlled Access Gate (isFloorPlanInternalEnabled)", () => {
    it("defaults to enabled in development and test environments", () => {
      expect(isFloorPlanInternalEnabled({ NODE_ENV: "development" })).toBe(true);
      expect(isFloorPlanInternalEnabled({ NODE_ENV: "test" })).toBe(true);
      expect(isFloorPlanInternalEnabled({})).toBe(true);
    });

    it("enables access when FEATURE_FLOOR_PLAN_INTERNAL is explicitly set to true", () => {
      expect(
        isFloorPlanInternalEnabled({
          NODE_ENV: "production",
          FEATURE_FLOOR_PLAN_INTERNAL: "true",
        }),
      ).toBe(true);
      expect(
        isFloorPlanInternalEnabled({
          NODE_ENV: "production",
          FEATURE_FLOOR_PLAN_INTERNAL: "1",
        }),
      ).toBe(true);
    });

    it("enables access when NEXT_PUBLIC_INTERNAL_TOOLS is explicitly set to true", () => {
      expect(
        isFloorPlanInternalEnabled({
          NODE_ENV: "production",
          NEXT_PUBLIC_INTERNAL_TOOLS: "true",
        }),
      ).toBe(true);
    });

    it("enables access in internal or preview environments", () => {
      expect(
        isFloorPlanInternalEnabled({
          NODE_ENV: "production",
          VERCEL_ENV: "preview",
        }),
      ).toBe(true);
      expect(
        isFloorPlanInternalEnabled({
          NODE_ENV: "production",
          APP_ENV: "internal",
        }),
      ).toBe(true);
    });

    it("blocks access when explicitly disabled via FEATURE_FLOOR_PLAN_INTERNAL='false'", () => {
      expect(
        isFloorPlanInternalEnabled({
          NODE_ENV: "development",
          FEATURE_FLOOR_PLAN_INTERNAL: "false",
        }),
      ).toBe(false);
      expect(
        isFloorPlanInternalEnabled({
          NODE_ENV: "test",
          FEATURE_FLOOR_PLAN_INTERNAL: "0",
        }),
      ).toBe(false);
    });

    it("blocks access when explicitly disabled via NEXT_PUBLIC_INTERNAL_TOOLS='false'", () => {
      expect(
        isFloorPlanInternalEnabled({
          NODE_ENV: "development",
          NEXT_PUBLIC_INTERNAL_TOOLS: "false",
        }),
      ).toBe(false);
    });

    it("blocks access by default in production when no internal flag is set", () => {
      expect(
        isFloorPlanInternalEnabled({
          NODE_ENV: "production",
        }),
      ).toBe(false);
    });
  });
});
