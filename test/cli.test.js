import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { resolve } from "node:path";

const cli = resolve(import.meta.dirname, "../src/cli/ola.js");
const sample = resolve(import.meta.dirname, "../examples/sample.html");

function run(...args) {
  return execFileSync("node", [cli, ...args], { encoding: "utf-8" });
}

describe("CLI", () => {
  it("outputs plain text by default", () => {
    const out = run(sample);
    assert.ok(out.includes("Octopuses are soft-bodied"));
    assert.ok(!out.startsWith("{"));
  });

  it("outputs JSON with --json", () => {
    const out = run("--json", sample);
    const parsed = JSON.parse(out);
    assert.ok(parsed.title);
    assert.ok(Array.isArray(parsed.paragraphs));
    assert.ok(parsed.paragraphs.length > 0);
  });

  it("outputs only title with --title", () => {
    const out = run("--title", sample);
    const lines = out.trim().split("\n");
    assert.equal(lines.length, 1);
    assert.ok(lines[0].length > 0);
  });

  it("exits with error on empty stdin", () => {
    try {
      execFileSync("node", [cli], {
        encoding: "utf-8",
        stdio: ["pipe", "pipe", "pipe"],
        input: "",
        timeout: 5000,
      });
      assert.fail("Should have exited with error");
    } catch (err) {
      assert.ok(err.status !== 0);
    }
  });
});
