/**
 * Format extracted article as plain text paragraphs
 * separated by blank lines.
 */
export function outputText(result) {
  return result.paragraphs.join("\n\n") + "\n";
}
