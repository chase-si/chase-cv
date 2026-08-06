import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";
import { describe, expect, it, vi } from "vitest";

import { DuduScannerLandingContent } from "@/components/dudu-scanner/landing-content";
import enMessages from "@/messages/en.json";

vi.mock("next-intl/server", () => ({
  getTranslations: async (namespace: string) => {
    const root = namespace
      .split(".")
      .reduce<unknown>((acc, part) => (acc as Record<string, unknown>)?.[part], enMessages);

    return (key: string) => {
      const value = key
        .split(".")
        .reduce<unknown>((acc, part) => (acc as Record<string, unknown>)?.[part], root);
      return typeof value === "string" ? value : key;
    };
  },
}));

vi.mock("@/i18n/navigation", () => ({
  Link: ({
    href,
    children,
    className,
  }: {
    href: string | { pathname: string; hash?: string };
    children: ReactNode;
    className?: string;
  }) => {
    const resolved =
      typeof href === "string"
        ? href
        : `${href.pathname}${href.hash ? `#${href.hash}` : ""}`;
    return (
      <a href={resolved} className={className}>
        {children}
      </a>
    );
  },
}));

describe("DuduScannerLandingContent", () => {
  it("keeps playful FAQ copy and related links crawlable", async () => {
    const ui = await DuduScannerLandingContent();
    render(<NextIntlClientProvider locale="en">{ui}</NextIntlClientProvider>);

    expect(screen.getByTestId("dudu-scanner-landing-content")).toBeInTheDocument();
    expect(screen.getByTestId("dudu-scanner-faq")).toHaveTextContent(/silly browser toy/i);
    expect(screen.getByRole("link", { name: /Flow Editor/i })).toHaveAttribute("href", "/flow");
  });
});
