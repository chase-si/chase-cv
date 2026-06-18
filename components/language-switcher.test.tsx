import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { LanguageSwitcher } from "@/components/language-switcher";
import enMessages from "@/messages/en.json";

const mockRouteState = vi.hoisted(() => ({
  pathname: "/magic-cursor",
  push: vi.fn(),
}));

vi.mock("@/i18n/navigation", () => ({
  usePathname: () => mockRouteState.pathname,
  useRouter: () => ({ push: mockRouteState.push }),
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
    mockRouteState.push.mockReset();
    mockRouteState.pathname = "/magic-cursor";
    document.cookie = "NEXT_LOCALE=; Max-Age=0; path=/";
    window.history.replaceState(null, "", "/magic-cursor?demo=ring#preview");
  });

  afterEach(() => {
    cleanup();
  });

  it("marks the current locale as active", () => {
    renderSwitcher("en");

    expect(screen.getByRole("button", { name: "EN" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("button", { name: "中文" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });

  it("preserves path, query, and hash when switching languages", async () => {
    const { trackEvent } = await import("@/lib/analytics");
    renderSwitcher("en");

    fireEvent.click(screen.getByRole("button", { name: "中文" }));

    expect(mockRouteState.push).toHaveBeenCalledWith("/zh/magic-cursor?demo=ring#preview");
    expect(document.cookie).toContain("NEXT_LOCALE=zh");
    expect(trackEvent).toHaveBeenCalledWith("language_switch", {
      from: "en",
      to: "zh",
      path: "/magic-cursor?demo=ring#preview",
    });
  });
});
