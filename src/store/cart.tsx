import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { products } from '../data/catalog';
import type { Product } from '../data/types';

const KEY = 'dynastic.cart.v1';

export interface CartLine {
  slug: string;
  qty: number;
  /** id de variante, cuando el producto tenga variantes cargadas */
  variant?: string;
}

export interface CartItem extends CartLine {
  product: Product;
}

interface CartApi {
  lines: CartLine[];
  items: CartItem[];
  count: number;
  /** Suma de los productos con precio. `null` si ningún producto tiene precio. */
  subtotal: number | null;
  /** Cuántas líneas del carrito aún no tienen precio cargado. */
  pendingPrices: number;
  add: (slug: string, qty?: number, variant?: string) => void;
  setQty: (slug: string, qty: number, variant?: string) => void;
  remove: (slug: string, variant?: string) => void;
  clear: () => void;
}

const CartCtx = createContext<CartApi | null>(null);

const sameLine = (a: CartLine, slug: string, variant?: string) =>
  a.slug === slug && (a.variant ?? '') === (variant ?? '');

/**
 * Lee el carrito guardado. Se ejecuta como inicializador de `useState`, no en un
 * efecto: así no existe un primer render con el carrito vacío que pisaría el
 * localStorage y perdería el carrito al recargar.
 */
function readStoredCart(): CartLine[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CartLine[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((l) => products.some((p) => p.slug === l.slug));
  } catch {
    /* almacenamiento bloqueado o dato corrupto: se arranca vacío */
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>(readStoredCart);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(lines));
    } catch {
      /* modo privado: el carrito sigue funcionando en memoria */
    }
  }, [lines]);

  const add = useCallback((slug: string, qty = 1, variant?: string) => {
    setLines((prev) => {
      const i = prev.findIndex((l) => sameLine(l, slug, variant));
      if (i === -1) return [...prev, { slug, qty, variant }];
      const next = [...prev];
      next[i] = { ...next[i], qty: next[i].qty + qty };
      return next;
    });
  }, []);

  const setQty = useCallback((slug: string, qty: number, variant?: string) => {
    setLines((prev) =>
      qty <= 0
        ? prev.filter((l) => !sameLine(l, slug, variant))
        : prev.map((l) => (sameLine(l, slug, variant) ? { ...l, qty } : l)),
    );
  }, []);

  const remove = useCallback((slug: string, variant?: string) => {
    setLines((prev) => prev.filter((l) => !sameLine(l, slug, variant)));
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const value = useMemo<CartApi>(() => {
    const items = lines
      .map((l) => {
        const product = products.find((p) => p.slug === l.slug);
        return product ? { ...l, product } : null;
      })
      .filter(Boolean) as CartItem[];

    const priced = items.filter((i) => typeof i.product.price === 'number');
    const subtotal = priced.length
      ? priced.reduce((sum, i) => sum + (i.product.price as number) * i.qty, 0)
      : null;

    return {
      lines,
      items,
      count: items.reduce((n, i) => n + i.qty, 0),
      subtotal,
      pendingPrices: items.length - priced.length,
      add,
      setQty,
      remove,
      clear,
    };
  }, [lines, add, setQty, remove, clear]);

  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>;
}

export function useCart() {
  const ctx = useContext(CartCtx);
  if (!ctx) throw new Error('useCart debe usarse dentro de <CartProvider>');
  return ctx;
}
