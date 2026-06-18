export type ImageToUiSampleImage = {
  id: string;
  imagePath: string;
  title: string;
  description: string;
};

/** Built-in sample images for the Image to UI tool (assets under `public/imgs/image-to-ui/`). */
export const IMAGE_TO_UI_SAMPLE_IMAGES: readonly ImageToUiSampleImage[] = [
  {
    id: "great-wave",
    imagePath: "/imgs/image-to-ui/great-wave-1280.webp",
    title: "神奈川冲浪里",
    description: "蓝白对比与细腻渐变，便于观察白/近白主导色是否进入色板。",
  },
  {
    id: "starry-night",
    imagePath: "/imgs/image-to-ui/starry-night-1280.webp",
    title: "星月夜",
    description: "深蓝夜空与旋涡笔触，测试高对比暗色域提取。",
  },
  {
    id: "impression-sunrise",
    imagePath: "/imgs/image-to-ui/impression-sunrise-1280.webp",
    title: "日出·印象",
    description: "朦胧晨光与橙蓝对比，观察低饱和雾面色与强调色的分离。",
  },
  {
    id: "water-lilies",
    imagePath: "/imgs/image-to-ui/water-lilies-1280.webp",
    title: "睡莲",
    description: "大面积相近色相，测试多 swatch 与柔和过渡。",
  },
  {
    id: "almond-blossom",
    imagePath: "/imgs/image-to-ui/almond-blossom-1280.webp",
    title: "盛开的杏花",
    description: "浅蓝底与粉白花簇，适合提取轻盈明亮的表面色。",
  },
  {
    id: "mont-sainte-victoire",
    imagePath: "/imgs/image-to-ui/mont-sainte-victoire-1280.webp",
    title: "圣维克多山",
    description: "几何化山体与天空色块，测试相近冷暖灰的区分度。",
  },
  {
    id: "sunday-grande-jatte",
    imagePath: "/imgs/image-to-ui/sunday-grande-jatte-1280.webp",
    title: "大碗岛的星期天",
    description: "点彩高饱和草地与水面，观察并列色块下的主色排序。",
  },
  {
    id: "harmony-red",
    imagePath: "/imgs/image-to-ui/harmony-red-1280.webp",
    title: "红色和谐",
    description: "主导红色与装饰图案，观察单一色相下的变化色板。",
  },
  {
    id: "girl-pearl",
    imagePath: "/imgs/image-to-ui/girl-pearl-1280.webp",
    title: "戴珍珠耳环的少女",
    description: "柔和肤色与深色背景，观察明暗层次下的色板分布。",
  },
  {
    id: "birth-venus",
    imagePath: "/imgs/image-to-ui/birth-venus-1280.webp",
    title: "维纳斯的诞生",
    description: "古典暖色与天空冷色并存，适合双色温对比提取。",
  },
  {
    id: "calling-saint-matthew",
    imagePath: "/imgs/image-to-ui/calling-saint-matthew-1280.webp",
    title: "基督呼召马太",
    description: "强明暗对照与局部高光，测试暗场中的动作色提取。",
  },
  {
    id: "school-athens",
    imagePath: "/imgs/image-to-ui/school-athens-1280.webp",
    title: "雅典学院",
    description: "古典壁画层次与大地色调，观察多人物场景下的稳定主色。",
  },
  {
    id: "gleaners",
    imagePath: "/imgs/image-to-ui/gleaners-1280.webp",
    title: "拾穗者",
    description: "田野暖黄与人物剪影，适合低饱和自然色板。",
  },
  {
    id: "wanderer-fog",
    imagePath: "/imgs/image-to-ui/wanderer-fog-1280.webp",
    title: "雾海之上的旅人",
    description: "冷灰雾海与深色人物，测试极简配色下的三色选取。",
  },
  {
    id: "gauguin-where",
    imagePath: "/imgs/image-to-ui/gauguin-where-1280.webp",
    title: "我们从何处来",
    description: "热带高饱和色块，测试丰富配色下的 swatch 选取。",
  },
] as const;
