import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "zh"],
  defaultLocale: "en",
  localePrefix: "as-needed",
  localeDetection: false,
});

export type AppLocale = (typeof routing.locales)[number];

export const htmlLangByLocale: Record<AppLocale, string> = {
  en: "en",
  zh: "zh-CN",
};

export const openGraphLocaleByLocale: Record<AppLocale, string> = {
  en: "en_US",
  zh: "zh_CN",
};
