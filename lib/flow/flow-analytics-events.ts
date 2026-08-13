import { trackEvent } from "@/lib/analytics";

export function trackFlowRelatedToolClick(target: string) {
  trackEvent("flow_related_tool_click", { tool: "flow_editor", target });
}

export function trackFlowProfileClick() {
  trackEvent("flow_profile_click", { tool: "flow_editor" });
}

export function trackFlowContactClick(channel: string) {
  trackEvent("flow_contact_click", { tool: "flow_editor", channel });
}
