import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";
import { describe, expect, it, vi } from "vitest";

import { MagicCursorEffectLandingContent } from "@/components/magic-cursor/effect-landing-content";
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

describe("MagicCursorEffectLandingContent", () => {
  it("renders behavior copy, parameter help, hub link, and related effects", async () => {
    const ui = await MagicCursorEffectLandingContent({ effect: "ring" });
    render(
      <NextIntlClientProvider locale="en" messages={enMessages}>
        {ui}
      </NextIntlClientProvider>,
    );

    expect(screen.getByTestId("magic-cursor-effect-landing-content")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Back to Magic Cursor overview/i })).toHaveAttribute(
      "href",
      "/magic-cursor",
    );
    expect(screen.getByTestId("magic-cursor-effect-params")).toHaveTextContent(/smoothing/);
    expect(screen.getByTestId("magic-cursor-related-effects").querySelectorAll("a").length).toBe(3);
  });
});
