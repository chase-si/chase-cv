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

