import { cleanup, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { afterEach, describe, expect, it, vi } from "vitest";

import { SiteNavActions } from "@/components/site-nav-actions";
import enMessages from "@/messages/en.json";
import zhMessages from "@/messages/zh.json";

vi.mock("@/i18n/navigation", () => ({
  Link: ({
    href,
    children,
    ...props
  }: {
    href: string;
    children: React.ReactNode;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock("@/lib/analytics", () => ({
  trackEvent: vi.fn(),
}));

function renderNav(locale: "en" | "zh") {
  const messages = locale === "zh" ? zhMessages : enMessages;
  return render(
    <NextIntlClientProvider locale={locale} messages={messages}>
      <SiteNavActions />
    </NextIntlClientProvider>,
  );
}

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("SiteNavActions", () => {
  it("lists localized flow editor link between works and blog (English)", () => {
    renderNav("en");

    const nav = screen.getByRole("navigation");
    const links = [...nav.querySelectorAll("a")].map((anchor) => ({
      text: anchor.textContent?.trim(),
      href: anchor.getAttribute("href"),
    }));

    const labels = links.map((link) => link.text);
    const worksIndex = labels.indexOf("Works");
    const flowIndex = labels.indexOf("Flow editor");
    const blogIndex = labels.indexOf("Blog");

    expect(worksIndex).toBeGreaterThanOrEqual(0);
    expect(flowIndex).toBeGreaterThan(worksIndex);
    expect(blogIndex).toBeGreaterThan(flowIndex);
    expect(links[flowIndex]?.href).toBe("/flow");
  });

  it("lists localized flow editor link between works and blog (Chinese)", () => {
    renderNav("zh");

    const nav = screen.getByRole("navigation");
    const links = [...nav.querySelectorAll("a")].map((anchor) => ({
      text: anchor.textContent?.trim(),
      href: anchor.getAttribute("href"),
    }));

    const labels = links.map((link) => link.text);
    const worksIndex = labels.indexOf("作品");
    const flowIndex = labels.indexOf("流程编辑器");
    const blogIndex = labels.indexOf("博客");

    expect(worksIndex).toBeGreaterThanOrEqual(0);
    expect(flowIndex).toBeGreaterThan(worksIndex);
    expect(blogIndex).toBeGreaterThan(flowIndex);
    expect(links[flowIndex]?.href).toBe("/flow");
  });
});
