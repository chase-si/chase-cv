import { computePlanFitBounds } from "@/lib/floor-plan/geometry";
import type { FloorPlan } from "@/lib/floor-plan/types";

export type MiniToolBridge = {
  writeTempFile: (options: { data: string }) => Promise<{ filePath: string }>;
  saveImageToPhotosAlbum: (options: { filePath: string }) => Promise<unknown>;
};
export function getBridge(): MiniToolBridge | undefined {
  return (window as Window & { xhs?: { miniTool?: MiniToolBridge } }).xhs?.miniTool;
}

export async function createPlanImage(svg: SVGSVGElement, plan: FloorPlan, name: string): Promise<string> {
  const bounds = computePlanFitBounds(plan, 900);
  const clone = svg.cloneNode(true) as SVGSVGElement;
  clone.querySelector("[data-plan-drawing]")!.removeAttribute("transform");
  clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  clone.setAttribute("viewBox", `${bounds.minX} ${bounds.minY} ${bounds.width} ${bounds.height}`);
  clone.setAttribute("width", "1400");
  const imageHeight = Math.round(1400 * bounds.height / bounds.width);
  clone.setAttribute("height", String(imageHeight));
  const theme = getComputedStyle(document.documentElement);
  const originals = [svg, ...svg.querySelectorAll("*")];
  const copies = [clone, ...clone.querySelectorAll("*")];
  for (const [index, node] of copies.entries()) {
    const computed = getComputedStyle(originals[index]);
    // Bake theme overrides into presentation attributes so the standalone
    // rasterized SVG has the same appearance without the page's stylesheet.
    for (const property of ["fill", "stroke", "stroke-width", "fill-opacity", "stroke-opacity", "font-size", "font-family"]) {
      node.setAttribute(property, computed.getPropertyValue(property));
    }
    node.removeAttribute("class");
    for (const attr of [...node.attributes]) {
      if (attr.value.includes("var(")) node.setAttribute(attr.name, attr.value.replace(/var\((--[\w-]+)(?:,[^)]+)?\)/g,
        (_, token: string) => theme.getPropertyValue(token).trim()));
    }
  }
  const image = new Image();
  image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(new XMLSerializer().serializeToString(clone))}`;
  await new Promise<void>((resolve, reject) => { image.onload = () => resolve(); image.onerror = () => reject(new Error("图片生成失败，请重试")); });
  const canvas = document.createElement("canvas");
  canvas.width = 1400; canvas.height = imageHeight + 150;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("当前环境无法生成图片");
  context.fillStyle = theme.getPropertyValue("--background").trim();
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = theme.getPropertyValue("--foreground").trim();
  context.font = "bold 30px sans-serif";
  context.fillText(name, 40, 50);
  context.fillStyle = theme.getPropertyValue("--muted-foreground").trim();
  context.font = "20px sans-serif";
  context.fillText("户型摆放实验室 · 尺寸单位 mm · 仅供布局参考，请以实测为准", 40, 92);
  context.drawImage(image, 0, 130, 1400, imageHeight);
  return canvas.toDataURL("image/png");
}

export async function savePlanImage(data: string): Promise<void> {
  const bridge = getBridge();
  if (!bridge?.writeTempFile || !bridge.saveImageToPhotosAlbum) throw new Error("请在小红书小工具中使用保存到相册");
  const { filePath } = await bridge.writeTempFile({ data });
  await bridge.saveImageToPhotosAlbum({ filePath });
}
