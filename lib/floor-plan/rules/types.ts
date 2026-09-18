import type { RuleSeverity } from "../types";

export type SpatialRuleId =
  | "furniture-boundary"
  | "furniture-wall-collision"
  | "furniture-overlap"
  | "opening-keep-clear"
  | "furniture-clearance"
  | "local-passage"
  | string;

/**
 * Stable Rule Result Contract (AC-14)
 * Every displayed Rule result contains:
 * - ruleId: identifier of the rule violated
 * - severity: "error" | "warning" | "info"
 * - relatedEntityIds: array of entity IDs involved
 * - relatedObjectIds: alias for relatedEntityIds
 * - measuredValue: optional numeric value in mm or mm²
 * - recommendedValue: optional recommended target (e.g. 0, "0 mm²", "Inside room")
 * - title: concise descriptive rule title
 * - message: readable localized explanatory copy
 */
export interface RuleResult {
  ruleId: SpatialRuleId;
  severity: RuleSeverity;
  relatedEntityIds: string[];
  relatedObjectIds: string[];
  measuredValue?: number;
  recommendedValue?: number | string;
  title: string;
  message: string;
}
