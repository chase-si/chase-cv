export type ScannerMotionPolicy = {
  driftSpeed: number;
  textureMotion: number;
  revealDurationScale: number;
  particlesEnabled: boolean;
};

export function resolveScannerMotionPolicy(reducedMotion: boolean): ScannerMotionPolicy {
  if (reducedMotion) {
    return {
      driftSpeed: 0.35,
      textureMotion: 0.4,
      revealDurationScale: 0.55,
      particlesEnabled: false,
    };
  }
  return {
    driftSpeed: 1,
    textureMotion: 1,
    revealDurationScale: 1,
    particlesEnabled: true,
  };
}
