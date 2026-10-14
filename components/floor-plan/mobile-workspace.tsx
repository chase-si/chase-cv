"use client";

import * as React from "react";
import { Armchair, ChevronDown, ChevronRight, CircleHelp, ClipboardCheck, Hand, Home, Image as ImageIcon, MapPin, Move, RotateCw, Trash2 } from "lucide-react";
import { ToolPageChrome } from "@/components/tool-page-chrome";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { StandardPlanSummary } from "@/lib/floor-plan/catalog";
import type { FloorPlan, SpaceAssessment } from "@/lib/floor-plan/types";
import { useFloorPlanI18n } from "@/lib/floor-plan/i18n";
import { cn } from "@/lib/utils";
import type { SelectedEntity } from "./types";

type MobileWorkspaceProps = {
  plan: FloorPlan;
  summary: StandardPlanSummary;
  selectedEntity: SelectedEntity | null;
  roomName?: string;
  roomArea?: string;
  assessment: SpaceAssessment;
  canvasMode: "pan" | "edit";
  issueCount: number;
  locale?: string;
  canvas: React.ReactNode;
  overlays: React.ReactNode;
  onModeChange: (mode: "pan" | "edit") => void;
  onOpen: (type: "catalog" | "furniture-palette" | "entity" | "rules" | "rooms" | "help") => void;
  onRotate: () => void;
  onDelete: () => void;
  onExport: () => void;
};

