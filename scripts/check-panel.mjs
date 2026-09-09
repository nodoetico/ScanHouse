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

await page.goto('http://localhost:5199', { waitUntil: 'networkidle2', timeout: 30000 });
await delays(1600);
report(await page.evaluate(() => document.body.textContent.includes('¿Qué querés explorar?')), 'Selector de demo visible (landing)');

await page.evaluate(() => Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('INGRESAR'))?.click());
await delays(800);
report(await page.evaluate(() => document.body.textContent.includes('SCANHOUSE')), 'Login visible');

await page.evaluate(() => Array.from(document.querySelectorAll('button')).find(b => b.title?.includes('Navarro'))?.click());
await delays(400);
const creds = await page.evaluate(() => ({
  email: document.querySelector('input[type=email]').value,
  pass: document.querySelector('input[type=password]').value,
  logoShown: !!document.querySelector('img[alt*="Navarro"]'),
}));
report(creds.email === 'navarro@scanhouse.demo' && creds.pass === 'demo123', 'Credenciales demo autocompletadas', JSON.stringify(creds));
report(creds.logoShown, 'Logo de Navarro mostrado en login');

await page.evaluate(() => Array.from(document.querySelectorAll('button')).find(b => b.textContent.trim() === 'Ingresar')?.click());
await delays(1200);
report(await page.evaluate(() => document.body.textContent.includes('Navarro Inmobiliaria')), 'Dashboard cargado con branding Navarro');
report(await page.evaluate(() => document.body.textContent.includes('Inicio')), 'Sidebar expuesto');

await page.evaluate(() => Array.from(document.querySelectorAll('button')).find(b => b.textContent.trim() === 'Propiedades')?.click());
await delays(600);
report(await page.evaluate(() => document.body.textContent.includes('Residencia El Parque')), 'Propiedades: lista de Navarro visible');

await page.evaluate(() => Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Inteligencia'))?.click());
await delays(600);
const intel = await page.evaluate(() => document.body.textContent.includes('Preguntas frecuentes'));
report(intel, 'Inteligencia visible');

await page.evaluate(() => Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Leads'))?.click());
await delays(600);
report(await page.evaluate(() => document.body.textContent.includes('Ricardo Núñez')), 'Leads: datos de Navarro (no mezclados)');

await page.evaluate(() => Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Conversión'))?.click());
await delays(600);
report(await page.evaluate(() => document.body.textContent.includes('Métricas comerciales')), 'Conversión visible');

await page.evaluate(() => Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Analíticas'))?.click());
await delays(600);
report(await page.evaluate(() => document.body.textContent.includes('Rendimiento integral')), 'Analíticas visible');

await page.evaluate(() => Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Configuración'))?.click());
await delays(600);
report(await page.evaluate(() => document.body.textContent.includes('Navarro Inmobiliaria') && document.body.textContent.includes('Dominio')), 'Configuración visible');

await page.evaluate(() => Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Cerrar sesión'))?.click());
await delays(800);
report(await page.evaluate(() => document.body.textContent.includes('SCANHOUSE')), 'Logout regresa al login');
report(errors.length === 0, 'Sin page errors', errors.join(' | '));
console.log(`\n${results.filter(Boolean).length}/${results.length} OK`);
await browser.close();
process.exitCode = results.every(Boolean) ? 0 : 1;