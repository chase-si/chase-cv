import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { useImageToUiRouteRestore } from "@/lib/image-to-ui/use-image-to-ui-route-restore";

const pathnameState = vi.hoisted(() => ({ current: "/image-to-ui" }));

vi.mock("next/navigation", () => ({
  usePathname: () => pathnameState.current,
}));

describe("useImageToUiRouteRestore", () => {
  afterEach(() => {
    pathnameState.current = "/image-to-ui";
  });

  it("calls restore when navigating from another route back to image-to-ui", () => {
    pathnameState.current = "/about";
    const onRestore = vi.fn();

    const { rerender } = renderHook(() => useImageToUiRouteRestore(onRestore));

    pathnameState.current = "/image-to-ui";
    rerender();

    expect(onRestore).toHaveBeenCalledTimes(1);
  });

  it("calls restore when returning to a locale-prefixed image-to-ui route", () => {
    pathnameState.current = "/about";
    const onRestore = vi.fn();
    const pathnameAdapter = {
      isImageToUiRoute: (pathname: string) => pathname === "/zh/image-to-ui",
    };

    const { rerender } = renderHook(() =>
      useImageToUiRouteRestore(onRestore, { pathnameAdapter }),
    );

    pathnameState.current = "/zh/image-to-ui";
    rerender();

    expect(onRestore).toHaveBeenCalledTimes(1);
  });

  it("calls restore on persisted pageshow while on image-to-ui", () => {
    const onRestore = vi.fn();

    renderHook(() => useImageToUiRouteRestore(onRestore));

    act(() => {
      window.dispatchEvent(new PageTransitionEvent("pageshow", { persisted: true }));
    });

    expect(onRestore).toHaveBeenCalledTimes(1);
  });
});
