import { getLocale, getTranslations } from "next-intl/server";

import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";

export default async function NotFound() {
  const locale = (await getLocale()) as AppLocale;
  const t = await getTranslations({ locale, namespace: "notFound" });

  return (
    <main className="flex flex-1 items-center justify-center px-4 py-20 sm:px-6">
      <section className="mx-auto flex max-w-md flex-col items-center gap-4 text-center">
        <p className="text-sm font-semibold text-muted-foreground">404</p>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          {t("title")}
        </h1>
        <p className="text-sm text-muted-foreground">{t("description")}</p>
        <Button nativeButton={false} className="mt-2 shadow-sm" render={<Link href="/" />}>
          {t("home")}
        </Button>
      </section>
    </main>
  );
}
