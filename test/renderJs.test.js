import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { renderJs } from "../src/fetch/renderJs.js";

describe("renderJs", () => {
  it("throws when playwright is missing or browsers are not installed", async () => {
    // Should throw either because playwright isn't installed,
    // or because browser binaries haven't been downloaded
    await assert.rejects(() => renderJs("https://example.com"));
  });
});
