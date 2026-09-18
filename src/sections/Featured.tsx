import { salesDataLoaded, topProducts } from '../lib/catalogRanking';
import ProductCard from '../components/ProductCard';
import { Reveal, SectionHead } from '../components/Primitives';

export default function Featured() {
  // Los 4 primeros del ranking. Con ventas cargadas son los más vendidos; sin
  // ellas, la selección editorial. El texto dice cuál de los dos es.
  const items = topProducts(4);

  return (
    <section className="relative border-t border-hair py-14 sm:py-20">
      <div className="container-x">
        <SectionHead
          eyebrow={salesDataLoaded ? 'Lo más vendido' : 'Selección DYNASTIC'}
          title={
            salesDataLoaded ? (
              <>
                Los que todos <span className="text-silver-sheen">piden</span>
              </>
            ) : (
              <>
                Elegidos <span className="text-silver-sheen">para ti</span>
              </>
            )
          }
          lead={
            salesDataLoaded
              ? 'Lo que más se vende en DYNASTIC, en un solo lugar.'
              : 'Nuestros destacados del momento, en un solo lugar.'
          }
          to="/productos"
        />
        <ul className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {items.map((p, i) => (
            <Reveal as="li" key={p.slug} delay={i * 50} className="h-full">
              <ProductCard product={p} priority={i < 2} />
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
