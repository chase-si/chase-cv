export type ScannerPoint = {
  x: number;
  y: number;
};

export type ScannerSignalBand = "weak" | "medium" | "strong";

export type ProximitySignal = {
  distance: number;
  strength: number;
  band: ScannerSignalBand;
  insideRevealRadius: boolean;
};

export type ProximitySignalOptions = {
  revealRadius: number;
  signalRadius: number;
};

export const DUDU_SCANNER_AUTO_SCAN_DURATION_MS = 4000;
export const DUDU_SCANNER_MIN_DISCOVERY_ELAPSED_MS = 10000;
export const DUDU_SCANNER_DISCOVERY_DWELL_MS = 800;
export const DUDU_SCANNER_DESKTOP_SPOTLIGHT_RADIUS = 100;
export const DUDU_SCANNER_MOBILE_SPOTLIGHT_RADIUS = 70;
export const DUDU_SCANNER_DISCOVERY_DECAY_RATE = 1.5;

export type DiscoveryDwellInput = {
  deltaMs: number;
  roundElapsedMs: number;
  probeInside: boolean;
  insideRevealRadius: boolean;
};

export type DiscoveryDwellResult = {
  dwellMs: number;
  progress: number;
  discovered: boolean;
};

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

export function signalBandForStrength(strength: number): ScannerSignalBand {
  if (strength >= 2 / 3) {
    return "strong";
  }
  if (strength >= 1 / 3) {
    return "medium";
  }
  return "weak";
}

export function computeProximitySignal(
  probe: ScannerPoint,
  target: ScannerPoint,
  options: ProximitySignalOptions,
): ProximitySignal {
  const distance = Math.hypot(probe.x - target.x, probe.y - target.y);
  const strength =
    options.signalRadius > 0 ? clamp01(1 - distance / options.signalRadius) : 0;

  return {
    distance,
    strength,
    band: signalBandForStrength(strength),
    insideRevealRadius: distance <= options.revealRadius,
  };
}

export function advanceDiscoveryDwell(
  currentDwellMs: number,
  input: DiscoveryDwellInput,
): DiscoveryDwellResult {
  let dwellMs = currentDwellMs;

  if (input.roundElapsedMs < DUDU_SCANNER_MIN_DISCOVERY_ELAPSED_MS) {
    dwellMs = 0;
  } else if (!input.probeInside) {
    dwellMs = currentDwellMs;
  } else if (input.insideRevealRadius) {
    dwellMs = Math.min(
      DUDU_SCANNER_DISCOVERY_DWELL_MS,
      currentDwellMs + Math.max(0, input.deltaMs),
    );
  } else {
    dwellMs = Math.max(
      0,
      currentDwellMs - Math.max(0, input.deltaMs) * DUDU_SCANNER_DISCOVERY_DECAY_RATE,
    );
  }

  const progress = dwellMs / DUDU_SCANNER_DISCOVERY_DWELL_MS;
  return {
    dwellMs,
    progress,
    discovered: dwellMs >= DUDU_SCANNER_DISCOVERY_DWELL_MS,
  };
}
