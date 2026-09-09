// Genera public/sitemap.xml desde el propio catálogo (una sola fuente de verdad).
import fs from 'fs';
import path from 'path';
import { categories, products } from '../src/data/catalog.ts';
import { site } from '../src/data/site.ts';

const today = new Date().toISOString().slice(0, 10);
const urls = [
  ['/', '1.0', 'weekly'],
  ['/productos', '0.9', 'weekly'],
  ['/categorias', '0.8', 'monthly'],
  ['/ofertas', '0.8', 'weekly'],
  ['/nosotros', '0.6', 'monthly'],
  ['/ayuda', '0.5', 'monthly'],
  ['/contacto', '0.6', 'monthly'],
  ...categories.map((c) => [`/categoria/${c.slug}`, '0.7', 'weekly']),
  ...products.map((p) => [`/producto/${p.slug}`, '0.8', 'weekly']),
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    ([loc, pri, freq]) =>
      `  <url>\n    <loc>${site.url}${loc}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${freq}</changefreq>\n    <priority>${pri}</priority>\n  </url>`,
  )
  .join('\n')}
</urlset>
`;
fs.writeFileSync(path.join('public', 'sitemap.xml'), xml);
console.log(
  `sitemap.xml: ${urls.length} URLs (${categories.length} categorías, ${products.length} productos)`,
);
