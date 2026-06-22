import { getThemeBlockerScriptHtml } from "@/lib/theme-blocker";

export function ThemeBlockingHeadScript() {
  return (
    <script
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: getThemeBlockerScriptHtml() }}
    />
  );
}
