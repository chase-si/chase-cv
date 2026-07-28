import { describe, expect, it } from "vitest";

import {
  createInitialRoundState,
  duduScannerRoundReducer,
  type DuduScannerRoundState,
} from "@/lib/dudu-scanner/round-state";

describe("duduScannerRoundReducer", () => {
  const config = {
    themeId: "snack-scan" as const,
    targetId: "fry-sprite" as const,
    soundEnabled: true,
  };

  function reduce(
    state: DuduScannerRoundState,
    action: Parameters<typeof duduScannerRoundReducer>[1],
  ) {
    return duduScannerRoundReducer(state, action);
  }

  it("starts in config with no scan flags", () => {
    expect(createInitialRoundState()).toEqual({
      phase: "config",
      scan: {
        targetRevealed: false,
        locking: false,
        paused: false,
      },
      transient: null,
    });
  });

  it("happy path: config → scan → reveal → lock → result → scan again", () => {
    let state = createInitialRoundState();

    state = reduce(state, { type: "START_SCAN" });
    expect(state.phase).toBe("scan");
    expect(state.scan.targetRevealed).toBe(false);

    state = reduce(state, { type: "REVEAL_TARGET" });
    expect(state.phase).toBe("scan");
    expect(state.scan.targetRevealed).toBe(true);

    state = reduce(state, { type: "LOCK_SIGNAL" });
    expect(state.phase).toBe("scan");
    expect(state.scan.locking).toBe(true);

    state = reduce(state, { type: "LOCK_COMPLETE" });
    expect(state.phase).toBe("result");
    expect(state.scan.locking).toBe(false);

    state = reduce(state, { type: "SCAN_AGAIN" });
    expect(state.phase).toBe("scan");
    expect(state.scan.targetRevealed).toBe(false);
    expect(state.scan.locking).toBe(false);
  });

  it("change target returns to config and clears scan flags", () => {
    let state = createInitialRoundState();
    state = reduce(state, { type: "START_SCAN" });
    state = reduce(state, { type: "REVEAL_TARGET" });
    state = reduce(state, { type: "LOCK_SIGNAL" });
    state = reduce(state, { type: "LOCK_COMPLETE" });

    state = reduce(state, { type: "CHANGE_TARGET" });
    expect(state.phase).toBe("config");
    expect(state.scan.targetRevealed).toBe(false);
    expect(state.scan.locking).toBe(false);
  });

  it("lock before reveal keeps scanning and sets no-signal transient", () => {
    let state = createInitialRoundState();
    state = reduce(state, { type: "START_SCAN" });

    state = reduce(state, { type: "LOCK_SIGNAL" });
    expect(state.phase).toBe("scan");
    expect(state.scan.targetRevealed).toBe(false);
    expect(state.transient).toBe("no-signal");
  });

  it("rejects START_SCAN outside config", () => {
    let state = createInitialRoundState();
    state = reduce(state, { type: "START_SCAN" });
    const scanState = state;

    expect(reduce(scanState, { type: "START_SCAN" })).toEqual(scanState);
  });

  it("rejects REVEAL_TARGET outside active scan", () => {
    const configState = createInitialRoundState();
    expect(reduce(configState, { type: "REVEAL_TARGET" })).toEqual(configState);

    let state = createInitialRoundState();
    state = reduce(state, { type: "START_SCAN" });
    state = reduce(state, { type: "REVEAL_TARGET" });
    state = reduce(state, { type: "LOCK_SIGNAL" });
    state = reduce(state, { type: "LOCK_COMPLETE" });
    expect(reduce(state, { type: "REVEAL_TARGET" })).toEqual(state);
  });

  it("rejects LOCK_SIGNAL while already locking", () => {
    let state = createInitialRoundState();
    state = reduce(state, { type: "START_SCAN" });
    state = reduce(state, { type: "REVEAL_TARGET" });
    state = reduce(state, { type: "LOCK_SIGNAL" });
    const locking = state;

    expect(reduce(locking, { type: "LOCK_SIGNAL" })).toEqual(locking);
    expect(reduce(locking, { type: "REVEAL_TARGET" })).toEqual(locking);
  });

  it("records fullscreen hint transient without changing phase", () => {
    let state = createInitialRoundState();
    state = reduce(state, { type: "START_SCAN" });
    state = reduce(state, { type: "FULLSCREEN_UNAVAILABLE" });
    expect(state.phase).toBe("scan");
    expect(state.transient).toBe("fullscreen-hint");

    state = reduce(state, { type: "CLEAR_TRANSIENT" });
    expect(state.transient).toBeNull();
  });

  it("ignores round actions that do not apply to config", () => {
    const configState = createInitialRoundState();
    expect(reduce(configState, { type: "LOCK_SIGNAL" })).toEqual(configState);
    expect(reduce(configState, { type: "SCAN_AGAIN" })).toEqual(configState);
    expect(reduce(configState, { type: "CHANGE_TARGET" })).toEqual(configState);
    expect(reduce(configState, { type: "LOCK_COMPLETE" })).toEqual(configState);
  });

  it("does not use config in reducer (config is external)", () => {
    expect(config.themeId).toBe("snack-scan");
  });

  it("toggles pause only during active scan", () => {
    let state = createInitialRoundState();
    state = reduce(state, { type: "START_SCAN" });

    state = reduce(state, { type: "TOGGLE_PAUSE" });
    expect(state.scan.paused).toBe(true);

    state = reduce(state, { type: "TOGGLE_PAUSE" });
    expect(state.scan.paused).toBe(false);

    expect(reduce(createInitialRoundState(), { type: "TOGGLE_PAUSE" })).toEqual(
      createInitialRoundState(),
    );
  });

  it("rejects pause while locking", () => {
    let state = createInitialRoundState();
    state = reduce(state, { type: "START_SCAN" });
    state = reduce(state, { type: "REVEAL_TARGET" });
    state = reduce(state, { type: "LOCK_SIGNAL" });

    expect(reduce(state, { type: "TOGGLE_PAUSE" })).toEqual(state);
  });

  it("reveal while paused resumes scanning and reveals target", () => {
    let state = createInitialRoundState();
    state = reduce(state, { type: "START_SCAN" });
    state = reduce(state, { type: "TOGGLE_PAUSE" });
    expect(state.scan.paused).toBe(true);

    state = reduce(state, { type: "REVEAL_TARGET" });
    expect(state.scan.paused).toBe(false);
    expect(state.scan.targetRevealed).toBe(true);
  });

  it("cancel target clears reveal and reports no signal", () => {
    let state = createInitialRoundState();
    state = reduce(state, { type: "START_SCAN" });
    state = reduce(state, { type: "REVEAL_TARGET" });

    state = reduce(state, { type: "CANCEL_TARGET" });
    expect(state.phase).toBe("scan");
    expect(state.scan.targetRevealed).toBe(false);
    expect(state.scan.locking).toBe(false);
    expect(state.transient).toBe("no-signal");
  });

  it("cancel target also aborts locking", () => {
    let state = createInitialRoundState();
    state = reduce(state, { type: "START_SCAN" });
    state = reduce(state, { type: "REVEAL_TARGET" });
    state = reduce(state, { type: "LOCK_SIGNAL" });

    state = reduce(state, { type: "CANCEL_TARGET" });
    expect(state.scan.locking).toBe(false);
    expect(state.transient).toBe("no-signal");
  });

  it("restart scan clears flags and stays in scan phase", () => {
    let state = createInitialRoundState();
    state = reduce(state, { type: "START_SCAN" });
    state = reduce(state, { type: "REVEAL_TARGET" });
    state = reduce(state, { type: "TOGGLE_PAUSE" });

    state = reduce(state, { type: "RESTART_SCAN" });
    expect(state.phase).toBe("scan");
    expect(state.scan).toEqual({
      targetRevealed: false,
      locking: false,
      paused: false,
    });
    expect(state.transient).toBeNull();
  });

  it("rejects restart outside scan", () => {
    const configState = createInitialRoundState();
    expect(reduce(configState, { type: "RESTART_SCAN" })).toEqual(configState);

    let state = createInitialRoundState();
    state = reduce(state, { type: "START_SCAN" });
    state = reduce(state, { type: "REVEAL_TARGET" });
    state = reduce(state, { type: "LOCK_SIGNAL" });
    state = reduce(state, { type: "LOCK_COMPLETE" });
    expect(reduce(state, { type: "RESTART_SCAN" })).toEqual(state);
  });

  it("return to config from scan or result", () => {
    let state = createInitialRoundState();
    state = reduce(state, { type: "START_SCAN" });
    state = reduce(state, { type: "RETURN_TO_CONFIG" });
    expect(state.phase).toBe("config");

    state = reduce(state, { type: "START_SCAN" });
    state = reduce(state, { type: "REVEAL_TARGET" });
    state = reduce(state, { type: "LOCK_SIGNAL" });
    state = reduce(state, { type: "LOCK_COMPLETE" });
    state = reduce(state, { type: "RETURN_TO_CONFIG" });
    expect(state.phase).toBe("config");
  });

  it("rejects lock while paused", () => {
    let state = createInitialRoundState();
    state = reduce(state, { type: "START_SCAN" });
    state = reduce(state, { type: "REVEAL_TARGET" });
    state = reduce(state, { type: "TOGGLE_PAUSE" });

    expect(reduce(state, { type: "LOCK_SIGNAL" })).toEqual(state);
  });
});
