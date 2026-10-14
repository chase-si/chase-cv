"use client";

import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getDefaultFurnitureCatalog } from "@/lib/floor-plan/furniture-catalog";
import { useFloorPlanI18n } from "@/lib/floor-plan/i18n";
import type { FurnitureInstance } from "@/lib/floor-plan/types";

export function FurnitureSizePicker({ furniture, onChange, locale }: {
  furniture: FurnitureInstance;
  onChange: (specificationId: string) => void;
  locale?: string;
}) {
  const i18n = useFloorPlanI18n(locale);
  const isZh = i18n.locale === "zh";
  const definition = getDefaultFurnitureCatalog().definitions.find((item) => item.id === furniture.definitionId);

  return <div data-testid="furniture-size-picker" className="space-y-3">
    <div className="flex items-center justify-between gap-2">
      <p className="min-w-0 truncate text-sm font-semibold">{i18n.getFurnitureName(furniture.definitionId)}</p>
      <p className="shrink-0 text-xs text-muted-foreground">{isZh ? "宽 × 深 · mm" : "Width × depth · mm"}</p>
    </div>
    <div className="grid grid-cols-2 gap-2">
      {definition?.specifications.map((spec) => {
        const active = furniture.specificationId === spec.id || (!furniture.specificationId && furniture.width === spec.width && furniture.depth === spec.depth);
        return <Button key={spec.id} variant={active ? "default" : "outline"}
          className="h-12 min-w-0 justify-between gap-1 px-3 font-mono text-xs"
          data-testid={`inspector-spec-option-${spec.id}`} data-selected={active ? "true" : "false"}
          aria-pressed={active} aria-label={isZh ? `选择尺寸 ${spec.width} × ${spec.depth} mm` : `Select size ${spec.width} × ${spec.depth} mm`}
          onClick={() => onChange(spec.id)}>
          <span>{spec.width} × {spec.depth}</span>{active && <Check className="size-4" />}
        </Button>;
      })}
    </div>
  </div>;
}
