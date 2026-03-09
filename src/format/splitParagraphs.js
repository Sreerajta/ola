const MIN_PARAGRAPH_LENGTH = 40;

/**
 * Split text into paragraphs on double newlines.
 * Filters out short paragraphs (< 40 chars) and trims whitespace.
 */
export function splitParagraphs(text) {
  return text
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter((p) => p.length >= MIN_PARAGRAPH_LENGTH);
}
