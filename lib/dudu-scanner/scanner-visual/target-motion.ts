import { clampTargetInFan, type FanGeometry, type NormalizedPoint } from "@/lib/dudu-scanner/scanner-visual/geometry";

export type TargetMotionState = {
  position: NormalizedPoint;
  clarityBoost: number;
};

export function advanceTargetMotion(
  state: TargetMotionState,
  fan: FanGeometry,
  targetRadius: number,
  elapsedSeconds: number,
  seed: number,
  driftSpeed: number,
): TargetMotionState {
  const driftAngle = elapsedSeconds * 0.22 * driftSpeed + seed * 0.7;
  const driftRadius = 6 + Math.sin(elapsedSeconds * 0.31 * driftSpeed + seed) * 4;
  const base = state.position;
  const next = clampTargetInFan(
    {
      x: base.x + Math.cos(driftAngle) * driftRadius * 0.016 * driftSpeed,
      y: base.y + Math.sin(driftAngle * 0.9) * driftRadius * 0.012 * driftSpeed,
    },
    fan,
    targetRadius,
  );
  return {
    position: next,
    clarityBoost: Math.max(0, state.clarityBoost * 0.92),
  };
}

export function scanLineCrossBoost(
  beamAngle: number,
  target: NormalizedPoint,
  fan: FanGeometry,
): number {
  const targetAngle = Math.atan2(target.y - fan.cy, target.x - fan.cx);
  const delta = Math.abs(Math.atan2(Math.sin(beamAngle - targetAngle), Math.cos(beamAngle - targetAngle)));
  if (delta > 0.12) {
    return 0;
  }
  return 1 - delta / 0.12;
}

export function applyScanLineClarity(
  state: TargetMotionState,
  boost: number,
): TargetMotionState {
  return {
    ...state,
    clarityBoost: Math.min(1, Math.max(state.clarityBoost, boost)),
  };
}
