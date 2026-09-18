// Extensión .ts explícita: permite que las pruebas (node --test) carguen este
// archivo real además del bundle de Vite.
import type { MerchMap, RankingWeights } from '../lib/ranking.ts';
import { DEFAULT_WEIGHTS } from '../lib/ranking.ts';

/**
 * DATOS COMERCIALES — lo que decide el ORDEN del catálogo
 * ─────────────────────────────────────────────────────────────────────────────
 * Aquí van las ventas y las decisiones de vitrina. Está separado de catalog.ts
 * a propósito: el catálogo describe el producto; este archivo dice cómo se vende.
 *
 * Campos (todos opcionales, lo que no pongas no suma):
 *   sold     unidades vendidas en total            → «Más vendidos» + insignia
 *   sold30   unidades vendidas en los últimos 30 d  → insignia «Tendencia»
 *   pin      posición fija (1 = primero)            → gana a cualquier cálculo
 *   addedAt  fecha de ingreso 'AAAA-MM-DD'          → insignia «Nuevo» (45 días)
 *   label    etiqueta libre, p. ej. 'Recomendado'
 *
 * Ejemplo:
 *   'parlante-havit-rgb': { sold: 42, sold30: 9, addedAt: '2026-09-01' },
 *   'proyector-wanbo-fhd': { pin: 1 },
 *
 * IMPORTANTE: pon sólo números reales (los de tus ventas por WhatsApp). Mientras
 * esté vacío, el orden lo deciden los productos marcados como `featured` en
 * catalog.ts y el orden en que aparecen allí, y NO se muestra ninguna insignia
 * de popularidad.
 */
export const merchandising: MerchMap = {
  'audifonos-tws-pro': {},
  'diadema-soundcore': {},
  'smartwatch-deportivo': {},
  'reloj-diduna-chrono': {},
  'parlante-havit-rgb': {},
  'powerbank-20000': {},
  'cargador-jellico-gan': {},
  'proyector-wanbo-fhd': {},
  'intercom-freedconn': {},
  'camara-tapo': {},
  'termo-bottle': {},
};

/**
 * Cuánto pesa cada señal en el orden «Relevancia». Suman 1.
 * Sube `sales` si quieres que lo más vendido domine; sube `featured` si prefieres
 * que tu selección editorial mande.
 */
export const rankingWeights: RankingWeights = DEFAULT_WEIGHTS;
