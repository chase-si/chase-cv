import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";

const root = dirname(fileURLToPath(import.meta.url));
const outDir = root;
const origin = process.env.DEMO_ORIGIN || "http://127.0.0.1:4173";
const rawVideoPath = join(outDir, "recording-raw.webm");

const CAPTION_CSS = `
#xh-caption {
  position: fixed;
  left: 20px;
  right: 64px;
  bottom: 142px;
  z-index: 99999;
  pointer-events: none;
  padding: 9px 12px;
  border-radius: 14px;
  background: rgba(0, 0, 0, 0.76);
  color: #fff;
  font-family: -apple-system, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
  font-size: 18px;
  font-weight: 800;
  line-height: 1.35;
  letter-spacing: 0.01em;
  text-align: center;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.65);
  box-shadow: 0 5px 18px rgba(0, 0, 0, 0.2);
}
#xh-caption:empty { display: none; }
#xh-caption[data-kind="hook"] {
  top: 44px;
  right: 20px;
  bottom: auto;
  padding: 14px 16px;
  border: 2px solid rgba(255, 255, 255, 0.92);
  border-radius: 18px;
  background: linear-gradient(135deg, rgba(126, 34, 206, 0.94), rgba(168, 85, 247, 0.94));
  font-size: 24px;
  line-height: 1.22;
  text-align: left;
  box-shadow: 5px 5px 0 rgba(0, 0, 0, 0.65);
}
#xh-caption[data-kind="top"] {
  top: 96px;
  bottom: auto;
}
#xh-tap {
  position: fixed;
  z-index: 100000;
  width: 34px;
  height: 34px;
  margin: -17px 0 0 -17px;
  border: 3px solid #fff;
  border-radius: 999px;
  background: rgba(168, 85, 247, 0.62);
  box-shadow: 0 0 0 7px rgba(168, 85, 247, 0.22);
  pointer-events: none;
  animation: xh-tap 520ms ease-out forwards;
}
@keyframes xh-tap {
  from { transform: scale(0.55); opacity: 1; }
  to { transform: scale(1.45); opacity: 0; }
}
#btn-reveal-hide,
#operator-bar [data-cmd="TOGGLE_PAUSE"],
#operator-bar [data-cmd="RESTART_SCAN"],
#btn-save-album,
#btn-post-note {
  display: none !important;
}
body.xh-cover #xh-caption,
body.xh-cover .result-back,
body.xh-cover .hud-kicker,
body.xh-cover #result-disclaimer,
body.xh-cover #discovery-progress,
body.xh-cover .result-actions {
  display: none !important;
}
body.xh-cover #view-result {
  justify-content: flex-start;
  gap: 10px;
  padding: 24px 14px 14px;
}
body.xh-cover #view-result h2 {
  max-width: 390px;
  margin: 0 auto;
  white-space: pre-line;
  font-size: 30px;
  line-height: 1.08;
  letter-spacing: -0.03em;
  text-align: center;
}
body.xh-cover #view-result h2::before {
  content: "亲子互动小工具";
  display: block;
  width: max-content;
  margin: 0 auto 8px;
  padding: 5px 11px;
  border: 1px solid #000;
  border-radius: 999px;
  background: #a855f7;
  color: #fff;
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0.04em;
}
body.xh-cover .result-card {
  max-width: 390px;
}
`;

async function setCaption(page, text, kind = "default") {
  await page.evaluate(({ next, nextKind }) => {
    let el = document.getElementById("xh-caption");
    if (!el) {
      el = document.createElement("div");
      el.id = "xh-caption";
      document.body.appendChild(el);
    }
    el.dataset.kind = nextKind;
    el.textContent = next;
  }, { next: text, nextKind: kind });
}

async function tap(page, locator) {
  const box = await locator.boundingBox();
  if (!box) throw new Error("tap target is not visible");
  const point = { x: box.x + box.width / 2, y: box.y + box.height / 2 };
  await page.evaluate(({ x, y }) => {
    document.getElementById("xh-tap")?.remove();
    const marker = document.createElement("div");
    marker.id = "xh-tap";
    marker.style.left = `${x}px`;
    marker.style.top = `${y}px`;
    document.body.appendChild(marker);
    window.setTimeout(() => marker.remove(), 560);
  }, point);
  await locator.click();
}

