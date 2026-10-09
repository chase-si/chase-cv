import type { AnalysisProgress, AnalysisResult, ObservedFace, ReferenceEmbedding } from "./analysis-run";
import { CodedError, type StatusNotice } from "./coded-error";
import type { WorkerResponse } from "./face-protocol";
import { buffaloModel, buffaloModelId, type ExecutionProviderName, type ModelId } from "./model-options";

type Pending = { resolve: (message: WorkerResponse) => void; reject: (error: Error) => void };
type ClientCall =
  | { type: "load"; modelId: ModelId; provider: "auto" | "wasm" }
  | { type: "validate"; bitmap: ImageBitmap }
  | { type: "observe"; bitmap: ImageBitmap; width: number; height: number }
  | { type: "analyze"; file: File; videoId: string; duration: number; references: ReferenceEmbedding[] };

export class FaceSession {
  provider: ExecutionProviderName = "wasm";
  private readonly pending = new Map<number, Pending>();
  private readonly progress = new Map<number, (progress: AnalysisProgress) => void>();
  private nextId = 1;
  private disposed = false;
  private onStatus: ((notice: StatusNotice) => void) | null = null;

  private constructor(
    private readonly worker: Worker,
    readonly modelId: ModelId,
  ) {
    worker.onmessage = (event: MessageEvent<WorkerResponse>) => {
      const message = event.data;
      if (!("id" in message)) return;
      if (message.type === "status") {
        this.onStatus?.(message.notice);
        return;
      }
      if (message.type === "progress") {
        this.progress.get(message.id)?.(message.progress);
        return;
      }
      const waiter = this.pending.get(message.id);
      if (!waiter) return;
      this.pending.delete(message.id);
      if (message.type === "error") {
        waiter.reject(
          message.name === "AbortError"
            ? new DOMException(message.message, "AbortError")
            : message.name === "CodedError"
              ? new CodedError(message.message, message.values)
              : new Error(message.message),
        );
        return;
      }
      waiter.resolve(message);
    };
    worker.onerror = (event) => {
      const error = new CodedError("workerFailed");
      event.preventDefault();
      for (const waiter of this.pending.values()) waiter.reject(error);
      this.pending.clear();
    };

  }

  get matchThreshold() {
    return buffaloModel.matchThreshold;
  }

  static async create(onStatus?: (notice: StatusNotice) => void) {
    const worker = new Worker(new URL("./face-worker.ts", import.meta.url), { type: "module" });
    const session = new FaceSession(worker, buffaloModelId);
    session.onStatus = onStatus ?? null;
    try {
      const loaded = await session.call<Extract<WorkerResponse, { type: "loaded" }>>({
        type: "load",
        modelId: buffaloModelId,
        provider: "auto",
      });
      session.provider = loaded.provider;
      return session;
    } catch (error) {
      await session.dispose();
      throw error;
    }
  }

  private call<T extends WorkerResponse>(
    message: ClientCall,
    transfer?: Transferable[],
    onProgress?: (progress: AnalysisProgress) => void,
  ) {
    if (this.disposed) return Promise.reject(new CodedError("sessionDisposed"));
    const id = this.nextId++;
    return new Promise<T>((resolve, reject) => {
      this.pending.set(id, { resolve: (value) => resolve(value as T), reject });
      if (onProgress) this.progress.set(id, onProgress);
      this.worker.postMessage({ ...message, id }, transfer ?? []);
    }).finally(() => this.progress.delete(id));
  }

  validate(bitmap: ImageBitmap) {
    if (this.disposed) {
      bitmap.close();
      return Promise.reject(new CodedError("sessionDisposed"));
    }
    return this.call<Extract<WorkerResponse, { type: "validated" }>>(
      { type: "validate", bitmap },
      [bitmap],
    ).then((message) => ({ reason: message.reason, embedding: message.embedding }));
  }

  observe(bitmap: ImageBitmap, width: number, height: number) {
    if (this.disposed) {
      bitmap.close();
      return Promise.reject(new CodedError("sessionDisposed"));
    }
    return this.call<Extract<WorkerResponse, { type: "observed" }>>(
      { type: "observe", bitmap, width, height },
      [bitmap],
    ).then((message) => ({ faces: message.faces as ObservedFace[], inferMs: message.inferMs }));
  }

  analyzeSequential(
    file: File,
    videoId: string,
    duration: number,
    references: ReferenceEmbedding[],
    onProgress: (progress: AnalysisProgress) => void,
  ) {
    return this.call<Extract<WorkerResponse, { type: "analyzed" | "unsupported" }>>(
      { type: "analyze", file, videoId, duration, references },
      [],
      onProgress,
    ).then((message) =>
      message.type === "unsupported"
        ? null
        : {
            result: message.result as AnalysisResult,
            decodeMs: message.decodeMs,
            inferMs: message.inferMs,
            wallMs: message.wallMs,
          },
    );
  }

  cancel() {
    if (!this.disposed) this.worker.postMessage({ type: "cancel" });
  }

  async dispose() {
    if (this.disposed) return;
    this.disposed = true;
    this.cancel();
    this.worker.postMessage({ type: "dispose" });
    this.worker.terminate();
    for (const waiter of this.pending.values()) {
      waiter.reject(new DOMException("analysisCancelled", "AbortError"));
    }
    this.pending.clear();
  }
}
