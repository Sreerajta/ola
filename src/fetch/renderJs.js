/**
 * Render a page with headless Chromium via Playwright.
 * Playwright is lazy-loaded to avoid heavy dependencies for normal usage.
 * Uses stealth settings to avoid bot detection.
 */
export async function renderJs(url) {
  let chromium;
  try {
    ({ chromium } = await import("playwright"));
  } catch {
    throw new Error(
      "Playwright is required for --render-js. Install it with: npm install playwright"
    );
  }

  const browser = await chromium.launch({
    headless: true,
    args: [
      "--disable-blink-features=AutomationControlled",
    ],
  });

  try {
    const context = await browser.newContext({
      userAgent:
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    });

    const page = await context.newPage();

    // Remove the webdriver flag that bot detectors check
    await page.addInitScript(() => {
      Object.defineProperty(navigator, "webdriver", { get: () => false });
    });

    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });

    // Wait for JS frameworks to render content
    await page.waitForTimeout(3000);

    return await page.content();
  } finally {
    await browser.close();
  }
}
