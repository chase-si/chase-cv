"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";

import { PersonClips } from "@/components/find-in-video/person-clips";
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
import { Progress } from "@/components/ui/progress";
import {
  analyzeVideo,
  type AnalysisProgress,
  type AnalysisResult,
  type Segment,
} from "@/lib/find-in-video/browser-analysis";
import { CodedError, type StatusNotice } from "@/lib/find-in-video/coded-error";
import { clipDownloadName, clipRangeDuration } from "@/lib/find-in-video/clip-ranges";
import type { PersonResult } from "@/lib/find-in-video/analysis-run";
import type { ExportProgress } from "@/lib/find-in-video/export-clips";
import { FaceSession } from "@/lib/find-in-video/face-client";
import { readModelManifest } from "@/lib/find-in-video/model-manifest";
import { buffaloModel, type ExecutionProviderName } from "@/lib/find-in-video/model-options";
import { cn } from "@/lib/utils";

type Reference = {
  id: string;
  filename: string;
  name: string;
  thumbnail: string | null;
  valid: boolean;
  reason: string | null;
  embedding: Float32Array | null;
};

type Video = {
  id: string;
  filename: string;
  file: File;
  url: string;
  duration: number;
  width: number;
  height: number;
  preparationSeconds: number;
};

function formatDuration(seconds: number) {
  const whole = Math.floor(seconds);
  const hours = Math.floor(whole / 3600);
  const minutes = String(Math.floor(whole / 60) % 60).padStart(2, "0");
  const secs = String(whole % 60).padStart(2, "0");
  return hours ? `${hours}:${minutes}:${secs}` : `${minutes}:${secs}`;
}

function providerLabel(provider: ExecutionProviderName | null) {
  if (provider === "webgpu") return "WebGPU";
  if (provider === "wasm") return "WASM";
  return "";
}

