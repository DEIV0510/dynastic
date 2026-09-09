import manifest from '../data/images.json';

type Entry = { sizes: number[]; w: number; h: number };
const M = manifest as Record<string, Entry>;

const dir = (name: string) =>
  name in M && (name === 'logo-full' || name === 'hero-lineup' || name === 'symbol')
    ? '/img/brand'
    : '/img/products';

/** Ancho más grande disponible: usado como `src` de respaldo. */
export const imgSrc = (name: string) => {
  const e = M[name];
  if (!e) return '';
  return `${dir(name)}/${name}-${e.sizes[e.sizes.length - 1]}.webp`;
};

/** srcset completo — el navegador escoge según DPR y ancho real de la caja. */
export const imgSrcSet = (name: string) => {
  const e = M[name];
  if (!e) return '';
  return e.sizes.map((w) => `${dir(name)}/${name}-${w}.webp ${w}w`).join(', ');
};

export const imgDims = (name: string) => {
  const e = M[name];
  return e ? { width: e.w, height: e.h } : { width: 1, height: 1 };
};

export const hasImg = (name: string) => name in M;
