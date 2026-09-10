import puppeteer from 'puppeteer-core';
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--window-size=1440,900'] });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
const errors = [];
page.on('pageerror', e => errors.push(String(e)));
const delays = ms => new Promise(r => setTimeout(r, ms));
const results = [];
const report = (ok, name, detail = '') => { results.push(ok); console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? ' — ' + detail : ''}`); };
const bodyHas = txt => page.evaluate(t => document.body.textContent.includes(t), txt);
const click = txt => page.evaluate(t => {
  const els = Array.from(document.querySelectorAll('button, a'));
  const b = els.find(e => (e.textContent || '').trim().includes(t));
  if (b) { b.click(); return true; }
  return false;
}, txt);

await page.goto('http://localhost:5199', { waitUntil: 'networkidle2', timeout: 30000 });
await delays(1600);
report(await bodyHas('Panel de gestión'), 'Login único visible (sin selector de agencia)');

await page.type('input[type=email]', 'navarro@scanhouse.demo');
await page.type('input[type=password]', 'demo123');
await click('Ingresar');
await delays(1200);
report(await bodyHas('Navarro Inmobiliaria'), 'Dashboard cargado con branding Navarro');
report(await bodyHas('Inicio'), 'Sidebar expuesto');
report(await bodyHas('Demo del cliente'), 'Acceso a la demo del cliente desde el panel');

await page.evaluate(() => Array.from(document.querySelectorAll('button')).find(b => b.textContent.trim() === 'Propiedades')?.click());
await delays(600);
report(await bodyHas('Residencia El Parque'), 'Propiedades: lista de Navarro visible');
report(!(await bodyHas('Casa Laureles')), 'Privacidad: sin propiedades de Roca');

await page.evaluate(() => Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Inteligencia'))?.click());
await delays(600);
const intel = await bodyHas('Preguntas frecuentes');
report(intel, 'Inteligencia visible');

await page.evaluate(() => Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Leads'))?.click());
await delays(600);
report(await bodyHas('Ricardo Núñez'), 'Leads: datos de Navarro (no mezclados)');

await page.evaluate(() => Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Conversión'))?.click());
await delays(600);
report(await bodyHas('Métricas comerciales'), 'Conversión visible');

await page.evaluate(() => Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Analíticas'))?.click());
await delays(600);
report(await bodyHas('Rendimiento integral'), 'Analíticas visible');

await page.evaluate(() => Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Configuración'))?.click());
await delays(600);
report(await bodyHas('Dominio'), 'Configuración visible');

await click('Cerrar sesión');
await delays(800);
report(await bodyHas('Panel de gestión'), 'Logout regresa al login');
report(errors.length === 0, 'Sin page errors', errors.join(' | '));
console.log(`\n${results.filter(Boolean).length}/${results.length} OK`);
await browser.close();
process.exitCode = results.every(Boolean) ? 0 : 1;