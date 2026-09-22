export type CategorySlug =
  | 'audifonos'
  | 'diademas'
  | 'smartwatch'
  | 'relojes'
  | 'parlantes'
  | 'powerbank'
  | 'cargadores'
  | 'proyectores'
  | 'intercomunicadores'
  | 'camaras'
  | 'tvbox'
  | 'gadgets';

export interface Category {
  slug: CategorySlug;
  name: string;
  /** Short commercial line — no filler, no invented claims. */
  blurb: string;
  /** Slug of the product whose photo represents the category. */
  cover: string;
}

export interface ProductVariant {
  id: string;
  label: string;
  /** Overrides the base price when present. */
  price?: number | null;
  stock?: number | null;
}

export interface Product {
  slug: string;
  name: string;
  category: CategorySlug;
  /** `null` when the brand is not legible on the official photo. Never guessed. */
  brand: string | null;
  /** Manufacturer reference / model. `null` until confirmed. */
  reference: string | null;
  /** COP. `null` = price on request through WhatsApp (current pre-order model). */
  price: number | null;
  /** Previous price. When both exist the UI renders the discount automatically. */
  priceBefore: number | null;
  /** `null` = not tracked yet. 0 = out of stock. */
  stock: number | null;
  /** Only facts readable on the product photo. */
  features: string[];
  /** One commercial line. */
  tagline: string;
  /** Colour options, empty until confirmed with the supplier. */
  colors: string[];
  variants: ProductVariant[];
  /** Average rating + count. `null` until real reviews exist. */
  rating: number | null;
  reviews: number | null;
  /** Selección editorial: pesa en el orden «Relevancia» (ver src/lib/ranking.ts). */
  featured: boolean;
  /** Search helpers. */
  keywords: string[];
  /** Image basename in /img/products (a -320/-640/-960 .webp set). */
  image: string;
  /** Extra gallery images, same convention. Empty until more photos arrive. */
  gallery: string[];
  /** Rough aspect guidance so cards never shift layout. */
  imageRatio: number;
}
