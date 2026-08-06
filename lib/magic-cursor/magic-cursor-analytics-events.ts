import { trackEvent } from "@/lib/analytics";

export function trackMagicCursorRelatedEffectClick(target: string) {
  trackEvent("magic_cursor_related_effect_click", { tool: "magic_cursor", target });
}

export function trackMagicCursorRelatedToolClick(target: string) {
  trackEvent("magic_cursor_related_tool_click", { tool: "magic_cursor", target });
}

export function trackMagicCursorHubEffectLinkClick(effect: string) {
  trackEvent("magic_cursor_hub_effect_click", { tool: "magic_cursor", effect });
}
