export type DeviceClass = "mobile" | "desktop";

export type CoreWebVitalsBudget = {
  /** Largest Contentful Paint at the 75th percentile (milliseconds). */
  lcpMs: number;
  /** Interaction to Next Paint at the 75th percentile (milliseconds). */
  inpMs: number;
  /** Cumulative Layout Shift at the 75th percentile (unitless). */
  cls: number;
};

/** Field-data targets aligned with Google Search “good” thresholds. */
export const CORE_WEB_VITALS_BUDGETS: Record<DeviceClass, CoreWebVitalsBudget> = {
  mobile: {
    lcpMs: 2500,
    inpMs: 200,
    cls: 0.1,
  },
  desktop: {
    lcpMs: 2500,
    inpMs: 200,
    cls: 0.1,
  },
};

export const CORE_WEB_VITALS_DEVICE_CLASSES = ["mobile", "desktop"] as const satisfies readonly DeviceClass[];
