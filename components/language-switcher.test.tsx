import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { LanguageSwitcher } from "@/components/language-switcher";
import enMessages from "@/messages/en.json";

const mockRouteState = vi.hoisted(() => ({
  pathname: "/magic-cursor",
}));

vi.mock("@/i18n/navigation", () => ({
  usePathname: () => mockRouteState.pathname,
}));

vi.mock("@/lib/analytics", () => ({
  trackEvent: vi.fn(),
}));

function renderSwitcher(locale = "en") {
  return render(
    <NextIntlClientProvider locale={locale} messages={enMessages}>
      <LanguageSwitcher />
    </NextIntlClientProvider>,
  );
}

describe("LanguageSwitcher", () => {
  beforeEach(() => {
    mockRouteState.pathname = "/magic-cursor";
    document.cookie = "NEXT_LOCALE=; Max-Age=0; path=/";
    window.history.replaceState(null, "", "/magic-cursor?demo=ring#preview");
  });

  afterEach(() => {
    cleanup();
  });

  it("marks the current locale as active", () => {
    renderSwitcher("en");

    expect(screen.getByRole("link", { name: "EN" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByRole("link", { name: "中文" })).not.toHaveAttribute("aria-current");
  });

  it("preserves path, query, and hash when switching languages", async () => {
    const { trackEvent } = await import("@/lib/analytics");
    renderSwitcher("en");

    const chineseLink = screen.getByRole("link", { name: "中文" });
    fireEvent.click(chineseLink);

    expect(chineseLink).toHaveAttribute("href", "/zh/magic-cursor?demo=ring#preview");
    expect(document.cookie).toContain("NEXT_LOCALE=zh");
    expect(trackEvent).toHaveBeenCalledWith("language_switch", {
      from: "en",
      to: "zh",
      path: "/magic-cursor?demo=ring#preview",
    });
  });

  it("links back to English while preserving the current location", () => {
    renderSwitcher("zh");

    expect(screen.getByRole("link", { name: "EN" })).toHaveAttribute(
      "href",
      "/magic-cursor?demo=ring#preview",
    );

    fireEvent.click(screen.getByRole("link", { name: "EN" }));
    expect(document.cookie).toContain("NEXT_LOCALE=en");
  });
});
