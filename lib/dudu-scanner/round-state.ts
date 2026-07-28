export type DuduScannerRoundPhase = "config" | "scan" | "result";

export type DuduScannerRoundTransient = "no-signal" | "fullscreen-hint";

export type DuduScannerScanFlags = {
  targetRevealed: boolean;
  locking: boolean;
};

export type DuduScannerRoundState = {
  phase: DuduScannerRoundPhase;
  scan: DuduScannerScanFlags;
  transient: DuduScannerRoundTransient | null;
};

export type DuduScannerRoundAction =
  | { type: "START_SCAN" }
  | { type: "REVEAL_TARGET" }
  | { type: "LOCK_SIGNAL" }
  | { type: "LOCK_COMPLETE" }
  | { type: "SCAN_AGAIN" }
  | { type: "CHANGE_TARGET" }
  | { type: "FULLSCREEN_UNAVAILABLE" }
  | { type: "CLEAR_TRANSIENT" };

const initialScanFlags: DuduScannerScanFlags = {
  targetRevealed: false,
  locking: false,
};

export function createInitialRoundState(): DuduScannerRoundState {
  return {
    phase: "config",
    scan: { ...initialScanFlags },
    transient: null,
  };
}

function freshScanState(transient: DuduScannerRoundTransient | null = null): DuduScannerRoundState {
  return {
    phase: "scan",
    scan: { ...initialScanFlags },
    transient,
  };
}

export function duduScannerRoundReducer(
  state: DuduScannerRoundState,
  action: DuduScannerRoundAction,
): DuduScannerRoundState {
  switch (action.type) {
    case "START_SCAN":
      if (state.phase !== "config") {
        return state;
      }
      return freshScanState();

    case "REVEAL_TARGET":
      if (state.phase !== "scan" || state.scan.locking) {
        return state;
      }
      return {
        ...state,
        scan: { ...state.scan, targetRevealed: true },
        transient: null,
      };

    case "LOCK_SIGNAL":
      if (state.phase !== "scan" || state.scan.locking) {
        return state;
      }
      if (!state.scan.targetRevealed) {
        return { ...state, transient: "no-signal" };
      }
      return {
        ...state,
        scan: { ...state.scan, locking: true },
        transient: null,
      };

    case "LOCK_COMPLETE":
      if (state.phase !== "scan" || !state.scan.locking) {
        return state;
      }
      return {
        phase: "result",
        scan: { ...initialScanFlags },
        transient: null,
      };

    case "SCAN_AGAIN":
      if (state.phase !== "result") {
        return state;
      }
      return freshScanState();

    case "CHANGE_TARGET":
      if (state.phase !== "result") {
        return state;
      }
      return createInitialRoundState();

    case "FULLSCREEN_UNAVAILABLE":
      if (state.phase !== "scan") {
        return state;
      }
      return { ...state, transient: "fullscreen-hint" };

    case "CLEAR_TRANSIENT":
      if (state.transient === null) {
        return state;
      }
      return { ...state, transient: null };

    default: {
      const _exhaustive: never = action;
      return _exhaustive;
    }
  }
}

export const DUDU_SCANNER_REVEAL_DURATION_MS = 1500;
export const DUDU_SCANNER_LOCK_DURATION_MS = 1000;
export const DUDU_SCANNER_TRANSIENT_DURATION_MS = 2800;
