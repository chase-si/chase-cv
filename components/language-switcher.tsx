"use client";

import { useSyncExternalStore } from "react";

import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "@/i18n/navigation";

import type { AppLocale } from "@/i18n/routing";
import { routing } from "@/i18n/routing";
import { trackEvent } from "@/lib/analytics";
import { localizePathname } from "@/lib/seo/urls";
import { cn } from "@/lib/utils";

const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;
const EMPTY_LOCATION_SUFFIX = "";

function subscribeToLocation() {
  return () => {};
}

function getLocationSuffix() {
  return `${window.location.search}${window.location.hash}`;
}

function writeLocaleCookie(locale: AppLocale) {
  document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
}

export function LanguageSwitcher() {
  const locale = useLocale() as AppLocale;
  const pathname = usePathname();
  const t = useTranslations("languageSwitcher");
  const label = useTranslations("siteNav")("languageLabel");
  const locationSuffix = useSyncExternalStore(
    subscribeToLocation,
    getLocationSuffix,
    () => EMPTY_LOCATION_SUFFIX,
  );
  const target = `${pathname || "/"}${locationSuffix}`;

  const trackLanguageSwitch = (nextLocale: AppLocale) => {
    if (nextLocale === locale) return;

    writeLocaleCookie(nextLocale);
    trackEvent("language_switch", {
      from: locale,
      to: nextLocale,
      path: target,
    });
  };

  return (
    <div
      className="inline-flex h-9 items-center rounded-full border border-border bg-background p-0.5 shadow-xs"
      role="group"
      aria-label={label}
    >
      {routing.locales.map((item) => {
        const active = item === locale;

        return (
          <a
            key={item}
            href={localizePathname(target, item)}
            aria-current={active ? "page" : undefined}
            className={cn(
              "inline-flex h-7 items-center justify-center rounded-full px-2.5 text-xs font-medium shadow-none transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
              active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
            )}
            onClick={() => trackLanguageSwitch(item)}
          >
            {item === "en" ? t("english") : t("chinese")}
          </a>
        );
      })}
    </div>
  );
}
