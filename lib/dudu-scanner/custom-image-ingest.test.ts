import { describe, expect, it, vi } from "vitest";

import {
  DUDU_SCANNER_CUSTOM_ASSET_MAX_BYTES,
  DUDU_SCANNER_CUSTOM_LIBRARY_MAX,
  ingestCustomImageFiles,
} from "@/lib/dudu-scanner/custom-image-ingest";

function pngFile(name: string, byteLength = 8): File {
  return new File([new Uint8Array(byteLength)], name, { type: "image/png" });
}

describe("custom image ingest", () => {
  it("accepts png jpeg webp and converts heic", async () => {
    const convertHeic = vi.fn(async () => new Blob([new Uint8Array(4)], { type: "image/jpeg" }));
    const result = await ingestCustomImageFiles(
      [
        pngFile("a.png"),
        new File([new Uint8Array(4)], "b.jpg", { type: "image/jpeg" }),
        new File([new Uint8Array(4)], "c.webp", { type: "image/webp" }),
        new File([new Uint8Array(4)], "d.heic", { type: "image/heic" }),
      ],
      0,
      convertHeic,
      () => "asset-1",
    );

    expect(convertHeic).toHaveBeenCalledTimes(1);
    expect(result.accepted).toHaveLength(4);
    expect(result.skipped).toEqual([]);
    expect(result.accepted[3]?.mimeType).toBe("image/jpeg");
  });

  it("skips unsupported types, oversized files, and leftover files past capacity", async () => {
    const convertHeic = vi.fn();
    const oversized = new File(
      [new Uint8Array(DUDU_SCANNER_CUSTOM_ASSET_MAX_BYTES + 1)],
      "big.png",
      { type: "image/png" },
    );
    const result = await ingestCustomImageFiles(
      [
        pngFile("keep-1.png"),
        new File([new Uint8Array(4)], "nope.gif", { type: "image/gif" }),
        oversized,
        pngFile("keep-2.png"),
        pngFile("overflow.png"),
      ],
      DUDU_SCANNER_CUSTOM_LIBRARY_MAX - 2,
      convertHeic,
    );

    expect(result.accepted).toHaveLength(2);
    expect(result.skipped).toEqual([
      { name: "nope.gif", reason: "type" },
      { name: "big.png", reason: "size" },
      { name: "overflow.png", reason: "capacity" },
    ]);
  });
});
