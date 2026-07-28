export const TOUCH_OPERATOR_CONTROLS_MEDIA_QUERY = "(hover: none) and (pointer: coarse)";

export function prefersTouchOperatorControls(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) {
    return false;
  }
  return window.matchMedia(TOUCH_OPERATOR_CONTROLS_MEDIA_QUERY).matches;
}
