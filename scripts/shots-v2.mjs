import puppeteer from 'puppeteer-core';
import { mkdirSync } from 'node:fs';
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const OUT = 'C:/Users/guibu/AppData/Local/Temp/opencode/themes';
mkdirSync(OUT, { recursive: true });
const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--window-size=1440,900'] });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
const delays = ms => new Promise(r => setTimeout(r, ms));
const click = txt => page.evaluate(t => {
  const els = Array.from(document.querySelectorAll('button, a'));
  const b = els.find(e => (e.textContent || '').trim().includes(t));
  if (b) { b.click(); return true; }
  return false;
}, txt);
const errors = [];
page.on('pageerror', e => errors.push(String(e)));

await page.goto('http://localhost:5199', { waitUntil: 'networkidle2', timeout: 30000 });
await delays(1500);
await page.screenshot({ path: `${OUT}/v2-picker.png` });

await click('EXPLORAR');
await delays(1100);
await page.screenshot({ path: `${OUT}/v2-catalog-roca.png` });

await click('Leona');
await delays(900);
await page.evaluate(() => window.scrollTo(0, 0));
await delays(300);
await page.screenshot({ path: `${OUT}/v2-catalog-leona.png` });

await click('VER PROPIEDAD');
await delays(900);
await page.evaluate(() => window.scrollTo(0, 900));
await delays(300);
await page.screenshot({ path: `${OUT}/v2-publication-leona.png` });
await page.evaluate(() => window.scrollTo(0, 0));
await delays(300);
await click('+ COMPARAR');
await delays(250);
await click('← Listado');
await delays(600);
await click('+ COMPARAR');
await delays(350);
await click('COMPARÁ (2)');
await delays(800);
await page.screenshot({ path: `${OUT}/v2-compare-leona.png` });

await click('↺ Seleccionar demo');
await delays(600);
await click('INGRESAR');
await delays(700);
await click('Navarro');
await delays(400);
await click('Ingresar');
await delays(1000);
await click('Inteligencia');
await delays(600);
await click('Comparación');
await delays(600);
await page.screenshot({ path: `${OUT}/v2-panel-intel.png` });

console.log('shots saved to', OUT, '\nerrors:', errors.length, errors.join(' | '));
await browser.close();