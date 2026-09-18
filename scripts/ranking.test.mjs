// Pruebas del motor de ranking. Ejecutar: npm test
// Usan datos de EJEMPLO para comprobar el algoritmo; el catálogo real sólo se
// usa para verificar su integridad, nunca se le inventan ventas.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  DEFAULT_WEIGHTS,
  computeBadges,
  hasSalesData,
  rankProducts,
  scoreProducts,
} from '../src/lib/ranking.ts';
import { products as realProducts } from '../src/data/catalog.ts';
import { merchandising, rankingWeights } from '../src/data/merchandising.ts';

const mk = (slug, extra = {}) => ({
  slug,
  name: slug,
  category: 'gadgets',
  brand: null,
  reference: null,
  price: null,
  priceBefore: null,
  stock: null,
  features: [],
  tagline: '',
  colors: [],
  variants: [],
  rating: null,
  reviews: null,
  featured: false,
  keywords: [],
  image: slug,
  gallery: [],
  imageRatio: 1,
  ...extra,
});

const order = (list, sort, ctx) => rankProducts(list, sort, ctx).map((p) => p.slug);
const NOW = new Date('2026-09-18T12:00:00Z');

/* ── sin datos de ventas ──────────────────────────────────────────────── */

test('sin ventas: los destacados van primero y se respeta el orden del catálogo', () => {
  const list = [mk('a'), mk('b', { featured: true }), mk('c'), mk('d', { featured: true })];
  assert.deepEqual(order(list), ['b', 'd', 'a', 'c']);
});

test('puntuaciones iguales conservan el orden del catálogo (orden estable)', () => {
  const list = [mk('x'), mk('y'), mk('z')];
  assert.deepEqual(order(list), ['x', 'y', 'z']);
});

/* ── ventas ───────────────────────────────────────────────────────────── */

test('lo más vendido sube por encima de lo destacado sin ventas', () => {
  const list = [mk('destacado', { featured: true }), mk('vendido')];
  const merch = { vendido: { sold: 40 } };
  assert.deepEqual(order(list, 'relevancia', { merch }), ['vendido', 'destacado']);
});

test('destacado + vendido gana a sólo vendido', () => {
  const list = [mk('solo-vendido'), mk('ambos', { featured: true })];
  const merch = { 'solo-vendido': { sold: 50 }, ambos: { sold: 50 } };
  assert.deepEqual(order(list, 'relevancia', { merch }), ['ambos', 'solo-vendido']);
});

test('escala logarítmica: vender 10 cuando el líder vende 100 sigue sumando bastante', () => {
  const list = [mk('lider'), mk('medio')];
  const scores = scoreProducts(list, { merch: { lider: { sold: 100 }, medio: { sold: 10 } } });
  const share = scores.get('medio').signals.sales;
  assert.ok(share > 0.5 && share < 0.55, `participación ${share}`); // log1p(10)/log1p(100) ≈ 0.52
});

test('a igual venta total, la tendencia de 30 días desempata', () => {
  const list = [mk('estable'), mk('en-alza')];
  const merch = { estable: { sold: 30, sold30: 1 }, 'en-alza': { sold: 30, sold30: 12 } };
  assert.deepEqual(order(list, 'relevancia', { merch }), ['en-alza', 'estable']);
});

/* ── control manual y disponibilidad ──────────────────────────────────── */

test('un producto fijado va primero aunque no venda nada', () => {
  const list = [mk('top', { featured: true }), mk('fijado')];
  const merch = { top: { sold: 999 }, fijado: { pin: 1 } };
  assert.deepEqual(order(list, 'relevancia', { merch }), ['fijado', 'top']);
});

test('varios fijados respetan su número', () => {
  const list = [mk('a'), mk('b'), mk('c')];
  const merch = { a: { pin: 2 }, c: { pin: 1 } };
  assert.deepEqual(order(list, 'relevancia', { merch }), ['c', 'a', 'b']);
});

test('lo agotado baja aunque sea lo más vendido', () => {
  const list = [mk('agotado', { stock: 0, featured: true }), mk('normal')];
  const merch = { agotado: { sold: 500 }, normal: { sold: 3 } };
  assert.deepEqual(order(list, 'relevancia', { merch }), ['normal', 'agotado']);
});

test('en «Más vendidos» lo agotado también va al final', () => {
  const list = [mk('agotado', { stock: 0 }), mk('b')];
  const merch = { agotado: { sold: 500 }, b: { sold: 1 } };
  assert.deepEqual(order(list, 'vendidos', { merch }), ['b', 'agotado']);
});

/* ── otras señales ────────────────────────────────────────────────────── */

test('reseñas bayesianas: 200 reseñas de 4,8 ganan a 2 de 5,0', () => {
  const list = [
    mk('pocas', { rating: 5, reviews: 2 }),
    mk('muchas', { rating: 4.8, reviews: 200 }),
  ];
  assert.deepEqual(order(list), ['muchas', 'pocas']);
});

test('con precio cargado se puede comprar ya y suma', () => {
  const list = [mk('sin-precio'), mk('con-precio', { price: 99000 })];
  assert.deepEqual(order(list), ['con-precio', 'sin-precio']);
});

