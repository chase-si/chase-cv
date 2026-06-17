import { ImageToUiSampleCard } from "@/components/image-to-ui/sample-image-card";
import { ImageToUiStepIndicator } from "@/components/image-to-ui/step-indicator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { IMAGE_TO_UI_SAMPLE_IMAGES } from "@/lib/constants/image-to-ui-samples";

export function ImageToUiToolShell() {
  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 sm:py-10">
        <header className="mb-8 space-y-4">
          <div className="space-y-2">
            <p className="text-sm font-medium text-primary">实验工具</p>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              图片转界面
            </h1>
            <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
              上传或选择示例图片，提取主色调并挑选 3 个颜色，为后续界面渲染步骤做准备。
            </p>
          </div>
          <ImageToUiStepIndicator activeStep={1} />
        </header>

        <div className="grid gap-6 lg:grid-cols-12 lg:gap-8">
          <section className="space-y-6 lg:col-span-5" aria-label="图片来源">
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="text-base">图片来源</CardTitle>
                <CardDescription>
                  从本地上传或使用下方示例图片。完整上传与选色交互将在后续迭代中接入。
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex min-h-[120px] items-center justify-center rounded-2xl border border-dashed border-border bg-muted/40 px-4 py-8 text-center text-sm text-muted-foreground">
                  上传入口（即将接入）
                </div>
              </CardContent>
            </Card>

            <div className="space-y-3">
              <div>
                <h2 className="text-base font-medium text-foreground">示例图片</h2>
                <p className="text-sm text-muted-foreground">
                  点击示例卡片将在后续版本中选中图片；缺失资源会显示「待补充」。
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {IMAGE_TO_UI_SAMPLE_IMAGES.map((sample) => (
                  <ImageToUiSampleCard
                    key={sample.id}
                    id={sample.id}
                    imagePath={sample.imagePath}
                    title={sample.title}
                    description={sample.description}
                  />
                ))}
              </div>
            </div>
          </section>

          <section className="space-y-6 lg:col-span-7" aria-label="预览与色板">
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="text-base">当前图片预览</CardTitle>
                <CardDescription>选中图片后将在此以 contain 方式展示完整画面。</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex aspect-video items-center justify-center rounded-2xl border border-border bg-muted/30 text-sm text-muted-foreground">
                  尚未选择图片
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="text-base">提取色板</CardTitle>
                <CardDescription>
                  自动提取 Vibrant / Muted 等 swatch，并选择 3 个颜色后进入渲染步骤。
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">选择图片后将显示色板与选色控件。</p>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>
    </div>
  );
}
