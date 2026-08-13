import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { describe, expect, it, vi } from "vitest";

import { MagicCursorEffectPage } from "@/app/[locale]/magic-cursor/[effectName]/view";
import enMessages from "@/messages/en.json";

vi.mock("@/lib/analytics", () => ({
  trackEvent: vi.fn(),
}));

vi.mock("@/i18n/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

vi.mock("@/components/magic-cursor/demo-detail", () => ({
  MagicCursorDemoDetail: () => <div>demo</div>,
}));

vi.mock("@/components/magic-cursor/effect-code", () => ({
  MagicCursorEffectCode: () => <div>code</div>,
}));

describe("MagicCursorEffectPage", () => {
  it("appends the effect name to the hub title and scrolls the picker inside the left card", () => {
    render(
      <NextIntlClientProvider locale="en" messages={enMessages}>
        <MagicCursorEffectPage
          effect="flame"
          description="Try the flame cursor"
          hubLabel="Magic Cursor effect library"
          breadcrumbLabel="Flame"
        />
      </NextIntlClientProvider>,
    );

    expect(
      screen.getByRole("heading", { level: 1, name: "Magic Cursor effect library / Flame" }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("navigation", { name: "breadcrumb" })).not.toBeInTheDocument();

    const sidebarTitle = screen.getByText(enMessages.magicCursor.effectsTitle);
    const sidebarCard = sidebarTitle.closest("[data-slot=card]");
    expect(sidebarCard?.querySelector("[data-slot=card-scroll-area]")).not.toBeNull();
  });
});