export function MobileWorkspace({ plan, summary, selectedEntity, roomName, roomArea, assessment, canvasMode, issueCount, locale, canvas, overlays, onModeChange, onOpen, onRotate, onDelete, onExport }: MobileWorkspaceProps) {
  const i18n = useFloorPlanI18n(locale);
  const isZh = i18n.locale === "zh";
  const ref = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    const viewport = window.visualViewport;
    const resize = () => {
      const el = ref.current;
      if (el) {
        // Focus restoration can briefly scroll the document during a resize.
        // Measure the workspace's document offset so that scroll never grows it.
        const top = el.getBoundingClientRect().top + window.scrollY;
        el.style.setProperty("--floor-plan-workspace-height", `${Math.max(240, (viewport?.height ?? window.innerHeight) - top)}px`);
      }
    };
    resize(); viewport?.addEventListener("resize", resize); window.addEventListener("resize", resize);
    return () => { viewport?.removeEventListener("resize", resize); window.removeEventListener("resize", resize); };
  }, []);
  const furniture = selectedEntity?.type === "furniture" ? plan.furniture.find((f) => f.id === selectedEntity.id) : null;
  const label = furniture ? i18n.getFurnitureName(furniture.definitionId) : selectedEntity
    ? selectedEntity.type === "room" ? roomName : i18n.t.mobileSheet[`${selectedEntity.type}Properties` as "wallProperties" | "openingProperties" | "dimensionProperties"]
    : isZh ? "从一个房间开始" : "Start with a room";
  const status = {
    suitable: isZh ? "摆放合适" : "Suitable",
    "trade-off": isZh ? "空间略紧" : "Tight fit",
    "must-adjust": isZh ? "需要调整" : "Adjust layout",
    unavailable: isZh ? "无法评估" : "Unavailable",
  }[assessment.status];
  const landscapeGrid = "[@media(max-height:540px)_and_(min-width:640px)]:grid [@media(max-height:540px)_and_(min-width:640px)]:grid-cols-[minmax(0,1.3fr)_minmax(260px,1fr)] [@media(max-height:540px)_and_(min-width:640px)]:grid-rows-[auto_minmax(0,1fr)_auto]";

  return <div ref={ref} data-testid="floor-plan-mobile-workspace" className="flex h-[var(--floor-plan-workspace-height,calc(100dvh-4rem-1px))] min-h-0 flex-col">
    <ToolPageChrome title={isZh ? "户型摆放实验室" : "Floor Plan Lab"}
      className="h-full max-h-full overflow-hidden [&>main]:gap-2 [&>main]:overflow-hidden [&>main]:px-3 [&>main]:py-2 [&>main>header]:flex-row [&>main>header]:justify-between [&>main>header]:gap-2 [&>main>header]:py-0 [&>main>header_h1]:text-lg [@media(max-height:700px)]:[&>main>header]:sr-only">
      <div className={cn("flex min-h-0 flex-1 flex-col gap-2 overflow-x-hidden [@media(max-height:540px)_and_(min-width:640px)]:[&_[data-testid=active-plan-area]]:hidden [@media(max-height:540px)_and_(min-width:640px)]:[&_[data-testid=mobile-selection-description]]:hidden", landscapeGrid)}>
        <div className="shrink-0 space-y-2 [@media(max-height:540px)_and_(min-width:640px)]:col-start-2 [@media(max-height:540px)_and_(min-width:640px)]:row-start-1">
          <Button data-testid="open-plan-selector-btn" variant="outline" className="h-auto min-h-11 w-full justify-between gap-2 px-3 py-2 text-left" aria-label={isZh ? "切换户型" : "Change Plan"} onClick={() => onOpen("catalog")}>
            <Home className="size-5 text-primary" /><span data-testid="active-plan-summary" className="min-w-0 flex-1"><span data-testid="active-plan-name" className="block truncate font-semibold">{summary.name}</span><span data-testid="active-plan-area" className="block truncate text-[11px] text-muted-foreground">{summary.tags.join(" / ")} · {summary.roomCount} {isZh ? "个功能区" : "rooms"} · {summary.formattedArea}</span></span><ChevronDown />
          </Button>
          <div data-testid="floor-plan-toolbar" className="flex items-center justify-between gap-2">
            <div className="flex gap-2">
              <Button className="h-11 min-w-[44px] px-3" data-testid="mode-toggle-edit" variant={canvasMode === "edit" ? "default" : "outline"} aria-pressed={canvasMode === "edit"} onClick={() => onModeChange("edit")}><Move />{isZh ? "摆放" : "Place"}</Button>
              <Button className="h-11 min-w-[44px] px-3" data-testid="mode-toggle-pan" variant={canvasMode === "pan" ? "default" : "outline"} aria-pressed={canvasMode === "pan"} onClick={() => onModeChange("pan")}><Hand />{isZh ? "浏览" : "Pan"}</Button>
            </div>
            <div className="flex gap-2">
              <Button data-testid="mobile-rooms-btn" variant="outline" className="h-11 min-w-11 px-3 max-[360px]:size-11 max-[360px]:px-0" aria-label={isZh ? "房间" : "Rooms"} onClick={() => onOpen("rooms")}><MapPin /><span className="max-[360px]:hidden">{isZh ? "房间" : "Rooms"}</span></Button>
              <Button variant="outline" className="size-11" aria-label={isZh ? "操作指南" : "Help"} onClick={() => onOpen("help")}><CircleHelp /></Button>
            </div>
          </div>
        </div>
        <section data-testid="floor-plan-canvas-section" className="flex min-h-0 flex-1 flex-col [@media(max-height:540px)_and_(min-width:640px)]:col-start-1 [@media(max-height:540px)_and_(min-width:640px)]:row-span-3 [@media(max-height:540px)_and_(min-width:640px)]:row-start-1">
          <Card className="h-full min-h-0 flex-1 gap-0 p-0">{canvas}</Card>
        </section>
        <Card data-testid="mobile-selection-card" className="min-h-[88px] shrink-0 gap-1.5 p-2.5 [@media(max-height:540px)_and_(min-width:640px)]:col-start-2 [@media(max-height:540px)_and_(min-width:640px)]:row-start-2 [@media(max-height:540px)_and_(min-width:640px)]:self-end [@media(max-height:700px)]:p-2 [@media(max-height:700px)]:gap-1">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0"><p data-testid="mobile-selection-name" className="truncate text-sm font-semibold">{label}</p><p data-testid="mobile-selection-description" className="truncate text-[11px] text-muted-foreground [@media(max-height:700px)]:hidden">{furniture ? `${furniture.width} × ${furniture.depth} mm · ${furniture.rotation}°` : roomArea ?? (isZh ? "选户型 → 点房间 → 摆家具" : "Choose plan → room → furniture")}</p></div>
            <Button variant="ghost" className={cn("h-9 shrink-0 px-2 text-[11px] [@media(max-height:700px)]:h-7", assessment.status === "must-adjust" && "text-destructive")} onClick={() => onOpen("rules")}>{plan.furniture.length ? status : isZh ? "待摆放" : "No furniture"}<ChevronRight /></Button>
          </div>
          <div className="flex items-center gap-2">
            {furniture ? <>
              <Button variant="outline" className="h-11 flex-1" data-testid="mobile-open-properties-btn" onClick={() => onOpen("entity")}>{isZh ? "尺寸 / 微调" : "Size / position"}</Button>
              <Button variant="outline" className="size-11" aria-label={isZh ? "旋转家具 90 度" : "Rotate furniture 90°"} onClick={onRotate}><RotateCw /></Button>
              <Button variant="destructive" className="size-11" aria-label={isZh ? "移除家具" : "Remove furniture"} onClick={onDelete}><Trash2 /></Button>
            </> : <>
              <Button variant="ghost" className="h-11 min-w-0 flex-1 justify-start truncate px-1 text-xs text-muted-foreground" onClick={() => onOpen(selectedEntity ? "entity" : "rooms")}>{selectedEntity ? isZh ? "查看尺寸与详情" : "View details" : roomName ?? (isZh ? "点击房间选择摆放区域" : "Choose a room")}</Button>
              <Button variant="outline" className="h-11" data-testid="open-furniture-catalog-btn" onClick={() => onOpen("furniture-palette")}><Armchair />{isZh ? "添加家具" : "Add"}</Button>
            </>}
          </div>
        </Card>
        <nav aria-label={isZh ? "户型工具操作" : "Floor plan actions"} className="grid shrink-0 grid-cols-3 gap-2 pb-[var(--safe-area-inset-bottom,env(safe-area-inset-bottom,0px))] [@media(max-height:540px)_and_(min-width:640px)]:col-start-2 [@media(max-height:540px)_and_(min-width:640px)]:row-start-3">
          <Button className="h-11 min-w-11 px-2 text-xs" data-testid="mobile-add-furniture-btn" onClick={() => onOpen("furniture-palette")}><Armchair />{isZh ? "家具" : "Furniture"}</Button>
          <Button variant="outline" className="h-11 min-w-11 px-2 text-xs" data-testid="mobile-rules-btn" onClick={() => onOpen("rules")}><ClipboardCheck />{isZh ? "检查" : "Check"}{issueCount > 0 && <span className="text-[10px]">{issueCount}</span>}</Button>
          <Button variant="outline" className="h-11 min-w-11 px-2 text-xs" data-testid="export-plan-image-btn" onClick={onExport}><ImageIcon />{isZh ? "出图" : "Image"}</Button>
        </nav>
      </div>
      {overlays}
    </ToolPageChrome>
  </div>;
}
