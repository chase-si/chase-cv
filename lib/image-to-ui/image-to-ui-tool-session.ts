import type { ImageToUiFlowStep } from "@/lib/image-to-ui/resolve-image-to-ui-flow-step";

/**
 * Image-to-ui **tool session** — flow step slice.
 *
 * Full session state (see {@link useImageToUiToolSession}) also includes active image and
 * palette selection from {@link useActiveImageSelection}. This reducer owns only the step.
 *
 * ## Step transitions
 * - **advance_to_render**: user passes the palette render gate → `flowStep` becomes `2`.
 * - **back_to_edit**: user leaves the summary step → `flowStep` becomes `1`; image and palette unchanged.
 *
 * ## Active image change (upload or new sample)
 * - Dispatches **active_image_changed** → `flowStep` resets to `1`.
 * - Palette resets via selection hook (new extraction); sample/upload replaces prior image.
 *
 * ## Route restore (leave `/image-to-ui` and return, or bfcache `pageshow`)
 * - Dispatches **route_restore** → `flowStep` becomes `1`.
 * - Upload previews are cleared (blob URLs invalid after navigation); sample image and palette kept.
 */
export type ImageToUiToolSessionFlowState = {
  flowStep: ImageToUiFlowStep;
};

export type ImageToUiToolSessionAction =
  | { type: "advance_to_render" }
  | { type: "back_to_edit" }
  | { type: "active_image_changed" }
  | { type: "route_restore" };

export function initialImageToUiToolSessionFlowState(): ImageToUiToolSessionFlowState {
  return { flowStep: 1 };
}

export function imageToUiToolSessionReducer(
  state: ImageToUiToolSessionFlowState,
  action: ImageToUiToolSessionAction,
): ImageToUiToolSessionFlowState {
  switch (action.type) {
    case "advance_to_render":
      return { flowStep: 2 };
    case "back_to_edit":
    case "active_image_changed":
    case "route_restore":
      return { flowStep: 1 };
    default:
      return state;
  }
}
