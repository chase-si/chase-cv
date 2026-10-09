import { FLOOR_PLAN_CATALOG_DATA } from "./catalog-data";
import { computePlanTotalArea } from "./geometry";
import type { StandardFloorPlan } from "./types";

export type FloorPlanCategoryKey = "all" | "1br" | "2br" | "3br";

export interface FloorPlanCategoryOption {
  key: FloorPlanCategoryKey;
  labelZh: string;
  labelEn: string;
}

export const FLOOR_PLAN_CATEGORIES: FloorPlanCategoryOption[] = [
  { key: "all", labelZh: "全部", labelEn: "All" },
  { key: "1br", labelZh: "一室", labelEn: "1BR" },
  { key: "2br", labelZh: "二室", labelEn: "2BR" },
  { key: "3br", labelZh: "三室", labelEn: "3BR" },
];

export interface StandardPlanSummary {
  id: string;
  name: string;
  description: string;
  areaM2: number;
  formattedArea: string;
  roomCount: number;
  roomBreakdown: string;
  tags: string[];
  categoryKey: FloorPlanCategoryKey;
  plan: StandardFloorPlan;
}

import { getFloorPlanI18n } from "./i18n";

export function formatRoomBreakdown(plan: StandardFloorPlan, locale?: string): string {
  const i18n = getFloorPlanI18n(locale);
  return i18n.formatRoomBreakdown(plan);
}

function countBedrooms(plan: StandardFloorPlan): number {
  return plan.rooms.filter(
    (r) => r.type === "bedroom" || r.type === "master_bedroom",
  ).length;
}

/** Parse `1br` / `2br0` / `3br` style tokens from realistic Chinese plan IDs. */
function parseBedroomCountFromId(id: string): number | null {
  const match = id.match(/(?:^|-)(\d)br(?:0)?(?:-|$)/i);
  if (!match) return null;
  return Number(match[1]);
}

function resolveBedroomCount(plan: StandardFloorPlan): number {
  const id = (plan.meta.id ?? "").toLowerCase();
  if (id.includes("studio")) return 1;
  const fromId = parseBedroomCountFromId(id);
  if (fromId !== null) return fromId;
  return countBedrooms(plan);
}

function categoryFromBedroomCount(bedroomCount: number): FloorPlanCategoryKey {
  if (bedroomCount <= 1) return "1br";
  if (bedroomCount === 2) return "2br";
  return "3br";
}

function tagFromBedroomCount(bedroomCount: number, isZh: boolean): string[] {
  if (bedroomCount <= 1) return [isZh ? "一室" : "1BR"];
  if (bedroomCount === 2) return [isZh ? "二室" : "2BR"];
  return [isZh ? "三室" : "3BR"];
}

export function resolvePlanCategory(plan: StandardFloorPlan): FloorPlanCategoryKey {
  return categoryFromBedroomCount(resolveBedroomCount(plan));
}

export function resolvePlanTags(plan: StandardFloorPlan, locale?: string): string[] {
  const isZh = locale === "zh" || (typeof window !== "undefined" && window.location.pathname.startsWith("/zh"));
  return tagFromBedroomCount(resolveBedroomCount(plan), isZh);
}

export function buildStandardPlanSummary(plan: StandardFloorPlan, locale?: string): StandardPlanSummary {
  const id = plan.meta.id ?? plan.meta.name;
  const areaResult = computePlanTotalArea(plan);
  const i18n = getFloorPlanI18n(locale);
  const tags = resolvePlanTags(plan, i18n.locale);
  const categoryKey = resolvePlanCategory(plan);

  return {
    id,
    name: i18n.getPlanName(id, plan.meta.name),
    description: i18n.getPlanDescription(id, plan.meta.description ?? ""),
    areaM2: areaResult.areaM2,
    formattedArea: areaResult.formattedAreaM2,
    roomCount: plan.rooms.length,
    roomBreakdown: i18n.formatRoomBreakdown(plan),
    tags,
    categoryKey,
    plan,
  };
}

import { validateCandidateFloorPlan } from "./validators";
import type { ValidationError, ValidationResult } from "./types";

export interface CatalogAssetValidationFailure {
  planId: string;
  planName: string;
  errors: ValidationError[];
}

export function validateStandardPlanCatalog(
  plans: readonly StandardFloorPlan[] = FLOOR_PLAN_CATALOG_DATA,
): ValidationResult<readonly StandardFloorPlan[]> & {
  failures?: CatalogAssetValidationFailure[];
} {
  const allErrors: ValidationError[] = [];
  const failures: CatalogAssetValidationFailure[] = [];

  plans.forEach((plan, index) => {
    const planId = plan?.meta?.id || plan?.meta?.name || `plan[${index}]`;
    const planName = plan?.meta?.name || planId;
    const res = validateCandidateFloorPlan(plan);
    if (!res.ok) {
      failures.push({
        planId,
        planName,
        errors: res.errors,
      });
      for (const err of res.errors) {
        allErrors.push({
          path: err.path ? `${planId}.${err.path}` : planId,
          message: `[${planId}] ${err.message}`,
          code: err.code,
        });
      }
    }
  });

  if (allErrors.length > 0) {
    return {
      ok: false,
      errors: allErrors,
      failures,
    };
  }

  return {
    ok: true,
    value: plans,
  };
}

let defaultCatalogValidated = false;

export function assertValidStandardPlanCatalog(
  plans: readonly StandardFloorPlan[] = FLOOR_PLAN_CATALOG_DATA,
): void {
  if (plans === FLOOR_PLAN_CATALOG_DATA && defaultCatalogValidated) {
    return;
  }

  const result = validateStandardPlanCatalog(plans);
  if (!result.ok) {
    const details = result.errors
      .map((e) => `${e.path}: ${e.message}`)
      .join("; ");
    throw new Error(
      `Standard floor plan catalog validation failed: ${details}`,
    );
  }

  if (plans === FLOOR_PLAN_CATALOG_DATA) {
    defaultCatalogValidated = true;
  }
}

export function getStandardPlans(
  locale?: string,
  plansData: readonly StandardFloorPlan[] = FLOOR_PLAN_CATALOG_DATA,
): StandardPlanSummary[] {
  assertValidStandardPlanCatalog(plansData);
  return plansData.map((p) => buildStandardPlanSummary(p, locale));
}

export function getStandardPlanById(
  id: string,
  locale?: string,
  plansData: readonly StandardFloorPlan[] = FLOOR_PLAN_CATALOG_DATA,
): StandardPlanSummary | undefined {
  const all = getStandardPlans(locale, plansData);
  return all.find((p) => p.id === id);
}
