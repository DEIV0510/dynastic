import { useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import Seo from '../components/Seo';
import PageHeader from '../components/PageHeader';
import Surface from '../components/Surface';
import ProductCard from '../components/ProductCard';
import MobileBar from '../components/MobileBar';
import { ProductImage, Reveal } from '../components/Primitives';
import { categoryBySlug, discountPct, isOnOffer, productBySlug } from '../data/catalog';
import { badgeFor, rankedRelated } from '../lib/catalogRanking';
import { formatPrice, PRICE_ON_REQUEST } from '../lib/format';
import { waBuy, waProduct } from '../lib/whatsapp';
import { useCart } from '../store/cart';
import { useUi } from '../store/ui';
import { useTilt } from '../lib/hooks';
import { site } from '../data/site';
import { imgSrc } from '../lib/img';
import {
  IconArrow,
  IconChat,
  IconMinus,
  IconPlus,
  IconShield,
  IconTruck,
  IconWhatsApp,
} from '../components/Icons';

export default function ProductDetail() {
  const { slug = '' } = useParams();
  const product = productBySlug(slug);
  const [qty, setQty] = useState(1);
  const [variant, setVariant] = useState<string | undefined>(undefined);
  const [shot, setShot] = useState(0);
  const tilt = useTilt(8);
  const { add } = useCart();
  const { open } = useUi();

  if (!product) return <Navigate to="/productos" replace />;

  const category = categoryBySlug(product.category);
  const offer = isOnOffer(product);
  const gallery = [product.image, ...product.gallery];
  const current = gallery[Math.min(shot, gallery.length - 1)];
  const sold = product.stock === 0;
  const badge = badgeFor(product.slug);
  const priced = typeof product.price === 'number';

  const addToCart = () => {
    add(product.slug, qty, variant);
    open('cart');
  };

  return (
    <>
      <Seo
        title={`${product.name} | ${site.name}`}
        description={`${product.tagline} ${product.features.slice(0, 2).join('. ')}.`}
        path={`/producto/${product.slug}`}
        type="product"
        image={imgSrc(product.image)}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: product.name,
          description: `${product.tagline} ${product.features.join('. ')}.`,
          image: `${site.url}${imgSrc(product.image)}`,
          sku: product.reference ?? product.slug,
          ...(product.brand ? { brand: { '@type': 'Brand', name: product.brand } } : {}),
          category: category?.name,
          offers: {
            '@type': 'Offer',
            url: `${site.url}/producto/${product.slug}`,
            priceCurrency: site.currency,
            ...(priced ? { price: product.price } : {}),
            availability: sold
              ? 'https://schema.org/OutOfStock'
              : priced
                ? 'https://schema.org/InStock'
                : 'https://schema.org/PreOrder',
            seller: { '@type': 'Organization', name: site.name },
          },
        }}
      />

      <PageHeader
        eyebrow={category?.name ?? 'Producto'}
        title={product.name}
        crumbs={[
          { to: '/productos', label: 'Productos' },
          { to: `/categoria/${product.category}`, label: category?.name ?? '' },
          { label: product.name },
        ]}
      />

      <Surface tone="light">
        <section className="py-10 sm:py-14">
          <div className="container-x">
            <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
              {/* galería */}
              <Reveal>
                <div
                  {...tilt}
                  className="relative transition-transform duration-300 will-change-transform"
                >
                  <div
                    aria-hidden
                    className="absolute inset-8 rounded-[50%] bg-electric/25 blur-[80px]"
                  />
                  <div className="plate relative overflow-hidden rounded-[28px] border border-hair shadow-plate">
                    <div
                      aria-hidden
                      className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,rgba(11,132,255,.2),transparent_65%)]"
                    />
                    <div className="relative grid aspect-square place-items-center p-8 sm:p-12">
                      <ProductImage
                        name={current}
                        alt={product.name}
                        sizes="(min-width:1024px) 560px, 92vw"
                        priority
                        className="max-h-full w-auto max-w-full object-contain [filter:drop-shadow(var(--sh-product))]"
                      />
                    </div>
                    {offer && (
                      <span className="absolute left-5 top-5 rounded-full bg-electric px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-white shadow-glow-sm">
                        -{discountPct(product)}%
                      </span>
                    )}
                  </div>
                </div>

                {gallery.length > 1 && (
                  <ul className="mt-4 flex gap-3">
                    {gallery.map((g, i) => (
                      <li key={g}>
                        <button
                          onClick={() => setShot(i)}
                          aria-label={`Ver imagen ${i + 1} de ${product.name}`}
                          aria-pressed={i === shot}
                          className={`plate grid h-20 w-20 place-items-center overflow-hidden rounded-xl border p-2 transition-colors ${
                            i === shot
                              ? 'border-electric/70'
                              : 'border-hair hover:border-electric/40'
                          }`}
                        >
                          <ProductImage
                            name={g}
                            alt=""
                            sizes="80px"
                            className="max-h-full w-auto object-contain"
                          />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </Reveal>

              {/* información */}
              <Reveal delay={80}>
                <div className="flex flex-wrap items-center gap-2">
                  {product.brand && <span className="chip text-silver-200">{product.brand}</span>}
                  {product.reference && (
                    <span className="chip text-silver-400">Ref. {product.reference}</span>
                  )}
                  {badge && (
                    <span className="chip border-electric/40 bg-electric/10 text-electric-300">
                      {badge.text}
                    </span>
                  )}
                  {sold && <span className="chip border-silver-600 text-silver-300">Agotado</span>}
                </div>

                <h2 className="h-display mt-5 text-[clamp(1.6rem,4vw,2.4rem)] normal-case tracking-tight">
                  {product.tagline}
                </h2>

                <div className="mt-6 flex items-baseline gap-3">
                  {priced ? (
                    <>
                      <span className="font-display text-3xl font-extrabold text-heading">
                        {formatPrice(product.price as number)}
                      </span>
                      {offer && (
                        <span className="text-base text-silver-500 line-through">
                          {formatPrice(product.priceBefore as number)}
                        </span>
                      )}
                    </>
                  ) : (
                    <span className="font-display text-xl font-bold text-silver-200">
                      {PRICE_ON_REQUEST}
                    </span>
                  )}
                </div>

                {product.rating !== null && (
                  <p className="mt-2 text-[13px] text-silver-400">
                    ★ {product.rating.toFixed(1)}
                    {product.reviews ? ` · ${product.reviews} reseñas` : ''}
                  </p>
                )}

                {product.features.length > 0 && (
                  <>
                    <h3 className="eyebrow mt-8">Características</h3>
                    <ul className="mt-3 grid gap-2.5">
                      {product.features.map((f) => (
                        <li
                          key={f}
                          className="flex items-start gap-2.5 text-[14px] leading-relaxed text-silver-300"
                        >
                          <span
                            aria-hidden
                            className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-electric shadow-glow-sm"
                          />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </>
                )}

                {/* Variantes y colores se muestran solos cuando el catálogo los tenga. */}
                {product.variants.length > 0 && (
                  <>
                    <h3 className="eyebrow mt-8">Presentación</h3>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {product.variants.map((v) => (
                        <button
                          key={v.id}
                          onClick={() => setVariant(v.id)}
                          aria-pressed={variant === v.id}
                          className={`rounded-full border px-4 py-2 text-[12px] transition-colors ${
                            variant === v.id
                              ? 'border-electric/60 bg-electric/15 text-heading'
                              : 'border-hair text-silver-400 hover:text-heading'
                          }`}
                        >
                          {v.label}
                        </button>
                      ))}
                    </div>
                  </>
                )}

                {product.colors.length > 0 && (
                  <>
                    <h3 className="eyebrow mt-8">Colores</h3>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {product.colors.map((c) => (
                        <span key={c} className="chip">
                          {c}
                        </span>
                      ))}
                    </div>
                  </>
                )}

                {/* acciones */}
                <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
                  {priced && !sold && (
                    <div className="flex h-14 items-center rounded-full border border-hair px-2">
                      <button
                        onClick={() => setQty((n) => Math.max(1, n - 1))}
                        aria-label="Disminuir cantidad"
                        className="grid h-10 w-10 place-items-center rounded-full text-silver-300 hover:text-heading"
                      >
                        <IconMinus className="h-4 w-4" />
                      </button>
                      <span
                        className="w-9 text-center font-display font-bold text-heading"
                        aria-live="polite"
                      >
                        {qty}
                      </span>
                      <button
                        onClick={() => setQty((n) => n + 1)}
                        aria-label="Aumentar cantidad"
                        className="grid h-10 w-10 place-items-center rounded-full text-silver-300 hover:text-heading"
                      >
                        <IconPlus className="h-4 w-4" />
                      </button>
                    </div>
                  )}

                  {priced && !sold ? (
                    <button onClick={addToCart} className="btn-primary btn-lg w-full sm:flex-1">
                      Comprar ahora
                      <IconArrow className="h-4 w-4" />
                    </button>
                  ) : (
                    <a
                      href={waBuy(product, qty)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary btn-lg w-full sm:flex-1"
                    >
                      Quiero este producto
                      <IconArrow className="h-4 w-4" />
                    </a>
                  )}
                </div>

                <a
                  href={waProduct(product)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-wa btn-lg mt-3 w-full"
                >
                  <IconWhatsApp className="h-4 w-4" />
                  Consultar por WhatsApp
                </a>

                <ul className="mt-8 grid gap-3 border-t border-hair pt-6 sm:grid-cols-3">
                  {[
                    { icon: IconTruck, label: 'Envíos a todo Colombia' },
                    { icon: IconChat, label: 'Asesoría antes de comprar' },
                    { icon: IconShield, label: 'Producto revisado' },
                  ].map((b) => (
                    <li
                      key={b.label}
                      className="flex items-center gap-2.5 text-[13px] text-silver-400"
                    >
                      <b.icon className="h-4 w-4 shrink-0 text-electric-300" />
                      {b.label}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>

            {/* relacionados */}
            <div className="mt-14 border-t border-hair pt-12">
              <div className="mb-8 flex items-end justify-between gap-4">
                <div>
                  <p className="eyebrow">También te puede gustar</p>
                  <h2 className="h-display mt-3 text-[clamp(1.5rem,4vw,2.4rem)]">
                    Sigue explorando
                  </h2>
                </div>
                <Link to="/productos" className="btn-ghost btn-sm shrink-0">
                  Ver todo
                </Link>
              </div>
              <ul className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
                {rankedRelated(product).map((r, i) => (
                  <Reveal as="li" key={r.slug} delay={i * 50} className="h-full">
                    <ProductCard product={r} />
                  </Reveal>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </Surface>

      <MobileBar product={product} onBuy={priced && !sold ? addToCart : undefined} />
    </>
  );
}
