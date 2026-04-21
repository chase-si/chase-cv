"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import * as React from "react";

const navIconButtonClass =
  "inline-flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-900/10 bg-white/70 text-zinc-700 shadow-sm transition hover:bg-white hover:shadow-md dark:border-white/10 dark:bg-black/40 dark:text-zinc-200 dark:hover:bg-black/50";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <span
        className={`${navIconButtonClass} pointer-events-none opacity-0`}
        aria-hidden
      />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={navIconButtonClass}
      aria-label={isDark ? "切换为浅色" : "切换为深色"}
    >
      {isDark ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
    </button>
  );
}
