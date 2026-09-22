import { chromium } from 'file:///C:/Users/Lenovo/Desktop/PROYECTOS-CLAUDE/itomstore/node_modules/playwright/index.mjs';
const BASE = process.env.BASE || 'http://localhost:5329';
const browser = await chromium.launch();
const results = [];
const check = (name, ok, extra = '') =>
  results.push(`${ok ? 'OK  ' : 'FALLA'} ${name}${extra ? ' — ' + extra : ''}`);

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
  check(
    'Escape cierra el buscador',
    !(await page
      .locator('input[aria-label="Buscar productos"]')
      .isVisible()
      .catch(() => false)),
  );

  // carrito con producto sin precio: se llega por WhatsApp, no por "Comprar"
  await page.goto(BASE + '/producto/proyector-wanbo-fhd', { waitUntil: 'networkidle' });
  await page.waitForTimeout(900);
  const waHref = await page.getAttribute('a:has-text("Consultar por WhatsApp")', 'href');
  check(
    'CTA de WhatsApp lleva el nombre del producto',
    /wa\.me\/573104218808/.test(waHref) && /WANBO/i.test(decodeURIComponent(waHref)),
    decodeURIComponent(waHref || '').slice(0, 90),
  );

  // carrito: se fuerza un precio para probar el flujo completo
  await page.evaluate(() => {
    localStorage.setItem(
      'dynastic.cart.v1',
      JSON.stringify([{ slug: 'proyector-wanbo-fhd', qty: 2 }]),
    );
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
  check(
    'checkout arma el pedido en WhatsApp',
    /wa\.me/.test(checkoutHref) && /2 x/.test(decodeURIComponent(checkoutHref)),
    decodeURIComponent(checkoutHref || '').slice(0, 100),
  );

  await page.click('button[aria-label*="Eliminar"]');
  await page.waitForTimeout(500);
  check('eliminar vacía el carrito', await page.locator('text=Tu carrito está vacío').isVisible());

  // filtros del catálogo — se compara contra /categoria/relojes en vez de un
  // número fijo, para que la prueba no se rompa cuando crece el catálogo.
  await page.goto(BASE + '/productos', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);
  const total = await page.locator('ul.grid > li').count();
  await page.click('button:has-text("Relojes")');
  await page.waitForTimeout(500);
  const filtered = await page.locator('ul.grid > li').count();
  await page.goto(BASE + '/categoria/relojes', { waitUntil: 'networkidle' });
  await page.waitForTimeout(900);
  const relojesReales = await page.locator('ul.grid > li').count();
  check(
    'filtro por categoría reduce el listado',
    filtered > 0 && filtered < total && filtered === relojesReales,
    `${total} → ${filtered} (categoría real: ${relojesReales})`,
  );

  // orden del catálogo
  await page.goto(BASE + '/productos', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);
  const names = () => page.locator('ul.grid > li h3').allTextContents();
  const relevance = await names();
  const featuredNames = await page.evaluate(async () => {
    const { products } = await import('/src/data/catalog.ts');
    return products.filter((p) => p.featured).map((p) => p.name);
  });
  check(
    'relevancia: los destacados encabezan el catálogo',
    relevance.slice(0, featuredNames.length).every((n) => featuredNames.includes(n.trim())),
    relevance.slice(0, 3).join(' · '),
  );
  const options = await page
    .locator('select[aria-label="Ordenar productos"] option')
    .allTextContents();
  check(
    'sólo se ofrecen órdenes con datos (sin ventas/precios no hay «Más vendidos» ni precio)',
    !options.includes('Más vendidos') && !options.some((o) => o.startsWith('Precio')),
    options.join(' | '),
  );
  await page.selectOption('select[aria-label="Ordenar productos"]', 'nombre');
  await page.waitForTimeout(500);
  const byName = (await names()).map((n) => n.trim());
  const sortedCopy = [...byName].sort((a, b) => a.localeCompare(b, 'es'));
  check(
    'ordenar por nombre deja el listado alfabético',
    JSON.stringify(byName) === JSON.stringify(sortedCopy),
  );
  check(
    'el orden queda en la URL para compartirlo',
    page.url().includes('orden=nombre'),
    page.url(),
  );
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  const afterReload = (await names()).map((n) => n.trim());
  check(
    'recargar conserva el orden elegido',
    JSON.stringify(afterReload) === JSON.stringify(sortedCopy),
  );

  await ctx.close();
}

// ---------- móvil ----------
{
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  const page = await ctx.newPage();
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1800);
  await page.click('button[aria-label="Abrir menú"]');
  await page.waitForTimeout(700);
  check(
    'el menú móvil abre',
    await page.locator('div[role="dialog"][aria-label="Menú"]').isVisible(),
  );
  await page.click('div[role="dialog"][aria-label="Menú"] a:has-text("Ofertas")');
  await page.waitForTimeout(900);
  check(
    'navegar desde el menú cierra el panel',
    page.url().includes('/ofertas') &&
      !(await page
        .locator('div[role="dialog"][aria-label="Menú"]')
        .isVisible()
        .catch(() => false)),
  );

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
console.log(
  results.some((r) => r.startsWith('FALLA')) ? '\n>>> HAY FALLAS' : '\n>>> todo en verde',
);
