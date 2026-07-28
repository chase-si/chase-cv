"use client";

import { SiteNav } from "@/components/site-nav";

export function LocaleChrome({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteNav />
      <div className="flex min-h-0 flex-1 flex-col">{children}</div>
    </>
  );
}
