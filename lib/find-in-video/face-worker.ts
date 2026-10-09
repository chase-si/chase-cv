import {
  AnalysisRun,
  throttleProgress,
  type ObservedFace,
  type ReferenceEmbedding,
} from "./analysis-run";
import { CodedError } from "./coded-error";
import { FaceEngine } from "./face-engine";
import type { WorkerRequest, WorkerResponse } from "./face-protocol";
import { buffaloModelId } from "./model-options";
import { Mp4Unsupported, sampleAnalysisFrames } from "./sequential-frames";

let engine: FaceEngine | null = null;
let analysisCancelled = false;
let activeId = 0;

function post(message: WorkerResponse, transfer: Transferable[] = []) {
  self.postMessage(message, { transfer });
}

function failure(id: number, error: unknown) {
  const aborted = error instanceof DOMException && error.name === "AbortError";
  const coded = error instanceof CodedError;
  post({
    id,
    type: "error",
    name: aborted ? "AbortError" : coded ? "CodedError" : "Error",
    message: error instanceof Error ? error.message : String(error),
    values: coded ? error.values : undefined,
  });
}

self.addEventListener("error", (event) => {
  if (!activeId) return;
  event.preventDefault();
  failure(activeId, event.error || event.message);
});
self.addEventListener("unhandledrejection", (event) => {
  if (!activeId) return;
  event.preventDefault();
  failure(activeId, event.reason);
});

function facesOf(observed: { embedding: Float32Array; noseRatio: number | null }[]): ObservedFace[] {
  return observed.map((face) => ({ embedding: face.embedding, noseRatio: face.noseRatio }));
}

async function analyze(
  id: number,
  file: File,
  videoId: string,
  duration: number,
  references: ReferenceEmbedding[],
) {
  if (!engine) throw new CodedError("loadModelFirst");
  analysisCancelled = false;
  const active = engine;
  const run = new AnalysisRun(references, active.matchThreshold, true);
  const report = throttleProgress((progress) => post({ id, type: "progress", progress }));
  const started = performance.now();
  let decodeMs = 0;
  let inferMs = 0;
  const frames = sampleAnalysisFrames(file, duration, () => analysisCancelled);
  try {
    let upcoming = frames.next();
    while (!analysisCancelled) {
      const decodeStarted = performance.now();
      const step = await upcoming;
      decodeMs += performance.now() - decodeStarted;
      if (step.done) break;
      const sample = step.value;
      const observation = active
        .observe(sample.bitmap, sample.width, sample.height)
        .finally(() => sample.bitmap.close());
      upcoming = frames.next();
      const inferStarted = performance.now();
      const faces = facesOf(await observation);
      inferMs += performance.now() - inferStarted;
      if (analysisCancelled) throw new DOMException("analysisCancelled", "AbortError");
      for (const second of sample.seconds) run.add(second, faces);
      report(run.progress(duration, Math.max(...sample.seconds) + 1));
    }
    if (analysisCancelled) throw new DOMException("analysisCancelled", "AbortError");
    report(run.progress(duration, duration), true);
    post({
      id,
      type: "analyzed",
      result: run.finish(videoId),
      decodeMs,
      inferMs,
      wallMs: performance.now() - started,
    });
  } catch (error) {
    if (error instanceof Mp4Unsupported && run.sampledFrames === 0) {
      post({ id, type: "unsupported" });
      return;
    }
    throw error;
  } finally {
    await frames.return(undefined);
  }
}

self.onmessage = async (event: MessageEvent<WorkerRequest>) => {
  const message = event.data;
  if (message.type === "cancel") {
    analysisCancelled = true;
    return;
  }
  if (message.type === "dispose") {
    analysisCancelled = true;
    const current = engine;
    engine = null;
    await current?.dispose();
    return;
  }
  try {
    activeId = message.id;
    if (message.type === "load") {
      if (message.modelId !== buffaloModelId) throw new CodedError("missingManifest");
      const loaded = await FaceEngine.create(
        (notice) => post({ id: message.id, type: "status", notice }),
        message.provider,
      );
      if (engine) await engine.dispose();
      engine = loaded;
      post({ id: message.id, type: "loaded", provider: loaded.executionProvider });
      return;
    }
    if (!engine) throw new CodedError("loadModelFirst");
    if (message.type === "validate") {
      try {
        const result = await engine.validate(message.bitmap, message.bitmap.width, message.bitmap.height);
        post(
          { id: message.id, type: "validated", reason: result.reason, embedding: result.embedding },
          result.embedding ? [result.embedding.buffer] : [],
        );
      } finally {
        message.bitmap.close();
      }
      return;
    }
    if (message.type === "observe") {
      const started = performance.now();
      try {
        const faces = facesOf(await engine.observe(message.bitmap, message.width, message.height));
        post(
          { id: message.id, type: "observed", faces, inferMs: performance.now() - started },
          faces.map((face) => face.embedding.buffer),
        );
      } finally {
        message.bitmap.close();
      }
      return;
    }
    if (message.type === "analyze") {
      await analyze(message.id, message.file, message.videoId, message.duration, message.references);
    }
  } catch (error) {
    failure(message.id, error);
  } finally {
    activeId = 0;
  }
};
