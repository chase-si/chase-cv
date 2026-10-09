import type { AnalysisProgress, AnalysisResult, ObservedFace, ReferenceEmbedding } from "./analysis-run";
import type { StatusNotice } from "./coded-error";
import type { ExecutionProviderName, ModelId } from "./model-options";

export type WorkerRequest =
  | { id: number; type: "load"; modelId: ModelId; provider: "auto" | "wasm" }
  | { id: number; type: "validate"; bitmap: ImageBitmap }
  | { id: number; type: "observe"; bitmap: ImageBitmap; width: number; height: number }
  | {
      id: number;
      type: "analyze";
      file: File;
      videoId: string;
      duration: number;
      references: ReferenceEmbedding[];
    }
  | { type: "cancel" }
  | { type: "dispose" };

export type WorkerResponse =
  | { id: number; type: "status"; notice: StatusNotice }
  | { id: number; type: "loaded"; provider: ExecutionProviderName }
  | { id: number; type: "validated"; reason: string | null; embedding: Float32Array | null }
  | { id: number; type: "observed"; faces: ObservedFace[]; inferMs: number }
  | { id: number; type: "progress"; progress: AnalysisProgress }
  | {
      id: number;
      type: "analyzed";
      result: AnalysisResult;
      decodeMs: number;
      inferMs: number;
      wallMs: number;
    }
  | { id: number; type: "unsupported" }
  | { id: number; type: "error"; name: string; message: string; values?: StatusNotice["values"] };