test('la novedad decae: recién llegado > de hace un mes > fuera de la ventana', () => {
  const list = [mk('viejo'), mk('mes'), mk('nuevo')];
  const merch = {
    viejo: { addedAt: '2026-01-01' },
    mes: { addedAt: '2026-08-19' },
    nuevo: { addedAt: '2026-09-15' },
  };
  assert.deepEqual(order(list, 'relevancia', { merch, now: NOW }), ['nuevo', 'mes', 'viejo']);
});

/* ── órdenes explícitos ───────────────────────────────────────────────── */

test('precio: los productos sin precio van detrás en ambos sentidos', () => {
  const list = [mk('sin'), mk('caro', { price: 300000 }), mk('barato', { price: 50000 })];
  assert.deepEqual(order(list, 'precio-asc'), ['barato', 'caro', 'sin']);
  assert.deepEqual(order(list, 'precio-desc'), ['caro', 'barato', 'sin']);
});

test('nombre ordena alfabéticamente en español', () => {
  const list = [
    mk('b', { name: 'Óptico' }),
    mk('a', { name: 'Audífonos' }),
    mk('c', { name: 'Cámara' }),
  ];
  assert.deepEqual(order(list, 'nombre'), ['a', 'c', 'b']);
});

/* ── insignias ────────────────────────────────────────────────────────── */

test('sin ventas no hay insignias de popularidad', () => {
  const list = [mk('a', { featured: true }), mk('b')];
  assert.equal(computeBadges(list, { merch: {} }).size, 0);
});

test('«Más vendido» para el top 3 y «Tendencia» para los siguientes que crecen', () => {
  const list = ['a', 'b', 'c', 'd', 'e'].map((s) => mk(s));
  const merch = {
    a: { sold: 90 },
    b: { sold: 70 },
    c: { sold: 50 },
    d: { sold: 5, sold30: 5 },
    e: { sold: 2 },
  };
  const b = computeBadges(list, { merch });
  assert.equal(b.get('a').text, 'Más vendido');
  assert.equal(b.get('c').text, 'Más vendido');
  assert.equal(b.get('d').text, 'Tendencia');
  assert.equal(b.has('e'), false);
});

test('un agotado nunca lleva insignia de popularidad', () => {
  const list = [mk('agotado', { stock: 0 }), mk('b')];
  const b = computeBadges(list, { merch: { agotado: { sold: 900 }, b: { sold: 1 } } });
  assert.equal(b.has('agotado'), false);
  assert.equal(b.get('b').text, 'Más vendido');
});

test('«Nuevo» sólo dentro de la ventana de 45 días', () => {
  const list = [mk('nuevo'), mk('viejo')];
  const merch = { nuevo: { addedAt: '2026-09-10' }, viejo: { addedAt: '2026-06-01' } };
  const b = computeBadges(list, { merch, now: NOW });
  assert.equal(b.get('nuevo').text, 'Nuevo');
  assert.equal(b.has('viejo'), false);
});

/* ── integridad de los datos reales ───────────────────────────────────── */

test('los pesos del ranking suman 1', () => {
  const sum = Object.values(rankingWeights).reduce((a, b) => a + b, 0);
  assert.ok(Math.abs(sum - 1) < 1e-9, `suman ${sum}`);
  assert.deepEqual(Object.keys(rankingWeights).sort(), Object.keys(DEFAULT_WEIGHTS).sort());
});

test('cada slug de merchandising existe en el catálogo (un error de tipeo anularía sus ventas)', () => {
  const known = new Set(realProducts.map((p) => p.slug));
  const unknown = Object.keys(merchandising).filter((s) => !known.has(s));
  assert.deepEqual(unknown, []);
});

test('las ventas cargadas son números enteros no negativos', () => {
  for (const [slug, m] of Object.entries(merchandising)) {
    for (const key of ['sold', 'sold30', 'pin']) {
      if (m?.[key] === undefined) continue;
      assert.ok(Number.isInteger(m[key]) && m[key] >= 0, `${slug}.${key} = ${m[key]}`);
    }
    if (m?.sold30 !== undefined && m?.sold !== undefined) {
      assert.ok(m.sold30 <= m.sold, `${slug}: vendió más en 30 días que en total`);
    }
    if (m?.addedAt) assert.ok(!Number.isNaN(Date.parse(m.addedAt)), `${slug}.addedAt inválida`);
  }
});

test('el catálogo real ordena todos sus productos sin perder ninguno', () => {
  const out = rankProducts(realProducts, 'relevancia', {
    merch: merchandising,
    weights: rankingWeights,
  });
  assert.equal(out.length, realProducts.length);
  assert.equal(new Set(out.map((p) => p.slug)).size, realProducts.length);
  // sin ventas cargadas, los primeros son los destacados
  if (!hasSalesData(merchandising)) {
    const featuredCount = realProducts.filter((p) => p.featured).length;
    assert.ok(out.slice(0, featuredCount).every((p) => p.featured));
  }
});
