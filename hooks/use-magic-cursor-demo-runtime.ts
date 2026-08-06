"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { resolveBrandMotionCapabilities } from "@/lib/performance/brand-motion-policy";

function readBrandMotionSnapshot(isVisible: boolean) {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return resolveBrandMotionCapabilities({
      reducedMotion: true,
      finePointer: false,
      isVisible,
    });
  }

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
  const connection = (
    navigator as Navigator & { connection?: { saveData?: boolean } }
  ).connection;

  return resolveBrandMotionCapabilities({
    reducedMotion,
    finePointer: finePointer && !coarsePointer,
    saveData: connection?.saveData,
    hardwareConcurrency: navigator.hardwareConcurrency,
    isVisible,
  });
}

export function useMagicCursorDemoRuntime(baseEnabled: boolean) {
  const [demoRoot, setDemoRootState] = useState<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [mediaRevision, setMediaRevision] = useState(0);

  const setDemoRoot = useCallback((node: HTMLDivElement | null) => {
    setDemoRootState(node);
    if (!node) {
      setIsVisible(false);
    }
  }, []);

  const motion = useMemo(() => {
    void mediaRevision;
    return readBrandMotionSnapshot(isVisible);
  }, [isVisible, mediaRevision]);

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return;
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const coarsePointer = window.matchMedia("(pointer: coarse)");

    const refresh = () => {
      setMediaRevision((value) => value + 1);
    };

    reducedMotion.addEventListener("change", refresh);
    finePointer.addEventListener("change", refresh);
    coarsePointer.addEventListener("change", refresh);

    return () => {
      reducedMotion.removeEventListener("change", refresh);
      finePointer.removeEventListener("change", refresh);
      coarsePointer.removeEventListener("change", refresh);
    };
  }, []);

  useEffect(() => {
    if (!demoRoot) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry?.isIntersecting ?? false);
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.15 },
    );

    observer.observe(demoRoot);
    return () => {
      observer.disconnect();
    };
  }, [demoRoot]);

  const enabled =
    baseEnabled && motion.runDecorativeAnimation && isVisible;

  return { enabled, setDemoRoot };
}
