/**
 * Replaceable CubiCasa Adapter (AC-20, AC-24)
 *
 * Provides a swappable interface for running CubiCasa floor plan inference:
 * - MockCubiCasaAdapter: built-in deterministic validation batch (1BR, 2BR, Studio).
 * - HttpCubiCasaAdapter: remote HTTP/FastAPI inference microservice adapter with graceful failure.
 */

import type {
  CubiCasaAdapter,
  CubiCasaAdapterPredictionOptions,
  RawCubiCasaSemanticOutput,
} from "./types";

export class CubiCasaServiceUnavailableError extends Error {
  readonly serviceUnavailable = true;
  constructor(message: string, public readonly cause?: unknown) {
    super(message);
    this.name = "CubiCasaServiceUnavailableError";
  }
}

export interface RepresentativeSample {
  id: string;
  name: string;
  description: string;
  imageUri: string;
  widthPx: number;
  heightPx: number;
  semanticOutput: RawCubiCasaSemanticOutput;
}

export const CUBICASA_REPRESENTATIVE_SAMPLES: RepresentativeSample[] = [
  {
    id: "sample-1br",
    name: "Standard 1-Bedroom (一室一厅)",
    description: "North-South orientation with living room, bedroom, bathroom and kitchen",
    imageUri: "/images/floor-plans/sample-1br.png",
    widthPx: 800,
    heightPx: 600,
    semanticOutput: {
      imageId: "sample-1br",
      imageHash: "hash-cubicasa-sample-1br-v1",
      imageWidth: 800,
      imageHeight: 600,
      engine: "cubicasa-local-mock",
      modelVersion: "v1.2.0-mps",
      inferenceMs: 145,
      walls: [
        // Outer loop
        { id: "w-out-1", start: { x: 50, y: 50 }, end: { x: 750, y: 50 }, thickness: 20 },
        { id: "w-out-2", start: { x: 750, y: 50 }, end: { x: 750, y: 550 }, thickness: 20 },
        { id: "w-out-3", start: { x: 750, y: 550 }, end: { x: 50, y: 550 }, thickness: 20 },
        { id: "w-out-4", start: { x: 50, y: 550 }, end: { x: 50, y: 50 }, thickness: 20 },
        // Partition 1 (vertical dividing living and bedroom)
        { id: "w-div-1", start: { x: 420, y: 50 }, end: { x: 420, y: 550 }, thickness: 15 },
        // Partition 2 (horizontal dividing kitchen and bathroom)
        { id: "w-div-2", start: { x: 50, y: 280 }, end: { x: 420, y: 280 }, thickness: 15 },
      ],
      openings: [
        // Main entrance door
        { id: "op-door-main", type: "door", center: { x: 50, y: 400 }, width: 90, attachedWallId: "w-out-4" },
        // Bedroom door
        { id: "op-door-bed", type: "door", center: { x: 420, y: 200 }, width: 85, attachedWallId: "w-div-1" },
        // Living room window
        { id: "op-win-living", type: "window", center: { x: 230, y: 550 }, width: 160, attachedWallId: "w-out-3" },
        // Bedroom window
        { id: "op-win-bed", type: "window", center: { x: 580, y: 550 }, width: 150, attachedWallId: "w-out-3" },
      ],
      rooms: [
        {
          id: "rm-living",
          type: "living_room",
          name: "Living & Dining Room",
          polygon: [
            { x: 50, y: 280 },
            { x: 420, y: 280 },
            { x: 420, y: 550 },
            { x: 50, y: 550 },
          ],
        },
        {
          id: "rm-kitchen",
          type: "kitchen",
          name: "Kitchen",
          polygon: [
            { x: 50, y: 50 },
            { x: 250, y: 50 },
            { x: 250, y: 280 },
            { x: 50, y: 280 },
          ],
        },
        {
          id: "rm-bedroom",
          type: "bedroom",
          name: "Master Bedroom",
          polygon: [
            { x: 420, y: 50 },
            { x: 750, y: 50 },
            { x: 750, y: 550 },
            { x: 420, y: 550 },
          ],
        },
      ],
    },
  },
  {
    id: "sample-2br",
    name: "Family 2-Bedroom (两室一厅)",
    description: "Spacious layout with master suite, secondary bedroom, living hall and balcony",
    imageUri: "/images/floor-plans/sample-2br.png",
    widthPx: 900,
    heightPx: 700,
    semanticOutput: {
      imageId: "sample-2br",
      imageHash: "hash-cubicasa-sample-2br-v1",
      imageWidth: 900,
      imageHeight: 700,
      engine: "cubicasa-local-mock",
      modelVersion: "v1.2.0-mps",
      inferenceMs: 182,
      walls: [
        { id: "w-out-1", start: { x: 60, y: 60 }, end: { x: 840, y: 60 }, thickness: 20 },
        { id: "w-out-2", start: { x: 840, y: 60 }, end: { x: 840, y: 640 }, thickness: 20 },
        { id: "w-out-3", start: { x: 840, y: 640 }, end: { x: 60, y: 640 }, thickness: 20 },
        { id: "w-out-4", start: { x: 60, y: 640 }, end: { x: 60, y: 60 }, thickness: 20 },
        { id: "w-div-mid", start: { x: 450, y: 60 }, end: { x: 450, y: 640 }, thickness: 15 },
        { id: "w-div-horiz", start: { x: 450, y: 350 }, end: { x: 840, y: 350 }, thickness: 15 },
      ],
      openings: [
        { id: "op-main", type: "door", center: { x: 60, y: 300 }, width: 90, attachedWallId: "w-out-4" },
        { id: "op-bed1", type: "door", center: { x: 450, y: 200 }, width: 85, attachedWallId: "w-div-mid" },
        { id: "op-bed2", type: "door", center: { x: 450, y: 480 }, width: 85, attachedWallId: "w-div-mid" },
        { id: "op-win-1", type: "window", center: { x: 250, y: 60 }, width: 140, attachedWallId: "w-out-1" },
        { id: "op-win-2", type: "window", center: { x: 650, y: 640 }, width: 150, attachedWallId: "w-out-3" },
      ],
      rooms: [
        {
          id: "rm-living",
          type: "living_room",
          name: "Living Hall",
          polygon: [
            { x: 60, y: 60 },
            { x: 450, y: 60 },
            { x: 450, y: 640 },
            { x: 60, y: 640 },
          ],
        },
        {
          id: "rm-bed-1",
          type: "master_bedroom",
          name: "Master Bedroom",
          polygon: [
            { x: 450, y: 60 },
            { x: 840, y: 60 },
            { x: 840, y: 350 },
            { x: 450, y: 350 },
          ],
        },
        {
          id: "rm-bed-2",
          type: "bedroom",
          name: "Second Bedroom",
          polygon: [
            { x: 450, y: 350 },
            { x: 840, y: 350 },
            { x: 840, y: 640 },
            { x: 450, y: 640 },
          ],
        },
      ],
    },
  },
  {
    id: "sample-studio",
    name: "Compact Studio (单身公寓)",
    description: "Efficient studio with private bath and kitchen zone",
    imageUri: "/images/floor-plans/sample-studio.png",
    widthPx: 600,
    heightPx: 500,
    semanticOutput: {
      imageId: "sample-studio",
      imageHash: "hash-cubicasa-sample-studio-v1",
      imageWidth: 600,
      imageHeight: 500,
      engine: "cubicasa-local-mock",
      modelVersion: "v1.2.0-mps",
      inferenceMs: 110,
      walls: [
        { id: "w-1", start: { x: 40, y: 40 }, end: { x: 560, y: 40 }, thickness: 20 },
        { id: "w-2", start: { x: 560, y: 40 }, end: { x: 560, y: 460 }, thickness: 20 },
        { id: "w-3", start: { x: 560, y: 460 }, end: { x: 40, y: 460 }, thickness: 20 },
        { id: "w-4", start: { x: 40, y: 460 }, end: { x: 40, y: 40 }, thickness: 20 },
        { id: "w-bath", start: { x: 40, y: 200 }, end: { x: 220, y: 200 }, thickness: 15 },
        { id: "w-bath-v", start: { x: 220, y: 40 }, end: { x: 220, y: 200 }, thickness: 15 },
      ],
      openings: [
        { id: "op-door-front", type: "door", center: { x: 40, y: 320 }, width: 85, attachedWallId: "w-4" },
        { id: "op-door-bath", type: "door", center: { x: 130, y: 200 }, width: 75, attachedWallId: "w-bath" },
        { id: "op-win-main", type: "window", center: { x: 560, y: 250 }, width: 150, attachedWallId: "w-2" },
      ],
      rooms: [
        {
          id: "rm-bath",
          type: "bathroom",
          name: "Bathroom",
          polygon: [
            { x: 40, y: 40 },
            { x: 220, y: 40 },
            { x: 220, y: 200 },
            { x: 40, y: 200 },
          ],
        },
        {
          id: "rm-studio-main",
          type: "living_room",
          name: "Living & Sleeping Area",
          polygon: [
            { x: 220, y: 40 },
            { x: 560, y: 40 },
            { x: 560, y: 460 },
            { x: 40, y: 460 },
            { x: 40, y: 200 },
            { x: 220, y: 200 },
          ],
        },
      ],
    },
  },
];

