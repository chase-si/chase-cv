import type { AppLocale } from "@/i18n/routing";
import { routing } from "@/i18n/routing";

const DEFAULT_SITE_URL = "https://dashuaibi.vip";

export const siteUrl = new URL(
  process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    process.env.SITE_URL?.trim() ||
    DEFAULT_SITE_URL,
);

export const indexedPathnames = [
  "/",
  "/magic-cursor",
  "/image-to-ui",
  "/flow",
] as const;

export type IndexedPathname = (typeof indexedPathnames)[number];

export function localizePathname(pathname: string, locale: AppLocale) {
  const normalizedPathname = pathname === "" ? "/" : pathname;
  if (locale === routing.defaultLocale) return normalizedPathname;
  if (normalizedPathname === "/") return `/${locale}`;
  return `/${locale}${normalizedPathname}`;
}

export function absoluteUrl(pathname: string, locale: AppLocale) {
  return new URL(localizePathname(pathname, locale), siteUrl).toString();
}

export function getLanguageAlternates(pathname: string) {
  return {
    en: absoluteUrl(pathname, "en"),
    zh: absoluteUrl(pathname, "zh"),
    "x-default": absoluteUrl(pathname, routing.defaultLocale),
  };
}
