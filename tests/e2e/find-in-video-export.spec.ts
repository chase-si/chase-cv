import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import ts from "typescript";
import { expect, test, type Page } from "@playwright/test";
import type { WorkerRequest, WorkerResponse } from "@/lib/find-in-video/face-protocol";

let directory: string;
const samples = ["source.mp4", "source.mov", "source.mkv", "silent.mp4", "multi-audio.mp4", "rotated.mp4", "long-gop.mp4"];
const ffmpeg = (args: string[]) => execFileSync("ffmpeg", ["-v", "error", "-y", ...args], { timeout: 120_000 });
function probe(path: string) {
  return JSON.parse(execFileSync("ffprobe", ["-v", "error", "-show_streams", "-show_format", "-of", "json", path], { encoding: "utf8" }));
}
function hashes(path: string) {
  return execFileSync("ffmpeg", ["-v", "error", "-i", path, "-map", "0:v:0", "-an", "-fps_mode", "passthrough", "-f", "framemd5", "-"], {
    encoding: "utf8", maxBuffer: 16 * 1024 * 1024,
  }).split("\n").filter((line) => line && !line.startsWith("#")).map((line) => line.split(",").at(-1)!.trim());
}

// Exercise the actual service in a browser without adding a production test route.
async function mountService(page: Page) {
  const modules = new Set(["export-clips", "clip-ranges", "coded-error", "ffmpeg-runtime", "mp4-track"]);
  await page.route(/\/__clip-test\/[a-z0-9-]+\.js$/, async (route) => {
    const name = new URL(route.request().url()).pathname.split("/").at(-1)!.replace(/\.js$/, "");
    if (!modules.has(name)) return route.abort();
    const source = readFileSync(resolve(`lib/find-in-video/${name}.ts`), "utf8");
    const compiled = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext } }).outputText
      .replace(/from "\.\/([^".]+)"/g, 'from "/__clip-test/$1.js"');
    await route.fulfill({ contentType: "text/javascript", body: compiled });
  });
  await page.goto("/find-in-video");
  await page.evaluate(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.id = "export-test-source";
    input.hidden = true;
    document.body.append(input);
  });
}

// Seed only recognition results; file reading, player, UI and FFmpeg are real.
async function prepareTool(page: Page) {
  await page.addInitScript(() => {
    class RecognitionWorker {
      onmessage: ((event: { data: WorkerResponse }) => void) | null = null;
      onerror = null;
      terminated = false;
      terminate() { this.terminated = true; }
      postMessage(message: WorkerRequest) {
        if (!("id" in message)) return;
        let response: WorkerResponse;
        if (message.type === "load") response = { id: message.id, type: "loaded", provider: "wasm" };
        else if (message.type === "validate") {
          message.bitmap.close();
          response = { id: message.id, type: "validated", embedding: new Float32Array([1, 0]), reason: null };
        } else if (message.type === "analyze") {
          response = { id: message.id, type: "analyzed", wallMs: 10, decodeMs: 5, inferMs: 5,
            result: { video_id: message.videoId, sample_interval_seconds: 1, match_threshold: 0.5, sampled_frames: 24,
              people: message.references.map((person, index) => ({ ...person,
                hit_seconds: index ? [0, 22] : [2, 4, 10, 16, 17],
                segments: index ? [{ start_seconds: 0, end_seconds: 0 }, { start_seconds: 22, end_seconds: 22 }]
                  : [{ start_seconds: 2, end_seconds: 4 }, { start_seconds: 10, end_seconds: 10 }, { start_seconds: 16, end_seconds: 17 }],
              })),
            },
          };
        } else return;
        setTimeout(() => { if (!this.terminated) this.onmessage?.({ data: response }); }, 10);
      }
    }
    globalThis.Worker = new Proxy(globalThis.Worker, {
      construct(target, args) {
        // Turbopack wraps the recognition worker entry point in a Blob URL.
        const url = String(args[0]);
        return url.includes("face-worker") || url.startsWith("blob:") ? new RecognitionWorker() : Reflect.construct(target, args);
      },
    });
  });
  await page.goto("/zh/find-in-video");
  await page.getByRole("button", { name: "加载识别模型", exact: true }).click();
  await expect(page.getByRole("button", { name: "已就绪 · WASM", exact: true })).toBeVisible();
  const photo = readFileSync(join(directory, "reference.png"));
  await page.locator('input[type="file"][multiple]').setInputFiles([
    { name: "Alice.png", mimeType: "image/png", buffer: photo },
    { name: "Bob.png", mimeType: "image/png", buffer: photo },
  ]);
  await expect(page.getByText("已验证：一张清晰人脸", { exact: true })).toHaveCount(2);
  await page.locator('input[aria-label="选择源视频"]').setInputFiles(join(directory, "source.mp4"));
  await expect(page.getByRole("button", { name: "开始分析", exact: true })).toBeEnabled();
  await page.getByRole("button", { name: "开始分析", exact: true }).click();
  await expect(page.getByLabel("Alice的片段", { exact: true })).toBeVisible();
}