export interface MockCubiCasaAdapterOptions {
  engine?: string;
  modelVersion?: string;
  simulatedDelayMs?: number;
  simulateFailure?: boolean;
}

/**
 * Mock CubiCasa adapter returning deterministic results for local testing and offline execution.
 */
export class MockCubiCasaAdapter implements CubiCasaAdapter {
  private engine: string;
  private modelVersion: string;
  private simulatedDelayMs: number;
  private simulateFailure: boolean;

  constructor(options: MockCubiCasaAdapterOptions = {}) {
    this.engine = options.engine ?? "cubicasa-local-mock";
    this.modelVersion = options.modelVersion ?? "v1.2.0-mps";
    this.simulatedDelayMs = options.simulatedDelayMs ?? 10;
    this.simulateFailure = Boolean(options.simulateFailure);
  }

  getEngineInfo() {
    return {
      engine: this.engine,
      modelVersion: this.modelVersion,
    };
  }

  async checkHealth(): Promise<boolean> {
    return !this.simulateFailure;
  }

  async predict(
    input: Blob | File | string,
    options?: CubiCasaAdapterPredictionOptions,
  ): Promise<RawCubiCasaSemanticOutput> {
    if (this.simulateFailure) {
      throw new CubiCasaServiceUnavailableError(
        "Simulated CubiCasa local inference service failure",
      );
    }

    if (this.simulatedDelayMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, this.simulatedDelayMs));
    }

    // Resolve sample
    const sampleId =
      options?.sampleId ||
      (typeof input === "string" ? input : "") ||
      "sample-1br";

    const matched =
      CUBICASA_REPRESENTATIVE_SAMPLES.find((s) => s.id === sampleId) ??
      CUBICASA_REPRESENTATIVE_SAMPLES[0];

    // Compute a pseudo-hash
    const hash =
      typeof input === "string"
        ? `hash-${sampleId}`
        : input instanceof File
          ? `hash-${input.name}-${input.size}`
          : `hash-blob-${Date.now()}`;

    return {
      ...matched.semanticOutput,
      imageId: sampleId,
      imageHash: hash,
      engine: this.engine,
      modelVersion: this.modelVersion,
      inferenceMs: matched.semanticOutput.inferenceMs,
    };
  }
}

