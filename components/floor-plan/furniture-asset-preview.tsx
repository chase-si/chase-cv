"use client";

import * as React from "react";
import {
  AlertTriangle,
  Check,
  CheckCircle2,
  Compass,
  Copy,
  FileJson,
  Layers,
  RotateCcw,
  RotateCw,
} from "lucide-react";
import { ToolPageChrome } from "@/components/tool-page-chrome";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardScrollArea,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getFurnitureCatalog,
  STANDARD_FURNITURE_CATALOG,
} from "@/lib/floor-plan/furniture-catalog";
import type { Point } from "@/lib/floor-plan/geometry";
import { computeFurniturePolygon } from "@/lib/floor-plan/rules/geometry";
import {
  computePlacementClearanceZones,
  type DirectionalClearanceZone,
} from "@/lib/floor-plan/space-assessment";
import type {
  FurnitureCatalog,
  FurnitureDefinition,
  FurniturePlacement,
  FurnitureSide,
  FurnitureSpecification,
  ValidationError,
} from "@/lib/floor-plan/types";
import {
  prepareFurnitureDefinitionForRender,
  serializeFurnitureDefinitionFinalJson,
  validateFurnitureCatalog,
  validateFurnitureDefinition,
} from "@/lib/floor-plan/validators";
import { cn } from "@/lib/utils";

export {
  prepareFurnitureDefinitionForRender,
  serializeFurnitureDefinitionFinalJson,
  validateFurnitureCatalog,
  validateFurnitureDefinition,
};

export type CardinalRotation = 0 | 90 | 180 | 270;

export const CARDINAL_ROTATIONS: readonly CardinalRotation[] = [
  0, 90, 180, 270,
] as const;

const ALL_SIDES: readonly FurnitureSide[] = [
  "front",
  "back",
  "left",
  "right",
] as const;

export type ScreenDirection = "top" | "right" | "bottom" | "left";

export function resolveScreenDirection(normal: Point): ScreenDirection {
  if (normal.y < -0.5) return "top";
  if (normal.x > 0.5) return "right";
  if (normal.y > 0.5) return "bottom";
  return "left";
}

function formatScreenDirectionLabel(
  dir: ScreenDirection,
  isZh: boolean,
): string {
  switch (dir) {
    case "top":
      return isZh ? "上方 (-Y)" : "Top (-Y)";
    case "right":
      return isZh ? "右侧 (+X)" : "Right (+X)";
    case "bottom":
      return isZh ? "下方 (+Y)" : "Bottom (+Y)";
    case "left":
      return isZh ? "左侧 (-X)" : "Left (-X)";
  }
}

function formatSideTitle(side: FurnitureSide, isZh: boolean): string {
  switch (side) {
    case "front":
      return isZh ? "front (前侧/使用侧)" : "front (Front / Usage Side)";
    case "back":
      return isZh ? "back (后侧/靠墙侧)" : "back (Back / Wall Side)";
    case "left":
      return isZh ? "left (左侧)" : "left (Left Side)";
    case "right":
      return isZh ? "right (右侧)" : "right (Right Side)";
  }
}

function pointsToSvgPolygon(points: Point[]): string {
  return points.map((pt) => `${Math.round(pt.x)},${Math.round(pt.y)}`).join(" ");
}

export interface FurnitureAssetPreviewProps {
  initialCatalog?: FurnitureCatalog;
  initialDefinitionJson?: string;
  initialRotation?: CardinalRotation;
  locale?: string;
  headerExtra?: React.ReactNode;
}

