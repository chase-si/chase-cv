# SEO 部署后验收清单

在每次 SEO 相关发布到生产环境后，用本清单验证爬虫、富结果与社交分享信号是否与代码中的索引契约一致。自动化契约测试（`lib/seo/indexed-page-contract.test.ts`、`tests/e2e/site-index-contract.spec.ts`）应在 PR 阶段已通过；以下步骤覆盖 CI 无法代替的真实用户与搜索平台数据。

## 索引与抓取

- [ ] [Google Search Console](https://search.google.com/search-console)（全站资源）已覆盖 `https://dashuaibi.vip` 及主要 locale 前缀。
- [ ] [Bing Webmaster Tools](https://www.bing.com/webmasters) 已通过 Search Console 导入或独立验证。
- [ ] 生产 `https://dashuaibi.vip/sitemap.xml` 仅包含注册表中的可索引 URL，且与页面 `link[rel=canonical]` 一致。
- [ ] 对首页、各工具总览、至少一个 Magic Cursor 效果页分别执行 **URL 检查**，确认「已编入索引」或合理的抓取状态。

## 结构化数据

- [ ] [Google Rich Results Test](https://search.google.com/test/rich-results) 抽检：首页 `ProfilePage`、工具页 `WebApplication`、效果详情 `BreadcrumbList` + `WebApplication`。
- [ ] [Schema Markup Validator](https://validator.schema.org/) 对同一批 URL 复检 JSON-LD 可解析且无警告性虚构字段（评分、评论等）。
- [ ] 可见 H1/说明与 JSON-LD 中的 `name` / `description` 语义一致。

## 社交分享

- [ ] [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) 或等效工具：抽检首页、`/image-to-ui`、`/magic-cursor`、一个效果详情页，确认 `og:image` 为 1200×630 页面专属图。
- [ ] [Twitter Card Validator](https://cards-dev.twitter.com/validator)（或 X 分享预览）：确认 `summary_large_image` 与预期预览图。

## Core Web Vitals（部署后）

目标为字段数据第 75 百分位：**LCP ≤ 2.5s**、**INP ≤ 200ms**、**CLS ≤ 0.1**（移动与桌面分别查看）。常量定义见 `lib/performance/core-web-vitals-budget.ts`。

- [ ] Search Console → **体验 → Core Web Vitals**，分别记录移动/桌面基线截图或数值。
- [ ] 对首页与一个重交互工具页（如 `/image-to-ui` 或 `/magic-cursor`）运行 [PageSpeed Insights](https://pagespeed.web.dev/)，保存移动/桌面报告供 8–12 周对比。
- [ ] 在 `prefers-reduced-motion: reduce` 与移动触摸设备上手动确认：非关键动画停止或简化，主内容与主要操作仍可用。

## 代表性工具流程（冒烟）

- [ ] `/image-to-ui`：上传或选择样例图 → 提取色板 → 进入预览。
- [ ] `/flow`：打开编辑器并添加/编辑节点。
- [ ] `/dudu-scanner`：完成一轮扫描流程。
- [ ] `/magic-cursor` 与一个效果详情页：侧栏调参、演示区交互、落地页内链可点。

## 回归命令（发布前）

```bash
yarn lint
yarn test
yarn build
yarn test:e2e
```
