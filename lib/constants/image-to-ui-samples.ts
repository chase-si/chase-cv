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
    description: "蓝白浪潮与木版画质感，适合生成清爽、克制、带东方秩序感的产品界面。",
  },
  {
    id: "starry-night",
    imagePath: "/imgs/image-to-ui/starry-night-1280.webp",
    title: "星月夜",
    description: "深蓝夜空与金黄星光，适合生成高对比、沉浸感强的深色界面。",
  },
  {
    id: "impression-sunrise",
    imagePath: "/imgs/image-to-ui/impression-sunrise-1280.webp",
    title: "日出·印象",
    description: "雾蓝与日出橙相互牵引，适合生成柔和、轻盈、有呼吸感的界面主题。",
  },
  {
    id: "water-lilies",
    imagePath: "/imgs/image-to-ui/water-lilies-1280.webp",
    title: "睡莲",
    description: "层叠绿意与水面微光，适合生成安静、自然、低压力的内容界面。",
  },
  {
    id: "school-athens",
    imagePath: "/imgs/image-to-ui/school-athens-1280.webp",
    title: "雅典学院",
    description: "古典建筑与温和大地色，适合生成理性、结构清晰的知识型界面。",
  },
  {
    id: "girl-pearl",
    imagePath: "/imgs/image-to-ui/girl-pearl-1280.webp",
    title: "戴珍珠耳环的少女",
    description: "柔和肤色与深色背景，适合生成精致、聚焦、带轻奢感的界面。",
  },
  {
    id: "almond-blossom",
    imagePath: "/imgs/image-to-ui/almond-blossom-1280.webp",
    title: "盛开的杏花",
    description: "浅蓝天空与粉白花簇，适合生成明亮、轻盈、亲和的界面主题。",
  },
  {
    id: "mont-sainte-victoire",
    imagePath: "/imgs/image-to-ui/mont-sainte-victoire-1280.webp",
    title: "圣维克多山",
    description: "几何化山体与冷暖灰绿，适合生成沉稳、克制、有结构感的后台界面。",
  },
  {
    id: "sunday-grande-jatte",
    imagePath: "/imgs/image-to-ui/sunday-grande-jatte-1280.webp",
    title: "大碗岛的星期天",
    description: "点彩草地与明亮水面，适合生成活泼、清新、节奏明快的界面。",
  },
  {
    id: "harmony-red",
    imagePath: "/imgs/image-to-ui/harmony-red-1280.webp",
    title: "红色和谐",
    description: "饱满红色与装饰图案，适合生成大胆、热烈、品牌感强的界面。",
  },
  {
    id: "calling-saint-matthew",
    imagePath: "/imgs/image-to-ui/calling-saint-matthew-1280.webp",
    title: "基督呼召马太",
    description: "强烈明暗与聚焦高光，适合生成戏剧性、对比鲜明的深色产品界面。",
  },
  {
    id: "gleaners",
    imagePath: "/imgs/image-to-ui/gleaners-1280.webp",
    title: "拾穗者",
    description: "田野暖黄与朴素人物色调，适合生成温暖、踏实、自然的界面。",
  },
  {
    id: "wanderer-fog",
    imagePath: "/imgs/image-to-ui/wanderer-fog-1280.webp",
    title: "雾海之上的旅人",
    description: "冷灰雾海与深色剪影，适合生成极简、沉静、有留白感的界面。",
  },
  {
    id: "gauguin-where",
    imagePath: "/imgs/image-to-ui/gauguin-where-1280.webp",
    title: "我们从何处来",
    description: "热带色块与浓烈对比，适合生成异域、醒目、富有表现力的界面。",
  },
] as const;
