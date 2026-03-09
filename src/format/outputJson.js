/**
 * Format extracted article as JSON with title and paragraphs.
 */
export function outputJson(result) {
  return JSON.stringify(
    { title: result.title, paragraphs: result.paragraphs },
    null,
    2
  ) + "\n";
}
