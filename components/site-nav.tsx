import Image from "next/image";
import { useTranslations } from "next-intl";

import { LanguageSwitcher } from "@/components/language-switcher";
import { SiteNavActions } from "@/components/site-nav-actions";
import { ThemeToggle } from "@/components/theme-toggle";
import { Link } from "@/i18n/navigation";

export function SiteNav() {
  const t = useTranslations("siteNav");

  return (
    <header className="sticky top-0 z-30 w-full border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
      <div className="flex h-16 w-full items-center justify-between px-4 sm:px-6">
        <Link href="/">
          <Image
            src="/logo.svg"
            alt={t("logoAlt")}
            width={184}
            height={48}
            className="h-9 w-auto"
            priority
          />
        </Link>

        <div className="flex items-center gap-2">
          <SiteNavActions />
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
