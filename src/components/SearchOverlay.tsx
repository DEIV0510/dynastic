import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useUi } from '../store/ui';
import { useEscape, useLockBody } from '../lib/hooks';
import { categories, products } from '../data/catalog';
import { normalize, priceLabel } from '../lib/format';
import { ProductImage } from './Primitives';
import { IconClose, IconSearch } from './Icons';

export function searchProducts(query: string) {
  const q = normalize(query).trim();
  if (!q) return [];
  const terms = q.split(/\s+/);
  return products
    .map((p) => {
      const hay = normalize(
        [
          p.name,
          p.brand ?? '',
          p.reference ?? '',
          p.category,
          p.tagline,
          ...p.keywords,
          ...p.features,
        ].join(' '),
      );
      const score = terms.reduce(
        (s, t) => (hay.includes(t) ? s + (normalize(p.name).includes(t) ? 3 : 1) : s),
        0,
      );
      return { p, score, all: terms.every((t) => hay.includes(t)) };
    })
    .filter((r) => r.all && r.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((r) => r.p);
}

export default function SearchOverlay() {
  const { panel, close } = useUi();
  const isOpen = panel === 'search';
  const [q, setQ] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Cerrar también vacía la consulta, para que el panel se abra siempre limpio.
  const dismiss = useCallback(() => {
    setQ('');
    close();
  }, [close]);

  useLockBody(isOpen);
  useEscape(isOpen, dismiss);

  useEffect(() => {
    if (!isOpen) return;
    const t = setTimeout(() => inputRef.current?.focus(), 60);
    return () => clearTimeout(t);
  }, [isOpen]);

  const results = useMemo(() => searchProducts(q), [q]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[70]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          role="dialog"
          aria-modal="true"
          aria-label="Buscador"
        >
          <button
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
            onClick={dismiss}
            aria-label="Cerrar buscador"
          />

          <motion.div
            className="container-x relative pt-20 sm:pt-28"
            initial={{ y: -18, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -12, opacity: 0 }}
            transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="mx-auto max-w-3xl">
              <div className="flex items-center gap-3 rounded-2xl border border-hair bg-surface/95 px-4 shadow-glow">
                <IconSearch className="h-5 w-5 shrink-0 text-electric-300" />
                <input
                  ref={inputRef}
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  type="search"
                  placeholder="Busca tecnología, gadgets, accesorios..."
                  aria-label="Buscar productos"
                  className="h-16 w-full bg-transparent text-[15px] text-heading placeholder:text-silver-500 focus:outline-none"
                />
                <button
                  onClick={dismiss}
                  aria-label="Cerrar buscador"
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-silver-400 hover:bg-glass hover:text-heading"
                >
                  <IconClose className="h-4 w-4" />
                </button>
              </div>

              <div className="no-scrollbar mt-4 max-h-[58vh] overflow-y-auto rounded-2xl">
                {q.trim() === '' ? (
                  <div className="rounded-2xl border border-hair bg-surface/90 p-5">
                    <p className="eyebrow mb-3">Explora por categoría</p>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((c) => (
                        <Link
                          key={c.slug}
                          to={`/categoria/${c.slug}`}
                          onClick={dismiss}
                          className="chip hover:border-electric/50 hover:text-heading"
                        >
                          {c.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : results.length === 0 ? (
                  <div className="rounded-2xl border border-hair bg-surface/90 p-6 text-center">
                    <p className="text-sm text-silver-300">
                      No encontramos <span className="text-heading">“{q}”</span> en el catálogo.
                    </p>
                    <p className="mt-1 text-[13px] text-silver-500">
                      Escríbenos por WhatsApp y lo conseguimos.
                    </p>
                  </div>
                ) : (
                  <ul className="space-y-2">
                    {results.map((p) => (
                      <li key={p.slug}>
                        <Link
                          to={`/producto/${p.slug}`}
                          onClick={dismiss}
                          className="group flex items-center gap-4 rounded-2xl border border-hair bg-surface/90 p-3 transition-colors hover:border-electric/45"
                        >
                          <span className="plate grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-xl p-1.5">
                            <ProductImage
                              name={p.image}
                              alt=""
                              sizes="64px"
                              className="max-h-full w-auto object-contain"
                            />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate font-display text-sm font-semibold text-heading">
                              {p.name}
                            </span>
                            <span className="mt-0.5 block text-[12px] text-silver-500">
                              {p.brand ? `${p.brand} · ` : ''}
                              {categories.find((c) => c.slug === p.category)?.name}
                            </span>
                          </span>
                          <span className="shrink-0 text-[12px] font-medium text-silver-300 group-hover:text-electric-300">
                            {priceLabel(p.price)}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