async function sweepProbe(page, stage, ms) {
  const box = await stage.boundingBox();
  if (!box) throw new Error("scan stage is not visible");
  const started = Date.now();
  const points = [
    [0.16, 0.72], [0.34, 0.35], [0.52, 0.62],
    [0.72, 0.3], [0.84, 0.72], [0.58, 0.48],
  ];
  let i = 0;
  while (Date.now() - started < ms) {
    const [col, row] = points[i % points.length];
    await page.mouse.move(box.x + box.width * col, box.y + box.height * row, { steps: 18 });
    await page.waitForTimeout(420);
    i += 1;
  }
}

await mkdir(outDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 432, height: 768 },
  deviceScaleFactor: 1,
  isMobile: true,
  hasTouch: true,
  locale: "zh-CN",
  recordVideo: {
    dir: outDir,
    size: { width: 432, height: 768 },
  },
});

// Keep the mystery result and all recorded runs deterministic.
await context.addInitScript(() => {
  Math.random = () => 0.35;
  window.localStorage.clear();
});

const page = await context.newPage();
await page.goto(`${origin}/index.html`, { waitUntil: "networkidle" });
await page.addStyleTag({ content: CAPTION_CSS });

// Shorten non-interactive waits for a social-video pace without changing the app.
await page.evaluate(() => {
  window.DuduScanner.AUTO_SCAN_MS = 1200;
  window.DuduScanner.REVEAL_DURATION_MS = 900;
  window.DuduScanner.LOCK_DELAY_MS = 1500;
});

await setCaption(page, "我把屏幕变成了\n肚肚扫描仪", "hook");
await page.waitForTimeout(1500);

await setCaption(page, "不用摄像头，选「神秘扫描」就能玩");
await tap(page, page.locator('[data-mode="mystery"]'));
await page.waitForTimeout(1050);
await tap(page, page.locator("#btn-start-scan"));
await page.locator("#view-scan").waitFor({ state: "visible" });

await setCaption(page, "移动探头，寻找肚肚里的神秘信号", "top");
await page.locator("#scan-status").getByText("移动探头寻找信号").waitFor({ timeout: 5000 });
const stage = page.locator("#fan-stage");
await sweepProbe(page, stage, 3500);

// Trigger the reveal after the visible exploration beat.
await page.keyboard.press(" ");
await page.locator("#scan-status").getByText("锁定后揭晓身份").waitFor({ timeout: 4000 });
await setCaption(page, "信号满了，会扫出什么？", "top");
await page.waitForTimeout(650);
await tap(page, page.locator('[data-cmd="LOCK_SIGNAL"]'));

await page.locator("#view-result").waitFor({ state: "visible", timeout: 5000 });
await setCaption(page, "今天扫到的是——瞌睡虫！");
await page.waitForTimeout(2300);
await setCaption(page, "你觉得下一次会扫到谁？");
await page.waitForTimeout(1500);

// Turn the final result into a clean 3:4 cover frame.
await page.evaluate(() => {
  document.body.classList.add("xh-cover");
  document.querySelector("#view-result h2").textContent = "把屏幕变成\n肚肚扫描仪";
});
await page.waitForTimeout(300);
await page.screenshot({
  path: join(outDir, "cover-raw.png"),
  clip: { x: 0, y: 0, width: 432, height: 576 },
});
await page.waitForTimeout(900);

const video = page.video();
await context.close();
await video.saveAs(rawVideoPath);
await browser.close();

await writeFile(join(outDir, "recording-meta.json"), JSON.stringify({
  viewport: { width: 432, height: 768 },
  output: { width: 1080, height: 1920, fps: 30 },
  target: "sleepy-bug",
  rawVideoPath,
}, null, 2));

console.log(JSON.stringify({ rawVideoPath }));
