import { trackEvent } from "@/lib/analytics";

export function trackDuduScannerRelatedToolClick(target: string) {
  trackEvent("dudu_scanner_related_tool_click", { tool: "dudu_scanner", target });
}

export function trackDuduScannerProfileClick() {
  trackEvent("dudu_scanner_profile_click", { tool: "dudu_scanner" });
}

export function trackDuduScannerContactClick(channel: string) {
  trackEvent("dudu_scanner_contact_click", { tool: "dudu_scanner", channel });
}
