"use client";

import { sendGtagEvent } from "@/lib/gtag";

export type AnalyticsEventName =
  | "nav_click"
  | "outbound_click"
  | "effect_view"
  | "language_switch"
  | "image_to_ui_tool_start"
  | "image_to_ui_image_source"
  | "image_to_ui_palette_extracted"
  | "image_to_ui_palette_complete"
  | "image_to_ui_preview_generated"
  | "image_to_ui_related_tool_click"
  | "image_to_ui_profile_click"
  | "image_to_ui_contact_click"
  | "homepage_tool_click"
  | "homepage_contact_click"
  | "flow_related_tool_click"
  | "flow_profile_click"
  | "flow_contact_click"
  | "dudu_scanner_related_tool_click"
  | "dudu_scanner_profile_click"
  | "dudu_scanner_contact_click"
  | "magic_cursor_related_effect_click"
  | "magic_cursor_related_tool_click"
  | "magic_cursor_hub_effect_click";

export function trackEvent(
  name: AnalyticsEventName,
  params?: Record<string, string | number | boolean>
) {
  const id = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim();
  if (!id) return;
  sendGtagEvent(name, params);
}
