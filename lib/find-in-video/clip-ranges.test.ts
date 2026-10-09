import { describe, expect, it } from "vitest";

import { clipDownloadName, clipRangeDuration, expandClipRanges, mergeClipRanges, safetyClipRanges } from "./clip-ranges";

const range = (start_seconds: number, end_seconds = start_seconds) => ({ start_seconds, end_seconds });

describe("safe selected clip ranges", () => {
  it("pads isolated hits and clamps to both ends, including a subsecond video", () => {
    expect(safetyClipRanges([range(0), range(5), range(9)], 10)).toEqual([range(0, 1), range(4, 6), range(8, 10)]);
    expect(safetyClipRanges([range(0)], 0.4)).toEqual([range(0, 0.4)]);
  });

  it("sorts and unions overlapping or touching ranges without mutating scan results", () => {
    const input = [range(10, 12), range(1, 3), range(5), range(2)];
    const original = structuredClone(input);
    expect(safetyClipRanges(input, 20)).toEqual([range(0, 6), range(9, 13)]);
    expect(input).toEqual(original);
  });

  it("supports no hits and rejects invalid times rather than exporting wrong content", () => {
    expect(safetyClipRanges([], 12)).toEqual([]);
    expect(mergeClipRanges([range(13, 14)], 12)).toEqual([]);
    expect(() => safetyClipRanges([range(5, 4)], 12)).toThrow("exportInvalidTimeline");
    expect(() => mergeClipRanges([range(NaN, 3)], 12)).toThrow("exportInvalidTimeline");
    expect(() => mergeClipRanges([], Infinity)).toThrow("exportInvalidTimeline");
  });

  it("expands outwards and unions clips that now share a GOP", () => {
    const keys = [0, 4, 8, 12].map((pts_seconds) => ({ pts_seconds, dts_seconds: pts_seconds - 0.08 }));
    expect(expandClipRanges([range(1, 2), range(5, 6), range(13, 14)], keys, 15)).toEqual([range(0, 8), range(12, 15)]);
    expect(expandClipRanges([range(4, 8)], keys, 15)).toEqual([range(4, 8)]);
    expect(() => expandClipRanges([range(1, 2)], [], 15)).toThrow("exportInvalidTimeline");
    expect(clipRangeDuration([range(0, 8), range(12, 15)])).toBe(11);
  });

  it("retains container and safely names files", () => {
    expect(clipDownloadName("source.MOV", "A/B")).toBe("source-A-B-clips.mov");
    expect(clipDownloadName("video.mp4", "")).toBe("video-person-clips.mp4");
    expect(() => clipDownloadName("video.webm", "A")).toThrow("exportUnsupported");
  });
});
