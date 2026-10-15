import { cp, mkdir, readFile, readdir } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const output = resolve(process.argv[2] ?? join(tmpdir(), "chase-cv-runtime-upload"));
const project = JSON.parse(await readFile(resolve("package.json"), "utf8"));
let count = 0;

for (const [name, folder, filter] of [
  ["onnxruntime-web", "onnx", (file) => file.startsWith("ort-wasm") && /\.(mjs|wasm)$/.test(file)],
  ["@ffmpeg/core", "ffmpeg", (file) => /^ffmpeg-core\.(js|wasm)$/.test(file)],
]) {
  const root = resolve("node_modules", name);
  const { version } = JSON.parse(await readFile(join(root, "package.json"), "utf8"));
  if (project.dependencies[name] !== version) {
    throw new Error(`${name}: pin dependency ${version} exactly before preparing CDN files`);
  }
  const dist = join(root, name === "@ffmpeg/core" ? "dist/esm" : "dist");
  const target = join(output, "runtime", folder, version);
  await mkdir(target, { recursive: true });
  const files = (await readdir(dist)).filter(filter);
  if (!files.length) throw new Error(`No runtime files found for ${name}`);
  for (const file of files) await cp(join(dist, file), join(target, file));
  count += files.length;
}

console.log(`Prepared ${count} runtime files in ${join(output, "runtime")}`);
