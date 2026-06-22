"use client";

import { sendGtagEvent } from "@/lib/gtag";

export type AnalyticsEventName =
  | "nav_click"
  | "outbound_click"
  | "effect_view"
  | "language_switch";

export function trackEvent(
  name: AnalyticsEventName,
  params?: Record<string, string | number | boolean>
) {
  const id = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim();
  if (!id) return;
  sendGtagEvent(name, params);
}
