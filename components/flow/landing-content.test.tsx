import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";
import { describe, expect, it, vi } from "vitest";

import { FlowLandingContent } from "@/components/flow/landing-content";
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

describe("FlowLandingContent", () => {
  it("renders indexable FAQ and related tool links", async () => {
    const ui = await FlowLandingContent();
    render(<NextIntlClientProvider locale="en">{ui}</NextIntlClientProvider>);

    expect(screen.getByTestId("flow-landing-content")).toBeInTheDocument();
    expect(screen.getByTestId("flow-faq")).toHaveTextContent(/import my own production flow/i);
    expect(screen.getByRole("link", { name: /Magic Cursor/i })).toHaveAttribute(
      "href",
      "/magic-cursor",
    );
  });
});
