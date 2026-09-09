import Seo from '../components/Seo';
import Surface from '../components/Surface';
import PageHeader from '../components/PageHeader';
import Offers from '../sections/Offers';
import FinalBanner from '../sections/FinalBanner';
import { site } from '../data/site';

export default function OffersPage() {
  return (
    <>
      <Seo
        title={`Ofertas | ${site.name}`}
        description="Promociones y precios directos de DYNASTIC. Consulta disponibilidad por WhatsApp."
        path="/ofertas"
      />
      <PageHeader
        eyebrow="Ofertas DYNASTIC"
        title={
          <>
            Lo que se <span className="text-silver-sheen">mueve</span>
          </>
        }
        lead="Aquí publicamos las promociones vigentes. Si buscas algo puntual, escríbenos y te cotizamos."
        crumbs={[{ label: 'Ofertas' }]}
      />
      <Surface tone="light">
        <Offers standalone />
      </Surface>
      <FinalBanner />
    </>
  );
}
