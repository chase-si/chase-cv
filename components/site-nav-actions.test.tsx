import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { SiteNavActions } from "@/components/site-nav-actions";

vi.mock("@/lib/analytics", () => ({
  trackEvent: vi.fn(),
}));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("SiteNavActions", () => {
  it("lists 流程编辑器 between 作品 and 博客 with /flow link", () => {
    render(<SiteNavActions />);

    const nav = screen.getByRole("navigation");
    const links = [...nav.querySelectorAll("a")].map((anchor) => ({
      text: anchor.textContent?.trim(),
      href: anchor.getAttribute("href"),
    }));

    const labels = links.map((link) => link.text);
    const worksIndex = labels.indexOf("作品");
    const flowIndex = labels.indexOf("流程编辑器");
    const blogIndex = labels.indexOf("博客");

    expect(worksIndex).toBeGreaterThanOrEqual(0);
    expect(flowIndex).toBeGreaterThan(worksIndex);
    expect(blogIndex).toBeGreaterThan(flowIndex);
    expect(links[flowIndex]?.href).toBe("/flow");
  });
});
