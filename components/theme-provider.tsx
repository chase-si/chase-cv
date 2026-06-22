"use client";

import * as React from "react";

import { themeProviderConfig } from "@/lib/theme-blocker";

const MEDIA = "(prefers-color-scheme: dark)";
const COLOR_SCHEMES = ["light", "dark"] as const;

type ThemeContextValue = {
  theme?: string;
  setTheme: React.Dispatch<React.SetStateAction<string>>;
  forcedTheme?: string;
  resolvedTheme?: string;
  themes: string[];
  systemTheme?: "light" | "dark";
};

const ThemeContext = React.createContext<ThemeContextValue>({
  setTheme: () => {},
  themes: [],
});

export function useTheme() {
  return React.useContext(ThemeContext);
}

function getSystemTheme(media?: MediaQueryList | MediaQueryListEvent) {
  const query = media ?? window.matchMedia(MEDIA);
  return query.matches ? "dark" : "light";
}

function readStoredTheme(storageKey: string, fallback: string) {
  try {
    return localStorage.getItem(storageKey) || fallback;
  } catch {
    return fallback;
  }
}

function disableTransition(nonce?: string) {
  const style = document.createElement("style");
  if (nonce) {
    style.setAttribute("nonce", nonce);
  }
  style.appendChild(
    document.createTextNode(
      "*,*::before,*::after{-webkit-transition:none!important;-moz-transition:none!important;-o-transition:none!important;-ms-transition:none!important;transition:none!important}",
    ),
  );
  document.head.appendChild(style);
  return () => {
    window.getComputedStyle(document.body);
    setTimeout(() => {
      document.head.removeChild(style);
    }, 1);
  };
}

type ThemeProviderProps = React.PropsWithChildren<{
  forcedTheme?: string;
  disableTransitionOnChange?: boolean;
  enableSystem?: boolean;
  enableColorScheme?: boolean;
  storageKey?: string;
  themes?: string[];
  defaultTheme?: string;
  attribute?: "class" | `data-${string}` | Array<"class" | `data-${string}`>;
  value?: Record<string, string>;
  nonce?: string;
}>;

export function ThemeProvider({
  forcedTheme,
  disableTransitionOnChange = false,
  enableSystem = themeProviderConfig.enableSystem,
  enableColorScheme = themeProviderConfig.enableColorScheme,
  storageKey = themeProviderConfig.storageKey,
  themes = [...themeProviderConfig.themes],
  defaultTheme = themeProviderConfig.defaultTheme,
  attribute = themeProviderConfig.attribute,
  value,
  nonce,
  children,
}: ThemeProviderProps) {
  const [theme, setThemeState] = React.useState(() =>
    readStoredTheme(storageKey, defaultTheme),
  );
  const [resolvedSystemTheme, setResolvedSystemTheme] = React.useState<
    "light" | "dark"
  >(() => {
    if (typeof window === "undefined") {
      return "light";
    }
    const initialTheme = readStoredTheme(storageKey, defaultTheme);
    return initialTheme === "system"
      ? getSystemTheme()
      : (initialTheme as "light" | "dark");
  });

  const themeClassNames = value ? Object.values(value) : themes;

  const applyTheme = React.useCallback(
    (nextTheme: string | undefined) => {
      if (!nextTheme) return;

      let resolved = nextTheme;
      if (nextTheme === "system" && enableSystem) {
        resolved = getSystemTheme();
      }

      const className = value ? value[resolved] : resolved;
      const restoreTransitions = disableTransitionOnChange
        ? disableTransition(nonce)
        : null;
      const root = document.documentElement;

      const applyAttribute = (attr: string) => {
        if (attr === "class") {
          root.classList.remove(...themeClassNames);
          if (className) {
            root.classList.add(className);
          }
        } else if (attr.startsWith("data-")) {
          if (className) {
            root.setAttribute(attr, className);
          } else {
            root.removeAttribute(attr);
          }
        }
      };

      if (Array.isArray(attribute)) {
        attribute.forEach(applyAttribute);
      } else {
        applyAttribute(attribute);
      }

      if (enableColorScheme) {
        const fallback = COLOR_SCHEMES.includes(
          defaultTheme as (typeof COLOR_SCHEMES)[number],
        )
          ? defaultTheme
          : null;
        const colorScheme = COLOR_SCHEMES.includes(
          resolved as (typeof COLOR_SCHEMES)[number],
        )
          ? resolved
          : fallback;
        if (colorScheme) {
          root.style.colorScheme = colorScheme;
        }
      }

      restoreTransitions?.();
    },
    [
      attribute,
      defaultTheme,
      disableTransitionOnChange,
      enableColorScheme,
      enableSystem,
      nonce,
      themeClassNames,
      value,
    ],
  );

  const setTheme = React.useCallback(
    (update: React.SetStateAction<string>) => {
      setThemeState((current) => {
        const next = typeof update === "function" ? update(current) : update;
        try {
          localStorage.setItem(storageKey, next);
        } catch {
          // localStorage unavailable
        }
        return next;
      });
    },
    [storageKey],
  );

  const handleMediaQuery = React.useCallback(
    (event: MediaQueryListEvent) => {
      const systemTheme = getSystemTheme(event);
      setResolvedSystemTheme(systemTheme);
      if (theme === "system" && enableSystem && !forcedTheme) {
        applyTheme("system");
      }
    },
    [applyTheme, enableSystem, forcedTheme, theme],
  );

  React.useEffect(() => {
    const media = window.matchMedia(MEDIA);
    media.addEventListener("change", handleMediaQuery);
    return () => media.removeEventListener("change", handleMediaQuery);
  }, [handleMediaQuery]);

  React.useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key !== storageKey) return;
      if (!event.newValue) {
        setTheme(defaultTheme);
        return;
      }
      setThemeState(event.newValue);
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [defaultTheme, setTheme, storageKey]);

  React.useEffect(() => {
    applyTheme(forcedTheme ?? theme);
  }, [applyTheme, forcedTheme, theme]);

  const contextValue = React.useMemo<ThemeContextValue>(
    () => ({
      theme,
      setTheme,
      forcedTheme,
      resolvedTheme: theme === "system" ? resolvedSystemTheme : theme,
      themes: enableSystem ? [...themes, "system"] : themes,
      systemTheme: enableSystem ? resolvedSystemTheme : undefined,
    }),
    [
      enableSystem,
      forcedTheme,
      resolvedSystemTheme,
      setTheme,
      theme,
      themes,
    ],
  );

  return (
    <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>
  );
}
