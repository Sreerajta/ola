import { existsSync } from "node:fs";

/**
 * Detect whether input is a URL, file path, or stdin.
 * Returns { type, value } where type is "url" | "file" | "stdin".
 */
export function detectSource(input) {
  if (!input) {
    return { type: "stdin" };
  }

  if (/^https?:\/\//i.test(input)) {
    return { type: "url", value: input };
  }

  if (existsSync(input)) {
    return { type: "file", value: input };
  }

  throw new Error(`Unknown input: "${input}" is not a URL or existing file`);
}
