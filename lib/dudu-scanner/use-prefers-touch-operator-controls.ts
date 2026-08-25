"use client";

import { useEffect, useState } from "react";

import {
  prefersTouchOperatorControls,
  NARROW_OPERATOR_CONTROLS_MEDIA_QUERY,
  TOUCH_OPERATOR_CONTROLS_MEDIA_QUERY,
} from "@/lib/dudu-scanner/touch-environment";

export function usePrefersTouchOperatorControls(): boolean {
  const [prefersTouch, setPrefersTouch] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) {
      return;
    }
    const touchMedia = window.matchMedia(TOUCH_OPERATOR_CONTROLS_MEDIA_QUERY);
    const narrowMedia = window.matchMedia(NARROW_OPERATOR_CONTROLS_MEDIA_QUERY);
    const sync = () => setPrefersTouch(prefersTouchOperatorControls());
    sync();
    touchMedia.addEventListener("change", sync);
    narrowMedia.addEventListener("change", sync);
    return () => {
      touchMedia.removeEventListener("change", sync);
      narrowMedia.removeEventListener("change", sync);
    };
  }, []);

  return prefersTouch;
}
