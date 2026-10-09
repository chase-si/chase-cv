import * as ort from "onnxruntime-web/webgpu";

import { readModelManifest, type ModelManifest } from "@/lib/find-in-video/model-manifest";
import {
  buffaloModel,
  type ExecutionProviderName,
} from "@/lib/find-in-video/model-options";

import { CodedError, type StatusNotice } from "./coded-error";

type Point = [number, number];
type Detection = {
  box: [number, number, number, number];
  score: number;
  landmarks: Point[];
};
export type Face = Detection & { embedding: Float32Array; noseRatio: number | null };
type Surface = { canvas: OffscreenCanvas; context: OffscreenCanvasRenderingContext2D };

const inputSize = 640;
const destination: Point[] = [
  [38.2946, 51.6963],
  [73.5318, 51.5014],
  [56.0252, 71.7366],
  [41.5493, 92.3655],
  [70.7299, 92.2041],
];

ort.env.wasm.numThreads = 1;
ort.env.wasm.proxy = false;
ort.env.logLevel = "error";
if (typeof location !== "undefined") {
  ort.env.wasm.wasmPaths = `${location.origin}/onnx/`;
}

async function loadModel(
  name: string,
  manifest: ModelManifest,
  progress?: (notice: StatusNotice) => void,
) {
  const entry = manifest.variants.buffalo_l.models[name];
  if (!entry?.parts?.length) throw new CodedError("missingPart", { name });
  const bytes = new Uint8Array(entry.bytes);
  let offset = 0;
  for (const [index, part] of entry.parts.entries()) {
    progress?.({
      code: "reading",
      values: { name, index: index + 1, total: entry.parts.length },
    });
    const response = await fetch(`/models/${part}`);
    if (!response.ok) {
      throw new CodedError("partFailed", { part, status: response.status });
    }
    if (response.headers.get("content-type")?.includes("text/html")) {
      throw new CodedError("partHtml", { part });
    }
    const chunk = new Uint8Array(await response.arrayBuffer());
    if (offset + chunk.length > bytes.length) throw new CodedError("partLength", { name });
    bytes.set(chunk, offset);
    offset += chunk.length;
  }
  if (offset !== bytes.length) throw new CodedError("partIncomplete", { name });
  const hash = Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256", bytes)))
    .map((value) => value.toString(16).padStart(2, "0"))
    .join("");
  if (hash !== entry.sha256) throw new CodedError("checksumFailed", { name });
  return bytes;
}

function withTimeout<T>(promise: Promise<T>, milliseconds: number) {
  let timer: ReturnType<typeof setTimeout> | undefined;
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => {
      timer = setTimeout(() => reject(new CodedError("webgpuTimeout")), milliseconds);
    }),
  ]).finally(() => clearTimeout(timer));
}

async function webGpuReady() {
  const gpu = (navigator as Navigator & { gpu?: { requestAdapter: () => Promise<unknown> } }).gpu;
  if (!gpu) return false;
  try {
    const adapter = await Promise.race([
      gpu.requestAdapter(),
      new Promise<unknown>((resolve) => setTimeout(() => resolve(null), 4000)),
    ]);
    return !!adapter;
  } catch {
    return false;
  }
}

async function warmup(session: ort.InferenceSession) {
  const name = session.inputNames[0];
  const meta = session.inputMetadata.find((item) => item.name === name);
  if (!meta || !meta.isTensor || meta.type !== "float32") return;
  const shape = meta.shape.map((dim) => (typeof dim === "number" && dim > 0 ? dim : 1));
  const length = shape.reduce((total, dim) => total * dim, 1);
  if (!Number.isFinite(length) || length <= 0 || length > 8_000_000) return;
  await session.run({ [name]: new ort.Tensor("float32", new Float32Array(length), shape) });
}

async function openSessions(
  names: readonly string[],
  provider: ExecutionProviderName,
  manifest: ModelManifest,
  progress?: (notice: StatusNotice) => void,
) {
  const sessions: ort.InferenceSession[] = [];
  const label = provider === "webgpu" ? "WebGPU" : "WASM";
  try {
    for (const name of names) {
      progress?.({ code: "initializing", values: { name, provider: label } });
      const bytes = await loadModel(name, manifest, progress);
      const created = ort.InferenceSession.create(bytes, {
        executionProviders: [provider],
        graphOptimizationLevel: "all",
      });
      let session: ort.InferenceSession;
      try {
        session = provider === "webgpu" ? await withTimeout(created, 45_000) : await created;
      } catch (error) {
        void created.then((late) => late.release()).catch(() => undefined);
        throw error;
      }
      sessions.push(session);
      if (provider === "webgpu") await withTimeout(warmup(session), 45_000);
    }
    return sessions;
  } catch (error) {
    await Promise.all(sessions.map((session) => session.release().catch(() => undefined)));
    throw error;
  }
}

