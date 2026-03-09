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

  it("removes numeric footnote markers", () => {
    assert.equal(cleanText("blue blood[1] due to hemocyanin[23]"), "blue blood due to hemocyanin");
  });

  it("removes multi-letter footnote markers", () => {
    assert.equal(cleanText("some fact[a b] and another[c]"), "some fact and another");
  });

  it("removes citation needed markers", () => {
    assert.equal(cleanText("unverified claim[citation needed] here"), "unverified claim here");
  });

  it("preserves normal bracketed text", () => {
    assert.equal(cleanText("the array [example] works"), "the array [example] works");
  });

  it("preserves text with numbers in brackets within words", () => {
    assert.equal(cleanText("use config[key] for access"), "use config[key] for access");
  });
});
