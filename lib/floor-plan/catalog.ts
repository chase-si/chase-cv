import { STANDARD_FLOOR_PLANS } from "./fixtures/standard-plans";
import { computePlanTotalArea } from "./geometry";
import type { StandardFloorPlan } from "./types";

export interface StandardPlanSummary {
  id: string;
  name: string;
  description: string;
  areaM2: number;
  formattedArea: string;
  roomCount: number;
  roomBreakdown: string;
  tags: string[];
  plan: StandardFloorPlan;
}

const ROOM_TYPE_LABELS: Record<string, string> = {
  living_room: "Living Room",
  bedroom: "Bedroom",
  master_bedroom: "Master Suite",
  kitchen: "Kitchen",
  bathroom: "Bathroom",
  balcony: "Balcony",
  dining_room: "Dining Room",
  study: "Study",
  hallway: "Hallway",
  storage: "Storage",
  other: "Other",
};

function formatRoomBreakdown(plan: StandardFloorPlan): string {
  const counts: Record<string, number> = {};
  for (const r of plan.rooms) {
    counts[r.type] = (counts[r.type] ?? 0) + 1;
  }

  const parts = Object.entries(counts).map(([type, count]) => {
    const label = ROOM_TYPE_LABELS[type] ?? type;
    return `${count} ${label.toLowerCase()}`;
  });

  return `${plan.rooms.length} ${plan.rooms.length === 1 ? "room" : "rooms"} (${parts.join(", ")})`;
}

const PLAN_TAGS: Record<string, string[]> = {
  "plan-std-2br-01": ["Nordic", "2-Room", "Standard"],
  "plan-std-studio-01": ["Studio", "Compact", "Open Plan"],
  "plan-std-3br-01": ["Family", "3-Room", "Spacious"],
};

export function buildStandardPlanSummary(plan: StandardFloorPlan): StandardPlanSummary {
  const id = plan.meta.id ?? plan.meta.name;
  const areaResult = computePlanTotalArea(plan);
  const tags = PLAN_TAGS[id] ?? ["Standard"];

  return {
    id,
    name: plan.meta.name,
    description: plan.meta.description ?? "",
    areaM2: areaResult.areaM2,
    formattedArea: areaResult.formattedAreaM2,
    roomCount: plan.rooms.length,
    roomBreakdown: formatRoomBreakdown(plan),
    tags,
    plan,
  };
}

export function getStandardPlans(): StandardPlanSummary[] {
  return STANDARD_FLOOR_PLANS.map(buildStandardPlanSummary);
}

export function getStandardPlanById(id: string): StandardPlanSummary | undefined {
  const all = getStandardPlans();
  return all.find((p) => p.id === id);
}
