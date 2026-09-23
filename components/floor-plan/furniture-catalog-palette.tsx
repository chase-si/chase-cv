"use client";

import * as React from "react";
import {
  Armchair,
  Bed,
  Box,
  Check,
  Monitor,
  Plus,
  Search,
  SlidersHorizontal,
  Sofa,
  Table2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  ALL_FURNITURE_CATEGORIES,
  getDefaultFurnitureCatalog,
} from "@/lib/floor-plan/furniture-catalog";
import { addFurnitureInstance } from "@/lib/floor-plan/furniture-operations";
import { useFloorPlanI18n } from "@/lib/floor-plan/i18n";
import type {
  FloorPlan,
  FurnitureCatalog,
  FurnitureCategory,
  FurnitureDefinition,
} from "@/lib/floor-plan/types";
import { cn } from "@/lib/utils";
import type { SelectedEntity } from "./types";

interface FurnitureCatalogPaletteProps {
  locale?: string;
  plan: FloorPlan;
  catalog?: FurnitureCatalog;
  onUpdatePlan?: (updatedPlan: FloorPlan) => void;
  onSelect?: (entity: SelectedEntity | null) => void;
  onSelectDefinition?: (definitionId: string) => void;
  onClose?: () => void;
  className?: string;
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  bed: <Bed className="h-3.5 w-3.5" />,
  sofa: <Sofa className="h-3.5 w-3.5" />,
  table: <Table2 className="h-3.5 w-3.5" />,
  chair: <Armchair className="h-3.5 w-3.5" />,
  storage: <Box className="h-3.5 w-3.5" />,
  desk: <SlidersHorizontal className="h-3.5 w-3.5" />,
  tv_stand: <Monitor className="h-3.5 w-3.5" />,
};

