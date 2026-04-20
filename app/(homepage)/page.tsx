import { HomepageHero } from "@/components/homepage/hero";
import { SiteNav } from "@/components/site-nav";

export default function Page() {
  return (
    <div className="relative flex min-h-svh flex-col overflow-hidden bg-zinc-50 text-zinc-950 dark:bg-black dark:text-zinc-50">
      {/* background */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(1200px_circle_at_15%_10%,rgba(99,102,241,0.20),transparent_45%),radial-gradient(900px_circle_at_80%_20%,rgba(236,72,153,0.18),transparent_48%),radial-gradient(900px_circle_at_40%_90%,rgba(14,165,233,0.14),transparent_55%)] dark:bg-[radial-gradient(1200px_circle_at_15%_10%,rgba(99,102,241,0.25),transparent_45%),radial-gradient(900px_circle_at_80%_20%,rgba(236,72,153,0.22),transparent_48%),radial-gradient(900px_circle_at_40%_90%,rgba(14,165,233,0.18),transparent_55%)]" />
        <div className="absolute inset-0 opacity-[0.55] bg-[linear-gradient(to_right,rgba(0,0,0,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.06)_1px,transparent_1px)] bg-size-[48px_48px] dark:opacity-[0.35] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)]" />
        <div className="absolute inset-0 bg-linear-to-b from-white/50 via-white/20 to-white/70 dark:from-black/30 dark:via-black/10 dark:to-black/40" />
      </div>

      <SiteNav />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-14 sm:px-6 sm:py-20">
        <HomepageHero />

        <div className="mt-20 grid gap-16">
          <section id="work" className="scroll-mt-24">
            <h2 className="text-lg font-semibold tracking-tight">作品</h2>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
              这里先占位，后续我可以把你的项目卡片做成同一套 shadow 体系。
            </p>
          </section>

          <section id="about" className="scroll-mt-24">
            <h2 className="text-lg font-semibold tracking-tight">关于</h2>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
              这里先占位，后续可以补充经历、技能栈、时间线等模块。
            </p>
          </section>

          <section id="contact" className="scroll-mt-24">
            <h2 className="text-lg font-semibold tracking-tight">联系</h2>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
              这里先占位，后续可以放邮箱/微信/表单。
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
