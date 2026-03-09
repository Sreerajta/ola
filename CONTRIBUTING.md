# Contributing to ola

## Setup

```bash
git clone https://github.com/yourname/ola.git
cd ola
npm install
```

## Running

```bash
# Run against a local HTML file
node src/cli/ola.js examples/sample.html

# Run against a URL
node src/cli/ola.js https://en.wikipedia.org/wiki/Octopus

# Pipe from stdin
curl -s https://example.com | node src/cli/ola.js
```

## Testing

Tests use Node's built-in test runner. No extra test framework needed.

```bash
npm test
```

Each source module has a matching test file:

| Source | Test |
|--------|------|
| `src/input/detectSource.js` | `test/detectSource.test.js` |
| `src/clean/cleanText.js` | `test/cleanText.test.js` |
| `src/format/splitParagraphs.js` | `test/splitParagraphs.test.js` |
| `src/format/outputText.js` | `test/output.test.js` |
| `src/format/outputJson.js` | `test/output.test.js` |
| `src/extract/readability.js` | `test/readability.test.js` |
| `src/extract/densityFallback.js` | `test/densityFallback.test.js` |
| `src/detect/detectJsPage.js` | `test/detectJsPage.test.js` |
| `src/fetch/renderJs.js` | `test/renderJs.test.js` |

## Adding a New Extractor

ola uses a fallback chain for extraction. To add a new strategy:

1. Create `src/extract/yourExtractor.js`
2. Export a single function: `yourExtractor(html, url) → { title, content }`
3. Wire it into the pipeline in `src/pipeline/extractText.js`
4. Add tests in `test/yourExtractor.test.js`
5. Run `npm test` to verify

## Adding a New Output Format

1. Create `src/format/outputFoo.js`
2. Export a function: `outputFoo({ title, paragraphs }) → string`
3. Add the `--foo` flag in `src/cli/ola.js`
4. Add tests in `test/output.test.js` or a new test file

## Coding Guidelines

- **Small modules**: Keep files between 30–70 lines
- **One export per module**: Each file has one clear responsibility
- **Explicit pipelines**: No hidden state, no magic. Each step takes input and returns output
- **No abstractions**: No base classes, no plugin systems, no middleware patterns
- **Minimal dependencies**: Justify any new `npm install`
- **Readable over clever**: If it takes a comment to explain, simplify the code instead
- **Tests required**: Every new module needs a test file

## Commit Style

- Use present tense: "add markdown output" not "added markdown output"
- Keep the first line under 72 characters
- Reference issues when applicable: "fix title extraction (#12)"
