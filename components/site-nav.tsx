import Link from "next/link";
import { GitFork, Sparkles } from "lucide-react";

import { ThemeToggle } from "@/components/theme-toggle";

export function SiteNav() {
  return (
    <header className="sticky top-0 z-30 w-full border-b border-zinc-900/10 bg-white/70 backdrop-blur-xl dark:border-white/10 dark:bg-black/40">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="group inline-flex items-center gap-2 font-semibold tracking-tight"
        >
          <span className="relative grid h-8 w-8 place-items-center rounded-xl bg-zinc-950 text-white shadow-[0_10px_30px_rgba(0,0,0,0.18)] dark:bg-white dark:text-black dark:shadow-[0_12px_36px_rgba(0,0,0,0.45)]">
            <Sparkles className="h-4 w-4" />
          </span>
          <span className="text-sm sm:text-base">
            Chase <span className="text-zinc-500 dark:text-zinc-400">CV</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-zinc-600 dark:text-zinc-300 sm:flex">
          <Link
            href="#work"
            className="transition-colors hover:text-zinc-950 dark:hover:text-white"
          >
            作品
          </Link>
          <Link
            href="#about"
            className="transition-colors hover:text-zinc-950 dark:hover:text-white"
          >
            关于
          </Link>
          <Link
            href="#contact"
            className="transition-colors hover:text-zinc-950 dark:hover:text-white"
          >
            联系
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <a
            href="https://github.com/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-900/10 bg-white/70 text-zinc-700 shadow-sm transition hover:bg-white hover:shadow-md dark:border-white/10 dark:bg-black/40 dark:text-zinc-200 dark:hover:bg-black/50"
            aria-label="GitHub"
          >
            <GitFork className="h-4 w-4" />
          </a>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
