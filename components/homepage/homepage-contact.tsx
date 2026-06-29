"use client";

import { useTranslations } from "next-intl";

import { HomepageMotion } from "@/components/homepage/homepage-motion";

export function HomepageContact() {
  const t = useTranslations("home");

  return (
    <HomepageMotion as="section" kind="reveal" id="contact" className="scroll-mt-24">
      <h2 className="text-lg font-semibold tracking-tight">{t("contactTitle")}</h2>
      <p className="mt-2 text-sm text-muted-foreground">{t("contactDescription")}</p>
    </HomepageMotion>
  );
}
