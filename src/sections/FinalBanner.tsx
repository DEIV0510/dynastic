import { Link } from 'react-router-dom';
import { waGeneral } from '../lib/whatsapp';
import { Reveal } from '../components/Primitives';
import { IconArrow, IconWhatsApp } from '../components/Icons';

const MARQUEE = [
  'Tecnología que te conecta',
  'Eleva tu experiencia',
  'Innovación para tu día',
  'Tu próximo gadget está aquí',
];

export default function FinalBanner() {
  return (
    <section className="relative isolate overflow-hidden border-t border-hair bg-ink">
      {/* marquesina de marca */}
      <div className="relative flex overflow-hidden border-b border-hair py-4" aria-hidden>
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

      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="animate-pulseGlow absolute left-1/2 top-1/2 h-[380px] w-[820px] max-w-[150vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-electric/[0.18] blur-[120px]" />
      </div>

      <div className="container-x py-14 text-center sm:py-20">
        <Reveal>
          <h2 className="h-display mx-auto max-w-3xl text-[clamp(2rem,6.4vw,4rem)]">
            Tu próximo gadget <span className="text-silver-sheen">está aquí</span>
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-[15px] leading-relaxed text-silver-400">
            Escríbenos y te ayudamos a elegir. Sin vueltas, sin filas.
          </p>
        </Reveal>

        <Reveal delay={90}>
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
            <Link to="/productos" className="btn-ghost btn-lg w-full sm:w-auto">
              Ver catálogo
              <IconArrow className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
