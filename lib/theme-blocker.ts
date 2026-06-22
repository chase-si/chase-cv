/** Blocking theme script (from next-themes) — runs in <head> before paint, not via React. */
export function themeBlocker(
  attribute: string | string[],
  storageKey: string,
  defaultTheme: string,
  forcedTheme: string | null,
  themes: string[],
  value: Record<string, string> | null,
  enableSystem: boolean,
  enableColorScheme: boolean,
) {
  const documentElement = document.documentElement;
  const colorSchemes = ["light", "dark"];

  function applyColorScheme(theme: string) {
    if (enableColorScheme && colorSchemes.includes(theme)) {
      documentElement.style.colorScheme = theme;
    }
  }

  function setTheme(theme: string) {
    const attrs = Array.isArray(attribute) ? attribute : [attribute];
    attrs.forEach((attr) => {
      const isClass = attr === "class";
      const classNames =
        isClass && value ? themes.map((name) => value[name] || name) : themes;
      if (isClass) {
        documentElement.classList.remove(...classNames);
        documentElement.classList.add(
          value && value[theme] ? value[theme] : theme,
        );
      } else if (attr.startsWith("data-")) {
        const name = value ? value[theme] : theme;
        if (name) {
          documentElement.setAttribute(attr, name);
        } else {
          documentElement.removeAttribute(attr);
        }
      }
    });
    applyColorScheme(theme);
  }

  function getSystemTheme() {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  if (forcedTheme) {
    setTheme(forcedTheme);
    return;
  }

  try {
    let theme = localStorage.getItem(storageKey) || defaultTheme;
    if (enableSystem && theme === "system") {
      theme = getSystemTheme();
    }
    setTheme(theme);
  } catch {
    // localStorage unavailable
  }
}

export const themeProviderConfig = {
  attribute: "class" as const,
  storageKey: "theme",
  defaultTheme: "system",
  themes: ["light", "dark"] as const,
  enableSystem: true,
  enableColorScheme: true,
};

export function getThemeBlockerScriptHtml() {
  const args = JSON.stringify([
    themeProviderConfig.attribute,
    themeProviderConfig.storageKey,
    themeProviderConfig.defaultTheme,
    null,
    [...themeProviderConfig.themes],
    null,
    themeProviderConfig.enableSystem,
    themeProviderConfig.enableColorScheme,
  ]).slice(1, -1);

  return `(${themeBlocker.toString()})(${args})`;
}
