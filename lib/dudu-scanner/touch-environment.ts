export const TOUCH_OPERATOR_CONTROLS_MEDIA_QUERY = "(hover: none) and (pointer: coarse)";
export const NARROW_OPERATOR_CONTROLS_MEDIA_QUERY = "(max-width: 1023px)";

export function prefersTouchOperatorControls(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) {
    return false;
  }
  return (
    window.matchMedia(TOUCH_OPERATOR_CONTROLS_MEDIA_QUERY).matches ||
    window.matchMedia(NARROW_OPERATOR_CONTROLS_MEDIA_QUERY).matches
  );
}
