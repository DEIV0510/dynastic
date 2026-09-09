import Seo, { organizationLd } from '../components/Seo';
import Surface from '../components/Surface';
import PageHeader from '../components/PageHeader';
import Why from '../sections/Why';
import FinalBanner from '../sections/FinalBanner';
import { Reveal } from '../components/Primitives';
import { imgDims, imgSrc, imgSrcSet } from '../lib/img';
import { site } from '../data/site';

const MILESTONES = [
  {
    step: '01',
    title: 'Seleccionamos',
    text: 'Probamos y escogemos producto por producto. Si no lo usaríamos, no entra.',
  },
  {
    step: '02',
    title: 'Asesoramos',
    text: 'Te preguntamos para qué lo quieres y te decimos qué te conviene de verdad.',
  },
  {
    step: '03',
    title: 'Entregamos',
    text: 'Coordinamos tu pedido por WhatsApp y lo enviamos a cualquier parte de Colombia.',
  },
];

export default function About() {
  return (
    <>
      <Seo
        title={`Nosotros | ${site.name}`}
        description="DYNASTIC nace con una visión clara: acercar tecnología, innovación y productos útiles a más personas."
        path="/nosotros"
        jsonLd={organizationLd()}
      />

      <PageHeader
        eyebrow="Nosotros"
        title={
          <>
            Más que tecnología.
            <br />
            <span className="text-silver-sheen">Una visión.</span>
          </>
        }
        lead={site.description}
        crumbs={[{ label: 'Nosotros' }]}
      />

      <Surface tone="light">
        <section id="vision" className="py-14 sm:py-20">
          <div className="container-x">
            <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
              <Reveal>
                <p className="eyebrow">Nuestra visión</p>
                <h2 className="h-display mt-4 text-[clamp(1.8rem,4.8vw,3rem)]">
                  Construida para <span className="text-silver-sheen">crecer</span>
                </h2>
                <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-silver-400">
                  <p>
                    DYNASTIC nace con una visión clara: acercar tecnología, innovación y productos
                    útiles a más personas, construyendo una marca moderna, confiable y preparada
                    para crecer.
                  </p>
                  <p>
                    Operamos desde {site.location}, con venta online y atención directa por
                    WhatsApp. Eso nos permite responder rápido, conseguir lo que buscas y
                    acompañarte antes y después de la compra.
                  </p>
                  <p className="text-silver-200">
                    No competimos sólo por precio. Competimos por marca, experiencia, confianza,
                    diseño y producto.
                  </p>
                </div>
              </Reveal>

              <Reveal delay={90}>
                <div className="relative">
                  <div
                    aria-hidden
                    className="absolute inset-6 rounded-[50%] bg-electric/25 blur-[80px]"
                  />
                  <div className="plate relative overflow-hidden rounded-[28px] border border-hair shadow-plate">
                    <img
                      src={imgSrc('hero-lineup')}
                      srcSet={imgSrcSet('hero-lineup')}
                      sizes="(min-width:1024px) 560px, 92vw"
                      width={imgDims('hero-lineup').width}
                      height={imgDims('hero-lineup').height}
                      alt="Productos seleccionados por DYNASTIC"
                      loading="lazy"
                      decoding="async"
                      className="w-full"
                    />
                  </div>
                </div>
              </Reveal>
            </div>

            <ul className="mt-12 grid gap-4 sm:grid-cols-3">
              {MILESTONES.map((m, i) => (
                <Reveal as="li" key={m.step} delay={i * 70} className="h-full">
                  <div className="card h-full p-6">
                    <span className="font-display text-3xl font-extrabold text-electric/30">
                      {m.step}
                    </span>
                    <h3 className="mt-3 font-display text-[15px] font-bold uppercase tracking-wide text-heading">
                      {m.title}
                    </h3>
                    <p className="mt-2.5 text-[14px] leading-relaxed text-silver-400">{m.text}</p>
                  </div>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>

        <Why />
      </Surface>
      <FinalBanner />
    </>
  );
}
