"use client";

import { SiteNav } from "@/components/site-nav";
import { isDuduScannerPathname } from "@/lib/dudu-scanner/routes";
import { usePathname } from "@/i18n/navigation";

export function LocaleChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideSiteNav = isDuduScannerPathname(pathname);

  return (
    <>
      {hideSiteNav ? null : <SiteNav />}
      <div className="flex min-h-0 flex-1 flex-col">{children}</div>
    </>
  );
}
