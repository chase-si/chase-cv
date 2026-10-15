import { computePlanFitBounds } from "./geometry";
import type { FloorPlan } from "./types";

export interface FloorPlanImage { data: string; width: number; height: number }

export async function renderFloorPlanImage(svg: SVGSVGElement, plan: FloorPlan, title: string, locale?: string): Promise<FloorPlanImage> {
  const bounds = computePlanFitBounds(plan, 900);
  const copy = svg.cloneNode(true) as SVGSVGElement;
  copy.querySelector('[data-testid="floor-plan-world"]')?.removeAttribute("transform");
  copy.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  copy.setAttribute("viewBox", `${bounds.minX} ${bounds.minY} ${bounds.width} ${bounds.height}`);
  const width = 1400, drawingHeight = Math.round(width * bounds.height / bounds.width);
  copy.setAttribute("width", String(width)); copy.setAttribute("height", String(drawingHeight));
  const originals = [svg, ...svg.querySelectorAll("*")];
  [copy, ...copy.querySelectorAll("*")].forEach((element, index) => {
    const computed = getComputedStyle(originals[index]);
    for (const attribute of ["fill", "stroke", "stroke-width", "fill-opacity", "stroke-opacity", "font-size", "font-family"]) {
      element.setAttribute(attribute, computed.getPropertyValue(attribute));
    }
    element.removeAttribute("class");
  });
  const image = new Image();
  await new Promise<void>((resolve, reject) => {
    image.onload = () => resolve(); image.onerror = () => reject(new Error("Unable to render floor plan image"));
    image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(new XMLSerializer().serializeToString(copy))}`;
  });
  const canvas = document.createElement("canvas");
  canvas.width = width; canvas.height = drawingHeight + 130;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas is unavailable");
  const theme = getComputedStyle(document.documentElement);
  context.fillStyle = theme.getPropertyValue("--background").trim(); context.fillRect(0, 0, width, canvas.height);
  context.fillStyle = theme.getPropertyValue("--foreground").trim(); context.font = "bold 30px sans-serif";
  context.fillText(title, 40, 50, width - 80);
  context.fillStyle = theme.getPropertyValue("--muted-foreground").trim(); context.font = "20px sans-serif";
  context.fillText(locale === "zh" ? "户型摆放实验室 · 尺寸单位 mm · 仅供布局参考，请以实测为准" : "Floor Plan Lab · Dimensions in mm · Verify measurements before purchasing", 40, 90);
  context.drawImage(image, 0, 130, width, drawingHeight);
  return { data: canvas.toDataURL("image/png"), width, height: canvas.height };
}
