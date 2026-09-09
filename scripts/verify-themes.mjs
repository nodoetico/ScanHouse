import puppeteer from 'puppeteer-core';
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--window-size=1440,900'] });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
const delays = ms => new Promise(r => setTimeout(r, ms));
const results = [];
const report = (ok, name, detail = '') => { results.push(ok); console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? ' — ' + detail : ''}`); };
const errors = [];
page.on('pageerror', e => errors.push(String(e)));

const agencies = ['Roca', 'Remax', 'Leona', 'Emilia', 'Navarro', 'Agostini'];

await page.goto('http://localhost:5199', { waitUntil: 'networkidle2', timeout: 30000 });
await delays(1600);
await page.evaluate(() => Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Panel de gestión'))?.click());
await delays(800);

const themes = [];
for (const name of agencies) {
  await page.evaluate(n => Array.from(document.querySelectorAll('button')).find(b => b.title?.includes(n))?.click(), name);
  await delays(350);
  const loginBg = await page.evaluate(() => getComputedStyle(document.querySelector('div[class*="--sh-bg"]')).backgroundColor);
  await page.evaluate(() => Array.from(document.querySelectorAll('button')).find(b => b.textContent.trim() === 'Ingresar')?.click());
  await delays(1100);
  const panel = await page.evaluate(() => {
    const root = document.querySelector('#root div[class*="--sh-bg"]');
    const aside = root?.querySelector('aside');
    const btn = Array.from(root?.querySelectorAll('button') ?? []).find(b => b.textContent.trim() === 'Ver experiencia');
    return {
      bg: getComputedStyle(root).backgroundColor,
      sidebarBg: aside ? getComputedStyle(aside).backgroundColor : 'n/a',
      primaryBtn: btn ? getComputedStyle(btn).color : 'n/a',
      btnBg: btn ? getComputedStyle(btn).backgroundColor : 'n/a',
    };
  });
  themes.push({ name, loginBg, ...panel });
  await page.evaluate(() => Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Cerrar sesión'))?.click());
  await delays(700);
}

console.log('\n' + JSON.stringify(themes, null, 2));
const distinct = new Set(themes.map(t => t.loginBg + '|' + t.bg));
report(distinct.size === agencies.length, 'Fondo distinto por agencia (sin duplicados)', `${distinct.size} temas únicos`);
report(errors.length === 0, 'Sin page errors', errors.join(' | '));
console.log(`\n${results.filter(Boolean).length}/${results.length} OK`);
await browser.close();
process.exitCode = results.every(Boolean) ? 0 : 1;