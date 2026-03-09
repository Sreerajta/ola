import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { cleanText } from "../src/clean/cleanText.js";

describe("cleanText", () => {
  it("removes HTML tags", () => {
    assert.equal(cleanText("<p>Hello</p>"), "Hello");
  });

  it("decodes HTML entities", () => {
    assert.equal(cleanText("A &amp; B &lt; C"), "A & B < C");
  });

  it("collapses excessive whitespace", () => {
    assert.equal(cleanText("hello    world"), "hello world");
  });

  it("collapses excessive newlines", () => {
    const input = "para one\n\n\n\n\npara two";
    assert.equal(cleanText(input), "para one\n\npara two");
  });

  it("trims each line", () => {
    assert.equal(cleanText("  hello  \n  world  "), "hello\nworld");
  });

  it("decodes &nbsp; to space", () => {
    assert.equal(cleanText("hello&nbsp;world"), "hello world");
  });
});
