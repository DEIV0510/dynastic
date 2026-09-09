import { Link } from 'react-router-dom';
import { categories, countByCategory } from '../data/catalog';
import { useTilt } from '../lib/hooks';
import { ProductImage, Reveal, SectionHead } from '../components/Primitives';
import { IconArrow } from '../components/Icons';
import type { Category } from '../data/types';

/** Ficha compacta: las 11 categorías caben en dos filas en escritorio. */
function CategoryCard({ c, delay }: { c: Category; delay: number }) {
  const tilt = useTilt(8);
  const count = countByCategory(c.slug);

  return (
    <Reveal as="li" delay={delay} className="h-full">
      <Link
        to={`/categoria/${c.slug}`}
        className="group block h-full"
        aria-label={`${c.name} — descubrir`}
      >
        <div
          {...tilt}
          className="card glow-ring flex h-full flex-col transition-[box-shadow,border-color,transform] duration-300 will-change-transform group-hover:border-electric/40 group-hover:shadow-glow"
        >
          <div className="plate relative overflow-hidden">
            <div
              aria-hidden
              className="absolute inset-x-3 bottom-0 top-4 rounded-full bg-electric/[0.16] opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
            />
            <div className="relative flex aspect-square items-center justify-center p-3.5 sm:p-4">
              <ProductImage
                name={c.cover}
                alt=""
                sizes="(min-width:1280px) 190px, (min-width:1024px) 16vw, (min-width:640px) 22vw, 30vw"
                className="max-h-full w-auto max-w-full object-contain [filter:drop-shadow(var(--sh-product))] transition-transform duration-500 group-hover:scale-[1.07]"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 border-t border-hair px-2.5 py-2.5 sm:px-3">
            <h3 className="min-w-0 flex-1 hyphens-auto break-words font-display text-[10px] font-bold uppercase leading-tight tracking-tight text-heading sm:text-[13px] sm:tracking-wide">
              {c.name}
            </h3>
            <span className="hidden shrink-0 text-[11px] tabular-nums text-silver-600 sm:inline">
              {count}
            </span>
            <IconArrow className="hidden h-3.5 w-3.5 shrink-0 text-electric-300 opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100 sm:block" />
          </div>
        </div>
      </Link>
    </Reveal>
  );
}

export default function Categories() {
  return (
    <section id="categorias" className="relative py-14 sm:py-20">
      <div className="container-x">
        <SectionHead
          eyebrow="Explora DYNASTIC"
          title={
            <>
              Encuentra lo que <span className="text-silver-sheen">buscas</span>
            </>
          }
          lead="Cada categoría, con productos escogidos uno por uno."
          to="/categorias"
          toLabel="Todas las categorías"
        />
        <ul className="grid grid-cols-3 gap-2.5 sm:grid-cols-4 sm:gap-3.5 lg:grid-cols-6">
          {categories.map((c, i) => (
            <CategoryCard key={c.slug} c={c} delay={i * 35} />
          ))}
        </ul>
      </div>
    </section>
  );
}
