import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

import { routing } from "@/i18n/routing";
import { buildRootHtmlAttributes } from "@/lib/seo/document-language";

const getLocale = vi.fn();

vi.mock("next-intl/server", () => ({
  getLocale: () => getLocale(),
}));

vi.mock("next/font/google", () => ({
  Geist: () => ({ variable: "--font-geist-sans" }),
  Geist_Mono: () => ({ variable: "--font-geist-mono" }),
  Inter: () => ({ variable: "--font-sans" }),
}));

vi.mock("@/components/google-analytics", () => ({
  GoogleAnalytics: () => null,
}));
vi.mock("@/components/theme-blocking-head-script", () => ({
  ThemeBlockingHeadScript: () => null,
}));
vi.mock("@/components/theme-provider", () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => children,
}));

describe("RootLayout document language", () => {
  it("renders the resolved locale on the html element in server markup", async () => {
    const RootLayout = (await import("@/app/layout")).default;

    for (const locale of routing.locales) {
      getLocale.mockResolvedValue(locale);
      const { lang } = buildRootHtmlAttributes(locale);
      const markup = renderToStaticMarkup(
        await RootLayout({ children: <main>content</main> }),
      );

      expect(markup).toContain(`lang="${lang}"`);
      if (locale === "en") {
        expect(markup).toContain('lang="en"');
      } else {
        expect(markup).toContain('lang="zh-CN"');
      }
    }
  });
});
