export type ImageToUiSampleImage = {
  id: string;
  imagePath: string;
  title: string;
  description: string;
};

/** Built-in sample images for the Image to UI tool (assets under `public/`). */
export const IMAGE_TO_UI_SAMPLE_IMAGES: readonly ImageToUiSampleImage[] = [
  {
    id: "minimal-dashboard",
    imagePath: "/image-to-ui/samples/minimal-dashboard.png",
    title: "极简仪表盘",
    description: "浅色背景与清晰信息层级，适合提取主辅强调色。",
  },
  {
    id: "dark-product-card",
    imagePath: "/image-to-ui/samples/dark-product-card.png",
    title: "深色产品卡片",
    description: "高对比暗色 UI，便于观察 Vibrant 与 Muted 色板。",
  },
  {
    id: "gradient-landing",
    imagePath: "/image-to-ui/samples/gradient-landing.png",
    title: "渐变落地页",
    description: "大面积渐变与插画，测试多 swatch 提取效果。",
  },
] as const;
