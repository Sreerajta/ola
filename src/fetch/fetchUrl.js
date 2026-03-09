import { readFileSync } from "node:fs";
import { readStdin } from "./readStdin.js";

/**
 * Fetch HTML from a URL, file, or stdin.
 */
export async function fetchHtml(source) {
  if (source.type === "url") {
    const res = await fetch(source.value);
    if (!res.ok) {
      throw new Error(`Fetch failed: ${res.status} ${res.statusText}`);
    }
    return await res.text();
  }

  if (source.type === "file") {
    return readFileSync(source.value, "utf-8");
  }

  if (source.type === "stdin") {
    return await readStdin();
  }

  throw new Error(`Unknown source type: ${source.type}`);
}
