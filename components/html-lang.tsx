"use client";

import { useLayoutEffect } from "react";

import type { AppLocale } from "@/i18n/routing";
import { htmlLangByLocale } from "@/i18n/routing";

export function HtmlLang({ locale }: { locale: AppLocale }) {
  useLayoutEffect(() => {
    document.documentElement.lang = htmlLangByLocale[locale];
  }, [locale]);

  return null;
}
