import { Link } from 'react-router-dom';
import { categories, countByCategory } from '../data/catalog';
import { useTilt } from '../lib/hooks';
import { ProductImage, Reveal, SectionHead } from '../components/Primitives';
import { IconArrow } from '../components/Icons';
import type { Category } from '../data/types';

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
              className="absolute inset-x-4 bottom-0 top-6 rounded-full bg-electric/[0.16] opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
            />
            <div className="relative flex aspect-[4/3] items-center justify-center p-5">
              <ProductImage
                name={c.cover}
                alt=""
                sizes="(min-width:1024px) 240px, (min-width:640px) 30vw, 44vw"
                className="max-h-full w-auto max-w-full object-contain drop-shadow-[0_18px_24px_rgba(0,0,0,.8)] transition-transform duration-500 group-hover:scale-[1.07]"
              />
            </div>
          </div>

          <div className="flex flex-1 flex-col gap-1 border-t border-hair p-4">
            <div className="flex items-baseline justify-between gap-2">
              <h3 className="font-display text-[14px] font-bold uppercase tracking-wide text-white">
                {c.name}
              </h3>
              <span className="text-[11px] tabular-nums text-silver-600">{count}</span>
            </div>
            <p className="text-[12px] leading-snug text-silver-500">{c.blurb}</p>
            <span className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-electric-300">
              Descubrir
              <IconArrow className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </div>
        </div>
      </Link>
    </Reveal>
  );
}

export default function Categories() {
  return (
    <section id="categorias" className="relative py-20 sm:py-28">
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
        <ul className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
          {categories.map((c, i) => (
            <CategoryCard key={c.slug} c={c} delay={i * 45} />
          ))}
        </ul>
      </div>
    </section>
  );
}
