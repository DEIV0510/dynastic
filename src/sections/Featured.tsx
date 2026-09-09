import { featuredProducts } from '../data/catalog';
import ProductCard from '../components/ProductCard';
import { Reveal, SectionHead } from '../components/Primitives';

export default function Featured() {
  const items = featuredProducts().slice(0, 8);

  return (
    <section className="relative border-t border-hair py-20 sm:py-28">
      <div className="container-x">
        <SectionHead
          eyebrow="Lo más buscado"
          title={
            <>
              Los que todos <span className="text-silver-sheen">piden</span>
            </>
          }
          lead="Lo que más nos consultan por WhatsApp, en un solo lugar."
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
