import type { DimensionAnnotation } from "@/lib/floor-plan/geometry";

// Keep architectural labels legible at a phone's fitted scale.
export function PlanDimension({ dimension, scale }: { dimension: DimensionAnnotation; scale: number }) {
  const { start, end, offset, textPoint, label, orientation } = dimension;
  const a = { x: start.x + offset.x, y: start.y + offset.y };
  const b = { x: end.x + offset.x, y: end.y + offset.y };
  const font = Math.max(110, Math.min(350, 10 / scale));
  const width = font * (label.length * 0.65 + 1);
  return <g pointerEvents="none" fill="none" stroke="var(--muted-foreground)" strokeWidth={12}>
    <line x1={start.x} y1={start.y} x2={a.x} y2={a.y} strokeDasharray="25 20" />
    <line x1={end.x} y1={end.y} x2={b.x} y2={b.y} strokeDasharray="25 20" />
    <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} />
    {[a, b].map((point, index) => <line key={index} x1={point.x - 70} y1={point.y - 70} x2={point.x + 70} y2={point.y + 70} />)}
    <g transform={`translate(${textPoint.x},${textPoint.y})${orientation === "vertical" ? " rotate(-90)" : ""}`}>
      <rect x={-width / 2} y={-font * 0.65} width={width} height={font * 1.3} rx={40} fill="var(--card)" stroke="var(--border)" strokeWidth={4} />
      <text y={font * 0.35} textAnchor="middle" fontSize={font} fill="var(--muted-foreground)" stroke="none">{label}</text>
    </g>
  </g>;
}
