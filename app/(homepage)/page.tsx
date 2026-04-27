import { HomepageHero } from "@/components/homepage/hero";
import { HomepageGraph } from "@/components/homepage/graph";

export default function Page() {
  return (
    <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
      <div>
        <HomepageGraph />
      </div>


      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-14 sm:px-6 sm:py-20">
        <HomepageHero />

        <div className="mt-20 grid gap-16">
          <section id="work" className="scroll-mt-24">
            <h2 className="text-lg font-semibold tracking-tight">作品</h2>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
              用一个力导向图把技能与项目先连起来（demo），后续可以再演进成可交互的作品集导航。
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
