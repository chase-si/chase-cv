import { afterEach, describe, expect, it, vi } from "vitest";

import type { ScanSoundscapeAudioContext } from "@/lib/dudu-scanner/scan-soundscape/audio-context-port";
import {
  createScanSoundscape,
  SCAN_SOUNDSCAPE_MASTER_LEVEL,
  signalStrengthToProbeVelocity,
} from "@/lib/dudu-scanner/scan-soundscape/create-scan-soundscape";

type MockParam = {
  value: number;
  cancelScheduledValues: ReturnType<typeof vi.fn>;
  setValueAtTime: ReturnType<typeof vi.fn>;
  linearRampToValueAtTime: ReturnType<typeof vi.fn>;
  setTargetAtTime: ReturnType<typeof vi.fn>;
};

function createMockParam(initial = 0): MockParam {
  const param: MockParam = {
    value: initial,
    cancelScheduledValues: vi.fn(),
    setValueAtTime: vi.fn((value: number) => {
      param.value = value;
    }),
    linearRampToValueAtTime: vi.fn((value: number) => {
      param.value = value;
    }),
    setTargetAtTime: vi.fn(),
  };
  return param;
}

type MockNode = {
  gain: MockParam;
  frequency: MockParam;
  connect: ReturnType<typeof vi.fn>;
  disconnect: ReturnType<typeof vi.fn>;
  start: ReturnType<typeof vi.fn>;
  stop: ReturnType<typeof vi.fn>;
  type: string;
};

function createMockNode(kind: "gain" | "osc"): MockNode {
  return {
    gain: createMockParam(kind === "gain" ? 1 : 0),
    frequency: createMockParam(440),
    connect: vi.fn(),
    disconnect: vi.fn(),
    start: vi.fn(),
    stop: vi.fn(),
    type: "sine",
  };
}

function createMockContext(state: AudioContextState = "suspended"): ScanSoundscapeAudioContext & {
  close: ReturnType<typeof vi.fn>;
  resume: ReturnType<typeof vi.fn>;
} {
  let currentTime = 0;
  const destination = { connect: vi.fn(), disconnect: vi.fn() };
  const nodes: MockNode[] = [];

  const context = {
    state,
    get currentTime() {
      return currentTime;
    },
    set currentTime(value: number) {
      currentTime = value;
    },
    destination,
    resume: vi.fn(async () => {
      context.state = "running";
    }),
    close: vi.fn(async () => {
      context.state = "closed";
    }),
    createGain: vi.fn(() => {
      const node = createMockNode("gain");
      nodes.push(node);
      return node as unknown as GainNode;
    }),
    createOscillator: vi.fn(() => {
      const node = createMockNode("osc");
      nodes.push(node);
      return node as unknown as OscillatorNode;
    }),
    createBiquadFilter: vi.fn(() => createMockNode("gain") as unknown as BiquadFilterNode),
    createBufferSource: vi.fn(() => createMockNode("gain") as unknown as AudioBufferSourceNode),
    createBuffer: vi.fn(() => ({}) as AudioBuffer),
  };

  return context as unknown as ScanSoundscapeAudioContext & {
    close: ReturnType<typeof vi.fn>;
    resume: ReturnType<typeof vi.fn>;
  };
}

function createTestPort(context: ReturnType<typeof createMockContext> | null, supported = true) {
  return {
    isSupported: () => supported,
    createContext: () => context,
  };
}

describe("createScanSoundscape", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns a no-op engine when audio is unsupported", async () => {
    const engine = createScanSoundscape({ port: createTestPort(null, false) });
    await expect(engine.unlockFromUserGesture()).resolves.toBe(false);
    engine.setScanActive(true);
    engine.notifyReveal();
    engine.dispose();
  });

  it("unlocks audio from a user gesture via resume", async () => {
    const context = createMockContext("suspended");
    const engine = createScanSoundscape({ port: createTestPort(context) });

    await expect(engine.unlockFromUserGesture()).resolves.toBe(true);
    expect(context.resume).toHaveBeenCalled();
  });

  it("ramps master gain to 50% when scan is active and sound enabled", async () => {
    const context = createMockContext("running");
    const engine = createScanSoundscape({ port: createTestPort(context) });
    await engine.unlockFromUserGesture();

    engine.setSoundEnabled(true);
    engine.setScanActive(true);

    const master = context.createGain.mock.results[0]?.value as MockNode;
    expect(master.gain.linearRampToValueAtTime).toHaveBeenCalledWith(
      SCAN_SOUNDSCAPE_MASTER_LEVEL,
      expect.any(Number),
    );
    engine.dispose();
  });

  it("mutes on blur and restores on focus when scan remains active", async () => {
    const context = createMockContext("running");
    const engine = createScanSoundscape({ port: createTestPort(context) });
    await engine.unlockFromUserGesture();
    engine.setSoundEnabled(true);
    engine.setScanActive(true);

    const master = context.createGain.mock.results[0]?.value as MockNode;
    master.gain.linearRampToValueAtTime.mockClear();

    engine.handleWindowBlur();
    expect(master.gain.linearRampToValueAtTime).toHaveBeenCalledWith(0, expect.any(Number));

    master.gain.linearRampToValueAtTime.mockClear();
    engine.handleWindowFocus();
    expect(master.gain.linearRampToValueAtTime).toHaveBeenCalledWith(
      SCAN_SOUNDSCAPE_MASTER_LEVEL,
      expect.any(Number),
    );
    engine.dispose();
  });

  it("modulates probe gain from normalized velocity", async () => {
    const context = createMockContext("running");
    const engine = createScanSoundscape({ port: createTestPort(context) });
    await engine.unlockFromUserGesture();
    engine.setSoundEnabled(true);
    engine.setScanActive(true);

    const gains = context.createGain.mock.results.map((result) => result.value as MockNode);
    const probeGain = gains[gains.length - 1];
    engine.setProbeVelocity(1);
    expect(probeGain.gain.linearRampToValueAtTime).toHaveBeenCalled();
    engine.dispose();
  });

  it("plays reveal and lock cues without throwing", async () => {
    const context = createMockContext("running");
    const engine = createScanSoundscape({ port: createTestPort(context) });
    await engine.unlockFromUserGesture();
    engine.setSoundEnabled(true);
    engine.setScanActive(true);

    expect(() => {
      engine.notifyReveal();
      engine.notifyLock();
    }).not.toThrow();
    engine.dispose();
  });

  it("stops scan layers and closes context on dispose", async () => {
    const context = createMockContext("running");
    const engine = createScanSoundscape({ port: createTestPort(context) });
    await engine.unlockFromUserGesture();
    engine.setScanActive(true);
    engine.dispose();
    expect(context.close).toHaveBeenCalled();
  });

  it("maps signal strength to normalized probe velocity", () => {
    expect(signalStrengthToProbeVelocity(0.22)).toBe(0);
    expect(signalStrengthToProbeVelocity(1)).toBe(1);
  });
});
