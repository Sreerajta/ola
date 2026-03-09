import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { outputText } from "../src/format/outputText.js";
import { outputJson } from "../src/format/outputJson.js";

const result = {
  title: "Test Article",
  paragraphs: ["First paragraph.", "Second paragraph."],
};

describe("outputText", () => {
  it("joins paragraphs with blank lines", () => {
    assert.equal(outputText(result), "First paragraph.\n\nSecond paragraph.\n");
  });
});

describe("outputJson", () => {
  it("outputs valid JSON with title and paragraphs", () => {
    const parsed = JSON.parse(outputJson(result));
    assert.equal(parsed.title, "Test Article");
    assert.deepEqual(parsed.paragraphs, [
      "First paragraph.",
      "Second paragraph.",
    ]);
  });
});
