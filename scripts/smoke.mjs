import puppeteer from 'puppeteer-core';
import { PNG } from 'pngjs';

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const BASE = process.env.BASE_URL || 'http://localhost:5199';

const results = [];
const report = (ok, name, detail = '') => {
  results.push({ ok, name, detail });
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? ' — ' + detail : ''}`);
};
const delays = ms => new Promise(r => setTimeout(r, ms));

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--window-size=1440,900'],
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });

const consoleErrors = [];
page.on('console', m => { if (m.type() === 'error') consoleErrors.push(m.text().slice(0, 300)); });
page.on('pageerror', err => consoleErrors.push('pageerror: ' + String(err).slice(0, 300)));

const indicatorText = () =>
  page.evaluate(() => {
    const el = document.querySelector('.glass .font-display');
    return el ? el.textContent : null;
  });

const luminance = async () => {
  const png = PNG.sync.read(await page.screenshot());
  let sum = 0, n = 0, nonBlack = 0;
  for (let i = 0; i < png.data.length; i += 4) {
    const lum = 0.2126 * png.data[i] + 0.7152 * png.data[i + 1] + 0.0722 * png.data[i + 2];
    sum += lum; n++;
    if (lum > 8) nonBlack++;
  }
  return { mean: +(sum / n).toFixed(1), pct: +((nonBlack / n) * 100).toFixed(1) };
};

try {
  const resp = await page.goto(BASE, { waitUntil: 'networkidle2', timeout: 30000 });
  report(resp.ok() || resp.status() === 304, 'Landing carga', `status=${resp.status()}`);
  report((await page.title()).includes('ScanHouse'), 'Title de la landing');

  const enterBtn = await page.$('button[aria-label*="Comenzar recorrido"]');
  report(enterBtn !== null, 'Botón ENTRAR A LA PROPIEDAD presente');
  await delays(4500);

  const btn = await page.$('button[aria-label*="Comenzar recorrido"]');
  if (btn) await btn.click();
  await delays(2500);

  report((await page.$('.pnlm-container')) !== null, 'Pannellum contenedor montado');
  const canvasInfo = await page.evaluate(() => {
    const c = document.querySelector('.pnlm-render-container canvas');
    const container = document.querySelector('.pnlm-container');
    const r = container ? container.getBoundingClientRect() : { width: 0, height: 0 };
    return c
      ? { w: c.width, h: c.height, containerW: Math.round(r.width), containerH: Math.round(r.height) }
      : null;
  });
  report(!!canvasInfo && canvasInfo.h > 0, 'Canvas WebGL con alto > 0', JSON.stringify(canvasInfo));

  const lum = await luminance();
  report(lum.pct > 55 && lum.mean > 20, 'Panorama visible (píxeles renderizados)', JSON.stringify(lum));

  const errorBox = await page.evaluate(() => {
    const el = document.querySelector('.pnlm-error-msg');
    return el ? (el.style.display !== 'none' && getComputedStyle(el).display !== 'none') : false;
  });
  report(!errorBox, 'Sin error de Pannellum (imagen cargada)');

  const hotspots = await page.$$('.pnlm-hotspot-base');
  report(hotspots.length >= 3, `Hotspots renderizados (${hotspots.length})`);
  report((await page.$('button[aria-label="Siguiente ambiente"]')) !== null, 'Controles de navegación presentes');

  const i0 = await indicatorText();
  report(!!i0 && /^01 \/ /.test(i0), `Indicator inicial (${i0})`);

  await page.click('button[aria-label="Siguiente ambiente"]');
  await delays(350);
  await page.click('button[aria-label="Siguiente ambiente"]');
  await delays(900);

  const i2 = await indicatorText();
  report(!!i2 && /^03 \/ /.test(i2), `Navegación siguiente x2 (${i2})`);

  await page.click('button[aria-label="Ir a BAÑO"]');
  await delays(1400);
  const iBano = await indicatorText();
  report(!!iBano && iBano.includes('BAÑO'), `Navegación por puntos → BAÑO (${iBano})`);

  await page.click('button[aria-label="Abrir asistente IA"]');
  await delays(500);
  report((await page.$('#assistant-title')) !== null, 'Asistente IA abre');
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button[aria-label="Cerrar asistente"]'))
      .find(b => b.closest('[role="dialog"]')) || document.querySelector('button[aria-label="Cerrar asistente"]');
    btn?.click();
  });
  await delays(700);

  await page.click('button[aria-label*="Me interesa esta propiedad"]');
  await delays(500);
  report((await page.$('#lead-form-title')) !== null, 'Formulario de lead abre');

  report(consoleErrors.length === 0, 'Sin errores de consola', consoleErrors.join(' | ') || 'clean');

  const failed = results.filter(r => !r.ok);
  console.log(`\n${results.length - failed.length}/${results.length} checks OK`);
  if (failed.length) {
    failed.forEach(f => console.log(`  - ${f.name}${f.detail ? ' :: ' + f.detail : ''}`));
    process.exitCode = 1;
  }
} finally {
  await browser.close();
}