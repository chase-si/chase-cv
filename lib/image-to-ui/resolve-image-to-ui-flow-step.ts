export type ImageToUiFlowStep = 1 | 2;

export function resolveImageToUiFlowStep(
  flowStep: ImageToUiFlowStep,
  hasActiveImage: boolean,
): ImageToUiFlowStep {
  if (flowStep === 2 && !hasActiveImage) {
    return 1;
  }
  return flowStep;
}
