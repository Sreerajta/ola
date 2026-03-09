/**
 * Render a page with headless Chromium via Playwright.
 * Playwright is lazy-loaded to avoid heavy dependencies for normal usage.
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

  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle" });
    return await page.content();
  } finally {
    await browser.close();
  }
}
