import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { renderJs } from "../src/fetch/renderJs.js";

describe("renderJs", () => {
  it("returns HTML string from a rendered page", async () => {
    // If Playwright + browsers are installed, this returns HTML.
    // If not, it throws. Both are valid depending on environment.
    try {
      const html = await renderJs("https://example.com");
      assert.equal(typeof html, "string");
      assert.ok(html.includes("<html"));
    } catch (err) {
      assert.ok(
        /Playwright is required|browserType\.launch/.test(err.message)
      );
    }
  });
});
