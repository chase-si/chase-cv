"use client";

import { useEffect, useState } from "react";

import {
  prefersTouchOperatorControls,
  TOUCH_OPERATOR_CONTROLS_MEDIA_QUERY,
} from "@/lib/dudu-scanner/touch-environment";

export function usePrefersTouchOperatorControls(): boolean {
  const [prefersTouch, setPrefersTouch] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) {
      return;
    }
    const media = window.matchMedia(TOUCH_OPERATOR_CONTROLS_MEDIA_QUERY);
    const sync = () => setPrefersTouch(prefersTouchOperatorControls());
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  return prefersTouch;
}
