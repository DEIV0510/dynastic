import { useEffect } from 'react';
import { site } from '../data/site';

type JsonLd = Record<string, unknown>;

const setMeta = (selector: string, attr: 'name' | 'property', key: string, content: string) => {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
};

/**
 * SEO por página sin dependencias: título, descripción, canónica,
 * Open Graph/Twitter y un bloque JSON-LD opcional.
 */
export default function Seo({
  title,
  description,
  path = '/',
  image = '/img/brand/og.jpg',
  type = 'website',
  jsonLd,
  noindex = false,
}: {
  title: string;
  description: string;
  path?: string;
  image?: string;
  type?: 'website' | 'product' | 'article';
  jsonLd?: JsonLd | JsonLd[];
  noindex?: boolean;
}) {
  useEffect(() => {
    const url = `${site.url}${path}`;
    const absImage = image.startsWith('http') ? image : `${site.url}${image}`;

    document.title = title;
    setMeta('meta[name="description"]', 'name', 'description', description);
    setMeta('meta[name="robots"]', 'name', 'robots', noindex ? 'noindex,nofollow' : 'index,follow');

    let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      link.rel = 'canonical';
      document.head.appendChild(link);
    }
    link.href = url;

    setMeta('meta[property="og:title"]', 'property', 'og:title', title);
    setMeta('meta[property="og:description"]', 'property', 'og:description', description);
    setMeta('meta[property="og:type"]', 'property', 'og:type', type);
    setMeta('meta[property="og:url"]', 'property', 'og:url', url);
    setMeta('meta[property="og:image"]', 'property', 'og:image', absImage);
    setMeta('meta[property="og:site_name"]', 'property', 'og:site_name', site.name);
    setMeta('meta[property="og:locale"]', 'property', 'og:locale', 'es_CO');
    setMeta('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
    setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', title);
    setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', description);
    setMeta('meta[name="twitter:image"]', 'name', 'twitter:image', absImage);
  }, [title, description, path, image, type, noindex]);

  useEffect(() => {
    if (!jsonLd) return;
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.dataset.seo = 'page';
    script.textContent = JSON.stringify(jsonLd);
    document.head.appendChild(script);
    return () => {
      script.remove();
    };
  }, [jsonLd]);

  return null;
}

export const organizationLd = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: site.name,
  alternateName: `${site.name} — ${site.tagline}`,
  url: site.url,
  logo: `${site.url}/img/brand/symbol.png`,
  image: `${site.url}/img/brand/og.jpg`,
  description: site.description,
  slogan: site.claim,
  areaServed: 'CO',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'La Virginia',
    addressRegion: 'Risaralda',
    addressCountry: 'CO',
  },
  contactPoint: [
    {
      '@type': 'ContactPoint',
      contactType: 'sales',
      telephone: `+${site.whatsapp}`,
      availableLanguage: ['es'],
    },
  ],
  sameAs: [site.instagramUrl, `https://wa.me/${site.whatsapp}`],
});
