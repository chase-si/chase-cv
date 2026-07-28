"use client";

import { useSyncExternalStore } from "react";

import {
  getHomepageMotionCapabilities,
  type HomepageMotionCapabilities,
} from "@/lib/homepage-motion/capabilities";

const SERVER_CAPABILITIES: HomepageMotionCapabilities = {
  animate: false,
  lenis: false,
};

let cachedCapabilitiesSnapshot: HomepageMotionCapabilities = SERVER_CAPABILITIES;

function getCapabilitiesSnapshot(): HomepageMotionCapabilities {
  const next = getHomepageMotionCapabilities();
  if (
    cachedCapabilitiesSnapshot.animate === next.animate &&
    cachedCapabilitiesSnapshot.lenis === next.lenis
  ) {
    return cachedCapabilitiesSnapshot;
  }
  cachedCapabilitiesSnapshot = next;
  return cachedCapabilitiesSnapshot;
}

function subscribeToHomepageMotionCapabilities(onStoreChange: () => void) {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return () => {};
  }

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  const onChange = () => onStoreChange();

  reducedMotion.addEventListener("change", onChange);
  finePointer.addEventListener("change", onChange);

  return () => {
    reducedMotion.removeEventListener("change", onChange);
    finePointer.removeEventListener("change", onChange);
  };
}

export function useHomepageMotionCapabilities(): HomepageMotionCapabilities {
  return useSyncExternalStore(
    subscribeToHomepageMotionCapabilities,
    getCapabilitiesSnapshot,
    () => SERVER_CAPABILITIES,
  );
}
