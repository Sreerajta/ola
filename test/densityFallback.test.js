import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { densityFallback } from "../src/extract/densityFallback.js";

describe("densityFallback", () => {
  it("extracts high-density text blocks", () => {
    const html = `
      <html>
        <body>
          <nav><a href="/">Home</a><a href="/about">About</a></nav>
          <div>
            <p>This is a substantial article paragraph with enough text and sentences to score well. It covers an important topic. The reader should find this useful.</p>
            <p>Another meaningful paragraph that discusses the subject in depth. There are multiple sentences here. Each one adds value to the discussion.</p>
          </div>
          <footer>Copyright 2024</footer>
        </body>
      </html>
    `;
    const result = densityFallback(html);
    assert.ok(result.content.length > 0);
    assert.ok(result.content.includes("substantial article paragraph"));
  });

  it("filters out low-density blocks", () => {
    const html = `
      <html>
        <body>
          <p><a href="/1">Link</a> <a href="/2">Link</a> <a href="/3">Link</a> <a href="/4">Link</a></p>
          <p>This is a real content paragraph with multiple sentences. It has enough text to score well. The density algorithm should keep this block.</p>
        </body>
      </html>
    `;
    const result = densityFallback(html);
    assert.ok(result.content.includes("real content paragraph"));
  });

  it("removes script and style elements", () => {
    const html = `
      <html>
        <body>
          <script>var x = 1;</script>
          <style>.foo { color: red; }</style>
          <p>This is the actual content that should be extracted. It contains multiple sentences. The script and style content should not appear.</p>
        </body>
      </html>
    `;
    const result = densityFallback(html);
    assert.ok(!result.content.includes("var x"));
    assert.ok(!result.content.includes("color: red"));
  });

  it("extracts title from the page", () => {
    const html = `
      <html>
        <head><title>Test Title</title></head>
        <body>
          <p>Some content paragraph with enough text and sentences to pass. This should work fine. Multiple sentences help.</p>
        </body>
      </html>
    `;
    const result = densityFallback(html);
    assert.equal(result.title, "Test Title");
  });
});
