"use client";

import type { RefObject } from "react";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

import { registerScrollReveals, runHeroIntro } from "@/lib/homepage-motion/animations";
import { getHomepageMotionCapabilities } from "@/lib/homepage-motion/capabilities";

gsap.registerPlugin(ScrollTrigger);

export function useHomepageScroll(rootRef: RefObject<HTMLElement | null>) {
  const lenisRef = useRef<Lenis | null>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) {
      return;
    }

    const capabilities = getHomepageMotionCapabilities();
    let lenis: Lenis | null = null;
    let ticker: ((time: number) => void) | null = null;

    const ctx = gsap.context(() => {
      if (capabilities.animate) {
        runHeroIntro(root);
        registerScrollReveals(root);
      }

      if (capabilities.lenis) {
        lenis = new Lenis({
          duration: 1.1,
          smoothWheel: true,
        });
        lenisRef.current = lenis;
        lenis.on("scroll", ScrollTrigger.update);

        ticker = (time: number) => {
          lenis?.raf(time * 1000);
        };
        gsap.ticker.add(ticker);
        gsap.ticker.lagSmoothing(0);
      }

      ScrollTrigger.refresh();
    }, root);

    return () => {
      if (ticker) {
        gsap.ticker.remove(ticker);
      }
      lenis?.destroy();
      lenisRef.current = null;
      ctx.revert();
    };
  }, [rootRef]);

  return lenisRef;
}
