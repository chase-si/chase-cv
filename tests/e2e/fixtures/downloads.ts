import { mkdir } from "node:fs/promises";
import path from "node:path";

export const downloadsDir = path.join(process.cwd(), "test-results", "downloads");

export async function ensureDownloadsDir() {
  await mkdir(downloadsDir, { recursive: true });
  return downloadsDir;
}
