import test from "node:test";
import { chromium } from "playwright";
import dotenv from "dotenv";
import assert from "assert";
dotenv.config();

// Optional: If you'd like to disable webgl, true is the default.
chromium.setGraphicsMode = true;


const viewport = {
  deviceScaleFactor: 1,
  hasTouch: false,
  height: 1080,
  isLandscape: true,
  isMobile: false,
  width: 1920,
};
const browser = await chromium.connectOverCDP(`wss://production-sfo.browserless.io?token=${process.env.BROWSERLESS_TOKEN}`);
const page = await browser.newPage();
await page.goto("https://example.com");
const pageTitle = await page.title();
console.log(pageTitle);
console.log(await page.content());
await browser.close();