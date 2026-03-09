# ola 🌴

*ola* (Malayalam: wave / page) — Safari Reader Mode for CLI pipelines.

Extract clean, readable article text from web pages and documents. Outputs plain text optimized for CLI pipelines and downstream processing.

## Built with LLMs

This project is built and maintained using Claude and other LLMs. The codebase, tests, documentation, and architecture were all developed through AI-assisted engineering.

If you're contributing, you're expected to use LLMs as part of your workflow. See [CLAUDE.md](CLAUDE.md) for the AI contributor guide. If building with LLMs isn't your thing, this project is probably not for you.

## Installation

```bash
git clone git@github.com:Sreerajta/ola.git
cd ola
npm install
npm link
```

## Usage

```bash
# Extract article text from a URL
ola https://en.wikipedia.org/wiki/Octopus

# Print only the title
ola --title https://en.wikipedia.org/wiki/Octopus

# Output as JSON
ola --json https://en.wikipedia.org/wiki/Octopus

# Read from a local HTML file
ola page.html

# Pipe from curl
curl -s https://en.wikipedia.org/wiki/Octopus | ola

# Render JavaScript-heavy pages (requires playwright)
ola --render-js https://medium.com/some-article
```

### Options

| Flag | Description |
|------|-------------|
| `--title` | Print only the article title |
| `--json` | Output as JSON (`{ title, paragraphs }`) |
| `--render-js` | Render JavaScript with headless Chromium |

### Output

Default output is plain text paragraphs separated by blank lines:

```
Octopuses are soft-bodied cephalopods belonging to the order Octopoda.

They have three hearts and blue blood due to hemocyanin.
```

With `--json`:

```json
{
  "title": "Octopus - Wikipedia",
  "paragraphs": [
    "Octopuses are soft-bodied cephalopods...",
    "They have three hearts..."
  ]
}
```

With `--title`:

```
Octopus - Wikipedia
```

## Architecture

```
input (URL / file / stdin)
       │
       ▼
  fetch HTML
       │
       ▼
  JS detection ──── warns if JS-heavy page detected
       │
       ▼
  (optional) JS rendering via Playwright
       │
       ▼
  Readability extraction
       │
       ▼
  weak result? ──── yes ──► density fallback
       │                          │
       ▼                          ▼
  clean text ◄────────────────────┘
       │
       ▼
  split paragraphs
       │
       ▼
  output (text / JSON / title)
```

### Modules

| Module | File | Responsibility |
|--------|------|----------------|
| Input detection | `src/input/detectSource.js` | Classify input as URL, file, or stdin |
| HTML fetch | `src/fetch/fetchUrl.js` | Fetch HTML from any source |
| Stdin reader | `src/fetch/readStdin.js` | Read piped input |
| JS rendering | `src/fetch/renderJs.js` | Headless Chromium via Playwright |
| JS detection | `src/detect/detectJsPage.js` | Detect JS-rendered page shells |
| Readability | `src/extract/readability.js` | Mozilla Readability extraction |
| Density fallback | `src/extract/densityFallback.js` | Score-based block extraction |
| Text cleaning | `src/clean/cleanText.js` | Strip HTML artifacts, normalize whitespace |
| Paragraph split | `src/format/splitParagraphs.js` | Split and filter paragraphs |
| Text output | `src/format/outputText.js` | Plain text formatter |
| JSON output | `src/format/outputJson.js` | JSON formatter |
| Pipeline | `src/pipeline/extractText.js` | Orchestrate the full pipeline |
| CLI | `src/cli/ola.js` | Parse args, drive pipeline, format output |

## Examples

See the [`examples/`](examples/) directory for runnable scripts:

- `wiki.sh` — extract a Wikipedia article
- `title.sh` — print just the title
- `json.sh` — structured JSON output
- `pipe.sh` — pipe from curl
- `local.sh` — extract from a local HTML file

## Development

```bash
git clone git@github.com:Sreerajta/ola.git
cd ola
npm install
npm test
```

## License

MIT
