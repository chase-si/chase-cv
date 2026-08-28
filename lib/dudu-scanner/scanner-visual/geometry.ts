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
  const sweep = FAN_SWEEP_RADIANS;
  const insetX = 2;
  const insetY = Math.min(width, height) * 0.04;
  const radiusFromBox = Math.min(width, height) * 0.78;
  const radiusFromWidth = Math.max(0, (cx - insetX) / Math.sin(sweep / 2));
  const radiusFromHeight = Math.max(0, cy - insetY);
  const radius = Math.min(radiusFromBox, radiusFromWidth, radiusFromHeight);
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

export function isPointInFan(point: NormalizedPoint, fan: FanGeometry): boolean {
  const dx = point.x - fan.cx;
  const dy = point.y - fan.cy;
  const distance = Math.hypot(dx, dy);
  if (distance > fan.radius) {
    return false;
  }

  const angle = Math.atan2(dy, dx);
  return angle >= fan.startAngle && angle <= fan.startAngle + fan.sweep;
}

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

export type RectScanField = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type ScanField =
  | ({ kind: "fan" } & FanGeometry)
  | ({ kind: "rect" } & RectScanField);

export function computeRectScanField(width: number, height: number): RectScanField {
  const inset = 0;
  return {
    x: inset,
    y: inset,
    width: Math.max(0, width - inset * 2),
    height: Math.max(0, height - inset * 2),
  };
}

export function computeScanField(
  width: number,
  height: number,
  shape: "fan" | "rect" = "fan",
): ScanField {
  if (shape === "rect") {
    return { kind: "rect", ...computeRectScanField(width, height) };
  }
  return { kind: "fan", ...computeFanGeometry(width, height) };
}

export function isPointInScanField(point: NormalizedPoint, field: ScanField): boolean {
  if (field.kind === "rect") {
    return (
      point.x >= field.x &&
      point.x <= field.x + field.width &&
      point.y >= field.y &&
      point.y <= field.y + field.height
    );
  }
  return isPointInFan(point, field);
}

export function placeTargetInScanField(
  seed: number,
  field: ScanField,
  targetRadius: number,
): NormalizedPoint {
  if (field.kind === "fan") {
    return placeTargetInSafeRegion(seed, field, targetRadius);
  }
  const inset = targetRadius + 8;
  const innerWidth = Math.max(1, field.width - inset * 2);
  const innerHeight = Math.max(1, field.height - inset * 2);
  return clampTargetInScanField(
    {
      x: field.x + inset + innerWidth * (0.18 + seededUnit(seed, 1) * 0.64),
      y: field.y + inset + innerHeight * (0.18 + seededUnit(seed, 2) * 0.64),
    },
    field,
    targetRadius,
  );
}

export function clampTargetInScanField(
  point: NormalizedPoint,
  field: ScanField,
  targetRadius: number,
): NormalizedPoint {
  if (field.kind === "fan") {
    return clampTargetInFan(point, field, targetRadius);
  }
  const insetX = Math.min(targetRadius, field.width / 2);
  const insetY = Math.min(targetRadius, field.height / 2);
  return {
    x: Math.min(field.x + field.width - insetX, Math.max(field.x + insetX, point.x)),
    y: Math.min(field.y + field.height - insetY, Math.max(field.y + insetY, point.y)),
  };
}

export function scanFieldContainsTargetDisc(
  field: ScanField,
  point: NormalizedPoint,
  targetRadius: number,
): boolean {
  if (field.kind === "rect") {
    return (
      point.x - targetRadius >= field.x - 0.01 &&
      point.x + targetRadius <= field.x + field.width + 0.01 &&
      point.y - targetRadius >= field.y - 0.01 &&
      point.y + targetRadius <= field.y + field.height + 0.01
    );
  }
  const dist = Math.hypot(point.x - field.cx, point.y - field.cy);
  return dist + targetRadius <= field.radius + 0.01 && isPointInFan(point, field);
}

export function scanFieldAnchor(field: ScanField): NormalizedPoint {
  if (field.kind === "fan") {
    return { x: field.cx, y: field.cy - field.radius * 0.48 };
  }
  return { x: field.x + field.width * 0.5, y: field.y + field.height * 0.42 };
}

function seededUnit(seed: number, channel: number): number {
  const value = Math.sin(seed * 12.9898 + channel * 78.233) * 43758.5453;
  return value - Math.floor(value);
}
