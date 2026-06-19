import { routing } from "@/i18n/routing";

/**
 * Resolves whether a Next.js pathname is the image-to-ui tool route (including locale prefixes).
 * Inject at the hook boundary so tests and future routing changes do not hard-code a single path.
 */
export type ImageToUiPathnameAdapter = {
  isImageToUiRoute: (pathname: string) => boolean;
};

export function createDefaultImageToUiPathnameAdapter(): ImageToUiPathnameAdapter {
  const localeAlternation = routing.locales.join("|");
  const pattern = new RegExp(`^(/(${localeAlternation}))?/image-to-ui$`);

  return {
    isImageToUiRoute(pathname: string) {
      const normalized = pathname.replace(/\/$/, "") || "/";
      return pattern.test(normalized);
    },
  };
}

/** @deprecated Prefer {@link createDefaultImageToUiPathnameAdapter}. Default-locale path segment only. */
export const IMAGE_TO_UI_ROUTE_PATH = "/image-to-ui";