export function FindInVideoTool() {
  const t = useTranslations("findInVideo");
  const engine = useRef<FaceSession | null>(null);
  const abort = useRef<AbortController | null>(null);
  const exportAbort = useRef<AbortController | null>(null);
  const downloadUrls = useRef(new Map<string, ReturnType<typeof setTimeout>>());
  const mounted = useRef(true);
  const player = useRef<HTMLVideoElement>(null);
  const photoInput = useRef<HTMLInputElement>(null);
  const replacementInput = useRef<HTMLInputElement>(null);
  const videoInput = useRef<HTMLInputElement>(null);
  const replacementId = useRef<string | null>(null);
  const videoUrl = useRef<string | null>(null);
  const [modelAvailable, setModelAvailable] = useState<boolean | null>(null);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [modelLoading, setModelLoading] = useState(false);
  const [modelStatus, setModelStatus] = useState<StatusNotice>({ code: "checking" });
  const [references, setReferences] = useState<Reference[]>([]);
  const [pending, setPending] = useState<string[]>([]);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [video, setVideo] = useState<Video | null>(null);
  const [videoBusy, setVideoBusy] = useState(false);
  const [playerReady, setPlayerReady] = useState(false);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [analysisProgress, setAnalysisProgress] = useState<AnalysisProgress | null>(null);
  const [analysisStarting, setAnalysisStarting] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<(AnalysisResult & { runId: string }) | null>(null);
  const [exportState, setExportState] = useState<{
    personId: string;
    progress: ExportProgress | null;
    error?: string;
    summary?: string;
  } | null>(null);
  const [executionProvider, setExecutionProvider] = useState<ExecutionProviderName | null>(null);

  const explain = (failure: unknown) => {
    const coded = failure instanceof CodedError;
    const code = coded ? failure.message : failure instanceof Error ? failure.message : "";
    const values = coded ? failure.values : undefined;
    if (code && t.has(`errors.${code}` as "errors.noFace")) {
      return t(`errors.${code}` as "errors.noFace", values);
    }
    return failure instanceof Error ? failure.message : String(failure);
  };

  const explainNotice = (notice: StatusNotice) =>
    t.has(`status.${notice.code}` as "status.checking")
      ? t(`status.${notice.code}` as "status.checking", notice.values)
      : notice.code;

  const explainReason = (reason: string) =>
    t.has(`errors.${reason}` as "errors.noFace")
      ? t(`errors.${reason}` as "errors.noFace")
      : reason;

  useEffect(() => {
    mounted.current = true;
    const urls = downloadUrls.current;
    readModelManifest()
      .then(() => {
        setModelAvailable(true);
        setModelStatus({ code: "manifestReady" });
      })
      .catch((failure: unknown) => {
        setModelAvailable(false);
        setModelStatus({
          code: failure instanceof CodedError ? failure.message : "missingManifest",
          values: failure instanceof CodedError ? failure.values : undefined,
        });
      });
    return () => {
      mounted.current = false;
      abort.current?.abort();
      exportAbort.current?.abort();
      for (const [url, timer] of urls) {
        clearTimeout(timer);
        URL.revokeObjectURL(url);
      }
      urls.clear();
      if (videoUrl.current) URL.revokeObjectURL(videoUrl.current);
      void engine.current?.dispose();
    };
  }, []);

  async function loadModel() {
    if (modelLoading || engine.current) return;
    setModelLoading(true);
    try {
      engine.current = await FaceSession.create(setModelStatus);
      setExecutionProvider(engine.current.provider);
      setModelLoaded(true);
      setModelAvailable(true);
    } catch (failure) {
      setModelStatus({
        code: failure instanceof CodedError ? failure.message : "workerFailed",
        values: failure instanceof CodedError ? failure.values : undefined,
      });
    } finally {
      setModelLoading(false);
    }
  }

  const validCount = references.filter((item) => item.valid).length;
  const analysisBusy = analysisStarting || !!analysisProgress;
  const exportBusy = !!exportState?.progress;
  const canStart =
    !!video &&
    !!modelLoaded &&
    validCount > 0 &&
    !pending.length &&
    !busyId &&
    !videoBusy &&
    playerReady &&
    !analysisBusy &&
    !exportBusy;

  async function makeReference(file: File, id = crypto.randomUUID()): Promise<Reference> {
    const { bitmap, thumbnail } = await readImage(file);
    const result = await engine.current!.validate(bitmap);
    return {
      id,
      filename: file.name,
      name: file.name.replace(/\.[^.]+$/, ""),
      thumbnail,
      valid: !!result.embedding,
      reason: result.reason,
      embedding: result.embedding,
    };
  }

  async function addFiles(files: FileList | null) {
    if (!files?.length || !engine.current || exportAbort.current) return;
    setError(null);
    setAnalysis(null);
    setAnalysisError(null);
    const selected = Array.from(files);
    setPending((previous) => [...previous, ...selected.map((file) => file.name)]);
    for (const file of selected) {
      try {
        const item = await makeReference(file);
        setReferences((previous) => [...previous, item]);
      } catch (failure) {
        setError(`${file.name}: ${explain(failure)}`);
      } finally {
        setPending((previous) => {
          const index = previous.indexOf(file.name);
          return previous.filter((_, itemIndex) => itemIndex !== index);
        });
      }
    }
    if (photoInput.current) photoInput.current.value = "";
  }

  async function replaceFile(file: File | undefined) {
    const id = replacementId.current;
    replacementId.current = null;
    if (replacementInput.current) replacementInput.current.value = "";
    if (!id || !file || !engine.current || exportAbort.current) return;
    setBusyId(id);
    setError(null);
    setAnalysis(null);
    try {
      const item = await makeReference(file, id);
      setReferences((previous) => previous.map((old) => (old.id === id ? item : old)));
    } catch (failure) {
      setError(`${file.name}: ${explain(failure)}`);
    } finally {
      setBusyId(null);
    }
  }

  async function selectVideo(file: File | undefined) {
    if (videoInput.current) videoInput.current.value = "";
    if (!file || exportAbort.current) return;
    setVideoBusy(true);
    setVideoError(null);
    try {
      const next = await readVideo(file);
      if (videoUrl.current) URL.revokeObjectURL(videoUrl.current);
      videoUrl.current = next.url;
      setVideo(next);
      setPlayerReady(false);
      setAnalysis(null);
      setAnalysisError(null);
    } catch (failure) {
      setVideoError(`${file.name}: ${explain(failure)}`);
    } finally {
      setVideoBusy(false);
    }
  }

  async function startAnalysis() {
    if (!canStart || !video || !engine.current || exportAbort.current) return;
    const controller = new AbortController();
    abort.current = controller;
    setAnalysisStarting(true);
    setAnalysis(null);
    setExportState(null);
    setAnalysisError(null);
    try {
      const valid = references
        .filter((item) => item.valid && item.embedding)
        .map((item) => ({
          id: item.id,
          filename: item.filename,
          name: item.name,
          embedding: item.embedding!,
        }));
      setAnalysisProgress({
        duration: video.duration,
        processed_seconds: 0,
        progress_percent: 0,
        sampled_frames: 0,
        people: valid.map((item) => ({ id: item.id, name: item.name, segment_count: 0 })),
      });
      const result = await analyzeVideo(
        video.file,
        video.url,
        video.id,
        video.duration,
        valid,
        engine.current,
        controller.signal,
        setAnalysisProgress,
      );
      if (!controller.signal.aborted) setAnalysis({ ...result, runId: crypto.randomUUID() });
    } catch (failure) {
      if (!(failure instanceof DOMException && failure.name === "AbortError")) {
        setAnalysisError(explain(failure));
      }
    } finally {
      abort.current = null;
      setAnalysisProgress(null);
      setAnalysisStarting(false);
    }
  }

  function cancelAnalysis() {
    abort.current?.abort();
    setAnalysisProgress(null);
  }

  function seekToSegment(segment: Segment) {
    const target = player.current;
    if (!target || !playerReady) {
      setVideoError(explain(new CodedError("playerNotReady")));
      return;
    }
    target.currentTime = segment.start_seconds;
    target.scrollIntoView({ behavior: "smooth", block: "center" });
    void target.play().catch(() => setVideoError(explain(new CodedError("videoPlayFailed"))));
  }

  async function downloadPersonClips(person: PersonResult, ranges: Segment[]) {
    if (!video || !analysis || analysis.video_id !== video.id || analysisBusy ||
      videoBusy || pending.length || busyId || exportAbort.current || !ranges.length) return;
    const controller = new AbortController();
    exportAbort.current = controller;
    setExportState({ personId: person.id, progress: { stage: "loading" } });
    try {
      const { exportClips } = await import("@/lib/find-in-video/export-clips").catch(() => {
        throw new CodedError("exportLoadFailed");
      });
      if (controller.signal.aborted) return;
      const result = await exportClips({
        file: video.file,
        duration: video.duration,
        ranges,
        signal: controller.signal,
        onProgress: (progress) => {
          if (mounted.current && !controller.signal.aborted) setExportState({ personId: person.id, progress });
        },
      });
      if (controller.signal.aborted || !mounted.current) return;
      const url = URL.createObjectURL(result.blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = clipDownloadName(video.filename, person.name);
      document.body.append(link);
      try {
        link.click();
      } finally {
        link.remove();
        // Leave enough time for browsers to take ownership of the download.
        downloadUrls.current.set(url, setTimeout(() => {
          URL.revokeObjectURL(url);
          downloadUrls.current.delete(url);
        }, 60_000));
      }
      setExportState({ personId: person.id, progress: null, summary: t("exportComplete", {
        count: result.ranges.length, seconds: clipRangeDuration(result.ranges).toFixed(1),
      }) });
    } catch (failure) {
      if (mounted.current && !controller.signal.aborted) {
        setExportState({ personId: person.id, progress: null, error: explain(failure) });
      }
    } finally {
      if (exportAbort.current === controller) exportAbort.current = null;
      if (mounted.current && controller.signal.aborted) {
        setExportState({ personId: person.id, progress: null, summary: t("exportCancelled") });
      }
    }
  }

  function exportFeedback(personId: string) {
    if (exportState?.personId !== personId) return null;
    const progress = exportState.progress;
    return (
      <div className="space-y-2">
        {progress ? (
          <div className="flex flex-wrap items-center gap-3" role="status">
            <p className="text-sm text-muted-foreground">
              {progress.stage === "cutting"
                ? t("exportStages.cutting", { completed: progress.completed, total: progress.total })
                : t(`exportStages.${progress.stage}`)}
            </p>
            <Button type="button" size="sm" variant="outline" onClick={() => exportAbort.current?.abort()}>
              {t("cancelExport")}
            </Button>
          </div>
        ) : null}
        {exportState.error ? <p className="text-sm text-destructive" role="alert">{exportState.error}</p> : null}
        {exportState.summary ? <p className="text-sm text-muted-foreground" role="status">{exportState.summary}</p> : null}
      </div>
    );
  }

  const loaded = modelLoaded;
  const totalPhotos = references.length + pending.length;
  const nextStep = !loaded ? "model" : validCount === 0 ? "photos" : !video ? "video" : null;
  const steps = [
    {
      id: "model" as const,
      index: "01",
      label: loaded
        ? t("modelReady", { provider: providerLabel(executionProvider) })
        : modelLoading
          ? t("loadingModel")
          : t("loadModel"),
      status: explainNotice(modelStatus),
      disabled: !modelAvailable || modelLoading || loaded,
    },
    {
      id: "photos" as const,
      index: "02",
      label: t("addPhotos"),
      status: `${validCount}/${totalPhotos}`,
      disabled: !loaded || analysisBusy || exportBusy,
    },
    {
      id: "video" as const,
      index: "03",
      label: videoBusy ? t("readingVideo") : video ? t("changeVideo") : t("selectVideo"),
      status: video?.filename ?? t("videoEmpty"),
      disabled: videoBusy || analysisBusy || exportBusy,
    },
  ];

  const referenceList = (
    <>
      {references.length === 0 && pending.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t("emptyPhotos")}</p>
      ) : (
        <ul className="space-y-3" aria-label={t("referencesTitle")}>
          {references.map((item) => (
            <li key={item.id} className="flex min-w-0 gap-3 rounded-xl border border-border p-3">
              {item.thumbnail ? (
                // Data URLs from the local canvas cannot go through the image optimizer.
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.thumbnail}
                  alt={t("thumbnailAlt", { name: item.name })}
                  className="size-16 shrink-0 rounded-lg border border-border object-cover"
                />
              ) : (
                <div className="flex size-16 shrink-0 items-center justify-center rounded-lg border border-border bg-muted text-muted-foreground">
                  ?
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-foreground">{item.name}</p>
                <p className="truncate text-xs text-muted-foreground">{item.filename}</p>
                <p className="mt-1 text-xs text-muted-foreground" role="status">
                  {item.valid ? t("validFace") : explainReason(item.reason ?? "noFace")}
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    disabled={busyId === item.id || analysisBusy || exportBusy}
                    onClick={() => {
                      replacementId.current = item.id;
                      replacementInput.current?.click();
                    }}
                  >
                    {t("replace")}
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    disabled={busyId === item.id || analysisBusy || exportBusy}
                    aria-label={t("remove", { filename: item.filename })}
                    onClick={() => {
                      setReferences((previous) => previous.filter((old) => old.id !== item.id));
                      setAnalysis(null);
                    }}
                  >
                    {t("removeLabel")}
                  </Button>
                </div>
              </div>
            </li>
          ))}
          {pending.map((name, index) => (
            <li key={`${name}-${index}`} className="rounded-xl border border-border p-3">
              <p className="truncate font-medium">{name.replace(/\.[^.]+$/, "")}</p>
              <p className="text-xs text-muted-foreground" role="status">
                {t("checkingPhoto")}
              </p>
            </li>
          ))}
        </ul>
      )}
    </>
  );

  const videoStage = (
    <div className="space-y-4">
      {!video && !videoError ? <p className="text-sm text-muted-foreground">{t("noVideoYet")}</p> : null}
      {videoError ? (
        <p className="text-sm text-destructive" role="alert">
          {videoError}
        </p>
      ) : null}
      {video ? (
        <>
          <dl className="grid grid-cols-3 gap-3 text-sm">
            <div>
              <dt className="text-muted-foreground">{t("duration")}</dt>
              <dd className="font-medium tabular-nums">{formatDuration(video.duration)}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">{t("resolution")}</dt>
              <dd className="font-medium tabular-nums">
                {video.width} × {video.height}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">{t("prepareSeconds")}</dt>
              <dd className="font-medium tabular-nums">{video.preparationSeconds.toFixed(1)}</dd>
            </div>
          </dl>
          <video
            ref={player}
            key={video.id}
            controls
            preload="auto"
            playsInline
            src={video.url}
            aria-label={t("playerLabel", { filename: video.filename })}
            className="max-h-80 w-full rounded-xl border border-border bg-black"
            onLoadedData={() => {
              setPlayerReady(true);
              setVideoError(null);
            }}
            onError={() => {
              setPlayerReady(false);
              setVideoError(explain(new CodedError("videoUndecodable")));
            }}
          />
          {!playerReady && !videoError ? (
            <p className="text-sm text-muted-foreground" role="status">
              {t("playerLoading")}
            </p>
          ) : null}
          <div className="flex flex-wrap items-center gap-3">
            <Button type="button" disabled={!canStart} onClick={() => void startAnalysis()}>
              {analysisBusy
                ? t("analyzing", {
                    percent: (analysisProgress?.progress_percent ?? 0).toFixed(1),
                  })
                : analysisError
                  ? t("retryAnalysis")
                  : analysis
                    ? t("analyzeAgain")
                    : t("analyze")}
            </Button>
            {!validCount ? <p className="text-sm text-muted-foreground">{t("needReference")}</p> : null}
          </div>
          {analysisProgress ? (
            <div className="space-y-3 rounded-xl border border-border p-3" aria-label={t("progressLabel")}>
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium">
                  {t("analyzing", {
                    percent: analysisProgress.progress_percent.toFixed(1),
                  })}
                  {executionProvider ? ` · ${providerLabel(executionProvider)}` : ""}
                </p>
                <Button type="button" size="sm" variant="outline" onClick={cancelAnalysis}>
                  {t("cancel")}
                </Button>
              </div>
              <Progress value={analysisProgress.progress_percent} />
              <dl className="grid gap-2 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-muted-foreground">{t("processedLabel")}</dt>
                  <dd className="tabular-nums">
                    {t("processed", {
                      done: formatDuration(analysisProgress.processed_seconds),
                      total: formatDuration(analysisProgress.duration),
                    })}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">{t("framesLabel")}</dt>
                  <dd className="tabular-nums">{t("frames", { count: analysisProgress.sampled_frames })}</dd>
                </div>
              </dl>
              <ul className="space-y-1 text-sm" aria-label={t("peopleProgress")}>
                {analysisProgress.people.map((person) => (
                  <li key={person.id} className="flex justify-between gap-3">
                    <span className="min-w-0 truncate">{person.name}</span>
                    <span className="shrink-0 font-medium">
                      {t("segmentCount", { count: person.segment_count })}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="text-sm text-muted-foreground" role="status">
                {t("longVideoHint")}
              </p>
            </div>
          ) : null}
          {analysisError ? (
            <p className="text-sm text-destructive" role="alert">
              {analysisError}
            </p>
          ) : null}
          {analysis ? (
            <div className="space-y-3" aria-live="polite">
              <div>
                <p className="font-medium">{t("resultsTitle")}</p>
                <p className="text-sm text-muted-foreground">
                  {t("resultsMeta", {
                    frames: analysis.sampled_frames,
                    provider: providerLabel(executionProvider),
                  })}
                </p>
              </div>
              {analysis.people.map((person) => (
                <PersonClips
                  key={`${analysis.runId}-${person.id}`}
                  person={person}
                  duration={video.duration}
                  disabled={exportBusy || analysisBusy || videoBusy || !!pending.length || !!busyId}
                  playerReady={playerReady}
                  onSeek={seekToSegment}
                  onExport={(ranges) => void downloadPersonClips(person, ranges)}
                  feedback={exportFeedback(person.id)}
                />
              ))}
            </div>
          ) : null}
        </>
      ) : null}
    </div>
  );

  const photoError = error ? (
    <p className="text-sm text-destructive" role="alert">
      {error}
    </p>
  ) : null;

  return (
    <ToolPageChrome
      title={t("title")}
      description={t("description")}
      actions={
        loaded ? (
          <Badge variant="accent">{t("modelReady", { provider: providerLabel(executionProvider) })}</Badge>
        ) : null
      }
    >
      <div data-testid="find-in-video-tool" className="flex min-h-0 flex-1 flex-col gap-3">
        <input
          ref={photoInput}
          className="sr-only"
          type="file"
          multiple
          accept=".jpg,.jpeg,.png,.heic,image/jpeg,image/png,image/heic"
          aria-label={t("addPhotos")}
          onChange={(event) => void addFiles(event.target.files)}
        />
        <input
          ref={replacementInput}
          className="sr-only"
          type="file"
          accept=".jpg,.jpeg,.png,.heic,image/jpeg,image/png,image/heic"
          aria-label={t("replace")}
          onChange={(event) => void replaceFile(event.target.files?.[0])}
        />
        <input
          ref={videoInput}
          className="sr-only"
          type="file"
          accept=".mp4,.mov,.mkv,video/mp4,video/quicktime"
          aria-label={t("selectVideo")}
          onChange={(event) => void selectVideo(event.target.files?.[0])}
        />
        <div className="grid shrink-0 gap-2 sm:grid-cols-3">
          {steps.map((step) => {
            const current = step.id === nextStep;
            return (
              <div
                key={step.id}
                className={cn(
                  "flex min-w-0 flex-col gap-2 rounded-xl border bg-card p-3",
                  current ? "border-primary" : "border-border",
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs text-muted-foreground">{step.index}</span>
                  {current ? <Badge>{t("nextStep")}</Badge> : null}
                </div>
                <Button
                  type="button"
                  className="w-full"
                  variant={current ? "default" : "outline"}
                  disabled={step.disabled}
                  onClick={() => {
                    if (step.id === "model") void loadModel();
                    else if (step.id === "photos") photoInput.current?.click();
                    else videoInput.current?.click();
                  }}
                >
                  {step.label}
                </Button>
                <p className="truncate text-xs text-muted-foreground">{step.status}</p>
              </div>
            );
          })}
        </div>
        <div className="flex min-w-0 shrink-0 items-center gap-2 text-xs text-muted-foreground">
          <p className="min-w-0 truncate">
            {t.rich("license", {
              strong: (chunks) => <strong>{chunks}</strong>,
            })}
          </p>
          <a
            href={buffaloModel.licenseUrl}
            target="_blank"
            rel="noreferrer"
            className="shrink-0 text-primary underline-offset-4 hover:underline"
          >
            {t("licenseLink")}
          </a>
        </div>
        <div className="grid min-h-0 flex-1 gap-3 lg:grid-cols-[22rem_minmax(0,1fr)] lg:items-stretch">
          <Card className="flex min-h-0 flex-col overflow-hidden lg:max-h-full">
            <CardHeader className="shrink-0">
              <div className="flex items-baseline justify-between gap-3">
                <CardTitle>{t("referencesTitle")}</CardTitle>
                <p className="shrink-0 text-xs text-muted-foreground tabular-nums">
                  {validCount}/{totalPhotos}
                </p>
              </div>
            </CardHeader>
            <CardContent className="flex min-h-0 flex-1 flex-col gap-3">
              <CardScrollArea className="min-h-0 flex-1 pr-1">{referenceList}</CardScrollArea>
              {photoError}
            </CardContent>
          </Card>
          <Card className="flex min-h-0 flex-col overflow-hidden lg:max-h-full">
            <CardHeader className="shrink-0">
              <CardTitle>{t("videoTitle")}</CardTitle>
              <CardDescription>{video ? video.filename : t("videoEmpty")}</CardDescription>
            </CardHeader>
            <CardContent className="flex min-h-0 flex-1 flex-col">
              <CardScrollArea className="min-h-0 flex-1 pr-1">{videoStage}</CardScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolPageChrome>
  );
}

async function readImage(file: File) {
  if (file.size > 25 * 1024 * 1024) throw new CodedError("imageTooLarge");
  if (!/\.(jpe?g|png|heic)$/i.test(file.name)) throw new CodedError("imageType");
  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  } catch {
    if (!/\.heic$/i.test(file.name)) throw new CodedError("imageDecode");
    try {
      const { heicTo } = await import("heic-to/csp");
      bitmap = await heicTo({ blob: file, type: "bitmap" });
    } catch {
      throw new CodedError("heicDecode");
    }
  }
  if (bitmap.width * bitmap.height > 40_000_000) {
    bitmap.close();
    throw new CodedError("imagePixels");
  }
  const canvas = document.createElement("canvas");
  canvas.width = Math.min(240, bitmap.width);
  canvas.height = Math.round((canvas.width * bitmap.height) / bitmap.width);
  if (canvas.height > 240) {
    canvas.height = 240;
    canvas.width = Math.round((240 * bitmap.width) / bitmap.height);
  }
  const context = canvas.getContext("2d");
  if (!context) throw new CodedError("noCanvas");
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  return { bitmap, thumbnail: canvas.toDataURL("image/jpeg", 0.85) };
}

function readVideo(file: File): Promise<Video> {
  if (!/\.(mp4|mov|mkv)$/i.test(file.name)) return Promise.reject(new CodedError("videoType"));
  const started = performance.now();
  const url = URL.createObjectURL(file);
  const probe = document.createElement("video");
  probe.preload = "metadata";
  probe.muted = true;
  return new Promise((resolve, reject) => {
    const timer = window.setTimeout(() => fail(new CodedError("videoTimeout")), 30000);
    const cleanup = () => {
      window.clearTimeout(timer);
      probe.onloadedmetadata = null;
      probe.onerror = null;
      probe.removeAttribute("src");
      probe.load();
    };
    const fail = (reason: Error) => {
      cleanup();
      URL.revokeObjectURL(url);
      reject(reason);
    };
    probe.onloadedmetadata = () => {
      if (!Number.isFinite(probe.duration) || probe.duration <= 0 || !probe.videoWidth || !probe.videoHeight) {
        fail(new CodedError("videoNoTrack"));
        return;
      }
      const result: Video = {
        id: crypto.randomUUID(),
        filename: file.name,
        file,
        url,
        duration: probe.duration,
        width: probe.videoWidth,
        height: probe.videoHeight,
        preparationSeconds: (performance.now() - started) / 1000,
      };
      cleanup();
      resolve(result);
    };
    probe.onerror = () => fail(new CodedError("videoUndecodable"));
    probe.src = url;
  });
}
