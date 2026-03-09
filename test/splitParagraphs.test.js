import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { splitParagraphs } from "../src/format/splitParagraphs.js";

describe("splitParagraphs", () => {
  it("splits on double newlines", () => {
    const text =
      "This is a long enough first paragraph for testing.\n\nThis is a long enough second paragraph for testing.";
    const result = splitParagraphs(text);
    assert.equal(result.length, 2);
  });

  it("filters short paragraphs", () => {
    const text = "Short.\n\nThis paragraph is long enough to pass the filter easily.";
    const result = splitParagraphs(text);
    assert.equal(result.length, 1);
    assert.match(result[0], /long enough/);
  });

  it("trims whitespace from paragraphs", () => {
    const text =
      "  This is a long enough paragraph with leading spaces.  \n\n  Another long enough paragraph with spaces too.  ";
    const result = splitParagraphs(text);
    assert.ok(!result[0].startsWith(" "));
    assert.ok(!result[0].endsWith(" "));
  });

  it("handles multiple blank lines as separator", () => {
    const text =
      "This is a long enough first paragraph for testing.\n\n\n\nThis is a long enough second paragraph for testing.";
    const result = splitParagraphs(text);
    assert.equal(result.length, 2);
  });
});
