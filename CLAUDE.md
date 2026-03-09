# CLAUDE.md — AI Contributor Guide

## Project Purpose

ola extracts clean, readable article text from web pages. It is "Safari Reader Mode for CLI pipelines." It outputs plain text optimized for piping and downstream processing.

ola does NOT summarize, analyze, rank, or use AI. It only extracts readable text.

## Pipeline Architecture

Every extraction follows this pipeline:

```
detectSource → fetchHtml → detectJsPage → (renderJs) → extractWithReadability → (densityFallback) → cleanText → splitParagraphs
```

The pipeline is defined in `src/pipeline/extractText.js`. Each step is a separate module with a single exported function.

## Module Map

```
src/
  cli/ola.js                  CLI entry point — parses args, calls extractText, formats output
  pipeline/extractText.js     Pipeline orchestrator — wires all steps together
  input/detectSource.js       Classifies input as "url", "file", or "stdin"
  fetch/fetchUrl.js           Fetches HTML from URL, file, or stdin
  fetch/readStdin.js          Reads all data from stdin
  fetch/renderJs.js           Headless Chromium rendering (lazy-loads Playwright)
  detect/detectJsPage.js      Heuristic JS-page detection
  extract/readability.js      Mozilla Readability wrapper
  extract/densityFallback.js  Density-scored block extraction (fallback)
  clean/cleanText.js          HTML-to-text conversion, entity decoding, whitespace normalization
  format/splitParagraphs.js   Split on double newlines, filter short fragments
  format/outputText.js        Plain text output formatter
  format/outputJson.js        JSON output formatter
```

## Coding Style

- Small modules: 30–70 lines each
- One exported function per module
- Explicit pipelines — each step's input and output is clear
- No class hierarchies, no framework abstractions
- Readable code over clever code
- Minimal dependencies — only `@mozilla/readability` and `jsdom` are required

## Running

```bash
npm install
npm test          # runs all tests with node:test
node src/cli/ola.js examples/sample.html   # manual test
```

## Tests

Tests live in `test/*.test.js` and use Node's built-in test runner (`node:test`). Each module has its own test file. Run with `npm test`.

## Adding a New Extractor

1. Create `src/extract/yourExtractor.js` with a single exported function
2. The function takes `(html, url)` and returns `{ title, content }`
3. Wire it into `src/pipeline/extractText.js` as a fallback step
4. Add `test/yourExtractor.test.js`

## Adding a New Output Format

1. Create `src/format/outputFoo.js` exporting a function that takes `{ title, paragraphs }`
2. Add the `--foo` flag in `src/cli/ola.js`

## Rules

- Do not add AI, summarization, or content analysis
- Do not add complex abstractions or class hierarchies
- Do not add dependencies without strong justification
- Keep every module under 70 lines
- Every new module needs a test file
