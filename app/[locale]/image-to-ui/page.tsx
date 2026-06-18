import { setRequestLocale } from "next-intl/server";

import { ImageToUiToolShell } from "@/components/image-to-ui/tool-shell";
import type { AppLocale } from "@/i18n/routing";
import { buildLocalizedMetadata } from "@/lib/metadata";

type Props = {
  params: Promise<{ locale: AppLocale }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return buildLocalizedMetadata({
    locale,
    namespace: "metadata.imageToUi",
    pathname: "/image-to-ui",
  });
}

export default async function ImageToUiPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <ImageToUiToolShell />;
}
