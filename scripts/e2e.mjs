import { chromium } from 'file:///C:/Users/Lenovo/Desktop/PROYECTOS-CLAUDE/itomstore/node_modules/playwright/index.mjs';
const BASE = process.env.BASE || 'http://localhost:5329';
const browser = await chromium.launch();
const results = [];
const check = (name, ok, extra = '') => results.push(`${ok ? 'OK  ' : 'FALLA'} ${name}${extra ? ' — ' + extra : ''}`);

// ---------- escritorio ----------
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1800);

  // buscador
  await page.click('button[aria-label="Buscar productos"]');
  await page.fill('input[aria-label="Buscar productos"]', 'proyector');
  await page.waitForTimeout(400);
  const hits = await page.locator('a[href^="/producto/"]').count();
  check('buscador devuelve resultados', hits > 0, `${hits} enlaces`);
  await page.keyboard.press('Escape');
  await page.waitForTimeout(400);
  check('Escape cierra el buscador', !(await page.locator('input[aria-label="Buscar productos"]').isVisible().catch(() => false)));

  // carrito con producto sin precio: se llega por WhatsApp, no por "Comprar"
  await page.goto(BASE + '/producto/proyector-wanbo-fhd', { waitUntil: 'networkidle' });
  await page.waitForTimeout(900);
  const waHref = await page.getAttribute('a:has-text("Consultar por WhatsApp")', 'href');
  check('CTA de WhatsApp lleva el nombre del producto', /wa\.me\/573104218808/.test(waHref) && /WANBO/i.test(decodeURIComponent(waHref)), decodeURIComponent(waHref || '').slice(0, 90));

  // carrito: se fuerza un precio para probar el flujo completo
  await page.evaluate(() => {
    localStorage.setItem('dynastic.cart.v1', JSON.stringify([{ slug: 'proyector-wanbo-fhd', qty: 2 }]));
  });
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  const badge = await page.textContent('button[aria-label*="carrito"] span').catch(() => null);
  check('el carrito sobrevive al recargar', badge === '2', `insignia="${badge}"`);

  await page.click('button[aria-label*="carrito"]');
  await page.waitForTimeout(700);
  const cartVisible = await page.locator('aside:has-text("Tu carrito")').isVisible();
  check('el panel del carrito abre', cartVisible);
  const checkoutHref = await page.getAttribute('a:has-text("Finalizar compra")', 'href');
  check('checkout arma el pedido en WhatsApp', /wa\.me/.test(checkoutHref) && /2 x/.test(decodeURIComponent(checkoutHref)), decodeURIComponent(checkoutHref || '').slice(0, 100));

  await page.click('button[aria-label*="Eliminar"]');
  await page.waitForTimeout(500);
  check('eliminar vacía el carrito', await page.locator('text=Tu carrito está vacío').isVisible());

  // filtros del catálogo
  await page.goto(BASE + '/productos', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);
  const total = await page.locator('ul.grid > li').count();
  await page.click('button:has-text("Relojes")');
  await page.waitForTimeout(500);
  const filtered = await page.locator('ul.grid > li').count();
  check('filtro por categoría reduce el listado', total === 11 && filtered === 1, `${total} → ${filtered}`);

  await ctx.close();
}

// ---------- móvil ----------
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const page = await ctx.newPage();
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1800);
  await page.click('button[aria-label="Abrir menú"]');
  await page.waitForTimeout(700);
  check('el menú móvil abre', await page.locator('div[role="dialog"][aria-label="Menú"]').isVisible());
  await page.click('div[role="dialog"][aria-label="Menú"] a:has-text("Ofertas")');
  await page.waitForTimeout(900);
  check('navegar desde el menú cierra el panel', page.url().includes('/ofertas') && !(await page.locator('div[role="dialog"][aria-label="Menú"]').isVisible().catch(() => false)));

  await page.goto(BASE + '/producto/smartwatch-deportivo', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);
  const barVisible = await page.locator('div.fixed.inset-x-0.bottom-0').first().isVisible();
  check('barra inferior móvil visible en ficha', barVisible);
  const pad = await page.evaluate(() => getComputedStyle(document.body).paddingBottom);
  check('el cuerpo deja aire para la barra', parseFloat(pad) > 40, `padding-bottom=${pad}`);

  await ctx.close();
}

await browser.close();
console.log(results.join('\n'));
console.log(results.some((r) => r.startsWith('FALLA')) ? '\n>>> HAY FALLAS' : '\n>>> todo en verde');
