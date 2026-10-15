// @vitest-environment node

import { createHash, webcrypto } from "node:crypto";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { FaceEngine } from "./face-engine";
import { buffaloModel } from "./model-options";

const mocks = vi.hoisted(() => ({ create: vi.fn(), manifest: vi.fn() }));

vi.mock("onnxruntime-web/webgpu", () => ({
  env: { wasm: {} },
  InferenceSession: { create: mocks.create },
  Tensor: class {},
}));
vi.mock("./model-manifest", () => ({ readModelManifest: mocks.manifest }));

function session() {
  return {
    inputNames: ["input"],
    inputMetadata: [{ name: "input", isTensor: true, type: "float32", shape: [1] }],
    run: vi.fn().mockResolvedValue({}),
    release: vi.fn().mockResolvedValue(undefined),
  };
}

beforeEach(() => {
  vi.useFakeTimers();
  vi.resetAllMocks();
  vi.stubGlobal("crypto", webcrypto);
  vi.stubGlobal("navigator", {
    userAgent: "Mozilla/5.0 Chrome/141.0.0.0",
    platform: "MacIntel",
    maxTouchPoints: 0,
    gpu: { requestAdapter: async () => ({}) },
  });
  const weights = new Uint8Array([1, 2, 3]);
  mocks.manifest.mockResolvedValue({
    variants: {
      buffalo_l: {
        models: Object.fromEntries(buffaloModel.files.map((name) => [name, {
          bytes: weights.length,
          sha256: createHash("sha256").update(weights).digest("hex"),
          parts: [`buffalo_l/${name}.part00`],
        }])),
      },
    },
  });
  vi.stubGlobal("fetch", vi.fn(async () => new Response(weights)));
  vi.spyOn(console, "warn").mockImplementation(() => undefined);
});

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("model runtime initialization", () => {
  it("waits for a slow runtime download without starting an overlapping WASM initialization", async () => {
    let initializing = false;
    mocks.create.mockImplementation(async (_bytes, options) => {
      if (initializing) throw new Error("multiple calls to 'initWasm()' detected.");
      if (mocks.create.mock.calls.length === 1) {
        initializing = true;
        await new Promise((resolve) => setTimeout(resolve, 15_000));
        initializing = false;
      }
      expect(options.executionProviders).toEqual(["webgpu"]);
      return session();
    });
    const status = vi.fn();
    const loaded = FaceEngine.create(status).then(
      (engine) => ({ engine, error: undefined }),
      (error: Error) => ({ engine: undefined, error }),
    );
    await vi.waitFor(() => expect(mocks.create).toHaveBeenCalledTimes(1));
    await vi.advanceTimersByTimeAsync(15_000);
    const result = await loaded;

    expect(result.error).toBeUndefined();
    expect(result.engine?.executionProvider).toBe("webgpu");
    expect(status).not.toHaveBeenCalledWith({ code: "wasmFallback" });
    await result.engine?.dispose();
  });

  it("falls back after a genuine WebGPU failure and reuses downloaded weights", async () => {
    const detector = session();
    mocks.create
      .mockResolvedValueOnce(detector)
      .mockRejectedValueOnce(new Error("Unsupported GPU operation"))
      .mockImplementation(async () => session());
    const status = vi.fn();
    const engine = await FaceEngine.create(status);

    expect(engine.executionProvider).toBe("wasm");
    expect(detector.release).toHaveBeenCalledOnce();
    expect(fetch).toHaveBeenCalledTimes(2);
    expect(status).toHaveBeenCalledWith({ code: "wasmFallback" });
    expect(mocks.create.mock.calls.map(([, options]) => options.executionProviders)).toEqual([
      ["webgpu"], ["webgpu"], ["wasm"], ["wasm"],
    ]);
    await engine.dispose();
  });

  it("retains the timeout for a stalled GPU warmup after runtime initialization", async () => {
    const detector = session();
    detector.run.mockImplementation(() => new Promise(() => {}));
    mocks.create.mockResolvedValueOnce(detector).mockImplementation(async () => session());
    const loaded = FaceEngine.create();
    await vi.waitFor(() => expect(detector.run).toHaveBeenCalledOnce());
    await vi.advanceTimersByTimeAsync(10_001);
    const engine = await loaded;

    expect(engine.executionProvider).toBe("wasm");
    expect(detector.release).toHaveBeenCalledOnce();
    await engine.dispose();
  });
});
