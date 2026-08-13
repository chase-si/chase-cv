import { trackEvent } from "@/lib/analytics";

export function trackHomepageToolClick(target: string) {
  trackEvent("homepage_tool_click", { target });
}

export function trackHomepageContactClick(channel: string) {
  trackEvent("homepage_contact_click", { channel });
}
