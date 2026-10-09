# find-in-video 本地人物合集

扫描接口保持不变。每个人物的 `segments` 先前后延长 1 秒，裁到视频首尾，再合并重叠或相接范围、按时间升序展示。新扫描结果默认全选；人物选择相互独立。更换视频或参考照片、删除人物、重新扫描会移除旧结果。

## 导出与资源

`lib/find-in-video/clip-ranges.ts` 负责纯范围计算；`export-clips.ts` 接收源 `File`、时长、选中范围、取消信号和阶段回调，返回 Blob 及实际范围。全页面同时只运行一个任务；取消会终止 Worker，失败保留选择。

`@ffmpeg/ffmpeg` 0.12.15 和单线程 `@ffmpeg/core` 0.12.10 固定版本。dev/build 在启动时通过 `scripts/copy-ffmpeg-runtime.mjs` 将 JS、Worker 和 WASM 复制到 `public/ffmpeg`。首次点击下载才加载同源运行资源，无全站 COOP/COEP 修改。源文件以 WORKERFS 挂载，不上传，也不将整份源文件复制进 WASM。

FFprobe 获取主视频轨和原音轨。普通单视频轨 H.264/HEVC MP4/MOV 使用现有 MP4 sample table 读取器获取 PTS/DTS 和关键帧，避免遍历大视频的所有压缩包；不支持的索引或 MKV 使用 FFprobe packet 信息。异常 DTS 或跨关键帧的 leading frame 会明确报错，避免输出不能独立解码的片段。

范围向外扩到关键帧后再次合并。裁切时视频终点用下一关键帧的 DTS，音频用完整展示区间；音频 bitstream filter 只丢弃 seek preroll 包。临时片段通过 concat demuxer 拼接，以明确 duration 防止累积音画漂移。全流程使用 `-c copy`，没有视频或音频重编码；保留 MP4/MOV/MKV 容器、主视频轨、全部音轨和方向信息。无后续关键帧时使用视频结束位置。

固定 core 的 FFprobe 在成功时可能返回 `-1`；服务同时检查 JSON 的显式 error、轨道和时间信息，不单独依赖退出码。每次操作有 180 秒超时。成功、失败、取消和卸载均终止 Worker，释放挂载、临时文件和 WASM 内存；成功路径在读取最终文件前先删除中间片段。下载 URL 在点击后 60 秒或页面卸载时释放。

## 验证

```sh
yarn test lib/find-in-video components/find-in-video/person-clips.test.tsx
yarn lint components/find-in-video lib/find-in-video scripts/copy-ffmpeg-runtime.mjs tests/e2e/find-in-video-export.spec.ts
yarn test:e2e tests/e2e/find-in-video-export.spec.ts --workers=1 --retries=0
```

真实导出测试需本机 `ffmpeg` / `ffprobe` 生成和检查样本；导出本身在浏览器 WASM 中完成。测试包含 MP4、MOV、MKV、无音频、多音轨、长 GOP、B 帧、旋转和视频末尾。使用逐帧摘要检查输出内容和顺序，并检查编码、方向、时长和音画起点。UI 只模拟识别 Worker，文件导入、播放器、FFmpeg 和下载都真实执行；覆盖选择、播放、默认值重置、全页面锁定、失败重试、取消、移动端及深色布局。

本次验证：18 个单元测试、12 个 Chrome 浏览器测试（含既有 SEO 回归）及上述 ESLint 通过。`yarn build` 完成生产编译，在仓库既有 `docs/china-representative-floor-plans/standard-floorplans-65.ts:6` 缺少 `StandardFloorPlan` 类型处停止；该文件未由本功能修改。全仓 TypeScript 检查亦存在其他既有错误，未出现 find-in-video 相关错误。

### 大文件记录（2026-10-09，本机 Chromium）

通过 `FIND_IN_VIDEO_LARGE_FIXTURE=/absolute/path/video.mp4` 启用可选大文件测试。样本为实际可播放的 H.264 MP4，1280×720 / 24 fps，59.79 秒，990,202,796 字节。选择两个 1 秒区间，关键帧扩展后合计 4 秒，输出 65,979,159 字节。

连续两次导出分别约 1.104 秒和 1.105 秒（含工具加载）；浏览器进程组 RSS 从约 524 MiB 上升到峰值约 920 MiB，峰值增量约 396 MiB，完成后约 730 MiB。RSS 每 250ms 采样，包含浏览器及其子进程，属于近似观测。该性能测试未加载人脸模型，也未保留源视频播放器缓冲；实际页面内存还会包含模型、播放器和等待释放的下载 Blob。

本机 Chrome 最终执行相同大文件场景，两次约 1.062 秒和 1.122 秒；进程组 RSS 基线约 1216 MiB，峰值约 1631 MiB，完成后约 1324 MiB，峰值增量约 415 MiB。此轮复用了刚执行过多个格式与 UI 场景的浏览器，基线较高；内存结果不应理解为所有设备的固定预算。

桌面 Chromium 和本机 Chrome 已进行真实导出验证。Edge 未单独安装和验收。更大源文件尽力支持；输出及 WASM/Blob 仍受浏览器内存限制。长 GOP 会保留额外内容，页面显示的是安全范围的预计时长，成功反馈显示实际范围时长。遇到不支持的编码、异常时间戳或内存不足会报错，不自动转码。
