import { Link, Navigate, useParams } from 'react-router-dom';
import Seo from '../components/Seo';
import PageHeader from '../components/PageHeader';
import ProductCard from '../components/ProductCard';
import { ProductImage, Reveal, SectionHead } from '../components/Primitives';
import { categories, categoryBySlug, countByCategory, productsByCategory } from '../data/catalog';
import { site } from '../data/site';
import { waCategory } from '../lib/whatsapp';
import { IconArrow, IconWhatsApp } from '../components/Icons';

export function CategoryIndex() {
  return (
    <>
      <Seo
        title={`Categorías | ${site.name}`}
        description="Audio, smartwatch, relojes, parlantes, powerbanks, cargadores, proyectores, intercomunicadores, cámaras y gadgets."
        path="/categorias"
      />
      <PageHeader
        eyebrow="Explora DYNASTIC"
        title={
          <>
            Todas las <span className="text-silver-sheen">categorías</span>
          </>
        }
        lead="Entra a la que te interese y encuentra lo tuyo en dos clics."
        crumbs={[{ label: 'Categorías' }]}
      />

      <section className="py-12 sm:py-16">
        <div className="container-x">
          <ul className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
            {categories.map((c, i) => (
              <Reveal as="li" key={c.slug} delay={i * 45} className="h-full">
                <Link to={`/categoria/${c.slug}`} className="group block h-full">
                  <div className="card glow-ring flex h-full flex-col transition-[box-shadow,border-color] duration-300 group-hover:border-electric/40 group-hover:shadow-glow">
                    <div className="plate relative overflow-hidden">
                      <div
                        aria-hidden
                        className="absolute inset-x-4 bottom-0 top-6 rounded-full bg-electric/[0.16] opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
                      />
                      <div className="relative flex aspect-[4/3] items-center justify-center p-5">
                        <ProductImage
                          name={c.cover}
                          alt=""
                          sizes="(min-width:1024px) 240px, 44vw"
                          className="max-h-full w-auto max-w-full object-contain drop-shadow-[0_18px_24px_rgba(0,0,0,.8)] transition-transform duration-500 group-hover:scale-[1.07]"
                        />
                      </div>
                    </div>
                    <div className="flex flex-1 flex-col gap-1 border-t border-hair p-4">
                      <div className="flex items-baseline justify-between gap-2">
                        <h2 className="font-display text-[14px] font-bold uppercase tracking-wide text-white">
                          {c.name}
                        </h2>
                        <span className="text-[11px] tabular-nums text-silver-600">
                          {countByCategory(c.slug)}
                        </span>
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
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}

export default function CategoryPage() {
  const { slug = '' } = useParams();
  const category = categoryBySlug(slug);
  if (!category) return <Navigate to="/categorias" replace />;

  const items = productsByCategory(category.slug);
  const others = categories.filter((c) => c.slug !== category.slug);

  return (
    <>
      <Seo
        title={`${category.name} | ${site.name}`}
        description={`${category.name} en DYNASTIC: ${category.blurb.toLowerCase()}. Consulta y compra por WhatsApp.`}
        path={`/categoria/${category.slug}`}
      />

      <PageHeader
        eyebrow="Categoría"
        title={category.name}
        lead={category.blurb}
        crumbs={[{ to: '/categorias', label: 'Categorías' }, { label: category.name }]}
      />

      <section className="py-12 sm:py-16">
        <div className="container-x">
          {items.length === 0 ? (
            <div className="card mx-auto max-w-lg p-10 text-center">
              <h2 className="font-display text-lg font-bold text-white">Muy pronto</h2>
              <p className="mt-2 text-[14px] text-silver-400">
                Estamos cargando esta categoría. Escríbenos y te contamos qué tenemos disponible.
              </p>
              <a
                href={waCategory(category.name)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-wa btn-md mt-6"
              >
                <IconWhatsApp className="h-4 w-4" />
                Preguntar por WhatsApp
              </a>
            </div>
          ) : (
            <ul className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
              {items.map((p, i) => (
                <Reveal as="li" key={p.slug} delay={i * 50} className="h-full">
                  <ProductCard product={p} priority={i < 4} />
                </Reveal>
              ))}
            </ul>
          )}

          <div className="mt-20 border-t border-hair pt-14">
            <SectionHead eyebrow="Sigue explorando" title="Otras categorías" to="/categorias" />
            <ul className="no-scrollbar -mx-5 flex gap-2.5 overflow-x-auto px-5 sm:mx-0 sm:flex-wrap sm:px-0">
              {others.map((c) => (
                <li key={c.slug}>
                  <Link
                    to={`/categoria/${c.slug}`}
                    className="chip shrink-0 whitespace-nowrap hover:border-electric/50 hover:text-white"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