test.describe("real local video stream-copy export", () => {
  test.beforeEach(async ({ page }) => {
    // Existing site ads can emit unrelated POST pings during export.
    // Block their scripts so the no-upload assertion observes the tool itself.
    await page.route(/https:\/\/[^/]*(googlesyndication\.com|doubleclick\.net|googleadservices\.com)\//, (route) => route.abort());
  });

  test.beforeAll(() => {
    try { execFileSync("ffmpeg", ["-version"]); execFileSync("ffprobe", ["-version"]); }
    catch { test.skip(true, "Fixture generation and decoding verification require native ffmpeg and ffprobe."); }
    directory = mkdtempSync(join(tmpdir(), "find-in-video-export-"));
    ffmpeg(["-f", "lavfi", "-i", "testsrc2=size=320x180:rate=24:duration=24",
      "-f", "lavfi", "-i", "sine=frequency=440:sample_rate=48000:duration=24",
      "-c:v", "libx264", "-g", "48", "-keyint_min", "48", "-sc_threshold", "0", "-bf", "2",
      "-c:a", "aac", "-shortest", join(directory, "source.mp4")]);
    ffmpeg(["-i", join(directory, "source.mp4"), "-frames:v", "1", join(directory, "reference.png")]);
    for (const extension of ["mov", "mkv"]) ffmpeg(["-i", join(directory, "source.mp4"), "-map", "0", "-c", "copy", join(directory, `source.${extension}`)]);
    ffmpeg(["-i", join(directory, "source.mp4"), "-map", "0:v:0", "-c", "copy", join(directory, "silent.mp4")]);
    ffmpeg(["-i", join(directory, "source.mp4"), "-f", "lavfi", "-i", "sine=frequency=880:sample_rate=48000:duration=24",
      "-map", "0:v:0", "-map", "0:a:0", "-map", "1:a:0", "-c:v", "copy", "-c:a", "aac", join(directory, "multi-audio.mp4")]);
    ffmpeg(["-i", join(directory, "source.mp4"), "-map", "0", "-c", "copy", "-metadata:s:v:0", "rotate=90", join(directory, "rotated.mp4")]);
    ffmpeg(["-f", "lavfi", "-i", "testsrc2=size=320x180:rate=24:duration=24", "-c:v", "libx264",
      "-g", "144", "-keyint_min", "144", "-sc_threshold", "0", "-bf", "2", join(directory, "long-gop.mp4")]);
  });

  test.afterAll(() => { if (directory) rmSync(directory, { recursive: true, force: true }); });

  for (const name of samples) {
    test(`exports ${name} without changed codecs, lost frames or accumulated AV drift`, async ({ page }, testInfo) => {
      test.setTimeout(120_000);
      await mountService(page);
      const source = join(directory, name);
      await page.locator("#export-test-source").setInputFiles(source);
      const uploads: string[] = [];
      page.on("request", (request) => { if (request.method() === "POST") uploads.push(request.url()); });
      const downloadPromise = page.waitForEvent("download");
      void downloadPromise.catch(() => {});
      const result = await page.evaluate(async () => {
        const url = new URL("/__clip-test/export-clips.js", location.origin).href;
        const { exportClips } = await import(/* webpackIgnore: true */ url);
        const file = (document.querySelector("#export-test-source") as HTMLInputElement).files![0];
        const metadata = document.createElement("video");
        const sourceURL = URL.createObjectURL(file);
        const ready = new Promise<void>((resolve, reject) => {
          metadata.onloadedmetadata = () => resolve();
          metadata.onerror = () => reject(new Error("Cannot play fixture"));
        });
        metadata.src = sourceURL;
        await ready;
        const stages: string[] = [];
        const started = performance.now();
        const result = await exportClips({ file, duration: metadata.duration,
          ranges: [{ start_seconds: 2.5, end_seconds: 3.5 }, { start_seconds: 10.5, end_seconds: 11.5 }, { start_seconds: 22.5, end_seconds: 23.5 }],
          signal: new AbortController().signal, onProgress: (progress: { stage: string }) => stages.push(progress.stage) });
        const downloadURL = URL.createObjectURL(result.blob);
        const link = document.createElement("a");
        link.href = downloadURL;
        link.download = "clips." + file.name.split(".").at(-1);
        link.click();
        URL.revokeObjectURL(sourceURL);
        metadata.removeAttribute("src");
        metadata.load();
        setTimeout(() => URL.revokeObjectURL(downloadURL), 1000);
        return { ranges: result.ranges as { start_seconds: number; end_seconds: number }[], stages, elapsedMs: performance.now() - started };
      });
      const download = await downloadPromise;
      const output = testInfo.outputPath(download.suggestedFilename());
      await download.saveAs(output);
      const sourceInfo = probe(source);
      const outputInfo = probe(output);
      expect(outputInfo.streams.map((stream: { codec_name: string }) => stream.codec_name))
        .toEqual(sourceInfo.streams.map((stream: { codec_name: string }) => stream.codec_name));
      const sourceVideo = sourceInfo.streams.find((stream: { codec_type: string }) => stream.codec_type === "video");
      const outputVideo = outputInfo.streams.find((stream: { codec_type: string }) => stream.codec_type === "video");
      expect(outputVideo.width).toBe(sourceVideo.width);
      expect(outputVideo.height).toBe(sourceVideo.height);
      expect(outputVideo.side_data_list?.find((data: { rotation?: number }) => data.rotation !== undefined)?.rotation)
        .toBe(sourceVideo.side_data_list?.find((data: { rotation?: number }) => data.rotation !== undefined)?.rotation);
      const sourceHashes = hashes(source);
      const origin = Number(sourceInfo.format.start_time ?? 0);
      const videoStart = Number(sourceVideo.start_time ?? 0) - origin;
      const expected = result.ranges.flatMap((range) => sourceHashes.slice(
        Math.max(0, Math.round((range.start_seconds - videoStart) * 24)),
        Math.round((range.end_seconds - videoStart) * 24),
      ));
      expect(hashes(output)).toEqual(expected);
      const expectedDuration = result.ranges.reduce((total, range) => total + range.end_seconds - range.start_seconds, 0);
      expect(Math.abs(Number(outputInfo.format.duration) - expectedDuration)).toBeLessThan(0.2);
      for (const stream of outputInfo.streams.filter((stream: { codec_type: string }) => stream.codec_type === "audio")) {
        if (stream.duration) expect(Math.abs(Number(stream.duration) - expectedDuration)).toBeLessThan(0.15);
        expect(Math.abs(Number(stream.start_time ?? 0) - Number(outputVideo.start_time ?? 0))).toBeLessThan(0.05);
      }
      expect(uploads).toEqual([]);
      expect(result.stages).toEqual(expect.arrayContaining(["loading", "preparing", "cutting", "joining", "download"]));
      await testInfo.attach("export-results", { body: JSON.stringify(result, null, 2), contentType: "application/json" });
    });
  }

  test("selects per-person clips, plays safety starts, downloads from the real UI and resets new results", async ({ page }, testInfo) => {
    test.setTimeout(120_000);
    await page.setViewportSize({ width: 1440, height: 1000 });
    const assets: string[] = [];
    page.on("request", (request) => { if (request.url().includes("/ffmpeg/")) assets.push(request.url()); });
    await prepareTool(page);
    expect(assets).toEqual([]);
    const alice = page.getByLabel("Alice的片段", { exact: true });
    const bob = page.getByLabel("Bob的片段", { exact: true });
    await expect(alice.getByRole("checkbox")).toHaveCount(3);
    await expect(alice.getByRole("checkbox").first()).toBeChecked();
    await alice.getByRole("button", { name: "播放 00:01–00:05" }).click();
    await expect.poll(() => page.locator("video").evaluate((video: HTMLVideoElement) => video.currentTime)).toBeGreaterThanOrEqual(1);
    await expect(alice.getByRole("checkbox").first()).toBeChecked();
    await alice.getByRole("button", { name: "清空选择" }).click();
    await expect(alice.getByRole("button", { name: "拼接下载" })).toBeDisabled();
    await expect(bob.getByRole("checkbox").first()).toBeChecked();
    await alice.getByRole("checkbox").first().click();
    await page.screenshot({ path: testInfo.outputPath("desktop-selection.png"), fullPage: true });
    const downloadPromise = page.waitForEvent("download");
    void downloadPromise.catch(() => {});
    await alice.getByRole("button", { name: "拼接下载" }).click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe("source-Alice-clips.mp4");
    const path = testInfo.outputPath(download.suggestedFilename());
    await download.saveAs(path);
    await expect(alice.getByText(/已开始下载/)).toBeVisible();
    expect(hashes(path)).toEqual(hashes(join(directory, "source.mp4")).slice(0, 144));
    await expect(page.getByRole("button", { name: "开始新分析" })).toBeEnabled();
    await page.getByRole("button", { name: "开始新分析" }).click();
    await expect(alice.getByText("已选 3 段 · 预计 9.0 秒")).toBeVisible();
    await page.setViewportSize({ width: 390, height: 844 });
    await expect(alice.getByRole("button", { name: "拼接下载" })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.screenshot({ path: testInfo.outputPath("mobile-selection.png"), fullPage: true });
    await page.getByRole("button", { name: "切换为深色" }).click();
    await expect(page.locator("html")).toHaveClass(/dark/);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.screenshot({ path: testInfo.outputPath("mobile-dark-selection.png"), fullPage: true });
    await page.locator("button").filter({ hasText: /^替换$/ }).first().click();
    await page.locator('input[aria-label="替换"]').setInputFiles({ name: "Alice.png", mimeType: "image/png", buffer: readFileSync(join(directory, "reference.png")) });
    await expect(alice).toHaveCount(0);
    await page.getByRole("button", { name: "开始分析", exact: true }).click();
    await expect(alice.getByText("已选 3 段 · 预计 9.0 秒")).toBeVisible();
    await page.locator('input[aria-label="选择源视频"]').setInputFiles(join(directory, "silent.mp4"));
    await expect(alice).toHaveCount(0);
  });

  test("locks mutations during export, keeps selections on failure and supports retry and cancellation", async ({ page }) => {
    test.setTimeout(120_000);
    await prepareTool(page);
    const alice = page.getByLabel("Alice的片段", { exact: true });
    const bob = page.getByLabel("Bob的片段", { exact: true });
    await alice.getByRole("checkbox").last().click();
    let release: (() => void) | undefined;
    const held = new Promise<void>((resolve) => { release = resolve; });
    await page.route("**/ffmpeg/ffmpeg-core.wasm", async (route) => {
      await held;
      await route.fulfill({ status: 503, body: "Test load failure" });
    });
    await alice.getByRole("button", { name: "拼接下载" }).click();
    await expect(page.getByRole("button", { name: "更换视频" })).toBeDisabled();
    await expect(page.getByRole("button", { name: "开始新分析" })).toBeDisabled();
    await expect(alice.getByRole("checkbox").first()).toHaveAttribute("aria-disabled", "true");
    await expect(bob.getByRole("button", { name: "拼接下载" })).toBeDisabled();
    release!();
    await expect(alice.getByRole("alert")).toContainText("无法加载本地视频导出工具");
    await expect(alice.getByRole("checkbox").first()).toBeChecked();
    await expect(alice.getByRole("checkbox").last()).not.toBeChecked();
    await page.unroute("**/ffmpeg/ffmpeg-core.wasm");
    const download = page.waitForEvent("download");
    void download.catch(() => {});
    await alice.getByRole("button", { name: "拼接下载" }).click();
    await download;
    await expect(alice.getByText(/已开始下载/)).toBeVisible();

    let releaseCancel: (() => void) | undefined;
    const cancellation = new Promise<void>((resolve) => { releaseCancel = resolve; });
    await page.route("**/ffmpeg/ffmpeg-core.wasm", async (route) => {
      await cancellation;
      // Worker termination may already have cancelled this held request.
      await route.abort().catch(() => {});
    });
    await alice.getByRole("button", { name: "拼接下载" }).click();
    await alice.getByRole("button", { name: "取消导出" }).click();
    await expect(alice.getByText("已取消导出，保留当前选择。")).toBeVisible();
    await expect(alice.getByRole("checkbox").first()).toBeChecked();
    await expect(alice.getByRole("checkbox").last()).not.toBeChecked();
    await expect(page.getByRole("button", { name: "更换视频" })).toBeEnabled();
    releaseCancel!();
    await page.unroute("**/ffmpeg/ffmpeg-core.wasm");
  });

  test("exports a near-1GB source with bounded memory and repeated-worker cleanup", async ({ page }, testInfo) => {
    const source = process.env.FIND_IN_VIDEO_LARGE_FIXTURE;
    test.skip(!source, "Set FIND_IN_VIDEO_LARGE_FIXTURE to a generated, browser-playable 900MB–1GB MP4.");
    test.setTimeout(240_000);
    await mountService(page);
    await page.locator("#export-test-source").setInputFiles(source!);
    const rss = () => {
      const processes = execFileSync("ps", ["-axo", "pid,ppid,rss"], { encoding: "utf8" }).trim().split("\n").slice(1)
        .map((line) => line.trim().split(/\s+/).map(Number));
      const descendants = new Set([process.pid]);
      let count = 0;
      do {
        count = descendants.size;
        for (const [pid, parent] of processes) if (descendants.has(parent)) descendants.add(pid);
      } while (descendants.size !== count);
      return processes.filter(([pid]) => pid !== process.pid && descendants.has(pid)).reduce((total, process) => total + process[2], 0) * 1024;
    };
    const baselineRSS = rss();
    let peakRSS = baselineRSS;
    const sampler = setInterval(() => { peakRSS = Math.max(peakRSS, rss()); }, 250);
    const started = Date.now();
    try {
      const results = await page.evaluate(async () => {
        const url = new URL("/__clip-test/export-clips.js", location.origin).href;
        const { exportClips } = await import(/* webpackIgnore: true */ url);
        const file = (document.querySelector("#export-test-source") as HTMLInputElement).files![0];
        if (file.size < 900_000_000 || file.size > 1_000_000_000) throw new Error("Expected a 900MB–1GB source");
        const video = document.createElement("video");
        video.preload = "metadata";
        const sourceURL = URL.createObjectURL(file);
        video.src = sourceURL;
        await new Promise<void>((resolve, reject) => {
          video.onloadedmetadata = () => resolve(); video.onerror = () => reject(new Error("Invalid benchmark video"));
        });
        const duration = video.duration;
        URL.revokeObjectURL(sourceURL);
        video.removeAttribute("src"); video.load();
        const results = [];
        // Guard the main-thread input against accidental full-file buffering.
        file.arrayBuffer = () => { throw new Error("Source must be mounted, not buffered"); };
        for (let run = 0; run < 2; run++) {
          const started = performance.now();
          const output = await exportClips({ file, duration,
            ranges: [{ start_seconds: 4.5, end_seconds: 5.5 }, { start_seconds: 24.5, end_seconds: 25.5 }],
            signal: new AbortController().signal, onProgress: () => {} });
          results.push({ elapsedMs: performance.now() - started, outputBytes: output.blob.size, ranges: output.ranges });
        }
        return { sourceBytes: file.size, duration, results };
      });
      await expect.poll(rss, { timeout: 15_000 }).toBeLessThan(baselineRSS + 300 * 1024 * 1024);
      const measurements = { ...results, baselineRSS, peakRSS, finalRSS: rss(), wallMs: Date.now() - started,
        note: "Approximate combined RSS of the test browser process tree; model inference is not loaded in this export benchmark." };
      expect(peakRSS - baselineRSS).toBeLessThan(results.sourceBytes);
      await testInfo.attach("large-export-benchmark", { body: JSON.stringify(measurements, null, 2), contentType: "application/json" });
      console.log("Local video export benchmark:", JSON.stringify(measurements));
    } finally {
      clearInterval(sampler);
    }
  });
});
