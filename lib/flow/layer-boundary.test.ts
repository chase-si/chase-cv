import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const LIB_FLOW_DIR = join(import.meta.dirname);

function listLibFlowSourceFiles(): string[] {
  return readdirSync(LIB_FLOW_DIR).filter(
    (name) => name.endsWith(".ts") && !name.endsWith(".test.ts"),
  );
}

describe("lib/flow layer boundary", () => {
  it("does not import from components", () => {
    const offenders = listLibFlowSourceFiles().filter((file) => {
      const source = readFileSync(join(LIB_FLOW_DIR, file), "utf8");
      return /@\/components\//.test(source);
    });
    expect(offenders).toEqual([]);
  });

  it("barrel index does not re-export UI components", () => {
    const indexSource = readFileSync(join(LIB_FLOW_DIR, "index.ts"), "utf8");
    expect(indexSource).not.toMatch(/@\/components\//);
  });
});
