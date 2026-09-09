import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useUi } from '../store/ui';
import { useCart } from '../store/cart';
import { useEscape, useLockBody } from '../lib/hooks';
import { formatPrice, PRICE_ON_REQUEST } from '../lib/format';
import { waCart } from '../lib/whatsapp';
import { ProductImage } from './Primitives';
import { IconClose, IconMinus, IconPlus, IconTrash, IconWhatsApp } from './Icons';

export default function CartDrawer() {
  const { panel, close } = useUi();
  const isOpen = panel === 'cart';
  const { items, count, subtotal, pendingPrices, setQty, remove } = useCart();

  useLockBody(isOpen);
  useEscape(isOpen, close);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[70]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          role="dialog"
          aria-modal="true"
          aria-label="Carrito"
        >
          <button
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={close}
            aria-label="Cerrar carrito"
          />

          <motion.aside
            className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col border-l border-hair bg-ink"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', ease: [0.22, 1, 0.36, 1], duration: 0.34 }}
          >
            <header className="flex items-center justify-between border-b border-hair px-5 py-4">
              <div>
                <p className="eyebrow">Tu carrito</p>
                <h2 className="mt-1 font-display text-lg font-bold text-heading">
                  {count} {count === 1 ? 'producto' : 'productos'}
                </h2>
              </div>
              <button
                onClick={close}
                aria-label="Cerrar carrito"
                className="grid h-10 w-10 place-items-center rounded-full text-silver-300 hover:bg-glass hover:text-heading"
              >
                <IconClose />
              </button>
            </header>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
                <p className="font-display text-lg font-semibold text-heading">
                  Tu carrito está vacío
                </p>
                <p className="text-sm text-silver-400">Descubre lo que tenemos para ti.</p>
                <Link to="/productos" onClick={close} className="btn-primary btn-md">
                  Ver productos
                </Link>
              </div>
            ) : (
              <>
                <ul className="no-scrollbar flex-1 space-y-3 overflow-y-auto p-5">
                  {items.map((item) => (
                    <li
                      key={`${item.slug}-${item.variant ?? ''}`}
                      className="flex gap-3 rounded-2xl border border-hair bg-surface/70 p-3"
                    >
                      <Link
                        to={`/producto/${item.slug}`}
                        onClick={close}
                        className="plate grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-xl p-2"
                      >
                        <ProductImage
                          name={item.product.image}
                          alt=""
                          sizes="80px"
                          className="max-h-full w-auto object-contain"
                        />
                      </Link>

                      <div className="min-w-0 flex-1">
                        <Link
                          to={`/producto/${item.slug}`}
                          onClick={close}
                          className="block font-display text-[13px] font-semibold leading-snug text-heading hover:text-electric-300"
                        >
                          {item.product.name}
                        </Link>
                        <p className="mt-1 text-[12px] text-silver-400">
                          {typeof item.product.price === 'number'
                            ? formatPrice(item.product.price)
                            : PRICE_ON_REQUEST}
                        </p>

                        <div className="mt-2.5 flex items-center gap-2">
                          <div className="flex items-center rounded-full border border-hair">
                            <button
                              onClick={() => setQty(item.slug, item.qty - 1, item.variant)}
                              aria-label={`Quitar una unidad de ${item.product.name}`}
                              className="grid h-8 w-8 place-items-center rounded-full text-silver-300 hover:text-heading"
                            >
                              <IconMinus className="h-3.5 w-3.5" />
                            </button>
                            <span
                              className="w-7 text-center text-[13px] font-semibold text-heading"
                              aria-live="polite"
                            >
                              {item.qty}
                            </span>
                            <button
                              onClick={() => setQty(item.slug, item.qty + 1, item.variant)}
                              aria-label={`Agregar una unidad de ${item.product.name}`}
                              className="grid h-8 w-8 place-items-center rounded-full text-silver-300 hover:text-heading"
                            >
                              <IconPlus className="h-3.5 w-3.5" />
                            </button>
                          </div>

                          <button
                            onClick={() => remove(item.slug, item.variant)}
                            aria-label={`Eliminar ${item.product.name} del carrito`}
                            className="ml-auto grid h-8 w-8 place-items-center rounded-full text-silver-500 transition-colors hover:bg-glass hover:text-heading"
                          >
                            <IconTrash className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>

                <footer className="space-y-3 border-t border-hair bg-surface/60 p-5">
                  <div className="flex items-baseline justify-between">
                    <span className="text-[13px] uppercase tracking-[0.18em] text-silver-400">
                      Subtotal
                    </span>
                    <span className="font-display text-xl font-bold text-heading">
                      {subtotal !== null ? formatPrice(subtotal) : 'A cotizar'}
                    </span>
                  </div>
                  {pendingPrices > 0 && (
                    <p className="text-[12px] leading-relaxed text-silver-500">
                      {pendingPrices === items.length
                        ? 'Confirmamos el precio de tu pedido por WhatsApp.'
                        : `${pendingPrices} producto(s) se cotizan por WhatsApp.`}
                    </p>
                  )}

                  <a
                    href={waCart(
                      items.map((i) => ({ product: i.product, qty: i.qty })),
                      subtotal,
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-wa btn-md w-full"
                  >
                    <IconWhatsApp className="h-4 w-4" />
                    Finalizar compra
                  </a>
                  <button onClick={close} className="btn-ghost btn-md w-full">
                    Seguir comprando
                  </button>
                  <p className="pt-1 text-center text-[11px] text-silver-500">
                    Pagos en línea próximamente. Hoy confirmamos tu pedido por WhatsApp.
                  </p>
                </footer>
              </>
            )}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
