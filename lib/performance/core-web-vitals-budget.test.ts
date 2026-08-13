import { describe, expect, it } from "vitest";

import {
  CORE_WEB_VITALS_BUDGETS,
  CORE_WEB_VITALS_DEVICE_CLASSES,
} from "./core-web-vitals-budget";

describe("Core Web Vitals budgets", () => {
  it("defines matching mobile and desktop p75 thresholds", () => {
    for (const deviceClass of CORE_WEB_VITALS_DEVICE_CLASSES) {
      const budget = CORE_WEB_VITALS_BUDGETS[deviceClass];
      expect(budget.lcpMs).toBeLessThanOrEqual(2500);
      expect(budget.inpMs).toBeLessThanOrEqual(200);
      expect(budget.cls).toBeLessThanOrEqual(0.1);
    }
  });
});
