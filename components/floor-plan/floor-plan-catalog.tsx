"use client";

import * as React from "react";
import { Check, Layers } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  FLOOR_PLAN_CATEGORIES,
  type FloorPlanCategoryKey,
  type StandardPlanSummary,
} from "@/lib/floor-plan/catalog";
import { useFloorPlanI18n } from "@/lib/floor-plan/i18n";
import { FloorPlanThumbnail } from "./floor-plan-thumbnail";

interface FloorPlanCatalogProps {
  plans: StandardPlanSummary[];
  activePlanId: string;
  onSelectPlan: (planId: string) => void;
  className?: string;
  locale?: string;
}

export function FloorPlanCatalog({
  plans,
  activePlanId,
  onSelectPlan,
  className = "",
  locale,
}: FloorPlanCatalogProps) {
  const i18n = useFloorPlanI18n(locale);
  const t = i18n.t;
  const [selectedCategory, setSelectedCategory] =
    React.useState<FloorPlanCategoryKey>("all");

  // Calculate counts per category
  const categoryCounts = React.useMemo(() => {
    const counts: Record<FloorPlanCategoryKey, number> = {
      all: plans.length,
      studio: 0,
      "1b1l": 0,
      "2b1l": 0,
      "2b2l": 0,
      "3b1l": 0,
      "3b2l": 0,
      "4b_plus": 0,
    };
    for (const p of plans) {
      if (p.categoryKey && counts[p.categoryKey] !== undefined) {
        counts[p.categoryKey]++;
      }
    }
    return counts;
  }, [plans]);

  // Filter plans by selected category
  const filteredPlans = React.useMemo(() => {
    if (selectedCategory === "all") {
      return plans;
    }
    return plans.filter((p) => p.categoryKey === selectedCategory);
  }, [plans, selectedCategory]);

  return (
    <div
      data-testid="floor-plan-catalog"
      className={`flex flex-col gap-3 p-1 ${className}`}
    >
      {/* Category Filter Pills */}
      <div
        data-testid="catalog-category-filters"
        className="flex flex-wrap gap-1"
      >
        {FLOOR_PLAN_CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.key;
          const label = i18n.locale === "zh" ? cat.labelZh : cat.labelEn;
          const count = categoryCounts[cat.key] ?? 0;

          return (
            <Button
              key={cat.key}
              type="button"
              size="sm"
              variant={isSelected ? "default" : "outline"}
              onClick={() => {
                if (isSelected && cat.key !== "all") {
                  setSelectedCategory("all");
                } else {
                  setSelectedCategory(cat.key);
                }
              }}
              className="h-6 px-2 text-[11px] rounded-md font-medium"
              data-testid={`catalog-filter-${cat.key}`}
            >
              {label} ({count})
            </Button>
          );
        })}
      </div>

      {/* Plans List */}
      <div
        data-testid="catalog-plans-list"
        className="flex flex-col gap-3"
      >
        {filteredPlans.length === 0 ? (
          <div className="py-8 text-center text-xs text-muted-foreground">
            {t.catalog.noResults}
          </div>
        ) : (
          filteredPlans.map((item) => {
            const isActive = item.id === activePlanId;
            return (
              <Card
                key={item.id}
                role="button"
                tabIndex={0}
                aria-pressed={isActive}
                aria-label={`${item.name} (${item.formattedArea})`}
                data-testid={`catalog-plan-card-${item.id}`}
                data-active-plan={isActive ? "true" : "false"}
                data-selected={isActive ? "true" : "false"}
                onClick={() => onSelectPlan(item.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onSelectPlan(item.id);
                  }
                }}
                className={`group cursor-pointer p-3 transition-all duration-150 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none ${
                  isActive
                    ? "border-primary bg-primary/5 ring-1 ring-primary/40 shadow-sm"
                    : "border-border hover:border-primary/50 hover:bg-muted/40"
                }`}
              >
                {/* Thumbnail Preview */}
                <div className="relative aspect-16/10 w-full overflow-hidden rounded-lg border border-border/80 bg-background/80 mb-2.5">
                  <FloorPlanThumbnail plan={item.plan} />
                  {isActive ? (
                    <div className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-[10px] font-medium text-primary-foreground shadow-xs">
                      <Check className="h-3 w-3" />
                      <span>{t.catalog.currentPlanBadge}</span>
                    </div>
                  ) : null}
                </div>

                {/* Plan Header: Name & Area */}
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="min-w-0">
                    <h3
                      data-testid={`plan-name-${item.id}`}
                      className="font-semibold text-sm tracking-tight text-foreground truncate group-hover:text-primary transition-colors"
                    >
                      {item.name}
                    </h3>
                    <p
                      data-testid={`plan-id-${item.id}`}
                      className="mt-0.5 truncate font-mono text-[10px] text-muted-foreground"
                    >
                      {item.id}
                    </p>
                  </div>
                  <Badge
                    data-testid={`plan-area-${item.id}`}
                    variant="secondary"
                    className="shrink-0 font-mono text-[11px] font-medium"
                  >
                    {item.formattedArea}
                  </Badge>
                </div>

                {/* Room Breakdown & Counts */}
                <div
                  data-testid={`plan-rooms-${item.id}`}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2"
                >
                  <Layers className="h-3.5 w-3.5 shrink-0 text-muted-foreground/80" />
                  <span className="truncate">{item.roomBreakdown}</span>
                </div>

                {/* Description */}
                {item.description ? (
                  <p className="text-[11px] text-muted-foreground/90 line-clamp-2 mb-2 leading-relaxed">
                    {item.description}
                  </p>
                ) : null}

                {/* Tags and Action */}
                <div className="flex items-center justify-between gap-2 pt-1 border-t border-border/60">
                  <div
                    data-testid={`plan-tags-${item.id}`}
                    className="flex flex-wrap gap-1"
                  >
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center rounded-md bg-secondary/80 px-1.5 py-0.5 text-[10px] font-medium text-secondary-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <Button
                    type="button"
                    size="sm"
                    variant={isActive ? "default" : "outline"}
                    aria-pressed={isActive}
                    aria-label={`${isActive ? t.catalog.currentPlanBadge : t.catalog.openPlan}: ${item.name}`}
                    className="min-h-11 min-w-11 lg:h-7 lg:min-h-0 lg:min-w-0 px-2.5 text-xs font-medium touch-manipulation focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectPlan(item.id);
                    }}
                    data-testid={`open-plan-btn-${item.id}`}
                  >
                    {isActive ? t.catalog.currentPlanBadge : t.catalog.openPlan}
                  </Button>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
