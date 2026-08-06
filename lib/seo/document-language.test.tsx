import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { routing } from "@/i18n/routing";

import { getIndexedSeoRoutes } from "./route-registry";
import { buildRootHtmlAttributes } from "./document-language";

describe("server document language", () => {
  it("outputs en and zh-CN in the initial html element without client scripts", () => {
    for (const locale of routing.locales) {
      const { lang } = buildRootHtmlAttributes(locale);
      const markup = renderToStaticMarkup(
        <html lang={lang}>
          <body />
        </html>,
      );

      expect(markup).toContain(`lang="${lang}"`);
      expect(markup).not.toContain("<script");
    }
  });

  it("covers every indexed route locale with the correct document language", () => {
    for (const route of getIndexedSeoRoutes()) {
      for (const locale of routing.locales) {
        const { lang } = buildRootHtmlAttributes(locale);

        if (locale === "en") {
          expect(lang).toBe("en");
        } else {
          expect(lang).toBe("zh-CN");
        }

        expect(lang).toBe(buildRootHtmlAttributes(locale).lang);
        expect(route.pathname.length).toBeGreaterThan(0);
      }
    }
  });
});
