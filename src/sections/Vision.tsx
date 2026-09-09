import { Link } from 'react-router-dom';
import { imgDims, imgSrc, imgSrcSet } from '../lib/img';
import { useParallax } from '../lib/hooks';
import { waGeneral } from '../lib/whatsapp';
import { Reveal } from '../components/Primitives';
import { IconArrow, IconWhatsApp } from '../components/Icons';

const MARQUEE = [
  'Tecnología que te conecta',
  'Eleva tu experiencia',
  'Innovación para tu día',
  'Tu próximo gadget está aquí',
];

/**
 * Cierre de la home: marca y llamada final en un solo bloque. Antes eran dos
 * secciones centradas seguidas que decían casi lo mismo.
 */
export default function Vision() {
  const parallax = useParallax(0.08);

  return (
    <section id="vision" className="relative isolate overflow-hidden border-t border-hair">
      {/* la composición de producto, tratada como textura de fondo */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div ref={parallax} className="absolute inset-x-0 top-0 h-[130%] will-change-transform">
          <img
            src={imgSrc('hero-lineup')}
            srcSet={imgSrcSet('hero-lineup')}
            sizes="100vw"
            width={imgDims('hero-lineup').width}
            height={imgDims('hero-lineup').height}
            alt=""
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover opacity-[0.14] blur-[2px] [mask-image:linear-gradient(90deg,transparent,#000_35%,#000_65%,transparent)]"
          />
        </div>
        <div className="absolute inset-0 bg-void/75" />
        <div className="animate-pulseGlow absolute left-1/2 top-1/2 h-[420px] w-[760px] max-w-[140vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-electric/[0.16] blur-[120px]" />
      </div>

      {/* marquesina de marca */}
      <div className="relative flex overflow-hidden border-b border-hair py-3.5" aria-hidden>
        <div className="animate-marquee flex shrink-0 items-center gap-8 whitespace-nowrap pr-8">
          {[...MARQUEE, ...MARQUEE, ...MARQUEE, ...MARQUEE].map((t, i) => (
            <span
              key={i}
              className="font-display text-[13px] font-bold uppercase tracking-[0.24em] text-silver-600"
            >
              {t}
              <span className="ml-8 text-electric">◆</span>
            </span>
          ))}
        </div>
      </div>

      <div className="container-x py-16 sm:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <p className="eyebrow">Nuestra visión</p>
            <h2 className="h-display mt-4 text-[clamp(2rem,6vw,3.6rem)]">
              Más que tecnología.
              <br />
              <span className="text-silver-sheen">Una visión.</span>
            </h2>
          </Reveal>

          <Reveal delay={90}>
            <p className="mx-auto mt-6 max-w-xl text-[15px] leading-relaxed text-silver-300 sm:text-base">
              DYNASTIC nace con una visión clara: acercar tecnología, innovación y productos útiles
              a más personas, construyendo una marca moderna, confiable y preparada para crecer.
            </p>
          </Reveal>

          <Reveal delay={160}>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href={waGeneral()}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-wa btn-lg w-full sm:w-auto"
              >
                <IconWhatsApp className="h-4 w-4" />
                Hablar por WhatsApp
              </a>
              <Link to="/nosotros" className="btn-ghost btn-lg w-full sm:w-auto">
                Conoce DYNASTIC
                <IconArrow className="h-4 w-4" />
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
