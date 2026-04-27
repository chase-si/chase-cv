## Summary
My personal website to show my skills

## Analytics (GA4)

1. 复制 [`.env.example`](.env.example) 为 `.env.local`（若尚无该文件）。
2. 将 `NEXT_PUBLIC_GA_MEASUREMENT_ID` 设为 GA4 后台 **Admin → Data streams → Web** 中的 **Measurement ID**（形如 `G-XXXXXXXXXX`）。
3. 根布局会按需加载 [`@next/third-parties/google`](https://www.npmjs.com/package/@next/third-parties) 的 `GoogleAnalytics`，App Router 下**自动上报 pageview**（含客户端路由切换）。
4. 自定义事件请使用 [`lib/analytics.ts`](lib/analytics.ts) 中的 `trackEvent`（内部为 `sendGAEvent`）；未配置 ID 时不会发送。

## Tech Stack
- Frontend: NextJS, TailwindCSS, Shadcn
- Backend: Supabase

## Features
- [X] Light/Dark mode
- [ ] En/Chinese
- [ ] Google login
- [X] Google analytics (GA4)
- [X] Deploy by Github CI
- [ ] Pages
  - [ ] Homepage
    - [ ] Design
    - [ ] Add Graph for Skills
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


- Chase
  - Skills
    - Frontend
      - React
      - Vue
    - Backend
    - Mobile
  - Project
    - Aladia
    - CV website