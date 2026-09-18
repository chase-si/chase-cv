import { describe, expect, it } from "vitest";
import {
  createCubiCasaAdapter,
  CUBICASA_REPRESENTATIVE_SAMPLES,
  CubiCasaServiceUnavailableError,
  HttpCubiCasaAdapter,
  MockCubiCasaAdapter,
} from "./cubicasa-adapter";

describe("CubiCasa Replaceable Adapter (AC-20, AC-24)", () => {
  it("provides representative validation samples covering standard layouts", () => {
    expect(CUBICASA_REPRESENTATIVE_SAMPLES.length).toBeGreaterThanOrEqual(2);
    const sample1 = CUBICASA_REPRESENTATIVE_SAMPLES[0];
    expect(sample1.id).toBeDefined();
    expect(sample1.name).toBeDefined();
    expect(sample1.semanticOutput.walls.length).toBeGreaterThan(0);
    expect(sample1.semanticOutput.rooms.length).toBeGreaterThan(0);
  });

  it("predicts using MockCubiCasaAdapter successfully for sample input", async () => {
    const adapter = new MockCubiCasaAdapter();
    const result = await adapter.predict("sample-1br", { sampleId: "sample-1br" });

    expect(result.imageId).toBe("sample-1br");
    expect(result.engine).toBe("cubicasa-local-mock");
    expect(result.inferenceMs).toBeGreaterThan(0);
    expect(result.walls.length).toBeGreaterThan(0);
    expect(result.rooms.length).toBeGreaterThan(0);

    const health = await adapter.checkHealth();
    expect(health).toBe(true);
  });

  it("handles mock adapter failure simulation gracefully", async () => {
    const adapter = new MockCubiCasaAdapter({ simulateFailure: true });
    const health = await adapter.checkHealth();
    expect(health).toBe(false);

    await expect(adapter.predict("sample-1br")).rejects.toThrow(
      CubiCasaServiceUnavailableError,
    );
  });

  it("fails safely when HttpCubiCasaAdapter encounters absent service (AC-24)", async () => {
    // Non-existent port
    const adapter = new HttpCubiCasaAdapter({
      endpoint: "http://127.0.0.1:59999/predict",
      timeoutMs: 500,
    });

    const health = await adapter.checkHealth();
    expect(health).toBe(false);

    await expect(adapter.predict("test-blob")).rejects.toThrow(
      CubiCasaServiceUnavailableError,
    );
  });

  it("factory returns mock adapter by default or when configured", () => {
    const adapter = createCubiCasaAdapter();
    expect(adapter.getEngineInfo().engine).toContain("cubicasa");
  });
});
