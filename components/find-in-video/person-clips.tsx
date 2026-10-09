"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import type { PersonResult, Segment } from "@/lib/find-in-video/analysis-run";
import { clipRangeDuration, safetyClipRanges } from "@/lib/find-in-video/clip-ranges";
import { cn } from "@/lib/utils";

type PersonClipsProps = {
  person: PersonResult;
  duration: number;
  disabled: boolean;
  playerReady: boolean;
  onSeek: (range: Segment) => void;
  onExport: (ranges: Segment[]) => void;
  feedback?: React.ReactNode;
};

function timestamp(seconds: number) {
  const milliseconds = Math.round(seconds * 1000);
  const whole = Math.floor(milliseconds / 1000);
  const hours = Math.floor(whole / 3600);
  const minutes = String(Math.floor(whole / 60) % 60).padStart(2, "0");
  const secs = String(whole % 60).padStart(2, "0");
  const fraction = milliseconds % 1000 ? `.${String(milliseconds % 1000).padStart(3, "0")}` : "";
  return `${hours ? `${hours}:` : ""}${minutes}:${secs}${fraction}`;
}

// The parent keys this component by analysis run, so new results default to all.
export function PersonClips({ person, duration, disabled, playerReady, onSeek, onExport, feedback }: PersonClipsProps) {
  const t = useTranslations("findInVideo");
  const ranges = useMemo(() => safetyClipRanges(person.segments, duration), [person.segments, duration]);
  const [selected, setSelected] = useState(() => new Set(ranges.map((_, index) => index)));
  const chosen = ranges.filter((_, index) => selected.has(index));

  return (
    <Card className="gap-3 py-3" aria-label={t("personClips", { name: person.name })}>
      <CardContent className="space-y-3 px-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="truncate text-base font-medium">{person.name}</h2>
            <p className="truncate text-xs text-muted-foreground">{person.filename}</p>
          </div>
          <Badge variant="outline">{t("hits", { count: person.hit_seconds.length })}</Badge>
        </div>
        {ranges.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t("notFound")}</p>
        ) : (
          <>
            <ul className="flex flex-wrap gap-2" aria-label={t("clipSelection", { name: person.name })}>
              {ranges.map((range, index) => (
                <li
                  key={`${range.start_seconds}-${range.end_seconds}`}
                  className={cn("flex items-center gap-1 rounded-xl border p-1.5",
                    selected.has(index) ? "border-primary/40 bg-primary/5" : "border-border")}
                >
                  <Checkbox
                    className="mx-1 shrink-0"
                    checked={selected.has(index)}
                    disabled={disabled}
                    aria-label={t("selectClip", { name: person.name, start: timestamp(range.start_seconds), end: timestamp(range.end_seconds) })}
                    onCheckedChange={(checked) => setSelected((previous) => {
                      const next = new Set(previous);
                      if (checked) next.add(index);
                      else next.delete(index);
                      return next;
                    })}
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    className="tabular-nums"
                    disabled={!playerReady}
                    onClick={() => onSeek(range)}
                    aria-label={t("playClip", { start: timestamp(range.start_seconds), end: timestamp(range.end_seconds) })}
                  >
                    {timestamp(range.start_seconds)} – {timestamp(range.end_seconds)}
                  </Button>
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap items-center gap-2">
              <Button type="button" size="sm" variant="outline" disabled={disabled || selected.size === ranges.length}
                onClick={() => setSelected(new Set(ranges.map((_, index) => index)))}>
                {t("selectAllClips")}
              </Button>
              <Button type="button" size="sm" variant="outline" disabled={disabled || selected.size === 0}
                onClick={() => setSelected(new Set())}>
                {t("clearClips")}
              </Button>
              <Button type="button" size="sm" disabled={disabled || chosen.length === 0}
                onClick={() => onExport(chosen)}>
                {t("downloadClips")}
              </Button>
              <p className="text-xs text-muted-foreground tabular-nums">
                {t("selectedClips", { count: chosen.length, seconds: clipRangeDuration(chosen).toFixed(1) })}
              </p>
            </div>
            <p className="text-xs text-muted-foreground">{t("clipSafetyHint")}</p>
          </>
        )}
        {feedback}
      </CardContent>
    </Card>
  );
}
