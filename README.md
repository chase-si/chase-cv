## Summary
My personal website to show my skills

## Flow domain imports

Flow **logic** lives under `lib/flow/` (deep imports like `@/lib/flow/demo-runtime-highlight`); `lib/flow/index.ts` re-exports domain APIs only, not React/SVG UI. Presentation token strings for SVG/CSS sit in `lib/flow/svg-presentation.ts`; `components/flow/` binds them to the canvas.

Flow is served at `/flow` and `/zh/flow` under the same `[locale]` routing as image-to-ui; see [CONTEXT.md](./CONTEXT.md).

## Analytics (GA4)

1. 复制 [`.env.example`](.env.example) 为 `.env.local`（若尚无该文件）。
2. 将 `NEXT_PUBLIC_GA_MEASUREMENT_ID` 设为 GA4 后台 **Admin → Data streams → Web** 中的 **Measurement ID**（形如 `G-XXXXXXXXXX`）。
3. 根布局会按需加载 [`@next/third-parties/google`](https://www.npmjs.com/package/@next/third-parties) 的 `GoogleAnalytics`，App Router 下**自动上报 pageview**（含客户端路由切换）。
4. 自定义事件请使用 [`lib/analytics.ts`](lib/analytics.ts) 中的 `trackEvent`（内部为 `sendGAEvent`）；未配置 ID 时不会发送。

## Google AdSense Auto Ads

1. 本地开发时，在 `.env.local` 中设置 `NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT_ID`，值为 AdSense Publisher ID（形如 `ca-pub-1234567890123456`）。未配置时不会加载 AdSense 脚本。
2. 生产部署前，在 GitHub 仓库 **Settings → Secrets and variables → Actions** 中创建同名 Repository secret。该值必须在 `yarn build` 阶段注入，新增或修改 Secret 后需要重新运行部署工作流。
3. 在 AdSense 后台打开 **Ads → Edit → Auto ads**。
4. 关闭 **Intent-driven formats** 和 **In-page formats**；在 **Overlay formats** 中只开启 **Side rail ads**。
5. 展开 Side rail 高级设置，将位置设为 **Right only**。
6. 通过 **Page exclusions** 排除英文首页 `/`、中文首页 `/zh` 和不希望展示广告的其他页面。保留以下工具路由：
   - `/flow`、`/zh/flow`
   - `/image-to-ui`、`/zh/image-to-ui`
   - `/magic-cursor`、`/zh/magic-cursor`，以及其效果详情页
   - `/dudu-scanner`、`/zh/dudu-scanner`

工具工作区带有 Google 官方的 `google-side-rail-overlap="false"` 标记，Side rail 不应覆盖交互区域。Dudu Scanner 进入扫描或结果阶段后也会对沉浸容器应用该标记；浏览器全屏成功时，页面外的 Side rail 不会进入全屏内容。

## Bing SEO

1. 在 [Bing Webmaster Tools](https://www.bing.com/webmasters) 添加 `https://dashuaibi.vip`，选择 **Meta tag** 验证，把 `content` 写入 `NEXT_PUBLIC_BING_SITE_VERIFICATION`（本地 `.env.local`，生产为 GitHub Actions secret）。该值必须在 `yarn build` 阶段注入。
2. 验证通过后提交 `https://dashuaibi.vip/sitemap.xml`。IndexNow key 位于 `/.well-known/indexnow.txt`；合并到 `main` 并完成部署后，工作流会把 sitemap URL 提交给 Bing。

## Tech Stack
- Frontend: NextJS, TailwindCSS, Shadcn
- Backend: Supabase

## E2E Tests (Playwright)

- Install browser once: `npx playwright install chromium`
- **Small cases** (fast, for PR/local): `yarn test:e2e` or `npm run test:e2e` — `playwright.config.ts` ignores `tests/e2e/journeys/` unless `PLAYWRIGHT_INCLUDE_JOURNEYS=1`
- **Smoke journeys** (per-feature happy paths): `yarn test:e2e:journey` or `npm run test:e2e:journey`
- **Full suite**: `yarn test:e2e:all` or `npm run test:e2e:all`
- Headed small cases only: `yarn test:e2e:headed`
- Layout: `tests/e2e/*.spec.ts` (small cases), `tests/e2e/helpers/` (shared steps), `tests/e2e/journeys/` (composed journeys)
- Traces are enabled in Playwright config with `trace: "on-first-retry"`

## Features
- [X] Light/Dark mode
- [ ] En/Chinese
- [ ] Google login
- [X] Google analytics (GA4)
- [X] Deploy by Github CI
- [ ] Pages
  - [ ] Homepage
    - [ ] Design
  - [X] Magic cursor effect
  - [ ] Flow chart
  - [ ] High frequency render Chart
    - [ ] Lighting Chart
    - [ ] EChart
    - [ ] ChartGPU?
  - [ ] Dashboard
    - [ ] SignUp/Login with Supabase
    - [ ] Chart to show GA4 details?
    - [ ] Stripe demo
    - [ ] Email templates?
