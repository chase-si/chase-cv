export const DUDU_SCANNER_PATHNAME = "/dudu-scanner";

export function isDuduScannerPathname(pathname: string) {
  const normalized = pathname.endsWith("/") && pathname.length > 1 ? pathname.slice(0, -1) : pathname;
  return normalized === DUDU_SCANNER_PATHNAME;
}
