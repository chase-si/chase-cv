"use client";

import * as React from "react";
import {
  AlertTriangle,
  Check,
  DoorOpen,
  Maximize2,
  Plus,
  SquareDashed,
  Trash2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardScrollArea, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { FloorPlan } from "@/lib/floor-plan/types";
import {
  type CustomOpeningDraft,
  type CustomRoomWallSide,
  convertDraftsToOpenings,
  convertOpeningsToDrafts,
  createDefaultOpeningDraft,
  rebuildRectangularRoomDimensions,
  validateCustomOpenings,
} from "@/lib/floor-plan/custom-room-openings";
import { formatNetArea } from "@/lib/floor-plan/geometry";

export interface RoomSettingsPanelProps {
  plan: FloorPlan;
  onApplyPlan: (newPlan: FloorPlan) => void;
  onCancel: () => void;
  onDraftPreviewChange?: (
    draftPlan: FloorPlan | null,
    activeWallSide?: CustomRoomWallSide | null,
    activeOpeningId?: string | null,
  ) => void;
  locale?: string;
  isMobile?: boolean;
  className?: string;
}

type OpeningInput = Omit<CustomOpeningDraft, "widthMm" | "offsetMm"> & {
  widthMm: string;
  offsetMm: string;
};

const toOpeningInput = (draft: CustomOpeningDraft): OpeningInput => ({
  ...draft, widthMm: String(draft.widthMm), offsetMm: String(draft.offsetMm),
});

const parseMeasurement = (value: string) => value.trim() === "" ? NaN : Number(value);

export function RoomSettingsPanel({
  plan,
  onApplyPlan,
  onCancel,
  onDraftPreviewChange,
  locale = "zh",
  className,
}: RoomSettingsPanelProps) {
  const isZh = locale.startsWith("zh");

  // Determine room dimensions from plan
  const roomWidthMm =
    plan.meta.customRoom?.widthMm ??
    plan.rooms[0]?.customNetDimensions?.widthMm ??
    3000;
  const roomDepthMm =
    plan.meta.customRoom?.depthMm ??
    plan.rooms[0]?.customNetDimensions?.depthMm ??
    4000;

  // Active sub-tab: "openings" | "dimensions"
  const [activeTab, setActiveTab] = React.useState<"openings" | "dimensions">("openings");

  // Openings draft state
  const [openingInputs, setOpeningInputs] = React.useState<OpeningInput[]>(() =>
    convertOpeningsToDrafts(plan.openings, roomWidthMm, roomDepthMm).map(toOpeningInput),
  );
  const drafts = React.useMemo<CustomOpeningDraft[]>(() => openingInputs.map((input) => ({
    ...input, widthMm: parseMeasurement(input.widthMm), offsetMm: parseMeasurement(input.offsetMm),
  })), [openingInputs]);
  const [activeOpeningId, setActiveOpeningId] = React.useState<string | null>(null);

  // Dimensions state
  const [dimName, setDimName] = React.useState(plan.meta.name);
  const [dimWidthStr, setDimWidthStr] = React.useState(String(roomWidthMm));
  const [dimDepthStr, setDimDepthStr] = React.useState(String(roomDepthMm));
  const [isConfirmRebuildOpen, setIsConfirmRebuildOpen] = React.useState(false);

  // Validation
  const validation = React.useMemo(
    () => validateCustomOpenings(drafts, roomWidthMm, roomDepthMm, locale),
    [drafts, roomWidthMm, roomDepthMm, locale],
  );

  // Active wall side (for highlighting and origin cue)
  const activeWallSide = React.useMemo<CustomRoomWallSide | null>(() => {
    if (activeOpeningId) {
      const activeDraft = drafts.find((d) => d.id === activeOpeningId);
      if (activeDraft) return activeDraft.wall;
    }
    return drafts[0]?.wall ?? null;
  }, [activeOpeningId, drafts]);

  const onDraftPreviewChangeRef = React.useRef(onDraftPreviewChange);
  React.useEffect(() => {
    onDraftPreviewChangeRef.current = onDraftPreviewChange;
  });

  // Live draft preview notification
  React.useEffect(() => {
    const notify = onDraftPreviewChangeRef.current;
    if (!notify) return;

    if (activeTab === "openings") {
      if (validation.isValid) {
        const previewOpenings = convertDraftsToOpenings(drafts, roomWidthMm, roomDepthMm);
        const draftPlan: FloorPlan = {
          ...plan,
          openings: previewOpenings,
        };
        notify(draftPlan, activeWallSide, activeOpeningId);
      } else {
        // Invalid draft: stop rendering illegal layout
        notify(null, activeWallSide, activeOpeningId);
      }
    } else if (activeTab === "dimensions") {
      const w = parseMeasurement(dimWidthStr);
      const d = parseMeasurement(dimDepthStr);
      if (Number.isInteger(w) && w > 0 && Number.isInteger(d) && d > 0) {
        // Preview empty room with new dimensions (AC-6: 尺寸草稿期间预览空房间)
        const rebuildRes = rebuildRectangularRoomDimensions(plan, {
          widthMm: w,
          depthMm: d,
          name: dimName,
          locale,
        });
        notify(rebuildRes.plan, null, null);
      } else {
        notify(null, null, null);
      }
    }
  }, [
    activeTab,
    drafts,
    validation.isValid,
    roomWidthMm,
    roomDepthMm,
    activeWallSide,
    activeOpeningId,
    dimWidthStr,
    dimDepthStr,
    dimName,
    plan,
    locale,
  ]);

  // Handlers for openings
  const handleAddOpening = (type: "door" | "window") => {
    const newDraft = createDefaultOpeningDraft(type, activeWallSide ?? "top");
    setOpeningInputs((prev) => [...prev, toOpeningInput(newDraft)]);
    setActiveOpeningId(newDraft.id);
  };

  const handleUpdateDraft = (
    id: string,
    patch: Partial<Omit<OpeningInput, "id">>,
  ) => {
    setOpeningInputs((prev) =>
      prev.map((d) => (d.id === id ? { ...d, ...patch } : d)),
    );
  };

  const handleDeleteDraft = (id: string) => {
    setOpeningInputs((prev) => prev.filter((d) => d.id !== id));
    if (activeOpeningId === id) {
      setActiveOpeningId(null);
    }
  };

  const handleApplyOpenings = () => {
    if (!validation.isValid) return;
    const finalOpenings = convertDraftsToOpenings(drafts, roomWidthMm, roomDepthMm);
    const updatedPlan: FloorPlan = {
      ...plan,
      openings: finalOpenings,
      meta: {
        ...plan.meta,
        updatedAt: new Date().toISOString(),
      },
    };
    onApplyPlan(updatedPlan);
  };

  // Handlers for dimensions
  const parsedWidth = parseMeasurement(dimWidthStr);
  const parsedDepth = parseMeasurement(dimDepthStr);
  const isDimValid =
    Number.isInteger(parsedWidth) &&
    parsedWidth > 0 &&
    Number.isInteger(parsedDepth) &&
    parsedDepth > 0;

  const isDimChanged =
    isDimValid && (parsedWidth !== roomWidthMm || parsedDepth !== roomDepthMm);

  const handleApplyDimensionsClick = () => {
    if (!isDimValid) return;
    if (isDimChanged) {
      // Must prompt confirmation because furniture and openings will be cleared (AC-9)
      setIsConfirmRebuildOpen(true);
    } else {
      // Only name changed or identical
      const res = rebuildRectangularRoomDimensions(plan, {
        widthMm: parsedWidth,
        depthMm: parsedDepth,
        name: dimName,
        locale,
      });
      onApplyPlan(res.plan);
    }
  };

  const handleConfirmRebuild = () => {
    setIsConfirmRebuildOpen(false);
    const res = rebuildRectangularRoomDimensions(plan, {
      widthMm: parsedWidth,
      depthMm: parsedDepth,
      name: dimName,
      locale,
    });
    onApplyPlan(res.plan);
  };

  const previewNetArea = isDimValid
    ? formatNetArea(parsedWidth, parsedDepth)
    : null;

  return (
    <div
      data-testid="room-settings-panel"
      className={cn("flex flex-col h-full min-h-0 gap-3 text-sm", className)}
    >
      {/* Sub-Tabs: Openings vs Dimensions */}
      <div className="flex rounded-xl bg-muted p-1 gap-1 shrink-0">
        <button
          type="button"
          data-testid="room-settings-tab-openings"
          onClick={() => setActiveTab("openings")}
          className={cn(
            "flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium rounded-lg transition-all",
            activeTab === "openings"
              ? "bg-background text-foreground shadow-xs"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          <DoorOpen className="size-3.5" />
          <span>{isZh ? "门窗设置" : "Doors & Windows"}</span>
        </button>
        <button
          type="button"
          data-testid="room-settings-tab-dimensions"
          onClick={() => setActiveTab("dimensions")}
          className={cn(
            "flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium rounded-lg transition-all",
            activeTab === "dimensions"
              ? "bg-background text-foreground shadow-xs"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          <Maximize2 className="size-3.5" />
          <span>{isZh ? "房间尺寸" : "Dimensions"}</span>
        </button>
      </div>

      {/* Tab 1: Openings View */}
      {activeTab === "openings" && (
        <div className="flex flex-col flex-1 min-h-0 gap-3">
          {/* Add opening actions */}
          <div className="flex items-center gap-2 shrink-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              data-testid="add-door-draft-btn"
              onClick={() => handleAddOpening("door")}
              className="flex-1 gap-1.5 h-8 text-xs font-medium"
            >
              <Plus className="size-3.5 text-primary" />
              <span>{isZh ? "添加门洞 (900mm)" : "Add Door"}</span>
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              data-testid="add-window-draft-btn"
              onClick={() => handleAddOpening("window")}
              className="flex-1 gap-1.5 h-8 text-xs font-medium"
            >
              <Plus className="size-3.5 text-sky-500" />
              <span>{isZh ? "添加窗户 (1200mm)" : "Add Window"}</span>
            </Button>
          </div>

          <p className="text-[11px] text-muted-foreground shrink-0 leading-relaxed">
            {isZh
              ? "支持添加多个门窗或不设门窗。横墙从左量，竖墙从上量；输入至墙角净距。"
              : "Measure from left on horizontal walls, and from top on vertical walls."}
          </p>

          {/* Openings list */}
          <CardScrollArea className="flex-1 min-h-0 space-y-2.5 pr-1">
            {drafts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground border border-dashed rounded-xl p-4">
                <SquareDashed className="size-8 stroke-1 text-muted-foreground/60 mb-1.5" />
                <span className="text-xs">
                  {isZh ? "暂无门窗开口（允许空房直接应用）" : "No openings yet"}
                </span>
              </div>
            ) : (
              openingInputs.map((draft, idx) => {
                const itemErrors = validation.errors[draft.id];
                const isActive = activeOpeningId === draft.id;

                return (
                  <Card
                    key={draft.id}
                    data-testid={`opening-draft-row-${draft.id}`}
                    onClick={() => setActiveOpeningId(draft.id)}
                    className={cn(
                      "p-2.5 transition-all space-y-2 text-xs",
                      isActive
                        ? "border-primary/60 bg-primary/5 shadow-xs"
                        : "border-border/80 hover:border-border",
                      itemErrors && "border-destructive/60 bg-destructive/5",
                    )}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <Badge
                          variant={draft.type === "door" ? "default" : "secondary"}
                          className="text-[10px] px-1.5 py-0"
                        >
                          {draft.type === "door"
                            ? isZh
                              ? "门洞"
                              : "Door"
                            : isZh
                              ? "窗户"
                              : "Window"}
                        </Badge>
                        <span className="text-muted-foreground font-mono text-[11px]">
                          #{idx + 1}
                        </span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        data-testid={`delete-draft-opening-${draft.id}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteDraft(draft.id);
                        }}
                        className="size-7 text-muted-foreground hover:text-destructive"
                        aria-label={isZh ? "删除门窗" : "Delete opening"}
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>

                    {/* Field 1: Wall selection */}
                    <div className="flex items-center gap-2">
                      <label
                        htmlFor={`wall-${draft.id}`}
                        className="text-[11px] text-muted-foreground w-12 shrink-0"
                      >
                        {isZh ? "所在墙体" : "Wall"}
                      </label>
                      <select
                        id={`wall-${draft.id}`}
                        data-testid={`draft-wall-select-${draft.id}`}
                        value={draft.wall}
                        onChange={(e) =>
                          handleUpdateDraft(draft.id, {
                            wall: e.target.value as CustomRoomWallSide,
                          })
                        }
                        className="flex-1 h-7 rounded-lg border border-border bg-background px-2 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                      >
                        <option value="top">
                          {isZh ? `上墙 (宽 ${roomWidthMm}mm，从左量)` : `Top (from left)`}
                        </option>
                        <option value="right">
                          {isZh ? `右墙 (深 ${roomDepthMm}mm，从上量)` : `Right (from top)`}
                        </option>
                        <option value="bottom">
                          {isZh ? `下墙 (宽 ${roomWidthMm}mm，从左量)` : `Bottom (from left)`}
                        </option>
                        <option value="left">
                          {isZh ? `左墙 (深 ${roomDepthMm}mm，从上量)` : `Left (from top)`}
                        </option>
                      </select>
                    </div>

                    {/* Field 2 & 3: Width & Offset inputs */}
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label
                          htmlFor={`width-${draft.id}`}
                          className="text-[10px] text-muted-foreground block"
                        >
                          {isZh ? "开口宽度 (mm)" : "Width (mm)"}
                        </label>
                        <Input
                          id={`width-${draft.id}`}
                          type="number"
                          data-testid={`draft-width-input-${draft.id}`}
                          value={draft.widthMm}
                          onChange={(e) =>
                            handleUpdateDraft(draft.id, {
                              widthMm: e.target.value,
                            })
                          }
                          className={cn(
                            "h-7 text-xs font-mono",
                            itemErrors?.width && "border-destructive text-destructive",
                          )}
                        />
                      </div>
                      <div className="space-y-1">
                        <label
                          htmlFor={`offset-${draft.id}`}
                          className="text-[10px] text-muted-foreground block truncate"
                          title={isZh ? "距起点净距 (mm)" : "Distance from start"}
                        >
                          {isZh ? "距起点净距 (mm)" : "Offset (mm)"}
                        </label>
                        <Input
                          id={`offset-${draft.id}`}
                          type="number"
                          data-testid={`draft-offset-input-${draft.id}`}
                          value={draft.offsetMm}
                          onChange={(e) =>
                            handleUpdateDraft(draft.id, {
                              offsetMm: e.target.value,
                            })
                          }
                          className={cn(
                            "h-7 text-xs font-mono",
                            itemErrors?.offset && "border-destructive text-destructive",
                          )}
                        />
                      </div>
                    </div>

                    {/* Errors */}
                    {itemErrors && (
                      <div
                        data-testid={`draft-error-${draft.id}`}
                        className="text-[10px] text-destructive flex items-start gap-1 pt-0.5"
                      >
                        <AlertTriangle className="size-3 shrink-0 mt-0.5" />
                        <span>
                          {itemErrors.width ||
                            itemErrors.offset ||
                            itemErrors.general}
                        </span>
                      </div>
                    )}
                  </Card>
                );
              })
            )}
          </CardScrollArea>

          {/* Action buttons */}
          <div className="flex items-center gap-2 pt-2 border-t border-border shrink-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              data-testid="cancel-openings-btn"
              onClick={onCancel}
              className="flex-1 h-8 text-xs"
            >
              <X className="size-3.5" />
              <span>{isZh ? "取消" : "Cancel"}</span>
            </Button>
            <Button
              type="button"
              variant="default"
              size="sm"
              data-testid="apply-openings-btn"
              disabled={!validation.isValid}
              onClick={handleApplyOpenings}
              className="flex-1 h-8 text-xs font-medium"
            >
              <Check className="size-3.5" />
              <span>{isZh ? "应用门窗" : "Apply"}</span>
            </Button>
          </div>
        </div>
      )}

      {/* Tab 2: Dimensions View */}
      {activeTab === "dimensions" && (
        <div className="flex flex-col flex-1 min-h-0 gap-3">
          <p className="text-[11px] text-muted-foreground shrink-0 leading-relaxed">
            {isZh
              ? "修改净宽或净深将从空房间重新布置；仅改名不影响已摆放的门窗和家具。"
              : "Rebuilding dimensions will clear furniture and openings. Renaming preserves layout."}
          </p>

          <CardScrollArea className="flex-1 min-h-0 space-y-3 pr-1">
            {/* Room Name */}
            <div className="space-y-1">
              <label
                htmlFor="dimension-name"
                className="text-xs font-medium text-foreground block"
              >
                {isZh ? "房间名称" : "Room Name"}
              </label>
              <Input
                id="dimension-name"
                data-testid="dimension-name-input"
                value={dimName}
                onChange={(e) => setDimName(e.target.value)}
                placeholder={isZh ? "输入房间名称" : "Enter room name"}
                className="h-8 text-xs"
              />
            </div>

            {/* Width and Depth */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="space-y-1">
                <label
                  htmlFor="dimension-width"
                  className="text-xs font-medium text-foreground block"
                >
                  {isZh ? "净宽 (mm)" : "Net Width (mm)"}
                </label>
                <Input
                  id="dimension-width"
                  type="number"
                  data-testid="dimension-width-input"
                  value={dimWidthStr}
                  onChange={(e) => setDimWidthStr(e.target.value)}
                  className="h-8 text-xs font-mono"
                />
              </div>
              <div className="space-y-1">
                <label
                  htmlFor="dimension-depth"
                  className="text-xs font-medium text-foreground block"
                >
                  {isZh ? "净深 (mm)" : "Net Depth (mm)"}
                </label>
                <Input
                  id="dimension-depth"
                  type="number"
                  data-testid="dimension-depth-input"
                  value={dimDepthStr}
                  onChange={(e) => setDimDepthStr(e.target.value)}
                  className="h-8 text-xs font-mono"
                />
              </div>
            </div>

            {/* Area Preview */}
            {!isDimValid && <p role="alert" className="text-xs text-destructive">
              {isZh ? "净宽和净深须为大于 0 的整数毫米" : "Net dimensions must be positive integers in mm"}
            </p>}
            {previewNetArea && (
              <Card className="p-3 bg-muted/40 border-border/70 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">
                    {isZh ? "计算净面积" : "Net Clear Area"}
                  </span>
                  <Badge variant="secondary" className="font-mono text-xs">
                    {previewNetArea.formattedAreaM2}
                  </Badge>
                </div>
                <div className="text-[11px] text-muted-foreground font-mono">
                  {parsedWidth} × {parsedDepth} mm
                </div>
              </Card>
            )}

            {isDimChanged && (
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-2.5 text-xs text-amber-700 dark:text-amber-300 space-y-1">
                <div className="flex items-center gap-1.5 font-medium">
                  <AlertTriangle className="size-3.5 shrink-0" />
                  <span>{isZh ? "尺寸重建提醒" : "Rebuild Notice"}</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  {isZh
                    ? "由于改变了房间尺寸，应用后将清空本房间的全部门窗和家具，按新尺寸重建空房间。"
                    : "Changing dimensions will clear all placed doors, windows, and furniture."}
                </p>
              </div>
            )}
          </CardScrollArea>

          {/* Action buttons */}
          <div className="flex items-center gap-2 pt-2 border-t border-border shrink-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              data-testid="cancel-dimensions-btn"
              onClick={onCancel}
              className="flex-1 h-8 text-xs"
            >
              <X className="size-3.5" />
              <span>{isZh ? "取消" : "Cancel"}</span>
            </Button>
            <Button
              type="button"
              variant="default"
              size="sm"
              data-testid="apply-dimensions-btn"
              disabled={!isDimValid}
              onClick={handleApplyDimensionsClick}
              className="flex-1 h-8 text-xs font-medium"
            >
              <Check className="size-3.5" />
              <span>{isZh ? "应用尺寸" : "Apply Dimensions"}</span>
            </Button>
          </div>
        </div>
      )}

      {/* Confirmation Dialog for Dimension Rebuild (AC-9) */}
      {isConfirmRebuildOpen && (
        <div
          role="dialog"
          aria-modal="true"
          data-testid="confirm-rebuild-dimensions-dialog"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/30 backdrop-blur-xs"
        >
          <Card className="w-full max-w-sm p-4 bg-card shadow-xl border-border space-y-3 animate-in fade-in zoom-in-95">
            <CardHeader className="p-0 space-y-1">
              <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                <AlertTriangle className="size-4 text-amber-500" />
                <span>{isZh ? "确认重建房间尺寸？" : "Confirm Rebuild Dimensions?"}</span>
              </CardTitle>
            </CardHeader>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {isZh
                ? "改变房间尺寸将清空本房间全部门窗和家具，按新净尺寸重新开始布置。此操作不可撤销，是否继续？"
                : "Changing room dimensions will clear all doors, windows, and furniture in this room. Continue?"}
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                data-testid="cancel-rebuild-btn"
                onClick={() => setIsConfirmRebuildOpen(false)}
                className="h-8 text-xs"
              >
                {isZh ? "取消" : "Cancel"}
              </Button>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                data-testid="confirm-rebuild-btn"
                onClick={handleConfirmRebuild}
                className="h-8 text-xs font-medium"
              >
                {isZh ? "确认清空并重建" : "Confirm & Rebuild"}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
