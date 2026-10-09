import { cp, mkdir, readdir } from "node:fs/promises";
import { resolve } from "node:path";

const dist = resolve("node_modules/onnxruntime-web/dist");
const output = resolve("public/onnx");
await mkdir(output, { recursive: true });
const names = await readdir(dist);
const copied = [];
for (const name of names) {
  if (name.startsWith("ort-wasm") && /\.(wasm|mjs)$/.test(name)) {
    await cp(resolve(dist, name), resolve(output, name));
    copied.push(name);
  }
}
if (!copied.length) {
  throw new Error("onnxruntime-web wasm files were not found");
}
console.log(`copied ${copied.length} onnx runtime files to public/onnx`);
