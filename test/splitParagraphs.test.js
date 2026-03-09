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

  it("filters out paragraphs starting with ^", () => {
    const text =
      "This is a real article paragraph with enough text.\n\n^ \"ITIS Report: Octopoda Leach, 1818\". Itis.gov. 10 April 2013. Retrieved 4 February 2014.";
    const result = splitParagraphs(text);
    assert.equal(result.length, 1);
    assert.ok(result[0].includes("real article"));
  });

  it("filters out Retrieved-style reference entries", () => {
    const text =
      'This is a real article paragraph with enough text.\n\n"Octopoda". Merriam-Webster.com Dictionary. Retrieved 12 July 2021.';
    const result = splitParagraphs(text);
    assert.equal(result.length, 1);
  });

  it("preserves normal paragraphs that are not references", () => {
    const text =
      "Octopuses have three hearts and blue blood.\n\nThey are among the most intelligent invertebrates known to science.";
    const result = splitParagraphs(text);
    assert.equal(result.length, 2);
  });
});
