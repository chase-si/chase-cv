import { setRequestLocale } from "next-intl/server";

import { MagicCursorEffectGalleryPage } from "@/components/magic-cursor/effect-gallery-page";
import type { AppLocale } from "@/i18n/routing";
import { buildLocalizedMetadata } from "@/lib/metadata";

type Props = {
  params: Promise<{ locale: AppLocale }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return buildLocalizedMetadata({
    locale,
    namespace: "metadata.magicCursor",
    pathname: "/magic-cursor",
  });
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <MagicCursorEffectGalleryPage />;
}
