import { getTranslations, setRequestLocale } from "next-intl/server";

import { FloorPlanShell } from "@/components/floor-plan/floor-plan-shell";
import type { AppLocale } from "@/i18n/routing";
import { FLOOR_PLAN_OG_IMAGE } from "@/lib/floor-plan/floor-plan-social-image";
import { buildToolPageMetadata } from "@/lib/seo/tool-page-metadata";

type Props = {
  params: Promise<{ locale: AppLocale }>;
};

const PATHNAME = "/floor-plan";

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.floorPlan" });

  return buildToolPageMetadata({
    locale,
    namespace: "metadata.floorPlan",
    pathname: PATHNAME,
    socialImage: {
      ...FLOOR_PLAN_OG_IMAGE,
      alt: t("ogImageAlt"),
    },
  });
}

export default async function FloorPlanPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <FloorPlanShell locale={locale} />;
}
