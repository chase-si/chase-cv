"use client";

import * as React from "react";
import { Check, Compass, Layers, Search, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { StandardPlanSummary } from "@/lib/floor-plan/catalog";
import { FloorPlanThumbnail } from "./floor-plan-thumbnail";

interface FloorPlanCatalogProps {
  plans: StandardPlanSummary[];
  activePlanId: string;
  onSelectPlan: (planId: string) => void;
  className?: string;
}

export function FloorPlanCatalog({
  plans,
  activePlanId,
  onSelectPlan,
  className = "",
}: FloorPlanCatalogProps) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedTag, setSelectedTag] = React.useState<string | null>(null);

  // Collect all unique tags
  const allTags = React.useMemo(() => {
    const set = new Set<string>();
    for (const p of plans) {
      for (const t of p.tags) {
        set.add(t);
      }
    }
    return Array.from(set);
  }, [plans]);

  // Filter plans by query and tag
  const filteredPlans = React.useMemo(() => {
    return plans.filter((p) => {
      const matchesQuery =
        searchQuery.trim() === "" ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesTag = !selectedTag || p.tags.includes(selectedTag);

      return matchesQuery && matchesTag;
    });
  }, [plans, searchQuery, selectedTag]);

  return (
    <div
      data-testid="floor-plan-catalog"
      className={`flex flex-col gap-3 p-1 ${className}`}
    >
      {/* Search & Tag Filter Bar */}
      <div className="flex flex-col gap-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search standard plans..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 text-xs"
            data-testid="catalog-search-input"
          />
        </div>

        {/* Tag pills */}
        <div className="flex flex-wrap gap-1">
          <Button
            type="button"
            size="sm"
            variant={selectedTag === null ? "default" : "outline"}
            onClick={() => setSelectedTag(null)}
            className="h-6 px-2 text-[11px] rounded-md"
          >
            All ({plans.length})
          </Button>
          {allTags.map((tag) => (
            <Button
              key={tag}
              type="button"
              size="sm"
              variant={selectedTag === tag ? "default" : "outline"}
              onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
              className="h-6 px-2 text-[11px] rounded-md"
            >
              {tag}
            </Button>
          ))}
        </div>
      </div>

      {/* Plans List */}
      <div
        data-testid="catalog-plans-list"
        className="flex flex-col gap-3"
      >
        {filteredPlans.length === 0 ? (
          <div className="py-8 text-center text-xs text-muted-foreground">
            No standard plans matching your filter.
          </div>
        ) : (
          filteredPlans.map((item) => {
            const isActive = item.id === activePlanId;
            return (
              <Card
                key={item.id}
                data-testid={`catalog-plan-card-${item.id}`}
                data-active-plan={isActive ? "true" : "false"}
                onClick={() => onSelectPlan(item.id)}
                className={`group cursor-pointer p-3 transition-all duration-150 ${
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
                      <span>Viewing</span>
                    </div>
                  ) : null}
                </div>

                {/* Plan Header: Name & Area */}
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3
                    data-testid={`plan-name-${item.id}`}
                    className="font-semibold text-sm tracking-tight text-foreground truncate group-hover:text-primary transition-colors"
                  >
                    {item.name}
                  </h3>
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
                    className="h-7 px-2.5 text-xs font-medium"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectPlan(item.id);
                    }}
                    data-testid={`open-plan-btn-${item.id}`}
                  >
                    {isActive ? "Active" : "Open Plan"}
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
