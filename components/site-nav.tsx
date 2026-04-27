import Link from "next/link";
import { GitFork } from "lucide-react";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export function SiteNav() {
  return (
    <header className="sticky top-0 z-30 w-full border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
      <div className="flex h-16 w-full items-center justify-between px-4 sm:px-6">
        <Link href="/">
          <Image
            src="/logo.png"
            alt="Logo"
            width={192}
            height={52}
            className="h-8 w-auto"
          />
        </Link>

        <div>
          <nav className="hidden items-center gap-2 text-sm sm:flex">
            <Button
              size="sm"
              nativeButton={false}
              className="shadow-sm border-none"
              render={<Link href="/magic-cursor" />}
            >
              作品
            </Button>
            <Button
              variant="ghost"
              size="sm"
              nativeButton={false}
              className="shadow-sm"
              render={<Link href="https://blog.dashuaibi.vip/blog" target="_blank" />}
            >
              博客
            </Button>
            <Button
              variant="outline"
              size="icon"
              nativeButton={false}
              aria-label="GitHub"
              className="shadow-sm hover:shadow-md"
              render={
                <a
                  href="https://github.com/chase-si"
                  target="_blank"
                  rel="noreferrer"
                />
              }
            >
              <GitFork className="h-4 w-4" />
            </Button>
            
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </header>
  );
}
