import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";
import { describe, expect, it, vi } from "vitest";

import { HomepageSeoContent } from "@/components/homepage/homepage-seo-content";
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
    onClick,
  }: {
    href: string | { pathname: string; hash?: string };
    children: ReactNode;
    className?: string;
    onClick?: () => void;
  }) => {
    const resolved =
      typeof href === "string"
        ? href
        : `${href.pathname}${href.hash ? `#${href.hash}` : ""}`;
    return (
      <a href={resolved} onClick={onClick} className={className}>
        {children}
      </a>
    );
  },
}));

describe("HomepageSeoContent", () => {
  it("lists descriptive playground tool links", async () => {
    const ui = await HomepageSeoContent();
    render(<NextIntlClientProvider locale="en">{ui}</NextIntlClientProvider>);

    expect(screen.getByTestId("homepage-seo-content")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Image to UI/i })).toHaveAttribute(
      "href",
      "/image-to-ui",
    );
    expect(screen.getByRole("link", { name: /Contact Chase/i })).toHaveAttribute(
      "href",
      "/#contact",
    );
  });
});
