/**
 * Clean extracted text by removing HTML artifacts,
 * script remnants, and excessive whitespace.
 */
export function cleanText(text) {
  let cleaned = text;

  // Convert block-level closing tags to double newlines
  cleaned = cleaned.replace(/<\/(p|div|article|section|h[1-6]|li|blockquote)>/gi, "\n\n");

  // Remove remaining HTML tags
  cleaned = cleaned.replace(/<[^>]+>/g, "");

  // Decode common HTML entities
  cleaned = cleaned.replace(/&amp;/g, "&");
  cleaned = cleaned.replace(/&lt;/g, "<");
  cleaned = cleaned.replace(/&gt;/g, ">");
  cleaned = cleaned.replace(/&quot;/g, '"');
  cleaned = cleaned.replace(/&#39;/g, "'");
  cleaned = cleaned.replace(/&nbsp;/g, " ");

  // Remove script/style remnants
  cleaned = cleaned.replace(/\/\*[\s\S]*?\*\//g, "");
  cleaned = cleaned.replace(/\bfunction\s*\([^)]*\)\s*\{[^}]*\}/g, "");

  // Normalize whitespace within lines
  cleaned = cleaned.replace(/[ \t]+/g, " ");

  // Normalize line breaks: collapse 3+ newlines into 2
  cleaned = cleaned.replace(/\n{3,}/g, "\n\n");

  // Trim each line
  cleaned = cleaned
    .split("\n")
    .map((line) => line.trim())
    .join("\n");

  return cleaned.trim();
}
