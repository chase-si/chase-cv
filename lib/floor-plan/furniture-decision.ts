import type {
  AssessmentFinding,
  AssessmentFindingKind,
  FloorPlan,
  FurnitureSide,
  RuleSeverity,
  SpaceRuleConfig,
} from "./types";
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
  ruleId: SpatialRuleId | AssessmentFindingKind;
  severity: RuleSeverity;
  title: string;
  message: string;
  repairGuidance?: string;
  relatedObjectName?: string;
  side?: FurnitureSide;
  sideLabel?: string;
  relatedEntityIds: string[];
  relatedObjectIds: string[];
  measuredValue?: number;
  minimumValue?: number;
  recommendedValue?: number | string;
  measuredFormatted?: string | null;
  minimumFormatted?: string | null;
  recommendedFormatted?: string | null;
}

export interface FormattedAssessmentFinding extends FurnitureDecisionIssue {
  kind: AssessmentFindingKind;
  repairGuidance: string;
  relatedObjectName: string;
}

/**
 * Pure domain formatter that derives localized user-facing explanation, related object name,
 * direction label, measured/min/recommended millimeter strings, and deterministic repair guidance
 * strictly from a structured AssessmentFinding and FloorPlan (AC-12, AC-13).
 */
export function formatAssessmentFinding(
  finding: AssessmentFinding,
  plan: FloorPlan,
  locale?: string,
): FormattedAssessmentFinding {
  const i18n = getFloorPlanI18n(locale);
  const isZh = i18n.locale === "zh";

  // 1. Resolve human-readable related object name (colliding furniture, wall/room, or boundary)
  let relatedObjectName: string;
  if (finding.relatedPlacementId) {
    const otherFurniture = plan.furniture.find((f) => f.id === finding.relatedPlacementId);
    if (otherFurniture) {
      const itemName = i18n.getFurnitureName(
        otherFurniture.definitionId,
        otherFurniture.definitionId,
      );
      relatedObjectName = `${itemName} (${finding.relatedPlacementId})`;
    } else {
      relatedObjectName = isZh
        ? `家具 (${finding.relatedPlacementId})`
        : `Furniture (${finding.relatedPlacementId})`;
    }
  } else if (finding.wallId) {
    const boundingRooms = plan.rooms.filter((r) =>
      r.boundaryWallIds.includes(finding.wallId!),
    );
    if (boundingRooms.length > 0) {
      const roomNames = boundingRooms
        .map((r) => r.name ?? i18n.getRoomTypeLabel(r.type))
        .join("/");
      relatedObjectName = isZh
        ? `${roomNames}墙体 (${finding.wallId})`
        : `${roomNames} Wall (${finding.wallId})`;
    } else {
      relatedObjectName = isZh
        ? `墙体 (${finding.wallId})`
        : `Wall (${finding.wallId})`;
    }
  } else if (finding.kind === "outside-room") {
    relatedObjectName = isZh ? "房间边界" : "Room Boundary";
  } else {
    relatedObjectName = isZh ? "周边障碍物" : "Surrounding Obstacle";
  }

  // 2. Resolve semantic direction and opposite repair direction
  let sideLabel: string | undefined;
  let oppositeDir: string = isZh ? "反方向" : "opposite direction";
  if (finding.side) {
    switch (finding.side) {
      case "front":
        sideLabel = isZh ? "前侧 · 前方 (front)" : "Front (front)";
        oppositeDir = isZh ? "后侧" : "back";
        break;
      case "back":
        sideLabel = isZh ? "后侧 · 后方 (back)" : "Back (back)";
        oppositeDir = isZh ? "前侧" : "front";
        break;
      case "left":
        sideLabel = isZh ? "左侧 (left)" : "Left (left)";
        oppositeDir = isZh ? "右侧" : "right";
        break;
      case "right":
        sideLabel = isZh ? "右侧 (right)" : "Right (right)";
        oppositeDir = isZh ? "左侧" : "left";
        break;
    }
  }

  const measuredMm = finding.measuredMm ?? 0;
  const minimumMm = finding.minimumMm ?? 0;
  const recommendedMm = finding.recommendedMm ?? minimumMm;

  const measuredFormatted =
    finding.measuredMm !== undefined ? `${finding.measuredMm} mm` : undefined;
  const minimumFormatted =
    finding.minimumMm !== undefined ? `${finding.minimumMm} mm` : undefined;
  const clearanceRangeFormatted = isZh
    ? `最低 ${minimumMm} mm / 推荐 ${recommendedMm} mm`
    : `Min ${minimumMm} mm / Rec ${recommendedMm} mm`;

  let title = isZh ? "空间冲突" : "Spatial Conflict";
  let message = "";
  let repairGuidance = "";
  let severity: "error" | "warning" = "error";
  let recommendedVal: number = recommendedMm;
  let recommendedFormatted = "0 mm";

  if (finding.kind === "furniture-overlap") {
    title = isZh ? "家具重叠冲突" : "Furniture Overlap";
    const shiftMm = Math.max(1, measuredMm);
    message = isZh
      ? `目标家具与${relatedObjectName}重叠 (实测穿插 ${measuredMm} mm)`
      : `Overlaps with ${relatedObjectName} (measured ${measuredMm} mm)`;
    repairGuidance = isZh
      ? `建议向远离${relatedObjectName}方向移动至少 ${shiftMm} mm，或旋转 90° / 切换更小预设规格。`
      : `Move at least ${shiftMm} mm away from ${relatedObjectName}, rotate 90°, or switch to a smaller preset specification.`;
  } else if (finding.kind === "wall-overlap") {
    title = isZh ? "家具穿墙冲突" : "Wall Collision";
    const shiftMm = Math.max(1, measuredMm);
    message = isZh
      ? `目标家具穿插${relatedObjectName} (实测穿插 ${measuredMm} mm)`
      : `Collides with ${relatedObjectName} (measured ${measuredMm} mm)`;
    repairGuidance = isZh
      ? `建议向房间内侧移开至少 ${shiftMm} mm 以脱离${relatedObjectName}，或切换更小预设规格。`
      : `Move at least ${shiftMm} mm inward away from ${relatedObjectName}, or switch to a smaller preset specification.`;
  } else if (finding.kind === "outside-room") {
    title = isZh ? "超出房间边界" : "Outside Room Boundary";
    const shiftMm = Math.max(1, measuredMm);
    message = isZh
      ? `目标家具超出${relatedObjectName} (距边界 ${measuredMm} mm)`
      : `Placement extends outside ${relatedObjectName} (measured ${measuredMm} mm)`;
    repairGuidance = isZh
      ? `建议向房间内部移动至少 ${shiftMm} mm 使其完全处于${relatedObjectName}内，或切换更小预设规格。`
      : `Move at least ${shiftMm} mm inward to stay within ${relatedObjectName}, or switch to a smaller preset specification.`;
  } else if (finding.kind === "below-minimum-clearance") {
    title = isZh ? "方向净距低于最低要求" : "Below Minimum Clearance";
    severity = "error";
    recommendedVal = recommendedMm;
    recommendedFormatted = clearanceRangeFormatted;
    const deficitMin = Math.max(1, minimumMm - measuredMm);
    const deficitRec = Math.max(deficitMin, recommendedMm - measuredMm);
    const dirText = sideLabel ?? (isZh ? "方向" : "Side");
    message = isZh
      ? `${dirText}距${relatedObjectName}实测净距 ${measuredMm} mm，低于最低要求 ${minimumMm} mm（推荐 ${recommendedMm} mm）`
      : `${dirText} clearance to ${relatedObjectName} is ${measuredMm} mm, below minimum ${minimumMm} mm (recommended ${recommendedMm} mm)`;
    repairGuidance = isZh
      ? `建议向${oppositeDir}移动至少 ${deficitMin} mm 以满足最低净距（移动 ${deficitRec} mm 可达推荐净距），或切换更小预设规格。`
      : `Move at least ${deficitMin} mm toward the ${oppositeDir} to meet minimum clearance (${deficitRec} mm for recommended clearance), or switch to a smaller preset specification.`;
  } else if (finding.kind === "below-recommended-clearance") {
    title = isZh ? "方向净距低于推荐值" : "Below Recommended Clearance";
    severity = "warning";
    recommendedVal = recommendedMm;
    recommendedFormatted = clearanceRangeFormatted;
    const deficitRec = Math.max(1, recommendedMm - measuredMm);
    const dirText = sideLabel ?? (isZh ? "方向" : "Side");
    message = isZh
      ? `${dirText}距${relatedObjectName}实测净距 ${measuredMm} mm，已达最低要求 ${minimumMm} mm，但低于推荐值 ${recommendedMm} mm`
      : `${dirText} clearance to ${relatedObjectName} is ${measuredMm} mm (meets minimum ${minimumMm} mm, below recommended ${recommendedMm} mm)`;
    repairGuidance = isZh
      ? `当前已达最低通行净距；建议向${oppositeDir}移动至少 ${deficitRec} mm 以达推荐净距，或切换更小预设规格。`
      : `Minimum clearance is met; move at least ${deficitRec} mm toward the ${oppositeDir} to reach recommended clearance, or switch to a smaller preset specification.`;
  }

  const relatedIds = [
    finding.placementId,
    ...(finding.relatedPlacementId ? [finding.relatedPlacementId] : []),
    ...(finding.wallId ? [finding.wallId] : []),
  ];

  return {
    kind: finding.kind,
    ruleId: finding.kind,
    severity,
    title,
    message,
    repairGuidance,
    relatedObjectName,
    side: finding.side,
    sideLabel,
    relatedEntityIds: relatedIds,
    relatedObjectIds: relatedIds,
    measuredValue: finding.measuredMm,
    minimumValue: finding.minimumMm,
    recommendedValue: recommendedVal,
    measuredFormatted,
    minimumFormatted,
    recommendedFormatted,
  };
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
    ? "本结论基于当前空间规则计算，不构成施工、结构安全保证或绝对使用承诺。仅供家具摆放参考，不构成建筑规范合规保证。"
    : "This conclusion is computed based on current spatial rules and does not constitute a construction, structural safety, building code compliance, or absolute usability guarantee (for furniture placement reference only).";


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
