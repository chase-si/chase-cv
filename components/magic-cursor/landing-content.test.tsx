import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";
import { describe, expect, it, vi } from "vitest";

import { MagicCursorLandingContent } from "@/components/magic-cursor/landing-content";
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
    onClick,
    className,
  }: {
    href: string;
    children: ReactNode;
    onClick?: () => void;
    className?: string;
  }) => (
    <a href={href} onClick={onClick} className={className}>
      {children}
    </a>
  ),
}));

describe("MagicCursorLandingContent", () => {
  it("renders indexable hub copy and links to every effect detail page", async () => {
    const ui = await MagicCursorLandingContent();
    render(
      <NextIntlClientProvider locale="en" messages={enMessages}>
        {ui}
      </NextIntlClientProvider>,
    );

    expect(screen.getByTestId("magic-cursor-landing-content")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /What this library is for/i })).toBeInTheDocument();
    expect(screen.getByTestId("magic-cursor-effect-catalog").querySelectorAll("a").length).toBe(9);
    expect(
      screen.getByTestId("magic-cursor-effect-catalog").querySelector('a[href="/magic-cursor/ring"]'),
    ).not.toBeNull();
  });
});
