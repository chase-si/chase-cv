import { getIndexedPathnames } from "@/lib/seo/route-registry";

export {
  absoluteUrl,
  getCanonicalPathname,
  getLanguageAlternates,
  localizePathname,
  siteUrl,
} from "@/lib/seo/urls";

export const indexedPathnames = getIndexedPathnames();

export type IndexedPathname = (typeof indexedPathnames)[number];
