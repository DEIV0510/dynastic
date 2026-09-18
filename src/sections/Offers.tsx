import { Link } from 'react-router-dom';
import { discountPct, offerProducts } from '../data/catalog';
import { ranked, topProducts } from '../lib/catalogRanking';
import { formatPrice } from '../lib/format';
import { waProduct, waGeneral } from '../lib/whatsapp';
import { useCart } from '../store/cart';
import { useUi } from '../store/ui';
import { ProductImage, Reveal, SectionHead } from '../components/Primitives';
import { IconArrow, IconWhatsApp } from '../components/Icons';

/**
 * Sección de ofertas 100% guiada por datos.
 *
 * Con `price` + `priceBefore` cargados en el catálogo, renderiza las tarjetas
 * comerciales ANTES / AHORA / -XX%. Mientras no haya precios publicados —el
 * modelo actual es preventa y cotización por WhatsApp— muestra la franja de
 * precio directo, sin inventar cifras.
 */
export default function Offers({ standalone = false }: { standalone?: boolean }) {
  // Mayor descuento primero; a igual descuento decide el ranking (sort estable).
  const deals = ranked(offerProducts()).sort((a, b) => discountPct(b) - discountPct(a));
  const { add } = useCart();
  const { open } = useUi();

  if (deals.length > 0) {
    return (
      <section
        id="ofertas"
        className={`relative border-t border-hair ${standalone ? 'py-16' : 'py-14 sm:py-20'}`}
      >
        <div className="container-x">
          <SectionHead
            eyebrow="Ofertas DYNASTIC"
            title={
              <>
                Precios que <span className="text-silver-sheen">no duran</span>
              </>
            }
            lead="Descuentos vigentes sobre productos en stock."
            to={standalone ? undefined : '/ofertas'}
          />
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {deals.map((p, i) => (
              <Reveal as="li" key={p.slug} delay={i * 60}>
                <article className="card group relative flex h-full items-center gap-4 p-4 transition-colors hover:border-electric/45">
                  <Link
                    to={`/producto/${p.slug}`}
                    className="plate grid h-28 w-28 shrink-0 place-items-center overflow-hidden rounded-xl p-2"
                  >
                    <ProductImage
                      name={p.image}
                      alt={p.name}
                      sizes="112px"
                      className="max-h-full w-auto object-contain transition-transform duration-500 group-hover:scale-105"
                    />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <span className="inline-block rounded-full bg-electric px-2 py-0.5 text-[10px] font-bold tracking-widest text-white">
                      -{discountPct(p)}%
                    </span>
                    <h3 className="mt-2 font-display text-[14px] font-semibold leading-snug text-heading">
                      <Link to={`/producto/${p.slug}`}>{p.name}</Link>
                    </h3>
                    <p className="mt-1.5 text-[12px] text-silver-500">
                      Antes{' '}
                      <span className="line-through">{formatPrice(p.priceBefore as number)}</span>
                    </p>
                    <p className="font-display text-lg font-bold text-heading">
                      Ahora {formatPrice(p.price as number)}
                    </p>
                    <button
                      onClick={() => {
                        add(p.slug);
                        open('cart');
                      }}
                      className="btn-primary btn-sm mt-3"
                    >
                      Comprar
                    </button>
                  </div>
                </article>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>
    );
  }

  // Sin precios publicados todavía: franja de cotización directa.
  const strip = topProducts(4);

  return (
    <section
      id="ofertas"
      className={`relative border-t border-hair ${standalone ? 'py-16' : 'py-14 sm:py-20'}`}
    >
      <div className="container-x">
        <SectionHead
          eyebrow="Ofertas DYNASTIC"
          title={
            <>
              Precio directo, <span className="text-silver-sheen">sin intermediarios</span>
            </>
          }
          lead="Manejamos preventa: nos escribes, te confirmamos precio y disponibilidad al instante. Las promociones vigentes se publican aquí."
        />

        <div className="card relative overflow-hidden p-5 sm:p-8">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-electric/20 blur-[90px]"
          />
          <ul className="relative grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {strip.map((p, i) => (
              <Reveal as="li" key={p.slug} delay={i * 60}>
                <div className="group flex h-full flex-col rounded-2xl border border-hair bg-glass transition-colors hover:border-electric/45">
                  <Link
                    to={`/producto/${p.slug}`}
                    className="plate grid place-items-center overflow-hidden rounded-t-2xl p-4"
                  >
                    <ProductImage
                      name={p.image}
                      alt={p.name}
                      sizes="(min-width:1024px) 200px, 40vw"
                      className="h-24 w-auto max-w-full object-contain transition-transform duration-500 group-hover:scale-105 sm:h-28"
                    />
                  </Link>
                  <div className="flex flex-1 flex-col gap-2 p-3">
                    <h3 className="font-display text-[13px] font-semibold leading-snug text-heading">
                      <Link to={`/producto/${p.slug}`}>{p.name}</Link>
                    </h3>
                    <a
                      href={waProduct(p)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-auto inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-electric-300 hover:text-heading"
                    >
                      Consultar precio
                      <IconArrow className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>
              </Reveal>
            ))}
          </ul>

          <div className="relative mt-7 flex flex-col items-center gap-3 border-t border-hair pt-6 sm:flex-row sm:justify-between">
            <p className="text-center text-[13px] text-silver-400 sm:text-left">
              ¿Buscas algo puntual? Te cotizamos en minutos.
            </p>
            <a
              href={waGeneral()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-wa btn-md w-full sm:w-auto"
            >
              <IconWhatsApp className="h-4 w-4" />
              Pedir cotización
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
