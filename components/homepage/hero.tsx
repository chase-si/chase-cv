import Link from "next/link";

export function HomepageHero() {
  return (
    <section className="grid items-center gap-10 lg:grid-cols-12">
      <div className="lg:col-span-7">
        <div className="inline-flex items-center gap-2 rounded-full border border-zinc-900/10 bg-white/70 px-3 py-1 text-xs text-zinc-700 shadow-sm dark:border-white/10 dark:bg-black/40 dark:text-zinc-200">
          <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_0_3px_rgba(16,185,129,0.20)]" />
          以「影子」做视觉语言的个人主页
        </div>

        <h1 className="mt-6 text-balance text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
          把
          <span className="relative mx-2 inline-block">
            <span className="absolute -inset-1 -z-10 rounded-2xl bg-linear-to-r from-indigo-500/25 via-fuchsia-500/20 to-sky-500/25 blur-xl" />
            <span className="bg-linear-to-r from-indigo-600 via-fuchsia-600 to-sky-600 bg-clip-text text-transparent">
              shadow
            </span>
          </span>
          变成你的品牌质感
        </h1>

        <p className="mt-6 max-w-xl text-pretty text-base leading-7 text-zinc-600 dark:text-zinc-300 sm:text-lg">
          我是 Chase，专注把产品做得更「顺滑」：更清晰的信息层级、更克制的动效、更舒服的阴影与空间感。
          这里会展示我的项目、经历与思考。
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link
            href="#work"
            className="inline-flex h-11 items-center justify-center rounded-2xl bg-zinc-950 px-5 text-sm font-medium text-white shadow-[0_18px_60px_rgba(0,0,0,0.22)] transition hover:-translate-y-px hover:shadow-[0_22px_70px_rgba(0,0,0,0.28)] dark:bg-white dark:text-black dark:shadow-[0_22px_80px_rgba(0,0,0,0.45)]"
          >
            看看作品
          </Link>
          <Link
            href="#about"
            className="inline-flex h-11 items-center justify-center rounded-2xl border border-zinc-900/10 bg-white/70 px-5 text-sm font-medium text-zinc-900 shadow-sm transition hover:bg-white hover:shadow-md dark:border-white/10 dark:bg-black/40 dark:text-white dark:hover:bg-black/50"
          >
            了解我
          </Link>
          <div className="text-xs text-zinc-500 dark:text-zinc-400 sm:pl-2">
            Next.js · Tailwind · shadcn
          </div>
        </div>
      </div>

      <div className="lg:col-span-5">
        <div className="relative">
          <div
            aria-hidden
            className="absolute -inset-4 -z-10 rounded-[32px] bg-linear-to-b from-white/90 via-white/40 to-white/80 blur-2xl dark:from-black/60 dark:via-black/30 dark:to-black/60"
          />

          <div className="rounded-[28px] border border-zinc-900/10 bg-white/70 p-5 shadow-[0_20px_80px_rgba(0,0,0,0.10)] backdrop-blur-xl dark:border-white/10 dark:bg-black/40 dark:shadow-[0_30px_120px_rgba(0,0,0,0.55)]">
            <div className="grid gap-4">
              <div className="rounded-2xl border border-zinc-900/10 bg-white/80 p-4 shadow-[0_18px_55px_rgba(0,0,0,0.08)] dark:border-white/10 dark:bg-black/40 dark:shadow-[0_22px_70px_rgba(0,0,0,0.50)]">
                <div className="text-xs text-zinc-500 dark:text-zinc-400">
                  现在在做
                </div>
                <div className="mt-1 text-sm font-medium">
                  个人作品集 + Supabase 登录/数据
                </div>
              </div>

              <div className="rounded-2xl border border-zinc-900/10 bg-white/80 p-4 shadow-[0_18px_55px_rgba(0,0,0,0.08)] dark:border-white/10 dark:bg-black/40 dark:shadow-[0_22px_70px_rgba(0,0,0,0.50)]">
                <div className="text-xs text-zinc-500 dark:text-zinc-400">
                  我关注
                </div>
                <div className="mt-1 text-sm font-medium">
                  视觉一致性 · 交互节奏 · 组件化
                </div>
              </div>

              <div className="rounded-2xl border border-zinc-900/10 bg-white/80 p-4 shadow-[0_18px_55px_rgba(0,0,0,0.08)] dark:border-white/10 dark:bg-black/40 dark:shadow-[0_22px_70px_rgba(0,0,0,0.50)]">
                <div className="text-xs text-zinc-500 dark:text-zinc-400">
                  你可以期待
                </div>
                <div className="mt-1 text-sm font-medium">
                  一个更像「产品」的简历首页
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
