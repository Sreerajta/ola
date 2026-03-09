import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { detectJsPage } from "../src/detect/detectJsPage.js";

describe("detectJsPage", () => {
  it("detects short HTML as JS-rendered", () => {
    const html = "<html><body><div id='root'></div></body></html>";
    assert.equal(detectJsPage(html), true);
  });

  it("detects div#root as JS-rendered", () => {
    const html = "<html><body>" + "x".repeat(6000) + '<div id="root"></div></body></html>';
    assert.equal(detectJsPage(html), true);
  });

  it("detects excessive script tags", () => {
    const scripts = "<script>var x=1;</script>".repeat(25);
    const html = "<html><body>" + "x".repeat(6000) + "<p>Hello world</p>" + scripts + "</body></html>";
    assert.equal(detectJsPage(html), true);
  });

  it("detects pages with no paragraphs", () => {
    const html = "<html><body>" + "x".repeat(6000) + "<div>Content here</div></body></html>";
    assert.equal(detectJsPage(html), true);
  });

  it("returns false for normal HTML with paragraphs", () => {
    const paragraphs = "<p>A real paragraph.</p>".repeat(5);
    const html = "<html><body>" + "x".repeat(6000) + paragraphs + "</body></html>";
    assert.equal(detectJsPage(html), false);
  });
});
