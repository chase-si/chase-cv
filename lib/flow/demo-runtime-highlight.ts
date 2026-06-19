import {
  FLOW_SVG_RUNTIME_DEMO_BRANCH_FILL,
  FLOW_SVG_RUNTIME_DEMO_FINISHED_FILL,
} from "@/lib/flow/svg-presentation";

/** Fixed demo nodes: completed top-level steps and a nested branch step. */
export const DEMO_RUNTIME_ID_COLOR_MAP: Record<string, string> = {
  step001: FLOW_SVG_RUNTIME_DEMO_FINISHED_FILL,
  step002: FLOW_SVG_RUNTIME_DEMO_FINISHED_FILL,
  step004: FLOW_SVG_RUNTIME_DEMO_BRANCH_FILL,
};

/** Fixed demo “currently running” top-level step. */
export const DEMO_RUNTIME_GREEN_ARROW_IDS = ["step003"] as const;

export type DemoRuntimeHighlightPresentation = {
  idColorMap: Record<string, string>;
  greenArrowIds: string[];
};

export function getDemoRuntimeHighlightPresentation(
  enabled: boolean,
): DemoRuntimeHighlightPresentation | undefined {
  if (!enabled) {
    return undefined;
  }
  return {
    idColorMap: DEMO_RUNTIME_ID_COLOR_MAP,
    greenArrowIds: [...DEMO_RUNTIME_GREEN_ARROW_IDS],
  };
}
