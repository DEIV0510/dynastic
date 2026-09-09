import { Link } from 'react-router-dom';
import { imgSrc, imgSrcSet, imgDims } from '../lib/img';
import { useParallax } from '../lib/hooks';
import { Reveal } from '../components/Primitives';
import { IconArrow } from '../components/Icons';

export default function Vision() {
  const parallax = useParallax(0.08);

  return (
    <section
      id="vision"
      className="relative isolate overflow-hidden border-t border-hair py-20 sm:py-28"
    >
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
            className="h-full w-full object-cover opacity-[0.16] blur-[2px] [mask-image:linear-gradient(90deg,transparent,#000_35%,#000_65%,transparent)]"
          />
        </div>
        <div className="absolute inset-0 bg-void/70" />
        <div className="absolute left-1/2 top-1/2 h-[420px] w-[760px] max-w-[140vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-electric/[0.16] blur-[120px]" />
      </div>

      <div className="container-x">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <p className="eyebrow">Nuestra visión</p>
            <h2 className="h-display mt-4 text-[clamp(2rem,6vw,3.8rem)]">
              Más que tecnología.
              <br />
              <span className="text-silver-sheen">Una visión.</span>
            </h2>
          </Reveal>

          <Reveal delay={90}>
            <p className="mx-auto mt-7 max-w-xl text-[15px] leading-relaxed text-silver-300 sm:text-base">
              DYNASTIC nace con una visión clara: acercar tecnología, innovación y productos útiles
              a más personas, construyendo una marca moderna, confiable y preparada para crecer.
            </p>
          </Reveal>

          <Reveal delay={160}>
            <Link to="/nosotros" className="btn-ghost btn-lg mt-9">
              Conoce DYNASTIC
              <IconArrow className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
