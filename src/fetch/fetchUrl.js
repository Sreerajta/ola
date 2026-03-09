import { readFileSync } from "node:fs";
import { readStdin } from "./readStdin.js";

const HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (compatible; ola/0.1; +https://github.com/Sreerajta/ola)",
  Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.5",
};

/**
 * Fetch HTML from a URL, file, or stdin.
 */
export async function fetchHtml(source) {
  if (source.type === "url") {
    const res = await fetch(source.value, { headers: HEADERS });
    if (!res.ok) {
      const hint =
        res.status === 403
          ? ". This site may block automated requests. Try: ola --render-js URL"
          : "";
      throw new Error(`Fetch failed: ${res.status} ${res.statusText}${hint}`);
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
