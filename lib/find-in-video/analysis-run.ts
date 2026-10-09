export type Segment = { start_seconds: number; end_seconds: number }
export type PersonResult = { id: string; filename: string; name: string; hit_seconds: number[]; segments: Segment[] }
export type AnalysisResult = {
  video_id: string; sample_interval_seconds: number; match_threshold: number
  sampled_frames: number; people: PersonResult[]
}
export type AnalysisProgress = {
  duration: number; processed_seconds: number; progress_percent: number; sampled_frames: number
  people: { id: string; name: string; segment_count: number }[]
}
export type ReferenceEmbedding = { id: string; filename: string; name: string; embedding: Float32Array }
export type ObservedFace = { embedding: Float32Array; noseRatio: number | null }

export function similarity(a: Float32Array, b: Float32Array) {
  let total = 0
  for (let i = 0; i < a.length; i++) total += a[i] * b[i]
  return total
}

export function mergeHits(hits: number[]): Segment[] {
  const segments: Segment[] = []
  for (const second of [...new Set(hits)].sort((a, b) => a - b)) {
    const last = segments.at(-1)
    if (last && second - last.end_seconds <= 2) last.end_seconds = second
    else segments.push({ start_seconds: second, end_seconds: second })
  }
  return segments
}

export function throttleProgress(emit: (progress: AnalysisProgress) => void) {
  let last = 0
  return (progress: AnalysisProgress, force = false) => {
    const now = performance.now()
    if (!force && now - last < 250) return
    last = now
    emit(progress)
  }
}

export class AnalysisRun {
  private readonly hits = new Map<string, Set<number>>()
  private readonly weak = new Map<string, { second: number; embedding: Float32Array }[]>()
  sampledFrames = 0

  constructor(
    private readonly references: ReferenceEmbedding[],
    private readonly threshold: number,
    private readonly weakRecovery: boolean,
  ) {
    for (const reference of references) {
      this.hits.set(reference.id, new Set())
      this.weak.set(reference.id, [])
    }
  }

  add(second: number, faces: ObservedFace[]) {
    for (const face of faces) {
      let best: ReferenceEmbedding | null = null, score = -Infinity
      for (const reference of this.references) {
        const current = similarity(face.embedding, reference.embedding)
        if (current > score) { best = reference; score = current }
      }
      if (!best) continue
      if (score > this.threshold) this.hits.get(best.id)!.add(second)
      else if (this.weakRecovery && score > .25 && face.noseRatio !== null && face.noseRatio > .8)
        this.weak.get(best.id)!.push({ second, embedding: face.embedding })
    }
    this.sampledFrames++
  }

  progress(duration: number, processedSeconds: number): AnalysisProgress {
    return {
      duration, processed_seconds: Math.min(duration, processedSeconds),
      progress_percent: Math.min(100, processedSeconds / duration * 100), sampled_frames: this.sampledFrames,
      people: this.references.map(reference => ({ id: reference.id, name: reference.name,
        segment_count: mergeHits([...this.hits.get(reference.id)!]).length })),
    }
  }

  finish(videoId: string): AnalysisResult {
    for (const reference of this.weakRecovery ? this.references : []) {
      const strong = this.hits.get(reference.id)!
      if (!strong.size) continue
      const candidates = this.weak.get(reference.id)!
      for (let i = 0; i < candidates.length; i++) for (let j = i + 1; j < candidates.length; j++) {
        if (Math.abs(candidates[i].second - candidates[j].second) >= 3 &&
            similarity(candidates[i].embedding, candidates[j].embedding) > .55) {
          strong.add(candidates[i].second)
          strong.add(candidates[j].second)
        }
      }
    }
    return {
      video_id: videoId, sample_interval_seconds: 1, match_threshold: this.threshold, sampled_frames: this.sampledFrames,
      people: this.references.map(reference => {
        const hit_seconds = [...this.hits.get(reference.id)!].sort((a, b) => a - b)
        return { id: reference.id, filename: reference.filename, name: reference.name,
          hit_seconds, segments: mergeHits(hit_seconds) }
      }),
    }
  }
}
