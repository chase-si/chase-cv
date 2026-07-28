import type { DuduScannerRoundPhase } from "@/lib/dudu-scanner/round-state";

export type DuduScannerDomainCommand =
  | { type: "TOGGLE_PAUSE" }
  | { type: "REVEAL_TARGET" }
  | { type: "LOCK_SIGNAL" }
  | { type: "CANCEL_TARGET" }
  | { type: "RESTART_SCAN" }
  | { type: "TOGGLE_SOUND" }
  | { type: "RETRY_FULLSCREEN" };

export function keyboardEventToDomainCommand(
  key: string,
): DuduScannerDomainCommand | null {
  switch (key) {
    case " ":
      return { type: "TOGGLE_PAUSE" };
    case "1":
      return { type: "REVEAL_TARGET" };
    case "Enter":
      return { type: "LOCK_SIGNAL" };
    case "x":
    case "X":
      return { type: "CANCEL_TARGET" };
    case "r":
    case "R":
      return { type: "RESTART_SCAN" };
    case "m":
    case "M":
      return { type: "TOGGLE_SOUND" };
    case "f":
    case "F":
      return { type: "RETRY_FULLSCREEN" };
    default:
      return null;
  }
}

const SCAN_PHASE_COMMANDS = new Set<DuduScannerDomainCommand["type"]>([
  "TOGGLE_PAUSE",
  "REVEAL_TARGET",
  "LOCK_SIGNAL",
  "CANCEL_TARGET",
  "RESTART_SCAN",
  "TOGGLE_SOUND",
  "RETRY_FULLSCREEN",
]);

const RESULT_PHASE_COMMANDS = new Set<DuduScannerDomainCommand["type"]>([
  "TOGGLE_SOUND",
  "RETRY_FULLSCREEN",
]);

export function isDomainCommandAllowedInPhase(
  command: DuduScannerDomainCommand,
  phase: DuduScannerRoundPhase,
): boolean {
  if (phase === "scan") {
    return SCAN_PHASE_COMMANDS.has(command.type);
  }
  if (phase === "result") {
    return RESULT_PHASE_COMMANDS.has(command.type);
  }
  return command.type === "TOGGLE_SOUND" || command.type === "RETRY_FULLSCREEN";
}

export function shouldPreventDefaultForScannerKey(key: string): boolean {
  const command = keyboardEventToDomainCommand(key);
  if (!command) {
    return false;
  }
  return command.type === "TOGGLE_PAUSE" || key === " ";
}
