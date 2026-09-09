import Seo, { organizationLd } from '../components/Seo';
import Surface from '../components/Surface';
import { site } from '../data/site';
import Hero from '../sections/Hero';
import Categories from '../sections/Categories';
import Featured from '../sections/Featured';
import Offers from '../sections/Offers';
import Spotlight from '../sections/Spotlight';
import Why from '../sections/Why';
import Vision from '../sections/Vision';

/**
 * Ritmo de la página: oscuro para los momentos de impacto y claro para las
 * zonas donde el visitante lee y elige. Cinco zonas, no una sola pared negra.
 */
export default function Home() {
  return (
    <>
      <Seo
        title={`${site.name} | Tecnología e Innovación`}
        description="Descubre tecnología, gadgets y accesorios seleccionados para hacer tu vida más práctica, conectada y extraordinaria."
        path="/"
        jsonLd={[
          organizationLd(),
          {
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: site.name,
            url: site.url,
            inLanguage: 'es-CO',
            potentialAction: {
              '@type': 'SearchAction',
              target: `${site.url}/productos?q={search_term_string}`,
              'query-input': 'required name=search_term_string',
            },
          },
        ]}
      />

      {/* 1 — impacto */}
      <Hero />

      {/* 2 — explorar y elegir */}
      <Surface tone="light">
        <Categories />
        <Featured />
      </Surface>

      {/* 3 — el producto, en grande */}
      <Spotlight />

      {/* 4 — precio y confianza */}
      <Surface tone="light">
        <Offers />
        <Why />
      </Surface>

      {/* 5 — marca y cierre en un solo bloque */}
      <Vision />
    </>
  );
}