export interface HttpCubiCasaAdapterOptions {
  endpoint?: string;
  timeoutMs?: number;
}

/**
 * HTTP CubiCasa adapter calling a local or remote inference endpoint.
 * Gracefully handles absent or failing service (AC-24).
 */
export class HttpCubiCasaAdapter implements CubiCasaAdapter {
  private endpoint: string;
  private timeoutMs: number;

  constructor(options: HttpCubiCasaAdapterOptions = {}) {
    this.endpoint = options.endpoint ?? "http://127.0.0.1:8000/predict";
    this.timeoutMs = options.timeoutMs ?? 5000;
  }

  getEngineInfo() {
    return {
      engine: "cubicasa5k-http",
      modelVersion: "v1.2.0-mps",
    };
  }

  async checkHealth(): Promise<boolean> {
    try {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), Math.min(1000, this.timeoutMs));
      const res = await fetch(this.endpoint.replace(/\/predict$/, "/health"), {
        signal: controller.signal,
      });
      clearTimeout(id);
      return res.ok;
    } catch {
      return false;
    }
  }

  async predict(
    input: Blob | File | string,
    options?: CubiCasaAdapterPredictionOptions,
  ): Promise<RawCubiCasaSemanticOutput> {
    try {
      const formData = new FormData();
      if (typeof input === "string") {
        formData.append("sampleId", input);
      } else {
        formData.append("file", input);
      }

      if (options?.sampleId) {
        formData.append("sampleId", options.sampleId);
      }

      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.timeoutMs);

      const response = await fetch(this.endpoint, {
        method: "POST",
        body: formData,
        signal: controller.signal,
      });
      clearTimeout(timer);

      if (!response.ok) {
        throw new Error(`Inference service returned HTTP ${response.status}`);
      }

      return (await response.json()) as RawCubiCasaSemanticOutput;
    } catch (err) {
      throw new CubiCasaServiceUnavailableError(
        `CubiCasa local recognition service is unavailable at ${this.endpoint}`,
        err,
      );
    }
  }
}

/**
 * Factory creating the default or specified adapter.
 */
export function createCubiCasaAdapter(options?: {
  type?: "mock" | "http";
  endpoint?: string;
  simulateFailure?: boolean;
}): CubiCasaAdapter {
  if (options?.type === "http") {
    return new HttpCubiCasaAdapter({ endpoint: options.endpoint });
  }

  return new MockCubiCasaAdapter({
    simulateFailure: options?.simulateFailure,
  });
}
