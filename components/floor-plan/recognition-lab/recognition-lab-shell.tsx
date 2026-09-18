"use client";

import * as React from "react";
import Link from "next/link";
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock,
  Download,
  Edit3,
  ExternalLink,
  FileCheck,
  FileText,
  Home,
  ImageIcon,
  Layers,
  Play,
  RotateCcw,
  Ruler,
  Sparkles,
  UploadCloud,
} from "lucide-react";
import { ToolPageChrome } from "@/components/tool-page-chrome";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardScrollArea,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FloorPlanShell } from "../floor-plan-shell";
import {
  calculateScaleFromTwoPoints,
  createUnscaledCalibration,
} from "@/lib/floor-plan/recognition/calibration";
import {
  CUBICASA_REPRESENTATIVE_SAMPLES,
  createCubiCasaAdapter,
  CubiCasaServiceUnavailableError,
  type RepresentativeSample,
} from "@/lib/floor-plan/recognition/cubicasa-adapter";
import {
  computeFixCounts,
  createEvaluationRecord,
  downloadEvaluationRecordJson,
} from "@/lib/floor-plan/recognition/evaluation-metrics";
import { normalizeCubiCasaToFloorPlan } from "@/lib/floor-plan/recognition/normalizer";
import type {
  ApprovalStatus,
  CalibrationResult,
  EvaluationRecord,
  RawCubiCasaSemanticOutput,
  RawPoint,
} from "@/lib/floor-plan/recognition/types";
import type { FloorPlan } from "@/lib/floor-plan/types";
import { downloadFloorPlanJson } from "@/lib/floor-plan/user-plan";
import { cn } from "@/lib/utils";

interface RecognitionLabShellProps {
  locale?: string;
  initialSampleId?: string;
  adapterType?: "mock" | "http";
  endpoint?: string;
}

