import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";
import { executablePath } from "puppeteer-core";

/**
 * Launches Puppeteer (using Sparticuz Chromium for Vercel/AWS)
 * and returns the page title for the given URL.
 */
export async function handler(event) {
  let browser = null;

  try {
    // Launch Puppeteer
    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
    });

    const page = await browser.newPage();
    await page.goto(event.url || "https://example.com");

    const result = await page.title();

    return {
      statusCode: 200,
      body: JSON.stringify({ title: result }),
    };
  } catch (error) {
    console.error("Puppeteer error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

handler({ url: "https://example.com" });