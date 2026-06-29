function inflateShadowLayer(layer: string, scale: number): string {
  const parts = layer.trim().split(/\s+/);
  if (parts.length < 4) {
    return layer;
  }

  const x = Number.parseFloat(parts[0]);
  const y = Number.parseFloat(parts[1]);
  if (!Number.isFinite(x) || !Number.isFinite(y)) {
    return layer;
  }

  parts[0] = `${x * scale}px`;
  parts[1] = `${y * scale}px`;
  return parts.join(" ");
}

export function readElementBoxShadow(element: HTMLElement): string | null {
  const shadow = getComputedStyle(element).boxShadow;
  if (!shadow || shadow === "none") {
    return null;
  }
  return shadow;
}

export function exaggeratedBoxShadow(shadow: string, scale = 2): string {
  return shadow
    .split(/,(?![^(]*\))/)
    .map((layer) => inflateShadowLayer(layer, scale))
    .join(", ");
}