export function RecognitionLabShell({
  locale,
  initialSampleId = "sample-1br",
  adapterType = "mock",
  endpoint,
}: RecognitionLabShellProps) {
  const isZh = locale
    ? locale.toLowerCase().startsWith("zh")
    : typeof window !== "undefined" && window.location.pathname.startsWith("/en")
      ? false
      : true;

  // Adapter
  const adapter = React.useMemo(
    () => createCubiCasaAdapter({ type: adapterType, endpoint }),
    [adapterType, endpoint],
  );

  // Active view: "lab" (recognition, calibration, preview) vs "editor" (manual correction)
  const [viewMode, setViewMode] = React.useState<"lab" | "editor">("lab");

  // Selection & Upload State
  const [selectedSampleId, setSelectedSampleId] = React.useState<string>(initialSampleId);
  const [uploadedFile, setUploadedFile] = React.useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = React.useState<string | null>(null);

  // Calibration State
  const [skipCalibration, setSkipCalibration] = React.useState<boolean>(false);
  const [point1, setPoint1] = React.useState<RawPoint>({ x: 50, y: 50 });
  const [point2, setPoint2] = React.useState<RawPoint>({ x: 750, y: 50 }); // 700px
  const [knownLengthMm, setKnownLengthMm] = React.useState<number>(7000);
  const [calibrationResult, setCalibrationResult] = React.useState<CalibrationResult | null>(null);

  // Inference & Normalization State
  const [isInferring, setIsInferring] = React.useState<boolean>(false);
  const [inferenceError, setInferenceError] = React.useState<string | null>(null);
  const [rawSemanticOutput, setRawSemanticOutput] = React.useState<RawCubiCasaSemanticOutput | null>(null);
  const [initialNormalizedPlan, setInitialNormalizedPlan] = React.useState<FloorPlan | null>(null);
  const [currentPlan, setCurrentPlan] = React.useState<FloorPlan | null>(null);

  // Evaluation & Metrics State
  const [evaluationRecord, setEvaluationRecord] = React.useState<EvaluationRecord | null>(null);
  const [approvalStatus, setApprovalStatus] = React.useState<ApprovalStatus>("draft");
  const [correctionElapsedSeconds, setCorrectionElapsedSeconds] = React.useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = React.useState<boolean>(false);

  // Resolve current sample
  const currentSample = React.useMemo<RepresentativeSample>(
    () =>
      CUBICASA_REPRESENTATIVE_SAMPLES.find((s) => s.id === selectedSampleId) ??
      CUBICASA_REPRESENTATIVE_SAMPLES[0],
    [selectedSampleId],
  );

  // Initialize calibration based on current sample
  React.useEffect(() => {
    if (selectedSampleId === "sample-1br") {
      setPoint1({ x: 50, y: 50 });
      setPoint2({ x: 750, y: 50 });
      setKnownLengthMm(7000); // 10 mm/px
    } else if (selectedSampleId === "sample-2br") {
      setPoint1({ x: 60, y: 60 });
      setPoint2({ x: 840, y: 60 });
      setKnownLengthMm(7800); // 10 mm/px
    } else if (selectedSampleId === "sample-studio") {
      setPoint1({ x: 40, y: 40 });
      setPoint2({ x: 560, y: 40 });
      setKnownLengthMm(5200); // 10 mm/px
    }
  }, [selectedSampleId]);

  // Compute calibration live
  React.useEffect(() => {
    if (skipCalibration) {
      setCalibrationResult(createUnscaledCalibration());
      return;
    }
    try {
      const res = calculateScaleFromTwoPoints(point1, point2, knownLengthMm);
      setCalibrationResult(res);
    } catch {
      setCalibrationResult(null);
    }
  }, [skipCalibration, point1, point2, knownLengthMm]);

  // Manual correction timer
  React.useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning && viewMode === "editor") {
      interval = setInterval(() => {
        setCorrectionElapsedSeconds((s) => s + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, viewMode]);

  // Handle Sample Select
  const handleSelectSample = (sampleId: string) => {
    setSelectedSampleId(sampleId);
    setUploadedFile(null);
    setImagePreviewUrl(null);
    setRawSemanticOutput(null);
    setInitialNormalizedPlan(null);
    setCurrentPlan(null);
    setEvaluationRecord(null);
    setInferenceError(null);
  };

  // Handle File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadedFile(file);
    const url = URL.createObjectURL(file);
    setImagePreviewUrl(url);
    setRawSemanticOutput(null);
    setInitialNormalizedPlan(null);
    setCurrentPlan(null);
    setEvaluationRecord(null);
    setInferenceError(null);
  };

  // Run Inference & Normalization
  const handleRunInference = async () => {
    setIsInferring(true);
    setInferenceError(null);

    try {
      const input = uploadedFile ?? selectedSampleId;
      const raw = await adapter.predict(input, { sampleId: selectedSampleId });
      setRawSemanticOutput(raw);

      const activeCalibration = skipCalibration
        ? createUnscaledCalibration()
        : calibrationResult ?? createUnscaledCalibration();

      const normalized = normalizeCubiCasaToFloorPlan(raw, activeCalibration, {
        name: uploadedFile ? `Imported (${uploadedFile.name})` : currentSample.name,
        planId: `plan-cubicasa-${raw.imageId}`,
      });

      setInitialNormalizedPlan(normalized);
      setCurrentPlan(normalized);

      // Create initial evaluation benchmark record
      const record = createEvaluationRecord({
        imageId: raw.imageId,
        imageHash: raw.imageHash,
        engine: raw.engine,
        modelVersion: raw.modelVersion,
        inferenceMs: raw.inferenceMs,
        scaled: activeCalibration.scaled,
        wallFixCount: 0,
        openingFixCount: 0,
        roomFixCount: 0,
        manualCorrectionSec: 0,
        approvalStatus: "draft",
        finalPlanId: normalized.meta.id ?? `plan-${raw.imageId}`,
      });

      setEvaluationRecord(record);
      setApprovalStatus("draft");
      setCorrectionElapsedSeconds(0);
    } catch (err) {
      if (err instanceof CubiCasaServiceUnavailableError) {
        setInferenceError(
          "CubiCasa recognition service is currently unavailable. You can use representative local mock samples to proceed.",
        );
      } else if (err instanceof Error) {
        setInferenceError(err.message);
      } else {
        setInferenceError("Unexpected error during CubiCasa recognition.");
      }
    } finally {
      setIsInferring(false);
    }
  };

  // Switch to Correction Editor
  const handleOpenCorrectionEditor = () => {
    if (!currentPlan) return;
    setViewMode("editor");
    setIsTimerRunning(true);
  };

  // Return to Lab View
  const handleReturnToLab = () => {
    setViewMode("lab");
    setIsTimerRunning(false);
  };

  // Plan changed inside Correction Editor
  const handlePlanChangeInEditor = (updatedPlan: FloorPlan) => {
    setCurrentPlan(updatedPlan);

    if (initialNormalizedPlan && evaluationRecord) {
      const fixCounts = computeFixCounts(initialNormalizedPlan, updatedPlan);
      setEvaluationRecord((prev) =>
        prev
          ? {
              ...prev,
              wallFixCount: fixCounts.wallFixCount,
              openingFixCount: fixCounts.openingFixCount,
              roomFixCount: fixCounts.roomFixCount,
              manualCorrectionSec: correctionElapsedSeconds,
              approvalStatus,
            }
          : null,
      );
    }
  };

  // Update Approval Status
  const handleStatusChange = (status: ApprovalStatus) => {
    setApprovalStatus(status);
    if (evaluationRecord) {
      setEvaluationRecord((prev) =>
        prev ? { ...prev, approvalStatus: status } : null,
      );
    }
  };

  // Export Evaluation Record JSON
  const handleExportEvaluation = () => {
    if (!evaluationRecord) return;
    const finalRecord: EvaluationRecord = {
      ...evaluationRecord,
      manualCorrectionSec: correctionElapsedSeconds,
      approvalStatus,
    };
    downloadEvaluationRecordJson(finalRecord);
  };

  // Export Normalized FloorPlan JSON
  const handleExportPlan = () => {
    if (!currentPlan) return;
    downloadFloorPlanJson(currentPlan);
  };

  // Format stopwatch seconds MM:SS
  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // IF in editor mode, render FloorPlanShell with current plan as initial active plan
  if (viewMode === "editor" && currentPlan) {
    return (
      <div className="relative flex min-h-0 w-full flex-1 flex-col">
        {/* Lab sticky navigation bar */}
        <div className="flex shrink-0 items-center justify-between border-b border-border bg-card/90 px-4 py-2 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleReturnToLab}
              className="text-xs"
              data-testid="return-to-lab-button"
            >
              <ArrowRight className="h-3.5 w-3.5 rotate-180" />
              <span>{isZh ? "返回识图实验室" : "Return to Recognition Lab"}</span>
            </Button>
            <Badge variant="secondary" className="font-mono text-xs">
              <Clock className="mr-1 h-3 w-3 text-primary animate-pulse" />
              {isZh ? "校正耗时: " : "Correction Time: "}{formatSeconds(correctionElapsedSeconds)}
            </Badge>
            {evaluationRecord && (
              <Badge variant="outline" className="text-xs font-mono">
                {isZh
                  ? `修正统计: 墙体 ${evaluationRecord.wallFixCount} / 门窗 ${evaluationRecord.openingFixCount} / 房间 ${evaluationRecord.roomFixCount}`
                  : `Fixes: Walls ${evaluationRecord.wallFixCount} / Openings ${evaluationRecord.openingFixCount} / Rooms ${evaluationRecord.roomFixCount}`}
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant={approvalStatus === "approved" ? "default" : "outline"}
              onClick={() => handleStatusChange("approved")}
              className="text-xs"
              data-testid="approve-plan-button"
            >
              <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
              {isZh ? "批准户型 (Approve)" : "Approve Plan"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportEvaluation}
              className="text-xs"
              data-testid="export-eval-from-editor-button"
            >
              <Download className="mr-1 h-3.5 w-3.5" />
              {isZh ? "导出评估 JSON" : "Export Evaluation JSON"}
            </Button>
          </div>
        </div>

        {/* The Canonical FloorPlan Editor */}
        <FloorPlanShell
          initialActivePlan={currentPlan}
          onPlanChange={handlePlanChangeInEditor}
          locale={isZh ? "zh" : "en"}
        />
      </div>
    );
  }

  // Lab View Render
  return (
    <ToolPageChrome
      title={isZh ? "CubiCasa 识图实验室" : "CubiCasa Recognition Lab"}
      description={
        isZh
          ? "本地 CubiCasa 户型图片识别 · 两点标定 · 拓扑规整 · 人工校正与生产效率评估 (US-20..22)"
          : "Local CubiCasa floor plan recognition · Two-point calibration · Topology normalization · Evaluation benchmark (US-20..22)"
      }
      actions={
        <div className="flex items-center gap-2">
          <Link href={isZh ? "/zh/floor-plan" : "/floor-plan"}>
            <Button variant="outline" size="sm" className="text-xs">
              <Home className="mr-1 h-3.5 w-3.5" />
              {isZh ? "标准户型编辑器" : "Standard Plan Editor"}
            </Button>
          </Link>
          <Button
            variant="outline"
            size="sm"
            disabled={!currentPlan}
            onClick={handleExportPlan}
            className="text-xs"
            data-testid="export-floorplan-json-button"
          >
            <Download className="mr-1 h-3.5 w-3.5" />
            {isZh ? "导出 FloorPlan JSON" : "Export FloorPlan JSON"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={!evaluationRecord}
            onClick={handleExportEvaluation}
            className="text-xs"
            data-testid="export-eval-json-button"
          >
            <FileText className="mr-1 h-3.5 w-3.5" />
            {isZh ? "导出评估记录 JSON" : "Export Evaluation JSON"}
          </Button>
        </div>
      }
    >
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-12 lg:gap-4 flex-1 min-h-0">
        {/* Left Column: Sample, Upload & Calibration (4 cols) */}
        <div className="flex flex-col gap-3 lg:col-span-4 min-h-0">
          <Card className="flex flex-col flex-1 overflow-hidden">
            <CardHeader className="p-3.5 pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold flex items-center gap-1.5">
                  <ImageIcon className="h-4 w-4 text-primary" />
                  <span>{isZh ? "样本输入与尺度标定" : "Input Sample & Calibration"}</span>
                </CardTitle>
                <Badge variant="outline" className="text-[10px] font-mono">
                  AC-20, AC-21
                </Badge>
              </div>
              <CardDescription className="text-xs">
                {isZh
                  ? "选择代表性户型样本或上传 JPG/PNG 进行两点已知长度标定"
                  : "Select representative sample or upload JPG/PNG for scale calibration"}
              </CardDescription>
            </CardHeader>

            <CardScrollArea className="flex-1 p-3.5 pt-0 space-y-4">
              {/* Representative Samples */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-foreground block">
                  {isZh ? "代表性验证样本 (Validation Batch)" : "Representative Validation Samples"}
                </label>
                <div className="grid grid-cols-1 gap-1.5">
                  {CUBICASA_REPRESENTATIVE_SAMPLES.map((sample) => {
                    const isSelected = selectedSampleId === sample.id && !uploadedFile;
                    return (
                      <button
                        key={sample.id}
                        type="button"
                        onClick={() => handleSelectSample(sample.id)}
                        data-testid={`sample-select-${sample.id}`}
                        className={cn(
                          "flex flex-col items-start p-2.5 rounded-lg border text-left transition-all",
                          isSelected
                            ? "border-primary bg-primary/5 shadow-xs"
                            : "border-border hover:bg-muted/50",
                        )}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="text-xs font-medium text-foreground">
                            {sample.name}
                          </span>
                          {isSelected && (
                            <Badge variant="default" className="text-[10px] py-0 px-1.5">
                              Active
                            </Badge>
                          )}
                        </div>
                        <span className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">
                          {sample.description}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Upload Own Image */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-foreground block">
                  {isZh ? "或者上传自定义户型图片" : "Or Upload Custom Floor Plan Image"}
                </label>
                <label className="flex flex-col items-center justify-center p-3 border border-dashed border-border rounded-lg cursor-pointer hover:bg-muted/40 transition-colors">
                  <UploadCloud className="h-5 w-5 text-muted-foreground mb-1" />
                  <span className="text-xs font-medium text-foreground">
                    {uploadedFile ? uploadedFile.name : (isZh ? "点击选择 PNG / JPG 图像" : "Click to select PNG / JPG image")}
                  </span>
                  <span className="text-[10px] text-muted-foreground mt-0.5">
                    {isZh ? "支持带尺寸线、彩色或黑白户型图" : "Supports dimension lines, color or black & white"}
                  </span>
                  <input
                    type="file"
                    accept="image/png, image/jpeg"
                    className="hidden"
                    onChange={handleFileUpload}
                    data-testid="file-upload-input"
                  />
                </label>
              </div>

              {/* Two-Point Calibration (AC-21) */}
              <div className="space-y-3 rounded-lg border border-border bg-card p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                    <Ruler className="h-3.5 w-3.5 text-primary" />
                    <span>{isZh ? "两点已知长度标定 (AC-21)" : "Two-Point Scale Calibration (AC-21)"}</span>
                  </div>
                  <label className="flex items-center gap-1.5 text-[11px] text-muted-foreground cursor-pointer">
                    <input
                      type="checkbox"
                      checked={skipCalibration}
                      onChange={(e) => setSkipCalibration(e.target.checked)}
                      data-testid="skip-calibration-toggle"
                      className="rounded border-border text-primary focus:ring-primary h-3.5 w-3.5"
                    />
                    <span>{isZh ? "跳过标定 (未标定模式)" : "Skip Calibration (Unscaled Mode)"}</span>
                  </label>
                </div>

                {!skipCalibration ? (
                  <div className="space-y-2.5">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-[10px] text-muted-foreground block mb-1">
                          {isZh ? "点 1 (x, y) px" : "Point 1 (x, y) px"}
                        </span>
                        <div className="flex gap-1">
                          <Input
                            type="number"
                            value={point1.x}
                            onChange={(e) =>
                              setPoint1((p) => ({ ...p, x: Number(e.target.value) }))
                            }
                            className="h-7 text-xs font-mono"
                            data-testid="calibration-p1-x"
                          />
                          <Input
                            type="number"
                            value={point1.y}
                            onChange={(e) =>
                              setPoint1((p) => ({ ...p, y: Number(e.target.value) }))
                            }
                            className="h-7 text-xs font-mono"
                            data-testid="calibration-p1-y"
                          />
                        </div>
                      </div>
                      <div>
                        <span className="text-[10px] text-muted-foreground block mb-1">
                          {isZh ? "点 2 (x, y) px" : "Point 2 (x, y) px"}
                        </span>
                        <div className="flex gap-1">
                          <Input
                            type="number"
                            value={point2.x}
                            onChange={(e) =>
                              setPoint2((p) => ({ ...p, x: Number(e.target.value) }))
                            }
                            className="h-7 text-xs font-mono"
                            data-testid="calibration-p2-x"
                          />
                          <Input
                            type="number"
                            value={point2.y}
                            onChange={(e) =>
                              setPoint2((p) => ({ ...p, y: Number(e.target.value) }))
                            }
                            className="h-7 text-xs font-mono"
                            data-testid="calibration-p2-y"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] text-muted-foreground block mb-1">
                        {isZh ? "已知实际长度 (mm)" : "Known Length (mm)"}
                      </span>
                      <Input
                        type="number"
                        value={knownLengthMm}
                        onChange={(e) => setKnownLengthMm(Number(e.target.value))}
                        className="h-7 text-xs font-mono"
                        data-testid="calibration-real-length-input"
                        placeholder={isZh ? "例如 7000" : "e.g. 7000"}
                      />
                    </div>

                    {calibrationResult && calibrationResult.scaled && (
                      <div
                        data-testid="calibration-status-badge"
                        className="flex items-center justify-between rounded bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1.5 text-xs text-emerald-700 dark:text-emerald-400 font-mono"
                      >
                        <span>{isZh ? "标定比例:" : "Scale:"}</span>
                        <span className="font-semibold">
                          {calibrationResult.mmPerPixel.toFixed(2)} mm/px
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div
                    data-testid="unscaled-mode-notice"
                    className="rounded bg-amber-500/10 border border-amber-500/20 p-2 text-xs text-amber-700 dark:text-amber-400"
                  >
                    {isZh
                      ? "未标定模式：保留相对像素几何，在编辑器中将严格抑制开门、家具间距及通道净距结论。"
                      : "Unscaled mode: Preserves relative pixel geometry. Clearance and passage rules are suppressed."}
                  </div>
                )}
              </div>

              {/* Action Button */}
              <Button
                className="w-full text-xs font-medium"
                onClick={handleRunInference}
                disabled={isInferring}
                data-testid="run-inference-button"
              >
                {isInferring ? (
                  <>
                    <Sparkles className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                    <span>{isZh ? "正在执行 CubiCasa 推理与规整..." : "Running CubiCasa inference & normalization..."}</span>
                  </>
                ) : (
                  <>
                    <Play className="mr-1.5 h-3.5 w-3.5" />
                    <span>{isZh ? "执行 CubiCasa 识别与规整" : "Run CubiCasa Recognition"}</span>
                  </>
                )}
              </Button>

              {inferenceError && (
                <div
                  data-testid="inference-error-alert"
                  className="rounded-lg border border-destructive/30 bg-destructive/10 p-2.5 text-xs text-destructive flex items-start gap-2"
                >
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-medium block">{isZh ? "识别遇到问题" : "Inference Error"}</span>
                    <span>{inferenceError}</span>
                  </div>
                </div>
              )}
            </CardScrollArea>
          </Card>
        </div>

        {/* Center Column: Source & Raw Semantic Overlay Canvas (5 cols) */}
        <div className="flex flex-col gap-3 lg:col-span-5 min-h-0">
          <Card className="flex flex-col flex-1 overflow-hidden">
            <CardHeader className="p-3.5 pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold flex items-center gap-1.5">
                  <Layers className="h-4 w-4 text-primary" />
                  <span>{isZh ? "图像与原始语义分割叠加 (AC-20)" : "Image & Semantic Segmentation Overlay (AC-20)"}</span>
                </CardTitle>
                {rawSemanticOutput && (
                  <Badge variant="secondary" className="text-[10px] font-mono">
                    {rawSemanticOutput.inferenceMs} ms
                  </Badge>
                )}
              </div>
              <CardDescription className="text-xs">
                {isZh
                  ? "显示原图轮廓、语义分割 mask 候选墙体、门窗与房间区域"
                  : "Shows source outlines, semantic mask candidate walls, openings, and rooms"}
              </CardDescription>
            </CardHeader>

            <CardScrollArea className="flex-1 p-3.5 pt-0 flex items-center justify-center bg-muted/20">
              <div
                className="relative border border-border rounded-lg overflow-hidden bg-background shadow-inner max-w-full"
                style={{ width: 600, height: 450 }}
              >
                {/* Visual SVG Overlay */}
                <svg
                  viewBox={`0 0 ${currentSample.widthPx} ${currentSample.heightPx}`}
                  className="w-full h-full"
                  data-testid="semantic-overlay-svg"
                >
                  <defs>
                    <pattern id="grid-lab" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-muted-foreground/15" />
                    </pattern>
                  </defs>

                  {/* Grid background representing underlying image canvas */}
                  <rect width="100%" height="100%" fill="url(#grid-lab)" />

                  {/* If image preview available */}
                  {imagePreviewUrl ? (
                    <image
                      href={imagePreviewUrl}
                      width={currentSample.widthPx}
                      height={currentSample.heightPx}
                      opacity={0.65}
                    />
                  ) : (
                    <rect width="100%" height="100%" fill="currentColor" className="text-primary/5" />
                  )}

                  {/* Raw semantic overlay if inference completed */}
                  {rawSemanticOutput ? (
                    <g data-testid="raw-semantic-elements">
                      {/* Room Polygons */}
                      {rawSemanticOutput.rooms.map((rm) => {
                        const pointsStr = rm.polygon.map((p) => `${p.x},${p.y}`).join(" ");
                        const center = rm.polygon[0] ?? { x: 0, y: 0 };
                        return (
                          <g key={rm.id}>
                            <polygon
                              points={pointsStr}
                              className="fill-primary/20 stroke-primary/50 stroke-1"
                            />
                            <text
                              x={center.x + 30}
                              y={center.y + 30}
                              className="text-[12px] font-sans fill-foreground font-semibold"
                            >
                              {rm.name || rm.type}
                            </text>
                          </g>
                        );
                      })}

                      {/* Wall Segments */}
                      {rawSemanticOutput.walls.map((w) => (
                        <line
                          key={w.id}
                          x1={w.start.x}
                          y1={w.start.y}
                          x2={w.end.x}
                          y2={w.end.y}
                          strokeWidth={w.thickness ?? 15}
                          strokeLinecap="round"
                          className="stroke-foreground/80"
                        />
                      ))}

                      {/* Openings */}
                      {rawSemanticOutput.openings.map((op) => {
                        const cx = op.center?.x ?? 0;
                        const cy = op.center?.y ?? 0;
                        return (
                          <circle
                            key={op.id}
                            cx={cx}
                            cy={cy}
                            r={10}
                            className={
                              op.type === "door"
                                ? "fill-amber-500/80 stroke-amber-600 stroke-2"
                                : "fill-sky-500/80 stroke-sky-600 stroke-2"
                            }
                          />
                        );
                      })}
                    </g>
                  ) : (
                    /* Initial prompt / instructions */
                    <g>
                      <text
                        x={currentSample.widthPx / 2}
                        y={currentSample.heightPx / 2}
                        textAnchor="middle"
                        className="text-xs fill-muted-foreground font-mono"
                      >
                        {isZh ? "点击“执行 CubiCasa 识别”以渲染语义叠加" : "Click \"Run CubiCasa Recognition\" to render semantic overlay"}
                      </text>
                    </g>
                  )}

                  {/* Calibration Line Callout */}
                  {!skipCalibration && (
                    <g data-testid="calibration-overlay-line">
                      <line
                        x1={point1.x}
                        y1={point1.y}
                        x2={point2.x}
                        y2={point2.y}
                        className="stroke-amber-500 stroke-2 [stroke-dasharray:4,4]"
                      />
                      <circle cx={point1.x} cy={point1.y} r={4} className="fill-amber-500" />
                      <circle cx={point2.x} cy={point2.y} r={4} className="fill-amber-500" />
                      <text
                        x={(point1.x + point2.x) / 2}
                        y={(point1.y + point2.y) / 2 - 8}
                        textAnchor="middle"
                        className="text-[10px] font-mono fill-amber-600 dark:fill-amber-400 font-bold bg-background"
                      >
                        {knownLengthMm} mm
                      </text>
                    </g>
                  )}
                </svg>
              </div>
            </CardScrollArea>
          </Card>
        </div>

        {/* Right Column: Normalization, Benchmark Metrics & Action (3 cols) */}
        <div className="flex flex-col gap-3 lg:col-span-3 min-h-0">
          <Card className="flex flex-col flex-1 overflow-hidden">
            <CardHeader className="p-3.5 pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold flex items-center gap-1.5">
                  <FileCheck className="h-4 w-4 text-primary" />
                  <span>{isZh ? "生产评估基准 (AC-23)" : "Production Evaluation Benchmark (AC-23)"}</span>
                </CardTitle>
                <Badge
                  variant={currentPlan ? "default" : "outline"}
                  className="text-[10px] font-mono"
                >
                  {currentPlan ? "Valid v1" : "Pending"}
                </Badge>
              </div>
              <CardDescription className="text-xs">
                {isZh
                  ? "规整结果自动通过 FloorPlan 校验器，并记录生产基准指标"
                  : "Normalized plan passes FloorPlan validation and logs benchmark metrics"}
              </CardDescription>
            </CardHeader>

            <CardScrollArea className="flex-1 p-3.5 pt-0 space-y-3">
              {evaluationRecord ? (
                <div className="space-y-3 text-xs" data-testid="evaluation-record-panel">
                  {/* Status & Plan Info */}
                  <div className="space-y-1.5 rounded-lg border border-border bg-card p-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">{isZh ? "模型引擎:" : "Engine:"}</span>
                      <span className="font-mono font-medium">{evaluationRecord.engine}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">{isZh ? "模型版本:" : "Model Version:"}</span>
                      <span className="font-mono font-medium">{evaluationRecord.modelVersion}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">{isZh ? "推理耗时:" : "Inference Time:"}</span>
                      <span className="font-mono font-medium">{evaluationRecord.inferenceMs} ms</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">{isZh ? "尺度状态:" : "Scale Status:"}</span>
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-[10px] font-mono py-0 px-1.5",
                          evaluationRecord.scaled
                            ? "text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                            : "text-amber-600 dark:text-amber-400 border-amber-500/30",
                        )}
                      >
                        {evaluationRecord.scaled ? (isZh ? "已标定 (mm)" : "Calibrated (mm)") : (isZh ? "未标定 (Unscaled)" : "Unscaled")}
                      </Badge>
                    </div>
                  </div>

                  {/* Correction Fix Counts */}
                  <div className="space-y-1.5 rounded-lg border border-border bg-card p-2.5">
                    <span className="font-medium text-foreground block">
                      {isZh ? "人工修正统计 (Fix Counts)" : "Manual Correction Fixes"}
                    </span>
                    <div className="grid grid-cols-3 gap-1.5 text-center">
                      <div className="rounded bg-muted/40 p-1.5">
                        <span className="text-[10px] text-muted-foreground block">{isZh ? "墙体修改" : "Walls"}</span>
                        <span className="text-sm font-semibold font-mono" data-testid="fix-count-walls">
                          {evaluationRecord.wallFixCount}
                        </span>
                      </div>
                      <div className="rounded bg-muted/40 p-1.5">
                        <span className="text-[10px] text-muted-foreground block">{isZh ? "门窗微调" : "Openings"}</span>
                        <span className="text-sm font-semibold font-mono" data-testid="fix-count-openings">
                          {evaluationRecord.openingFixCount}
                        </span>
                      </div>
                      <div className="rounded bg-muted/40 p-1.5">
                        <span className="text-[10px] text-muted-foreground block">{isZh ? "房间修正" : "Rooms"}</span>
                        <span className="text-sm font-semibold font-mono" data-testid="fix-count-rooms">
                          {evaluationRecord.roomFixCount}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Manual Correction Time & Status */}
                  <div className="space-y-2 rounded-lg border border-border bg-card p-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">{isZh ? "校正耗时:" : "Correction Time:"}</span>
                      <span className="font-mono font-semibold" data-testid="manual-correction-time">
                        {formatSeconds(correctionElapsedSeconds)}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <span className="text-muted-foreground block text-[11px]">{isZh ? "审批状态:" : "Approval Status:"}</span>
                      <div className="flex gap-1">
                        {(["draft", "approved", "rejected"] as ApprovalStatus[]).map((st) => (
                          <button
                            key={st}
                            type="button"
                            onClick={() => handleStatusChange(st)}
                            data-testid={`approval-btn-${st}`}
                            className={cn(
                              "flex-1 py-1 rounded text-[10px] font-medium capitalize border transition-all",
                              approvalStatus === st
                                ? "bg-primary text-primary-foreground border-primary font-semibold"
                                : "border-border hover:bg-muted/40 text-muted-foreground",
                            )}
                          >
                            {isZh ? (st === "draft" ? "草稿" : st === "approved" ? "已批准" : "已驳回") : st}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Seamless Transition to Correction Editor (AC-22) */}
                  <Button
                    className="w-full text-xs font-semibold"
                    onClick={handleOpenCorrectionEditor}
                    data-testid="open-correction-editor-button"
                  >
                    <Edit3 className="mr-1.5 h-3.5 w-3.5" />
                    <span>{isZh ? "在校正编辑器中打开 (AC-22)" : "Open in Correction Editor (AC-22)"}</span>
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center p-6 text-muted-foreground space-y-2">
                  <Sparkles className="h-6 w-6 text-muted-foreground/40" />
                  <p className="text-xs">
                    {isZh
                      ? "运行识别后，此面板将生成标准 FloorPlan 拓扑，并记录生产效率评估指标。"
                      : "Run recognition to generate standard FloorPlan topology and production metrics."}
                  </p>
                </div>
              )}
            </CardScrollArea>
          </Card>
        </div>
      </div>
    </ToolPageChrome>
  );
}
