import type { SpaceRuleConfig } from "../types";

export const VALID_SPACE_RULE_CONFIG: SpaceRuleConfig = {
  version: 1,
  unit: "mm",
  rules: {
    collision: {
      enabled: true,
      severity: "error",
    },
    doorSwing: {
      enabled: true,
      severity: "error",
      minClearanceDepthMm: 900,
    },
    circulation: {
      enabled: true,
      severity: "warning",
      minMainPassageWidthMm: 900,
      minSecondaryPassageWidthMm: 600,
    },
    furnitureClearance: {
      enabled: true,
      severity: "warning",
      bedSideClearanceMm: 600,
      bedFootClearanceMm: 600,
      wardrobeFrontClearanceMm: 800,
      diningChairPulloutMm: 750,
    },
  },
};
