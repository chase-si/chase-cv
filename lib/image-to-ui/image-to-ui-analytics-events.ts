import { trackEvent } from "@/lib/analytics";

export function trackImageToUiRelatedToolClick(target: string) {
  trackEvent("image_to_ui_related_tool_click", { tool: "image_to_ui", target });
}

export function trackImageToUiProfileClick() {
  trackEvent("image_to_ui_profile_click", { tool: "image_to_ui" });
}

export function trackImageToUiContactClick(channel: string) {
  trackEvent("image_to_ui_contact_click", { tool: "image_to_ui", channel });
}
