import type { Product } from '../data/types';

/**
 * MOTOR DE RANKING DEL CATÁLOGO
 * ─────────────────────────────────────────────────────────────────────────────
 * Ordena como una plataforma de e-commerce: primero lo que el negocio fija a
 * mano, después todo lo disponible ordenado por una puntuación que combina
 * ventas, tendencia, destacados, reseñas, descuento, novedad y si se puede
 * comprar ya, y al final lo agotado (que nunca ocupa un primer puesto).
 *
 * Es una función pura: no importa datos, los recibe. Así se prueba con datos de
 * ejemplo (scripts/ranking.test.mjs) sin tocar el catálogo real, y mañana el
 * mismo código puede ordenar datos que vengan de un backend.
 *
 * Regla de oro: una señal sin datos vale 0, no se inventa. Mientras no haya
 * ventas cargadas, manda lo destacado y el orden del catálogo.
 */

/** Datos comerciales de un producto. Todos opcionales: lo que falte no suma. */
export interface Merch {
  /** Unidades vendidas en total (históricas). */
  sold?: number;
  /** Unidades vendidas en los últimos 30 días: mide la tendencia. */
  sold30?: number;
  /** Posición fijada a mano (1 = primero). Gana a cualquier puntuación. */
  pin?: number;
  /** Fecha en que entró al catálogo, AAAA-MM-DD. Activa «Nuevo». */
  addedAt?: string;
  /** Etiqueta editorial libre, p. ej. «Recomendado». */
  label?: string;
}

export type MerchMap = Record<string, Merch | undefined>;

/** Peso de cada señal. Suman 1; se pueden ajustar sin tocar el algoritmo. */
export interface RankingWeights {
  sales: number;
  momentum: number;
  featured: number;
  rating: number;
  discount: number;
  newness: number;
  purchasable: number;
}

export const DEFAULT_WEIGHTS: RankingWeights = {
  sales: 0.3,
  momentum: 0.2,
  featured: 0.2,
  rating: 0.1,
  discount: 0.08,
  newness: 0.07,
  purchasable: 0.05,
};

/** Días que un producto cuenta como «nuevo» (la señal decae linealmente). */
export const NEW_WINDOW_DAYS = 45;
/** Reseñas «virtuales» del promedio bayesiano: 2 reseñas de 5★ no ganan a 200 de 4,8★. */
const RATING_PRIOR_COUNT = 5;
const RATING_PRIOR_MEAN = 4;

export type SortKey =
  'relevancia' | 'vendidos' | 'nuevos' | 'precio-asc' | 'precio-desc' | 'nombre';

export interface RankContext {
  merch?: MerchMap;
  weights?: RankingWeights;
  /** Fecha de referencia para «nuevo»; se inyecta en las pruebas. */
  now?: Date;
}

export interface ScoreBreakdown {
  total: number;
  pinned: number | null;
  signals: Record<keyof RankingWeights, number>;
  outOfStock: boolean;
}

/* ── utilidades ────────────────────────────────────────────────────────── */

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);

/** Escala logarítmica: el más vendido no aplasta al resto por pura magnitud. */
const logShare = (value: number, max: number) =>
  value > 0 && max > 0 ? Math.log1p(value) / Math.log1p(max) : 0;

const daysBetween = (from: string, now: Date) => {
  const t = Date.parse(from);
  return Number.isNaN(t) ? Infinity : (now.getTime() - t) / 86_400_000;
};

const isOnOffer = (p: Product) =>
  typeof p.price === 'number' && typeof p.priceBefore === 'number' && p.priceBefore > p.price;

const discountShare = (p: Product) =>
  isOnOffer(p) ? 1 - (p.price as number) / (p.priceBefore as number) : 0;

/* ── puntuación ────────────────────────────────────────────────────────── */

/**
 * Puntúa todos los productos a la vez: las señales de ventas se normalizan
 * contra el máximo del conjunto, así que la puntuación es relativa al catálogo.
 */
export function scoreProducts(products: Product[], ctx: RankContext = {}) {
  const merch = ctx.merch ?? {};
  const w = ctx.weights ?? DEFAULT_WEIGHTS;
  const now = ctx.now ?? new Date();

  const maxSold = Math.max(0, ...products.map((p) => merch[p.slug]?.sold ?? 0));
  const maxSold30 = Math.max(0, ...products.map((p) => merch[p.slug]?.sold30 ?? 0));

  const scores = new Map<string, ScoreBreakdown>();
  for (const p of products) {
    const m = merch[p.slug] ?? {};

    const rating =
      typeof p.rating === 'number'
        ? clamp01(
            (RATING_PRIOR_COUNT * RATING_PRIOR_MEAN + p.rating * (p.reviews ?? 0)) /
              (RATING_PRIOR_COUNT + (p.reviews ?? 0)) /
              5,
          )
        : 0;

    const age = m.addedAt ? daysBetween(m.addedAt, now) : Infinity;
    const signals = {
      sales: logShare(m.sold ?? 0, maxSold),
      momentum: logShare(m.sold30 ?? 0, maxSold30),
      featured: p.featured ? 1 : 0,
      rating,
      // un 50 % de descuento ya es la señal completa
      discount: clamp01(discountShare(p) / 0.5),
      newness: age >= 0 ? clamp01(1 - age / NEW_WINDOW_DAYS) : 0,
      purchasable: typeof p.price === 'number' ? 1 : 0,
    };

    let total = 0;
    for (const k of Object.keys(signals) as (keyof RankingWeights)[]) total += signals[k] * w[k];

    // Lo agotado no se penaliza en la puntuación: va en un escalón aparte al
    // ordenar. Un factor multiplicativo no basta: un agotado muy vendido seguía
    // quedando por encima de productos que sí se pueden comprar.
    const outOfStock = p.stock === 0;

    scores.set(p.slug, {
      total,
      pinned: typeof m.pin === 'number' && m.pin > 0 ? m.pin : null,
      signals,
      outOfStock,
    });
  }
  return scores;
}

