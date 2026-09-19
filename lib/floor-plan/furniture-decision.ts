import type { FloorPlan, SpaceRuleConfig, RuleSeverity } from "./types";
import {
  evaluatePlanRules,
  isPlanUnscaled,
  type RuleResult,
  type SpatialRuleId,
} from "./rules";
import { getFloorPlanI18n } from "./i18n";

export type FurnitureDecisionStatus =
  | "suitable"
  | "caution"
  | "not-recommended"
  | "unavailable";

export interface FurnitureDecisionIssue {
  ruleId: SpatialRuleId;
  severity: RuleSeverity;
  title: string;
  message: string;
  relatedEntityIds: string[];
  relatedObjectIds: string[];
  measuredValue?: number;
  recommendedValue?: number | string;
  measuredFormatted?: string | null;
  recommendedFormatted?: string | null;
}

export interface FurnitureDecisionDimensions {
  widthMm: number;
  depthMm: number;
  formatted: string;
}

export interface FurnitureDecisionSummary {
  status: FurnitureDecisionStatus;
  statusLabel: string;
  title: string;
  summary: string;
  disclaimer: string;
  roomName: string;
  furnitureName: string;
  dimensions: FurnitureDecisionDimensions | null;
  relevantIssues: FurnitureDecisionIssue[];
  totalViolationsCount: number;
  uncalibrated: boolean;
  hasTargetFurniture: boolean;
}

export interface SummarizeFurnitureDecisionParams {
  plan: FloorPlan;
  targetRoomId?: string | null;
  targetFurnitureId?: string | null;
  ruleResults?: RuleResult[];
  config?: SpaceRuleConfig;
  locale?: string;
}

export type PlanEntityType = "furniture" | "wall" | "room" | "opening";

/**
 * Identify the domain entity type (furniture, wall, room, opening) for a given entity ID.
 */
export function resolvePlanEntityType(
  plan: FloorPlan,
  entityId: string,
): PlanEntityType | null {
  if (plan.furniture.some((f) => f.id === entityId)) return "furniture";
  if (plan.walls.some((w) => w.id === entityId)) return "wall";
  if (plan.rooms.some((r) => r.id === entityId)) return "room";
  if (plan.openings.some((o) => o.id === entityId)) return "opening";
  return null;
}

/**
 * Return a localized human-readable label for a plan entity.
 */
export function getPlanEntityLabel(
  plan: FloorPlan,
  entityId: string,
  locale?: string,
): string {
  const isZh = locale?.toLowerCase().startsWith("zh");
  const type = resolvePlanEntityType(plan, entityId);
  if (isZh) {
    switch (type) {
      case "furniture":
        return "家具";
      case "wall":
        return "墙体";
      case "room":
        return "房间";
      case "opening":
        return "门窗";
      default:
        return "构件";
    }
  }
  switch (type) {
    case "furniture":
      return "Furniture";
    case "wall":
      return "Wall";
    case "room":
      return "Room";
    case "opening":
      return "Opening";
    default:
      return "Entity";
  }
}

/**
 * Summarize Furniture Decision (AC-14, AC-15, AC-16)
 *
 * Pure domain function that converts deterministic spatial rule violations
 * into user-facing furniture purchase and placement decision summaries.
 *
 * Status priority (AC-14):
 * 1. Uncalibrated plan -> "unavailable" ("暂无法判断", does not imply clearance passes)
 * 2. Any relevant error -> "not-recommended" ("不建议")
 * 3. Any relevant warning -> "caution" ("需要权衡")
 * 4. No relevant issues -> "suitable" ("适合", qualified as "当前规则未发现问题")
 */
