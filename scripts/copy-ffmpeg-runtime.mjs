import { cp, mkdir, readdir } from "node:fs/promises";
import { resolve } from "node:path";

const output = resolve("public/ffmpeg");
await mkdir(output, { recursive: true });
for (const packageName of ["ffmpeg", "core"]) {
  const dist = resolve(`node_modules/@ffmpeg/${packageName}/dist/esm`);
  for (const name of await readdir(dist)) {
    if (/\.(js|wasm)$/.test(name)) await cp(resolve(dist, name), resolve(output, name));
  }
  await cp(resolve(`node_modules/@ffmpeg/${packageName}/package.json`), resolve(output, `${packageName}-package.json`));
}
console.log("copied single-thread FFmpeg runtime to public/ffmpeg");
