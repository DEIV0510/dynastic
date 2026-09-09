import { site } from '../data/site';
import type { Product } from '../data/types';
import { formatPrice } from './format';

const base = `https://wa.me/${site.whatsapp}`;

const link = (text: string) => `${base}?text=${encodeURIComponent(text)}`;

/** Consulta general — botón flotante, header, contacto. */
export const waGeneral = () => link(`Hola ${site.name}, quiero conocer más sobre sus productos.`);

/** Consulta por un producto concreto. */
export const waProduct = (p: Product) => {
  const price = typeof p.price === 'number' ? ` (${formatPrice(p.price)})` : '';
  return link(
    `Hola ${site.name}, estoy interesado en el producto "${p.name}"${price}. ¿Me pueden dar más información?`,
  );
};

/** "Quiero este" — intención de compra directa sobre un producto. */
export const waBuy = (p: Product, qty = 1) =>
  link(
    `Hola ${site.name}, quiero comprar ${qty} x "${p.name}". ¿Me confirman disponibilidad y forma de pago?`,
  );

/** Consulta por una categoría completa. */
export const waCategory = (name: string) =>
  link(`Hola ${site.name}, quiero ver lo que tienen en ${name}.`);

/** Checkout del carrito: envía el pedido completo como texto legible. */
export const waCart = (items: { product: Product; qty: number }[], total: number | null) => {
  const lines = items.map(
    ({ product, qty }) =>
      `• ${qty} x ${product.name}${typeof product.price === 'number' ? ` — ${formatPrice(product.price * qty)}` : ''}`,
  );
  const totalLine =
    total !== null ? `\n\nTotal: ${formatPrice(total)}` : '\n\nQuedo atento a la cotización.';
  return link(`Hola ${site.name}, quiero hacer este pedido:\n\n${lines.join('\n')}${totalLine}`);
};
