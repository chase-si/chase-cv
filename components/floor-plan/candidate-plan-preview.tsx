"use client";

import * as React from "react";
import {
  AlertTriangle,
  Check,
  CheckCircle2,
  ClipboardCheck,
  Copy,
  FileJson,
  RotateCcw,
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
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getStandardPlans,
  type StandardPlanSummary,
} from "@/lib/floor-plan/catalog";
import { computePlanTotalArea } from "@/lib/floor-plan/geometry";
import type { ValidationError } from "@/lib/floor-plan/types";
import {
  prepareCandidatePlanForRender,
  serializeCandidatePlanFinalJson,
} from "@/lib/floor-plan/validators";
import { FloorPlanSvgViewer } from "./floor-plan-svg-viewer";
import type { SelectedEntity } from "./types";

export { prepareCandidatePlanForRender, serializeCandidatePlanFinalJson };

export interface CandidatePlanPreviewProps {
  initialPlans?: StandardPlanSummary[];
  initialCandidateJson?: string;
  locale?: string;
  headerExtra?: React.ReactNode;
}

interface SemanticChecklistItem {
  id: string;
  testId: string;
  titleZh: string;
  titleEn: string;
  descZh: string;
  descEn: string;
}

const HUMAN_SEMANTIC_CHECKLIST_ITEMS: SemanticChecklistItem[] = [
  {
    id: "window-interior-wall",
    testId: "semantic-check-item-1",
    titleZh: "1. 门窗朝向与内墙检查 / Window & Interior Wall Check",
    titleEn: "1. Window & Interior Wall Check / 门窗朝向与内墙检查",
    descZh: "确认窗户位于外墙或合理采光面，未误开在室内分隔墙上。",
    descEn:
      "Confirm windows are placed on exterior walls or valid daylighting facades, not mistakenly cut into interior partition walls.",
  },
  {
    id: "room-relationship",
    testId: "semantic-check-item-2",
    titleZh: "2. 房间功能关系检查 / Room Relationship Check",
    titleEn: "2. Room Relationship Check / 房间功能关系检查",
    descZh: "确认卧室、卫生间、厨房、客餐厅的相邻与入户关系符合居住常识。",
    descEn:
      "Confirm adjacency and entry relationships among bedrooms, bathrooms, kitchen, and living/dining areas match residential common sense.",
  },
  {
    id: "living-circulation",
    testId: "semantic-check-item-3",
    titleZh: "3. 基本生活动线检查 / Living Circulation Check",
    titleEn: "3. Living Circulation Check / 基本生活动线检查",
    descZh: "确认从入户门到各房间存在合理可通行门洞，无死角房间。",
    descEn:
      "Confirm passable door openings exist from the entry door to every room, with no unreachable dead-end rooms.",
  },
];

