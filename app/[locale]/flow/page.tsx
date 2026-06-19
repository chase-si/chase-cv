import { setRequestLocale } from "next-intl/server";

import { FlowToolShell } from "@/components/flow/flow-tool-shell";
import type { AppLocale } from "@/i18n/routing";
import { buildLocalizedMetadata } from "@/lib/metadata";

type Props = {
  params: Promise<{ locale: AppLocale }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return buildLocalizedMetadata({
    locale,
    namespace: "metadata.flow",
    pathname: "/flow",
  });
}

export default async function FlowPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <FlowToolShell />;
}
