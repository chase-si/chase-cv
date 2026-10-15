import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "acorn";

const root = path.dirname(fileURLToPath(import.meta.url));
const html = await readFile(path.join(root, "index.html"), "utf8");
function assert(condition, message) { if (!condition) throw new Error(message); }
assert(/^<!doctype html>/i.test(html) && html.includes('lang="zh-CN"'), "Missing HTML document metadata");
assert(html.includes("viewport-fit=cover") && html.includes("width=device-width"), "Missing viewport / safe area");
assert(!/<(?:iframe|object|base)\b|\bon\w+\s*=|javascript:|type=["']module|http-equiv=["']Content-Security-Policy/i.test(html), "Unsupported markup");
assert(!/<script\b[^>]*>\s*[^<\s]/i.test(html), "Inline scripts are forbidden");
const references = [...html.matchAll(/(?:src|href)=["']([^"']+)/g)].map((match) => match[1]);
for (const reference of references) {
  assert(reference.startsWith("./"), `Non-relative asset: ${reference}`);
  await stat(path.resolve(root, reference));
}
const files = ["index.html", ...(await readdir(path.join(root, "assets"))).map((name) => `assets/${name}`)];
let size = 0;
const banned = new Set(["fetch", "XMLHttpRequest", "WebSocket", "EventSource", "RTCPeerConnection", "Worker", "SharedWorker", "Accelerometer", "Gyroscope", "Magnetometer", "eval", "Function", "PaymentRequest"]);
const bannedMethods = new Set(["getCurrentPosition", "watchPosition", "getBattery", "enumerateDevices", "getDisplayMedia", "requestFullscreen", "webkitRequestFullscreen", "execCommand"]);
function walk(node) {
  if (!node || typeof node !== "object") return;
  if (node.type === "CallExpression" || node.type === "NewExpression") {
    const callee = node.callee;
    assert(!(callee.type === "Identifier" && banned.has(callee.name)), `Forbidden API: ${callee.name}`);
    if (callee.type === "MemberExpression") {
      const method = callee.computed ? callee.property.value : callee.property.name;
      assert(!bannedMethods.has(method), `Forbidden API: ${method}`);
      const object = callee.object;
      assert(!(object.type === "Identifier" && object.name === "window" && ["open", "prompt", "fetch"].includes(method)), `Forbidden window API: ${method}`);
    }
  }
  if (node.type === "MemberExpression" && node.object.type === "Identifier" && node.object.name === "navigator") {
    assert(!["geolocation", "clipboard", "bluetooth", "usb", "hid", "serial", "connection", "credentials", "locks", "serviceWorker"].includes(node.property.name), "Forbidden navigator API");
  }
  for (const value of Object.values(node)) {
    if (Array.isArray(value)) value.forEach(walk);
    else if (value && typeof value === "object") walk(value);
  }
}
for (const file of files) {
  assert(/\.(html|css|js|png|jpg|jpeg|gif|webp|svg|woff2?|json)$/.test(file), `Unsupported file: ${file}`);
  const fileStat = await stat(path.join(root, file));
  size += fileStat.size;
  if (file.endsWith(".js")) walk(parse(await readFile(path.join(root, file), "utf8"), { ecmaVersion: "latest", sourceType: "script" }));
  if (file.endsWith(".css")) assert(!/url\(\s*["']?https?:/i.test(await readFile(path.join(root, file), "utf8")), "Remote CSS asset");
}
assert(size < 10 * 1024 * 1024, "Package exceeds 10 MB");
console.log(`Offline / CSP audit passed: ${files.length} files, ${(size / 1024).toFixed(1)} KB uncompressed`);
