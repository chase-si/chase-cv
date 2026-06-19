"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

import type { ImageToUiPathnameAdapter } from "@/lib/image-to-ui/image-to-ui-route-pathname";
import { createDefaultImageToUiPathnameAdapter } from "@/lib/image-to-ui/image-to-ui-route-pathname";

export type UseImageToUiRouteRestoreOptions = {
  pathnameAdapter?: ImageToUiPathnameAdapter;
};

export function useImageToUiRouteRestore(
  onRestore: () => void,
  options: UseImageToUiRouteRestoreOptions = {},
) {
  const pathnameAdapter = options.pathnameAdapter ?? createDefaultImageToUiPathnameAdapter();
  const pathname = usePathname();
  const previousPathnameRef = useRef<string | null>(null);

  useEffect(() => {
    const previousPathname = previousPathnameRef.current;
    const enteredFromAnotherRoute =
      previousPathname !== null &&
      !pathnameAdapter.isImageToUiRoute(previousPathname) &&
      pathnameAdapter.isImageToUiRoute(pathname);

    if (enteredFromAnotherRoute) {
      onRestore();
    }

    previousPathnameRef.current = pathname;
  }, [pathname, onRestore, pathnameAdapter]);

  useEffect(() => {
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted && pathnameAdapter.isImageToUiRoute(pathname)) {
        onRestore();
      }
    };

    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, [pathname, onRestore, pathnameAdapter]);
}
