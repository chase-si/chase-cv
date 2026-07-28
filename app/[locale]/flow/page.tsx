import { getMessages, setRequestLocale } from "next-intl/server";

import { FlowToolShell } from "@/components/flow/flow-tool-shell";
import type { FlowUiCopy } from "@/components/flow/flow-ui-copy";
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
  const messages = await getMessages({ locale });

  return <FlowToolShell copy={messages.flowEditor as FlowUiCopy} />;
}
