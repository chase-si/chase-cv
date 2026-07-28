import { describe, expect, it } from "vitest";

import {
  DUDU_SCANNER_OPERATOR_TOUCH_CONTROLS,
  isDomainCommandAllowedInPhase,
  keyboardEventToDomainCommand,
  shouldPreventDefaultForScannerKey,
  touchControlIdToDomainCommand,
} from "@/lib/dudu-scanner/scanner-commands";

describe("keyboardEventToDomainCommand", () => {
  it("maps operator keys to domain commands", () => {
    expect(keyboardEventToDomainCommand(" ")).toEqual({ type: "FORCE_DISCOVERY" });
    expect(keyboardEventToDomainCommand("1")).toBeNull();
    expect(keyboardEventToDomainCommand("Enter")).toEqual({ type: "LOCK_SIGNAL" });
    expect(keyboardEventToDomainCommand("x")).toEqual({ type: "CANCEL_TARGET" });
    expect(keyboardEventToDomainCommand("R")).toEqual({ type: "RESTART_SCAN" });
    expect(keyboardEventToDomainCommand("m")).toEqual({ type: "TOGGLE_SOUND" });
    expect(keyboardEventToDomainCommand("F")).toEqual({ type: "RETRY_FULLSCREEN" });
  });

  it("returns null for unrelated keys", () => {
    expect(keyboardEventToDomainCommand("Escape")).toBeNull();
    expect(keyboardEventToDomainCommand("a")).toBeNull();
  });
});

describe("isDomainCommandAllowedInPhase", () => {
  it("allows scan commands only while scanning", () => {
    expect(isDomainCommandAllowedInPhase({ type: "TOGGLE_PAUSE" }, "scan")).toBe(true);
    expect(isDomainCommandAllowedInPhase({ type: "TOGGLE_PAUSE" }, "config")).toBe(false);
    expect(isDomainCommandAllowedInPhase({ type: "TOGGLE_PAUSE" }, "result")).toBe(false);
  });

  it("allows sound and fullscreen retry on result", () => {
    expect(isDomainCommandAllowedInPhase({ type: "TOGGLE_SOUND" }, "result")).toBe(true);
    expect(isDomainCommandAllowedInPhase({ type: "RETRY_FULLSCREEN" }, "result")).toBe(true);
    expect(isDomainCommandAllowedInPhase({ type: "FORCE_DISCOVERY" }, "result")).toBe(false);
  });

  it("allows sound and fullscreen on config", () => {
    expect(isDomainCommandAllowedInPhase({ type: "TOGGLE_SOUND" }, "config")).toBe(true);
    expect(isDomainCommandAllowedInPhase({ type: "RESTART_SCAN" }, "config")).toBe(false);
  });
});

describe("shouldPreventDefaultForScannerKey", () => {
  it("prevents space from scrolling during scanner handling", () => {
    expect(shouldPreventDefaultForScannerKey(" ")).toBe(true);
    expect(shouldPreventDefaultForScannerKey("1")).toBe(false);
  });
});

describe("touchControlIdToDomainCommand", () => {
  it("maps every operator touch control to the keyboard-equivalent domain command", () => {
    expect(touchControlIdToDomainCommand("pause-resume")).toEqual({ type: "TOGGLE_PAUSE" });
    expect(touchControlIdToDomainCommand("reveal")).toEqual({ type: "FORCE_DISCOVERY" });
    expect(touchControlIdToDomainCommand("lock")).toEqual({ type: "LOCK_SIGNAL" });
    expect(touchControlIdToDomainCommand("hide")).toEqual({ type: "CANCEL_TARGET" });
    expect(touchControlIdToDomainCommand("reset")).toEqual({ type: "RESTART_SCAN" });
    expect(DUDU_SCANNER_OPERATOR_TOUCH_CONTROLS).toHaveLength(5);
  });

  it("uses the same phase guards as keyboard commands", () => {
    for (const controlId of DUDU_SCANNER_OPERATOR_TOUCH_CONTROLS) {
      const command = touchControlIdToDomainCommand(controlId);
      expect(isDomainCommandAllowedInPhase(command, "scan")).toBe(true);
      expect(isDomainCommandAllowedInPhase(command, "config")).toBe(false);
    }
  });
});
