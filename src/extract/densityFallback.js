import { JSDOM } from "jsdom";

const BLOCK_TAGS = new Set([
  "p", "div", "article", "section", "blockquote",
  "li", "td", "th", "pre", "figcaption",
]);

const MIN_BLOCK_SCORE = 50;

/**
 * Density-based fallback extractor.
 * Segments HTML into blocks, scores each by text density,
 * and combines high-scoring blocks.
 */
export function densityFallback(html, url) {
  const dom = new JSDOM(html, url ? { url } : {});
  const document = dom.window.document;

  // Remove non-content elements
  for (const tag of ["script", "style", "nav", "footer", "header", "aside"]) {
    for (const el of document.querySelectorAll(tag)) {
      el.remove();
    }
  }

  const blocks = collectBlocks(document.body);
  const scored = blocks.map(scoreBlock).filter((b) => b.score >= MIN_BLOCK_SCORE);

  const text = scored.map((b) => b.text).join("\n\n");
  const title = document.querySelector("title")?.textContent?.trim() || "";

  return { title, content: text };
}

/**
 * Collect text blocks from the DOM tree.
 */
function collectBlocks(root) {
  const blocks = [];
  if (!root) return blocks;

  for (const child of root.children) {
    const tag = child.tagName.toLowerCase();

    if (BLOCK_TAGS.has(tag)) {
      const text = child.textContent.trim();
      if (text) {
        blocks.push({ element: child, text });
      }
    } else if (child.children.length > 0) {
      blocks.push(...collectBlocks(child));
    }
  }

  return blocks;
}

/**
 * Compute density score for a text block.
 * score = text_length + sentence_count * 20 - link_count * 50
 */
function scoreBlock(block) {
  const textLength = block.text.length;
  const sentenceCount = (block.text.match(/[.!?]+/g) || []).length;
  const linkCount = block.element.querySelectorAll("a").length;

  const score = textLength + sentenceCount * 20 - linkCount * 50;

  return { text: block.text, score };
}
