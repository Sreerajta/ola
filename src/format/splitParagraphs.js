const MIN_PARAGRAPH_LENGTH = 40;

/**
 * Check if a paragraph looks like a footnote or reference entry.
 * Wikipedia refs start with "^" after extraction.
 */
function isReference(text) {
  if (text.startsWith("^")) return true;
  if (/^\^?\s*[a-z]\s+[a-z]\s/i.test(text)) return true;
  if (/^"[^"]{0,20}"\.\s/.test(text) && /Retrieved/.test(text)) return true;
  return false;
}

/**
 * Check if a paragraph looks like a Wikipedia external link,
 * see-also entry, or boilerplate sidebar text.
 */
function isExternalLink(text) {
  if (/^Wikimedia Commons has media/i.test(text)) return true;
  if (/Archived .+ at the Wayback Machine/i.test(text)) return true;
  if (/^"[^"]+" at /.test(text)) return true;

  // "Title – short description" (see-also style, single line, no period)
  if (/^[^.!?]+ [–—] [^.!?]+$/.test(text)) return true;

  // "Title at the Site Name" (short external link, no sentences)
  if (text.length < 120 && /at the [A-Z]/.test(text) && !/[.!?]/.test(text)) return true;

  return false;
}

/**
 * Split text into paragraphs on double newlines.
 * Filters out short paragraphs (< 40 chars) and reference entries.
 */
export function splitParagraphs(text) {
  return text
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter((p) => p.length >= MIN_PARAGRAPH_LENGTH)
    .filter((p) => !isReference(p))
    .filter((p) => !isExternalLink(p));
}
