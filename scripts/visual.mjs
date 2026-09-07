import puppeteer from 'puppeteer-core';
import { PNG } from 'pngjs';

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const BASE = process.env.BASE_URL || 'http://localhost:5199';
const delays = ms => new Promise(r => setTimeout(r, ms));

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--no-sandbox', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--window-size=1440,900'],
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });

const errs = [];
page.on('console', m => { if (m.type() === 'error') errs.push(m.text().slice(0, 250)); });
page.on('pageerror', e => errs.push('pageerror: ' + String(e).slice(0, 300)));

async function analyze() {
  const shot = await page.screenshot();
  const png = PNG.sync.read(shot);
  let sum = 0, n = 0, nonBlack = 0;
  for (let i = 0; i < png.data.length; i += 4) {
    const lum = 0.2126 * png.data[i] + 0.7152 * png.data[i + 1] + 0.0722 * png.data[i + 2];
    sum += lum; n++;
    if (lum > 8) nonBlack++;
  }
  return { mean: (sum / n).toFixed(1), nonBlackPct: ((nonBlack / n) * 100).toFixed(1) };
}

await page.goto(BASE, { waitUntil: 'networkidle2', timeout: 30000 });
await delays(4500);
await page.click('button[aria-label*="Comenzar recorrido"]');
await delays(4000);

const info = await page.evaluate(() => {
  const c = document.querySelector('.pnlm-render-container canvas');
  const err = document.querySelector('.pnlm-error-msg');
  const container = document.querySelector('.pnlm-container');
  const loadBtn = document.querySelector('.pnlm-load-button');
  return {
    canvasW: c ? c.width : null,
    canvasH: c ? c.height : null,
    containerRect: container ? (() => { const r = container.getBoundingClientRect(); return { w: r.width, h: r.height }; })() : null,
    errorVisible: err ? getComputedStyle(err).display !== 'none' : false,
    errorText: err ? err.textContent : null,
    loadBtnVisible: loadBtn ? getComputedStyle(loadBtn).display !== 'none' : false,
    pnlmHotspots: document.querySelectorAll('.pnlm-hotspot-base').length,
  };
});
console.log('tour DOM info:', JSON.stringify(info));
console.log('tour screenshot:', JSON.stringify(await analyze()));

console.log('console errors:', errs.length ? errs : 'clean');

await delays(3000);
console.log('after +3s screenshot:', JSON.stringify(await analyze()));
await browser.close();