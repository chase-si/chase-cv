"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";

import { Button } from "@/components/ui/button";
import type { AppLocale } from "@/i18n/routing";
import { routing } from "@/i18n/routing";
import { trackEvent } from "@/lib/analytics";
import { localizePathname } from "@/lib/site";
import { cn } from "@/lib/utils";

const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

function writeLocaleCookie(locale: AppLocale) {
  document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
}

export function LanguageSwitcher() {
  const locale = useLocale() as AppLocale;
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("languageSwitcher");
  const label = useTranslations("siteNav")("languageLabel");

  const switchTo = (nextLocale: AppLocale) => {
    if (nextLocale === locale) return;

    const search = window.location.search;
    const hash = window.location.hash;
    const nextPathname = localizePathname(pathname || "/", nextLocale);
    const target = `${nextPathname}${search}${hash}`;

    writeLocaleCookie(nextLocale);
    trackEvent("language_switch", {
      from: locale,
      to: nextLocale,
      path: `${pathname || "/"}${search}${hash}`,
    });
    router.push(target);
  };

  return (
    <div
      className="inline-flex h-9 items-center rounded-full border border-border bg-background p-0.5 shadow-sm"
      role="group"
      aria-label={label}
    >
      {routing.locales.map((item) => {
        const active = item === locale;

        return (
          <Button
            key={item}
            type="button"
            size="sm"
            variant={active ? "default" : "ghost"}
            aria-pressed={active}
            className={cn(
              "h-7 rounded-full px-2.5 text-xs shadow-none",
              active ? "border-none" : "text-muted-foreground",
            )}
            onClick={() => switchTo(item)}
          >
            {item === "en" ? t("english") : t("chinese")}
          </Button>
        );
      })}
    </div>
  );
}
