export const buffaloModelId = "buffalo_l" as const;

export type ModelId = typeof buffaloModelId;
export type ExecutionProviderName = "webgpu" | "wasm";

export const buffaloModel = {
  id: buffaloModelId,
  files: ["det_10g.onnx", "w600k_r50.onnx"] as const,
  matchThreshold: 0.5,
  licenseUrl:
    "https://github.com/deepinsight/insightface/blob/master/python-package/docs/model_zoo.md",
};
