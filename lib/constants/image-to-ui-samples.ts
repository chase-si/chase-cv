export type ImageToUiSampleImage = {
  id: string;
  imagePath: string;
  title: string;
  description: string;
};

/** Built-in sample images for the Image to UI tool (assets under `public/imgs/image-to-ui/`). */
export const IMAGE_TO_UI_SAMPLE_IMAGES: readonly ImageToUiSampleImage[] = [
  {
    id: "mondrian",
    imagePath: "/imgs/image-to-ui/mondrian-1280.webp",
    title: "蒙德里安构成",
    description: "高饱和原色与留白，适合提取清晰的主辅强调色。",
  },
  {
    id: "great-wave",
    imagePath: "/imgs/image-to-ui/great-wave-1280.webp",
    title: "神奈川冲浪里",
    description: "蓝白对比与细腻渐变，便于观察 Vibrant 与 Muted 色板。",
  },
  {
    id: "starry-night",
    imagePath: "/imgs/image-to-ui/starry-night-1280.webp",
    title: "星月夜",
    description: "深蓝夜空与旋涡笔触，测试高对比暗色域提取。",
  },
  {
    id: "girl-pearl",
    imagePath: "/imgs/image-to-ui/girl-pearl-1280.webp",
    title: "戴珍珠耳环的少女",
    description: "柔和肤色与深色背景，观察明暗层次下的色板分布。",
  },
  {
    id: "water-lilies",
    imagePath: "/imgs/image-to-ui/water-lilies-1280.webp",
    title: "睡莲",
    description: "大面积相近色相，测试多 swatch 与柔和过渡。",
  },
  {
    id: "birth-venus",
    imagePath: "/imgs/image-to-ui/birth-venus-1280.webp",
    title: "维纳斯的诞生",
    description: "古典暖色与天空冷色并存，适合双色温对比提取。",
  },
  {
    id: "harmony-red",
    imagePath: "/imgs/image-to-ui/harmony-red-1280.webp",
    title: "红色和谐",
    description: "主导红色与装饰图案，观察单一色相下的变化色板。",
  },
  {
    id: "gauguin-where",
    imagePath: "/imgs/image-to-ui/gauguin-where-1280.webp",
    title: "我们从何处来",
    description: "热带高饱和色块，测试丰富配色下的 swatch 选取。",
  },
] as const;
