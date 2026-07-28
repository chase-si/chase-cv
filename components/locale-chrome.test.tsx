import { cleanup, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { afterEach, describe, expect, it, vi } from "vitest";

import { LocaleChrome } from "@/components/locale-chrome";
import enMessages from "@/messages/en.json";

const mockUsePathname = vi.fn(() => "/");

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
  usePathname: () => mockUsePathname(),
}));

vi.mock("@/components/site-nav", () => ({
  SiteNav: () => <nav data-testid="site-nav">Site navigation</nav>,
}));

afterEach(() => {
  cleanup();
  mockUsePathname.mockReturnValue("/");
});

describe("LocaleChrome", () => {
  it("shows site navigation on the dudu scanner route", () => {
    mockUsePathname.mockReturnValue("/dudu-scanner");
    render(
      <NextIntlClientProvider locale="en" messages={enMessages}>
        <LocaleChrome>
          <main>Scanner</main>
        </LocaleChrome>
      </NextIntlClientProvider>,
    );

    expect(screen.getByTestId("site-nav")).toBeInTheDocument();
    expect(screen.getByText("Scanner")).toBeInTheDocument();
  });

  it("keeps site navigation on other localized routes", () => {
    mockUsePathname.mockReturnValue("/flow");
    render(
      <NextIntlClientProvider locale="en" messages={enMessages}>
        <LocaleChrome>
          <main>Flow</main>
        </LocaleChrome>
      </NextIntlClientProvider>,
    );

    expect(screen.getByTestId("site-nav")).toBeInTheDocument();
  });
});
