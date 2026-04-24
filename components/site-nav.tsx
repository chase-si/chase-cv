import Link from "next/link";
import { GitFork, Sparkles } from "lucide-react";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

export function SiteNav() {
  return (
    <header className="sticky top-0 z-30 w-full border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <Button
          variant="ghost"
          nativeButton={false}
          className="h-auto gap-2 px-2 font-semibold text-foreground hover:text-foreground"
          render={<Link href="/" />}
        >
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-foreground text-background shadow-md">
            <Sparkles className="h-4 w-4" />
          </span>
          <span className="text-sm sm:text-base">
            Chase&apos;s <span className="text-muted-foreground">CV</span>
          </span>
        </Button>

        {/* <nav className="hidden items-center gap-1 text-sm sm:flex">
          <Button
            size="sm"
            nativeButton={false}
            render={<Link href="#work" />}
          >
            作品
          </Button>
          <Button
            variant="ghost"
            size="sm"
            nativeButton={false}
            className="text-muted-foreground hover:text-foreground"
            render={<Link href="#about" />}
          >
            关于
          </Button>
          <Button
            variant="ghost"
            size="sm"
            nativeButton={false}
            className="text-muted-foreground hover:text-foreground"
            render={<Link href="#contact" />}
          >
            联系
          </Button>
        </nav> */}

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            nativeButton={false}
            aria-label="GitHub"
            className="rounded-xl shadow-sm hover:shadow-md"
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
        </div>
      </div>
    </header>
  );
}
