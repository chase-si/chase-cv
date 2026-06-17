<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->


## UI 与样式

编写或修改 UI 时：

- **不要改动** `app/globals.css`，除非用户明确要求新增或调整全局主题 token、字体、配色体系、Tailwind theme 映射。
- **沿用当前目录结构**：路由页面放在 `app/`；站点级组件放在 `components/`；业务域组件按功能放在 `components/<feature>/`；可复用原子组件才放进 `components/ui/`。
- **沿用当前风格栈**：Next.js app router + Tailwind CSS 4 + shadcn/base-luma + `@base-ui/react` + lucide-react。新增 shadcn 组件时遵守 `components.json` 的别名：`@/components`、`@/components/ui`、`@/lib/utils`。
- **优先复用** `components/ui/` 已有组件（如 `Button`、`Input`、`Card`、`Select`、`Slider`、`Toggle`、`ColorPicker`），通过 `variant` / `size` / `className` 组合表达差异，而不是另写一套按钮、输入框或卡片样式。
- **保持品牌视觉一致**：当前 UI 是圆角较大、明确边框、语义色 token、轻拟物阴影和明暗主题并存的风格；新增界面应使用 `bg-background`、`bg-card`、`text-foreground`、`text-muted-foreground`、`border-border`、`bg-primary` 等 token 类名。
- 类名用 Tailwind utility + `cn()` 合并；**不要**写 inline style，除非是第三方交互库或动态坐标/尺寸的必要参数；**不要**新增全局 CSS 文件；**不要**硬编码 hex/rgb 颜色，确有需要时先复用主题 token。
- 客户端交互组件要显式加 `"use client"`；能保持为 Server Component 的页面和静态展示组件不要无故客户端化。
- 图片优先用 `next/image`；站内跳转优先用 `next/link`；图标优先用 `lucide-react`，不要手写 SVG 图标。
