import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";
import { describe, expect, it, vi } from "vitest";

import { ImageToUiLandingContent } from "@/components/image-to-ui/landing-content";
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

vi.mock("next/navigation", () => ({
  usePathname: () => "/image-to-ui",
}));

vi.mock("@/i18n/navigation", () => ({
  Link: ({
    href,
    children,
    onClick,
    className,
  }: {
    href: string | { pathname: string; hash?: string };
    children: ReactNode;
    onClick?: () => void;
    className?: string;
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

describe("ImageToUiLandingContent", () => {
  it("renders indexable purpose, FAQ, and related tool links below the tool", async () => {
    const ui = await ImageToUiLandingContent();
    render(
      <NextIntlClientProvider locale="en" messages={enMessages}>
        {ui}
      </NextIntlClientProvider>,
    );

    expect(screen.getByTestId("image-to-ui-landing-content")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /What this tool does/i })).toBeInTheDocument();
    expect(screen.getByTestId("image-to-ui-faq")).toBeInTheDocument();
    expect(
      screen.getByText(/does not generate installable theme files/i),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Magic Cursor/i })).toHaveAttribute(
      "href",
      "/magic-cursor",
    );
    expect(screen.getByRole("link", { name: /View work experience/i })).toHaveAttribute(
      "href",
      "/#experience",
    );
  });
});
