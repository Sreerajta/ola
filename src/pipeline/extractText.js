import { detectSource } from "../input/detectSource.js";
import { fetchHtml } from "../fetch/fetchUrl.js";
import { detectJsPage } from "../detect/detectJsPage.js";
import { renderJs } from "../fetch/renderJs.js";
import { extractWithReadability } from "../extract/readability.js";
import { densityFallback } from "../extract/densityFallback.js";
import { cleanText } from "../clean/cleanText.js";
import { splitParagraphs } from "../format/splitParagraphs.js";

const WEAK_PARAGRAPH_COUNT = 2;
const WEAK_TEXT_LENGTH = 500;

/**
 * Check if a readability result is too weak to use.
 */
function isWeakResult(article, paragraphs) {
  if (!article) return true;
  if (paragraphs.length < WEAK_PARAGRAPH_COUNT) return true;
  if (paragraphs.join("").length < WEAK_TEXT_LENGTH) return true;
  return false;
}

/**
 * Main extraction pipeline.
 *
 * fetch HTML → detect JS requirement → (optional) render JS
 * → extract via Readability → if weak → density fallback
 * → clean text → split paragraphs
 */
export async function extractText(input, options = {}) {
  const source = detectSource(input);
  const url = source.type === "url" ? source.value : undefined;

  let html = await fetchHtml(source);

  // Detect JS-heavy pages and warn or render
  if (url && detectJsPage(html)) {
    if (options.renderJs) {
      html = await renderJs(url);
    } else {
      options.onJsDetected?.();
    }
  }

  // Primary extraction: Readability
  const article = extractWithReadability(html, url);

  let cleaned = article ? cleanText(article.content) : "";
  let paragraphs = splitParagraphs(cleaned);

  // Fallback: density-based extraction
  if (isWeakResult(article, paragraphs)) {
    const fallback = densityFallback(html, url);
    const fallbackCleaned = cleanText(fallback.content);
    const fallbackParagraphs = splitParagraphs(fallbackCleaned);

    if (fallbackParagraphs.length > paragraphs.length) {
      cleaned = fallbackCleaned;
      paragraphs = fallbackParagraphs;
      return {
        title: article?.title || fallback.title,
        paragraphs,
      };
    }
  }

  if (paragraphs.length === 0) {
    throw new Error("Could not extract article content");
  }

  return {
    title: article?.title || "",
    paragraphs,
  };
}
