import {
  createBrowserAudioContextPort,
  type ScanSoundscapeAudioContext,
  type ScanSoundscapeAudioContextPort,
} from "@/lib/dudu-scanner/scan-soundscape/audio-context-port";

export const SCAN_SOUNDSCAPE_MASTER_LEVEL = 0.5;
export const SCAN_SOUNDSCAPE_RAMP_SECONDS = 0.09;

export type ScanSoundscape = {
  unlockFromUserGesture(): Promise<boolean>;
  setSoundEnabled(enabled: boolean): void;
  setScanActive(active: boolean): void;
  setScanPaused(paused: boolean): void;
  setProbeVelocity(normalized: number): void;
  notifyReveal(): void;
  notifyLock(): void;
  handleWindowBlur(): void;
  handleWindowFocus(): void;
  dispose(): void;
};

export type CreateScanSoundscapeOptions = {
  port?: ScanSoundscapeAudioContextPort;
};

type ScanLayerNodes = {
  ambienceOscA: OscillatorNode;
  ambienceOscB: OscillatorNode;
  ambienceMix: GainNode;
  probeOsc: OscillatorNode;
  probeGain: GainNode;
};

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

function rampGain(
  gain: GainNode,
  context: ScanSoundscapeAudioContext,
  target: number,
  when = context.currentTime,
) {
  const param = gain.gain;
  param.cancelScheduledValues(when);
  param.setValueAtTime(param.value, when);
  param.linearRampToValueAtTime(target, when + SCAN_SOUNDSCAPE_RAMP_SECONDS);
}

