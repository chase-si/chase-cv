export type ScanSoundscapeAudioContext = {
  readonly state: AudioContextState;
  readonly currentTime: number;
  readonly destination: AudioNode;
  resume(): Promise<void>;
  close(): Promise<void>;
  createGain(): GainNode;
  createOscillator(): OscillatorNode;
  createBiquadFilter(): BiquadFilterNode;
  createBufferSource(): AudioBufferSourceNode;
  createBuffer(channels: number, length: number, sampleRate: number): AudioBuffer;
};

export type ScanSoundscapeAudioContextPort = {
  isSupported(): boolean;
  createContext(): ScanSoundscapeAudioContext | null;
};

export function createBrowserAudioContextPort(): ScanSoundscapeAudioContextPort {
  return {
    isSupported() {
      if (typeof window === "undefined") {
        return false;
      }
      return (
        typeof window.AudioContext !== "undefined" ||
        "webkitAudioContext" in window
      );
    },
    createContext() {
      if (!this.isSupported() || typeof window === "undefined") {
        return null;
      }
      const Ctor =
        window.AudioContext ??
        (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) {
        return null;
      }
      try {
        return new Ctor() as unknown as ScanSoundscapeAudioContext;
      } catch {
        return null;
      }
    },
  };
}
