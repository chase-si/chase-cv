import { describe, expect, it, vi } from "vitest";
import { getIndexedPathnames, getIndexedSeoRoutes } from "@/lib/seo/route-registry";
import { buildSitemapEntries } from "@/lib/seo/sitemap-entries";
import { projectNavigationItems } from "@/lib/projects";
import {
  FLOOR_PLAN_INTERNAL_ROUTE,
  FLOOR_PLAN_LAB_ROUTE,
  FLOOR_PLAN_ROBOTS_METADATA,
  isFloorPlanInternalEnabled,
} from "./internal-boundary";
import { generateMetadata as generateEditorMetadata } from "@/app/[locale]/floor-plan/page";
import { generateMetadata as generateLabMetadata } from "@/app/[locale]/floor-plan/lab/page";

vi.mock("next-intl/server", () => ({
  getTranslations: vi.fn(async ({ namespace }: { namespace: string }) => {
    const translator = (key: string) => `${namespace}.${key}`;
    return Object.assign(translator, {
      rich: translator,
      markup: translator,
      raw: translator,
      has: () => true,
    });
  }),
  setRequestLocale: vi.fn(),
}));

describe("Floor Plan release boundary", () => {
  describe("Route Registry and Sitemap", () => {
    it("indexes the public floor plan editor and keeps the lab out of SEO routes", () => {
      const indexedRoutes = getIndexedSeoRoutes();
      const indexedPathnames = getIndexedPathnames();

      expect(indexedPathnames).toContain("/floor-plan");
      expect(indexedPathnames).not.toContain("/floor-plan/lab");
      expect(indexedPathnames).not.toContain("/zh/floor-plan/lab");
      expect(indexedPathnames).not.toContain("/en/floor-plan/lab");

      expect(indexedRoutes.some((route) => route.pathname === "/floor-plan")).toBe(true);
      expect(
        indexedRoutes.some(
          (route) => route.pathname.includes("/floor-plan/lab") || route.pathname.includes("recognition"),
        ),
      ).toBe(false);
    });

    it("lists the public editor in the sitemap and omits the lab", () => {
      const sitemap = buildSitemapEntries();
      const editorUrls = sitemap.filter(
        (entry) => entry.url.includes("/floor-plan") && !entry.url.includes("/floor-plan/lab"),
      );
      const labUrls = sitemap.filter(
        (entry) => entry.url.includes("/floor-plan/lab") || entry.url.includes("/recognition"),
      );

      expect(editorUrls.length).toBeGreaterThan(0);
      expect(labUrls).toHaveLength(0);
    });
  });

  describe("Public Site Navigation Menus", () => {
    it("links the playground to the floor plan editor and not the lab", () => {
      const projectHrefs = projectNavigationItems.map((p) => p.href);
      expect(projectHrefs).toContain("/floor-plan");
      expect(projectHrefs).toContain(FLOOR_PLAN_INTERNAL_ROUTE);
      expect(projectHrefs).not.toContain(FLOOR_PLAN_LAB_ROUTE);
      expect(projectNavigationItems.some((p) => p.id === "floorPlan")).toBe(true);
    });
  });

  describe("Noindex Metadata", () => {
    it("provides robots metadata declaring index: false and follow: false", () => {
      expect(FLOOR_PLAN_ROBOTS_METADATA).toEqual({
        index: false,
        follow: false,
      });
    });

    it("emits indexable metadata from the public floor plan page route", async () => {
      const metaZh = await generateEditorMetadata({ params: Promise.resolve({ locale: "zh" }) });
      expect(metaZh.robots).toBeUndefined();
      expect(metaZh.title).toBe("metadata.floorPlan.title");

      const metaEn = await generateEditorMetadata({ params: Promise.resolve({ locale: "en" }) });
      expect(metaEn.robots).toBeUndefined();
      expect(metaEn.title).toBe("metadata.floorPlan.title");
    });

    it("emits noindex and nofollow metadata from the recognition lab page route", async () => {
      const metaZh = await generateLabMetadata({ params: Promise.resolve({ locale: "zh" }) });
      expect(metaZh.robots).toEqual({
        index: false,
        follow: false,
      });

      const metaEn = await generateLabMetadata({ params: Promise.resolve({ locale: "en" }) });
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
      expect(isFloorPlanInternalEnabled({} as unknown as NodeJS.ProcessEnv)).toBe(true);
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
