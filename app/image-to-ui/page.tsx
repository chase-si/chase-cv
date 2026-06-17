import type { Metadata } from "next";

import { ImageToUiToolShell } from "@/components/image-to-ui/tool-shell";

export const metadata: Metadata = {
  title: "图片转界面 | Chase's CV",
  description:
    "从图片提取主色调并选择 3 个颜色，为界面渲染做准备的实验工具。",
};

export default function ImageToUiPage() {
  return <ImageToUiToolShell />;
}
