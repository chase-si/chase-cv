import Link from "next/link";
import Image from "next/image";

import { SiteNavActions } from "@/components/site-nav-actions";
import { ThemeToggle } from "@/components/theme-toggle";

export function SiteNav() {
  return (
    <header className="sticky top-0 z-30 w-full border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
      <div className="flex h-16 w-full items-center justify-between px-4 sm:px-6">
        <Link href="/">
          <Image
            src="/logo.svg"
            alt="Chase"
            width={184}
            height={48}
            className="h-9 w-auto"
            priority
          />
        </Link>

        <div className="hidden items-center gap-2 sm:flex">
          <SiteNavActions />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
