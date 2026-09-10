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
const click = txt => page.evaluate(t => {
  const els = Array.from(document.querySelectorAll('button, a'));
  const b = els.find(e => (e.textContent || '').trim().includes(t));
  if (b) { b.click(); return true; }
  return false;
}, txt);
const bodyHas = txt => page.evaluate(t => document.body.textContent.includes(t), txt);
const typeLogin = async (email, pass) => {
  await page.type('input[type=email]', email);
  await page.type('input[type=password]', pass);
  await click('Ingresar');
  await delays(1100);
};

await page.goto('http://localhost:5199', { waitUntil: 'networkidle2', timeout: 30000 });
await delays(1600);

report(await bodyHas('Panel de gestión'), 'Login único es la pantalla inicial');
report(await page.evaluate(() => !!document.querySelector('input[type=email]') && !!document.querySelector('input[type=password]')), 'Formulario de credenciales presente');
report(!(await bodyHas('EXPERIENCIA DEL CLIENTE')), 'No existe selector público de experiencia');
report(!(await bodyHas('Cuentas demo')), 'Sin botones de credenciales en el login');

await typeLogin('incorrecto@scanhouse.demo', 'x');
report(await bodyHas('Credenciales incorrectas'), 'Credenciales inválidas rechazadas');

await page.reload({ waitUntil: 'networkidle2' });
await delays(1200);
await typeLogin('roca@scanhouse.demo', 'demo123');
report(await bodyHas('Inicio'), 'Login Roca: panel cargado');
report(await bodyHas('Roca Inmobiliaria'), 'Branding Roca en panel');

report(await click('Demo del cliente'), 'Abrir demo del cliente desde el panel');
await delays(900);
report(await bodyHas('ENCONTRÁ TU PRÓXIMO'), 'Catálogo del cliente visible');
report(await bodyHas('Casa Laureles'), 'Catálogo Roca: Casa Laureles');
report(!(await bodyHas('Casona Los Gardens')), 'Privacidad: no muestra propiedades de Leona');
report(!(await bodyHas('Leona')), 'Privacidad: sin selector de otras inmobiliarias');

const compareButtons = await page.evaluate(() =>
  Array.from(document.querySelectorAll('button')).filter(b => b.textContent.trim() === '+ COMPARAR').length,
);
report(compareButtons >= 2, 'Botones + COMPARAR en tarjetas', `${compareButtons} encontrados`);
await click('+ COMPARAR');
await delays(250);
await click('+ COMPARAR');
await delays(400);
report(await bodyHas('COMPARÁ (2)'), 'Barra de comparación con 2 propiedades');

report(await click('COMPARÁ (2)'), 'Abrir comparador');
await delays(800);
report(await bodyHas('COMPARÁ PROPIEDADES'), 'Comparador: tabla visible');
report(await bodyHas('ASPECTOS DESTACADOS'), 'Comparador: aspectos destacados');

report(await click('← Volver'), 'Volver del comparador');
await delays(600);
report(await bodyHas('ENCONTRÁ TU PRÓXIMO'), 'De vuelta al catálogo');

report(await click('VER PROPIEDAD'), 'Abrir publicación de Casa Laureles');
await delays(800);
report(await bodyHas('CONOCÉ EL ENTORNO'), 'Publicación: entorno visible');
report(await bodyHas('TAMBIÉN PODRÍA INTERESARTE'), 'Publicación: propiedades similares');
report(await bodyHas('Características destacadas'), 'Publicación: características');
report(await bodyHas('EXPLORAR EN 360°'), 'Publicación: CTA 360°');

report(await click('EXPLORAR EN 360°'), 'Abrir experiencia 360°');
await delays(1500);
report(await page.evaluate(() => !!document.querySelector('#panorama-viewer canvas')), 'Visor 360° montado');
report(await bodyHas('← Publicación'), 'Control de regreso a la publicación');

report(await click('← Publicación'), 'Volver a la publicación');
await delays(600);

report(await click('← Listado'), 'Volver al listado');
await delays(600);
report(await bodyHas('ENCONTRÁ TU PRÓXIMO'), 'Catálogo nuevamente');

report(await click('ENCONTRÁ LA PROPIEDAD QUE MEJOR SE ADAPTA A VOS'), 'Abrir recomendador');
await delays(400);
report(await click('ENCONTRAR PROPIEDADES'), 'Ejecutar recomendación');
await delays(500);
report(await bodyHas('Estas propiedades podrían interesarte'), 'Recomendación: resultados');

report(await click('← Panel'), 'Volver al panel desde el catálogo');
await delays(600);
report(await bodyHas('Inicio'), 'Panel nuevamente');

report(await click('Cerrar sesión'), 'Cerrar sesión');
await delays(800);
report(await bodyHas('Panel de gestión'), 'Volver al login único');
report(!(await bodyHas('Inicio')), 'Datos del panel no quedan expuestos tras logout');

report(errors.length === 0, 'Sin page errors', errors.join(' | '));
console.log(`\n${results.filter(Boolean).length}/${results.length} OK`);
await browser.close();
process.exitCode = results.every(Boolean) ? 0 : 1;