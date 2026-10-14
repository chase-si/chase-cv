import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile, mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { chromium, expect } from "@playwright/test";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const screenshots = await mkdtemp(path.join(tmpdir(), "floor-plan-mini-qa-"));
const csp = "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; connect-src 'none'; frame-src 'none'; object-src 'none'; worker-src 'none'";
const server = createServer(async (request, response) => {
  try {
    const pathname = new URL(request.url, "http://localhost").pathname;
    const file = pathname === "/" ? "index.html" : pathname.slice(1);
    if (!["index.html", "assets/app.js", "assets/style.css"].includes(file)) { response.writeHead(404).end(); return; }
    response.setHeader("Content-Security-Policy", csp);
    response.setHeader("Content-Type", file.endsWith(".js") ? "text/javascript" : file.endsWith(".css") ? "text/css" : "text/html");
    response.end(await readFile(path.join(root, file)));
  } catch { response.writeHead(500).end(); }
});
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const url = `http://127.0.0.1:${server.address().port}/`;
const browser = await chromium.launch({ headless: true, ...(process.env.PLAYWRIGHT_EXECUTABLE_PATH ? { executablePath: process.env.PLAYWRIGHT_EXECUTABLE_PATH } : { channel: "chrome" }) });
const errors = [], external = [], violations = [];
try {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, colorScheme: "light" });
  const page = await context.newPage();
  const screenshot = async (name) => {
    await expect(page.locator('main > [role="status"]')).toHaveCount(0);
    await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    await page.screenshot({ path: path.join(screenshots, name), animations: "disabled" });
  };
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("request", (request) => { if (!request.url().startsWith(url) && !request.url().startsWith("data:")) external.push(request.url()); });
  await page.addInitScript(() => {
    window.__csp = [];
    document.addEventListener("securitypolicyviolation", (e) => window.__csp.push(e.violatedDirective));
    window.__savedImages = [];
    window.xhs = { miniTool: {
      async writeTempFile(options) {
        if (Object.keys(options).join() !== "data" || !options.data.startsWith("data:image/png;base64,")) throw new Error("Invalid writeTempFile payload");
        window.__lastImage = options.data;
        return { filePath: "local-layout.png" };
      },
      async saveImageToPhotosAlbum(options) {
        if (Object.keys(options).join() !== "filePath" || options.filePath !== "local-layout.png") throw new Error("Invalid album payload");
        window.__savedImages.push(options.filePath);
      },
    } };
  });
  await page.goto(url);
  await expect(page.getByRole("heading", { name: "户型摆放实验室" })).toBeVisible();
  await screenshot("mobile.png");
  const initialName = await page.getByRole("button", { name: "选择户型", exact: true }).innerText();
  const initialCount = await page.locator('[data-entity-type="furniture"]').count();
  const firstRoom = page.locator('[data-entity-type="room"]').first();
  const roomPoint = await firstRoom.locator("text").boundingBox();
  await page.touchscreen.tap(roomPoint.x + roomPoint.width / 2, roomPoint.y + roomPoint.height / 2);
  await expect(firstRoom).toHaveAttribute("aria-pressed", "true");

  await page.getByRole("button", { name: "家具", exact: true }).click();
  await page.getByRole("button", { name: "床", exact: true }).click();
  const furnitureCard = page.getByRole("dialog").locator('[data-slot="card"]').filter({ has: page.getByText(/单人床/) }).last();
  await furnitureCard.getByRole("button").first().click();
  await expect(page.locator('[data-entity-type="furniture"]')).toHaveCount(initialCount + 1);
  const placed = page.locator('[data-entity-type="furniture"][data-selected="true"]');
  const placementId = await placed.getAttribute("data-entity-id");
  const originalTransform = await placed.getAttribute("transform");
  await page.getByRole("button", { name: "旋转家具 90 度" }).click();
  await expect(placed).toHaveAttribute("transform", /rotate\(90\)/);
  await page.getByRole("button", { name: "撤销", exact: true }).click();
  await expect(placed).toHaveAttribute("transform", originalTransform);
  await page.getByRole("button", { name: "重做", exact: true }).click();
  await expect(placed).toHaveAttribute("transform", /rotate\(90\)/);

  await page.getByRole("button", { name: "尺寸 / 微调", exact: true }).click();
  const specs = page.getByRole("dialog").getByRole("button").filter({ hasText: /\d+ × \d+ mm/ });
  const position = (await placed.getAttribute("transform")).split(" rotate")[0];
  if (await specs.count() > 1) {
    const beforeSpec = await placed.getAttribute("data-specification-id");
    await specs.nth(1).click();
    assert.notEqual(await placed.getAttribute("data-specification-id"), beforeSpec);
    assert.equal((await placed.getAttribute("transform")).split(" rotate")[0], position);
  }
  await page.getByRole("button", { name: "向右移动 100 mm" }).click();
  assert.notEqual((await placed.getAttribute("transform")).split(" rotate")[0], position);
  await screenshot("properties.png");
  await page.getByRole("button", { name: "关闭面板" }).click();

  // Native touch via CDP exercises Pointer Events and capture, including pinch.
  const cdp = await context.newCDPSession(page);
  const center = await placed.evaluate((element) => {
    const matrix = element.getScreenCTM();
    return { x: matrix.e, y: matrix.f };
  });
  const beforeDrag = await placed.getAttribute("transform");
  await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: center.x, y: center.y, id: 1 }] });
  await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: center.x + 35, y: center.y + 25, id: 1 }] });
  await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  await expect(placed).not.toHaveAttribute("transform", beforeDrag);
  const afterDrag = await placed.getAttribute("transform");
  await page.getByRole("button", { name: "撤销", exact: true }).click();
  await expect(placed).toHaveAttribute("transform", beforeDrag);
  await page.getByRole("button", { name: "重做", exact: true }).click();
  await expect(placed).toHaveAttribute("transform", afterDrag);
  const cancelCenter = await placed.evaluate((element) => ({ x: element.getScreenCTM().e, y: element.getScreenCTM().f }));
  await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ ...cancelCenter, id: 1 }] });
  await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: cancelCenter.x - 25, y: cancelCenter.y, id: 1 }] });
  await cdp.send("Input.dispatchTouchEvent", { type: "touchCancel", touchPoints: [] });
  await expect(placed).toHaveAttribute("transform", afterDrag);
  const canvas = await page.getByRole("group", { name: "户型画布，可拖动家具和双指缩放" }).boundingBox();
  const x = canvas.x + canvas.width / 2, y = canvas.y + canvas.height / 2;
  const beforePinch = await page.locator("[data-plan-drawing]").getAttribute("transform");
  await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: x - 40, y, id: 1 }, { x: x + 40, y, id: 2 }] });
  await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: x - 70, y, id: 1 }, { x: x + 70, y, id: 2 }] });
  await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  await expect(page.locator("[data-plan-drawing]")).not.toHaveAttribute("transform", beforePinch);
  assert.equal(await placed.getAttribute("transform"), afterDrag, "Pinch must not move furniture");
  await page.getByRole("button", { name: "适应画布" }).click();
  await screenshot("placed.png");

  await page.getByRole("button", { name: /^检查/ }).click();
  await expect(page.getByRole("heading", { name: "空间检查", exact: true })).toBeVisible();
  await screenshot("checks.png");
  await page.getByRole("button", { name: "关闭面板" }).click();

  await page.getByRole("button", { name: "出图", exact: true }).click();
  await expect(page.getByRole("img", { name: "当前户型的家具布局图" })).toBeVisible();
  assert.equal(await page.getByRole("img").evaluate((img) => img.naturalWidth), 1400);
  await page.getByRole("button", { name: "保存到相册", exact: true }).click();
  await expect.poll(() => page.evaluate(() => window.__savedImages.length)).toBe(1);
  await screenshot("export.png");
  await page.evaluate(() => { window.xhs.miniTool.saveImageToPhotosAlbum = async () => { throw new Error("相册授权被拒绝"); }; });
  await page.getByRole("button", { name: "保存到相册", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("相册授权被拒绝");
  await expect(page.getByRole("button", { name: "保存到相册", exact: true })).toBeEnabled();
  await page.getByRole("button", { name: "关闭面板" }).click();

  await page.getByRole("button", { name: "选择户型", exact: true }).click();
  await page.getByRole("button", { name: "二室", exact: true }).click();
  const alternative = page.getByRole("dialog").getByRole("button").filter({ hasText: /模型/ }).first();
  await alternative.click();
  assert.notEqual(await page.getByRole("button", { name: "选择户型", exact: true }).innerText(), initialName);
  await page.getByRole("button", { name: "选择户型", exact: true }).click();
  await page.getByRole("button", { name: "全部", exact: true }).click();
  await page.getByRole("textbox", { name: "搜索户型" }).fill("信和自由");
  await page.getByRole("dialog").getByRole("button").filter({ hasText: /信和自由/ }).click();
  const restored = page.locator(`[data-entity-id="${placementId}"]`);
  await expect(restored).toHaveAttribute("transform", afterDrag);
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem("floor-plan-mini-tool-v1")).drafts[JSON.parse(localStorage.getItem("floor-plan-mini-tool-v1")).activePlanId].placements.length)).toBe(initialCount + 1);
  await page.reload();
  await expect(restored).toHaveAttribute("transform", afterDrag);
  await restored.focus(); await page.keyboard.press("Enter");
  await expect(restored).toHaveAttribute("data-selected", "true");
  await page.getByRole("button", { name: "移除家具", exact: true }).click();
  await expect(page.locator('[data-entity-type="furniture"]')).toHaveCount(initialCount);
  await page.getByRole("button", { name: "撤销", exact: true }).click();
  await expect(restored).toBeVisible();
  await page.getByRole("button", { name: "切换深色主题" }).click();
  await expect(page.locator("html")).toHaveClass("dark");
  await screenshot("dark.png");
  await page.getByRole("button", { name: "切换浅色主题" }).click();

  await page.evaluate(() => document.documentElement.style.setProperty("--safe-area-inset-bottom", "34px"));
  assert.equal(await page.locator("main").evaluate((el) => getComputedStyle(el).paddingBottom), "34px");
  await page.evaluate(() => document.documentElement.style.removeProperty("--safe-area-inset-bottom"));

  for (const [width, height] of [[320, 568], [844, 390], [1440, 900]]) {
    await page.setViewportSize({ width, height });
    await expect.poll(() => page.getByRole("group", { name: "户型画布，可拖动家具和双指缩放" }).evaluate((el) => el.clientHeight)).toBeGreaterThan(80);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), true);
    assert.equal(await page.evaluate(() => document.documentElement.scrollHeight <= window.innerHeight + 1), true);
    await screenshot(`${width}x${height}.png`);
  }
  violations.push(...await page.evaluate(() => window.__csp));
  assert.deepEqual(errors, [], "Browser errors");
  assert.deepEqual(external, [], "Unexpected external requests");
  assert.deepEqual(violations, [], "CSP violations");
  await context.close();

  // Actual file:// launch with networking disabled and no native bridge.
  const offline = await browser.newContext({ viewport: { width: 390, height: 844 }, offline: true });
  const local = await offline.newPage();
  local.on("pageerror", (error) => errors.push(error.message));
  await local.goto(pathToFileURL(path.join(root, "index.html")).href);
  await expect(local.getByRole("heading", { name: "户型摆放实验室" })).toBeVisible();
  await local.getByRole("button", { name: "出图", exact: true }).click();
  await expect(local.getByRole("img")).toBeVisible();
  await expect(local.getByRole("button", { name: "保存到相册", exact: true })).toBeDisabled();
  await local.getByRole("button", { name: "关闭面板" }).click();
  await local.evaluate(() => localStorage.setItem("floor-plan-mini-tool-v1", '{"activePlanId":"broken","drafts":{"bad":null}}'));
  await local.reload();
  await expect(local.getByRole("heading", { name: "户型摆放实验室" })).toBeVisible();
  const restricted = await offline.newPage();
  await restricted.addInitScript(() => Object.defineProperty(Storage.prototype, "setItem", { value() { throw new Error("Storage is unavailable"); } }));
  await restricted.goto(pathToFileURL(path.join(root, "index.html")).href);
  await expect(restricted.getByText("保存失败，当前布局仅留在内存", { exact: true })).toBeVisible();
  assert.deepEqual(errors, []);
  console.log(`PASS: CSP, file:// offline, mobile touch / pinch, specifications, history, per-plan storage, PNG / bridge, responsive layouts. Screenshots: ${screenshots}`);
} finally {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}