function overlap(a: Detection, b: Detection) {
  const left = Math.max(a.box[0], b.box[0]);
  const top = Math.max(a.box[1], b.box[1]);
  const right = Math.min(a.box[2], b.box[2]);
  const bottom = Math.min(a.box[3], b.box[3]);
  const intersection = Math.max(0, right - left + 1) * Math.max(0, bottom - top + 1);
  const area = (face: Detection) =>
    (face.box[2] - face.box[0] + 1) * (face.box[3] - face.box[1] + 1);
  return intersection / (area(a) + area(b) - intersection);
}

export class FaceEngine {
  private readonly surfaces = new Map<string, Surface>();
  private readonly buffers = new Map<string, Float32Array>();

  private constructor(
    readonly executionProvider: ExecutionProviderName,
    private detector: ort.InferenceSession,
    private recognizer: ort.InferenceSession,
  ) {}

  get matchThreshold() {
    return buffaloModel.matchThreshold;
  }

  async dispose() {
    await Promise.all([this.detector.release(), this.recognizer.release()]);
  }

  static async create(
    progress?: (notice: StatusNotice) => void,
    mode: "auto" | "wasm" = "auto",
  ) {
    const manifest = await readModelManifest();
    if (mode === "auto" && (await webGpuReady())) {
      const sessions = await openSessions(buffaloModel.files, "webgpu", manifest, progress);
      progress?.({ code: "ready", values: { provider: "WebGPU" } });
      return new FaceEngine("webgpu", sessions[0], sessions[1]);
    }
    progress?.(mode === "wasm" ? { code: "wasmFallback" } : { code: "wasmNoGpu" });
    const sessions = await openSessions(buffaloModel.files, "wasm", manifest, progress);
    progress?.({ code: "ready", values: { provider: "WASM" } });
    return new FaceEngine("wasm", sessions[0], sessions[1]);
  }

  private surface(key: string, width: number, height: number) {
    const existing = this.surfaces.get(key);
    if (existing && existing.canvas.width === width && existing.canvas.height === height) {
      existing.context.setTransform(1, 0, 0, 1, 0, 0);
      existing.context.clearRect(0, 0, width, height);
      return existing;
    }
    const canvas = new OffscreenCanvas(width, height);
    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (!context) throw new CodedError("noCanvas");
    const created = { canvas, context };
    this.surfaces.set(key, created);
    return created;
  }

  private tensor(key: string, data: ImageData, size: number, mean: number, std: number) {
    const plane = size * size;
    let values = this.buffers.get(key);
    if (!values || values.length !== plane * 3) {
      values = new Float32Array(plane * 3);
      this.buffers.set(key, values);
    }
    const pixels = data.data;
    for (let i = 0; i < plane; i++) {
      const offset = i * 4;
      values[i] = (pixels[offset] - mean) / std;
      values[i + plane] = (pixels[offset + 1] - mean) / std;
      values[i + 2 * plane] = (pixels[offset + 2] - mean) / std;
    }
    return new ort.Tensor("float32", values, [1, 3, size, size]);
  }

  private alignedPixels(source: CanvasImageSource, points: Point[], size: number, target: Point[]) {
    const { context } = this.surface("align", size, size);
    const sourceCenter: Point = [0, 0];
    const targetCenter: Point = [0, 0];
    for (let i = 0; i < 5; i++) {
      sourceCenter[0] += points[i][0] / 5;
      sourceCenter[1] += points[i][1] / 5;
      targetCenter[0] += target[i][0] / 5;
      targetCenter[1] += target[i][1] / 5;
    }
    let real = 0;
    let imaginary = 0;
    let denominator = 0;
    for (let i = 0; i < 5; i++) {
      const x = points[i][0] - sourceCenter[0];
      const y = points[i][1] - sourceCenter[1];
      const u = target[i][0] - targetCenter[0];
      const v = target[i][1] - targetCenter[1];
      real += x * u + y * v;
      imaginary += x * v - y * u;
      denominator += x * x + y * y;
    }
    if (!denominator) throw new CodedError("alignFailed");
    const a = real / denominator;
    const b = imaginary / denominator;
    const tx = targetCenter[0] - a * sourceCenter[0] + b * sourceCenter[1];
    const ty = targetCenter[1] - b * sourceCenter[0] - a * sourceCenter[1];
    context.setTransform(a, b, -b, a, tx, ty);
    context.drawImage(source, 0, 0);
    context.setTransform(1, 0, 0, 1, 0, 0);
    return context.getImageData(0, 0, size, size);
  }