export function CandidatePlanPreview({
  initialPlans,
  initialCandidateJson,
  locale = "zh",
  headerExtra,
}: CandidatePlanPreviewProps) {
  const isZh = locale === "zh";
  const plans = React.useMemo(
    () => initialPlans ?? getStandardPlans(locale),
    [initialPlans, locale],
  );

  const defaultPlan = plans[0]?.plan;
  const [selectedPresetId, setSelectedPresetId] = React.useState<string>(
    plans[0]?.id ?? "",
  );
  const [candidateJsonText, setCandidateJsonText] = React.useState<string>(
    () =>
      initialCandidateJson ??
      (defaultPlan ? JSON.stringify(defaultPlan, null, 2) : ""),
  );
  const [selectedEntity, setSelectedEntity] =
    React.useState<SelectedEntity | null>(null);
  const [checkedItems, setCheckedItems] = React.useState<
    Record<string, boolean>
  >({});
  const [copiedStatus, setCopiedStatus] = React.useState<boolean>(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const renderResult = React.useMemo(
    () => prepareCandidatePlanForRender(candidateJsonText),
    [candidateJsonText],
  );

  const finalFormattedJson = React.useMemo(() => {
    if (!renderResult.ok) return "";
    return serializeCandidatePlanFinalJson(renderResult.value);
  }, [renderResult]);

  const areaSummary = React.useMemo(() => {
    if (!renderResult.ok) return null;
    return computePlanTotalArea(renderResult.value);
  }, [renderResult]);

  const loadCandidateJson = React.useCallback((nextJson: string) => {
    setCandidateJsonText(nextJson);
    setSelectedEntity(null);
    setCopiedStatus(false);
  }, []);

  const handleSelectPresetId = React.useCallback(
    (nextId: string | null) => {
      if (!nextId) return;
      setSelectedPresetId(nextId);
      const found = plans.find((p) => p.id === nextId);
      if (found) {
        loadCandidateJson(JSON.stringify(found.plan, null, 2));
      }
    },
    [plans, loadCandidateJson],
  );

  const handleResetPreset = React.useCallback(() => {
    const found =
      plans.find((p) => p.id === selectedPresetId) ?? plans[0];
    if (found) {
      loadCandidateJson(JSON.stringify(found.plan, null, 2));
    }
  }, [plans, selectedPresetId, loadCandidateJson]);

  const handleImportJsonFile = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          loadCandidateJson(reader.result);
        }
      };
      reader.readAsText(file);
    },
    [loadCandidateJson],
  );

  const handleCopyFinalJson = React.useCallback(async () => {
    if (!renderResult.ok || !finalFormattedJson) return;
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(finalFormattedJson);
    }
    setCopiedStatus(true);
  }, [renderResult, finalFormattedJson]);

  const handleToggleChecklistItem = React.useCallback((id: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  }, []);

  const activePresetOption = React.useMemo(
    () => plans.find((p) => p.id === selectedPresetId) ?? plans[0],
    [plans, selectedPresetId],
  );

  return (
    <ToolPageChrome
      title={
        isZh
          ? "候选户型资产预览与验证实验室"
          : "Candidate Floor Plan Asset Preview"
      }
      description={
        isZh
          ? "粘贴或导入候选户型 JSON，执行基础几何与边界闭合验证，渲染有效拓扑并进行人工空间语义复核。"
          : "Paste or import candidate floor plan JSON, run deterministic topology validation, preview valid geometry, and complete human semantic review."
      }
      actions={
        <div className="flex flex-wrap items-center gap-2">
          {headerExtra}
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            data-testid="candidate-json-file-input"
            onChange={handleImportJsonFile}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            data-testid="import-candidate-json-btn"
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
            data-testid="reset-preset-btn"
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
            data-testid="copy-final-json-btn"
            disabled={!renderResult.ok}
            onClick={handleCopyFinalJson}
            className="gap-1.5 text-xs font-medium"
          >
            {copiedStatus ? (
              <Check className="h-3.5 w-3.5" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
            <span data-testid="copy-final-json-status">
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
        data-testid="candidate-plan-preview"
        className="grid min-h-0 flex-1 gap-3 lg:grid-cols-[25rem_minmax(0,1fr)] lg:items-stretch"
      >
        {/* Left Rail: Template Selector, Candidate JSON Editor & Human Semantic Checklist */}
        <Card className="flex min-h-0 flex-col overflow-hidden">
          <CardHeader className="shrink-0 border-b border-border/70 p-3 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <CardTitle className="text-sm font-semibold text-foreground">
                {isZh ? "候选户型数据输入" : "Candidate Plan JSON Input"}
              </CardTitle>
              <Badge
                variant="outline"
                data-testid="candidate-validation-status"
                className={
                  renderResult.ok
                    ? "gap-1 text-[11px] font-mono border-emerald-500/40 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10"
                    : "gap-1 text-[11px] font-mono border-destructive/40 text-destructive bg-destructive/10"
                }
              >
                {renderResult.ok ? (
                  <>
                    <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                    <span>{isZh ? "验证通过 (Valid)" : "Valid Topology"}</span>
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
                  ? "从正式标准户型加载起始模板"
                  : "Load Starting Template from Standard Catalog"}
              </Label>
              <Select
                value={selectedPresetId}
                onValueChange={handleSelectPresetId}
              >
                <SelectTrigger
                  size="sm"
                  data-testid="candidate-preset-select"
                  className="w-full rounded-md border-border bg-background text-xs"
                >
                  <SelectValue>
                    {activePresetOption
                      ? `${activePresetOption.name} (${activePresetOption.id})`
                      : selectedPresetId}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {plans.map((item) => (
                    <SelectItem
                      key={item.id}
                      value={item.id}
                      data-testid={`candidate-preset-option-${item.id}`}
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
            {/* Candidate JSON Textarea Editor */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="candidate-json-editor"
                  className="text-xs font-medium text-foreground"
                >
                  {isZh
                    ? "候选户型 JSON 编辑器 (StandardFloorPlan v1)"
                    : "Candidate Plan JSON Editor (StandardFloorPlan v1)"}
                </Label>
                <span className="text-[10px] font-mono text-muted-foreground">
                  unit: &quot;mm&quot;
                </span>
              </div>
              <textarea
                id="candidate-json-editor"
                data-testid="candidate-json-editor"
                value={candidateJsonText}
                onChange={(e) => loadCandidateJson(e.target.value)}
                rows={12}
                spellCheck={false}
                className="w-full rounded-lg border border-border bg-background p-2.5 font-mono text-xs leading-relaxed text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                placeholder={
                  isZh
                    ? "在此粘贴或编辑候选户型 JSON..."
                    : "Paste or edit candidate floor plan JSON here..."
                }
              />
            </div>

            {/* Human Semantic Review Checklist (AC-18) */}
            <div
              data-testid="human-semantic-checklist"
              className="rounded-xl border border-border bg-muted/30 p-3 space-y-2.5"
            >
              <div className="flex items-center gap-1.5">
                <ClipboardCheck className="h-4 w-4 text-primary shrink-0" />
                <h2 className="text-xs font-semibold text-foreground">
                  {isZh
                    ? "人工空间语义复核清单 (Human Semantic Review Checklist)"
                    : "Human Semantic Review Checklist (人工空间语义复核清单)"}
                </h2>
              </div>

              <div className="space-y-2">
                {HUMAN_SEMANTIC_CHECKLIST_ITEMS.map((item) => {
                  const checked = Boolean(checkedItems[item.id]);
                  return (
                    <div
                      key={item.id}
                      className="flex items-start gap-2 rounded-lg border border-border/70 bg-card p-2 text-xs"
                    >
                      <Checkbox
                        data-testid={item.testId}
                        checked={checked}
                        onCheckedChange={() =>
                          handleToggleChecklistItem(item.id)
                        }
                        className="mt-0.5 rounded"
                      />
                      <div className="space-y-0.5">
                        <span className="block font-medium text-foreground">
                          {isZh ? item.titleZh : item.titleEn}
                        </span>
                        <span className="block text-[11px] text-muted-foreground leading-snug">
                          {isZh ? item.descZh : item.descEn}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <p
                data-testid="human-semantic-disclaimer"
                className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-2 text-[11px] leading-relaxed text-foreground"
              >
                {isZh
                  ? "系统仅验证基础几何与拓扑闭合，不自动批准、拒绝或修复上述空间语义问题，由维护者根据渲染结果人工复核。"
                  : "The system only validates basic geometry and topological closure. It never automatically approves, rejects, or repairs the spatial semantic items above; maintainers must review them manually against the rendered preview."}
              </p>
            </div>
          </CardScrollArea>
        </Card>

        {/* Right Main Pane: Strict Render Guard Preview or Structured Validation Errors */}
        <Card className="flex min-h-0 flex-col overflow-hidden">
          <CardHeader className="shrink-0 border-b border-border/70 p-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="min-w-0">
                <CardTitle className="truncate text-sm font-semibold text-foreground">
                  {renderResult.ok
                    ? `${renderResult.value.meta.name} (${renderResult.value.meta.id})`
                    : isZh
                      ? "渲染已拦截：候选户型未通过基础几何与拓扑验证"
                      : "Render Blocked: Candidate Plan Failed Basic Topology Validation"}
                </CardTitle>
              </div>
              {renderResult.ok && areaSummary && (
                <div className="flex items-center gap-1.5">
                  <Badge variant="secondary" className="font-mono text-[10px]">
                    {areaSummary.formattedAreaM2}
                  </Badge>
                  <Badge variant="outline" className="font-mono text-[10px]">
                    {renderResult.value.rooms.length} {isZh ? "房间" : "Rooms"}
                  </Badge>
                  <Badge variant="outline" className="font-mono text-[10px]">
                    {renderResult.value.walls.length} {isZh ? "墙体" : "Walls"}
                  </Badge>
                  <Badge variant="outline" className="font-mono text-[10px]">
                    {renderResult.value.openings.length}{" "}
                    {isZh ? "门窗" : "Openings"}
                  </Badge>
                </div>
              )}
            </div>
          </CardHeader>

          <CardContent className="flex min-h-0 flex-1 flex-col p-0">
            {renderResult.ok ? (
              <div className="flex min-h-0 flex-1 flex-col">
                <div
                  data-testid="candidate-plan-svg-preview"
                  className="relative min-h-[24rem] flex-1 overflow-hidden"
                >
                  <FloorPlanSvgViewer
                    locale={locale}
                    plan={renderResult.value}
                    selectedEntity={selectedEntity}
                    onSelect={setSelectedEntity}
                    canvasMode="pan"
                    className="h-full w-full"
                  />
                </div>
                <div className="shrink-0 border-t border-border/70 bg-muted/20 p-2.5">
                  <details className="group">
                    <summary className="cursor-pointer text-xs font-medium text-muted-foreground hover:text-foreground">
                      {isZh
                        ? "查看标准化最终 JSON 输出 (StandardFloorPlan)"
                        : "View Normalized Final JSON Output (StandardFloorPlan)"}
                    </summary>
                    <pre
                      data-testid="final-json-output"
                      className="mt-2 max-h-40 overflow-auto rounded-lg border border-border bg-background p-2 font-mono text-[11px] text-foreground"
                    >
                      {finalFormattedJson}
                    </pre>
                  </details>
                </div>
              </div>
            ) : (
              <CardScrollArea className="min-h-0 flex-1 p-4">
                <div
                  data-testid="candidate-validation-errors"
                  className="space-y-3 rounded-xl border border-destructive/40 bg-destructive/10 p-4"
                >
                  <div className="flex items-center gap-2 text-destructive">
                    <AlertTriangle className="h-4 w-4 shrink-0" />
                    <h3 className="text-sm font-semibold">
                      {isZh
                        ? `发现 ${renderResult.errors.length} 项基础结构或拓扑闭合错误（已禁止渲染与自动重排）`
                        : `Found ${renderResult.errors.length} basic validation error(s) — rendering & auto-reordering blocked`}
                    </h3>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {isZh
                      ? "渲染 Adapter 仅接受通过基础验证的候选户型，不会自动重排房间边界或暗中修复未闭合拓扑。请根据以下字段路径和对象 ID 修正输入 JSON："
                      : "The rendering adapter strictly requires valid topology and never reorders broken room boundaries or silently repairs invalid input."}
                  </p>
                  <ul className="space-y-2">
                    {renderResult.errors.map(
                      (err: ValidationError, idx: number) => (
                        <li
                          key={`${err.path}-${idx}`}
                          data-testid={`validation-error-item-${idx}`}
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
