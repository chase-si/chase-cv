import type { AppLocale } from "@/i18n/routing";
import { htmlLangByLocale } from "@/i18n/routing";

export function getHtmlLangForLocale(locale: AppLocale) {
  return htmlLangByLocale[locale];
}

export function buildRootHtmlAttributes(locale: AppLocale) {
  return {
    lang: getHtmlLangForLocale(locale),
  };
}
