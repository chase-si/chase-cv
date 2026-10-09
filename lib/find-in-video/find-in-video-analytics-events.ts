import { trackEvent } from "@/lib/analytics";

export function trackFindInVideoRelatedToolClick(target: string) {
  trackEvent("find_in_video_related_tool_click", { tool: "find_in_video", target });
}

export function trackFindInVideoProfileClick() {
  trackEvent("find_in_video_profile_click", { tool: "find_in_video" });
}

export function trackFindInVideoContactClick(channel: string) {
  trackEvent("find_in_video_contact_click", { tool: "find_in_video", channel });
}
