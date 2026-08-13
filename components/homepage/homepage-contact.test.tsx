import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { afterEach, describe, expect, it, vi } from "vitest";

import { HomepageContact } from "@/components/homepage/homepage-contact";
import {
  HOMEPAGE_CONTACT_EMAIL,
  HOMEPAGE_CONTACT_GITHUB_URL,
  HOMEPAGE_CONTACT_UPWORK_URL,
} from "@/lib/homepage-contact/constants";
import enMessages from "@/messages/en.json";

const trackEventMock = vi.hoisted(() => vi.fn());

vi.mock("@/lib/analytics", () => ({
  trackEvent: trackEventMock,
}));

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
    <a href={href} onClick={onClick} {...props}>
      {children}
    </a>
  ),
}));

afterEach(() => {
  cleanup();
  trackEventMock.mockClear();
});

describe("HomepageContact", () => {
  it("emits homepage contact click analytics for each channel", () => {
    render(
      <NextIntlClientProvider locale="en" messages={enMessages}>
        <HomepageContact />
      </NextIntlClientProvider>,
    );

    fireEvent.click(screen.getByRole("link", { name: /Send email/i }));
    fireEvent.click(screen.getByRole("link", { name: /Open profile/i }));
    fireEvent.click(screen.getByRole("link", { name: /View repos/i }));

    expect(trackEventMock).toHaveBeenCalledWith("homepage_contact_click", {
      channel: "email",
    });
    expect(trackEventMock).toHaveBeenCalledWith("outbound_click", {
      url: `mailto:${HOMEPAGE_CONTACT_EMAIL}`,
      target: "email",
    });
    expect(trackEventMock).toHaveBeenCalledWith("homepage_contact_click", {
      channel: "upwork",
    });
    expect(trackEventMock).toHaveBeenCalledWith("outbound_click", {
      url: HOMEPAGE_CONTACT_UPWORK_URL,
      target: "upwork",
    });
    expect(trackEventMock).toHaveBeenCalledWith("homepage_contact_click", {
      channel: "github",
    });
    expect(trackEventMock).toHaveBeenCalledWith("outbound_click", {
      url: HOMEPAGE_CONTACT_GITHUB_URL,
      target: "github",
    });
  });
});