export function FurnitureAssetPreview({
  initialCatalog,
  initialDefinitionJson,
  initialRotation = 0,
  locale = "zh",
  headerExtra,
}: FurnitureAssetPreviewProps) {
  const isZh = locale === "zh";

  const catalog = React.useMemo(
    () => initialCatalog ?? getFurnitureCatalog(STANDARD_FURNITURE_CATALOG),
    [initialCatalog],
  );

  const defaultDef = catalog.definitions[0];
  const [selectedPresetId, setSelectedPresetId] = React.useState<string>(
    defaultDef?.id ?? "",
  );
  const [definitionJsonText, setDefinitionJsonText] = React.useState<string>(
    () =>
      initialDefinitionJson ??
      (defaultDef ? serializeFurnitureDefinitionFinalJson(defaultDef) : ""),
  );
  const [selectedSpecId, setSelectedSpecId] = React.useState<string>(
    defaultDef?.specifications[0]?.id ?? "",
  );
  const [rotation, setRotation] =
    React.useState<CardinalRotation>(initialRotation);
  const [copiedStatus, setCopiedStatus] = React.useState<boolean>(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const renderResult = React.useMemo(
    () => prepareFurnitureDefinitionForRender(definitionJsonText),
    [definitionJsonText],
  );

  const activeDefinition: FurnitureDefinition | null = renderResult.ok
    ? renderResult.value
    : null;
  const validationErrors: ValidationError[] = !renderResult.ok
    ? renderResult.errors
    : [];

  const activeSpec: FurnitureSpecification | null = React.useMemo(() => {
    if (!activeDefinition || activeDefinition.specifications.length === 0) {
      return null;
    }
    return (
      activeDefinition.specifications.find((s) => s.id === selectedSpecId) ??
      activeDefinition.specifications[0]
    );
  }, [activeDefinition, selectedSpecId]);

  React.useEffect(() => {
    if (
      activeDefinition &&
      activeDefinition.specifications.length > 0 &&
      !activeDefinition.specifications.some((s) => s.id === selectedSpecId)
    ) {
      setSelectedSpecId(activeDefinition.specifications[0].id);
    }
  }, [activeDefinition, selectedSpecId]);

  const finalFormattedJson = React.useMemo(() => {
    if (!renderResult.ok) return "";
    return serializeFurnitureDefinitionFinalJson(renderResult.value);
  }, [renderResult]);

  const loadDefinitionJson = React.useCallback((nextJson: string) => {
    setDefinitionJsonText(nextJson);
    setCopiedStatus(false);
  }, []);

  const handleSelectPresetId = React.useCallback(
    (nextId: string | null) => {
      if (!nextId) return;
      setSelectedPresetId(nextId);
      const found = catalog.definitions.find((d) => d.id === nextId);
      if (found) {
        setSelectedSpecId(found.specifications[0]?.id ?? "");
        loadDefinitionJson(serializeFurnitureDefinitionFinalJson(found));
      }
    },
    [catalog.definitions, loadDefinitionJson],
  );

  const handleResetPreset = React.useCallback(() => {
    const found =
      catalog.definitions.find((d) => d.id === selectedPresetId) ??
      catalog.definitions[0];
    if (found) {
      setSelectedSpecId(found.specifications[0]?.id ?? "");
      loadDefinitionJson(serializeFurnitureDefinitionFinalJson(found));
    }
  }, [catalog.definitions, selectedPresetId, loadDefinitionJson]);

  const handleImportJsonFile = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          loadDefinitionJson(reader.result);
        }
      };
      reader.readAsText(file);
    },
    [loadDefinitionJson],
  );

  const handleCopyFinalJson = React.useCallback(async () => {
    if (!renderResult.ok || !finalFormattedJson) return;
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(finalFormattedJson);
    }
    setCopiedStatus(true);
  }, [renderResult, finalFormattedJson]);

  const handleRotateNext = React.useCallback(() => {
    setRotation((prev) => ((prev + 90) % 360) as CardinalRotation);
  }, []);

  // Compute footprint and directional clearance zones via shared space-assessment geometry
  const previewGeometry = React.useMemo(() => {
    if (!activeDefinition || !activeSpec) return null;

    const previewCatalog: FurnitureCatalog = {
      version: 2,
      unit: "mm",
      definitions: [activeDefinition],
    };

    const previewPlacement: FurniturePlacement = {
      id: "preview-placement",
      definitionId: activeDefinition.id,
      specificationId: activeSpec.id,
      x: 0,
      y: 0,
      rotation,
    };

    const clearanceZones = computePlacementClearanceZones(
      previewPlacement,
      previewCatalog,
    );

    const rawFootprint = computeFurniturePolygon({
      id: "preview-placement",
      definitionId: activeDefinition.id,
      x: 0,
      y: 0,
      width: activeSpec.width,
      depth: activeSpec.depth,
      rotation,
    }).map((pt) => ({
      x: Math.round(pt.x),
      y: Math.round(pt.y),
    }));

    const xs = rawFootprint.map((p) => p.x);
    const ys = rawFootprint.map((p) => p.y);
    const rotatedSpanX = Math.max(...xs) - Math.min(...xs);
    const rotatedSpanY = Math.max(...ys) - Math.min(...ys);

    const sideAnnotations = ALL_SIDES.map((side) => {
      const zone: DirectionalClearanceZone = clearanceZones[side];
      const screenDirection = resolveScreenDirection(zone.normal);
      const edgeMid: Point = {
        x: Math.round((zone.edgeSegment[0].x + zone.edgeSegment[1].x) / 2),
        y: Math.round((zone.edgeSegment[0].y + zone.edgeSegment[1].y) / 2),
      };
      const maxExtent = Math.max(zone.recommendedMm, zone.minimumMm, 0);
      const labelOffset = maxExtent + 240;
      const labelPos: Point = {
        x: Math.round(edgeMid.x + zone.normal.x * labelOffset),
        y: Math.round(edgeMid.y + zone.normal.y * labelOffset),
      };

      return {
        side,
        zone,
        screenDirection,
        edgeMid,
        labelPos,
      };
    });

    // Compute bounding box for SVG viewBox including labels and clearance zones
    const allPoints: Point[] = [...rawFootprint];
    for (const item of sideAnnotations) {
      allPoints.push(...item.zone.minimumZonePolygon);
      allPoints.push(...item.zone.recommendedZonePolygon);
      allPoints.push(item.labelPos);
    }

    const minX = Math.min(...allPoints.map((p) => p.x)) - 520;
    const maxX = Math.max(...allPoints.map((p) => p.x)) + 520;
    const minY = Math.min(...allPoints.map((p) => p.y)) - 360;
    const maxY = Math.max(...allPoints.map((p) => p.y)) + 360;

    return {
      footprint: rawFootprint,
      rotatedSpanX,
      rotatedSpanY,
      clearanceZones,
      sideAnnotations,
      viewBox: `${minX} ${minY} ${maxX - minX} ${maxY - minY}`,
    };
  }, [activeDefinition, activeSpec, rotation]);

  const activePresetOption = React.useMemo(
    () =>
      catalog.definitions.find((d) => d.id === selectedPresetId) ??
      catalog.definitions[0],
    [catalog.definitions, selectedPresetId],
  );

  return (
    <ToolPageChrome
      title={
        isZh
          ? "家具规格资产预览与净空实验室"
          : "Furniture Specification Asset Preview"
      }
      description={
        isZh
          ? "验证家具定义与预设规格契约，预览四向最小/建议净空区及 0°/90°/180°/270° 旋转方向语义，复制最终 JSON。"
          : "Validate furniture definition contracts, preview 4-way minimum/recommended clearance zones across 0°/90°/180°/270° rotations, and copy final JSON."
      }
      actions={
        <div className="flex flex-wrap items-center gap-2">
          {headerExtra}
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            data-testid="furniture-json-file-input"
            onChange={handleImportJsonFile}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            data-testid="import-furniture-json-btn"
            onClick={() => fileInputRef.current?.click()}
            className="gap-1.5 text-xs font-medium"
          >
            <FileJson className="h-3.5 w-3.5 text-primary" />
            <span>{isZh ? "导入 JSON" : "Import JSON"}</span>
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            data-testid="reset-furniture-preset-btn"
            onClick={handleResetPreset}
            className="gap-1.5 text-xs font-medium"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>{isZh ? "重置模板" : "Reset Template"}</span>
          </Button>
          <Button
            type="button"
            variant="default"
            size="sm"
            data-testid="copy-furniture-final-json-btn"
            disabled={!renderResult.ok}
            onClick={handleCopyFinalJson}
            className="gap-1.5 text-xs font-medium"
          >
            {copiedStatus ? (
              <Check className="h-3.5 w-3.5" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
            <span data-testid="copy-furniture-final-json-status">
              {copiedStatus
                ? isZh
                  ? "已复制最终 JSON"
                  : "Copied Final JSON"
                : isZh
                  ? "复制最终 JSON"
                  : "Copy Final JSON"}
            </span>
          </Button>
        </div>
      }
    >
      <div
        data-testid="furniture-asset-preview"
        className="grid min-h-0 flex-1 gap-3 lg:grid-cols-[25rem_minmax(0,1fr)] lg:items-stretch"
      >
        {/* Left Rail: Catalog Preset Selector, JSON Editor & Orientation Semantics Legend */}
        <Card className="flex min-h-0 flex-col overflow-hidden">
          <CardHeader className="shrink-0 border-b border-border/70 p-3 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <CardTitle className="text-sm font-semibold text-foreground">
                {isZh
                  ? "家具规格定义输入"
                  : "Furniture Definition JSON Input"}
              </CardTitle>
              <Badge
                variant="outline"
                data-testid="furniture-validation-status"
                className={
                  renderResult.ok
                    ? "gap-1 text-[11px] font-mono border-emerald-500/40 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10"
                    : "gap-1 text-[11px] font-mono border-destructive/40 text-destructive bg-destructive/10"
                }
              >
                {renderResult.ok ? (
                  <>
                    <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                    <span>{isZh ? "验证通过 (Valid)" : "Valid Asset"}</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="h-3 w-3" />
                    <span>
                      {isZh
                        ? `验证失败 (${renderResult.errors.length})`
                        : `Invalid (${renderResult.errors.length})`}
                    </span>
                  </>
                )}
              </Badge>
            </div>

            <div className="space-y-1">
              <Label className="block text-[11px] font-medium text-muted-foreground">
                {isZh
                  ? "从标准家具目录加载起始定义"
                  : "Load Furniture Definition from Standard Catalog"}
              </Label>
              <Select
                value={selectedPresetId}
                onValueChange={handleSelectPresetId}
              >
                <SelectTrigger
                  size="sm"
                  data-testid="furniture-preset-select"
                  className="w-full rounded-md border-border bg-background text-xs"
                >
                  <SelectValue>
                    {activePresetOption
                      ? `${activePresetOption.name} (${activePresetOption.id})`
                      : selectedPresetId}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {catalog.definitions.map((item) => (
                    <SelectItem
                      key={item.id}
                      value={item.id}
                      data-testid={`furniture-preset-option-${item.id}`}
                      className="text-xs"
                    >
                      {item.name} ({item.id})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>

          <CardScrollArea className="min-h-0 flex-1 p-3 space-y-4">
            {/* FurnitureDefinition JSON Editor */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="furniture-json-editor"
                  className="text-xs font-medium text-foreground"
                >
                  {isZh
                    ? "家具定义 JSON 编辑器 (FurnitureDefinition v2)"
                    : "Furniture Definition JSON Editor (FurnitureDefinition v2)"}
                </Label>
                <span className="text-[10px] font-mono text-muted-foreground">
                  unit: &quot;mm&quot;
                </span>
              </div>
              <textarea
                id="furniture-json-editor"
                data-testid="furniture-json-editor"
                value={definitionJsonText}
                onChange={(e) => loadDefinitionJson(e.target.value)}
                rows={12}
                spellCheck={false}
                className="w-full rounded-lg border border-border bg-background p-2.5 font-mono text-xs leading-relaxed text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                placeholder={
                  isZh
                    ? "在此粘贴或编辑 FurnitureDefinition JSON..."
                    : "Paste or edit FurnitureDefinition JSON here..."
                }
              />
            </div>

            {/* Orientation & Clearance Semantic Legend (AC-20) */}
            <div
              data-testid="furniture-orientation-semantic-legend"
              className="rounded-xl border border-border bg-muted/30 p-3 space-y-2.5"
            >
              <div className="flex items-center gap-1.5">
                <Compass className="h-4 w-4 text-primary shrink-0" />
                <h2 className="text-xs font-semibold text-foreground">
                  {isZh
                    ? "四向方向语义与净空约定 (Orientation & Clearance Semantics)"
                    : "Orientation & Clearance Semantics (四向方向语义与净空约定)"}
                </h2>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="rounded-lg border border-border/70 bg-card p-2">
                  <span className="font-mono font-semibold text-primary">
                    back（后侧 / 靠墙侧）
                  </span>
                  <p className="mt-0.5 text-[11px] text-muted-foreground leading-snug">
                    {isZh
                      ? "床头、沙发靠背、衣柜背板等贴墙侧（0° 时朝上 -Y）。"
                      : "Headboard, sofa backrest, or wardrobe back panel placed against walls (faces Top -Y at 0°)."}
                  </p>
                </div>

                <div className="rounded-lg border border-border/70 bg-card p-2">
                  <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                    front（前侧 / 使用侧）
                  </span>
                  <p className="mt-0.5 text-[11px] text-muted-foreground leading-snug">
                    {isZh
                      ? "主要使用/靠近侧，如床尾上床/通行、沙发前茶几区、柜门开启侧（0° 时朝下 +Y）。"
                      : "Primary approach and usage side, such as bed foot, sofa front, or cabinet door swing (faces Bottom +Y at 0°)."}
                  </p>
                </div>

                <div className="rounded-lg border border-border/70 bg-card p-2">
                  <span className="font-mono font-semibold text-amber-600 dark:text-amber-400">
                    left / right（左右侧）
                  </span>
                  <p className="mt-0.5 text-[11px] text-muted-foreground leading-snug">
                    {isZh
                      ? "面向家具正面（front）观察时的左右侧（0° 时 left 朝左 -X、right 朝右 +X），随 0°/90°/180°/270° 同步旋转。"
                      : "Left and right sides when facing the furniture front (-X and +X at 0°), rotating synchronously across 0°/90°/180°/270°."}
                  </p>
                </div>
              </div>
            </div>
          </CardScrollArea>
        </Card>

        {/* Right Main Pane: Specification Switcher, 4-Way Rotation Controls & SVG Preview */}
        <Card className="flex min-h-0 flex-col overflow-hidden">
          <CardHeader className="shrink-0 border-b border-border/70 p-3 space-y-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="min-w-0">
                <CardTitle className="truncate text-sm font-semibold text-foreground">
                  {activeDefinition && activeSpec
                    ? `${activeDefinition.name} (${activeDefinition.id}) — ${activeSpec.name}`
                    : isZh
                      ? "预览已拦截：家具定义未通过契约验证"
                      : "Preview Blocked: Furniture Definition Failed Validation"}
                </CardTitle>
              </div>

              {activeDefinition && activeSpec && (
                <div className="flex flex-wrap items-center gap-1.5">
                  <Badge variant="secondary" className="font-mono text-[10px]">
                    {activeDefinition.category}
                  </Badge>
                  <Badge
                    variant="outline"
                    data-testid="active-spec-dimensions-badge"
                    className="font-mono text-[10px]"
                  >
                    {activeSpec.width} × {activeSpec.depth}
                    {activeSpec.height ? ` × ${activeSpec.height}` : ""} mm
                  </Badge>
                  <Badge
                    variant="outline"
                    data-testid="active-rotation-badge"
                    className="font-mono text-[10px]"
                  >
                    {rotation}°
                  </Badge>
                </div>
              )}
            </div>

            {activeDefinition && activeSpec && (
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                {/* Specification Switcher */}
                <div
                  data-testid="furniture-spec-switcher"
                  className="flex flex-wrap items-center gap-1.5"
                >
                  <span className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
                    <Layers className="h-3.5 w-3.5 text-primary" />
                    {isZh ? "预设规格:" : "Specifications:"}
                  </span>
                  {activeDefinition.specifications.map((spec) => {
                    const isActive = spec.id === activeSpec.id;
                    return (
                      <Button
                        key={spec.id}
                        type="button"
                        size="xs"
                        variant={isActive ? "default" : "outline"}
                        data-testid={`furniture-spec-btn-${spec.id}`}
                        onClick={() => setSelectedSpecId(spec.id)}
                        className="font-mono text-[11px]"
                      >
                        {spec.name} ({spec.id})
                      </Button>
                    );
                  })}
                </div>

                {/* 4-Way Rotation Controls (0° / 90° / 180° / 270°) */}
                <div
                  data-testid="furniture-rotation-controls"
                  className="flex items-center gap-1"
                >
                  <span className="mr-1 text-xs font-medium text-muted-foreground">
                    {isZh ? "旋转朝向:" : "Rotation:"}
                  </span>
                  {CARDINAL_ROTATIONS.map((deg) => (
                    <Button
                      key={deg}
                      type="button"
                      size="xs"
                      variant={rotation === deg ? "default" : "outline"}
                      data-testid={`furniture-rotation-${deg}`}
                      onClick={() => setRotation(deg)}
                      className="font-mono text-[11px]"
                    >
                      {deg}°
                    </Button>
                  ))}
                  <Button
                    type="button"
                    size="xs"
                    variant="outline"
                    data-testid="furniture-rotate-next-btn"
                    onClick={handleRotateNext}
                    className="gap-1 text-[11px]"
                  >
                    <RotateCw className="h-3 w-3" />
                    <span>+90°</span>
                  </Button>
                </div>
              </div>
            )}
          </CardHeader>

          <CardContent className="flex min-h-0 flex-1 flex-col p-0">
            {renderResult.ok && activeDefinition && activeSpec && previewGeometry ? (
              <div className="flex min-h-0 flex-1 flex-col">
                {/* Main SVG Preview Canvas */}
                <div className="relative flex min-h-[20rem] flex-1 items-center justify-center overflow-hidden bg-muted/15 p-3">
                  <svg
                    data-testid="furniture-asset-svg-preview"
                    viewBox={previewGeometry.viewBox}
                    className="h-full max-h-[26rem] w-full select-none"
                    role="img"
                    aria-label={`${activeDefinition.name} ${activeSpec.name} ${rotation}deg preview`}
                  >
                    {/* Coordinate axes reference */}
                    <line
                      x1={-4000}
                      y1={0}
                      x2={4000}
                      y2={0}
                      className="stroke-border/60"
                      strokeWidth={6}
                      strokeDasharray="24 24"
                    />
                    <line
                      x1={0}
                      y1={-4000}
                      x2={0}
                      y2={4000}
                      className="stroke-border/60"
                      strokeWidth={6}
                      strokeDasharray="24 24"
                    />

                    {/* 1. Recommended & Minimum Clearance Zones for front/back/left/right */}
                    {previewGeometry.sideAnnotations.map(
                      ({ side, zone, screenDirection, edgeMid, labelPos }) => {
                        const isFront = side === "front";
                        const isBack = side === "back";

                        return (
                          <g
                            key={side}
                            data-testid={`clearance-side-group-${side}`}
                            data-side={side}
                            data-screen-direction={screenDirection}
                            data-normal-x={zone.normal.x}
                            data-normal-y={zone.normal.y}
                            data-minimum-mm={zone.minimumMm}
                            data-recommended-mm={zone.recommendedMm}
                          >
                            {zone.recommendedZonePolygon.length > 0 && (
                              <polygon
                                data-testid={`clearance-recommended-zone-${side}`}
                                points={pointsToSvgPolygon(
                                  zone.recommendedZonePolygon,
                                )}
                                className={cn(
                                  "transition-all",
                                  isFront
                                    ? "fill-emerald-500/15 stroke-emerald-500/70"
                                    : "fill-amber-500/15 stroke-amber-500/70",
                                )}
                                strokeWidth={12}
                                strokeDasharray="36 20"
                              />
                            )}

                            {zone.minimumZonePolygon.length > 0 && (
                              <polygon
                                data-testid={`clearance-minimum-zone-${side}`}
                                points={pointsToSvgPolygon(
                                  zone.minimumZonePolygon,
                                )}
                                className={cn(
                                  "transition-all",
                                  isFront
                                    ? "fill-emerald-500/30 stroke-emerald-600"
                                    : "fill-rose-500/25 stroke-rose-600",
                                )}
                                strokeWidth={14}
                              />
                            )}

                            {/* Highlighted edge segment for the side */}
                            <line
                              x1={zone.edgeSegment[0].x}
                              y1={zone.edgeSegment[0].y}
                              x2={zone.edgeSegment[1].x}
                              y2={zone.edgeSegment[1].y}
                              className={cn(
                                isBack
                                  ? "stroke-primary"
                                  : isFront
                                    ? "stroke-emerald-600"
                                    : "stroke-amber-600",
                              )}
                              strokeWidth={isBack ? 32 : 18}
                            />

                            {/* Connector line from edge midpoint to side label */}
                            <line
                              x1={edgeMid.x}
                              y1={edgeMid.y}
                              x2={labelPos.x}
                              y2={labelPos.y}
                              className="stroke-muted-foreground/60"
                              strokeWidth={8}
                              strokeDasharray="16 12"
                            />

                            {/* Directional Side Label Badge */}
                            <g
                              data-testid={`clearance-side-label-${side}`}
                              data-side={side}
                              data-screen-direction={screenDirection}
                              data-label-x={labelPos.x}
                              data-label-y={labelPos.y}
                              transform={`translate(${labelPos.x}, ${labelPos.y})`}
                            >
                              <rect
                                x={-380}
                                y={-110}
                                width={760}
                                height={220}
                                rx={36}
                                className="fill-card stroke-border"
                                strokeWidth={12}
                              />
                              <text
                                x={0}
                                y={-18}
                                textAnchor="middle"
                                className="fill-foreground font-mono font-bold"
                                fontSize={68}
                              >
                                {formatSideTitle(side, isZh)}
                              </text>
                              <text
                                x={0}
                                y={64}
                                textAnchor="middle"
                                className="fill-muted-foreground font-mono"
                                fontSize={54}
                              >
                                {`min ${zone.minimumMm} / rec ${zone.recommendedMm} mm · ${formatScreenDirectionLabel(screenDirection, isZh)}`}
                              </text>
                            </g>
                          </g>
                        );
                      },
                    )}

                    {/* 2. Solid Furniture Footprint Polygon */}
                    <polygon
                      data-testid="furniture-footprint-polygon"
                      data-width={activeSpec.width}
                      data-depth={activeSpec.depth}
                      data-rotation={rotation}
                      data-rotated-span-x={previewGeometry.rotatedSpanX}
                      data-rotated-span-y={previewGeometry.rotatedSpanY}
                      points={pointsToSvgPolygon(previewGeometry.footprint)}
                      className="fill-primary/20 stroke-primary"
                      strokeWidth={22}
                    />

                    {/* Center footprint label */}
                    <text
                      x={0}
                      y={-25}
                      textAnchor="middle"
                      className="fill-foreground font-mono font-bold"
                      fontSize={80}
                    >
                      {activeDefinition.name}
                    </text>
                    <text
                      x={0}
                      y={75}
                      textAnchor="middle"
                      className="fill-muted-foreground font-mono"
                      fontSize={62}
                    >
                      {`${activeSpec.width} × ${activeSpec.depth} mm (${rotation}°)`}
                    </text>
                  </svg>
                </div>

                {/* Bottom Clearance & Orientation Summary Table + Final JSON Output */}
                <div className="shrink-0 border-t border-border/70 bg-muted/20 p-3 space-y-2.5">
                  <div
                    data-testid="clearance-summary-grid"
                    className="grid grid-cols-2 gap-2 sm:grid-cols-4"
                  >
                    {previewGeometry.sideAnnotations.map(
                      ({ side, zone, screenDirection }) => (
                        <div
                          key={side}
                          data-testid={`clearance-card-${side}`}
                          data-screen-direction={screenDirection}
                          className="rounded-lg border border-border/80 bg-card p-2 text-xs"
                        >
                          <div className="flex items-center justify-between gap-1">
                            <span className="font-mono font-semibold text-foreground">
                              {side}
                            </span>
                            <Badge
                              variant="outline"
                              className="font-mono text-[10px]"
                            >
                              {formatScreenDirectionLabel(
                                screenDirection,
                                isZh,
                              )}
                            </Badge>
                          </div>
                          <div className="mt-1 font-mono text-[11px] text-muted-foreground">
                            min:{" "}
                            <span className="font-semibold text-foreground">
                              {zone.minimumMm}mm
                            </span>{" "}
                            / rec:{" "}
                            <span className="font-semibold text-foreground">
                              {zone.recommendedMm}mm
                            </span>
                          </div>
                        </div>
                      ),
                    )}
                  </div>

                  <details className="group">
                    <summary className="cursor-pointer text-xs font-medium text-muted-foreground hover:text-foreground">
                      {isZh
                        ? "查看标准化最终 JSON 输出 (FurnitureDefinition)"
                        : "View Normalized Final JSON Output (FurnitureDefinition)"}
                    </summary>
                    <CardScrollArea className="mt-2 max-h-36 rounded-lg border border-border bg-background p-2">
                      <pre
                        data-testid="furniture-final-json-output"
                        className="font-mono text-[11px] text-foreground"
                      >
                        {finalFormattedJson}
                      </pre>
                    </CardScrollArea>
                  </details>
                </div>
              </div>
            ) : (
              <CardScrollArea className="min-h-0 flex-1 p-4">
                <div
                  data-testid="furniture-validation-errors"
                  className="space-y-3 rounded-xl border border-destructive/40 bg-destructive/10 p-4"
                >
                  <div className="flex items-center gap-2 text-destructive">
                    <AlertTriangle className="h-4 w-4 shrink-0" />
                    <h3 className="text-sm font-semibold">
                      {isZh
                        ? `发现 ${validationErrors.length} 项家具规格契约错误（已拦截渲染）`
                        : `Found ${validationErrors.length} furniture contract validation error(s) — preview blocked`}
                    </h3>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {isZh
                      ? "家具预览与正式家具目录共享同一契约验证器（validateFurnitureDefinition / validateFurnitureCatalog）。请修正以下字段路径与定义/规格 ID："
                      : "The furniture asset preview shares the exact same contract validator as the standard furniture catalog. Fix the following paths and IDs:"}
                  </p>
                  <ul className="space-y-2">
                    {validationErrors.map(
                      (err: ValidationError, idx: number) => (
                        <li
                          key={`${err.path}-${idx}`}
                          data-testid={`furniture-validation-error-item-${idx}`}
                          className="rounded-lg border border-destructive/30 bg-background p-2.5 font-mono text-xs"
                        >
                          <span className="inline-block rounded bg-destructive/15 px-1.5 py-0.5 font-semibold text-destructive">
                            {err.path || "$"}
                          </span>
                          <span className="ml-2 text-foreground">
                            {err.message}
                          </span>
                        </li>
                      ),
                    )}
                  </ul>
                </div>
              </CardScrollArea>
            )}
          </CardContent>
        </Card>
      </div>
    </ToolPageChrome>
  );
}
