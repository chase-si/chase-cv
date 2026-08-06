import {
  getIndexedPathnames,
  getIndexedSeoRoutes,
  getIndexedToolOverviewPathnames,
  type IndexedSeoRoute,
} from "@/lib/seo/route-registry";

export {
  absoluteUrl,
  getCanonicalPathname,
  getLanguageAlternates,
  localizePathname,
  siteUrl,
} from "@/lib/seo/urls";

export type { IndexedSeoRoute };
export { getIndexedPathnames, getIndexedSeoRoutes, getIndexedToolOverviewPathnames };

export type IndexedPathname = ReturnType<typeof getIndexedPathnames>[number];
