import { Readability } from "@mozilla/readability";
import { JSDOM } from "jsdom";

/**
 * Extract article content using Mozilla Readability.
 * Returns { title, content } where content is the readable HTML.
 */
export function extractWithReadability(html, url) {
  const opts = url ? { url } : {};
  const dom = new JSDOM(html, opts);
  const reader = new Readability(dom.window.document);
  const article = reader.parse();

  if (!article) {
    return null;
  }

  return {
    title: article.title,
    content: article.content,
  };
}
