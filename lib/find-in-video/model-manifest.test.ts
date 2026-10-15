import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { afterEach, expect, it, vi } from "vitest";

import { readModelManifest } from "./model-manifest";

afterEach(() => vi.unstubAllGlobals());

it("keeps the same-origin manifest available when model parts are hosted on a CDN", async () => {
  const fetchAsset = vi.fn(async (path: string) => {
    try {
      const file = resolve(process.cwd(), "public", path.replace(/^\//, ""));
      return new Response(await readFile(file, "utf8"));
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
      return new Response(null, { status: 404 });
    }
  });
  vi.stubGlobal("fetch", fetchAsset);

  const manifest = await readModelManifest();

  expect(fetchAsset).toHaveBeenCalledWith("/models/manifest.json", { cache: "no-cache" });
  expect(Object.keys(manifest.variants.buffalo_l.models)).toEqual([
    "det_10g.onnx",
    "w600k_r50.onnx",
  ]);
});
