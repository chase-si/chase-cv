import { cleanup, render, screen, within } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { afterEach, describe, expect, it, vi } from "vitest";

import { HomepageHero } from "@/components/homepage/hero";
import { HomepageProjectShowcase } from "@/components/homepage/project-showcase";
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

function renderHomepage(locale: "en" | "zh") {
  const messages = locale === "zh" ? zhMessages : enMessages;
  return render(
    <NextIntlClientProvider locale={locale} messages={messages}>
      <HomepageHero />
      <HomepageProjectShowcase />
    </NextIntlClientProvider>,
  );
}

function getByExactTextContent(text: string) {
  return screen.getByText((_, node) => {
    if (!node || node.textContent !== text) return false;
    return Array.from(node.children).every((child) => child.textContent !== text);
  });
}

afterEach(() => {
  cleanup();
});

describe("Homepage content", () => {
  it("shows supplied Chinese hero positioning copy", () => {
    renderHomepage("zh");

    expect(
      getByExactTextContent("我是 Chase，一名从古法编程走来的 AI 构建者。"),
    ).toBeInTheDocument();
    expect(
      getByExactTextContent("8 年工程经验，现在我用 AI 把一个人的能力，扩展成一支团队。"),
    ).toBeInTheDocument();
  });

  it("shows natural English hero copy in parallel", () => {
    renderHomepage("en");

    expect(
      getByExactTextContent(
        "I’m Chase, an AI-powered builder shaped by eight years of old-school coding.",
      ),
    ).toBeInTheDocument();
    expect(
      getByExactTextContent(
        "Now, I use AI to build with the capabilities of an entire team.",
      ),
    ).toBeInTheDocument();
  });

  it("links hero CTAs to projects and work experience", () => {
    renderHomepage("en");

    expect(screen.getByRole("button", { name: "Explore the playground" })).toHaveAttribute(
      "href",
      "#projects",
    );
    expect(screen.getByRole("button", { name: "Work experience" })).toHaveAttribute(
      "href",
      "#experience",
    );
  });

  it("lists project cards in Image to UI, Magic Cursor, Flow Editor order with entry links", () => {
    renderHomepage("en");

    const section = screen.getByRole("region", { name: "Playground" });
    const titles = within(section)
      .getAllByRole("heading", { level: 3 })
      .map((heading) => heading.textContent);

    expect(titles).toEqual(["Image to UI", "Magic Cursor", "Flow Editor"]);

    expect(within(section).getByRole("button", { name: /Open Image to UI/i })).toHaveAttribute(
      "href",
      "/image-to-ui",
    );
    expect(within(section).getByRole("button", { name: /Open Magic Cursor/i })).toHaveAttribute(
      "href",
      "/magic-cursor",
    );
    expect(within(section).getByRole("button", { name: /Open Flow Editor/i })).toHaveAttribute(
      "href",
      "/flow",
    );
  });

  it("does not introduce AI-focused copy in the project section", () => {
    renderHomepage("en");

    const section = screen.getByRole("region", { name: "Playground" });
    expect(within(section).queryByText(/\bAI\b/i)).not.toBeInTheDocument();
    expect(within(section).queryByText(/artificial intelligence/i)).not.toBeInTheDocument();
  });
});
