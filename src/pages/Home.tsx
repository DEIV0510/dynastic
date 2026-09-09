import Seo, { organizationLd } from '../components/Seo';
import { site } from '../data/site';
import Hero from '../sections/Hero';
import Categories from '../sections/Categories';
import Featured from '../sections/Featured';
import Offers from '../sections/Offers';
import Spotlight from '../sections/Spotlight';
import Why from '../sections/Why';
import Vision from '../sections/Vision';
import FinalBanner from '../sections/FinalBanner';

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
      <Hero />
      <Categories />
      <Featured />
      <Offers />
      <Spotlight />
      <Why />
      <Vision />
      <FinalBanner />
    </>
  );
}
