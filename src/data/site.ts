/**
 * Single source of truth for brand-level data.
 * Everything the client may change later lives here, not scattered in components.
 */
export const site = {
  name: 'DYNASTIC',
  tagline: 'Tecnología e Innovación',
  claim: 'Tecnología que te conecta',
  description:
    'Seleccionamos tecnología, accesorios y gadgets diseñados para hacer tu día más práctico, conectado y extraordinario.',
  location: 'La Virginia, Risaralda, Colombia',
  country: 'CO',
  /** Digits only, international format — used to build every wa.me link. */
  whatsapp: '573104218808',
  whatsappDisplay: '310 421 8808',
  instagram: 'dinasticvibe',
  instagramUrl: 'https://instagram.com/dinasticvibe',
  /** Set to the production domain once the site is live; used for canonical + Open Graph. */
  url: 'https://dynastic.vercel.app',
  /** Currency used to format any price added to the catalogue. */
  currency: 'COP',
  locale: 'es-CO',
} as const;

/** Analytics IDs — left empty on purpose; fill in to activate (see src/lib/analytics.ts). */
export const analytics = {
  metaPixelId: '',
  gaMeasurementId: '',
} as const;
