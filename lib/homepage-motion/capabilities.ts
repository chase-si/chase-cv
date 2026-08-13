import {
  resolveBrandMotionCapabilities,
} from "@/lib/performance/brand-motion-policy";

export type HomepageMotionCapabilities = {
  animate: boolean;
  lenis: boolean;
};

export function getHomepageMotionCapabilities(): HomepageMotionCapabilities {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return { animate: false, lenis: false };
  }

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const connection = (
    navigator as Navigator & { connection?: { saveData?: boolean } }
  ).connection;

  const capabilities = resolveBrandMotionCapabilities({
    reducedMotion,
    finePointer,
    saveData: connection?.saveData,
    hardwareConcurrency: navigator.hardwareConcurrency,
    isVisible: true,
  });

  return {
    animate: capabilities.runDecorativeAnimation,
    lenis: capabilities.runSmoothScroll,
  };
}
