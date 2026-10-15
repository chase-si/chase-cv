"use client";

import * as React from "react";
import { Check, Copy, Edit2, Layers, PlusSquare, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  FLOOR_PLAN_CATEGORIES,
  type FloorPlanCategoryKey,
  type StandardPlanSummary,
} from "@/lib/floor-plan/catalog";
import { useFloorPlanI18n } from "@/lib/floor-plan/i18n";
import { FloorPlanThumbnail } from "./floor-plan-thumbnail";

export interface FloorPlanCatalogProps {
  plans: StandardPlanSummary[];
  activePlanId: string;
  onSelectPlan: (planId: string) => void;
  onCreateRoomClick?: () => void;
  onRenameRoom?: (planId: string, newName: string) => void;
  onDuplicateRoom?: (planId: string) => void;
  onDeleteRoom?: (planId: string) => void;
  className?: string;
  locale?: string;
}

export function FloorPlanCatalog({
  plans,
  activePlanId,
  onSelectPlan,
  onCreateRoomClick,
  onRenameRoom,
  onDuplicateRoom,
  onDeleteRoom,
  className = "",
  locale,
}: FloorPlanCatalogProps) {
  const i18n = useFloorPlanI18n(locale);
  const t = i18n.t;
  const isZh = i18n.locale === "zh";
  const [selectedCategory, setSelectedCategory] =
    React.useState<FloorPlanCategoryKey>("all");

  const [renamingPlan, setRenamingPlan] = React.useState<{ id: string; name: string } | null>(
    null,
  );
  const [deletingPlanId, setDeletingPlanId] = React.useState<string | null>(null);

  // Calculate counts per category
  const categoryCounts = React.useMemo(() => {
    const counts: Record<FloorPlanCategoryKey, number> = {
      all: plans.length,
      custom: 0,
      "1br": 0,
      "2br": 0,
      "3br": 0,
    };
    for (const p of plans) {
      if (p.categoryKey && p.categoryKey in counts) {
        counts[p.categoryKey as FloorPlanCategoryKey]++;
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
      {onCreateRoomClick && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          data-testid="selector-create-room-btn"
          onClick={onCreateRoomClick}
          className="h-9 w-full justify-center gap-1.5 text-xs font-medium touch-manipulation"
        >
          <PlusSquare className="h-4 w-4 text-primary" />
          <span>{i18n.locale === "zh" ? "新建长方形房间" : "Create Rectangular Room"}</span>
        </Button>
      )}

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
          selectedCategory === "custom" ? (
            <div
              data-testid="empty-custom-rooms"
              className="py-10 flex flex-col items-center justify-center text-center gap-3 border border-dashed border-border rounded-xl p-6"
            >
              <p className="text-xs text-muted-foreground">
                {isZh ? "暂无自定义房间" : "No custom rooms yet"}
              </p>
              {onCreateRoomClick && (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  data-testid="empty-create-room-btn"
                  onClick={onCreateRoomClick}
                  className="h-8 gap-1.5 text-xs font-medium"
                >
                  <PlusSquare className="h-3.5 w-3.5 text-primary" />
                  <span>{isZh ? "新建长方形房间" : "Create Rectangular Room"}</span>
                </Button>
              )}
            </div>
          ) : (
            <div className="py-8 text-center text-xs text-muted-foreground">
              {t.catalog.noResults}
            </div>
          )
        ) : (
          filteredPlans.map((item) => {
            const isActive = item.id === activePlanId;
            const isCustom = item.categoryKey === "custom";

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
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-border/60">
                  <div
                    data-testid={`plan-tags-${item.id}`}
                    className="flex flex-wrap items-center gap-1"
                  >
                    {isCustom && (
                      <Badge
                        variant="outline"
                        className="text-[10px] px-1.5 py-0.5 border-primary/20 bg-primary/10 text-primary font-medium"
                      >
                        {isZh ? "我的房间" : "My Room"}
                      </Badge>
                    )}
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center rounded-md bg-secondary/80 px-1.5 py-0.5 text-[10px] font-medium text-secondary-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex flex-wrap items-center gap-1">
                    {isCustom && onRenameRoom && (
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        data-testid={`rename-room-btn-${item.id}`}
                        aria-label={isZh ? "改名" : "Rename"}
                        title={isZh ? "改名" : "Rename"}
                        className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground touch-manipulation"
                        onClick={(e) => {
                          e.stopPropagation();
                          setRenamingPlan({ id: item.id, name: item.name });
                        }}
                      >
                        <Edit2 className="h-3 w-3 mr-1" />
                        <span>{isZh ? "改名" : "Rename"}</span>
                      </Button>
                    )}

                    {isCustom && onDuplicateRoom && (
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        data-testid={`duplicate-room-btn-${item.id}`}
                        aria-label={isZh ? "复制" : "Duplicate"}
                        title={isZh ? "复制" : "Duplicate"}
                        className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground touch-manipulation"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDuplicateRoom(item.id);
                        }}
                      >
                        <Copy className="h-3 w-3 mr-1" />
                        <span>{isZh ? "复制" : "Copy"}</span>
                      </Button>
                    )}

                    {isCustom && onDeleteRoom && (
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        data-testid={`delete-room-btn-${item.id}`}
                        aria-label={isZh ? "删除" : "Delete"}
                        title={isZh ? "删除" : "Delete"}
                        className="h-7 px-2 text-xs text-muted-foreground hover:text-destructive touch-manipulation"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeletingPlanId(item.id);
                        }}
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        <span>{isZh ? "删除" : "Delete"}</span>
                      </Button>
                    )}

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
                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* Rename Dialog */}
      {renamingPlan && (
        <div
          role="dialog"
          aria-modal="true"
          data-testid="rename-room-dialog"
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-foreground/30 backdrop-blur-xs"
        >
          <Card className="w-full max-w-sm p-4 bg-card shadow-xl border-border space-y-3 animate-in fade-in zoom-in-95">
            <h3 className="text-sm font-semibold text-foreground">
              {isZh ? "重命名房间" : "Rename Room"}
            </h3>
            <Input
              data-testid="rename-room-input"
              value={renamingPlan.name}
              onChange={(e) =>
                setRenamingPlan((prev) => (prev ? { ...prev, name: e.target.value } : null))
              }
              placeholder={isZh ? "输入房间名称" : "Enter room name"}
              className="h-8 text-xs"
              autoFocus
            />
            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                data-testid="cancel-rename-btn"
                onClick={() => setRenamingPlan(null)}
                className="h-8 text-xs"
              >
                {isZh ? "取消" : "Cancel"}
              </Button>
              <Button
                type="button"
                variant="default"
                size="sm"
                data-testid="confirm-rename-btn"
                onClick={() => {
                  onRenameRoom?.(renamingPlan.id, renamingPlan.name);
                  setRenamingPlan(null);
                }}
                className="h-8 text-xs font-medium"
              >
                {isZh ? "保存" : "Save"}
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deletingPlanId && (
        <div
          role="dialog"
          aria-modal="true"
          data-testid="confirm-delete-room-dialog"
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-foreground/30 backdrop-blur-xs"
        >
          <Card className="w-full max-w-sm p-4 bg-card shadow-xl border-border space-y-3 animate-in fade-in zoom-in-95">
            <h3 className="text-sm font-semibold text-destructive">
              {isZh ? "确认删除房间？" : "Confirm Delete Room?"}
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {isZh
                ? "删除后该房间的门窗和家具布局将无法恢复，确认删除吗？"
                : "Deleting this room will remove all placed doors, windows, and furniture. Continue?"}
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                data-testid="cancel-delete-room-btn"
                onClick={() => setDeletingPlanId(null)}
                className="h-8 text-xs"
              >
                {isZh ? "取消" : "Cancel"}
              </Button>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                data-testid="confirm-delete-room-btn"
                onClick={() => {
                  const id = deletingPlanId;
                  setDeletingPlanId(null);
                  onDeleteRoom?.(id);
                }}
                className="h-8 text-xs font-medium"
              >
                {isZh ? "确认删除" : "Delete"}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

