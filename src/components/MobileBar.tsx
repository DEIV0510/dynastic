import { useEffect } from 'react';
import type { Product } from '../data/types';
import { waBuy, waProduct } from '../lib/whatsapp';
import { priceLabel } from '../lib/format';
import { IconCart, IconWhatsApp } from './Icons';

/**
 * Barra inferior de acción, sólo en móvil y sólo en ficha de producto.
 * Marca el body para que el botón flotante de WhatsApp se aparte.
 */
export default function MobileBar({ product, onBuy }: { product: Product; onBuy?: () => void }) {
  useEffect(() => {
    document.body.dataset.mobilebar = '1';
    return () => {
      delete document.body.dataset.mobilebar;
    };
  }, []);

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-hair bg-void/92 pb-[env(safe-area-inset-bottom,0px)] backdrop-blur-xl sm:hidden">
      <div className="flex items-center gap-2.5 px-4 py-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-[11px] text-silver-500">{product.name}</p>
          <p className="truncate font-display text-[13px] font-bold text-white">
            {priceLabel(product.price)}
          </p>
        </div>

        {onBuy ? (
          <button onClick={onBuy} className="btn-primary btn-sm shrink-0">
            <IconCart className="h-4 w-4" />
            Comprar
          </button>
        ) : (
          <a
            href={waBuy(product)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary btn-sm shrink-0"
          >
            <IconCart className="h-4 w-4" />
            Comprar
          </a>
        )}

        <a
          href={waProduct(product)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Consultar ${product.name} por WhatsApp`}
          className="btn-wa btn-sm w-11 shrink-0 !px-0"
        >
          <IconWhatsApp className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}
