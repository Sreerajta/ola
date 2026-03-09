import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { extractWithReadability } from "../src/extract/readability.js";

describe("extractWithReadability", () => {
  it("extracts title and content from HTML", () => {
    const html = `
      <html>
        <head><title>Test Page</title></head>
        <body>
          <article>
            <h1>Test Page</h1>
            <p>This is the main article content that should be extracted by readability.</p>
            <p>Another paragraph with enough content to be considered meaningful text.</p>
            <p>A third paragraph to ensure readability sees this as a real article worth parsing.</p>
          </article>
        </body>
      </html>
    `;
    const result = extractWithReadability(html, "https://example.com");
    assert.ok(result.title);
    assert.ok(result.content.length > 0);
  });

  it("returns null when no article is found", () => {
    const html = "<html><body></body></html>";
    const result = extractWithReadability(html);
    assert.equal(result, null);
  });
});
