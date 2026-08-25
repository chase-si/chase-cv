import { isDuduScannerScanMode, type DuduScannerScanMode } from "@/lib/dudu-scanner/catalog";

export const DUDU_SCANNER_MODE_QUERY_KEY = "mode";

export function readScanModeFromSearch(search: string): DuduScannerScanMode | null {
  const params = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
  const value = params.get(DUDU_SCANNER_MODE_QUERY_KEY);
  return isDuduScannerScanMode(value) ? value : null;
}

export function applyScanModeToUrl(href: string, scanMode: DuduScannerScanMode): string {
  const url = new URL(href, "https://dudu.local");
  url.searchParams.set(DUDU_SCANNER_MODE_QUERY_KEY, scanMode);
  return `${url.pathname}${url.search}${url.hash}`;
}

export function syncScanModeQueryParam(
  history: Pick<History, "replaceState" | "state">,
  location: Pick<Location, "href" | "pathname" | "search" | "hash">,
  scanMode: DuduScannerScanMode,
): void {
  const nextSearch = applyScanModeToUrl(
    `${location.pathname}${location.search}${location.hash}`,
    scanMode,
  );
  const currentSearch = `${location.pathname}${location.search}${location.hash}`;
  if (nextSearch === currentSearch) {
    return;
  }
  const nextHref = new URL(nextSearch, location.href).href;
  history.replaceState(history.state, "", nextHref);
}