export function createScanSoundscape(
  options: CreateScanSoundscapeOptions = {},
): ScanSoundscape {
  const port = options.port ?? createBrowserAudioContextPort();
  let context: ScanSoundscapeAudioContext | null = null;
  let masterGain: GainNode | null = null;
  let focusGain: GainNode | null = null;
  let scanLayers: ScanLayerNodes | null = null;

  let unlocked = false;
  let soundEnabled = true;
  let scanActive = false;
  let scanPaused = false;
  let focusMuted = false;
  let probeVelocity = 0;

  const noop: ScanSoundscape = {
    async unlockFromUserGesture() {
      return false;
    },
    setSoundEnabled() {},
    setScanActive() {},
    setScanPaused() {},
    setProbeVelocity() {},
    notifyReveal() {},
    notifyLock() {},
    handleWindowBlur() {},
    handleWindowFocus() {},
    dispose() {},
  };

  if (!port?.isSupported()) {
    return noop;
  }

  const effectiveAudible = () =>
    unlocked && soundEnabled && scanActive && !scanPaused && !focusMuted;

  const applyMasterAudibility = () => {
    if (!masterGain || !context) {
      return;
    }
    const level = effectiveAudible() ? SCAN_SOUNDSCAPE_MASTER_LEVEL : 0;
    rampGain(masterGain, context, level);
  };

  const ensureContext = (): ScanSoundscapeAudioContext | null => {
    if (context) {
      return context;
    }
    context = port.createContext();
    if (!context) {
      return null;
    }
    masterGain = context.createGain();
    focusGain = context.createGain();
    focusGain.gain.value = 1;
    masterGain.gain.value = 0;
    focusGain.connect(masterGain);
    masterGain.connect(context.destination);
    return context;
  };

  const tearDownScanLayers = () => {
    if (!scanLayers) {
      return;
    }
    try {
      scanLayers.ambienceOscA.stop();
      scanLayers.ambienceOscB.stop();
      scanLayers.probeOsc.stop();
    } catch {
      // already stopped
    }
    scanLayers.ambienceOscA.disconnect();
    scanLayers.ambienceOscB.disconnect();
    scanLayers.ambienceMix.disconnect();
    scanLayers.probeOsc.disconnect();
    scanLayers.probeGain.disconnect();
    scanLayers = null;
  };

  const buildScanLayers = (ctx: ScanSoundscapeAudioContext) => {
    tearDownScanLayers();
    if (!focusGain) {
      return;
    }

    const ambienceMix = ctx.createGain();
    ambienceMix.gain.value = 0.035;

    const ambienceOscA = ctx.createOscillator();
    ambienceOscA.type = "sine";
    ambienceOscA.frequency.value = 58;

    const ambienceOscB = ctx.createOscillator();
    ambienceOscB.type = "triangle";
    ambienceOscB.frequency.value = 118;

    const probeOsc = ctx.createOscillator();
    probeOsc.type = "sine";
    probeOsc.frequency.value = 720;

    const probeGain = ctx.createGain();
    probeGain.gain.value = 0;

    ambienceOscA.connect(ambienceMix);
    ambienceOscB.connect(ambienceMix);
    ambienceMix.connect(focusGain);
    probeOsc.connect(probeGain);
    probeGain.connect(focusGain);

    const now = ctx.currentTime;
    ambienceOscA.start(now);
    ambienceOscB.start(now);
    probeOsc.start(now);

    scanLayers = {
      ambienceOscA,
      ambienceOscB,
      ambienceMix,
      probeOsc,
      probeGain,
    };
    applyProbeVelocity();
  };

  const applyProbeVelocity = () => {
    if (!scanLayers || !context) {
      return;
    }
    const velocity = clamp01(probeVelocity);
    const probeLevel = 0.008 + velocity * 0.028;
    const frequency = 640 + velocity * 220;
    rampGain(scanLayers.probeGain, context, probeLevel);
    scanLayers.probeOsc.frequency.setTargetAtTime(frequency, context.currentTime, 0.05);
  };

  const playCue = (frequencies: number[], durationSeconds: number, peakGain: number) => {
    const ctx = ensureContext();
    if (!ctx || !focusGain || !effectiveAudible()) {
      return;
    }
    const now = ctx.currentTime;
    const cueMaster = ctx.createGain();
    cueMaster.gain.setValueAtTime(0, now);
    cueMaster.gain.linearRampToValueAtTime(peakGain, now + SCAN_SOUNDSCAPE_RAMP_SECONDS);
    cueMaster.gain.linearRampToValueAtTime(0, now + durationSeconds);
    cueMaster.connect(focusGain);

    frequencies.forEach((frequency, index) => {
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = frequency;
      const toneGain = ctx.createGain();
      toneGain.gain.value = 1 / frequencies.length;
      osc.connect(toneGain);
      toneGain.connect(cueMaster);
      const start = now + index * 0.06;
      osc.start(start);
      osc.stop(now + durationSeconds + 0.02);
    });
  };

  return {
    async unlockFromUserGesture() {
      const ctx = ensureContext();
      if (!ctx) {
        return false;
      }
      try {
        if (ctx.state === "suspended") {
          await ctx.resume();
        }
        unlocked = ctx.state === "running";
        applyMasterAudibility();
        return unlocked;
      } catch {
        unlocked = false;
        return false;
      }
    },
    setSoundEnabled(enabled: boolean) {
      soundEnabled = enabled;
      applyMasterAudibility();
    },
    setScanActive(active: boolean) {
      if (active === scanActive) {
        return;
      }
      scanActive = active;
      if (active) {
        const ctx = ensureContext();
        if (ctx) {
          buildScanLayers(ctx);
        }
      } else {
        tearDownScanLayers();
        probeVelocity = 0;
      }
      applyMasterAudibility();
    },
    setScanPaused(paused: boolean) {
      scanPaused = paused;
      applyMasterAudibility();
    },
    setProbeVelocity(normalized: number) {
      probeVelocity = clamp01(normalized);
      applyProbeVelocity();
    },
    notifyReveal() {
      playCue([523.25, 659.25], 0.28, 0.12);
    },
    notifyLock() {
      playCue([392, 523.25, 659.25], 0.36, 0.1);
    },
    handleWindowBlur() {
      focusMuted = true;
      applyMasterAudibility();
    },
    handleWindowFocus() {
      focusMuted = false;
      applyMasterAudibility();
    },
    dispose() {
      tearDownScanLayers();
      if (masterGain) {
        masterGain.disconnect();
        masterGain = null;
      }
      if (focusGain) {
        focusGain.disconnect();
        focusGain = null;
      }
      if (context) {
        void context.close();
        context = null;
      }
      unlocked = false;
      scanActive = false;
      scanPaused = false;
      focusMuted = false;
      probeVelocity = 0;
    },
  };
}

export function signalStrengthToProbeVelocity(signalStrength: number): number {
  const base = 0.22;
  const span = 1 - base;
  if (span <= 0) {
    return 0;
  }
  return clamp01((signalStrength - base) / span);
}
