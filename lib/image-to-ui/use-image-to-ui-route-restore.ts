"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export const IMAGE_TO_UI_ROUTE_PATH = "/image-to-ui";

export function useImageToUiRouteRestore(onRestore: () => void) {
  const pathname = usePathname();
  const previousPathnameRef = useRef<string | null>(null);

  useEffect(() => {
    const previousPathname = previousPathnameRef.current;
    const enteredFromAnotherRoute =
      previousPathname !== null &&
      previousPathname !== IMAGE_TO_UI_ROUTE_PATH &&
      pathname === IMAGE_TO_UI_ROUTE_PATH;

    if (enteredFromAnotherRoute) {
      onRestore();
    }

    previousPathnameRef.current = pathname;
  }, [pathname, onRestore]);

  useEffect(() => {
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted && pathname === IMAGE_TO_UI_ROUTE_PATH) {
        onRestore();
      }
    };

    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, [pathname, onRestore]);
}