export function FurnitureCatalogPalette({
  locale,
  plan,
  catalog: propCatalog,
  onUpdatePlan,
  onSelect,
  onSelectDefinition,
  onClose,
  className = "",
}: FurnitureCatalogPaletteProps) {
  const i18n = useFloorPlanI18n(locale);
  const t = i18n.t.furniturePalette;

  const catalog = React.useMemo(
    () => propCatalog ?? getDefaultFurnitureCatalog(),
    [propCatalog],
  );

  const [selectedCategory, setSelectedCategory] = React.useState<
    FurnitureCategory | "all"
  >("all");
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [recentlyAddedId, setRecentlyAddedId] = React.useState<string | null>(null);

  // Filter definitions based on category and search query (AC-10)
  const filteredDefinitions = React.useMemo(() => {
    return catalog.definitions.filter((def) => {
      if (selectedCategory !== "all" && def.category !== selectedCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const localizedName = i18n.getFurnitureName(def.id, def.name).toLowerCase();
        const categoryLabel = i18n.getFurnitureCategoryLabel(def.category).toLowerCase();
        return (
          def.name.toLowerCase().includes(q) ||
          localizedName.includes(q) ||
          def.id.toLowerCase().includes(q) ||
          def.category.toLowerCase().includes(q) ||
          categoryLabel.includes(q)
        );
      }
      return true;
    });
  }, [catalog.definitions, selectedCategory, searchQuery, i18n]);

  // Add furniture item using default dimensions (AC-10, AC-12)
  const handleAddFurniture = (def: FurnitureDefinition) => {
    if (onSelectDefinition) {
      onSelectDefinition(def.id);
      if (onClose) {
        onClose();
      }
      return;
    }

    const res = addFurnitureInstance(plan, catalog, def.id);
    if (res.success) {
      setRecentlyAddedId(res.instance.id);
      onUpdatePlan?.(res.plan);
      onSelect?.({ type: "furniture", id: res.instance.id });
      setTimeout(() => {
        setRecentlyAddedId(null);
      }, 1500);
      if (onClose) {
        onClose();
      }
    }
  };

  return (
    <div
      data-testid="furniture-catalog-palette"
      className={cn("flex flex-col gap-3 text-xs", className)}
    >
      {/* Search Input */}
      <div className="relative flex items-center">
        <Search className="absolute left-2.5 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
        <Input
          data-testid="furniture-search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t.searchPlaceholder}
          className="h-8 pl-8 text-xs bg-background"
        />
      </div>

      {/* Category Filter Pills / Tabs (AC-10) */}
      <div
        data-testid="furniture-category-filters"
        className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none"
      >
        <button
          type="button"
          data-testid="category-filter-all"
          onClick={() => setSelectedCategory("all")}
          className={cn(
            "h-7 px-2.5 rounded-md text-[11px] font-medium shrink-0 transition-colors flex items-center gap-1.5",
            selectedCategory === "all"
              ? "bg-primary text-primary-foreground font-semibold shadow-xs"
              : "bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted",
          )}
        >
          <span>{t.allCategory}</span>
          <span className="opacity-70 text-[10px]">({catalog.definitions.length})</span>
        </button>

        {ALL_FURNITURE_CATEGORIES.map((cat) => {
          const count = catalog.definitions.filter((d) => d.category === cat).length;
          return (
            <button
              key={cat}
              type="button"
              data-testid={`category-filter-${cat}`}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                "h-7 px-2.5 rounded-md text-[11px] font-medium shrink-0 transition-colors flex items-center gap-1.5",
                selectedCategory === cat
                  ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                  : "bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted",
              )}
            >
              {CATEGORY_ICONS[cat]}
              <span>{i18n.getFurnitureCategoryLabel(cat)}</span>
              <span className="opacity-70 text-[10px]">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Furniture List */}
      <div
        data-testid="furniture-definition-list"
        className="grid grid-cols-1 gap-2 max-h-[380px] overflow-y-auto pr-1"
      >
        {filteredDefinitions.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border p-6 text-center text-muted-foreground">
            {t.noResults}
          </div>
        ) : (
          filteredDefinitions.map((def) => {
            const defaultSpec = def.specifications?.[0];
            const width = def.defaultSize?.width ?? defaultSpec?.width ?? 0;
            const depth = def.defaultSize?.depth ?? defaultSpec?.depth ?? 0;
            const height = def.defaultSize?.height ?? defaultSpec?.height;
            const widthRange = def.allowedSizeRanges?.width;
            const depthRange = def.allowedSizeRanges?.depth;

            return (
              <Card
                key={def.id}
                data-testid={`furniture-catalog-card-${def.id}`}
                className="overflow-hidden border-border/80 hover:border-primary/50 transition-colors bg-card/60 p-2.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-foreground text-xs truncate">
                        {i18n.getFurnitureName(def.id, def.name)}
                      </span>
                      <Badge
                        variant="secondary"
                        className="font-mono text-[9px] uppercase px-1.5 py-0"
                      >
                        {i18n.getFurnitureCategoryLabel(def.category)}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2 font-mono text-[11px] text-muted-foreground">
                      <span>
                        {i18n.locale === "zh" ? "默认：" : "Default: "}<strong className="text-foreground">{width} × {depth} mm</strong>
                      </span>
                      {height && (
                        <span>({i18n.locale === "zh" ? `高：${height} mm` : `H: ${height} mm`})</span>
                      )}
                    </div>

                    {(widthRange || depthRange) && (
                      <p className="text-[10px] text-muted-foreground/80 leading-tight">
                        {i18n.locale === "zh"
                          ? `可调范围：宽 ${widthRange?.min}–${widthRange?.max}mm，深 ${depthRange?.min}–${depthRange?.max}mm`
                          : `Range: W ${widthRange?.min}–${widthRange?.max}mm, D ${depthRange?.min}–${depthRange?.max}mm`}
                      </p>
                    )}
                  </div>

                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    data-testid={`add-furniture-item-${def.id}`}
                    onClick={() => handleAddFurniture(def)}
                    className="h-7 px-2 text-xs shrink-0 flex items-center gap-1 hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>{i18n.locale === "zh" ? "添加" : "Add"}</span>
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
