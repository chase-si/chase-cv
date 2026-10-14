# 户型摆放实验室 · 小红书离线小工具

`index.html` 是离线入口，`assets/` 是运行资源。可上传的包为上级目录的 `floor-plan.zip`。

## 构建与打包

在仓库根目录安装现有依赖后执行：

```sh
sh mini-tools/floor-plan/pack.sh
```

使用仓库已有的 Vite、React、Tailwind 和 UI 组件构建经典 IIFE 脚本；不增加依赖、不修改 Next.js 路由或全局样式。构建时同步站点主题 token，复用 `lib/floor-plan/` 的全部户型、家具规格、几何、空间检查与规则判断。不要直接编辑生成的 `assets/`。

ZIP 仅包含 `index.html`、`assets/app.js` 和 `assets/style.css`。源代码、构建脚本、文档和测试不会进入包内。`verify.mjs` 检查离线相对引用、经典脚本语法、受限 API 和包体积。

## 功能与手机交互

- 搜索 / 筛选原站户型；各户型独立保存本地家具布局。
- 点击房间，按预设规格添加家具，保持只读墙体拓扑。
- 单指拖动家具（50 mm 吸附）、双指缩放；浏览模式单指平移画布。
- 点击尺寸面板切换规格、旋转 90°、按 100 mm 微调；支持移除、撤销、重做和重置。
- 检查家具碰撞、方向净距、门窗与通行空间；展示原领域逻辑生成的说明与调整建议。
- 明暗主题、44 px 触摸目标、底部面板、安全区与软键盘可视高度适配。
- 本地生成 PNG 预览，用户点击后通过 `writeTempFile({ data })` → `saveImageToPhotosAlbum({ filePath })` 保存相册。普通浏览器显示预览，保存按钮不可用。

本地存储不保证永久持久化；清理容器可能清除布局。撤销记录仅保留当前户型本次会话的最近 30 步。户型为简化模型，购买前需核对实测尺寸。

## 验证

```sh
node mini-tools/floor-plan/verify.mjs
node mini-tools/floor-plan/tests/e2e.mjs
```

自动化测试使用 Chromium 的本地文件入口和带容器 CSP 的本地服务，验证手机拖动 / 双指缩放、家具规格 / 撤销、存储恢复、图片生成和模拟 JSBridge。截图输出到临时目录。相册权限弹窗及实际 WebView 手势仍需上传后真机验收。
