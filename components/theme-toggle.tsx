"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import * as React from "react";

import { Toggle } from "@/components/ui/toggle";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    queueMicrotask(() => setMounted(true));
  }, []);

  if (!mounted) {
    return (
      <span
        className={`inline-flex h-9 w-9 items-center justify-center border shadow-sm pointer-events-none opacity-0`}
        aria-hidden
      />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <Toggle
      variant="outline"
      size="icon"
      pressed={isDark}
      onPressedChange={(next) => setTheme(next ? "dark" : "light")}
      className="rounded-xl border shadow-sm"
      aria-label={isDark ? "切换为浅色" : "切换为深色"}
    >
      {isDark ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
    </Toggle>
  );
}