/* ── ordenación ────────────────────────────────────────────────────────── */

/**
 * Devuelve una copia ordenada. El orden del catálogo desempata siempre, así el
 * resultado es estable y predecible aunque varias puntuaciones coincidan.
 */
export function rankProducts(
  products: Product[],
  sort: SortKey = 'relevancia',
  ctx: RankContext = {},
): Product[] {
  const scores = scoreProducts(products, ctx);
  const merch = ctx.merch ?? {};
  const index = new Map(products.map((p, i) => [p.slug, i]));
  const byCatalog = (a: Product, b: Product) => index.get(a.slug)! - index.get(b.slug)!;
  const s = (p: Product) => scores.get(p.slug)!;

  // Lo agotado va al final en cualquier orden (salvo lo fijado a mano).
  const stockFirst = (a: Product, b: Product) => Number(s(a).outOfStock) - Number(s(b).outOfStock);

  const cmp: Record<SortKey, (a: Product, b: Product) => number> = {
    relevancia: (a, b) => {
      const pa = s(a).pinned;
      const pb = s(b).pinned;
      if (pa !== null || pb !== null) {
        if (pa === null) return 1;
        if (pb === null) return -1;
        if (pa !== pb) return pa - pb;
      }
      return stockFirst(a, b) || s(b).total - s(a).total || byCatalog(a, b);
    },
    vendidos: (a, b) =>
      stockFirst(a, b) ||
      (merch[b.slug]?.sold ?? 0) - (merch[a.slug]?.sold ?? 0) ||
      s(b).total - s(a).total ||
      byCatalog(a, b),
    nuevos: (a, b) =>
      stockFirst(a, b) ||
      (Date.parse(merch[b.slug]?.addedAt ?? '') || 0) -
        (Date.parse(merch[a.slug]?.addedAt ?? '') || 0) ||
      byCatalog(a, b),
    // Sin precio no se puede comparar: esos productos van detrás de los que sí tienen.
    'precio-asc': (a, b) =>
      stockFirst(a, b) || (a.price ?? Infinity) - (b.price ?? Infinity) || byCatalog(a, b),
    'precio-desc': (a, b) =>
      stockFirst(a, b) || (b.price ?? -Infinity) - (a.price ?? -Infinity) || byCatalog(a, b),
    nombre: (a, b) => a.name.localeCompare(b.name, 'es'),
  };

  return [...products].sort(cmp[sort]);
}

/* ── insignias derivadas de datos ──────────────────────────────────────── */

export type BadgeKind = 'bestseller' | 'trending' | 'new' | 'label';
export interface Badge {
  kind: BadgeKind;
  text: string;
}

/** Cuántos productos pueden llevar «Más vendido» / «Tendencia» a la vez. */
export const BESTSELLER_SLOTS = 3;
export const TRENDING_SLOTS = 2;

/**
 * Calcula la insignia de cada producto a partir de los datos. «Más vendido» y
 * «Tendencia» sólo existen si hay ventas reales cargadas: sin datos, no hay
 * insignia de popularidad.
 */
export function computeBadges(products: Product[], ctx: RankContext = {}) {
  const merch = ctx.merch ?? {};
  const now = ctx.now ?? new Date();
  const available = products.filter((p) => p.stock !== 0);

  const top = (key: 'sold' | 'sold30', slots: number, exclude: Set<string>) =>
    new Set(
      available
        .filter((p) => (merch[p.slug]?.[key] ?? 0) > 0 && !exclude.has(p.slug))
        .sort((a, b) => (merch[b.slug]?.[key] ?? 0) - (merch[a.slug]?.[key] ?? 0))
        .slice(0, slots)
        .map((p) => p.slug),
    );

  const bestsellers = top('sold', BESTSELLER_SLOTS, new Set());
  const trending = top('sold30', TRENDING_SLOTS, bestsellers);

  const badges = new Map<string, Badge>();
  for (const p of products) {
    const m = merch[p.slug] ?? {};
    const isNew = m.addedAt ? daysBetween(m.addedAt, now) <= NEW_WINDOW_DAYS : false;

    if (bestsellers.has(p.slug)) badges.set(p.slug, { kind: 'bestseller', text: 'Más vendido' });
    else if (trending.has(p.slug)) badges.set(p.slug, { kind: 'trending', text: 'Tendencia' });
    else if (isNew) badges.set(p.slug, { kind: 'new', text: 'Nuevo' });
    else if (m.label) badges.set(p.slug, { kind: 'label', text: m.label });
  }
  return badges;
}

/** ¿Hay al menos un dato de ventas cargado? Decide textos y opciones de orden. */
export const hasSalesData = (merch: MerchMap) =>
  Object.values(merch).some((m) => (m?.sold ?? 0) > 0 || (m?.sold30 ?? 0) > 0);

export const hasDates = (merch: MerchMap) => Object.values(merch).some((m) => !!m?.addedAt);
