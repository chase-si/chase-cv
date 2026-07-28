"use client";

import { useEffect, useRef } from "react";

import { useHomepageScroll } from "@/hooks/use-homepage-scroll";
import { HOMEPAGE_HASH_SCROLL_OFFSET } from "@/lib/homepage-motion/config";

type Props = {
  children: React.ReactNode;
};

export function HomepageScrollProvider({ children }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const lenisRef = useHomepageScroll(rootRef);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) {
      return;
    }

    const onClick = (event: MouseEvent) => {
      const lenis = lenisRef.current;
      if (!lenis) {
        return;
      }

      if (event.defaultPrevented || event.button !== 0) {
        return;
      }
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      const anchor = (event.target as Element | null)?.closest("a[href^='#']");
      if (!anchor || !root.contains(anchor)) {
        return;
      }

      const href = anchor.getAttribute("href");
      if (!href || href === "#") {
        return;
      }

      const target = root.querySelector(href);
      if (!(target instanceof HTMLElement)) {
        return;
      }

      event.preventDefault();
      lenis.scrollTo(target, { offset: HOMEPAGE_HASH_SCROLL_OFFSET });
    };

    root.addEventListener("click", onClick);
    return () => root.removeEventListener("click", onClick);
  }, [lenisRef]);

  return (
    <div ref={rootRef} className="relative flex min-h-0 flex-1 flex-col">
      {children}
    </div>
  );
}