  private async detectBuffalo(
    source: CanvasImageSource,
    width: number,
    height: number,
  ): Promise<Detection[]> {
    const ratio = Math.min(inputSize / width, inputSize / height);
    const { context } = this.surface("detect", inputSize, inputSize);
    context.drawImage(source, 0, 0, Math.floor(width * ratio), Math.floor(height * ratio));
    const tensor = this.tensor(
      "detect",
      context.getImageData(0, 0, inputSize, inputSize),
      inputSize,
      127.5,
      128,
    );
    const output = await this.detector.run({ [this.detector.inputNames[0]]: tensor });
    const strides = [8, 16, 32];
    const candidates: Detection[] = [];
    for (let level = 0; level < 3; level++) {
      const stride = strides[level];
      const score = output[this.detector.outputNames[level]].data as Float32Array;
      const boxes = output[this.detector.outputNames[level + 3]].data as Float32Array;
      const keypoints = output[this.detector.outputNames[level + 6]].data as Float32Array;
      const gridWidth = inputSize / stride;
      for (let i = 0; i < score.length; i++) {
        if (score[i] < 0.5) continue;
        const centerX = (Math.floor(i / 2) % gridWidth) * stride;
        const centerY = Math.floor(Math.floor(i / 2) / gridWidth) * stride;
        const box: Detection["box"] = [
          (centerX - boxes[i * 4] * stride) / ratio,
          (centerY - boxes[i * 4 + 1] * stride) / ratio,
          (centerX + boxes[i * 4 + 2] * stride) / ratio,
          (centerY + boxes[i * 4 + 3] * stride) / ratio,
        ];
        const landmarks: Point[] = [];
        for (let k = 0; k < 5; k++) {
          landmarks.push([
            (centerX + keypoints[i * 10 + k * 2] * stride) / ratio,
            (centerY + keypoints[i * 10 + k * 2 + 1] * stride) / ratio,
          ]);
        }
        candidates.push({ box, score: score[i], landmarks });
      }
    }
    const selected: Detection[] = [];
    for (const candidate of candidates.sort((a, b) => b.score - a.score)) {
      if (selected.every((face) => overlap(face, candidate) <= 0.4)) selected.push(candidate);
    }
    return selected;
  }

  async observe(source: CanvasImageSource, width: number, height: number): Promise<Face[]> {
    const detections = await this.detectBuffalo(source, width, height);
    const faces: Face[] = [];
    for (const detection of detections) {
      const pixels = this.alignedPixels(source, detection.landmarks, 112, destination);
      const tensor = this.tensor("embed", pixels, 112, 127.5, 127.5);
      const output = await this.recognizer.run({ [this.recognizer.inputNames[0]]: tensor });
      const raw = output[this.recognizer.outputNames[0]].data as Float32Array;
      let square = 0;
      for (let i = 0; i < raw.length; i++) square += raw[i] * raw[i];
      const norm = Math.sqrt(square);
      if (!norm) continue;
      const embedding = Float32Array.from(raw, (value) => value / norm);
      const eyes = (detection.landmarks[0][1] + detection.landmarks[1][1]) / 2;
      const mouth = (detection.landmarks[3][1] + detection.landmarks[4][1]) / 2;
      const noseRatio = mouth > eyes ? (detection.landmarks[2][1] - eyes) / (mouth - eyes) : null;
      faces.push({ ...detection, embedding, noseRatio });
    }
    return faces;
  }

  async validate(source: CanvasImageSource, width: number, height: number) {
    const detections = await this.detectBuffalo(source, width, height);
    if (!detections.length) return { reason: "noFace", embedding: null };
    if (detections.length > 1) return { reason: "multipleFaces", embedding: null };
    const face = detections[0];
    if (Math.min(face.box[2] - face.box[0], face.box[3] - face.box[1]) < 48 || face.score < 0.65) {
      return { reason: "faceTooSmall", embedding: null };
    }
    if (this.blurVariance(source, face.box) < 18) return { reason: "faceBlurry", embedding: null };
    const observed = await this.observe(source, width, height);
    return {
      reason: observed.length ? null : "noEmbedding",
      embedding: observed[0]?.embedding || null,
    };
  }

  private blurVariance(source: CanvasImageSource, box: Detection["box"]) {
    const { context } = this.surface("blur", 128, 128);
    context.drawImage(source, box[0], box[1], box[2] - box[0], box[3] - box[1], 0, 0, 128, 128);
    const rgba = context.getImageData(0, 0, 128, 128).data;
    const gray = new Float32Array(128 * 128);
    for (let i = 0; i < gray.length; i++) {
      gray[i] = rgba[i * 4] * 0.299 + rgba[i * 4 + 1] * 0.587 + rgba[i * 4 + 2] * 0.114;
    }
    let sum = 0;
    let squares = 0;
    let count = 0;
    for (let y = 1; y < 127; y++) {
      for (let x = 1; x < 127; x++) {
        const i = y * 128 + x;
        const laplacian = gray[i - 1] + gray[i + 1] + gray[i - 128] + gray[i + 128] - 4 * gray[i];
        sum += laplacian;
        squares += laplacian * laplacian;
        count++;
      }
    }
    return squares / count - (sum / count) ** 2;
  }
}
