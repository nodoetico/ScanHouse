import puppeteer from 'puppeteer-core';
import { mkdirSync } from 'fs';
import { join } from 'path';

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const OUT = 'C:/Users/guibu/AppData/Local/Temp/opencode/themes';
mkdirSync(OUT, { recursive: true });

const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--window-size=1440,900'] });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
const delays = ms => new Promise(r => setTimeout(r, ms));

await page.goto('http://localhost:5199', { waitUntil: 'networkidle2', timeout: 30000 });
await delays(1600);
await page.evaluate(() => Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Panel de gestión'))?.click());
await delays(800);

const agencies = ['Roca', 'Remax', 'Leona', 'Emilia', 'Navarro', 'Agostini'];
for (const name of agencies) {
  await page.evaluate(n => Array.from(document.querySelectorAll('button')).find(b => b.title?.includes(n))?.click(), name);
  await delays(400);
  await page.screenshot({ path: join(OUT, `login-${name.toLowerCase()}.png`) });
  await page.evaluate(() => Array.from(document.querySelectorAll('button')).find(b => b.textContent.trim() === 'Ingresar')?.click());
  await delays(1100);
  await page.screenshot({ path: join(OUT, `panel-${name.toLowerCase()}.png`) });
  await page.evaluate(() => Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Cerrar sesión'))?.click());
  await delays(700);
}
console.log('Screenshots en ' + OUT);
await browser.close();