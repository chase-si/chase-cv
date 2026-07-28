export type FanGeometry = {
  cx: number;
  cy: number;
  radius: number;
  sweep: number;
  startAngle: number;
};

export const FAN_SWEEP_RADIANS = (Math.PI * 5) / 6;

export function computeFanGeometry(width: number, height: number): FanGeometry {
  const cx = width * 0.5;
  const cy = height * 0.92;
  const radius = Math.min(width, height) * 0.78;
  const sweep = FAN_SWEEP_RADIANS;
  const startAngle = -Math.PI / 2 - sweep / 2;
  return { cx, cy, radius, sweep, startAngle };
}

export type FanBounds = {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
};

export function computeFanAxisAlignedBounds(fan: FanGeometry): FanBounds {
  const { cx, cy, radius, sweep, startAngle } = fan;
  const endAngle = startAngle + sweep;
  const points = [
    { x: cx, y: cy },
    { x: cx + Math.cos(startAngle) * radius, y: cy + Math.sin(startAngle) * radius },
    { x: cx + Math.cos(endAngle) * radius, y: cy + Math.sin(endAngle) * radius },
    { x: cx, y: cy - radius },
  ];
  let minX = points[0].x;
  let maxX = points[0].x;
  let minY = points[0].y;
  let maxY = points[0].y;
  for (const point of points) {
    minX = Math.min(minX, point.x);
    maxX = Math.max(maxX, point.x);
    minY = Math.min(minY, point.y);
    maxY = Math.max(maxY, point.y);
  }
  return { minX, maxX, minY, maxY };
}

export type NormalizedPoint = { x: number; y: number };

export function placeTargetInSafeRegion(
  seed: number,
  fan: FanGeometry,
  targetRadius: number,
): NormalizedPoint {
  const bounds = computeFanAxisAlignedBounds(fan);
  const safeWidth = (bounds.maxX - bounds.minX) * 0.35;
  const safeHeight = (bounds.maxY - bounds.minY) * 0.35;
  const centerX = (bounds.minX + bounds.maxX) * 0.5;
  const centerY = bounds.minY + (bounds.maxY - bounds.minY) * 0.42;
  const angle = seededUnit(seed, 1) * Math.PI * 2;
  const dist = seededUnit(seed, 2) * 0.45;
  const x = centerX + Math.cos(angle) * safeWidth * dist;
  const y = centerY + Math.sin(angle) * safeHeight * dist;
  return clampTargetInFan({ x, y }, fan, targetRadius);
}

export function clampTargetInFan(
  point: NormalizedPoint,
  fan: FanGeometry,
  targetRadius: number,
): NormalizedPoint {
  let { x, y } = point;
  const dx = x - fan.cx;
  const dy = y - fan.cy;
  const dist = Math.hypot(dx, dy);
  const maxDist = Math.max(fan.radius - targetRadius, targetRadius);
  if (dist > maxDist) {
    const scale = maxDist / dist;
    x = fan.cx + dx * scale;
    y = fan.cy + dy * scale;
  }
  const angle = Math.atan2(dy, dx);
  const minAngle = fan.startAngle + 0.08;
  const maxAngle = fan.startAngle + fan.sweep - 0.08;
  if (angle < minAngle || angle > maxAngle) {
    const clampedAngle = Math.min(Math.max(angle, minAngle), maxAngle);
    x = fan.cx + Math.cos(clampedAngle) * Math.min(dist, maxDist);
    y = fan.cy + Math.sin(clampedAngle) * Math.min(dist, maxDist);
  }
  return { x, y };
}

function seededUnit(seed: number, channel: number): number {
  const value = Math.sin(seed * 12.9898 + channel * 78.233) * 43758.5453;
  return value - Math.floor(value);
}
