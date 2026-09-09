import { Link } from 'react-router-dom';
import type { Product } from '../data/types';
import { discountPct, isOnOffer } from '../data/catalog';
import { formatPrice, PRICE_ON_REQUEST } from '../lib/format';
import { waProduct } from '../lib/whatsapp';
import { useCart } from '../store/cart';
import { useUi } from '../store/ui';
import { useTilt } from '../lib/hooks';
import { ProductImage } from './Primitives';
import { IconWhatsApp, IconCart } from './Icons';

const CARD_SIZES =
  '(min-width:1280px) 300px, (min-width:1024px) 25vw, (min-width:640px) 42vw, 78vw';

export default function ProductCard({
  product,
  priority = false,
}: {
  product: Product;
  priority?: boolean;
}) {
  const tilt = useTilt(6);
  const { add } = useCart();
  const { open } = useUi();
  const offer = isOnOffer(product);
  const sold = product.stock === 0;

  return (
    <article className="group relative h-full">
      <div
        {...tilt}
        className="card glow-ring flex h-full flex-col transition-[box-shadow,border-color,transform] duration-300 will-change-transform group-hover:border-electric/40 group-hover:shadow-glow"
      >
        {/* lecho del producto: color plano, el recorte se apoya sobre él */}
        <Link
          to={`/producto/${product.slug}`}
          className="plate relative block overflow-hidden"
          aria-label={product.name}
        >
          <div
            aria-hidden
            className="absolute inset-x-6 bottom-0 top-8 rounded-full bg-electric/[0.14] opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
          />
          <div className="relative flex aspect-square items-center justify-center p-6">
            <ProductImage
              name={product.image}
              alt={product.name}
              sizes={CARD_SIZES}
              priority={priority}
              className="max-h-full w-auto max-w-full object-contain [filter:drop-shadow(var(--sh-product))] transition-transform duration-500 ease-out group-hover:scale-[1.045]"
            />
          </div>

          <div className="pointer-events-none absolute left-4 top-4 flex flex-col items-start gap-2">
            {offer && (
              <span className="rounded-full bg-electric px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-white shadow-glow-sm">
                -{discountPct(product)}%
              </span>
            )}
            {product.badge && !offer && (
              <span className="rounded-full border border-hair bg-surface/80 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-silver-200 backdrop-blur">
                {product.badge}
              </span>
            )}
            {sold && (
              <span className="rounded-full bg-silver-300 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-void">
                Agotado
              </span>
            )}
          </div>
        </Link>

        <div className="flex flex-1 flex-col gap-3 border-t border-hair p-4 sm:p-5">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-electric-300">
              {product.brand ?? 'DYNASTIC'}
            </p>
            <h3 className="mt-1.5 font-display text-[15px] font-semibold leading-snug text-heading">
              <Link
                to={`/producto/${product.slug}`}
                className="after:absolute after:inset-0 after:content-['']"
              >
                {product.name}
              </Link>
            </h3>
          </div>

          <div className="mt-auto flex items-baseline gap-2">
            {typeof product.price === 'number' ? (
              <>
                <span className="font-display text-lg font-bold text-heading">
                  {formatPrice(product.price)}
                </span>
                {offer && (
                  <span className="text-xs text-silver-500 line-through">
                    {formatPrice(product.priceBefore as number)}
                  </span>
                )}
              </>
            ) : (
              <span className="text-[13px] font-medium text-silver-300">{PRICE_ON_REQUEST}</span>
            )}
          </div>

          <div className="relative z-10 flex gap-2">
            {typeof product.price === 'number' ? (
              <button
                type="button"
                onClick={() => {
                  add(product.slug);
                  open('cart');
                }}
                className="btn-primary btn-sm min-w-0 flex-1 whitespace-nowrap !px-2 !text-[10px] !tracking-[0.04em] sm:!px-3 sm:!text-[11px] sm:!tracking-[0.1em]"
              >
                <IconCart className="h-4 w-4" />
                Comprar
              </button>
            ) : (
              <Link
                to={`/producto/${product.slug}`}
                className="btn-ghost btn-sm min-w-0 flex-1 whitespace-nowrap !px-2 !text-[10px] !tracking-[0.04em] sm:!px-3 sm:!text-[11px] sm:!tracking-[0.1em]"
              >
                Ver detalle
              </Link>
            )}
            <a
              href={waProduct(product)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-wa btn-sm w-10 shrink-0 !px-0"
              aria-label={`Consultar ${product.name} por WhatsApp`}
              title="Consultar por WhatsApp"
            >
              <IconWhatsApp className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}
