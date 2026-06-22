import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { afterEach, describe, expect, it, vi } from "vitest";

import { SiteNavActions } from "@/components/site-nav-actions";
import enMessages from "@/messages/en.json";
import zhMessages from "@/messages/zh.json";

vi.mock("@/i18n/navigation", () => ({
  Link: ({
    href,
    children,
    onClick,
    ...props
  }: {
    href: string;
    children: React.ReactNode;
    onClick?: React.MouseEventHandler<HTMLAnchorElement>;
  }) => (
    <a
      href={href}
      onClick={(event) => {
        event.preventDefault();
        onClick?.(event);
      }}
      {...props}
    >
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
  it("reveals localized project destinations from a single Projects control (English)", async () => {
    renderNav("en");

    const nav = screen.getByRole("navigation", { name: "Primary navigation" });
    const projectsButton = within(nav).getByRole("button", { name: "Projects" });

    expect(within(nav).queryByRole("link", { name: /Works/i })).not.toBeInTheDocument();
    expect(within(nav).queryByRole("link", { name: /Flow editor/i })).not.toBeInTheDocument();

    fireEvent.click(projectsButton);

    const projects = within(nav).getByRole("menu", { name: "Projects" });
    expect(within(projects).getByRole("menuitem", { name: /Magic Cursor/i })).toHaveAttribute(
      "href",
      "/magic-cursor",
    );
    expect(within(projects).getByRole("menuitem", { name: /Image to UI/i })).toHaveAttribute(
      "href",
      "/image-to-ui",
    );
    expect(within(projects).getByRole("menuitem", { name: /Flow Editor/i })).toHaveAttribute(
      "href",
      "/flow",
    );
    expect(screen.getByText("Explore configurable cursor effects.")).toBeInTheDocument();
    expect(screen.getByText("Turn painting palettes into interface themes.")).toBeInTheDocument();
    expect(screen.getByText("Visualize and edit structured flows.")).toBeInTheDocument();

    fireEvent.keyDown(projectsButton, { key: "Escape" });
    expect(within(nav).queryByRole("menu", { name: "Projects" })).not.toBeInTheDocument();
  });

  it("keeps existing nav affordances and tracks project clicks consistently", async () => {
    const { trackEvent } = await import("@/lib/analytics");
    renderNav("zh");

    const nav = screen.getByRole("navigation", { name: "主导航" });
    fireEvent.click(within(nav).getByRole("button", { name: "项目" }));

    const projects = within(nav).getByRole("menu", { name: "项目" });
    expect(within(projects).getByText("探索可配置的鼠标特效。")).toBeInTheDocument();
    expect(within(projects).getByText("把名画配色变成界面主题。")).toBeInTheDocument();
    expect(within(projects).getByText("可视化编辑结构化流程。")).toBeInTheDocument();

    fireEvent.click(within(projects).getByRole("menuitem", { name: /Image to UI/i }));

    expect(trackEvent).toHaveBeenCalledWith("nav_click", {
      target: "image_to_ui",
      href: "/image-to-ui",
    });
    expect(within(nav).getByRole("link", { name: "博客" })).toHaveAttribute(
      "href",
      "https://blog.dashuaibi.vip/blog",
    );
    expect(within(nav).getByRole("link", { name: "GitHub" })).toHaveAttribute(
      "href",
      "https://github.com/chase-si",
    );
  });

  it("exposes projects, blog, and GitHub in a compact mobile menu", () => {
    renderNav("en");

    const mobileNav = screen.getByRole("navigation", { name: "Mobile navigation" });
    fireEvent.click(within(mobileNav).getByRole("button", { name: "Menu" }));

    const menu = within(mobileNav).getByRole("menu", { name: "Menu" });
    expect(within(menu).getByRole("menuitem", { name: /Magic Cursor/i })).toHaveAttribute(
      "href",
      "/magic-cursor",
    );
    expect(within(menu).getByRole("menuitem", { name: /Image to UI/i })).toHaveAttribute(
      "href",
      "/image-to-ui",
    );
    expect(within(menu).getByRole("menuitem", { name: /Flow Editor/i })).toHaveAttribute(
      "href",
      "/flow",
    );
    expect(within(menu).getByRole("menuitem", { name: "Blog" })).toHaveAttribute(
      "href",
      "https://blog.dashuaibi.vip/blog",
    );
    expect(within(menu).getByRole("menuitem", { name: "GitHub" })).toHaveAttribute(
      "href",
      "https://github.com/chase-si",
    );
  });
});
