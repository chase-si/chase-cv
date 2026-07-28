import type { DuduScannerRoundPhase } from "@/lib/dudu-scanner/round-state";

export const DUDU_SCANNER_IMMERSIVE_SESSION_KEY = "dudu-scanner-immersive-v1";

export const DUDU_SCANNER_IMMERSIVE_HISTORY_STATE = { duduScannerImmersive: true } as const;

export type DuduScannerHistoryStorage = Pick<History, "pushState">;

export function isImmersiveRoundPhase(phase: DuduScannerRoundPhase): boolean {
  return phase === "scan" || phase === "result";
}

export function pushImmersiveHistoryEntry(history: DuduScannerHistoryStorage, href: string): void {
  history.pushState(DUDU_SCANNER_IMMERSIVE_HISTORY_STATE, "", href);
}

export function clearImmersiveHistoryEntry(
  history: Pick<History, "state" | "replaceState">,
  href: string,
): void {
  const state = history.state as { duduScannerImmersive?: boolean } | null;
  if (state?.duduScannerImmersive) {
    history.replaceState(null, "", href);
  }
}

export function shouldHandleScannerPopState(phase: DuduScannerRoundPhase): boolean {
  return isImmersiveRoundPhase(phase);
}

export function syncImmersiveSessionMarker(
  storage: Pick<Storage, "setItem" | "removeItem">,
  phase: DuduScannerRoundPhase,
): void {
  if (isImmersiveRoundPhase(phase)) {
    storage.setItem(DUDU_SCANNER_IMMERSIVE_SESSION_KEY, "1");
    return;
  }
  storage.removeItem(DUDU_SCANNER_IMMERSIVE_SESSION_KEY);
}

export function clearImmersiveSessionMarker(storage: Pick<Storage, "removeItem">): void {
  storage.removeItem(DUDU_SCANNER_IMMERSIVE_SESSION_KEY);
}
