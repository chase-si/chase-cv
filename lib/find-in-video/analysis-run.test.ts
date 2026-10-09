import { describe, expect, it } from "vitest";

import { AnalysisRun, mergeHits, similarity } from "./analysis-run";

describe("find-in-video hit merging", () => {
  it("merges hits that are at most two seconds apart", () => {
    expect(mergeHits([1, 3, 8, 9])).toEqual([
      { start_seconds: 1, end_seconds: 3 },
      { start_seconds: 8, end_seconds: 9 },
    ]);
  });

  it("assigns a face to the closest reference above the Buffalo L threshold", () => {
    const matched = new Float32Array([1, 0]);
    const other = new Float32Array([0, 1]);
    const run = new AnalysisRun(
      [
        { id: "a", filename: "a.jpg", name: "A", embedding: matched },
        { id: "b", filename: "b.jpg", name: "B", embedding: other },
      ],
      0.5,
      true,
    );

    expect(similarity(matched, matched)).toBe(1);
    run.add(4, [{ embedding: matched, noseRatio: 0.5 }]);

    const result = run.finish("video");
    expect(result.match_threshold).toBe(0.5);
    expect(result.sample_interval_seconds).toBe(1);
    expect(result.people[0]?.hit_seconds).toEqual([4]);
    expect(result.people[1]?.hit_seconds).toEqual([]);
  });
});
