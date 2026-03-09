import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { renderJs } from "../src/fetch/renderJs.js";

describe("renderJs", () => {
  it("throws a helpful error when playwright is not installed", async () => {
    // Playwright is not a dependency, so this should fail with guidance
    await assert.rejects(() => renderJs("https://example.com"), {
      message: /Playwright is required/,
    });
  });
});
