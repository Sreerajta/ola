/**
 * Detect signals that a page requires JavaScript rendering.
 * Returns true if the HTML looks like a JS-rendered shell.
 */
export function detectJsPage(html) {
  if (html.length < 5000) return true;

  if (/<div\s+id=["']root["']\s*>/i.test(html)) return true;

  const scriptCount = (html.match(/<script[\s>]/gi) || []).length;
  if (scriptCount > 20) return true;

  const paragraphs = html.match(/<p[\s>]/gi) || [];
  if (paragraphs.length === 0) return true;

  return false;
}
