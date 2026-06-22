"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { ensureGtag, sendGtagPageView } from "@/lib/gtag";

type GoogleAnalyticsProps = {
  gaId: string;
};

export function GoogleAnalytics({ gaId }: GoogleAnalyticsProps) {
  const pathname = usePathname();

  useEffect(() => {
    ensureGtag(gaId);
  }, [gaId]);

  useEffect(() => {
    const pagePath = `${pathname}${window.location.search}${window.location.hash}`;
    sendGtagPageView(gaId, pagePath);
  }, [gaId, pathname]);

  return null;
}
