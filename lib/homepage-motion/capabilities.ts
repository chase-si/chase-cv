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

  return {
    animate: !reducedMotion,
    lenis: !reducedMotion && finePointer,
  };
}
