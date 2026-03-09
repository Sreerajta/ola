#!/usr/bin/env node

import { extractText } from "../pipeline/extractText.js";
import { outputText } from "../format/outputText.js";
import { outputJson } from "../format/outputJson.js";

function parseArgs(argv) {
  const args = argv.slice(2);
  return {
    json: args.includes("--json"),
    renderJs: args.includes("--render-js"),
    titleOnly: args.includes("--title"),
    input: args.find((a) => !a.startsWith("--")) || null,
  };
}

async function main() {
  const flags = parseArgs(process.argv);

  if (!flags.input && process.stdin.isTTY) {
    console.error("Usage: ola [options] <url|file>");
    console.error("       curl <url> | ola [options]");
    console.error("");
    console.error("Options:");
    console.error("  --title       Print only the article title");
    console.error("  --json        Output as JSON");
    console.error("  --render-js   Render JavaScript with headless browser");
    process.exit(1);
  }

  const options = {
    renderJs: flags.renderJs,
    onJsDetected() {
      console.error(
        "This page may require JavaScript rendering. Try: ola --render-js " +
          (flags.input || "URL")
      );
    },
  };

  try {
    const result = await extractText(flags.input, options);

    if (flags.titleOnly) {
      process.stdout.write((result.title || "Untitled") + "\n");
      return;
    }

    const output = flags.json ? outputJson(result) : outputText(result);
    process.stdout.write(output);
  } catch (err) {
    console.error(`ola: ${err.message}`);
    process.exit(1);
  }
}

main();
