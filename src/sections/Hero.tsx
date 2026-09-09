import { Link } from 'react-router-dom';
import { imgDims, imgSrc, imgSrcSet } from '../lib/img';
import { useParallax } from '../lib/hooks';
import { IconArrow, IconChat, IconTrend, IconTruck } from '../components/Icons';

export default function Hero() {
  const parallax = useParallax(0.05);

  return (
    <section className="relative isolate overflow-hidden bg-void pb-8 pt-28 sm:pt-32 lg:pb-4 lg:pt-40">
      {/* lienzo */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-grid [background-size:72px_72px] opacity-[0.55] [mask-image:radial-gradient(ellipse_75%_60%_at_50%_35%,#000,transparent_75%)]" />
        <div className="animate-pulseGlow absolute left-1/2 top-[8%] h-[560px] w-[980px] max-w-[150vw] -translate-x-1/2 rounded-full bg-electric/[0.22] blur-[140px] lg:left-[66%]" />
        <div className="absolute left-[12%] top-[42%] h-64 w-64 rounded-full bg-electric-600/20 blur-[100px]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-void to-transparent" />
      </div>

      <div className="container-x">
        {/* Móvil apila mensaje y composición; desde lg van lado a lado. */}
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.12fr)] lg:gap-8 xl:gap-12">
          <div className="text-center lg:text-left">
            <p className="eyebrow animate-[fade-up_.7s_ease-out_both]">
              Tecnología · Estilo · Innovación
            </p>

            <h1 className="h-display mt-5 animate-[fade-up_.8s_ease-out_.06s_both] text-[clamp(2.4rem,8.2vw,4.6rem)] leading-[1.03]">
              Tecnología que <span className="text-silver-sheen">eleva</span> tu estilo
            </h1>

            <p className="mx-auto mt-6 max-w-xl animate-[fade-up_.8s_ease-out_.14s_both] text-[15px] leading-relaxed text-silver-400 sm:text-base lg:mx-0">
              Innovación, diseño y funcionalidad para una vida más conectada.
            </p>

            <div className="mt-9 flex animate-[fade-up_.8s_ease-out_.2s_both] flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start">
              <Link to="/productos" className="btn-primary btn-lg w-full sm:w-auto">
                Descubrir productos
                <IconArrow className="h-4 w-4" />
              </Link>
              <Link to="/ofertas" className="btn-ghost btn-lg w-full sm:w-auto">
                Ver ofertas
              </Link>
            </div>

            <p className="mt-6 inline-flex animate-[fade-up_.8s_ease-out_.26s_both] items-center gap-2 text-[12px] text-silver-500">
              <IconTruck className="h-4 w-4 text-electric-300" />
              Envíos a todo Colombia
            </p>

            {/* franja de conversión */}
            <ul className="mx-auto mt-7 flex max-w-3xl flex-wrap items-center justify-center gap-2.5 sm:gap-3 lg:mx-0 lg:justify-start">
              {[
                { icon: <IconTrend className="h-4 w-4" />, label: 'Compra fácil' },
                { icon: <IconChat className="h-4 w-4" />, label: 'Atención por WhatsApp' },
                { icon: <IconTruck className="h-4 w-4" />, label: 'Preventa disponible' },
              ].map((c) => (
                <li key={c.label} className="chip text-silver-200">
                  <span className="text-electric-300">{c.icon}</span>
                  {c.label}
                </li>
              ))}
            </ul>
          </div>

          {/* composición de producto */}
          <div ref={parallax} className="relative will-change-transform lg:-mr-6 xl:-mr-12">
            <div
              aria-hidden
              className="absolute inset-x-[8%] bottom-[6%] top-[14%] rounded-[50%] bg-electric/25 blur-[90px]"
            />
            <div className="animate-float [animation-duration:9s]">
              <img
                src={imgSrc('hero-lineup')}
                srcSet={imgSrcSet('hero-lineup')}
                sizes="(min-width:1280px) 740px, (min-width:1024px) 56vw, 100vw"
                width={imgDims('hero-lineup').width}
                height={imgDims('hero-lineup').height}
                alt="Selección de productos DYNASTIC: audífonos, parlante, smartwatch, reloj, proyector, powerbank, cámara, cargador y termo"
                className="relative w-full select-none"
                fetchPriority="high"
                decoding="async"
                draggable={false}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
