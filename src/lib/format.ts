import { site } from '../data/site';

const cop = new Intl.NumberFormat(site.locale, {
  style: 'currency',
  currency: site.currency,
  maximumFractionDigits: 0,
});

export const formatPrice = (value: number) => cop.format(value);

/** Etiqueta que reemplaza al precio mientras el catálogo no lo tenga cargado. */
export const PRICE_ON_REQUEST = 'Precio por WhatsApp';

export const priceLabel = (value: number | null) =>
  typeof value === 'number' ? formatPrice(value) : PRICE_ON_REQUEST;

/** Normaliza para buscar: sin tildes, minúsculas. */
export const normalize = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
