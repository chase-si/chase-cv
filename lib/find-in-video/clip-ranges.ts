import type { Segment } from "./analysis-run";
import { CodedError } from "./coded-error";

export type Keyframe = { pts_seconds: number; dts_seconds: number };

export function mergeClipRanges(ranges: Segment[], duration: number): Segment[] {
  if (!Number.isFinite(duration) || duration <= 0) throw new CodedError("exportInvalidTimeline");
  const sorted = ranges.map(({ start_seconds, end_seconds }) => {
    if (!Number.isFinite(start_seconds) || !Number.isFinite(end_seconds) || end_seconds < start_seconds) {
      throw new CodedError("exportInvalidTimeline");
    }
    return {
      start_seconds: Math.max(0, Math.min(duration, start_seconds)),
      end_seconds: Math.max(0, Math.min(duration, end_seconds)),
    };
  }).filter((range) => range.end_seconds > range.start_seconds)
    .sort((a, b) => a.start_seconds - b.start_seconds);
  const merged: Segment[] = [];
  for (const range of sorted) {
    const last = merged.at(-1);
    if (last && range.start_seconds <= last.end_seconds) {
      last.end_seconds = Math.max(last.end_seconds, range.end_seconds);
    } else {
      merged.push({ ...range });
    }
  }
  return merged;
}

export function safetyClipRanges(ranges: Segment[], duration: number) {
  for (const range of ranges) {
    if (!Number.isFinite(range.start_seconds) || !Number.isFinite(range.end_seconds) || range.end_seconds < range.start_seconds) {
      throw new CodedError("exportInvalidTimeline");
    }
  }
  return mergeClipRanges(ranges.map((range) => ({
    start_seconds: range.start_seconds - 1,
    end_seconds: range.end_seconds + 1,
  })), duration);
}

export function expandClipRanges(ranges: Segment[], keyframes: Keyframe[], duration: number) {
  const keys = keyframes.filter((key) =>
    Number.isFinite(key.pts_seconds) && Number.isFinite(key.dts_seconds) &&
    key.pts_seconds >= 0 && key.pts_seconds < duration,
  ).sort((a, b) => a.pts_seconds - b.pts_seconds);
  if (!keys.length) throw new CodedError("exportInvalidTimeline");
  return mergeClipRanges(mergeClipRanges(ranges, duration).map((range) => {
    const start = keys.findLast((key) => key.pts_seconds <= range.start_seconds + 0.000001);
    const end = keys.find((key) => key.pts_seconds >= range.end_seconds - 0.000001);
    return { start_seconds: start?.pts_seconds ?? 0, end_seconds: end?.pts_seconds ?? duration };
  }), duration);
}

export function clipRangeDuration(ranges: Segment[]) {
  return ranges.reduce((total, range) => total + range.end_seconds - range.start_seconds, 0);
}

export function clipDownloadName(sourceName: string, personName: string) {
  const extension = sourceName.match(/\.(mp4|mov|mkv)$/i)?.[1].toLowerCase();
  if (!extension) throw new CodedError("exportUnsupported");
  const safe = (value: string, fallback: string) =>
    value.replace(/[\\/:*?"<>|]/g, "-").replace(/\p{Cc}/gu, "-").trim().slice(0, 100) || fallback;
  return `${safe(sourceName.replace(/\.[^.]+$/, ""), "video")}-${safe(personName, "person")}-clips.${extension}`;
}
