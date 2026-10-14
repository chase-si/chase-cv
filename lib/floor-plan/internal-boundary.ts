/**
 * Floor Plan lab release boundary.
 *
 * The editor at `/floor-plan` is a public playground tool. The recognition lab
 * stays internal: noindex, absent from the sitemap, and gated by environment.
 */

export const FLOOR_PLAN_INTERNAL_ROUTE = "/floor-plan";
export const FLOOR_PLAN_LAB_ROUTE = "/floor-plan/lab";

export const FLOOR_PLAN_ROBOTS_METADATA = {
  index: false,
  follow: false,
} as const;

/**
 * Determines whether the internal floor plan editor is accessible in the current environment.
 *
 * Gating policy:
 * - Defaults to ENABLED in development and test environments (`NODE_ENV === "development"` or `NODE_ENV === "test"` or empty).
 * - Enabled if explicit flags `FEATURE_FLOOR_PLAN_INTERNAL` or `NEXT_PUBLIC_INTERNAL_TOOLS` are "true" or "1".
 * - Enabled if in internal/preview deployments (`VERCEL_ENV === "preview"`, `APP_ENV === "internal"`, `APP_ENV === "preview"`).
 * - Explicitly BLOCKED if `FEATURE_FLOOR_PLAN_INTERNAL` or `NEXT_PUBLIC_INTERNAL_TOOLS` is "false" or "0".
 * - Defaults to BLOCKED in production if no internal/feature flag is set.
 */
export function isFloorPlanInternalEnabled(env: NodeJS.ProcessEnv = process.env): boolean {
  if (
    env.FEATURE_FLOOR_PLAN_INTERNAL === "false" ||
    env.FEATURE_FLOOR_PLAN_INTERNAL === "0" ||
    env.NEXT_PUBLIC_INTERNAL_TOOLS === "false" ||
    env.NEXT_PUBLIC_INTERNAL_TOOLS === "0"
  ) {
    return false;
  }

  if (
    env.FEATURE_FLOOR_PLAN_INTERNAL === "true" ||
    env.FEATURE_FLOOR_PLAN_INTERNAL === "1" ||
    env.NEXT_PUBLIC_INTERNAL_TOOLS === "true" ||
    env.NEXT_PUBLIC_INTERNAL_TOOLS === "1"
  ) {
    return true;
  }

  if (
    env.VERCEL_ENV === "preview" ||
    env.APP_ENV === "internal" ||
    env.APP_ENV === "preview"
  ) {
    return true;
  }

  const nodeEnv = env.NODE_ENV;
  if (nodeEnv === "development" || nodeEnv === "test" || !nodeEnv) {
    return true;
  }

  return false;
}
