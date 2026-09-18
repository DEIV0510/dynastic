import { products } from '../data/catalog';
import { merchandising, rankingWeights } from '../data/merchandising';
import type { Product } from '../data/types';
import {
  computeBadges,
  hasDates,
  hasSalesData,
  rankProducts,
  type Badge,
  type SortKey,
} from './ranking';

/**
 * Une el motor de ranking (puro) con los datos reales del catálogo. Todo lo que
 * ordena productos en la web pasa por aquí, así el criterio es uno solo.
 */

const ctx = { merch: merchandising, weights: rankingWeights };

// Un error de tipeo en un slug haría que sus ventas no cuenten sin avisar.
if (import.meta.env.DEV) {
  const known = new Set(products.map((p) => p.slug));
  for (const slug of Object.keys(merchandising)) {
    if (!known.has(slug)) console.warn(`[merchandising] slug desconocido: "${slug}"`);
  }
}

export const salesDataLoaded = hasSalesData(merchandising);

/** Ordena una lista (por defecto, todo el catálogo). */
export const ranked = (list: Product[] = products, sort: SortKey = 'relevancia') =>
  rankProducts(list, sort, ctx);

/** Los N primeros del catálogo por relevancia. */
export const topProducts = (n: number) => ranked().slice(0, n);

/** Misma categoría primero (por relevancia) y después el resto. */
export const rankedRelated = (p: Product, n = 4) => {
  const others = products.filter((x) => x.slug !== p.slug);
  return [
    ...ranked(others.filter((x) => x.category === p.category)),
    ...ranked(others.filter((x) => x.category !== p.category)),
  ].slice(0, n);
};

// Las insignias dependen del catálogo completo (p. ej. el top 3 de ventas):
// se calculan una vez para todos.
const badges = computeBadges(products, ctx);
export const badgeFor = (slug: string): Badge | undefined => badges.get(slug);

/** Opciones de orden visibles: sólo las que tienen datos para funcionar. */
export function sortOptions(): { value: SortKey; label: string }[] {
  const hasPrices = products.some((p) => typeof p.price === 'number');
  return [
    { value: 'relevancia' as const, label: 'Relevancia', show: true },
    { value: 'vendidos' as const, label: 'Más vendidos', show: salesDataLoaded },
    { value: 'nuevos' as const, label: 'Novedades', show: hasDates(merchandising) },
    { value: 'precio-asc' as const, label: 'Precio: menor a mayor', show: hasPrices },
    { value: 'precio-desc' as const, label: 'Precio: mayor a menor', show: hasPrices },
    { value: 'nombre' as const, label: 'Nombre (A–Z)', show: true },
  ]
    .filter((o) => o.show)
    .map(({ value, label }) => ({ value, label }));
}

export const isSortKey = (v: string | null): v is SortKey =>
  !!v && sortOptions().some((o) => o.value === v);
