import puppeteer from 'puppeteer-core';
import { PNG } from 'pngjs';
import { writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const BASE = process.env.BASE_URL || 'http://localhost:5199';
const OUT = process.env.OUT_DIR;
const delays = ms => new Promise(r => setTimeout(r, ms));

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--no-sandbox', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--window-size=1440,900'],
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
const errs = [];
page.on('pageerror', e => errs.push(String(e)));

await page.goto(BASE, { waitUntil: 'networkidle2', timeout: 30000 });
await delays(2500);
await page.click('button[aria-label*="Comenzar recorrido"]');
await delays(4500);

if (OUT) {
  mkdirSync(OUT, { recursive: true });
  const tour = await page.screenshot();
  writeFileSync(path.join(OUT, 'tour-salon.png'), tour);
  const png = PNG.sync.read(tour);
  const grid = 3, dark = [];
  for (let gy = 0; gy < grid; gy++) for (let gx = 0; gx < grid; gx++) {
    let d = 0, n = 0;
    for (let y = Math.floor(gy / grid * png.height); y < Math.floor((gy + 1) / grid * png.height); y += 6)
      for (let x = Math.floor(gx / grid * png.width); x < Math.floor((gx + 1) / grid * png.width); x += 6) {
        const i = (y * png.width + x) * 4; n++;
        if (png.data[i] < 8 && png.data[i + 1] < 8 && png.data[i + 2] < 8) d++;
      }
    dark.push(Math.round(100 * d / n));
  }
  console.log('tour dark% 3x3:', JSON.stringify(dark));

  await page.evaluate(() => { document.querySelector('button[aria-label="Ver plano interactivo"]')?.click(); });
  await delays(700);
  writeFileSync(path.join(OUT, 'floorplan.png'), await page.screenshot());

  const rooms = await page.evaluate(() => {
    const out = [];
    document.querySelectorAll('.floorplan-room').forEach(g => {
      const r = g.querySelector('rect').getBoundingClientRect();
      const t = g.querySelector('text');
      out.push({ w: +r.width.toFixed(0), h: +r.height.toFixed(0), label: t?.textContent });
    });
    return out;
  });
  console.log('floorplan rooms:', JSON.stringify(rooms));
}

console.log('console errors:', errs.length ? errs : 'clean');
await browser.close();