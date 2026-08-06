export type BrandMotionInput = {
  reducedMotion: boolean;
  finePointer: boolean;
  saveData?: boolean;
  hardwareConcurrency?: number;
  isVisible?: boolean;
};

export type BrandMotionCapabilities = {
  runDecorativeAnimation: boolean;
  runSmoothScroll: boolean;
};

const LOW_CORE_COUNT_THRESHOLD = 4;

export function isLowPerformanceEnvironment(input: {
  saveData?: boolean;
  hardwareConcurrency?: number;
}): boolean {
  if (input.saveData) {
    return true;
  }
  const cores = input.hardwareConcurrency;
  if (typeof cores === "number" && cores > 0 && cores <= LOW_CORE_COUNT_THRESHOLD) {
    return true;
  }
  return false;
}

export function resolveBrandMotionCapabilities(
  input: BrandMotionInput,
): BrandMotionCapabilities {
  const lowPerformance = isLowPerformanceEnvironment(input);

  if (input.reducedMotion || lowPerformance || input.isVisible === false) {
    return {
      runDecorativeAnimation: false,
      runSmoothScroll: false,
    };
  }

  return {
    runDecorativeAnimation: true,
    runSmoothScroll: input.finePointer,
  };
}
