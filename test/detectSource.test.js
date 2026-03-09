import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { detectSource } from "../src/input/detectSource.js";

describe("detectSource", () => {
  it("detects HTTP URLs", () => {
    const result = detectSource("https://example.com/article");
    assert.equal(result.type, "url");
    assert.equal(result.value, "https://example.com/article");
  });

  it("detects HTTP URLs (case insensitive)", () => {
    const result = detectSource("HTTP://example.com");
    assert.equal(result.type, "url");
  });

  it("returns stdin when input is null", () => {
    const result = detectSource(null);
    assert.equal(result.type, "stdin");
  });

  it("returns stdin when input is undefined", () => {
    const result = detectSource(undefined);
    assert.equal(result.type, "stdin");
  });

  it("detects existing files", () => {
    const result = detectSource("package.json");
    assert.equal(result.type, "file");
    assert.equal(result.value, "package.json");
  });

  it("throws for unknown input", () => {
    assert.throws(() => detectSource("not-a-file-or-url"), /Unknown input/);
  });
});
