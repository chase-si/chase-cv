"use client";

import { sendGAEvent } from "@next/third-parties/google";

export type AnalyticsEventName =
  | "nav_click"
  | "outbound_click"
  | "effect_view";

export function trackEvent(
  name: AnalyticsEventName,
  params?: Record<string, string | number | boolean>
) {
  const id = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim();
  if (!id) return;
  sendGAEvent("event", name, params ?? {});
}
