import { MAGIC_CURSOR_EFFECT_ORDER } from "@/lib/constants/magic-cursor";

export type IndexedSeoRoute = {
  pathname: string;
  lastModified: Date;
};

const MAJOR_CONTENT_UPDATES = {
  homepage: "2026-03-01",
  imageToUi: "2026-02-15",
  flow: "2026-02-20",
  duduScanner: "2026-03-10",
  magicCursorHub: "2026-01-20",
  magicCursorEffect: "2026-01-20",
} as const;

function createIndexedSeoRoute(
  pathname: string,
  lastModified: string,
): IndexedSeoRoute {
  return {
    pathname,
    lastModified: new Date(lastModified),
  };
}

const coreIndexedSeoRoutes: readonly IndexedSeoRoute[] = [
  createIndexedSeoRoute("/", MAJOR_CONTENT_UPDATES.homepage),
  createIndexedSeoRoute("/image-to-ui", MAJOR_CONTENT_UPDATES.imageToUi),
  createIndexedSeoRoute("/flow", MAJOR_CONTENT_UPDATES.flow),
  createIndexedSeoRoute("/dudu-scanner", MAJOR_CONTENT_UPDATES.duduScanner),
  createIndexedSeoRoute("/magic-cursor", MAJOR_CONTENT_UPDATES.magicCursorHub),
];

const magicCursorEffectRoutes: readonly IndexedSeoRoute[] =
  MAGIC_CURSOR_EFFECT_ORDER.map((effect) =>
    createIndexedSeoRoute(
      `/magic-cursor/${effect}`,
      MAJOR_CONTENT_UPDATES.magicCursorEffect,
    ),
  );

const indexedSeoRoutes: readonly IndexedSeoRoute[] = [
  ...coreIndexedSeoRoutes,
  ...magicCursorEffectRoutes,
];

export function getIndexedSeoRoutes(): readonly IndexedSeoRoute[] {
  return indexedSeoRoutes;
}

export function getIndexedPathnames(): readonly string[] {
  return indexedSeoRoutes.map((route) => route.pathname);
}
