import { readFile, mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { build } from "vite";
import postcss from "postcss";
import tailwind from "@tailwindcss/postcss";

const directory = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(directory, "../..");
await mkdir(path.join(directory, "assets"), { recursive: true });
// Keep the offline shell in sync with the site's tokens without editing globals.css.
const globals = await readFile(path.join(root, "app/globals.css"), "utf8");
const tokens = [":root", ".dark", "@theme inline"].map((selector) => {
  const start = globals.indexOf(`${selector} {`);
  const end = globals.indexOf("\n}", start) + 2;
  if (start < 0 || end < 2) throw new Error(`Missing theme section: ${selector}`);
  return globals.slice(start, end);
}).join("\n");
const styles = await readFile(path.join(directory, "src/styles.css"), "utf8");
const css = await postcss([tailwind({ base: root, optimize: true })]).process(
  `@import "tailwindcss" source(none);\n@source "./src";\n@source "../../components/ui/button.tsx";\n@source "../../components/ui/card.tsx";\n@source "../../components/ui/input.tsx";\n@source "../../components/floor-plan/svg";\n@custom-variant dark (&:is(.dark *));\n${tokens}\n${styles}`,
  { from: path.join(directory, "styles.input.css") },
);
await writeFile(path.join(directory, "assets/style.css"), css.css);
await build({
  configFile: false,
  root: directory,
  resolve: { alias: { "@": root } },
  define: { "process.env.NODE_ENV": JSON.stringify("production") },
  plugins: [{
    name: "offline-react-network-estimate",
    transform(code, id) {
      if (!id.endsWith("react-dom-client.production.js")) return;
      // React 19 probes NetworkInformation for image-loading estimates. The
      // container disables it; use React's own fallback and leave no API access.
      const probe = /return navigator\.connection\s*&&\s*\(\(count = navigator\.connection\.downlink\), "number" === typeof count\)\s*\? count\s*: 5;/;
      if (!probe.test(code)) throw new Error("React network probe changed; review offline adaptation");
      return { code: code.replace(probe, "return 5;"), map: null };
    },
  }],
  build: {
    outDir: "assets", emptyOutDir: false, sourcemap: false, target: "es2020",
    lib: { entry: path.join(directory, "src/app.tsx"), name: "FloorPlanMiniTool", formats: ["iife"], fileName: () => "app.js" },
    minify: true,
  },
});
