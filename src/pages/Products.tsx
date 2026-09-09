import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Seo from '../components/Seo';
import Surface from '../components/Surface';
import PageHeader from '../components/PageHeader';
import ProductCard from '../components/ProductCard';
import { Reveal } from '../components/Primitives';
import { brands, categories, products } from '../data/catalog';
import { normalize } from '../lib/format';
import { site } from '../data/site';
import { searchProducts } from '../components/SearchOverlay';
import { waGeneral } from '../lib/whatsapp';
import { IconClose, IconSearch, IconWhatsApp } from '../components/Icons';

type Availability = 'all' | 'in' | 'out';

const PRICE_STEPS = [
  { id: 'all', label: 'Todos', test: () => true },
  { id: 'lt150', label: 'Hasta $150.000', test: (v: number) => v < 150_000 },
  {
    id: '150-400',
    label: '$150.000 – $400.000',
    test: (v: number) => v >= 150_000 && v <= 400_000,
  },
  { id: 'gt400', label: 'Más de $400.000', test: (v: number) => v > 400_000 },
];

export default function Products() {
  const [params, setParams] = useSearchParams();
  const q = params.get('q') ?? '';
  const [cat, setCat] = useState<string>('all');
  const [brand, setBrand] = useState<string>('all');
  const [price, setPrice] = useState<string>('all');
  const [avail, setAvail] = useState<Availability>('all');

  const hasPrices = products.some((p) => typeof p.price === 'number');
  const hasStock = products.some((p) => typeof p.stock === 'number');
  const brandList = brands();

  const results = useMemo(() => {
    let list = q.trim() ? searchProducts(q) : products;
    if (cat !== 'all') list = list.filter((p) => p.category === cat);
    if (brand !== 'all') list = list.filter((p) => normalize(p.brand ?? '') === normalize(brand));
    if (hasPrices && price !== 'all') {
      const step = PRICE_STEPS.find((s) => s.id === price);
      list = list.filter((p) => typeof p.price === 'number' && step!.test(p.price));
    }
    if (hasStock && avail !== 'all') {
      list = list.filter((p) => (avail === 'in' ? p.stock === null || p.stock > 0 : p.stock === 0));
    }
    return list;
  }, [q, cat, brand, price, avail, hasPrices, hasStock]);

  const active = cat !== 'all' || brand !== 'all' || price !== 'all' || avail !== 'all' || q !== '';

  const reset = () => {
    setCat('all');
    setBrand('all');
    setPrice('all');
    setAvail('all');
    setParams({});
  };

  return (
    <>
      <Seo
        title={`Productos | ${site.name}`}
        description="Audífonos, smartwatch, parlantes, proyectores, powerbanks, cargadores y gadgets seleccionados por DYNASTIC."
        path="/productos"
      />

      <PageHeader
        eyebrow="Catálogo"
        title={
          <>
            Todo lo que <span className="text-silver-sheen">tenemos</span>
          </>
        }
        lead="Tecnología seleccionada, lista para tu día a día."
        crumbs={[{ label: 'Productos' }]}
      >
        <div className="mt-8 flex max-w-md items-center gap-3 rounded-2xl border border-hair bg-surface/80 px-4">
          <IconSearch className="h-5 w-5 shrink-0 text-electric-300" />
          <input
            value={q}
            onChange={(e) => setParams(e.target.value ? { q: e.target.value } : {})}
            type="search"
            placeholder="Busca tecnología, gadgets, accesorios..."
            aria-label="Buscar en el catálogo"
            className="h-12 w-full bg-transparent text-[14px] text-heading placeholder:text-silver-500 focus:outline-none"
          />
        </div>
      </PageHeader>

      <Surface tone="light">
        <section className="py-10 sm:py-14">
          <div className="container-x">
            {/* filtros */}
            <div className="mb-8 space-y-4">
              <Filter label="Categoría">
                <Pill active={cat === 'all'} onClick={() => setCat('all')}>
                  Todas
                </Pill>
                {categories.map((c) => (
                  <Pill key={c.slug} active={cat === c.slug} onClick={() => setCat(c.slug)}>
                    {c.name}
                  </Pill>
                ))}
              </Filter>

              {brandList.length > 0 && (
                <Filter label="Marca">
                  <Pill active={brand === 'all'} onClick={() => setBrand('all')}>
                    Todas
                  </Pill>
                  {brandList.map((b) => (
                    <Pill key={b} active={brand === b} onClick={() => setBrand(b)}>
                      {b}
                    </Pill>
                  ))}
                </Filter>
              )}

              {/* Precio y disponibilidad aparecen en cuanto el catálogo tenga esos datos. */}
              {hasPrices && (
                <Filter label="Precio">
                  {PRICE_STEPS.map((s) => (
                    <Pill key={s.id} active={price === s.id} onClick={() => setPrice(s.id)}>
                      {s.label}
                    </Pill>
                  ))}
                </Filter>
              )}

              {hasStock && (
                <Filter label="Disponibilidad">
                  <Pill active={avail === 'all'} onClick={() => setAvail('all')}>
                    Todos
                  </Pill>
                  <Pill active={avail === 'in'} onClick={() => setAvail('in')}>
                    Disponible
                  </Pill>
                  <Pill active={avail === 'out'} onClick={() => setAvail('out')}>
                    Agotado
                  </Pill>
                </Filter>
              )}

              <div className="flex items-center justify-between gap-3 pt-1">
                <p className="text-[13px] text-silver-500" aria-live="polite">
                  {results.length} {results.length === 1 ? 'producto' : 'productos'}
                </p>
                {active && (
                  <button
                    onClick={reset}
                    className="inline-flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-[0.14em] text-silver-400 transition-colors hover:text-heading"
                  >
                    <IconClose className="h-3.5 w-3.5" />
                    Limpiar filtros
                  </button>
                )}
              </div>
            </div>

            {results.length === 0 ? (
              <div className="card mx-auto max-w-lg p-10 text-center">
                <h2 className="font-display text-lg font-bold text-heading">Nada por aquí</h2>
                <p className="mt-2 text-[14px] text-silver-400">
                  No encontramos productos con esos filtros. Escríbenos y lo conseguimos.
                </p>
                <a
                  href={waGeneral()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-wa btn-md mt-6"
                >
                  <IconWhatsApp className="h-4 w-4" />
                  Pedir por WhatsApp
                </a>
              </div>
            ) : (
              <ul className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
                {results.map((p, i) => (
                  <Reveal as="li" key={p.slug} delay={Math.min(i, 8) * 45} className="h-full">
                    <ProductCard product={p} priority={i < 4} />
                  </Reveal>
                ))}
              </ul>
            )}
          </div>
        </section>
      </Surface>
    </>
  );
}

function Filter({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
      <span className="shrink-0 text-[11px] font-semibold uppercase tracking-[0.2em] text-silver-500 sm:w-28">
        {label}
      </span>
      <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1 sm:flex-wrap sm:overflow-visible">
        {children}
      </div>
    </div>
  );
}

function Pill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`shrink-0 whitespace-nowrap rounded-full border px-3.5 py-2 text-[12px] font-medium transition-colors duration-200 ${
        active
          ? 'border-electric/60 bg-electric/15 text-heading'
          : 'border-hair bg-glass text-silver-400 hover:border-electric/40 hover:text-heading'
      }`}
    >
      {children}
    </button>
  );
}
