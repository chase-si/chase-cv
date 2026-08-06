import { MAGIC_CURSOR_EFFECT_ORDER } from "@/lib/constants/magic-cursor";
import type { EffectName } from "magic-cursor-effect";

import { DUDU_SCANNER_OG_IMAGE } from "@/lib/dudu-scanner/dudu-scanner-social-image";
import { FLOW_OG_IMAGE } from "@/lib/flow/flow-social-image";
import { IMAGE_TO_UI_OG_IMAGE } from "@/lib/image-to-ui/image-to-ui-social-image";
import { magicCursorEffectMetadataNamespace } from "@/lib/magic-cursor/effect-seo-data";
import {
  MAGIC_CURSOR_HUB_OG_IMAGE,
  magicCursorEffectOgImage,
} from "@/lib/magic-cursor/magic-cursor-social-image";
import { MAGIC_CURSOR_HUB_PATHNAME } from "@/lib/magic-cursor/routes";
import type { MetadataNamespace } from "@/lib/metadata";
import { HOME_OG_IMAGE } from "@/lib/seo/home-social-image";

import { getIndexedSeoRoutes } from "./route-registry";

export type IndexedRouteSocialImage = {
  path: string;
  width: number;
  height: number;
};

export type IndexedRouteMetadataBinding = {
  pathname: string;
  namespace: MetadataNamespace;
  socialImage: IndexedRouteSocialImage;
};

function bindingForPathname(pathname: string): IndexedRouteMetadataBinding {
  switch (pathname) {
    case "/":
      return { pathname, namespace: "metadata.home", socialImage: HOME_OG_IMAGE };
    case "/image-to-ui":
      return {
        pathname,
        namespace: "metadata.imageToUi",
        socialImage: IMAGE_TO_UI_OG_IMAGE,
      };
    case "/flow":
      return { pathname, namespace: "metadata.flow", socialImage: FLOW_OG_IMAGE };
    case "/dudu-scanner":
      return {
        pathname,
        namespace: "metadata.duduScanner",
        socialImage: DUDU_SCANNER_OG_IMAGE,
      };
    case MAGIC_CURSOR_HUB_PATHNAME:
      return {
        pathname,
        namespace: "metadata.magicCursor.hub",
        socialImage: MAGIC_CURSOR_HUB_OG_IMAGE,
      };
    default: {
      const effectPrefix = `${MAGIC_CURSOR_HUB_PATHNAME}/`;
      if (!pathname.startsWith(effectPrefix)) {
        throw new Error(`No metadata binding for indexed pathname: ${pathname}`);
      }
      const effect = pathname.slice(effectPrefix.length) as EffectName;
      if (!MAGIC_CURSOR_EFFECT_ORDER.includes(effect)) {
        throw new Error(`Unknown indexed Magic Cursor effect pathname: ${pathname}`);
      }
      return {
        pathname,
        namespace: magicCursorEffectMetadataNamespace(effect),
        socialImage: magicCursorEffectOgImage(effect),
      };
    }
  }
}

export function listIndexedRouteMetadataBindings(): IndexedRouteMetadataBinding[] {
  return getIndexedSeoRoutes().map((route) => bindingForPathname(route.pathname));
}

export function getIndexedRouteMetadataBinding(
  pathname: string,
): IndexedRouteMetadataBinding {
  return bindingForPathname(pathname);
}
