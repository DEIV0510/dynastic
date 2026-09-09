import { Link } from 'react-router-dom';
import { productBySlug } from '../data/catalog';
import { priceLabel } from '../lib/format';
import { waBuy, waProduct } from '../lib/whatsapp';
import { useCart } from '../store/cart';
import { useUi } from '../store/ui';
import { useTilt } from '../lib/hooks';
import { ProductImage, Reveal } from '../components/Primitives';
import { IconArrow, IconWhatsApp } from '../components/Icons';

/** Producto protagonista de la home. Cambia el slug para rotar la campaña. */
const SPOTLIGHT_SLUG = 'proyector-wanbo-fhd';

export default function Spotlight() {
  const p = productBySlug(SPOTLIGHT_SLUG);
  const tilt = useTilt(9);
  const { add } = useCart();
  const { open } = useUi();

  if (!p) return null;

  return (
    <section className="relative isolate overflow-hidden border-t border-hair bg-ink py-14 sm:py-20">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/2 h-[540px] w-[860px] max-w-[150vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-electric/[0.17] blur-[130px]" />
        <div className="absolute inset-0 bg-grid [background-size:60px_60px] opacity-40 [mask-image:radial-gradient(ellipse_at_center,#000,transparent_70%)]" />
      </div>

      <div className="container-x">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
          <Reveal className="order-2 lg:order-1">
            <p className="eyebrow">Tu próximo gadget favorito</p>
            <h2 className="h-display mt-4 text-[clamp(2rem,5.6vw,3.6rem)]">
              {p.name.split(' ').slice(0, 2).join(' ')}
              <br />
              <span className="text-silver-sheen">{p.name.split(' ').slice(2).join(' ')}</span>
            </h2>
            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-silver-400">{p.tagline}</p>

            <ul className="mt-7 grid max-w-md gap-2.5">
              {p.features.slice(0, 4).map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-[14px] text-silver-300">
                  <span
                    aria-hidden
                    className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-electric shadow-glow-sm"
                  />
                  {f}
                </li>
              ))}
            </ul>

            <p className="mt-7 font-display text-2xl font-bold text-heading">
              {priceLabel(p.price)}
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              {typeof p.price === 'number' ? (
                <button
                  onClick={() => {
                    add(p.slug);
                    open('cart');
                  }}
                  className="btn-primary btn-lg"
                >
                  Quiero este
                  <IconArrow className="h-4 w-4" />
                </button>
              ) : (
                <a
                  href={waBuy(p)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary btn-lg"
                >
                  Quiero este
                  <IconArrow className="h-4 w-4" />
                </a>
              )}
              <a
                href={waProduct(p)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-wa btn-lg"
              >
                <IconWhatsApp className="h-4 w-4" />
                Consultar
              </a>
            </div>

            <Link
              to={`/producto/${p.slug}`}
              className="mt-5 inline-flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-[0.16em] text-silver-400 transition-colors hover:text-heading"
            >
              Ver ficha completa
              <IconArrow className="h-3.5 w-3.5" />
            </Link>
          </Reveal>

          <Reveal delay={90} className="order-1 lg:order-2">
            <div
              {...tilt}
              className="relative mx-auto max-w-lg transition-transform duration-300 will-change-transform"
            >
              <div
                aria-hidden
                className="absolute inset-6 rounded-[50%] bg-electric/30 blur-[70px]"
              />
              <div className="plate relative overflow-hidden rounded-[28px] border border-hair shadow-plate">
                <div
                  aria-hidden
                  className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_35%,rgba(11,132,255,.22),transparent_65%)]"
                />
                <div className="relative grid aspect-[4/3] place-items-center p-8">
                  <ProductImage
                    name={p.image}
                    alt={p.name}
                    sizes="(min-width:1024px) 520px, 90vw"
                    className="max-h-full w-auto max-w-full object-contain [filter:drop-shadow(var(--sh-product))]"
                  />
                </div>
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-y-0 -left-1/4 w-1/4 skew-x-[-16deg] bg-gradient-to-r from-transparent via-white/[0.07] to-transparent"
                  style={{ animation: 'sweep 4.5s cubic-bezier(.4,0,.2,1) infinite' }}
                />
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
