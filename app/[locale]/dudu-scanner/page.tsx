import { getMessages, setRequestLocale } from "next-intl/server";

import { DuduScannerApp } from "@/components/dudu-scanner/dudu-scanner-app";
import type { AppLocale } from "@/i18n/routing";
import { buildLocalizedMetadata } from "@/lib/metadata";
import { DUDU_SCANNER_PATHNAME } from "@/lib/dudu-scanner/routes";

type Props = {
  params: Promise<{ locale: AppLocale }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return buildLocalizedMetadata({
    locale,
    namespace: "metadata.duduScanner",
    pathname: DUDU_SCANNER_PATHNAME,
  });
}

export default async function DuduScannerPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  await getMessages({ locale });

  return <DuduScannerApp />;
}
