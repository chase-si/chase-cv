import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { ImageToUiLandingLinks } from "@/components/image-to-ui/landing-links";

const trackEventMock = vi.hoisted(() => vi.fn());

vi.mock("@/lib/analytics", () => ({
  trackEvent: trackEventMock,
}));

vi.mock("@/i18n/navigation", () => ({
  Link: ({
    href,
    children,
    onClick,
  }: {
    href: string;
    children: React.ReactNode;
    onClick?: () => void;
  }) => (
    <a href={href} onClick={onClick}>
      {children}
    </a>
  ),
}));

describe("ImageToUiLandingLinks", () => {
  it("emits brand handoff analytics when secondary links are clicked", () => {
    render(
      <>
        <ImageToUiLandingLinks kind="profile" href="/#experience">
          Work
        </ImageToUiLandingLinks>
        <ImageToUiLandingLinks kind="contact" href="/#contact" channel="contact_section">
          Contact
        </ImageToUiLandingLinks>
        <ImageToUiLandingLinks
          kind="related_tool"
          href="/magic-cursor"
          analyticsTarget="magic_cursor"
        >
          Magic Cursor
        </ImageToUiLandingLinks>
      </>,
    );

    fireEvent.click(screen.getByRole("link", { name: "Work" }));
    fireEvent.click(screen.getByRole("link", { name: "Contact" }));
    fireEvent.click(screen.getByRole("link", { name: "Magic Cursor" }));

    expect(trackEventMock).toHaveBeenCalledWith("image_to_ui_profile_click", {
      tool: "image_to_ui",
    });
    expect(trackEventMock).toHaveBeenCalledWith("image_to_ui_contact_click", {
      tool: "image_to_ui",
      channel: "contact_section",
    });
    expect(trackEventMock).toHaveBeenCalledWith("image_to_ui_related_tool_click", {
      tool: "image_to_ui",
      target: "magic_cursor",
    });
  });
});