export function summarizeFurnitureDecision({
  plan,
  targetRoomId,
  targetFurnitureId,
  ruleResults,
  config,
  locale,
}: SummarizeFurnitureDecisionParams): FurnitureDecisionSummary {
  const i18n = getFloorPlanI18n(locale);
  const isZh = i18n.locale === "zh";

  // Check scale calibration (AC-14, AC-21)
  const uncalibrated = isPlanUnscaled(plan);

  // Resolve target furniture
  const targetFurniture = targetFurnitureId
    ? plan.furniture.find((f) => f.id === targetFurnitureId) ?? null
    : null;

  // Resolve target room
  const targetRoom = targetRoomId
    ? plan.rooms.find((r) => r.id === targetRoomId) ?? null
    : null;

  const roomName =
    targetRoom?.name ??
    (targetRoom
      ? i18n.getRoomTypeLabel(targetRoom.type)
      : isZh
        ? "目标房间"
        : "Target Room");

  const furnitureName = targetFurniture
    ? i18n.getFurnitureName(targetFurniture.definitionId, targetFurniture.definitionId)
    : isZh
      ? "未选定家具"
      : "No Furniture Selected";

  // Evaluate or reuse rule violations
  const allViolations = ruleResults ?? evaluatePlanRules(plan, config);

  // Filter violations specifically relevant to target furniture (AC-16)
  const relevantRaw = targetFurniture
    ? allViolations.filter(
        (v) =>
          v.relatedEntityIds.includes(targetFurniture.id) ||
          v.relatedObjectIds?.includes(targetFurniture.id),
      )
    : [];

  const relevantIssues: FurnitureDecisionIssue[] = relevantRaw.map((v) => {
    const isAreaRule =
      v.ruleId === "furniture-wall-collision" || v.ruleId === "furniture-overlap";

    const measuredFormatted =
      v.measuredValue !== undefined
        ? isAreaRule
          ? `${v.measuredValue} mm²`
          : `${v.measuredValue} mm`
        : null;

    const recommendedFormatted =
      v.recommendedValue !== undefined
        ? typeof v.recommendedValue === "number"
          ? isAreaRule
            ? `${v.recommendedValue} mm²`
            : `${v.recommendedValue} mm`
          : String(v.recommendedValue)
        : null;

    return {
      ruleId: v.ruleId,
      severity: v.severity,
      title: i18n.getRuleTitle(v.ruleId, v.title),
      message: i18n.getRuleMessage(v),
      relatedEntityIds: v.relatedEntityIds,
      relatedObjectIds: v.relatedObjectIds ?? v.relatedEntityIds,
      measuredValue: v.measuredValue,
      recommendedValue: v.recommendedValue,
      measuredFormatted,
      recommendedFormatted,
    };
  });

  const disclaimer = isZh
    ? "本结论基于当前空间规则计算，不构成施工、结构安全保证或绝对使用承诺。"
    : "This conclusion is computed based on current spatial rules and does not constitute a construction, structural safety, or absolute usability guarantee.";

  // If no target furniture exists
  if (!targetFurniture) {
    return {
      status: "unavailable",
      statusLabel: isZh ? "暂无法判断" : "Unavailable",
      title: isZh ? "未选定检测目标家具" : "No Target Furniture Selected",
      summary: isZh
        ? "请先在房间中添加或选择需要进行尺寸检测的目标家具。"
        : "Please add or select a target furniture in the room to evaluate.",
      disclaimer,
      roomName,
      furnitureName,
      dimensions: null,
      relevantIssues: [],
      totalViolationsCount: allViolations.length,
      uncalibrated,
      hasTargetFurniture: false,
    };
  }

  const dimensions: FurnitureDecisionDimensions = {
    widthMm: targetFurniture.width,
    depthMm: targetFurniture.depth,
    formatted: `${targetFurniture.width} × ${targetFurniture.depth} mm`,
  };

  const hasErrors = relevantIssues.some((i) => i.severity === "error");
  const hasWarnings = relevantIssues.some((i) => i.severity === "warning");

  let status: FurnitureDecisionStatus;
  let statusLabel: string;
  let summary: string;

  // Priority 1: Uncalibrated plan -> unavailable (AC-14)
  if (uncalibrated) {
    status = "unavailable";
    statusLabel = isZh ? "暂无法判断" : "Unavailable";
    summary = isZh
      ? `当前户型尚未标定真实毫米比例（显示相对像素坐标），暂无法判断净距与活动空间是否通过。当前规则未发现绝对物理重叠，但无法保证真实空间净距，请先校准真实尺寸后再做决策。`
      : `The floor plan is uncalibrated (showing relative pixel coordinates); clearance and passage space cannot be determined. While no absolute boundary collisions were detected under current rules, real clearances cannot be guaranteed. Please calibrate dimensions first.`;
  } else if (hasErrors) {
    // Priority 2: Relevant error -> not-recommended (AC-14)
    status = "not-recommended";
    statusLabel = isZh ? "不建议" : "Not Recommended";
    summary = isZh
      ? `在当前${roomName}放入${furnitureName}（${dimensions.formatted}）存在严重空间冲突（如超出房间边界、墙体穿插或家具重叠），不建议按该规格购买或摆放，建议适当缩小尺寸或调整摆放位置。`
      : `Critical spatial conflicts (such as room boundary violation, wall collision, or furniture overlap) were detected for ${furnitureName} (${dimensions.formatted}) in ${roomName}. Purchasing or placing this specification is not recommended; consider smaller dimensions or adjusting position.`;
  } else if (hasWarnings) {
    // Priority 3: Relevant warning -> caution (AC-14)
    status = "caution";
    statusLabel = isZh ? "需要权衡" : "Caution";
    summary = isZh
      ? `${furnitureName}（${dimensions.formatted}）可以放入当前${roomName}，但存在部分空间净距或动线较紧（如床侧通道或门窗避让区不足），需要根据实际生活动线与使用习惯权衡考虑。`
      : `${furnitureName} (${dimensions.formatted}) can fit within ${roomName}, but some clearances or circulation paths are tight (such as bedside passage or door swing clearance). Trade-offs should be evaluated based on actual living habits.`;
  } else {
    // Priority 4: Suitable (AC-14, AC-15)
    status = "suitable";
    statusLabel = isZh ? "适合" : "Suitable";
    summary = isZh
      ? `当前规则未发现问题。${furnitureName}（${dimensions.formatted}）在当前${roomName}内满足已配置的房间边界、墙体碰撞、家具避让及基础净距规则，推荐考虑。`
      : `No issues found under current rules. ${furnitureName} (${dimensions.formatted}) satisfies all configured room boundary, collision, overlap, and clearance rules in ${roomName}. Recommended for consideration.`;
  }

  const title = `${roomName} · ${furnitureName} (${dimensions.formatted}) - ${statusLabel}`;

  return {
    status,
    statusLabel,
    title,
    summary,
    disclaimer,
    roomName,
    furnitureName,
    dimensions,
    relevantIssues,
    totalViolationsCount: allViolations.length,
    uncalibrated: status === "unavailable",
    hasTargetFurniture: true,
  };
}
