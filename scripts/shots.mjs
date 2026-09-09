import { chromium } from 'file:///C:/Users/Lenovo/Desktop/PROYECTOS-CLAUDE/itomstore/node_modules/playwright/index.mjs';
import fs from 'fs';

const BASE = process.env.BASE || 'http://localhost:5329';
const OUT = 'scripts/_shots';
fs.mkdirSync(OUT, { recursive: true });

const pages = [
  ['home', '/'],
  ['productos', '/productos'],
  ['producto', '/producto/proyector-wanbo-fhd'],
  ['categorias', '/categorias'],
  ['categoria', '/categoria/audifonos'],
  ['ofertas', '/ofertas'],
  ['nosotros', '/nosotros'],
  ['ayuda', '/ayuda'],
  ['contacto', '/contacto'],
  ['404', '/ruta-inexistente'],
];

const viewports = [
  ['desktop', 1440, 900],
  ['mobile', 390, 844],
];

const browser = await chromium.launch();
const errors = [];

for (const [vname, width, height] of viewports) {
  const ctx = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  page.on('console', (m) => { if (m.type() === 'error') errors.push(`[${vname}] ${m.text()}`); });
  page.on('pageerror', (e) => errors.push(`[${vname}] PAGEERROR ${e.message}`));
  page.on('response', (r) => { if (r.status() >= 400) errors.push(`[${vname}] ${r.status()} ${r.url()}`); });

  for (const [name, path] of pages) {
    await page.goto(BASE + path, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1600);
    // recorre la página para disparar los reveals y las imágenes diferidas
    await page.evaluate(async () => {
      const step = Math.round(window.innerHeight * 0.7);
      for (let y = 0; y < document.body.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 90));
      }
      window.scrollTo(0, 0);
      await new Promise((r) => setTimeout(r, 350));
      document.querySelectorAll('*').forEach((el) => el.getAnimations?.().forEach((a) => { try { if (a.effect?.getTiming?.().iterations !== Infinity) a.finish(); } catch {} }));
    });
    await page.waitForTimeout(500);
    await page.screenshot({ path: `${OUT}/${vname}-${name}.png`, fullPage: true });

    const audit = await page.evaluate(() => {
      const out = { hidden: 0, overflowX: 0, smallTargets: [], noAlt: [], h1: 0 };
      document.querySelectorAll('#contenido *').forEach((el) => {
        const cs = getComputedStyle(el);
        if (cs.opacity === '0' && !el.getAttribute('aria-hidden') && el.className && !String(el.className).includes('bg-electric/')) out.hidden++;
      });
      out.overflowX = Math.max(0, document.documentElement.scrollWidth - window.innerWidth);
      document.querySelectorAll('a,button').forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.width > 0 && (r.height < 32 || r.width < 32)) out.smallTargets.push(`${el.tagName}:${(el.textContent || el.ariaLabel || '').trim().slice(0, 24)} ${Math.round(r.width)}x${Math.round(r.height)}`);
      });
      document.querySelectorAll('img').forEach((i) => { if (i.alt === null || i.alt === undefined) out.noAlt.push(i.currentSrc); });
      out.h1 = document.querySelectorAll('h1').length;
      out.title = document.title;
      return out;
    });
    console.log(`${vname}/${name}`.padEnd(22), JSON.stringify(audit));
  }
  await ctx.close();
}

await browser.close();
console.log('\n--- errores ---');
console.log(errors.length ? [...new Set(errors)].join('\n') : 'ninguno');
